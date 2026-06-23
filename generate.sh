#!/usr/bin/env bash
#
# generate.sh — GitHub에서 본인 저장소를 긁어 data.js 를 새로 굽는다.
#
#   - 본인 소유의, 포크가 아닌 저장소를 가져온다 (토큰 권한이 닿는 만큼 비공개도 포함).
#   - 별/데모/설명이 있거나 커밋이 일정 수 이상인 것만 남겨, 빈 껍데기는 버린다.
#     비공개 저장소는 이 컷을 건너뛰고 커밋만 충분하면 함께 싣는다.
#   - 비공개 저장소는 url 을 비워, 공개 페이지에 깃헙(소스) 링크를 노출하지 않는다.
#     대표 링크(homepage)는 그대로 싣는다.
#   - INCLUDE 에 적은 조직 저장소를 따로 더한다.
#   - OVERRIDES 로 설명이나 데모 주소를 손수 덧씌운다 (저장소 설정은 건드리지 않음).
#
# 필요한 것: gh (로그인된 상태), jq.
#   로컬에서 돌릴 땐 한 번 `gh auth login` 해두면 됩니다.
#   GitHub Actions 안에서는 토큰이 자동으로 주어집니다. 비공개까지 끌어오려면
#   repo 스코프 PAT 를 저장소 시크릿(REPOS_TOKEN)에 넣어야 합니다 (없으면 공개만).
#
set -euo pipefail

# ── 여기만 본인에 맞게 고치세요 ───────────────────────────────────────
USER="${1:-eeruwang}"     # ← 본인 GitHub 핸들
MINCOMMITS=2                  # 이보다 커밋이 적은 사소한 저장소는 버림

# 포트폴리오에서 숨길 저장소. 이름을 코드에 남기지 않으려고 런타임 환경변수로만 받는다.
# 워크플로가 저장소 시크릿(PORTFOLIO_EXCLUDE)을 EXCLUDE 로 넘긴다.
# 로컬에서 돌릴 땐 EXCLUDE="repo-a repo-b" ./generate.sh <핸들> 처럼 쓰면 된다.
EXCLUDE_RAW="${EXCLUDE:-}"

# 직접 만든 조직 저장소 (owner/name). 없으면 비워두세요.
INCLUDE=(
  # "428lab/some-repo"
)

# 설명이 비어 있는 저장소에 손수 채워 넣을 값들.
# GitHub의 About을 안 건드리고 포트폴리오에만 덧씌웁니다.
OVERRIDES='{
  "ducks-constellation": {
    "description": "책을 함께 읽는 사람들을 위한 ActivityPub 독서 모임 플랫폼. Cloudflare Workers 위에서 페디버스와 연합한다."
  }
}'
# ─────────────────────────────────────────────────────────────────────

echo "Fetching repos for $USER ..."
gh api graphql -f query='
query($cursor: String, $login: String!) {
  user(login: $login) {
    repositories(first: 100, after: $cursor, ownerAffiliations: OWNER, isFork: false, orderBy: {field: CREATED_AT, direction: DESC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name description createdAt stargazerCount url homepageUrl isArchived isPrivate
        primaryLanguage { name }
        defaultBranchRef { target { ... on Commit { history { totalCount } } } }
      }
    }
  }
}' -F login="$USER" --paginate --slurp \
| jq --argjson min "$MINCOMMITS" '[.[].data.user.repositories.nodes[]]
    | map({
        name, description,
        date: .createdAt[0:10],
        stars: .stargazerCount,
        commits: (.defaultBranchRef.target.history.totalCount // 0),
        lang: (.primaryLanguage.name // null),
        private: (.isPrivate // false),
        url: (if .isPrivate then null else .url end),
        live: (if (.homepageUrl // "") != "" then .homepageUrl else null end)
      })
    | map(select(.private or .stars>0 or .live!=null or (.description // "")!="" or .commits>=15))
    | map(select(.commits > $min or .live != null))' \
> /tmp/_own.json
echo "  own (commits>$MINCOMMITS): $(jq length /tmp/_own.json)"

echo "Fetching ${#INCLUDE[@]} included org repos ..."
rm -f /tmp/_org_lines.json
for full in ${INCLUDE[@]+"${INCLUDE[@]}"}; do
  owner="${full%%/*}"; name="${full##*/}"
  gh api graphql -F owner="$owner" -F name="$name" -f query='
  query($owner:String!, $name:String!){
    repository(owner:$owner, name:$name){
      name description createdAt stargazerCount url homepageUrl
      primaryLanguage{name}
      defaultBranchRef{ target{ ... on Commit{ history{ totalCount } } } }
    }
  }' \
  | jq --arg full "$full" '.data.repository | {
        name: $full,
        description,
        date: .createdAt[0:10],
        stars: .stargazerCount,
        commits: (.defaultBranchRef.target.history.totalCount // 0),
        lang: (.primaryLanguage.name // null),
        private: false,
        url,
        live: (if (.homepageUrl // "") != "" then .homepageUrl else null end)
      }' >> /tmp/_org_lines.json
done
if [ -f /tmp/_org_lines.json ]; then jq -s '.' /tmp/_org_lines.json > /tmp/_org.json; else echo '[]' > /tmp/_org.json; fi

# 숨길 목록을 JSON 배열로 만든다 (쉼표/공백 모두 허용, 비어 있으면 []).
# 이름은 코드에도, 로그에도 남기지 않는다 — 개수만 찍는다.
EXCLUDE_JSON=$(printf '%s\n' ${EXCLUDE_RAW//,/ } | jq -R . | jq -s 'map(select(length>0))')
echo "Hiding $(echo "$EXCLUDE_JSON" | jq 'length') repo(s) from the portfolio."

jq -s --argjson ov "$OVERRIDES" --argjson ex "$EXCLUDE_JSON" '
    ($ex | map(ascii_downcase)) as $exl
    | (.[0] + .[1])
    | map(select(
        ([(.name|ascii_downcase), (.name|split("/")|last|ascii_downcase)]
          | any(. as $n | $exl | index($n))) | not))
    | map(. as $r | ($ov[$r.name] // {}) as $o
          | $r + {
              description: (if ($o.description // "") != "" then $o.description else $r.description end),
              live: ($o.live // $r.live)
            })
    | sort_by(.date) | reverse' /tmp/_own.json /tmp/_org.json > /tmp/_all.json

{ printf "window.REPOS = "; cat /tmp/_all.json; printf ";\n"; } > data.js
echo "Wrote data.js with $(jq length /tmp/_all.json) repos."

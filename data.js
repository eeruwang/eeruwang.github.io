/*
 * data.js — 여기만 고치면 사이트 내용이 바뀝니다.
 *
 * 페이지는 이 배열을 위에서 아래로 '그대로' 그립니다. 정렬을 하지 않으니
 * 반드시 최신 -> 과거 순으로 둬야 해요. 연도가 바뀌는 지점마다 구분선은
 * 자동으로 들어갑니다.
 *
 * 카드 하나 = 객체 하나
 *   name         "repo" 또는 "owner/repo" (슬래시 앞은 작은 조직 배지로 표시)
 *   description  설명 문자열, 비우려면 null
 *   date         "YYYY-MM-DD"  (화면엔 "YYYY.MM"으로 표시, 연도 묶음의 기준)
 *   stars        숫자 — 0이면 숨김, 1 이상이면 ★ 와 함께
 *   commits      숫자 — 항상 표시
 *   lang         언어명 — 색 점 + 그 행의 강조색
 *   url          제목에 거는 링크
 *   live         데모 주소, 없으면 null
 *
 * ────────────────────────────────────────────────────────────────────
 *  ⚠ 채워 넣어야 하는 값들. 아래는 Moon의 작업으로 씨를 뿌려둔 초안입니다.
 *    - 이름 / 설명 / lang : 제가 아는 범위에서 적었어요. 틀린 곳은 고쳐주세요.
 *    - date / commits / url : 전부 자리표시자예요. 실제 값으로 바꿔야 합니다.
 *      (날짜는 연도 묶음 순서만 맞춰둔 어림값이에요.)
 *    - stars : 개인 프로젝트라 0으로 뒀습니다. 0은 화면에서 자동으로 숨겨져요.
 *    - live : 아는 것만 채웠고 나머지는 null 입니다.
 *
 *  ↪ 손으로 채우는 대신 GitHub에서 자동으로 긁어오고 싶으면 말해주세요.
 *    generate.sh 를 Moon 계정에 맞춰 만들어 드릴게요. 그러면 이 파일이
 *    날짜·커밋·별까지 진짜 값으로 구워집니다.
 * ────────────────────────────────────────────────────────────────────
 */
window.REPOS = [
  {
    name: "오리들의-별자리",
    description: "책을 함께 읽는 사람들을 위한 ActivityPub 독서 모임 플랫폼. Cloudflare Workers 위에서 페디버스와 연합한다.",
    date: "2026-05-01",          // TODO 실제 날짜
    stars: 0,
    commits: 1,                  // TODO 실제 커밋 수
    lang: "TypeScript",
    url: "https://github.com/YOUR-GITHUB/ducks-constellation",  // TODO
    live: null
  },
  {
    name: "at-moment",
    description: "Craft의 하루 노트와 이어지는 작은 마이크로 다이어리. 한 순간을 적으면 그 자리에 남는다.",
    date: "2026-03-01",          // TODO 실제 날짜
    stars: 0,
    commits: 1,                  // TODO 실제 커밋 수
    lang: "TypeScript",          // TODO 스택 확인
    url: "https://github.com/YOUR-GITHUB/at-moment",            // TODO
    live: null
  },
  {
    name: "eeruwang/byongari",
    description: "Hetzner 헬싱키에 띄운 CherryPick 페디버스 인스턴스. SSH를 단단히 잠그고 R2로 오프사이트 백업을 돌린다.",
    date: "2026-01-01",          // TODO 실제 날짜
    stars: 0,
    commits: 1,                  // TODO 실제 커밋 수 (포크/배포라면 비워도 됨)
    lang: "TypeScript",
    url: "https://github.com/YOUR-GITHUB",                      // TODO
    live: null
  },
  {
    name: "essay.eeruwang.me",
    description: "Railway에 올린 Hollo 포크. 단일 사용자 ActivityPub 서버에 Beszel 모니터링을 붙였다.",
    date: "2025-11-01",          // TODO 실제 날짜
    stars: 0,
    commits: 1,                  // TODO 실제 커밋 수
    lang: "TypeScript",
    url: "https://github.com/YOUR-GITHUB",                      // TODO
    live: "https://essay.eeruwang.me"
  },
  {
    name: "moonilsun.com",
    description: "스크롤을 따라 후광이 번지는 네임카드 사이트. Next.js, 다국어 토글, 날씨 API, 어둠과 빛 두 결.",
    date: "2025-08-01",          // TODO 실제 날짜
    stars: 0,
    commits: 1,                  // TODO 실제 커밋 수
    lang: "TypeScript",
    url: "https://github.com/YOUR-GITHUB/moonilsun",            // TODO
    live: "https://moonilsun.com"
  },
  {
    name: "philosopher-bot",
    description: "Ghost 블로그에 사는 n8n 철학자 봇. Mastodon과 이어져 불러내면 답을 짓는다.",
    date: "2025-04-01",          // TODO 실제 날짜
    stars: 0,
    commits: 1,                  // TODO 실제 커밋 수
    lang: "JavaScript",          // TODO 스택 확인 (n8n 워크플로)
    url: "https://github.com/YOUR-GITHUB",                      // TODO
    live: null
  },
  {
    name: "docker-backup",
    description: "자체 호스팅 Docker 스택을 위한 백업 스크립트. 멈추고, 무결성을 확인하고, rclone으로 오프사이트까지 옮긴다.",
    date: "2025-01-01",          // TODO 실제 날짜
    stars: 0,
    commits: 1,                  // TODO 실제 커밋 수
    lang: "Shell",
    url: "https://github.com/YOUR-GITHUB",                      // TODO
    live: null
  }
];

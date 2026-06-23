# 핸드오프 — Claude Code가 할 일

전제. 자동 생성 경로로 간다. data.js 는 Actions가 굽고, 손글씨 초안은 첫 실행에서
실제 저장소 목록으로 덮어써진다. 그게 의도된 동작이다.

## 먼저 받아야 할 세 가지
1. GitHub 핸들
2. 대상 저장소 이름 (루트로 띄울 거면 `<핸들>.github.io`)
3. 저장소가 없지만 보여주고 싶은 작업이 있다면 그 목록

## 순서
1. 핸들을 박는다.
   - index.html 의 YOUR-GITHUB 두 곳 (상단 gh-link, 푸터 foot-src)
   - generate.sh 의 USER 기본값. Actions가 자동으로 넘기므로 비워둬도 되지만 로컬 실행 편의상 채워도 된다

2. 저장소를 만들고 올린다.
   - 예) `gh repo create <핸들>.github.io --public --source . --remote origin --push`

3. Pages를 켠다.
   - Settings > Pages 에서 source 를 main 브랜치 루트로
   - 또는 `gh api -X POST repos/<핸들>/<repo>/pages -f "source[branch]=main" -f "source[path]=/"`

4. 데이터를 한 번 굽는다.
   - Actions 탭에서 build data.js 워크플로의 Run workflow
   - 또는 로컬에서 `gh auth login` 뒤 `./generate.sh <핸들>`

5. 확인한다.
   - 배포된 페이지에서 타임라인이 실제 저장소로 채워졌는지
   - 폰트, 테마 토글, Live 링크, sticky 연도가 동작하는지
   - 커밋 수가 0으로 뜨는 저장소가 있으면 기본 브랜치 이름을 확인한다

6. (선택) 큐레이션
   - About이 빈 저장소 설명은 generate.sh 의 OVERRIDES 에
   - 보여줄 조직 저장소는 INCLUDE 에 `owner/name` 으로

## 짚어둘 것
- 공개 저장소만 잡힌다. 비공개까지 끌어오려면 repo 스코프 PAT를 저장소 secret으로 넣고
  워크플로의 GH_TOKEN 을 `${{ secrets.그_이름 }}` 으로 바꿔야 한다
- 공개만 비추는 지금 구성은 Actions의 기본 토큰만으로 충분하다. 따로 넣을 secret이 없다

# CLAUDE.md — eeruwang 타임라인 포트폴리오

## 이게 무엇인가
공개 GitHub 저장소를 최신순으로 늘어놓는 한 페이지짜리 정적 사이트.
프레임워크도 빌드 단계도 없는 순수 HTML/CSS/JS. GitHub Pages에 그대로 올라간다.

## 의도된 선택 (되돌리지 말 것)
- 빌드 도구, 번들러, 프레임워크를 들이지 않는다. 바닐라로 둔다.
- 사용자 데이터는 app.js에서 textContent로만 꽂는다. innerHTML은 쓰지 않는다.
- 외부 링크에는 rel="noopener" target="_blank"를 유지한다.
- data.js는 손으로 고치지 않는다. generate.sh 와 Actions가 덮어쓴다.
  내용을 다듬을 일이 있으면 generate.sh 의 OVERRIDES 와 INCLUDE 에서 한다.

## 파일이 하는 일
- index.html  문서 골격, 프리페인트 테마 스크립트, 마스트헤드, 타임라인 마운트, 푸터
- style.css   전체 스타일. 크레용 토큰, 타입, 타임라인 그리드, sticky 연도, hover wash, reveal, 반응형
- app.js      window.REPOS 를 읽어 렌더. 언어색 맵, 통계, 연도 묶음, reveal 옵저버, 테마 토글
- data.js     window.REPOS 데이터. generate.sh 가 굽는다
- generate.sh GitHub GraphQL로 공개 저장소를 긁어 data.js 를 만든다 (gh, jq 필요)
- .github/workflows/build-data.yml  매일과 수동 트리거로 generate.sh 를 돌려 data.js 를 되커밋
- .nojekyll   Pages의 Jekyll 처리를 끈다

## 데이터 모델 (카드 하나 = 객체 하나)
name, description, date(YYYY-MM-DD), stars, commits, lang, url, live
- name 이 "owner/repo" 꼴이면 슬래시 앞이 작은 조직 배지로 나온다
- stars 는 0이면 숨고, commits 는 항상 보이며, live 는 null이면 숨는다
- 배열은 최신이 위. 뷰는 정렬하지 않는다

## 카피 규칙
- 한국어가 먼저. 영어 산문은 영국식이며 엠대쉬와 콜론을 피한다
- 히어로의 이름 표기 이루왕 / eeruwang 는 그대로 둔다

## Moon만 아는 값 (핸드오버 전에 채울 것)
- GitHub 핸들. 지금 index.html 두 곳과 generate.sh 한 곳에 YOUR-GITHUB 로 비어 있다
- 대상 저장소. 루트로 띄울 새 `<핸들>.github.io` 인지, 기존 저장소인지
- 저장소가 없는 작업 중 꼭 보여줄 것. generate.sh 의 OVERRIDES 또는 INCLUDE 로 고정한다

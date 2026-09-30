# webpro.first-ksj

## 2주차: 캠퍼스 내에서 나의 발자취가 가장 많이 담긴 곳 소개
 - 선정한 3곳의 장소에 대한 소개와 의미 있는 이유, 장소 정보 소개
 
 ## 3주차: 
- 프론트페이지: 정돈되고 차분한 분위기 / 적용한 class: `page-front`
  / 적용한 CSS:
  - 회색과 청회색 배경을 사용했다.
  - `.page-front .panel`의 폭을 제한해 내용을 가운데에 정돈했다.
  - 장소 목록에 일정한 여백을 주어 읽기 쉽게 만들었다.

- 장소 1 트러스트짐: 정열적이고 힘 있는 분위기 / 적용한 class: `page-gym`
  / 적용한 CSS:
  - 빨간색과 주황색을 사용해 운동의 에너지를 표현했다.
  - 굵은 글꼴을 사용해 강한 느낌을 만들었다.
  - `.page-gym .panel`에 굵고 각진 테두리를 적용했다.
  - `.page-gym .action`을 각진 버튼으로 만들어 전체적으로 절제된 열정적인 분위기를 표현했다.

- 장소 2 좋아하는 길: 숲속의 파릇파릇한 분위기 / 적용한 class: `page-road`
  / 적용한 CSS:
  - 연한 초록색과 숲색을 사용했다.
  - `.page-road .panel`에 초록색 점선 테두리와 비대칭 모서리를 적용했다.
  - `.page-road img`의 모서리도 비대칭으로 만들어 자연스러운 느낌을 더했다.

- 장소 3 꼬밥: 따뜻하고 정겨운 분위기 / 적용한 class: `page-store`
  / 적용한 CSS:
  - 베이지색과 주황색을 사용해 따뜻한 느낌을 표현했다.
  - `.page-store .panel`의 테두리를 두껍고 둥글게 만들었다.
  - `.page-store .action`의 모서리를 둥글게 만들어 친근한 버튼으로 만들었다.

각 페이지의 HTML에는 다음과 같이 class를 적용했다.
<body class="page-front">
<body class="page-store">
<body class="page-road">
<body class="page-gym">

### 4주차
- 장소 탐험 페이지: https://본인아이디.github.io/저장소/week4/
- 통계 페이지: https://본인아이디.github.io/저장소/week4/statistics.html
- 게임 페이지: https://본인아이디.github.io/저장소/week4/game.html

### 실습 1
- 내가 수정한 부분: `places` 배열에 세 장소의 이름과 지도 검색어·주소를 두고, 세 장소 소개는 각각 HTML section에 작성. CSS에는 장소별 색상과 화면 간격을 적용.
- 버튼 클릭 → 내용 변경 → 지도 변경의 흐름: js에서 addEventListener("click", )으로 클릭을 하면, showPlace(place)를 실행하고, panel.hidden을 통해 선택한 장소 외에는 숨김처리를 함으로써 선택한 장소만 표시한다. 이어서 map.src와 지도 제목을 선택한 장소의 정보로 바꾼다.
- 휴대전화에서 확인한 결과: 화면에 잘 보이고, 전환 용이


### 실습 3
- 캠퍼스 클릭 / 에임랩과 유사한 게임이지만 점을 캠퍼스 내 사진으로 크기를 크게 함 / 조작과 규칙: 60초 동안 나타나는 사진을 클릭
- Copilot에게 보낸 첫 질문: 캠퍼스 사진으로 에임랩과 유사한 게임을 제작해줘
- 추가 수정 요청과 개선한 점: 다시시작 버튼 추가와 제한시간, 랜덤하게 사진이 나타나는 시간 개선
- 직접 확인한 동작: 조작 / 점수 / 종료 / 재시작
- 휴대전화에서 확인한 결과: 휴대전화가 더 플레이하기 쉬움


### 모바일 스타일
- 적용한 `@media` 조건: `@media (max-width: 600px)`
- 모바일에서 특별히 바꾼 부분과 이유:
  - `.page`의 좌우 여백과 위아래 여백을 줄여 작은 화면에 맞췄다.
  - `.panel`의 안쪽 여백을 줄여 본문이 너무 좁아지지 않게 했다.
  - `.action`을 한 줄 전체 버튼으로 바꾸고 가운데 정렬해 터치하기 쉽게 했다.

### 출처
- 본문 글꼴: 구글 폰트를 통해 설치한 `"Noto Sans KR"`과,
  `"Malgun Gothic"`, `Georgia`, `"Batang"`, `"Arial Black"`을 사용했다.
- 구글 폰트 링크 : [text](https://fonts.google.com/noto/specimen/Noto+Sans+KR?preview.script=Kore&preview.lang=ko_Kore)
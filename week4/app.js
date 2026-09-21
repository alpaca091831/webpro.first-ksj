// 장소 세 곳의 정보를 객체로 만들고 배열에 담습니다.
const places = [
    {
        id: "gym",
        name: "건강을 책임지는 헬스장",
        query: "가톨릭대학교 성심교정 트러스트짐",
        embed: "https://maps.google.com/maps?q=%EA%B0%80%ED%86%A8%EB%A6%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EC%84%B1%EC%8B%AC%EA%B5%90%EC%A0%95%20%ED%8A%B8%EB%9F%AC%EC%8A%A4%ED%8A%B8%EC%A7%90&output=embed"
    },
    {
        id: "road",
        name: "좋아하는 길",
        query: "가톨릭대학교 성심교정 비르투스관",
        embed: "https://maps.google.com/maps?q=%EA%B0%80%ED%86%A8%EB%A6%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EC%84%B1%EC%8B%AC%EA%B5%90%EC%A0%95%20%EB%B9%84%EB%A5%B4%ED%88%AC%EC%8A%A4%EA%B4%80&output=embed"
    },
    {
        id: "store",
        name: "자주가는 가게 꼬밥",
        query: "꼬밥 가톨릭대학교",
        embed: "https://maps.google.com/maps?q=%EA%BC%AC%EB%B0%A5%20%EA%B0%80%ED%86%A8%EB%A6%AD%EB%8C%80%ED%95%99%EA%B5%90&output=embed"
    }
];
// HTML에서 JavaScript가 사용할 요소를 찾습니다.
const buttons = document.querySelector("#buttons");
const panels = document.querySelectorAll(".place-panel");
const map = document.querySelector("#map");
const mapTitle = document.querySelector("#map-title");
const mapLink = document.querySelector("#map-link");
// 선택한 장소의 설명과 지도를 화면에 표시하는 함수입니다.
function showPlace(place) {
  // 모든 장소를 하나씩 확인합니다.
    for (const panel of panels) {
    // 선택한 장소와 같은 id를 가진 section만 보이게 합니다.
        panel.hidden = panel.id !== place.id;
    }
  // 선택한 장소의 이름을 버튼 상태에 저장합니다.
    for (const button of buttons.querySelectorAll("button")) {
        const isSelected = button.dataset.place === place.id;
        button.setAttribute("aria-pressed", String(isSelected));
    }
  // 장소 데이터에 저장한 Google 지도 embed 주소로 지도를 바꿉니다.
    const encodedQuery = encodeURIComponent(place.query);
    map.src = place.embed;
    map.title = place.name + " Google 지도";
    mapTitle.textContent = place.name + " 위치";
    mapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodedQuery;
}
// 장소 배열을 반복하면서 버튼을 하나씩 만듭니다.
for (const place of places) {
    const button = document.createElement("button");
    // 버튼에 장소 이름을 글자로 넣습니다.
    button.type = "button";
    button.textContent = place.name;
    // 나중에 클릭한 장소를 찾을 수 있도록 data-place 값을 넣습니다.
    button.dataset.place = place.id;
    button.setAttribute("aria-pressed", "false");
    // 버튼을 클릭하면 해당 장소를 화면에 표시합니다.
    button.addEventListener("click", function () {
        showPlace(place);
    });
    // 완성한 버튼을 nav 안에 추가합니다.
    buttons.append(button);
}
// 처음 접속했을 때 첫 번째 장소가 보이도록 합니다.
showPlace(places[0]);
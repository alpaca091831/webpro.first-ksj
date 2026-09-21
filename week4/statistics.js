const csvPath = "data/sports.csv";
const ageRows = [];
let years = [];
const ageLabels = ["10대", "20대", "30대", "40대", "50대", "60대", "70세 이상"];
const chartColors = ["#e76f51", "#f4a261", "#e9c46a", "#2a9d8f", "#457b9d", "#6a4c93", "#264653"];
let trendChart;
let comparisonChart;
const statusMessage = document.querySelector("#status");
const panels = {
  trend: document.querySelector("#trend-panel"),
  comparison: document.querySelector("#comparison-panel")
};
function makeNumber(value) {
  const number = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(number) ? number : null;
}
function readAgeRows(results) {
  return results.data.filter((row) => {
    return row["통계분류(1)"] === "연령별" && ageLabels.includes(row["통계분류(2)"]);
  });
}
function createTrendChart() {
  const datasets = ageRows.map((row, index) => ({
    label: row["통계분류(2)"],
    data: years.map((year) => makeNumber(row[year])),
    borderColor: chartColors[index],
    backgroundColor: chartColors[index],
    tension: 0.2,
    spanGaps: false
  }));
  trendChart = new Chart(document.querySelector("#trend-chart"), {
    type: "line",
    data: { labels: years, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "연도" } },
        y: {
          beginAtZero: true,
          title: { display: true, text: "참여율 (원자료 단위 확인 필요)" }
        }
      },
      plugins: {
        legend: { position: "bottom" },
        tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}` } }
      }
    }
  });
}
function createComparisonChart() {
  const datasets = years.map((year, yearIndex) => ({
    label: year,
    data: ageRows.map((row) => makeNumber(row[year])),
    backgroundColor: ["#457b9d", "#2a9d8f", "#e9c46a"][yearIndex]
  }));
  comparisonChart = new Chart(document.querySelector("#comparison-chart"), {
    type: "bar",
    data: { labels: ageLabels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "연령대" } },
        y: {
          beginAtZero: true,
          title: { display: true, text: "참여율 (원자료 단위 확인 필요)" }
        }
      },
      plugins: {
        legend: { position: "bottom" },
        tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}` } }
      }
    }
  });
}
function showChart(chartName) {
  Object.entries(panels).forEach(([name, panel]) => {
    panel.hidden = name !== chartName;
  });
  document.querySelectorAll("[data-chart]").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.chart === chartName));
  });
}
function start() {
  Papa.parse(csvPath, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete(results) {
      years = results.meta.fields.filter((field) => /^\d{4}$/.test(field));
      ageRows.push(...readAgeRows(results));
      if (ageRows.length !== ageLabels.length) {
        statusMessage.textContent = "CSV에서 예상한 연령별 행을 모두 찾지 못했습니다. 열 이름과 분류값을 확인하세요.";
        return;
      }
      createTrendChart();
      createComparisonChart();
      statusMessage.textContent = "CSV를 읽었습니다. 탭을 눌러 두 그래프를 비교해 보세요.";
    },
    error(error) {
      statusMessage.textContent = `CSV를 읽지 못했습니다: ${error.message}`;
    }
  });
}
document.querySelectorAll("[data-chart]").forEach((button) => {
  button.addEventListener("click", () => showChart(button.dataset.chart));
});
start();
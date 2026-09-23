const csvPath = "data/sports.csv";
const ageRows = [];
let years = [];
const ageLabels = ["10대", "20대", "30대", "40대", "50대", "60대", "70세 이상"];
const chartColors = ["#e76f51", "#f4a261", "#e9c46a", "#2a9d8f", "#457b9d", "#6a4c93", "#264653"];
const yearColors = ["#457b9d", "#2a9d8f", "#e9c46a", "#e76f51", "#6a4c93", "#264653"];
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
  return results.filter((row) => {
    return row["통계분류(1)"] === "연령별" && ageLabels.includes(row["통계분류(2)"]);
  });
}
function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];
    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }
  if (value || row.length > 0) {
    row.push(value);
    rows.push(row);
  }
  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, ""));
  return rows
    .filter((values) => values.length === headers.length)
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]])));
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
    type: "bar",
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
    backgroundColor: yearColors[yearIndex % yearColors.length]
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
async function start() {
  try {
    if (window.location.protocol === "file:") {
      throw new Error("HTML을 파일로 직접 열 수 없습니다. Live Server나 GitHub Pages에서 열어 주세요.");
    }
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`CSV 요청 실패 (${response.status})`);
    }
    const rows = parseCsv(await response.text());
    years = Object.keys(rows[0]).filter((field) => /^\d{4}$/.test(field) && Number(field) >= 2022);
    ageRows.push(...readAgeRows(rows));
    if (years.length === 0) {
      throw new Error("연도 열을 찾지 못했습니다.");
    }
    if (ageRows.length !== ageLabels.length) {
      throw new Error("예상한 연령별 행을 모두 찾지 못했습니다.");
    }
    createTrendChart();
    createComparisonChart();
    statusMessage.textContent = "CSV를 읽었습니다. 탭을 눌러 두 그래프를 비교해 보세요.";
  } catch (error) {
    statusMessage.textContent = `통계 자료를 읽지 못했습니다: ${error.message}`;
  }
}
document.querySelectorAll("[data-chart]").forEach((button) => {
  button.addEventListener("click", () => showChart(button.dataset.chart));
});
start();
const csvPath = "./data/sports.csv";
let years = [];
const ageLabels = ["10대", "20대", "30대", "40대", "50대", "60대", "70세 이상"];
const chartColors = ["#e76f51", "#f4a261", "#e9c46a", "#2a9d8f", "#457b9d", "#6a4c93", "#264653"];
const yearColors = ["#457b9d", "#2a9d8f", "#e9c46a", "#e76f51", "#6a4c93", "#264653"];
const charts = {
  trend: null,
  comparison: null
};

const statusMessage = document.querySelector("#status");
const panels = {
  trend: document.querySelector("#trend-panel"),
  comparison: document.querySelector("#comparison-panel")
};
const buttons = document.querySelectorAll("[data-chart]");

function makeNumber(value) {
  const number = Number(String(value).trim());
  return Number.isFinite(number) ? number : null;
}

function drawCharts(ageRows) {
  const datasets = ageRows.map((row, index) => ({
    label: row["통계분류(2)"],
    data: years.map((year) => makeNumber(row[year])),
    borderColor: chartColors[index],
    backgroundColor: chartColors[index],
    tension: 0.2,
    spanGaps: false
  }));

  charts.trend = new Chart(document.querySelector("#trend-chart"), {
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

  const comparisonDatasets = years.map((year, yearIndex) => ({
    label: year,
    data: ageRows.map((row) => makeNumber(row[year])),
    backgroundColor: yearColors[yearIndex % yearColors.length]
  }));

  charts.comparison = new Chart(document.querySelector("#comparison-chart"), {
    type: "bar",
    data: { labels: ageLabels, datasets: comparisonDatasets },
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

function showPanel(id) {
  Object.entries(panels).forEach(([name, panel]) => {
    panel.hidden = panel.id !== `${id}-panel`;
  });

  for (const button of buttons) {
    button.setAttribute("aria-selected", String(button.dataset.chart === id));
  }

  requestAnimationFrame(function () {
    if (charts[id]) {
      charts[id].resize();
    }
  });
}

function loadCsv() {
  if (window.location.protocol === "file:") {
    statusMessage.textContent = "CSV를 읽으려면 Live Server나 GitHub Pages에서 페이지를 여세요.";
    return;
  }

  if (typeof Papa === "undefined") {
    statusMessage.textContent = "Papa Parse를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침하세요.";
    return;
  }

  if (typeof Chart === "undefined") {
    statusMessage.textContent = "Chart.js를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침하세요.";
    return;
  }

  Papa.parse(csvPath, {
    download: true,
    header: true,
    skipEmptyLines: "greedy",
    complete: function (results) {
      const fields = results.meta.fields || [];
      const required = ["통계분류(1)", "통계분류(2)"];
      years = fields.filter((field) => /^\d{4}$/.test(field) && Number(field) >= 2022);

      if (
        results.errors.length > 0 ||
        !required.every((name) => fields.includes(name)) ||
        years.length === 0
      ) {
        statusMessage.textContent = "CSV 형식과 열 이름을 확인하세요.";
        return;
      }

      const ageRows = results.data.filter(function (row) {
        const isExpectedAge = row["통계분류(1)"].trim() === "연령별"
          && ageLabels.includes(row["통계분류(2)"].trim());
        const hasAllNumbers = years.every(function (year) {
          return row[year].trim() !== "" && makeNumber(row[year]) !== null;
        });
        return isExpectedAge && hasAllNumbers;
      });

      const hasAllAgeGroups = ageLabels.every(function (label) {
        return ageRows.some((row) => row["통계분류(2)"].trim() === label);
      });

      if (!hasAllAgeGroups) {
        statusMessage.textContent = "연령별 데이터가 일부 없거나 숫자 형식이 잘못되었습니다. CSV를 확인하세요.";
        return;
      }

      drawCharts(ageRows);
      showPanel("trend");
      statusMessage.textContent =
        "연령별 " + ageRows.length + "개 집단 표시 / 다른 분류 등 "
        + (results.data.length - ageRows.length) + "행 제외";
    },
    error: function () {
      statusMessage.textContent = "CSV 경로와 네트워크를 확인하세요.";
    }
  });
}

for (const button of buttons) {
  button.addEventListener("click", function () {
    showPanel(button.dataset.chart);
  });
}

loadCsv();

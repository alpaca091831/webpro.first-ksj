const sportsCsvPath = "./data/sports.csv";
const facilitiesCsvPath = "./data/facilitys.csv";
let years = [];
const ageLabels = ["10대", "20대", "30대", "40대", "50대", "60대", "70세 이상"];
const chartColors = ["#e76f51", "#f4a261", "#e9c46a", "#2a9d8f", "#457b9d", "#6a4c93", "#264653"];
const facilityLabels = ["성당", "교회", "불교", "기타"];
const charts = {
  sports: null,
  facilities: null
};
const loadStatus = {
  sports: "불러오는 중",
  facilities: "불러오는 중"
};

const statusMessage = document.querySelector("#status");
const panels = {
  sports: document.querySelector("#sports-panel"),
  facilities: document.querySelector("#facilities-panel")
};
const buttons = document.querySelectorAll("[data-chart]");

function makeNumber(value) {
  const number = Number(String(value).trim());
  return Number.isFinite(number) ? number : null;
}

function updateStatus() {
  statusMessage.textContent =
    "생활체육: " + loadStatus.sports + " · 종교시설: " + loadStatus.facilities;
}

function drawSportsChart(ageRows) {
  const datasets = ageRows.map((row, index) => ({
    label: row["통계분류(2)"],
    data: years.map((year) => makeNumber(row[year])),
    borderColor: chartColors[index],
    backgroundColor: chartColors[index],
    tension: 0.2,
    spanGaps: false
  }));

  charts.sports = new Chart(document.querySelector("#sports-chart"), {
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

function drawFacilitiesChart(counts) {
  charts.facilities = new Chart(document.querySelector("#facilities-chart"), {
    type: "doughnut",
    data: {
      labels: facilityLabels,
      datasets: [{
        label: "시설 수",
        data: facilityLabels.map((label) => counts[label]),
        backgroundColor: ["#7b5ea7", "#c76d45", "#557c55", "#8a9299"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}곳` } }
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

function loadSportsCsv() {
  if (window.location.protocol === "file:") {
    loadStatus.sports = "페이지를 Live Server나 GitHub Pages에서 여세요";
    updateStatus();
    return;
  }

  if (typeof Papa === "undefined") {
    loadStatus.sports = "Papa Parse를 불러오지 못했습니다";
    updateStatus();
    return;
  }

  if (typeof Chart === "undefined") {
    loadStatus.sports = "Chart.js를 불러오지 못했습니다";
    updateStatus();
    return;
  }

  Papa.parse(sportsCsvPath, {
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
        loadStatus.sports = "CSV 형식이나 열 이름을 확인하세요";
        updateStatus();
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
        loadStatus.sports = "연령별 데이터 또는 숫자 형식을 확인하세요";
        updateStatus();
        return;
      }

      drawSportsChart(ageRows);
      loadStatus.sports = ageRows.length + "개 연령 집단 표시";
      updateStatus();
    },
    error: function () {
      loadStatus.sports = "CSV 경로와 네트워크를 확인하세요";
      updateStatus();
    }
  });
}

function loadFacilitiesCsv() {
  if (window.location.protocol === "file:") {
    loadStatus.facilities = "페이지를 Live Server나 GitHub Pages에서 여세요";
    updateStatus();
    return;
  }

  if (typeof Papa === "undefined" || typeof Chart === "undefined") {
    loadStatus.facilities = "Papa Parse 또는 Chart.js를 불러오지 못했습니다";
    updateStatus();
    return;
  }

  Papa.parse(facilitiesCsvPath, {
    download: true,
    header: true,
    skipEmptyLines: "greedy",
    complete: function (results) {
      const fields = results.meta.fields || [];
      if (results.errors.length > 0 || !fields.includes("구분")) {
        loadStatus.facilities = "CSV 형식이나 ‘구분’ 열을 확인하세요";
        updateStatus();
        return;
      }

      const counts = Object.fromEntries(facilityLabels.map((label) => [label, 0]));
      for (const row of results.data) {
        const kind = (row["구분"] || "").trim();
        if (!kind) continue;
        const label = kind === "사찰" ? "불교" : facilityLabels.includes(kind) ? kind : "기타";
        counts[label] += 1;
      }

      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      if (total === 0) {
        loadStatus.facilities = "집계할 시설 데이터가 없습니다";
        updateStatus();
        return;
      }

      drawFacilitiesChart(counts);
      loadStatus.facilities = "총 " + total + "곳 · 성당 " + counts["성당"]
        + "곳, 교회 " + counts["교회"] + "곳, 불교 " + counts["불교"]
        + "곳, 기타 " + counts["기타"] + "곳";
      updateStatus();
    },
    error: function () {
      loadStatus.facilities = "CSV 경로와 네트워크를 확인하세요";
      updateStatus();
    }
  });
}

for (const button of buttons) {
  button.addEventListener("click", function () {
    showPanel(button.dataset.chart);
  });
}

loadSportsCsv();
loadFacilitiesCsv();

const goals = {
  marriott: {
    label: "万豪",
    level: "未设置",
    target: 50,
    baseNights: 0,
    basePoints: 0,
    cashPerTenThousandPoints: 300,
  },
  hyatt: {
    label: "凯悦",
    level: "未设置",
    target: 60,
    baseNights: 0,
    basePoints: 0,
    cashPerTenThousandPoints: 450,
    milestones: [
      { label: "探索者", nights: 10 },
      { label: "冒险家", nights: 30 },
      { label: "环球客", nights: 60 },
    ],
  },
};

const activeYear = 2026;
const emptyStays = [];
const emptyPromos = [];

const state = {
  filter: "all",
  stays: load("hotel-dashboard-v2-stays", emptyStays),
  calendarView: "photo",
  activeMonth: new Date().getFullYear() === activeYear ? new Date().getMonth() : 0,
  editingDate: null,
  editingPhotos: [],
};

const formatter = new Intl.NumberFormat("zh-CN");
const moneyFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

const statusLabel = {
  booked: "预订待入住",
  stayed: "已入住",
  credited: "已入住已积分",
  posted: "已入住已积分",
  pending: "预订待入住",
  missing: "已入住",
};

const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const cityCoordinates = {
  上海: [31.2304, 121.4737],
  北京: [39.9042, 116.4074],
  北京市: [39.9042, 116.4074],
  Beijing: [39.9042, 116.4074],
  广州: [23.1291, 113.2644],
  深圳: [22.5431, 114.0579],
  杭州: [30.2741, 120.1551],
  南京: [32.0603, 118.7969],
  苏州: [31.2989, 120.5853],
  宁波: [29.8683, 121.544],
  成都: [30.5728, 104.0668],
  重庆: [29.563, 106.5516],
  武汉: [30.5928, 114.3055],
  西安: [34.3416, 108.9398],
  厦门: [24.4798, 118.0894],
  青岛: [36.0671, 120.3826],
  香港: [22.3193, 114.1694],
  澳门: [22.1987, 113.5439],
  台北: [25.033, 121.5654],
  东京: [35.6762, 139.6503],
  大阪: [34.6937, 135.5023],
  首尔: [37.5665, 126.978],
  新加坡: [1.3521, 103.8198],
  曼谷: [13.7563, 100.5018],
  芽庄: [12.2388, 109.1967],
  芽莊: [12.2388, 109.1967],
  越南芽庄: [12.2388, 109.1967],
  越南芽莊: [12.2388, 109.1967],
  "NhaTrang": [12.2388, 109.1967],
  "Nha Trang": [12.2388, 109.1967],
  吉隆坡: [3.139, 101.6869],
  巴黎: [48.8566, 2.3522],
  伦敦: [51.5072, -0.1276],
  纽约: [40.7128, -74.006],
  洛杉矶: [34.0522, -118.2437],
  旧金山: [37.7749, -122.4194],
  拉斯维加斯: [36.1699, -115.1398],
  西雅图: [47.6062, -122.3321],
  芝加哥: [41.8781, -87.6298],
  悉尼: [-33.8688, 151.2093],
  墨尔本: [-37.8136, 144.9631],
};
const chinaCityNames = new Set([
  "上海",
  "北京",
  "北京市",
  "Beijing",
  "广州",
  "深圳",
  "杭州",
  "南京",
  "苏州",
  "宁波",
  "成都",
  "重庆",
  "武汉",
  "西安",
  "厦门",
  "青岛",
  "香港",
  "澳门",
  "台北",
]);

function load(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return cloneData(fallback);
  try {
    return JSON.parse(raw);
  } catch {
    return cloneData(fallback);
  }
}

function cloneData(data) {
  return data.map((item) => ({ ...item }));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function save() {
  localStorage.setItem("hotel-dashboard-v2-stays", JSON.stringify(state.stays));
}

function visibleStays() {
  if (state.filter === "all") return state.stays;
  return state.stays.filter((stay) => stay.program === state.filter);
}

function aggregate(program) {
  const stays = state.stays.filter((stay) => stay.program === program);
  return stays.reduce(
    (acc, stay) => {
      acc.nights += stayCountsAsNight(stay) ? Number(stay.nights || 1) : 0;
      acc.cost += Number(stay.cost || 0);
      acc.points += stayCountsAsPoints(stay) ? Number(stay.points || 0) : 0;
      acc.pendingPoints += stay.status === "booked" || stay.status === "pending" ? Number(stay.points || 0) : 0;
      acc.missing += stay.status === "stayed" || stay.status === "missing" ? 1 : 0;
      return acc;
    },
    {
      nights: goals[program].baseNights,
      cost: 0,
      points: goals[program].basePoints,
      pendingPoints: 0,
      missing: 0,
    },
  );
}

function stayCountsAsNight(stay) {
  return ["stayed", "credited", "posted", "missing"].includes(stay.status);
}

function stayCountsAsPoints(stay) {
  return ["credited", "posted"].includes(stay.status);
}

function renderMetrics() {
  const marriott = aggregate("marriott");
  const hyatt = aggregate("hyatt");

  updateProgramMetric("marriott", marriott);
  updateProgramMetric("hyatt", hyatt);
}

function updateProgramMetric(program, data) {
  const target = goals[program].target;
  const remaining = Math.max(target - data.nights, 0);
  const percent = Math.min((data.nights / target) * 100, 100);
  const name = program === "marriott" ? "marriott" : "hyatt";

  document.querySelector(`#${name}Nights`).textContent = `${data.nights} / ${target}`;
  document.querySelector(`#${name}Progress`).style.width = `${percent}%`;
  document.querySelector(`#${name}Copy`).textContent = programCopy(program, data);
  document.querySelector(`#${name}Status`).textContent = goals[program].level;
  document.querySelector(`#${name}PointValue`).textContent =
    `积分 ${formatter.format(data.points)} · 折合 ${moneyFormatter.format(pointCashValue(program, data.points))}`;
  document.querySelector(`#${name}Spend`).textContent = moneyFormatter.format(data.cost);
}

function programCopy(program, data) {
  if (program === "hyatt") {
    return goals.hyatt.milestones
      .map((milestone) => `距${milestone.label} ${Math.max(milestone.nights - data.nights, 0)} 晚`)
      .join(" · ");
  }

  const remaining = Math.max(goals.marriott.target - data.nights, 0);
  return `年度目标还差 ${remaining} 晚`;
}

function pointCashValue(program, points) {
  return (points / 10000) * goals[program].cashPerTenThousandPoints;
}

function renderStays() {
  const calendar = document.querySelector("#calendarGrid");
  const stayMap = new Map(visibleStays().map((stay) => [stay.date || stay.checkIn, stay]));
  const monthIndex = state.activeMonth;
  const days = daysInMonth(activeYear, monthIndex);
  const offset = new Date(activeYear, monthIndex, 1).getDay();
  const cells = [
    ...Array.from({ length: offset }, () => `<span class="calendar-pad"></span>`),
    ...Array.from({ length: days }, (_, index) => {
      const day = index + 1;
      const date = formatDate(activeYear, monthIndex, day);
      const stay = stayMap.get(date);
      return renderDayCell(date, day, stay);
    }),
  ].join("");

  renderMonthAxis();
  calendar.innerHTML = `
    <section class="month-card current-month-card">
      <div class="month-title">${activeYear} 年 ${monthNames[monthIndex]}</div>
      <div class="weekday-row" aria-hidden="true">
        <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
      </div>
      <div class="month-grid">${cells}</div>
    </section>
  `;
}

function renderMonthAxis() {
  const axis = document.querySelector("#monthAxis");
  axis.innerHTML = monthNames
    .map(
      (monthName, index) => `
        <button class="month-axis-button ${index === state.activeMonth ? "active" : ""}" type="button" data-month="${index}">
          ${monthName}
        </button>
      `,
    )
    .join("");
}

function renderDayCell(date, day, stay) {
  const classes = ["day-cell"];
  if (stay) classes.push(normalizeStatus(stay.status), stay.program);
  const body = stay ? dayCellBody(stay) : "";

  return `
    <button class="${classes.join(" ")}" type="button" data-date="${date}" aria-label="${date} 房晚记录">
      <span class="day-number">${day}</span>
      ${body}
    </button>
  `;
}

function dayCellBody(stay) {
  if (state.calendarView === "points") {
    const points = stayCountsAsPoints(stay) ? Number(stay.points || 0) : 0;
    return points ? `<span class="cell-points">${formatter.format(points)}</span>` : `<span class="cell-status">${statusLabel[normalizeStatus(stay.status)]}</span>`;
  }

  const firstPhoto = stay.photos?.[0];
  if (firstPhoto) return `<img class="cell-photo" src="${firstPhoto}" alt="" />`;
  return `<span class="cell-status">${stay.city ? escapeHtml(stay.city) : statusLabel[normalizeStatus(stay.status)]}</span>`;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function formatDate(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalizeStatus(status) {
  if (status === "posted") return "credited";
  if (status === "pending") return "booked";
  if (status === "missing") return "stayed";
  return status;
}

function statusClass(status) {
  const normalized = normalizeStatus(status);
  if (normalized === "credited") return "positive";
  if (normalized === "booked") return "warning";
  return "danger";
}

function renderAll() {
  renderProgramVisibility();
  renderMetrics();
  renderStays();
  renderMap();
}

function renderProgramVisibility() {
  const overview = document.querySelector("#overview");
  overview.classList.toggle("filtered", state.filter !== "all");

  document.querySelectorAll("[data-program-card]").forEach((card) => {
    const shouldShow = state.filter === "all" || card.dataset.programCard === state.filter;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.program;
    renderAll();
  });
});

document.querySelectorAll(".calendar-view-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".calendar-view-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.calendarView = button.dataset.calendarView;
    renderStays();
  });
});

document.querySelector("#calendarGrid").addEventListener("click", (event) => {
  const cell = event.target.closest(".day-cell");
  if (!cell) return;
  openStayEditor(cell.dataset.date);
});

document.querySelector("#monthAxis").addEventListener("click", (event) => {
  const button = event.target.closest(".month-axis-button");
  if (!button) return;
  state.activeMonth = Number(button.dataset.month);
  renderStays();
});

document.querySelector("#stayStatus").addEventListener("change", updateEditorFields);
document.querySelector("#closeDialog").addEventListener("click", closeStayEditor);
document.querySelector("#cancelEditor").addEventListener("click", closeStayEditor);

document.querySelector("#deleteStay").addEventListener("click", () => {
  if (!state.editingDate) return;
  state.stays = state.stays.filter((stay) => (stay.date || stay.checkIn) !== state.editingDate);
  save();
  closeStayEditor();
  renderAll();
});

document.querySelector('input[name="photos"]').addEventListener("change", async (event) => {
  const files = Array.from(event.target.files || []);
  state.editingPhotos = await Promise.all(files.map(readFileAsDataUrl));
  renderPhotoPreview();
});

document.querySelector("#stayEditor").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const date = formData.get("date");
  const status = formData.get("status");
  const nextStay = {
    id: existingStayForDate(date)?.id || crypto.randomUUID(),
    date,
    program: formData.get("program"),
    city: formData.get("city"),
    brand: formData.get("brand"),
    cost: Number(formData.get("cost")),
    status,
    nights: 1,
    points: status === "credited" ? Number(formData.get("points") || 0) : 0,
    note: status === "booked" ? "" : formData.get("note"),
    photos: status === "booked" ? [] : state.editingPhotos,
  };

  state.stays = [...state.stays.filter((stay) => (stay.date || stay.checkIn) !== date), nextStay];
  save();
  closeStayEditor();
  renderAll();
});

document.querySelector("#resetData").addEventListener("click", () => {
  state.stays = [];
  save();
  renderAll();
});

renderAll();

function renderMap() {
  const markers = document.querySelector("#mapMarkers");
  const list = document.querySelector("#mapList");
  const grouped = new Map();
  const unknown = [];

  visibleStays().forEach((stay) => {
    if (!stay.city) return;
    const city = resolveCityName(stay.city);
    const coords = cityCoordinates[city];
    if (!coords) {
      if (!unknown.includes(stay.city)) unknown.push(stay.city);
      return;
    }

    const key = `${city}-${stay.program}`;
    const existing = grouped.get(key) || {
      city,
      program: stay.program,
      coords,
      count: 0,
      cost: 0,
      points: 0,
    };
    existing.count += 1;
    existing.cost += Number(stay.cost || 0);
    existing.points += stayCountsAsPoints(stay) ? Number(stay.points || 0) : 0;
    grouped.set(key, existing);
  });

  const places = Array.from(grouped.values());
  markers.innerHTML = places.map(renderMapMarker).join("");
  list.innerHTML = renderMapList(places, unknown);
  document.querySelector("#mapCount").textContent = `${new Set(places.map((place) => place.city)).size} 城市`;
  renderChinaMap(places);
}

function normalizeCityName(city) {
  return String(city)
    .trim()
    .split(/[，,、/]/)[0]
    .trim()
    .replace(/市$/, "")
    .replace(/\s+/g, "");
}

function resolveCityName(city) {
  const normalized = normalizeCityName(city);
  if (cityCoordinates[normalized]) return normalized;

  const compact = String(city).trim().replace(/\s+/g, "");
  const match = Object.keys(cityCoordinates)
    .sort((a, b) => b.length - a.length)
    .find((name) => compact.includes(name.replace(/\s+/g, "")));

  return match || normalized;
}

function renderMapMarker(place) {
  const [lat, lon] = place.coords;
  const left = ((lon + 180) / 360) * 100;
  const top = ((90 - lat) / 180) * 100;
  const title = `${place.city} · ${goals[place.program].label} · ${place.count} 晚`;

  return `
    <button
      class="map-marker ${place.program}"
      type="button"
      style="left:${left}%; top:${top}%"
      title="${escapeHtml(title)}"
      aria-label="${escapeHtml(title)}"
    >
      ${place.count}
    </button>
  `;
}

function renderMapList(places, unknown) {
  if (!places.length && !unknown.length) {
    return `<div class="empty-state compact">填写入住城市后，地图会自动标注</div>`;
  }

  const knownItems = places
    .sort((a, b) => b.count - a.count)
    .map(
      (place) => `
        <div class="map-list-item">
          <span><i class="program-dot ${place.program}"></i>${escapeHtml(place.city)}</span>
          <strong>${place.count} 晚</strong>
        </div>
      `,
    )
    .join("");
  const unknownItems = unknown.length
    ? `<div class="map-missing">待定位：${unknown.map(escapeHtml).join("、")}</div>`
    : "";

  return `${knownItems}${unknownItems}`;
}

function renderChinaMap(places) {
  const chinaPlaces = places.filter((place) => chinaCityNames.has(place.city));
  document.querySelector("#chinaMapMarkers").innerHTML = chinaPlaces.map(renderChinaMapMarker).join("");
  document.querySelector("#chinaMapCount").textContent = `${new Set(chinaPlaces.map((place) => place.city)).size} 城市`;
}

function renderChinaMapMarker(place) {
  const [lat, lon] = place.coords;
  const left = ((lon - 73) / (135 - 73)) * 100;
  const top = ((54 - lat) / (54 - 18)) * 100;
  const title = `${place.city} · ${goals[place.program].label}`;

  return `
    <button
      class="china-marker ${place.program}"
      type="button"
      style="left:${left}%; top:${top}%"
      title="${escapeHtml(title)}"
      aria-label="${escapeHtml(title)}"
    ></button>
  `;
}

function openStayEditor(date) {
  const dialog = document.querySelector("#stayDialog");
  const form = document.querySelector("#stayEditor");
  const stay = existingStayForDate(date);

  state.editingDate = date;
  state.editingPhotos = stay?.photos ? [...stay.photos] : [];
  form.reset();
  document.querySelector("#dialogDate").textContent = date;
  document.querySelector("#stayDate").value = date;
  form.elements.city.value = stay?.city || "";
  form.elements.program.value = stay?.program || (state.filter === "all" ? "marriott" : state.filter);
  form.elements.brand.value = stay?.brand || stay?.hotel || "";
  form.elements.cost.value = stay?.cost ?? "";
  form.elements.status.value = normalizeStatus(stay?.status || "booked");
  form.elements.points.value = stay?.points || "";
  form.elements.note.value = stay?.note || "";
  document.querySelector("#deleteStay").hidden = !stay;
  updateEditorFields();
  renderPhotoPreview();
  dialog.showModal();
}

function closeStayEditor() {
  document.querySelector("#stayDialog").close();
  state.editingDate = null;
  state.editingPhotos = [];
}

function existingStayForDate(date) {
  return state.stays.find((stay) => (stay.date || stay.checkIn) === date);
}

function updateEditorFields() {
  const status = document.querySelector("#stayStatus").value;
  const pointsInput = document.querySelector('input[name="points"]');
  document.querySelector(".stay-detail-fields").hidden = status === "booked";
  document.querySelector(".points-field").hidden = status !== "credited";
  pointsInput.required = status === "credited";
}

function renderPhotoPreview() {
  const preview = document.querySelector("#photoPreview");
  preview.innerHTML = state.editingPhotos
    .map((photo) => `<img src="${photo}" alt="入住图片预览" />`)
    .join("");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

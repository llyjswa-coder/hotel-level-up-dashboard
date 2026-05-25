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
const brandCatalog = {
  marriott: [
    "The Ritz-Carlton",
    "St. Regis",
    "EDITION",
    "The Luxury Collection",
    "W Hotels",
    "JW Marriott",
    "Marriott",
    "Sheraton",
    "Marriott Vacation Club",
    "Delta Hotels",
    "Le Méridien",
    "Westin",
    "Autograph Collection",
    "Design Hotels",
    "Renaissance Hotels",
    "Tribute Portfolio",
    "Gaylord Hotels",
    "MGM Collection",
    "Outdoor Collection",
    "Courtyard",
    "Four Points",
    "SpringHill Suites",
    "Protea Hotels",
    "Fairfield",
    "AC Hotels",
    "citizenM",
    "Aloft Hotels",
    "Moxy Hotels",
    "City Express",
    "Four Points Flex",
    "Series by Marriott",
    "Residence Inn",
    "TownePlace Suites",
    "Element",
    "StudioRes",
    "Homes & Villas",
    "Apartments by Marriott Bonvoy",
    "Marriott Executive Apartments",
  ],
  hyatt: [
    "Park Hyatt",
    "Alila",
    "Miraval",
    "Impression by Secrets",
    "The Unbound Collection by Hyatt",
    "Andaz",
    "Thompson Hotels",
    "The Standard",
    "Dream Hotels",
    "The StandardX",
    "Breathless Resorts & Spas",
    "JdV by Hyatt",
    "Bunkhouse Hotels",
    "Me and All Hotels",
    "Zoëtry Wellness & Spa Resorts",
    "Hyatt Ziva",
    "Hyatt Zilara",
    "Secrets Resorts & Spas",
    "Dreams Resorts & Spas",
    "Hyatt Vivid Hotels & Resorts",
    "Bahia Principe Hotels & Resorts",
    "Alua Hotels & Resorts",
    "Sunscape Resorts & Spas",
    "Grand Hyatt",
    "Hyatt Regency",
    "Destination by Hyatt",
    "Hyatt Centric",
    "Hyatt Vacation Club",
    "Hyatt",
    "Caption by Hyatt",
    "Unscripted by Hyatt",
    "Hyatt Place",
    "Hyatt House",
    "Hyatt Studios",
    "Hyatt Select",
    "UrCove",
  ],
};
const hyattBrandRows = [
  {
    label: "奢华精品",
    brands: [
      "Park Hyatt",
      "Alila",
      "Miraval",
      "Impression by Secrets",
      "The Unbound Collection by Hyatt",
    ],
  },
  {
    label: "生活方式",
    brands: [
      "Andaz",
      "Thompson Hotels",
      "The Standard",
      "Dream Hotels",
      "The StandardX",
      "Breathless Resorts & Spas",
      "JdV by Hyatt",
      "Bunkhouse Hotels",
      "Me and All Hotels",
    ],
  },
  {
    label: "畅享度假",
    brands: [
      "Zoëtry Wellness & Spa Resorts",
      "Hyatt Ziva",
      "Hyatt Zilara",
      "Secrets Resorts & Spas",
      "Dreams Resorts & Spas",
      "Hyatt Vivid Hotels & Resorts",
      "Bahia Principe Hotels & Resorts",
      "Alua Hotels & Resorts",
      "Sunscape Resorts & Spas",
    ],
  },
  {
    label: "经典风范",
    brands: [
      "Grand Hyatt",
      "Hyatt Regency",
      "Destination by Hyatt",
      "Hyatt Centric",
      "Hyatt Vacation Club",
      "Hyatt",
    ],
  },
  {
    label: "精选品质",
    brands: [
      "Caption by Hyatt",
      "Unscripted by Hyatt",
      "Hyatt Place",
      "Hyatt House",
      "Hyatt Studios",
      "Hyatt Select",
      "UrCove",
    ],
  },
];
const brandAliases = {
  万怡: "Courtyard",
  喜来登: "Sheraton",
  威斯汀: "Westin",
  万豪: "Marriott",
  瑞吉: "St. Regis",
  丽思卡尔顿: "The Ritz-Carlton",
  艾迪逊: "EDITION",
  艾美: "Le Méridien",
  万枫: "Fairfield",
  雅乐轩: "Aloft Hotels",
  源宿: "Element",
  福朋: "Four Points",
  凯悦嘉轩: "Hyatt Place",
  嘉轩: "Hyatt Place",
  凯悦嘉寓: "Hyatt House",
  嘉寓: "Hyatt House",
  柏悦: "Park Hyatt",
  君悦: "Grand Hyatt",
  凯悦: "Hyatt",
  凯悦尚萃: "Hyatt Centric",
  安达仕: "Andaz",
};
const brandLogoDomains = {
  "The Ritz-Carlton": "ritzcarlton.com",
  "St. Regis": "stregis.com",
  EDITION: "editionhotels.com",
  "The Luxury Collection": "theluxurycollection.com",
  "W Hotels": "whotels.com",
  "JW Marriott": "jwmarriott.com",
  Marriott: "marriott.com",
  Sheraton: "sheraton.com",
  "Marriott Vacation Club": "marriottvacationclub.com",
  "Delta Hotels": "deltahotels.com",
  "Le Méridien": "lemeridien.com",
  Westin: "westin.com",
  "Autograph Collection": "autograph-hotels.marriott.com",
  "Design Hotels": "designhotels.com",
  "Renaissance Hotels": "renaissance-hotels.marriott.com",
  "Tribute Portfolio": "tributeportfolio.com",
  "Gaylord Hotels": "gaylordhotels.com",
  "MGM Collection": "mgmresorts.com",
  "Outdoor Collection": "marriott.com",
  Courtyard: "courtyard.marriott.com",
  "Four Points": "fourpoints.com",
  "SpringHill Suites": "springhillsuites.com",
  "Protea Hotels": "proteahotels.com",
  Fairfield: "fairfield.marriott.com",
  "AC Hotels": "achotels.marriott.com",
  citizenM: "citizenm.com",
  "Aloft Hotels": "alofthotels.com",
  "Moxy Hotels": "moxy-hotels.marriott.com",
  "City Express": "cityexpress.com",
  "Four Points Flex": "fourpointsflex.com",
  "Series by Marriott": "marriott.com",
  "Residence Inn": "residenceinn.marriott.com",
  "TownePlace Suites": "towneplacesuites.com",
  Element: "elementhotels.com",
  StudioRes: "studiores.com",
  "Homes & Villas": "homes-and-villas.marriott.com",
  "Marriott Executive Apartments": "marriottexecutiveapartments.com",
  "Park Hyatt": "parkhyatt.com",
  Alila: "alilahotels.com",
  Miraval: "miravalresorts.com",
  "Impression by Secrets": "secretsresorts.com",
  "The Unbound Collection by Hyatt": "hyatt.com",
  Andaz: "andaz.com",
  "Thompson Hotels": "thompsonhotels.com",
  "The Standard": "standardhotels.com",
  "Dream Hotels": "dreamhotels.com",
  "The StandardX": "standardhotels.com",
  "Breathless Resorts & Spas": "breathlessresorts.com",
  "JdV by Hyatt": "jdvhotels.com",
  "Bunkhouse Hotels": "bunkhousehotels.com",
  "Me and All Hotels": "meandallhotels.com",
  "Zoëtry Wellness & Spa Resorts": "zoetryresorts.com",
  "Hyatt Ziva": "hyattziva.com",
  "Hyatt Zilara": "hyattzilara.com",
  "Secrets Resorts & Spas": "secretsresorts.com",
  "Dreams Resorts & Spas": "dreamsresorts.com",
  "Hyatt Vivid Hotels & Resorts": "hyattvivid.com",
  "Bahia Principe Hotels & Resorts": "bahia-principe.com",
  "Alua Hotels & Resorts": "aluahotels.com",
  "Sunscape Resorts & Spas": "sunscaperesorts.com",
  "Grand Hyatt": "grandhyatt.com",
  "Hyatt Regency": "hyattregency.com",
  "Destination by Hyatt": "destinationhotels.com",
  "Hyatt Centric": "hyattcentric.com",
  "Hyatt Vacation Club": "hyattvacationclub.com",
  Hyatt: "hyatt.com",
  "Caption by Hyatt": "captionbyhyatt.com",
  "Unscripted by Hyatt": "hyatt.com",
  "Hyatt Place": "hyattplace.com",
  "Hyatt House": "hyatthouse.com",
  "Hyatt Studios": "hyattstudios.com",
  "Hyatt Select": "hyatt.com",
  UrCove: "urcove.com",
};
const marriottLogoFiles = {
  "The Ritz-Carlton": "ritz-carlton.png",
  "St. Regis": "st-regis.png",
  EDITION: "edition.png",
  "The Luxury Collection": "luxury-collection.png",
  "W Hotels": "w-hotels.png",
  "JW Marriott": "jw-marriott.png",
  Marriott: "marriott.png",
  Sheraton: "sheraton.png",
  "Marriott Vacation Club": "marriott-vacation-club.png",
  "Delta Hotels": "delta-hotels.png",
  "Le Méridien": "le-meridien.png",
  Westin: "westin.png",
  "Autograph Collection": "autograph-collection.png",
  "Design Hotels": "design-hotels.png",
  "Renaissance Hotels": "renaissance-hotels.png",
  "Tribute Portfolio": "tribute-portfolio.png",
  "Gaylord Hotels": "gaylord-hotels.png",
  "MGM Collection": "mgm-collection.png",
  "Outdoor Collection": "outdoor-collection.png",
  Courtyard: "courtyard.png",
  "Four Points": "four-points.png",
  "SpringHill Suites": "springhill-suites.png",
  "Protea Hotels": "protea-hotels.png",
  Fairfield: "fairfield.png",
  "AC Hotels": "ac-hotels.png",
  citizenM: "citizenm.png",
  "Aloft Hotels": "aloft-hotels.png",
  "Moxy Hotels": "moxy-hotels.png",
  "City Express": "city-express.png",
  "Four Points Flex": "four-points-flex.png",
  "Series by Marriott": "series-by-marriott.png",
  "Residence Inn": "residence-inn.png",
  "TownePlace Suites": "towneplace-suites.png",
  Element: "element.png",
  StudioRes: "studiores.png",
  "Homes & Villas": "homes-villas.png",
  "Apartments by Marriott Bonvoy": "apartments-by-marriott.png",
  "Marriott Executive Apartments": "marriott-executive-apartments.png",
};
const hyattLogoFiles = {
  "Park Hyatt": "park-hyatt.png",
  Alila: "alila.png",
  Miraval: "miraval.png",
  "Impression by Secrets": "impression-by-secrets.png",
  "The Unbound Collection by Hyatt": "unbound-collection.png",
  Andaz: "andaz.png",
  "Thompson Hotels": "thompson-hotels.png",
  "The Standard": "the-standard.png",
  "Dream Hotels": "dream-hotels.png",
  "The StandardX": "the-standardx.png",
  "Breathless Resorts & Spas": "breathless.png",
  "JdV by Hyatt": "jdv-by-hyatt.png",
  "Bunkhouse Hotels": "bunkhouse-hotels.png",
  "Me and All Hotels": "me-and-all-hotels.png",
  "Zoëtry Wellness & Spa Resorts": "zoetry.png",
  "Hyatt Ziva": "hyatt-ziva.png",
  "Hyatt Zilara": "hyatt-zilara.png",
  "Secrets Resorts & Spas": "secrets.png",
  "Dreams Resorts & Spas": "dreams.png",
  "Hyatt Vivid Hotels & Resorts": "hyatt-vivid.png",
  "Bahia Principe Hotels & Resorts": "bahia-principe.png",
  "Alua Hotels & Resorts": "alua.png",
  "Sunscape Resorts & Spas": "sunscape.png",
  "Grand Hyatt": "grand-hyatt.png",
  "Hyatt Regency": "hyatt-regency.png",
  "Destination by Hyatt": "destination-by-hyatt.png",
  "Hyatt Centric": "hyatt-centric.png",
  "Hyatt Vacation Club": "hyatt-vacation-club.png",
  Hyatt: "hyatt.png",
  "Caption by Hyatt": "caption-by-hyatt.png",
  "Unscripted by Hyatt": "unscripted-by-hyatt.png",
  "Hyatt Place": "hyatt-place.png",
  "Hyatt House": "hyatt-house.png",
  "Hyatt Studios": "hyatt-studios.png",
  "Hyatt Select": "hyatt-select.png",
  UrCove: "urcove.png",
};
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
  renderBrands();
  renderBrandOptions();
}

function renderProgramVisibility() {
  const overview = document.querySelector("#overview");
  overview.classList.toggle("filtered", state.filter !== "all");

  document.querySelectorAll("[data-program-card]").forEach((card) => {
    const shouldShow = state.filter === "all" || card.dataset.programCard === state.filter;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

function renderBrands() {
  const completed = completedBrandKeys();
  const visiblePrograms = state.filter === "all" ? ["marriott", "hyatt"] : [state.filter];
  const totalVisible = visiblePrograms.reduce((sum, program) => sum + brandCatalog[program].length, 0);
  const completedVisible = visiblePrograms.reduce(
    (sum, program) => sum + brandCatalog[program].filter((brand) => completed.has(brandKey(program, brand))).length,
    0,
  );

  document.querySelector("#brandProgress").textContent = `${completedVisible} / ${totalVisible} 点亮`;
  document.querySelector("#brandGroups").innerHTML = visiblePrograms
    .map((program) => renderBrandGroup(program, completed))
    .join("");
}

function renderBrandGroup(program, completed) {
  if (program === "hyatt") return renderHyattBrandGroup(completed);

  const brands = brandCatalog[program]
    .map((brand) => {
      const isLit = completed.has(brandKey(program, brand));
      const logoSrc = brandLogoSrc(program, brand);
      return `
        <div class="brand-tile has-logo ${program === "marriott" ? "marriott-source" : "hyatt-source"} ${isLit ? "is-lit" : ""}" title="${escapeHtml(brand)}">
          <img
            class="brand-logo-img"
            src="${logoSrc}"
            alt="${escapeHtml(brand)}"
            loading="lazy"
            onerror="this.closest('.brand-tile').classList.add('logo-failed'); this.remove();"
          />
          <span class="brand-wordmark">${brandWordmark(brand)}</span>
        </div>
      `;
    })
    .join("");

  return `
    <section class="brand-group ${program}">
      <div class="brand-group-head">
        <h4>${goals[program].label}系</h4>
        <span>${brandCatalog[program].filter((brand) => completed.has(brandKey(program, brand))).length} / ${brandCatalog[program].length}</span>
      </div>
      <div class="brand-grid">${brands}</div>
    </section>
  `;
}

function renderHyattBrandGroup(completed) {
  const rows = hyattBrandRows
    .map((row) => {
      const brands = row.brands
        .map((brand) => {
          const isLit = completed.has(brandKey("hyatt", brand));
          return `
            <div class="brand-tile has-logo hyatt-source ${isLit ? "is-lit" : ""}" title="${escapeHtml(brand)}">
              <img
                class="brand-logo-img"
                src="${brandLogoSrc("hyatt", brand)}"
                alt="${escapeHtml(brand)}"
                loading="lazy"
                onerror="this.closest('.brand-tile').classList.add('logo-failed'); this.remove();"
              />
              <span class="brand-wordmark">${brandWordmark(brand)}</span>
            </div>
          `;
        })
        .join("");

      return `
        <div class="hyatt-brand-row">
          <div class="hyatt-brand-row-label">${row.label}</div>
          <div class="hyatt-brand-row-logos">${brands}</div>
        </div>
      `;
    })
    .join("");

  return `
    <section class="brand-group hyatt">
      <div class="brand-group-head">
        <h4>${goals.hyatt.label}系</h4>
        <span>${brandCatalog.hyatt.filter((brand) => completed.has(brandKey("hyatt", brand))).length} / ${brandCatalog.hyatt.length}</span>
      </div>
      <div class="hyatt-brand-board">${rows}</div>
    </section>
  `;
}

function completedBrandKeys() {
  return new Set(
    state.stays
      .filter((stay) => stay.program && stay.brand && stayCountsAsNight(stay))
      .map((stay) => {
        const canonical = canonicalBrand(stay.program, stay.brand);
        return canonical ? brandKey(stay.program, canonical) : null;
      })
      .filter(Boolean),
  );
}

function canonicalBrand(program, value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const normalized = normalizeBrand(raw);
  const aliased = brandAliases[raw] || brandAliases[normalized];
  if (aliased) return aliased;

  const exact = brandCatalog[program].find((brand) => normalized === normalizeBrand(brand));
  if (exact) return exact;

  return [...brandCatalog[program]]
    .sort((a, b) => normalizeBrand(b).length - normalizeBrand(a).length)
    .find((brand) => {
      const brandNormalized = normalizeBrand(brand);
      return normalized.includes(brandNormalized) || brandNormalized.includes(normalized);
    });
}

function normalizeBrand(value) {
  return String(value)
    .toLowerCase()
    .replace(/酒店|度假村|公寓|by marriott|by hyatt|hotels|hotel|resorts|resort|and|&|\s|\.|,|®|™|-/g, "");
}

function brandKey(program, brand) {
  return `${program}:${normalizeBrand(brand)}`;
}

function brandWordmark(brand) {
  const [first, ...rest] = brand.split(" ");
  if (brand.length <= 14) return escapeHtml(brand);
  return `${escapeHtml(first)}<small>${escapeHtml(rest.join(" "))}</small>`;
}

function brandLogoSrc(program, brand) {
  if (program === "marriott" && marriottLogoFiles[brand]) {
    return `./assets/marriott-logos/${marriottLogoFiles[brand]}`;
  }

  if (program === "hyatt" && hyattLogoFiles[brand]) {
    return `./assets/hyatt-logos/${hyattLogoFiles[brand]}`;
  }

  return `https://logo.clearbit.com/${brandLogoDomains[brand] || "hyatt.com"}`;
}

function renderBrandOptions() {
  document.querySelector("#brandOptions").innerHTML = Object.values(brandCatalog)
    .flat()
    .map((brand) => `<option value="${escapeHtml(brand)}"></option>`)
    .join("");
}

function buildNotionBackup({ includePhotos = false } = {}) {
  const generatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  const marriott = aggregate("marriott");
  const hyatt = aggregate("hyatt");
  const completed = completedBrandKeys();
  const stays = [...state.stays].sort((a, b) => String(a.date || a.checkIn).localeCompare(String(b.date || b.checkIn)));

  const summaryRows = [
    ["万豪", goals.marriott.level, `${marriott.nights} / ${goals.marriott.target}`, moneyFormatter.format(marriott.cost), formatter.format(marriott.points)],
    ["凯悦", goals.hyatt.level, `${hyatt.nights} / ${goals.hyatt.target}`, moneyFormatter.format(hyatt.cost), formatter.format(hyatt.points)],
  ];

  const stayRows = stays.map((stay) => [
    stay.date || stay.checkIn || "",
    goals[stay.program]?.label || stay.program || "",
    stay.city || "",
    safeCanonicalBrand(stay.program, stay.brand) || stay.brand || "",
    statusLabel[normalizeStatus(stay.status)] || stay.status || "",
    moneyFormatter.format(Number(stay.cost || 0)),
    formatter.format(Number(stay.points || 0)),
    includePhotos ? markdownPhotos(stay) : String(stay.photos?.length || 0),
    stay.note || "",
  ]);

  const brandRows = ["marriott", "hyatt"].map((program) => {
    const brands = brandCatalog[program].filter((brand) => completed.has(brandKey(program, brand)));
    return `## ${goals[program].label}已点亮品牌\n${brands.length ? brands.map((brand) => `- ${brand}`).join("\n") : "- 暂无"}`;
  });
  const portableStays = includePhotos
    ? state.stays
    : state.stays.map((stay) => ({
        ...stay,
        photos: stay.photos?.length ? `${stay.photos.length} 张本地图片，未写入 Notion 备份正文` : [],
      }));

  return [
    `# 酒店刷房看板备份`,
    "",
    `生成时间：${generatedAt}`,
    `会员年度：${activeYear}`,
    "",
    "## 进度总览",
    markdownTable(["酒店集团", "当前等级", "年度房晚", "已花费", "已入账积分"], summaryRows),
    "",
    "## 房晚明细",
    stays.length
      ? markdownTable(["日期", "集团", "城市", "品牌", "状态", "花费", "积分", "照片数", "日志"], stayRows)
      : "暂无房晚记录",
    "",
    ...brandRows.flatMap((section) => [section, ""]),
    "## 原始数据备份",
    "```json",
    JSON.stringify({ activeYear, stays: portableStays }, null, 2),
    "```",
  ].join("\n");
}

function buildNotionHtmlBackup() {
  const generatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  const marriott = aggregate("marriott");
  const hyatt = aggregate("hyatt");
  const completed = completedBrandKeys();
  const stays = [...state.stays].sort((a, b) => String(a.date || a.checkIn).localeCompare(String(b.date || b.checkIn)));
  const brandSections = ["marriott", "hyatt"]
    .map((program) => {
      const brands = brandCatalog[program].filter((brand) => completed.has(brandKey(program, brand)));
      return `
        <section>
          <h2>${escapeHtml(goals[program].label)}已点亮品牌</h2>
          ${brands.length ? `<ul>${brands.map((brand) => `<li>${escapeHtml(brand)}</li>`).join("")}</ul>` : "<p>暂无</p>"}
        </section>
      `;
    })
    .join("");

  const stayRows = stays
    .map(
      (stay) => `
        <tr>
          <td>${escapeHtml(stay.date || stay.checkIn || "")}</td>
          <td>${escapeHtml(goals[stay.program]?.label || stay.program || "")}</td>
          <td>${escapeHtml(stay.city || "")}</td>
          <td>${escapeHtml(safeCanonicalBrand(stay.program, stay.brand) || stay.brand || "")}</td>
          <td>${escapeHtml(statusLabel[normalizeStatus(stay.status)] || stay.status || "")}</td>
          <td>${escapeHtml(moneyFormatter.format(Number(stay.cost || 0)))}</td>
          <td>${escapeHtml(formatter.format(Number(stay.points || 0)))}</td>
          <td>${htmlPhotos(stay)}</td>
          <td>${escapeHtml(stay.note || "")}</td>
        </tr>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>酒店刷房看板备份</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif; color: #1f2430; line-height: 1.5; margin: 32px; }
      h1, h2 { margin: 0 0 12px; }
      section { margin: 28px 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #d9dde7; padding: 8px; text-align: left; vertical-align: top; }
      th { background: #f5f7fb; }
      .photo-grid { display: flex; flex-wrap: wrap; gap: 8px; min-width: 160px; }
      .photo-grid img { width: 96px; height: 72px; object-fit: cover; border-radius: 6px; border: 1px solid #d9dde7; }
      pre { white-space: pre-wrap; word-break: break-word; background: #f5f7fb; padding: 12px; border-radius: 8px; }
    </style>
  </head>
  <body>
    <h1>酒店刷房看板备份</h1>
    <p>生成时间：${escapeHtml(generatedAt)}<br />会员年度：${activeYear}</p>

    <section>
      <h2>进度总览</h2>
      <table>
        <thead><tr><th>酒店集团</th><th>当前等级</th><th>年度房晚</th><th>已花费</th><th>已入账积分</th></tr></thead>
        <tbody>
          <tr><td>万豪</td><td>${escapeHtml(goals.marriott.level)}</td><td>${marriott.nights} / ${goals.marriott.target}</td><td>${escapeHtml(moneyFormatter.format(marriott.cost))}</td><td>${escapeHtml(formatter.format(marriott.points))}</td></tr>
          <tr><td>凯悦</td><td>${escapeHtml(goals.hyatt.level)}</td><td>${hyatt.nights} / ${goals.hyatt.target}</td><td>${escapeHtml(moneyFormatter.format(hyatt.cost))}</td><td>${escapeHtml(formatter.format(hyatt.points))}</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>房晚明细</h2>
      ${
        stays.length
          ? `<table>
              <thead><tr><th>日期</th><th>集团</th><th>城市</th><th>品牌</th><th>状态</th><th>花费</th><th>积分</th><th>照片</th><th>日志</th></tr></thead>
              <tbody>${stayRows}</tbody>
            </table>`
          : "<p>暂无房晚记录</p>"
      }
    </section>

    ${brandSections}

    <section>
      <h2>原始数据备份</h2>
      <pre>${escapeHtml(JSON.stringify({ activeYear, stays: state.stays }, null, 2))}</pre>
    </section>
  </body>
</html>`;
}

function markdownPhotos(stay) {
  const photos = stay.photos || [];
  if (!photos.length) return "0";
  return photos.map((photo, index) => `![照片 ${index + 1}](${photo})`).join("<br>");
}

function htmlPhotos(stay) {
  const photos = stay.photos || [];
  if (!photos.length) return "0";
  return `<div class="photo-grid">${photos
    .map((photo, index) => `<img src="${escapeAttribute(photo)}" alt="入住照片 ${index + 1}" />`)
    .join("")}</div>`;
}

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function hasStayPhotos() {
  return state.stays.some((stay) => stay.photos?.length);
}

function backupDateStamp() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
}

function safeCanonicalBrand(program, brand) {
  if (!program || !brandCatalog[program]) return "";
  return canonicalBrand(program, brand);
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.map(markdownCell).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(markdownCell).join(" | ")} |`),
  ].join("\n");
}

function markdownCell(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    .replaceAll("\n", "<br>")
    .trim();
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

function downloadTextFile(filename, text, type = "text/markdown;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
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

document.querySelector("#exportNotion").addEventListener("click", async () => {
  const includesPhotos = hasStayPhotos();

  if (includesPhotos) {
    downloadTextFile(
      `hotel-dashboard-notion-photo-backup-${backupDateStamp()}.html`,
      buildNotionHtmlBackup(),
      "text/html;charset=utf-8",
    );
    alert("已导出包含照片本体的 HTML 备份文件。可在 Notion 里导入这个文件，或打开后复制内容到 Notion。");
    return;
  }

  const backup = buildNotionBackup();
  try {
    const copied = await copyTextToClipboard(backup);
    if (copied) {
      alert("Notion 备份已复制。打开 Notion 新页面后直接粘贴即可。");
      return;
    }
  } catch {
    // Fall back to a Markdown file when clipboard permission is unavailable.
  }

  downloadTextFile(`hotel-dashboard-notion-backup-${activeYear}.md`, backup);
  alert("浏览器没有开放剪贴板权限，已改为下载 Markdown 备份文件，可导入或粘贴到 Notion。");
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

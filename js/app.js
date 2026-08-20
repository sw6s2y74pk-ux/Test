/* ==========================================================================
   PROJECT IRONMAN — app logic: hero countdown, tiles, lists, chart wiring
   ========================================================================== */

const DISCIPLINE_META = {
  swim: { label: "Swim", icon: "🏊", color: "--series-swim" },
  bike: { label: "Bike", icon: "🚴", color: "--series-bike" },
  run: { label: "Run", icon: "🏃", color: "--series-run" },
};

function fmtDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

function weekdayShort(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

/* ---------- Theme toggle ---------- */

function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const stored = localStorage.getItem("pi-theme");
  if (stored) document.documentElement.setAttribute("data-theme", stored);
  const setIcon = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const isDark = current === "dark" || (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
    btn.textContent = isDark ? "☀" : "☾";
  };
  setIcon();
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const isDark = current === "dark" || (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pi-theme", next);
    setIcon();
    renderCharts(); // re-render so chart colors pick up the new CSS vars
  });
}

/* ---------- Hero: countdown ---------- */

function initHero() {
  document.getElementById("athleteName").textContent = ATHLETE.name;
  document.getElementById("raceNameHero").textContent = CONFIG.raceName;

  const badges = document.getElementById("heroBadges");
  badges.innerHTML = `
    <span class="badge">VO2max <b>${FITNESS.vo2max}</b></span>
    <span class="badge">Recovery <b>${RECOVERY.percent}%</b></span>
    <span class="badge">Running level <b>${FITNESS.runningLevel}</b></span>
    <span class="badge">Threshold pace <b>${FITNESS.thresholdPace}/km</b></span>
  `;

  const card = document.getElementById("countdownCard");
  if (!CONFIG.raceDate) {
    card.innerHTML = `
      <div class="race-name">${CONFIG.raceName}</div>
      <div class="race-meta">Race date not set yet</div>
      <div class="countdown-empty">
        Add a date to activate the countdown — set <code>CONFIG.raceDate</code>
        in <code>js/data.js</code> to your race day (e.g. <code>"2027-07-04"</code>),
        and <code>CONFIG.raceLocation</code> for the venue.
      </div>
    `;
    return;
  }

  const locLine = CONFIG.raceLocation ? `${CONFIG.raceLocation} · ` : "";
  card.innerHTML = `
    <div class="race-name">${CONFIG.raceName}</div>
    <div class="race-meta">${locLine}${new Date(CONFIG.raceDate + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</div>
    <div class="countdown-grid" id="countdownGrid"></div>
  `;

  const grid = document.getElementById("countdownGrid");
  const units = [
    { key: "d", u: "Days" },
    { key: "h", u: "Hours" },
    { key: "m", u: "Min" },
    { key: "s", u: "Sec" },
  ];
  units.forEach((u) => {
    const el = document.createElement("div");
    el.className = "countdown-unit";
    el.innerHTML = `<div class="n" id="cd-${u.key}">00</div><div class="u">${u.u}</div>`;
    grid.appendChild(el);
  });

  function tick() {
    const target = new Date(CONFIG.raceDate + "T00:00:00").getTime();
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = String(v).padStart(2, "0"); };
    set("cd-d", d); set("cd-h", h); set("cd-m", m); set("cd-s", s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Fitness tiles ---------- */

function initFitnessTiles() {
  const el = document.getElementById("fitnessTiles");
  el.innerHTML = `
    <div class="tile"><div class="label">VO2max</div><div class="value">${FITNESS.vo2max}<span class="unit">ml/kg/min</span></div></div>
    <div class="tile"><div class="label">Running level</div><div class="value">${FITNESS.runningLevel}</div></div>
    <div class="tile"><div class="label">Threshold pace</div><div class="value">${FITNESS.thresholdPace}<span class="unit">/km</span></div></div>
    <div class="tile"><div class="label">Recovery</div><div class="value">${RECOVERY.percent}<span class="unit">%</span></div><div class="sub">${RECOVERY.level} · full in ~${RECOVERY.etaHours}h</div></div>
    <div class="tile"><div class="label">5K prediction</div><div class="value">${FITNESS.predictions["5k"]}</div></div>
    <div class="tile"><div class="label">10K prediction</div><div class="value">${FITNESS.predictions["10k"]}</div></div>
    <div class="tile"><div class="label">Half marathon</div><div class="value">${FITNESS.predictions.half}</div></div>
    <div class="tile"><div class="label">Marathon</div><div class="value">${FITNESS.predictions.marathon}</div></div>
  `;
}

/* ---------- Discipline cards + mix bar ---------- */

function initDisciplines() {
  const el = document.getElementById("disciplineCards");
  const order = ["swim", "bike", "run"];
  el.innerHTML = order
    .map((k) => {
      const t = TOTALS[k], m = DISCIPLINE_META[k];
      return `
      <div class="disc-card">
        <div class="head">
          <span class="swatch" style="background:var(${m.color})"></span>
          <span class="name">${m.label}</span>
          <span class="count">${t.count} sessions</span>
        </div>
        <div class="big">${t.distKm}<span class="unit">km</span></div>
        <div class="row"><span>${t.timeHours}h moving</span><span>${t.calories.toLocaleString()} kcal</span></div>
      </div>`;
    })
    .join("");

  const totalKm = order.reduce((s, k) => s + TOTALS[k].distKm, 0);
  const mix = document.getElementById("mixBar");
  mix.innerHTML = order
    .map((k) => {
      const pct = (TOTALS[k].distKm / totalKm) * 100;
      return `<span style="width:${pct}%; background:var(${DISCIPLINE_META[k].color})"></span>`;
    })
    .join("");

  const legend = document.getElementById("mixLegend");
  legend.innerHTML = order
    .map((k) => `<span class="item"><span class="swatch" style="background:var(${DISCIPLINE_META[k].color})"></span>${DISCIPLINE_META[k].label} · ${((TOTALS[k].distKm / totalKm) * 100).toFixed(0)}%</span>`)
    .join("");
}

/* ---------- Recent activity list ---------- */

function initActivityList() {
  const el = document.getElementById("activityList");
  el.innerHTML = RECENT.map((a) => {
    const m = DISCIPLINE_META[a.discipline];
    const distLabel = a.distanceM >= 1000 ? `${(a.distanceM / 1000).toFixed(2)} km` : `${a.distanceM} m`;
    return `
    <div class="activity">
      <div class="icon" style="background:var(${m.color})">${m.icon}</div>
      <div class="main">
        <div class="loc">${a.label}</div>
        <div class="date">${fmtDate(a.date)}</div>
      </div>
      <div class="stat keep"><b>${distLabel}</b></div>
      <div class="stat"><b>${fmtDuration(a.durationSec)}</b> <span class="u">time</span></div>
      <div class="stat"><b>${a.avgHr}</b> <span class="u">bpm</span></div>
    </div>`;
  }).join("");
}

/* ---------- Schedule list ---------- */

function initSchedule() {
  const el = document.getElementById("scheduleList");
  if (!SCHEDULE.length) {
    el.innerHTML = `<div class="block-note">No upcoming sessions in the current plan.</div>`;
    return;
  }
  el.innerHTML = SCHEDULE.map((s) => {
    const parts = [];
    if (s.distanceKm) parts.push(`${s.distanceKm} km`);
    if (s.estimatedTime) parts.push(`≈ ${s.estimatedTime}`);
    return `
    <div class="sched-row">
      <div class="day">${weekdayShort(s.date)}<br>${fmtDate(s.date)}</div>
      <div class="meta">${s.label} · ${parts.join(" · ")}</div>
      <div class="tl">${s.loadTL ? s.loadTL + " TL" : "—"}</div>
    </div>`;
  }).join("");
}

/* ---------- Charts ---------- */

function renderCharts() {
  renderWeeklyVolume(document.getElementById("volumeChart"), WEEKLY, [
    { key: "swim", label: "Swim", color: "--series-swim" },
    { key: "bike", label: "Bike", color: "--series-bike" },
    { key: "run", label: "Run", color: "--series-run" },
  ]);
  renderLoadChart(document.getElementById("loadChart"), LOAD);
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generatedAt").textContent = CONFIG.generatedAt;
  document.getElementById("year").textContent = new Date().getFullYear();
  initThemeToggle();
  initHero();
  initFitnessTiles();
  initDisciplines();
  initActivityList();
  initSchedule();
  renderCharts();
});

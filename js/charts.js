/* ==========================================================================
   PROJECT IRONMAN — lightweight SVG chart renderers
   No dependencies. Mark specs: 2px lines, round joins, 4px rounded bar
   caps, 2px surface gaps between touching segments, hairline gridlines.
   ========================================================================== */

const CSSVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function makeTooltip(container) {
  const tt = document.createElement("div");
  tt.className = "chart-tooltip";
  container.appendChild(tt);
  return {
    show(x, y, html) {
      tt.innerHTML = html;
      tt.style.left = x + 12 + "px";
      tt.style.top = y - 10 + "px";
      tt.style.opacity = "1";
    },
    hide() { tt.style.opacity = "0"; },
  };
}

/* ---------- Weekly stacked bar (training volume, hours) ---------- */

function renderWeeklyVolume(container, data, seriesDefs) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "chart-wrap";
  container.appendChild(wrap);

  const width = 1000, height = 260;
  const padL = 34, padR = 8, padT = 12, padB = 28;
  const plotW = width - padL - padR, plotH = height - padT - padB;

  const totals = data.map((d) => seriesDefs.reduce((s, sd) => s + d[sd.key], 0));
  const maxV = Math.max(1, ...totals);
  const niceMax = Math.ceil(maxV / 2) * 2;

  const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Weekly training volume by discipline" });
  wrap.appendChild(svg);

  const gridline = CSSVar("--gridline"), baseline = CSSVar("--baseline"), muted = CSSVar("--text-muted");

  // gridlines (0, mid, max)
  [0, 0.5, 1].forEach((f) => {
    const y = padT + plotH - f * plotH;
    svg.appendChild(svgEl("line", { x1: padL, x2: width - padR, y1: y, y2: y, stroke: gridline, "stroke-width": 1 }));
    const label = svgEl("text", { x: padL - 8, y: y + 4, "text-anchor": "end", "font-size": 10, fill: muted });
    label.textContent = Math.round(niceMax * f) + "h";
    svg.appendChild(label);
  });

  const n = data.length;
  const bandW = plotW / n;
  const barW = Math.min(22, bandW * 0.55);
  const gap = 2;

  const tooltip = makeTooltip(wrap);

  data.forEach((d, i) => {
    const cx = padL + bandW * i + bandW / 2;
    let yCursor = padT + plotH;
    const segs = [];

    seriesDefs.forEach((sd) => {
      const v = d[sd.key];
      if (v <= 0) return;
      const h = (v / niceMax) * plotH;
      const y = yCursor - h;
      segs.push({ sd, v, y, h });
      yCursor = y - gap;
    });

    segs.forEach((seg, idx) => {
      const isTop = idx === segs.length - 1;
      const r = isTop ? 4 : 0;
      const rect = svgEl("path", {
        d: roundedBarPath(cx - barW / 2, seg.y, barW, seg.h, r),
        fill: CSSVar(seg.sd.color),
      });
      svg.appendChild(rect);
    });

    // hover hit target across full band
    const hit = svgEl("rect", { x: padL + bandW * i, y: padT, width: bandW, height: plotH, fill: "transparent" });
    const content = () => {
      const rows = seriesDefs
        .filter((sd) => d[sd.key] > 0)
        .map((sd) => `<div class="tt-row"><span class="tt-dot" style="background:${CSSVar(sd.color)}"></span>${sd.label}: <b>${d[sd.key].toFixed(1)}h</b></div>`)
        .join("");
      const total = totals[i].toFixed(1);
      return `<div class="tt-title">${d.week} · ${total}h total</div>${rows || "<div>No sessions</div>"}`;
    };
    const showAt = (e) => {
      const rect = wrap.getBoundingClientRect();
      tooltip.show(e.clientX - rect.left, e.clientY - rect.top, content());
    };
    hit.addEventListener("mouseenter", showAt);
    hit.addEventListener("mousemove", showAt);
    hit.addEventListener("mouseleave", () => tooltip.hide());
    svg.appendChild(hit);

    // sparse x labels (every ~3rd week)
    if (i % 3 === 0 || i === n - 1) {
      const t = svgEl("text", { x: cx, y: height - 8, "text-anchor": "middle", "font-size": 9.5, fill: muted });
      t.textContent = d.week.split("-W")[1] ? "W" + d.week.split("-W")[1] : d.week;
      svg.appendChild(t);
    }
  });

  // baseline
  svg.appendChild(svgEl("line", { x1: padL, x2: width - padR, y1: padT + plotH, y2: padT + plotH, stroke: baseline, "stroke-width": 1 }));
}

function roundedBarPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, h);
  if (h <= 0) return "";
  if (r <= 0) return `M${x},${y} h${w} v${h} h${-w} Z`;
  return `M${x},${y + r}
    a${r},${r} 0 0 1 ${r},${-r}
    h${w - 2 * r}
    a${r},${r} 0 0 1 ${r},${r}
    v${h - r}
    h${-w}
    Z`;
}

/* ---------- Training load line chart ---------- */

function renderLoadChart(container, data) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "chart-wrap";
  container.appendChild(wrap);

  const width = 1000, height = 260;
  const padL = 34, padR = 12, padT = 16, padB = 26;
  const plotW = width - padL - padR, plotH = height - padT - padB;

  const maxV = Math.max(1, ...data.map((d) => Math.max(d.shortTerm, d.longTerm)));
  const niceMax = Math.ceil(maxV / 10) * 10;

  const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Short-term vs long-term training load, last 30 days" });
  wrap.appendChild(svg);

  const gridline = CSSVar("--gridline"), baseline = CSSVar("--baseline"), muted = CSSVar("--text-muted");

  [0, 0.5, 1].forEach((f) => {
    const y = padT + plotH - f * plotH;
    svg.appendChild(svgEl("line", { x1: padL, x2: width - padR, y1: y, y2: y, stroke: gridline, "stroke-width": 1 }));
    const label = svgEl("text", { x: padL - 8, y: y + 4, "text-anchor": "end", "font-size": 10, fill: muted });
    label.textContent = Math.round(niceMax * f);
    svg.appendChild(label);
  });

  const n = data.length;
  const xFor = (i) => padL + (plotW * i) / (n - 1);
  const yFor = (v) => padT + plotH - (v / niceMax) * plotH;

  const pathFrom = (key) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)},${yFor(d[key]).toFixed(1)}`).join(" ");

  // long-term (reference) line — muted ink
  svg.appendChild(svgEl("path", { d: pathFrom("longTerm"), fill: "none", stroke: muted, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));
  // short-term (primary) line — swim-blue accent
  const shortColor = CSSVar("--series-swim");
  svg.appendChild(svgEl("path", { d: pathFrom("shortTerm"), fill: "none", stroke: shortColor, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));

  // end markers
  const last = data[n - 1];
  [["shortTerm", shortColor], ["longTerm", muted]].forEach(([key, color]) => {
    const cx = xFor(n - 1), cy = yFor(last[key]);
    svg.appendChild(svgEl("circle", { cx, cy, r: 5, fill: color, stroke: CSSVar("--surface-1"), "stroke-width": 2 }));
  });

  const endShortLabel = svgEl("text", { x: xFor(n - 1) + 8, y: yFor(last.shortTerm) + 4, "font-size": 11, fill: shortColor, "font-weight": 700 });
  endShortLabel.textContent = "Short-term " + last.shortTerm;
  svg.appendChild(endShortLabel);

  const endLongLabel = svgEl("text", { x: xFor(n - 1) + 8, y: yFor(last.longTerm) + 4, "font-size": 11, fill: muted, "font-weight": 700 });
  endLongLabel.textContent = "Long-term " + last.longTerm;
  svg.appendChild(endLongLabel);

  svg.appendChild(svgEl("line", { x1: padL, x2: width - padR, y1: padT + plotH, y2: padT + plotH, stroke: baseline, "stroke-width": 1 }));

  // crosshair + tooltip
  const tooltip = makeTooltip(wrap);
  const hit = svgEl("rect", { x: padL, y: padT, width: plotW, height: plotH, fill: "transparent" });
  const crosshair = svgEl("line", { y1: padT, y2: padT + plotH, stroke: baseline, "stroke-width": 1, opacity: 0 });
  svg.appendChild(crosshair);
  svg.appendChild(hit);

  hit.addEventListener("mousemove", (e) => {
    const svgRect = svg.getBoundingClientRect();
    const relX = ((e.clientX - svgRect.left) / svgRect.width) * width;
    let i = Math.round(((relX - padL) / plotW) * (n - 1));
    i = Math.max(0, Math.min(n - 1, i));
    const d = data[i];
    crosshair.setAttribute("x1", xFor(i));
    crosshair.setAttribute("x2", xFor(i));
    crosshair.setAttribute("opacity", 1);
    const wrapRect = wrap.getBoundingClientRect();
    tooltip.show(
      e.clientX - wrapRect.left,
      e.clientY - wrapRect.top,
      `<div class="tt-title">${d.date} · ${d.comment}</div>
       <div class="tt-row"><span class="tt-dot" style="background:${shortColor}"></span>Short-term: <b>${d.shortTerm}</b></div>
       <div class="tt-row"><span class="tt-dot" style="background:${muted}"></span>Long-term: <b>${d.longTerm}</b></div>
       <div class="tt-row">Ratio: <b>${d.ratio.toFixed(2)}</b></div>`
    );
  });
  hit.addEventListener("mouseleave", () => { tooltip.hide(); crosshair.setAttribute("opacity", 0); });
}

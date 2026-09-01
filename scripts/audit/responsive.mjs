import { connect, TO_RGB, contrast, hex } from "./cdp.mjs";

const BASE = process.env.AUDIT_URL ?? "http://127.0.0.1:3987";
const PAGES = ["/", "/work/roam", "/work/taskflow", "/work/linksnip", "/work/fx-convert"];
const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440, 1920];
const THEMES = ["light", "dark"];

const cdp = await connect();
const { ev, go, send } = cdp;

const PROBE = `(() => {
  const de = document.documentElement;
  const toRgb = ${TO_RGB};
  const vw = de.clientWidth;

  // --- text smaller than 14px ---
  const small = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.textContent || !el.textContent.trim()) continue;
    const hasOwnText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!hasOwnText) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const fs = parseFloat(cs.fontSize);
    if (fs < 14) small.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,42), fs, text: el.textContent.trim().slice(0,26) });
  }

  // --- tap targets (interactive, visible) ---
  const targets = [];
  for (const el of document.querySelectorAll('a[href], button, [role="tab"], input, select, textarea')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (el.classList.contains('sr-only')) continue;
    targets.push({
      name: (el.getAttribute('aria-label') || el.textContent.trim() || el.tagName).slice(0, 26),
      w: Math.round(r.width), h: Math.round(r.height),
      ok: r.width >= 44 && r.height >= 44,
    });
  }

  // --- overlap among in-flow siblings of major containers ---
  const overlaps = [];
  const containers = [document.querySelector('nav[aria-label="Main"] > div'), ...document.querySelectorAll('section > header, footer > div > div')];
  for (const c of containers) {
    if (!c) continue;
    const kids = [...c.children].filter(k => { const s = getComputedStyle(k); return s.position === 'static' && s.display !== 'none'; });
    for (let i = 0; i < kids.length; i++) for (let j = i+1; j < kids.length; j++) {
      const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
      if (a.width && b.width && a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1)
        overlaps.push(kids[i].tagName + '/' + kids[j].tagName);
    }
  }

  // --- page-specific structure ---
  const heroBottom = (() => {
    const h1 = document.querySelector('h1'); if (!h1) return null;
    const wrap = h1.closest('div.flex'); if (!wrap) return null;
    const grid = [...wrap.children].find(c => c.className.includes('grid'));
    if (!grid) return null;
    const cs = getComputedStyle(grid);
    const kids = [...grid.children].map(k => Math.round(k.getBoundingClientRect().width));
    return { cols: cs.gridTemplateColumns, childWidths: kids, gridW: Math.round(grid.getBoundingClientRect().width) };
  })();

  const projectRow = (() => {
    const row = document.querySelector('a[href^="/work/"]'); if (!row) return null;
    const grid = row.querySelector('div.grid'); if (!grid) return null;
    const media = [...grid.children].find(c => c.querySelector('[class*="aspect"]'));
    const text = [...grid.children][1];
    if (!media || !text) return null;
    const m = media.querySelector('[class*="aspect"]').getBoundingClientRect();
    const t = text.getBoundingClientRect();
    return { mediaW: Math.round(m.width), mediaLeft: Math.round(m.left), textBottom: Math.round(t.bottom),
             mediaTop: Math.round(m.top), stackedBelow: m.top >= t.bottom - 2, contentW: Math.round(grid.getBoundingClientRect().width) };
  })();

  const problemApproach = (() => {
    const ps = [...document.querySelectorAll('p')].filter(p => ['PROBLEM','APPROACH','Problem','Approach'].includes(p.textContent.trim()));
    if (ps.length < 2) return null;
    const a = ps[0].parentElement.getBoundingClientRect(), b = ps[1].parentElement.getBoundingClientRect();
    return { stacked: b.top >= a.bottom - 2, aW: Math.round(a.width), bW: Math.round(b.width),
             aRight: Math.round(a.right), bRight: Math.round(b.right), viewport: vw,
             cutOff: a.right > vw + 1 || b.right > vw + 1 };
  })();

  const marquee = (() => {
    const m = document.querySelector('[data-marquee], div[aria-label="Stack"], div[aria-hidden="true"][class*="bg-sky"]')
      || [...document.querySelectorAll('div')].find(d => d.className.includes('overflow-hidden') && d.className.includes('bg-sky'));
    if (!m) return null;
    const cs = getComputedStyle(m);
    return { overflow: cs.overflowX, w: Math.round(m.getBoundingClientRect().width), viewport: vw,
             ariaHidden: m.getAttribute('aria-hidden'), role: m.getAttribute('role') };
  })();

  const tabs = (() => {
    const list = document.querySelector('[role="tablist"]'); if (!list) return null;
    const tabsEls = [...document.querySelectorAll('[role="tab"]')];
    const rects = tabsEls.map(t => t.getBoundingClientRect());
    const rows = new Set(rects.map(r => Math.round(r.top)));
    return { count: tabsEls.length, rows: rows.size, listW: Math.round(list.getBoundingClientRect().width),
             listRight: Math.round(list.getBoundingClientRect().right), viewport: vw,
             heights: rects.map(r => Math.round(r.height)) };
  })();

  return {
    scrollWidth: de.scrollWidth, clientWidth: de.clientWidth,
    overflow: de.scrollWidth - de.clientWidth,
    smallText: small, tapTargets: targets, overlaps,
    heroBottom, projectRow, problemApproach, marquee, tabs,
  };
})()`;

// ---------- RESPONSIVE SWEEP ----------
console.log("################ RESPONSIVE SWEEP ################\n");
const failures = [];
for (const path of PAGES) {
  console.log(`--- ${path} ---`);
  for (const scheme of THEMES) {
    for (const width of WIDTHS) {
      await go(BASE + path, { width, scheme, theme: scheme });
      const r = await ev(PROBE);
      const badTaps = width < 768 ? r.tapTargets.filter((t) => !t.ok) : [];
      const line =
        `  ${scheme.padEnd(5)} ${String(width).padStart(4)}  ovf=${String(r.overflow).padStart(3)}  ` +
        `small<14px=${String(r.smallText.length).padStart(2)}  overlaps=${r.overlaps.length}  ` +
        (width < 768 ? `tap<44=${String(badTaps.length).padStart(2)}` : `tap=n/a`);
      console.log(line);
      if (r.overflow > 0) failures.push(`${path} ${scheme} ${width}: overflow ${r.overflow}`);
      if (r.smallText.length) failures.push(`${path} ${scheme} ${width}: ${r.smallText.length} small-text`);
      if (r.overlaps.length) failures.push(`${path} ${scheme} ${width}: overlaps ${r.overlaps.join(",")}`);
      if (badTaps.length) failures.push(`${path} ${scheme} ${width}: ${badTaps.length} tap targets < 44`);

      if ([320,375,414].includes(width) && scheme === "light") {
        if (r.smallText.length) {
          const uniq = [...new Map(r.smallText.map((s) => [s.fs + s.cls, s])).values()].slice(0, 6);
          console.log("        small text samples:", JSON.stringify(uniq));
        }
        if (badTaps.length) console.log("        tap fails:", JSON.stringify(badTaps));
        if (r.heroBottom) console.log("        heroBottom:", JSON.stringify(r.heroBottom));
        if (r.projectRow) console.log("        projectRow:", JSON.stringify(r.projectRow));
        if (r.problemApproach) console.log("        problem/approach:", JSON.stringify(r.problemApproach));
        if (r.marquee) console.log("        marquee:", JSON.stringify(r.marquee));
        if (r.tabs) console.log("        tabs:", JSON.stringify(r.tabs));
      }
    }
  }
  console.log("");
}

console.log("\n################ FAILURE SUMMARY ################");
if (!failures.length) console.log("  none");
else {
  const grouped = {};
  for (const f of failures) {
    const kind = f.split(": ")[1].replace(/^\d+ /, "").replace(/ \d+$/, "");
    grouped[kind] = (grouped[kind] || 0) + 1;
  }
  for (const [k, v] of Object.entries(grouped)) console.log(`  ${k}: ${v} occurrences`);
}

cdp.close();

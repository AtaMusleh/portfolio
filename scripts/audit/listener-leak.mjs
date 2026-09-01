import { connect } from "./cdp.mjs";
const BASE = process.env.AUDIT_URL ?? "http://127.0.0.1:3987";
const { ev, send, close } = await connect();
const settle = (ms) => new Promise((r) => setTimeout(r, ms));

await send("Page.addScriptToEvaluateOnNewDocument", {
  identifier: "live-probe",
  source: `(() => {
    // Identity-based tracking: a signed add/remove counter drifts when a
    // library calls removeEventListener for a listener it never added.
    const live = { resize: new Set(), scroll: new Set(), pointermove: new Set(), wheel: new Set() };
    for (const target of [window, document]) {
      const add = target.addEventListener.bind(target);
      const rem = target.removeEventListener.bind(target);
      target.addEventListener = function (type, fn, opts) {
        if (live[type]) live[type].add(fn);
        return add(type, fn, opts);
      };
      target.removeEventListener = function (type, fn, opts) {
        if (live[type]) live[type].delete(fn);
        return rem(type, fn, opts);
      };
    }
    let io = 0;
    const RealIO = window.IntersectionObserver;
    window.IntersectionObserver = class extends RealIO {
      constructor(...a) { super(...a); io++; }
      disconnect() { io--; return super.disconnect(); }
    };
    let ro = 0;
    const RealRO = window.ResizeObserver;
    window.ResizeObserver = class extends RealRO {
      constructor(...a) { super(...a); ro++; }
      disconnect() { ro--; return super.disconnect(); }
    };
    window.__live = () => ({
      resize: live.resize.size, scroll: live.scroll.size,
      pointermove: live.pointermove.size, wheel: live.wheel.size,
      io, ro,
      pinSpacers: document.querySelectorAll('.pin-spacer').length,
      reveals: document.querySelectorAll('[data-reveal]').length,
      lenis: document.documentElement.className.includes('lenis'),
      marquee: (() => { const t = document.querySelector('.marquee-track'); return t ? getComputedStyle(t).animationName : 'none'; })(),
    });
  })()`,
});

await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const setMotion = (v) =>
  send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }, { name: "prefers-reduced-motion", value: v }] });
await setMotion("no-preference");
await send("Page.navigate", { url: BASE + "/" });
await settle(2200);

// Elements currently in the viewport that are invisible — a user would see a gap.
const VIEWPORT_HIDDEN = `(() => {
  const out = [];
  for (const el of document.querySelectorAll('main *')) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || r.width === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (parseFloat(cs.opacity) < 0.03) out.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,40) });
  }
  return { count: out.length, sample: out.slice(0, 4) };
})()`;

console.log("################ LEAK CHECK — 6 TOGGLE CYCLES, IDENTITY-TRACKED ################");
console.log("  baseline           :", JSON.stringify(await ev(`window.__live()`)));
for (let i = 1; i <= 6; i++) {
  await setMotion("reduce");
  await settle(1000);
  const on = await ev(`window.__live()`);
  const hiddenOn = await ev(VIEWPORT_HIDDEN);
  await setMotion("no-preference");
  await settle(1200);
  const off = await ev(`window.__live()`);
  const hiddenOff = await ev(VIEWPORT_HIDDEN);
  console.log(`  cycle ${i} ON : ${JSON.stringify(on)} inViewportHidden=${hiddenOn.count}`);
  console.log(`  cycle ${i} OFF: ${JSON.stringify(off)} inViewportHidden=${hiddenOff.count}${hiddenOff.count ? " " + JSON.stringify(hiddenOff.sample) : ""}`);
}

console.log("\n################ FIRST PAINTED FRAME (reduce set) ################");
// Capture computed styles inside the first rAF callback. rAF runs before the
// frame is painted, so this is the state the first frame will show.
await send("Page.addScriptToEvaluateOnNewDocument", {
  identifier: "first-frame",
  source: `(() => {
    window.__firstFrame = null;
    window.__firstAfterDCL = null;
    const capture = () => {
      const out = [];
      for (const el of document.querySelectorAll('main *')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none') continue;
        const op = parseFloat(cs.opacity);
        let dx = 0, dy = 0;
        if (cs.transform && cs.transform !== 'none') { const m = new DOMMatrixReadOnly(cs.transform); dx = m.m41; dy = m.m42; }
        if (op < 0.03 || Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          out.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,40), op: cs.opacity, dx: Math.round(dx), dy: Math.round(dy) });
        }
      }
      return { scanned: document.querySelectorAll('main *').length, offenders: out.length, sample: out.slice(0, 5), t: performance.now() };
    };
    requestAnimationFrame(() => { window.__firstFrame = capture(); });
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => { window.__firstAfterDCL = capture(); });
    });
  })()`,
});
for (const motion of ["reduce", "no-preference"]) {
  await setMotion(motion);
  await send("Page.navigate", { url: BASE + "/" });
  await settle(2500);
  const r = await ev(`({ first: window.__firstFrame, afterDCL: window.__firstAfterDCL })`);
  console.log(`  ${motion.padEnd(14)} first rAF: ${JSON.stringify(r.first)}`);
  console.log(`  ${"".padEnd(14)} first rAF after DOMContentLoaded: ${JSON.stringify(r.afterDCL)}`);
}

close();

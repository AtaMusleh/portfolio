import { connect } from "./cdp.mjs";
const BASE = process.env.AUDIT_URL ?? "http://127.0.0.1:3987";
const PAGES = ["/", "/work/roam", "/work/taskflow", "/work/linksnip", "/work/fx-convert"];
const { ev, go, close } = await connect();
const settle = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Per-element signature, keyed by DOM position so the same element can be
 * compared between a reduce render and a normal one.
 */
const SIGNATURE = `(() => {
  const identity = (t) => t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
  const els = [...document.querySelectorAll('main *')];
  const sig = [];
  let animating = 0, transitioning = 0, reveals = 0;
  const animOffenders = [], transOffenders = [];
  els.forEach((el, i) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') return;
    const durs = cs.transitionDuration.split(',').map(s => parseFloat(s));
    const maxDur = Math.max(...durs, 0);
    const anim = cs.animationName !== 'none';
    if (anim) { animating++; if (animOffenders.length < 5) animOffenders.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,40), name: cs.animationName, dur: cs.animationDuration }); }
    if (maxDur > 0.001) { transitioning++; if (transOffenders.length < 5) transOffenders.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,40), dur: cs.transitionDuration }); }
    if (el.hasAttribute && el.hasAttribute('data-reveal')) reveals++;
    sig.push({ i, tag: el.tagName.toLowerCase(), op: cs.opacity, tr: identity(cs.transform) ? 'I' : cs.transform });
  });
  return { scanned: els.length, sig, animating, transitioning, reveals, animOffenders, transOffenders };
})()`;

console.log("################ REDUCE vs NORMAL, SETTLED STATE ################");
console.log("  (an element only counts as stuck if it differs from the normal-motion settled render)\n");

for (const path of PAGES) {
  for (const theme of ["dark", "light"]) {
    // Normal motion, fully settled: scroll everything into view so every
    // reveal has fired, then return to the top.
    await go(BASE + path, { width: 1440, theme, motion: "no-preference" });
    await settle(1500);
    await ev(`(async () => { const s = innerHeight*0.6, m = document.documentElement.scrollHeight;
      for (let y=0;y<=m;y+=s){ scrollTo(0,y); await new Promise(r=>setTimeout(r,140)); }
      scrollTo(0,0); await new Promise(r=>setTimeout(r,900)); })()`);
    await settle(600);
    const normal = await ev(SIGNATURE);

    // Reduce, three checkpoints.
    await go(BASE + path, { width: 1440, theme, motion: "reduce" });
    await settle(1500);
    const top = await ev(SIGNATURE);
    await ev(`(async () => { const s = innerHeight*0.6, m = document.documentElement.scrollHeight;
      for (let y=0;y<=m;y+=s){ scrollTo(0,y); await new Promise(r=>setTimeout(r,140)); } scrollTo(0,m);
      await new Promise(r=>setTimeout(r,700)); })()`);
    await settle(500);
    const bottom = await ev(SIGNATURE);
    await ev(`window.scrollTo(0, 0)`);
    await settle(900);
    const back = await ev(SIGNATURE);

    const diff = (a) => {
      const byIndex = new Map(normal.sig.map((s) => [s.i, s]));
      const out = [];
      for (const s of a.sig) {
        const n = byIndex.get(s.i);
        if (!n) continue;
        if (s.op !== n.op || s.tr !== n.tr) out.push({ tag: s.tag, reduce: { op: s.op, tr: s.tr }, normal: { op: n.op, tr: n.tr } });
      }
      return out;
    };
    const dTop = diff(top), dBottom = diff(bottom), dBack = diff(back);
    const anim = top.animating + bottom.animating + back.animating;
    const trans = top.transitioning + bottom.transitioning + back.transitioning;

    console.log(
      `  ${path.padEnd(17)} ${theme.padEnd(5)} scanned=${String(top.scanned).padStart(3)}  ` +
        `stuck: top=${dTop.length} bottom=${dBottom.length} back=${dBack.length}  ` +
        `animating=${anim} transitioning=${trans} data-reveal=${top.reveals}` +
        (dTop.length + dBottom.length + dBack.length + anim + trans + top.reveals === 0 ? "  CLEAN" : "")
    );
    if (dTop.length) console.log("      stuck@top:", JSON.stringify(dTop.slice(0, 4)));
    if (dBottom.length) console.log("      stuck@bottom:", JSON.stringify(dBottom.slice(0, 4)));
    if (dBack.length) console.log("      stuck@back:", JSON.stringify(dBack.slice(0, 4)));
    if (anim) console.log("      animating:", JSON.stringify(top.animOffenders.concat(bottom.animOffenders).slice(0, 4)));
    if (trans) console.log("      transitioning:", JSON.stringify(top.transOffenders.concat(bottom.transOffenders).slice(0, 4)));
  }
}

close();

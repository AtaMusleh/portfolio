export async function connect(port = Number(process.env.CDP_PORT ?? 9333)) {
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    }
    for (const l of listeners) l(m);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const waitFor = (m) =>
    new Promise((res) => {
      const l = (x) => { if (x.method === m) { listeners.splice(listeners.indexOf(l), 1); res(x); } };
      listeners.push(l);
    });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("DOM.enable");
  await send("Accessibility.enable");

  const ev = async (expression) =>
    (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;

  async function go(url, { width = 1440, height = 900, scheme = "light", motion = null, theme = null } = {}) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
    const features = [{ name: "prefers-color-scheme", value: scheme }];
    if (motion) features.push({ name: "prefers-reduced-motion", value: motion });
    await send("Emulation.setEmulatedMedia", { features });
    if (theme) {
      // Seed the stored preference before any document script runs.
      await send("Page.addScriptToEvaluateOnNewDocument", {
        source: `try { localStorage.setItem('theme', '${theme}') } catch {}`,
        identifier: "seed-theme",
      });
    }
    // A same-document (hash-only) navigation never fires load, so race a timeout.
    const done = waitFor("Page.loadEventFired");
    await send("Page.navigate", { url });
    await Promise.race([done, new Promise((r) => setTimeout(r, 4000))]);
    await new Promise((r) => setTimeout(r, 550));
  }
  async function key(code, keyName, vk) {
    for (const type of ["rawKeyDown", "keyUp"]) {
      await send("Input.dispatchKeyEvent", { type, code, key: keyName, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
    }
    await new Promise((r) => setTimeout(r, 90));
  }
  const on = (fn) => { listeners.push(fn); return fn; };
  const off = (fn) => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); };
  return { send, ev, go, key, on, off, close: () => ws.close() };
}

// Resolve any CSS colour string to sRGB bytes, in-page, via canvas.
export const TO_RGB = `(color => {
  const c = document.createElement('canvas'); c.width = c.height = 1;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.clearRect(0,0,1,1);
  x.fillStyle = '#000'; x.fillStyle = color;
  x.fillRect(0,0,1,1);
  const d = x.getImageData(0,0,1,1).data;
  return [d[0], d[1], d[2], d[3]/255];
})`;

const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
export function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => lin(v / 255));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
export const hex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

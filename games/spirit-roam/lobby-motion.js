/* Fast depth entrance on the same five actors. The longer skit lives in the portfolio. */
window.SpiritLobby = {create({stage, renderer, heroes, nativeFacing, getPreferences}) {
 let raf = 0, last = 0, startAt = 0, kind = 'idle', elapsed = 0, poses = {};
 const home = document.getElementById('home'), party = document.getElementById('lobby-party');
 const motion = matchMedia('(prefers-reduced-motion:reduce)');
 const reduced = () => getPreferences().reducedMotion || motion.matches;
 const clamp = v => Math.max(0, Math.min(1, v));
 const duration = .82 + (heroes.length - 1) * .11;
 const actors = () => [...stage.querySelectorAll('#featured,.party-member')];
 function finish() {
  kind = 'idle'; stage.classList.remove('opening'); party.inert = false;
  for (const node of actors()) { node.style.transform = ''; node.style.opacity = ''; }
 }
 function paint(node, id, phase, dir) {
  const canvas = node.tagName === 'CANVAS' ? node : node.querySelector('canvas');
  const w = Math.max(1, Math.round(canvas.clientWidth * 1.5)), h = Math.max(1, Math.round(canvas.clientHeight * 1.5));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, w, h); ctx.save();
  if (dir !== nativeFacing[id]) { ctx.translate(w, 0); ctx.scale(-1, 1); }
  renderer.draw(ctx, id, w * .04, h * .02, w * .92, h * .95, {action:'idle', phase, reduced:reduced()});
  ctx.restore(); node.dataset.action = 'idle';
 }
 function draw(now) {
  elapsed = Math.max(0, (now - startAt) / 1000);
  if (kind === 'opening' && elapsed >= duration) finish();
  poses = {};
  for (const node of actors()) {
   const id = node.dataset.hero, index = heroes.findIndex(h => h.id === id);
   const left = node.offsetLeft + node.offsetWidth / 2 - stage.clientWidth / 2;
   const dir = node.id === 'featured' ? nativeFacing[id] || 1 : left < 0 ? 1 : -1;
   let dx = 0, dy = 0, scale = 1, opacity = 1, tilt = 0;
   if (kind === 'opening' && !reduced()) {
    const t = clamp((elapsed - index * .11) / .82), remaining = Math.pow(1 - t, 3);
    dx = (index - 2) * 18 * remaining; dy = -44 * remaining;
    scale = 1 - .72 * remaining; opacity = clamp(t / .18); tilt = (index - 2) * 3 * remaining;
   }
   node.style.transform = `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
   node.style.opacity = String(opacity);
   paint(node, id, now / 1000 * 1.7 + index * 1.2, dir);
   poses[id] = {action:'idle', dx, dy, scale, opacity, dir};
  }
 }
 function frame(now) {
  raf = 0; if (home.hidden || document.hidden) return;
  if (now - last >= 32) { last = now; draw(now); }
  if (!reduced()) raf = requestAnimationFrame(frame);
 }
 function wake() { if (!home.hidden && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(frame); } }
 function start() {
  finish(); startAt = performance.now();
  if (!reduced()) { kind = 'opening'; stage.classList.add('opening'); party.inert = true; }
  draw(startAt); wake();
 }
 function select() { finish(); draw(performance.now()); wake(); }
 function pause() { cancelAnimationFrame(raf); raf = 0; finish(); }
 function refresh() { if (reduced()) finish(); wake(); }
 document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else wake(); });
 motion.addEventListener('change', refresh);
 return {start, skip:finish, select, pause, resume:wake, refresh, get state() { return {kind, elapsed, duration, poses}; }};
}};

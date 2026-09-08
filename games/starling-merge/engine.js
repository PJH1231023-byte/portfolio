/* Deterministic, dependency-free circle physics. All coordinates are in game units. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StarlingPhysics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const WIDTH = 480, HEIGHT = 780, LEFT = 38, RIGHT = 442, TOP = 277, LIMIT = 651;
  const LAUNCH = { x: 240, y: 686 };
  const radius = level => 26 + level * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // Let nearby silhouettes merge without enlarging their physical collision bodies.
  const mergeGap = (a, b) => clamp((a.r + b.r) * .35, 18, 26);
  class World {
    constructor(seed = Date.now()) {
      this.seed = (seed >>> 0) || 1;
      this.bodies = []; this.nextId = 1; this.moving = false;
      this.flight = null; this.elapsed = 0; this.quiet = 0; this.shots = 0; this.events = [];
    }
    random() {
      let x = this.seed; x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      this.seed = x >>> 0; return this.seed / 4294967296;
    }
    add(level, x, y, vx = 0, vy = 0) {
      const body = { id: this.nextId++, level, x, y, vx, vy, r: radius(level) };
      this.bodies.push(body); return body;
    }
    populate() {
      this.add(0, 147, 318); this.add(0, 199, 318);
      this.add(1, 283, 320); this.add(1, 339, 320);
      this.add(2, 241, 387); this.add(0, 125, 411); this.add(1, 338, 434);
    }
    fire(level, angle) {
      if (this.moving || !Number.isInteger(level) || level < 0 || level > 7 || !Number.isFinite(angle)) return false;
      angle = clamp(angle, -1.12, 1.12);
      const p = this.add(level, LAUNCH.x, LAUNCH.y, Math.sin(angle) * 790, -Math.cos(angle) * 790);
      this.flight = p.id; this.moving = true; this.elapsed = 0; this.quiet = 0; this.shots++;
      return true;
    }
    touching(a, b, tolerance = 4) { return Math.hypot(a.x - b.x, a.y - b.y) <= a.r + b.r + tolerance; }
    merge() {
      const visited = new Set();
      for (const root of this.bodies) {
        if (root.level === 7 || visited.has(root.id)) continue;
        const group = [root]; visited.add(root.id);
        for (let i = 0; i < group.length; i++) {
          for (const candidate of this.bodies) {
            if (!visited.has(candidate.id) && candidate.level === root.level && this.touching(group[i], candidate, mergeGap(group[i], candidate))) {
              visited.add(candidate.id); group.push(candidate);
            }
          }
        }
        if (group.length < 3) continue;
        // Only consume three connected pieces. A fourth always stays on the table.
        const trio = group.slice(0, 3), consumed = new Set(trio.map(b => b.id));
        const x = trio.reduce((s, b) => s + b.x, 0) / 3;
        const y = trio.reduce((s, b) => s + b.y, 0) / 3;
        this.bodies = this.bodies.filter(b => !consumed.has(b.id));
        const born = this.add(root.level + 1, x, y);
        if (consumed.has(this.flight)) this.flight = null;
        this.events.push({ type: 'merge', x, y, level: born.level, id: born.id, from: trio.map(b => ({ x: b.x, y: b.y, level: b.level })) });
        return true;
      }
      return false;
    }
    step(dt) {
      if (!this.moving) return;
      dt = clamp(dt, 0, 1 / 60); this.elapsed += dt;
      if (this.elapsed > 3.2) this.flight = null;
      for (const b of this.bodies) {
        b.x += b.vx * dt; b.y += b.vy * dt;
        const drag = Math.exp(-(b.id === this.flight ? .08 : 4.2) * dt);
        b.vx *= drag; b.vy *= drag;
        if (b.x - b.r < LEFT) { b.x = LEFT + b.r; b.vx = Math.abs(b.vx) * .83; }
        if (b.x + b.r > RIGHT) { b.x = RIGHT - b.r; b.vx = -Math.abs(b.vx) * .83; }
        if (b.y - b.r < TOP) {
          b.y = TOP + b.r; b.vy = Math.abs(b.vy) * .25;
          if (b.id === this.flight) this.flight = null;
        }
        if (b.y + b.r > 732) { b.y = 732 - b.r; b.vy = -Math.abs(b.vy) * .2; }
      }
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < this.bodies.length; i++) {
          for (let j = i + 1; j < this.bodies.length; j++) {
            const a = this.bodies[i], b = this.bodies[j];
            const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy), overlap = a.r + b.r - distance;
            if (overlap <= 0) continue;
            const nx = distance > .001 ? dx / distance : 1, ny = distance > .001 ? dy / distance : 0;
            const ma = a.r * a.r, mb = b.r * b.r, total = ma + mb;
            a.x -= nx * overlap * mb / total; a.y -= ny * overlap * mb / total;
            b.x += nx * overlap * ma / total; b.y += ny * overlap * ma / total;
            const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (approach < 0) {
              const impulse = -1.3 * approach / (1 / ma + 1 / mb);
              a.vx -= impulse * nx / ma; a.vy -= impulse * ny / ma;
              b.vx += impulse * nx / mb; b.vy += impulse * ny / mb;
            }
            if (a.id === this.flight || b.id === this.flight) this.flight = null;
          }
        }
      }
      // Project back inside solid rails after positional collision correction.
      for (const b of this.bodies) { b.x = clamp(b.x, LEFT + b.r, RIGHT - b.r); b.y = Math.max(TOP + b.r, b.y); }
      let merged = false;
      while (this.merge()) merged = true;
      const speed = this.bodies.reduce((max, b) => Math.max(max, Math.hypot(b.vx, b.vy)), 0);
      if (!this.flight && speed < 7 && !merged) this.quiet += dt; else this.quiet = 0;
      if (this.quiet > .2 || this.elapsed > 5) {
        this.moving = false; this.flight = null;
        this.bodies.forEach(b => { b.vx = 0; b.vy = 0; });
        if (this.shots % 4 === 0) this.bodies.forEach(b => { b.y += 7; });
        this.events.push({ type: 'settled', lost: this.isLost() });
      }
    }
    isLost() { return this.bodies.some(b => b.y + b.r >= LIMIT); }
    snapshot() {
      return { seed: this.seed, nextId: this.nextId, shots: this.shots, bodies: this.bodies.map(b => ({ ...b, vx: 0, vy: 0 })) };
    }
    restore(data) {
      if (!data || !Array.isArray(data.bodies) || data.bodies.length > 140 ||
        !Number.isInteger(data.seed) || !Number.isInteger(data.nextId) || !Number.isInteger(data.shots) || data.shots < 0 ||
        data.bodies.some(b => !Number.isInteger(b.level) || b.level < 0 || b.level > 7 || !Number.isInteger(b.id) ||
          !Number.isFinite(b.x) || !Number.isFinite(b.y) || b.x < LEFT || b.x > RIGHT || b.y < TOP || b.y > 740)) return false;
      this.seed = data.seed >>> 0 || 1; this.nextId = Math.max(data.nextId, ...data.bodies.map(b => b.id + 1), 1);
      this.shots = data.shots;
      this.bodies = data.bodies.map(b => ({ id: b.id, level: b.level, x: b.x, y: b.y, r: radius(b.level), vx: 0, vy: 0 }));
      this.moving = false; this.flight = null; this.events = []; this.elapsed = 0; this.quiet = 0;
      return true;
    }
    trajectory(angle, level) {
      let x = LAUNCH.x, y = LAUNCH.y, vx = Math.sin(angle), vy = -Math.cos(angle);
      const r = radius(level), path = [{ x, y }];
      for (let i = 0; i < 220; i++) {
        x += vx * 4; y += vy * 4;
        if (x < LEFT + r || x > RIGHT - r) { x = clamp(x, LEFT + r, RIGHT - r); vx = -vx; }
        path.push({ x, y });
        if (y < TOP + r || this.bodies.some(b => Math.hypot(x - b.x, y - b.y) < r + b.r)) break;
      }
      return path;
    }
  }
  return { World, WIDTH, HEIGHT, LEFT, RIGHT, TOP, LIMIT, LAUNCH, radius, clamp };
});

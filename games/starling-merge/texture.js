/* Normalize illustrated sprites into transparent textures; production matte never reaches the UI. */
window.prepareStarlingTexture = function(source) {
  'use strict';
  const surface = document.createElement('canvas');
  surface.width = source.naturalWidth; surface.height = source.naturalHeight;
  const context = surface.getContext('2d', { willReadFrequently: true });
  context.drawImage(source, 0, 0);
  const pixels = context.getImageData(0, 0, surface.width, surface.height);
  const rgba = pixels.data, width = surface.width, height = surface.height, size = width * height;
  const sample = (x, y) => Array.from(rgba.slice((y * width + x) * 4, (y * width + x) * 4 + 3));
  const samples = [sample(2, 2), sample(width - 3, 2), sample(2, height - 3), sample(width - 3, height - 3)];
  const background = [0, 1, 2].map(c => samples.map(s => s[c]).sort((a, b) => a - b)[1]);
  const key = background.indexOf(Math.max(...background)), others = [0, 1, 2].filter(c => c !== key);
  const chromatic = Math.max(...background) - Math.min(...background) > 110;
  const queue = new Int32Array(size);
  if (chromatic) {
    const keyRange = Math.max(1, background[key] - Math.max(background[others[0]], background[others[1]]) - 24);
    for (let i = 0; i < size; i++) {
      const p = i * 4, spill = Math.max(0, rgba[p + key] - Math.max(rgba[p + others[0]], rgba[p + others[1]]) - 24);
      const alpha = Math.max(0, 1 - spill / keyRange);
      if (alpha < .04) { rgba[p + 3] = 0; continue; }
      if (alpha < 1) {
        for (let c = 0; c < 3; c++) rgba[p + c] = Math.max(0, Math.min(255, (rgba[p + c] - background[c] * (1 - alpha)) / alpha));
        rgba[p + 3] = Math.round(alpha * 255);
      }
    }
  } else {
    const seen = new Uint8Array(size); let read = 0, write = 0;
    const distance = i => Math.hypot(rgba[i * 4] - background[0], rgba[i * 4 + 1] - background[1], rgba[i * 4 + 2] - background[2]);
    function visit(i) { if (seen[i]) return; seen[i] = 1; if (distance(i) <= 9) { queue[write++] = i; rgba[i * 4 + 3] = 0; } }
    for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
    for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
    while (read < write) {
      const i = queue[read++], x = i % width;
      if (x > 0) visit(i - 1); if (x < width - 1) visit(i + 1);
      if (i >= width) visit(i - width); if (i < size - width) visit(i + width);
    }
  }
  const labels = new Int32Array(size), regions = []; let label = 0;
  for (let level = 0; level < 8; level++) {
    const left = Math.round(level % 4 * width / 4), right = Math.round((level % 4 + 1) * width / 4);
    const top = Math.round(Math.floor(level / 4) * height / 2), bottom = Math.round((Math.floor(level / 4) + 1) * height / 2);
    let winner = null;
    for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
      const start = y * width + x;
      if (labels[start] || rgba[start * 4 + 3] < 16) continue;
      label++; let read = 0, write = 1; queue[0] = start; labels[start] = label;
      const region = { label, count: 0, minX: x, maxX: x, minY: y, maxY: y };
      function append(i) { if (!labels[i] && rgba[i * 4 + 3] >= 16) { labels[i] = label; queue[write++] = i; } }
      while (read < write) {
        const i = queue[read++], px = i % width, py = Math.floor(i / width); region.count++;
        region.minX = Math.min(region.minX, px); region.maxX = Math.max(region.maxX, px);
        region.minY = Math.min(region.minY, py); region.maxY = Math.max(region.maxY, py);
        if (px > left) append(i - 1); if (px < right - 1) append(i + 1);
        if (py > top) append(i - width); if (py < bottom - 1) append(i + width);
      }
      if (!winner || region.count > winner.count) winner = region;
    }
    if (winner) for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
      const i = y * width + x; if (labels[i] !== winner.label) rgba[i * 4 + 3] = 0;
    }
    regions.push(winner);
  }
  context.putImageData(pixels, 0, 0);
  const result = document.createElement('canvas'); result.width = 1024; result.height = 512;
  const target = result.getContext('2d');
  regions.forEach((r, level) => {
    if (!r) return;
    const w = r.maxX - r.minX + 1, h = r.maxY - r.minY + 1, scale = 220 / Math.max(w, h);
    target.drawImage(surface, r.minX, r.minY, w, h, level % 4 * 256 + (256 - w * scale) / 2,
      Math.floor(level / 4) * 256 + (256 - h * scale) / 2, w * scale, h * scale);
  });
  return result.toDataURL('image/png');
};

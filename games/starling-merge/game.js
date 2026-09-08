(() => {
  'use strict';
  const P = StarlingPhysics, C = PicnicCampaign, collections = StarlingSeries;
  const $ = id => document.getElementById(id), all = selector => [...document.querySelectorAll(selector)];
  const canvas = $('board'), ctx = canvas.getContext('2d'), dialog = $('game-dialog');
  const STORE = 'portfolio.starling-merge.picnic.v2', LEGACY = 'portfolio.starling-merge.v1';
  const classics = ['桃桃绒', '奶油星', '薄荷喵', '云朵酱', '晚安兔', '蜜桃狐', '抱月灵', '星冠团团'];
  const sources = { ...collections, classic: { asset: 'assets/spirits.png' } };
  const slots = { animals: { stars: Array(8).fill(0), run: null }, food: { stars: Array(8).fill(0), run: null } };
  let stageStartShots = 0;
  let seriesId = 'animals', spirits = collections.animals.spirits, avatar = { source: 'animals', level: 0 };
  let world = new P.World(), atlas = new Image(), levelIndex = 0, progress = 0, score = 0, best = 0;
  let current = 0, next = 1, highest = 1, unlocked = 3, undoLeft = 3, history = null, swapped = false, result = 'playing';
  let ready = false, paused = true, pending = false, externalPaused = false, sound = false, audio = null, request = 0;
  let aim = -.24, pointer = null, frame = 0, last = 0, accumulator = 0, combo = 0, dialogKind = '', checkpoint = null;
  let flashes = [], particles = [], labels = [], toastTimer, warnedSave = false;
  let atHome = true;
  if (parent !== window) document.documentElement.dataset.embedded = 'true';
  function renderHome() {
    const hasRun = world.shots > 0 || score > 0 || levelIndex > 0 || result !== 'playing';
    $('home-start').disabled = !ready || pending;
    $('home-start').innerHTML = (hasRun ? '继续野餐' : '开始野餐') + ' <span>↗</span>';
    $('home-restart').hidden = !hasRun;
    $('home-restart').disabled = !ready || pending;
    $('home-progress').textContent = pending ? '正在邀请这组小伙伴…' : !ready ? '正在准备你的小伙伴…' :
      collections[seriesId].title + ' · 第 ' + (levelIndex + 1) + ' / 8 关' + (hasRun ? ' · 已为你保留这一局' : ' · 一场新的相遇');
    all('[data-menu-dialog]').forEach(button => button.disabled = !ready || pending);
  }
  function goHome() {
    persist(); paused = true; stop(); pointer = null; atHome = true;
    dialog.close(); dialogKind = '';
    $('play-screen').hidden = true; $('play-screen').inert = true;
    $('title-screen').hidden = false; renderHome();
    $('home-start').focus({ preventScroll: true });
  }
  function enterGame() {
    if (!ready || pending) return;
    atHome = false; $('title-screen').hidden = true;
    $('play-screen').hidden = false; $('play-screen').inert = false;
    resize(); resume();
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, textures = new Map();
  const stage = () => C.levels[levelIndex], number = n => Math.round(n).toLocaleString('zh-CN');
  const artStyle = i => '--sx:' + (i % 4 * 100 / 3) + '%;--sy:' + (i > 3 ? 100 : 0) + '%';
  const artHTML = (i, cls = '') => '<span class="spirit-art ' + cls + '" style="' + artStyle(i) + '"></span>';
  function setArt(element, i) { element.style.cssText = artStyle(i); }
  function toast(message) {
    $('toast').textContent = message; $('toast').classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2400);
    $('game-announcement').textContent = message;
  }
  function loadTexture(id) {
    if (textures.has(id)) return textures.get(id);
    const promise = new Promise((resolve, reject) => {
      const raw = new Image();
      raw.onload = () => {
        try {
          const url = prepareStarlingTexture(raw), image = new Image();
          image.onload = () => {
            document.documentElement.style.setProperty('--' + id + '-sheet', 'url("' + url + '")');
            resolve({ image, url });
          };
          image.onerror = () => reject(new Error('Texture could not be decoded')); image.src = url;
        } catch (error) { reject(error); }
      };
      raw.onerror = () => reject(new Error('Artwork could not be loaded')); raw.src = sources[id].asset;
    });
    textures.set(id, promise); promise.catch(() => textures.delete(id)); return promise;
  }
  function installTexture(id, texture) {
    seriesId = id; spirits = collections[id].spirits; atlas = texture.image;
    document.documentElement.dataset.series = id;
    document.documentElement.style.setProperty('--spirit-sheet', 'url("' + texture.url + '")');
  }
  function updateAvatar() {
    document.documentElement.style.setProperty('--avatar-sheet', 'var(--' + avatar.source + '-sheet)');
    all('[data-avatar-art]').forEach(el => setArt(el, avatar.level));
  }
  function capture(withHistory = true) {
    return { ruleVersion: 3, board: world.snapshot(), levelIndex, stageStartShots, progress, score, current, next, highest, unlocked, undoLeft, swapped, result,
      history: withHistory ? history : null };
  }
  function validRun(run) {
    return run && Number.isInteger(run.levelIndex) && run.levelIndex >= 0 && run.levelIndex < 8 &&
      ['current', 'next', 'highest'].every(k => Number.isInteger(run[k]) && run[k] >= 0 && run[k] < 8) &&
      Number.isFinite(run.score) && run.score >= 0 && run.score < 1e12 &&
      Number.isInteger(run.progress) && run.progress >= 0 && run.progress < 1000 &&
      Number.isInteger(run.unlocked) && run.unlocked >= 0 && run.unlocked <= 255 &&
      Number.isInteger(run.undoLeft) && run.undoLeft >= 0 && run.undoLeft <= 3;
  }
  function restore(run) {
    if (!validRun(run)) return false;
    const candidate = new P.World();
    if (!candidate.restore(run.board)) return false;
    world = candidate;
    ({ levelIndex, progress, score, current, next, highest, unlocked, undoLeft } = run);
    stageStartShots = Number.isInteger(run.stageStartShots) ? P.clamp(run.stageStartShots, 0, world.shots) : world.shots;
    // Preserve existing saves, but remove the old high-tier launch queue.
    if (run.ruleVersion !== 3) { current = chooseNext(); next = chooseNext(); }
    swapped = !!run.swapped;
    history = validRun(run.history) ? { ...run.history, history: null } : null;
    result = C.outcome(stage(), progress, world.shots, world.isLost());
    flashes = []; particles = []; labels = []; checkpoint = capture(); return true;
  }
  function unlockedLevel(id = seriesId) {
    const first = slots[id].stars.findIndex(n => n === 0); return first < 0 ? 7 : first;
  }
  function fresh() {
    levelIndex = 0; stageStartShots = 0; world = new P.World();
    ({ current, next, highest } = C.seed(world, 0));
    next = chooseNext();
    unlocked = (1 << (highest + 1)) - 1; score = 0; progress = 0;
    undoLeft = 3; history = null; swapped = false; result = 'playing'; combo = 0; aim = -.24;
    flashes = []; particles = []; labels = []; checkpoint = capture();
  }
  function persist(force = false) {
    // Merely opening the title screen must not overwrite a run in another tab.
    if (atHome && !force) return;
    slots[seriesId].run = world.moving ? checkpoint : capture();
    best = Math.max(best, score);
    try { localStorage.setItem(STORE, JSON.stringify({ version: 2, selected: seriesId, avatar, sound, best, slots })); }
    catch { if (!warnedSave) { warnedSave = true; toast('当前浏览器无法保存，本次野餐仍可继续玩'); } }
  }
  function loadStore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved?.version === 2) {
        if (Object.hasOwn(collections, saved.selected)) seriesId = saved.selected;
        sound = !!saved.sound;
        best = Number.isFinite(saved.best) && saved.best >= 0 && saved.best < 1e12 ? saved.best : 0;
        if (saved.avatar && ['animals', 'classic'].includes(saved.avatar.source) && Number.isInteger(saved.avatar.level) && saved.avatar.level >= 0 && saved.avatar.level < 8) avatar = saved.avatar;
        for (const id of Object.keys(slots)) {
          const slot = saved.slots?.[id];
          if (Array.isArray(slot?.stars)) slots[id].stars = Array.from({ length: 8 }, (_, i) => Number.isInteger(slot.stars[i]) ? P.clamp(slot.stars[i], 0, 3) : 0);
          if (validRun(slot?.run)) slots[id].run = slot.run;
        }
        spirits = collections[seriesId].spirits;
        if (restore(slots[seriesId].run)) return true;
        fresh(unlockedLevel(), 0); return false;
      }
      const old = JSON.parse(localStorage.getItem(LEGACY) || 'null');
      const previousTheme = localStorage.getItem('portfolio.starling-merge.series.v1');
      if (Object.hasOwn(collections, previousTheme)) seriesId = previousTheme;
      spirits = collections[seriesId].spirits;
      best = Math.max(0, Number(localStorage.getItem(LEGACY + '.best')) || 0);
      if (old?.version === 1) {
        const migrated = { ...old, levelIndex: 0, progress: 0, undoLeft: Number.isInteger(old.undoLeft) ? P.clamp(old.undoLeft, 0, 3) : 3, history: null, result: 'playing' };
        if (restore(migrated)) { best = Math.max(best, score); return true; }
      }
    } catch {}
    fresh(0, 0); return false;
  }
  function ratingHTML(n) {
    return '<div class="result-stars" aria-label="' + n + '颗星">' + [0, 1, 2].map(i => '<svg' + (i < n ? '' : ' class="dim"') + '><use href="#i-star"/></svg>').join('') + '</div>';
  }
  function pathHTML(map = false) {
    return C.levels.map((s, i) => {
      const completed = i < levelIndex || (i === levelIndex && result === 'won');
      const label = completed ? '已抵达' : i === levelIndex ? '正在这里' : '本局未抵达';
      return '<button type="button" class="path-step' + (i === levelIndex ? ' active' : '') + (completed ? ' complete' : '') +
        '" data-map aria-label="第' + (i + 1) + '关，' + s.name + '，' + label + '"' + (i > levelIndex ? ' disabled' : '') + '><span>' +
        String(i + 1).padStart(2, '0') + '</span><small>' + (slots[seriesId].stars[i] ? '★'.repeat(slots[seriesId].stars[i]) : map ? label : '·') + '</small></button>';
    }).join('');
  }
  function renderUI() {
    renderHome();
    best = Math.max(best, score);
    $('score').textContent = number(score); $('best-score').textContent = number(best);
    $('moves').textContent = world.shots;
    $('level-label').textContent = '第 ' + String(levelIndex + 1).padStart(2, '0') + ' 关';
    $('level-name').textContent = stage().name;
    $('goal-target').textContent = '合成 ' + stage().count + ' 个' + spirits[stage().target].name;
    $('goal-count').textContent = Math.min(progress, stage().count) + ' / ' + stage().count;
    $('goal-fill').style.width = Math.min(100, progress / stage().count * 100) + '%';
    $('goal-progress').setAttribute('aria-valuemax', stage().count);
    $('goal-progress').setAttribute('aria-valuenow', Math.min(progress, stage().count));
    setArt($('goal-art'), stage().target); setArt($('next-art'), next);
    $('current-caption').textContent = '正在出发：' + spirits[current].name;
    $('swap-button').disabled = world.moving || pending || result !== 'playing' || swapped;
    $('swap-button').setAttribute('aria-label', '下一位是' + spirits[next].name + '，点击交换，每次发射前限一次');
    $('undo-button').disabled = !history || !undoLeft || world.moving || pending || result === 'won';
    $('undo-count').textContent = '剩 ' + undoLeft + ' 次';
    $('sound-button').setAttribute('aria-pressed', String(sound));
    $('sound-button').setAttribute('aria-label', sound ? '关闭音效' : '开启音效');
    all('[data-theme]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.theme === seriesId));
      button.disabled = !ready || world.moving || pending;
    });
    all('[data-avatar-button]').forEach(button => { button.disabled = pending; });
    $('mini-album').innerHTML = spirits.map((s, i) => '<span class="mini-item' + (unlocked & 1 << i ? '' : ' locked') + '">' + artHTML(i) + '<small>' + (i + 1) + '</small></span>').join('');
    $('side-album').innerHTML = spirits.map((s, i) => '<div class="side-entry' + (unlocked & 1 << i ? '' : ' locked') + '">' + artHTML(i) + '<small>LV. ' + (i + 1) + '</small><b>' + s.name + '</b></div>').join('');
    $('theme-description').textContent = collections[seriesId].description;
    $('chapter-path').innerHTML = pathHTML();
    $('star-total').textContent = Object.values(slots).reduce((n, slot) => n + slot.stars.reduce((a, b) => a + b, 0), 0) + ' / 48';
    updateAvatar();
  }
  function beep(kind, tier = 0) {
    if (!sound) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return;
      audio ||= new Audio(); audio.resume().catch(() => {});
      (kind === 'merge' ? [523.25, 659.25, 783.99] : [330]).forEach((frequency, i) => {
        const oscillator = audio.createOscillator(), gain = audio.createGain(), time = audio.currentTime + i * .085;
        oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency * (1 + tier * .05), time);
        gain.gain.setValueAtTime(.0001, time); gain.gain.exponentialRampToValueAtTime(.065, time + .015); gain.gain.exponentialRampToValueAtTime(.0001, time + .28);
        oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(time); oscillator.stop(time + .3);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch {}
  }
  function chooseNext() {
    // A permanent low-tier pool: never remove strawberries/cats, and never
    // bias the queue toward pairs on the table or the current chapter goal.
    // Tiers 1/2 use weights 60/30; tier 3 joins with weight 10 once discovered.
    const roll = world.random() * (highest >= 2 ? 100 : 90);
    return roll < 60 ? 0 : roll < 90 ? 1 : 2;
  }
  function fire() {
    if (!ready || paused || pending || world.moving || dialog.open || result !== 'playing') return;
    checkpoint = capture(); history = capture(false); combo = 0;
    if (world.fire(current, aim)) { beep('shoot'); renderUI(); }
  }
  function undo() {
    if (!history || !undoLeft || world.moving || result === 'won' || pending) return;
    const remaining = undoLeft - 1, previous = history;
    if (!restore(previous)) return;
    undoLeft = remaining; history = null; result = 'playing'; renderUI(); persist(); resume();
    toast('退回上一步，再试一个好角度');
  }
  function restartLevel() {
    if (pending) return;
    fresh(); renderUI(); persist(); enterGame();
    toast('从第一关重新出发，历史星星和最高星光仍然保留');
  }
  function advanceLevel() {
    if (pending || world.moving || result !== 'won' || levelIndex >= C.levels.length - 1) return;
    // The table, launch queue, score, shot count and remaining undos all carry on.
    levelIndex++; stageStartShots = world.shots; progress = 0;
    history = null; result = 'playing'; combo = 0;
    checkpoint = capture(); renderUI(); persist(); resume();
    toast('桌上的伙伴都留下来，一起完成新的小心愿');
  }
  async function switchTheme(id) {
    if (!ready || !Object.hasOwn(collections, id) || pending || world.moving || id === seriesId) return;
    const token = ++request; pending = true; paused = true; stop(); persist(); renderUI();
    $('loading-label').hidden = false;
    try {
      const texture = await loadTexture(id); if (token !== request) return;
      installTexture(id, texture);
      if (!restore(slots[id].run)) fresh(unlockedLevel(id), 0);
      pending = false; renderUI(); persist(); $('loading-label').hidden = true;
      resume(); toast(collections[id].title + ' · 第 ' + (levelIndex + 1) + ' 关，接着相遇');
    } catch {
      if (token !== request) return;
      pending = false; $('loading-label').hidden = true; renderUI(); resume(); toast('这组伙伴暂时没载入，再点一次试试');
    }
  }
  function handleEvents() {
    for (const event of world.events.splice(0)) {
      if (event.type === 'merge') {
        combo++; const reward = Math.round(30 * 2 ** (event.level - 1) * (1 + Math.min(combo - 1, 4) * .5));
        score += reward; highest = Math.max(highest, event.level); unlocked |= 1 << event.level;
        if (event.level >= stage().target) progress++;
        flashes.push({ ...event, life: .6 });
        labels.push({ x: event.x, y: event.y - 30, text: combo > 1 ? combo + ' 连合  +' + reward : '+' + reward, life: 1.25 });
        if (!reduce) for (let i = 0; i < 12; i++) {
          const angle = i * Math.PI / 6;
          particles.push({ x: event.x, y: event.y, vx: Math.cos(angle) * (45 + i % 3 * 18), vy: Math.sin(angle) * 65 - 20, life: .7, color: spirits[event.level].color });
        }
        beep('merge', event.level); $('game-announcement').textContent = '遇见' + spirits[event.level].name + '，获得' + reward + '星光'; renderUI();
      } else if (event.type === 'settled') {
        current = next; next = chooseNext(); swapped = false;
        result = C.outcome(stage(), progress, world.shots, event.lost);
        if (result === 'won') slots[seriesId].stars[levelIndex] = Math.max(slots[seriesId].stars[levelIndex], C.stars(world.shots - stageStartShots, stage().moves));
        renderUI(); persist();
        if (result !== 'playing') showDialog(result);
        else if (world.bodies.some(b => b.y + b.r > P.LIMIT - 65)) toast('快到桌边了，试试把相同伙伴碰到一起');
        else if (world.shots % 4 === 0) toast('大家往桌边挪了一点，留意虚线');
      }
    }
  }
  function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
  function drawCharacter(level, x, y, r) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(x, y + r * .84, r * .67, r * .13, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#88816622'; ctx.fill();
    if (atlas.complete && atlas.naturalWidth) {
      const sw = atlas.naturalWidth / 4, sh = atlas.naturalHeight / 2;
      ctx.drawImage(atlas, level % 4 * sw, Math.floor(level / 4) * sh, sw, sh, x - r * 1.37, y - r * 1.37, r * 2.74, r * 2.74);
    } else {
      ctx.fillStyle = spirits[level].color; circle(x, y, r * .8); ctx.fill();
      ctx.fillStyle = '#64563c'; circle(x - 6, y - 1, 2); ctx.fill(); circle(x + 6, y - 1, 2); ctx.fill();
    }
    ctx.restore();
  }
  function draw(time, dt) {
    ctx.clearRect(0, 0, P.WIDTH, P.HEIGHT);
    const danger = world.bodies.some(b => b.id !== world.flight && b.y + b.r > P.LIMIT - 65);
    ctx.save(); ctx.setLineDash([8, 10]); ctx.lineWidth = 2; ctx.strokeStyle = danger ? '#c08972' : '#a2ae8d88';
    ctx.beginPath(); ctx.moveTo(48, P.LIMIT); ctx.lineTo(432, P.LIMIT); ctx.stroke(); ctx.restore();
    if (!world.moving && result === 'playing') {
      const path = world.trajectory(aim, current);
      ctx.save(); ctx.setLineDash([3, 9]); ctx.lineDashOffset = reduce ? 0 : -time * .016;
      ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y); path.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#91a17aa6'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
      const end = path[path.length - 1]; circle(end.x, end.y, 4); ctx.fillStyle = '#8c9b75'; ctx.fill(); ctx.restore();
    }
    for (const body of [...world.bodies].sort((a, b) => a.y - b.y)) {
      const flash = flashes.find(f => f.id === body.id), scale = flash && !reduce ? 1 + Math.sin(flash.life / .6 * Math.PI) * .16 : 1;
      drawCharacter(body.level, body.x, body.y, body.r * scale);
    }
    for (const flash of flashes) flash.life -= dt; flashes = flashes.filter(f => f.life > 0);
    for (const particle of particles) {
      particle.life -= dt; particle.x += particle.vx * dt; particle.y += particle.vy * dt; particle.vy += dt * 45;
      ctx.save(); ctx.globalAlpha = Math.max(0, particle.life / .7); ctx.fillStyle = particle.color; ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.life * 3); ctx.fillRect(-2.5, -2.5, 5, 5); ctx.restore();
    }
    particles = particles.filter(p => p.life > 0);
    for (const label of labels) {
      label.life -= dt; label.y -= dt * 23; ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, label.life * 2));
      ctx.textAlign = 'center'; ctx.font = 'bold 16px "Microsoft YaHei",sans-serif'; ctx.lineWidth = 4; ctx.strokeStyle = '#fff9e7';
      ctx.strokeText(label.text, label.x, label.y); ctx.fillStyle = '#8b9468'; ctx.fillText(label.text, label.x, label.y); ctx.restore();
    }
    labels = labels.filter(l => l.life > 0);
    if (!world.moving && result === 'playing') drawCharacter(current, P.LAUNCH.x, P.LAUNCH.y, P.radius(current) + 2);
  }
  function tick(time) {
    frame = 0; const dt = Math.min(.05, (time - last) / 1000 || 0); last = time;
    if (!paused && !document.hidden) {
      accumulator += dt;
      while (accumulator >= 1 / 120 && !paused) { world.step(1 / 120); handleEvents(); accumulator -= 1 / 120; }
      draw(time, dt);
    }
    if (!paused && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function start() { if (!frame && !paused && !document.hidden) { last = performance.now(); accumulator = 0; frame = requestAnimationFrame(tick); } }
  function stop() { cancelAnimationFrame(frame); frame = 0; }
  function resize() {
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr)); canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(canvas.width / P.WIDTH, 0, 0, canvas.height / P.HEIGHT, 0, 0); draw(performance.now(), 0);
  }
  function action(label, callback, secondary = false) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    if (secondary) button.className = 'secondary'; button.addEventListener('click', callback); $('dialog-actions').appendChild(button);
  }
  function resume() {
    dialog.close(); dialogKind = ''; pointer = null;
    if (atHome) { paused = true; stop(); renderHome(); $('home-start').focus({ preventScroll: true }); return; }
    if (result !== 'playing') return showDialog(result);
    if (pending) return;
    paused = false; externalPaused = false; start(); canvas.focus({ preventScroll: true });
  }
  function exit() {
    persist(); paused = true; stop();
    if (parent !== window) parent.postMessage({ type: 'portfolio-game-exit' }, location.origin);
    else location.href = '../../scroll-world.html#theatre';
  }
  async function selectAvatar(source, index) {
    const status = $('avatar-status'); if (status) status.textContent = '正在戴上新头像…';
    try {
      await loadTexture(source); avatar = { source, level: index }; updateAvatar(); persist(true);
      if (dialogKind === 'avatars') resume(); toast('换好头像啦，野餐小队长');
    } catch { if (status?.isConnected) status.textContent = '头像暂时没载入，点一下可以重试。'; }
  }
  function showDialog(kind = 'pause', selectedLevel = levelIndex) {
    if (!ready || pending) return;
    paused = true; pointer = null; stop(); dialogKind = kind;
    const content = $('dialog-content'), actions = $('dialog-actions');
    content.replaceChildren(); actions.replaceChildren();
    $('dialog-eyebrow').textContent = collections[seriesId].english;
    const action = (label, callback, secondary = false) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
      if (secondary) button.className = 'secondary';
      button.addEventListener('click', callback); actions.append(button);
    };
    if (kind === 'settings') {
      $('dialog-title').textContent = '野餐小设置';
      content.innerHTML = '<p>音效可以随时开关。进度仅保存在当前浏览器中，动物与点心互不覆盖。</p>';
      action(sound ? '关闭音效' : '开启音效', () => { sound = !sound; renderUI(); persist(true); if (sound) beep('merge'); showDialog('settings'); });
      action('选择玩家头像', () => showDialog('avatars'), true);
      action(atHome ? '返回主菜单' : '返回游戏', resume, true);
    } else if (kind === 'avatars') {
      $('dialog-title').textContent = '今天，你是哪位小可爱？';
      content.innerHTML = '<p>头像和正在玩的主题分开选择，换头像不会改变桌面。</p>' + ['animals', 'classic'].map(source =>
        '<h3 class="avatar-group-title">' + (source === 'animals' ? '动物小队' : '经典小伙伴 · 仅作头像') + '</h3><div class="avatar-grid">' +
        (source === 'animals' ? collections.animals.spirits.map(s => s.name) : classics).map((name, i) =>
          '<button type="button" class="avatar-choice" data-source="' + source + '" data-avatar="' + i + '" aria-label="使用' + name + '头像" aria-pressed="' +
          (avatar.source === source && avatar.level === i) + '">' + artHTML(i) + (avatar.source === source && avatar.level === i ? '<small>已选</small>' : '') + '</button>').join('') + '</div>').join('') +
        '<p class="dialog-status" id="avatar-status" role="status">点选一位伙伴作为头像。</p>';
      action('回到野餐桌', resume);
    } else if (kind === 'map') {
      $('dialog-title').textContent = '这是一场连续的野餐';
      content.innerHTML = '<p>过关后桌面不清空，伙伴、星光与剩余撤回次数一起进入下一关。不能跳关；桌满后重新出发。格子里的星星是历史最佳成绩。</p><div class="map-grid">' + pathHTML(true) + '</div><p>动物和点心各自保存这一局，切换主题不会替你重开。</p>';
      action('继续这一局', resume);
    } else if (kind === 'album') {
      $('dialog-title').textContent = '一位一位，慢慢认识';
      content.innerHTML = '<p>第一、第二级一直会随机登场；发现第三级后，它也会少量加入。第四级及以上只能通过合成得到。</p><div class="album-grid">' +
        spirits.map((s, i) => '<div class="album-entry' + (unlocked & 1 << i ? '' : ' locked') + '">' + artHTML(i) + '<small>LV. ' + (i + 1) + '</small><b>' + s.name + '</b></div>').join('') + '</div>';
      action('回到野餐桌', resume);
    } else if (kind === 'won') {
      const chapterShots = Math.max(0, world.shots - stageStartShots), stars = C.stars(chapterShots, stage().moves);
      $('dialog-title').textContent = levelIndex === 7 ? '全员到齐，野餐圆满！' : '小心愿完成，旅程继续';
      content.innerHTML = '<div class="result-hero album-entry">' + artHTML(stage().target) + '</div>' + ratingHTML(stars) +
        '<div class="result-metrics"><span><b>' + number(score) + '</b><small>本局星光</small></span><span><b>' + chapterShots + '</b><small>本关发射</small></span></div>' +
        '<p>' + (levelIndex === 7 ? '你带着同一桌伙伴走完了八关。历史成绩已保留，可以重新挑战，或去另一组伙伴的野餐。' : '不会清空桌面，也不会替换成高级伙伴。带着现在的局面继续挑战，低等级伙伴仍会随机出现。') + '</p>';
      if (levelIndex < 7) action('带着伙伴去下一关', advanceLevel);
      else {
        action('从第一关再挑战', restartLevel);
        action('去另一场野餐', () => { dialog.close(); switchTheme(seriesId === 'animals' ? 'food' : 'animals'); }, true);
      }
      action('看看本局旅程', () => showDialog('map'), true);
    } else if (kind === 'lost') {
      $('dialog-title').textContent = '桌子坐满啦';
      content.innerHTML = '<p>伙伴已经挤到警戒线，这一局停在第 ' + (levelIndex + 1) + ' 关。重新挑战会从第一关开始，不是只重玩当前关；历史星星、最高星光和另一主题的旅程都会保留。</p><div class="result-metrics"><span><b>' + number(score) + '</b><small>本局星光</small></span><span><b>' + world.shots + '</b><small>累计发射</small></span></div>';
      action('从第一关重新开始', restartLevel);
      if (history && undoLeft > 0) action('用一次撤回挽救这一局', undo, true);
    } else if (kind === 'restart') {
      $('dialog-title').textContent = '重新开始整场野餐？';
      content.innerHTML = '<p>这会清空当前主题的桌面和本局星光，回到第一关。历史星星、最高星光和另一主题的当前局面不会被清除。</p>';
      action('从第一关重新开始', restartLevel); action(atHome ? '返回主菜单' : '继续这一局', resume, true);
    } else if (kind === 'help') {
      $('dialog-title').textContent = '一起把小可爱碰到一起';
      content.innerHTML = '<p>按住桌面瞄准，松手发射。三个同级伙伴靠近成一组，就会合成下一级；不需要紧紧贴合。</p><p>低等级始终保留在随机池里，不会因为桌上没有它就停止出现。发现第三级后，第一至三级的出现概率分别为 60%、30%、10%；第四级及以上只能合成。</p><p>完成任务进入下一关，但桌面不清空。每四次发射，伙伴向桌边挪一点；没有强制发射次数上限，挤到警戒线才失败。每局共有三次撤回。</p><p>桌满后可以使用剩余撤回挽救，或从第一关重新挑战。每关星星按这一关使用的发射次数评定，只影响成绩，不限制继续玩。</p><p>动物与点心各自保存一整局。方向键瞄准，空格发射，P 暂停。</p>';
      action(atHome ? '返回主菜单' : '继续游戏', resume);
    } else {
      $('dialog-title').textContent = '先歇一小会儿';
      content.innerHTML = '<p>伙伴们会留在原地等你。当前是第 ' + (levelIndex + 1) + ' 关，本局已发射 ' + world.shots + ' 次。</p>';
      action('继续游戏', resume);
      action('怎么玩', () => showDialog('help'), true);
      action('重新开始整场野餐', () => showDialog('restart'), true);
      action('伙伴图鉴', () => showDialog('album'), true);
      action('设置', () => showDialog('settings'), true);
      action('保存并返回主菜单', goHome, true);
    }
    if (!atHome && ['won', 'lost', 'help', 'album', 'map', 'settings'].includes(kind)) action('保存并返回主菜单', goHome, true);
    if (!dialog.open) dialog.showModal();
  }
  function aimAt(event) {
    const rect = canvas.getBoundingClientRect(), x = (event.clientX - rect.left) / rect.width * P.WIDTH, y = (event.clientY - rect.top) / rect.height * P.HEIGHT;
    if (y < 278) return false;
    aim = P.clamp(Math.atan2(x - P.LAUNCH.x, Math.max(70, P.LAUNCH.y - y)), -1.12, 1.12); return true;
  }
  canvas.addEventListener('pointerdown', e => {
    if (e.button !== 0 || pointer !== null || !ready || paused || pending || world.moving || result !== 'playing' || !aimAt(e)) return;
    pointer = e.pointerId; canvas.setPointerCapture(pointer); canvas.focus({ preventScroll: true });
  });
  canvas.addEventListener('pointermove', e => { if (!paused && !world.moving && (e.pointerType === 'mouse' || pointer === e.pointerId)) aimAt(e); });
  canvas.addEventListener('pointerup', e => {
    if (pointer !== e.pointerId) return;
    pointer = null; const rect = canvas.getBoundingClientRect();
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) fire();
  });
  canvas.addEventListener('pointercancel', () => { pointer = null; });
  canvas.addEventListener('lostpointercapture', () => { pointer = null; });
  document.addEventListener('keydown', e => {
    if (atHome) return;
    if (dialog.open || e.target.closest('button,a,input,textarea,select')) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); aim = P.clamp(aim + (e.key === 'ArrowLeft' ? -.05 : .05), -1.12, 1.12); }
    if (e.code === 'Space' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) fire(); }
    if (e.key.toLowerCase() === 'p' && !e.repeat) showDialog(result === 'playing' ? 'pause' : result);
    if (e.key === 'Escape') { e.preventDefault(); showDialog(result === 'playing' ? 'pause' : result); if (parent !== window) parent.postMessage({ type: 'portfolio-game-exit' }, location.origin); }
  });
  document.addEventListener('click', e => {
    const menuButton = e.target.closest('[data-menu-dialog]');
    if (menuButton) return showDialog(menuButton.dataset.menuDialog);
    const theme = e.target.closest('[data-theme]'); if (theme) return void switchTheme(theme.dataset.theme);
    if (e.target.closest('[data-avatar-button]')) return showDialog('avatars');
    if (e.target.closest('[data-map]')) return showDialog('map');
    const avatarButton = e.target.closest('[data-avatar]');
    if (avatarButton) return void selectAvatar(avatarButton.dataset.source, Number(avatarButton.dataset.avatar));
    const levelButton = e.target.closest('[data-level]');
    if (levelButton && !levelButton.disabled) {
      const index = Number(levelButton.dataset.level); if (index > unlockedLevel()) return;
      if (index === levelIndex && result === 'playing') resume(); else showDialog('restart', index);
    }
  });
  $('sound-button').addEventListener('click', () => { sound = !sound; renderUI(); persist(); if (sound) beep('merge'); });
  $('home-start').addEventListener('click', enterGame);
  $('home-restart').addEventListener('click', () => showDialog('restart'));
  $('home-exit').addEventListener('click', exit);
  $('pause-button').addEventListener('click', () => showDialog(result === 'playing' ? 'pause' : result));
  $('help-button').addEventListener('click', () => showDialog('help'));
  $('album-button').addEventListener('click', () => showDialog('album'));
  $('undo-button').addEventListener('click', undo);
  $('swap-button').addEventListener('click', () => {
    if (world.moving || swapped || pending || result !== 'playing') return;
    [current, next] = [next, current]; swapped = true; renderUI(); persist();
  });
  $('dialog-close').addEventListener('click', resume);
  dialog.addEventListener('cancel', e => { e.preventDefault(); resume(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (!atHome && ready && !dialog.open && !pending) showDialog(result === 'playing' ? 'pause' : result); stop(); }
    else if (!paused) start();
  });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'portfolio-game-pause') return;
    externalPaused = true; if (!atHome && ready && !dialog.open) showDialog(result === 'playing' ? 'pause' : result); persist();
  });
  window.addEventListener('pagehide', () => { persist(); stop(); audio?.suspend().catch(() => {}); });
  window.addEventListener('pageshow', () => { if (ready && !paused) start(); });
  new ResizeObserver(resize).observe(canvas);
  const returned = loadStore(); renderUI();
  function begin(fallback = false) {
    if (ready) return;
    ready = true; $('loading-label').hidden = true; resize(); persist();
    paused = true; stop(); renderUI();
    if (fallback) toast('插画暂时没载入，稍后可以刷新试试');
    else if (returned) toast('欢迎回来，伙伴们还在原位等你');
    else toast('试着瞄准左上方的两个' + spirits[0].name);
  }
  loadTexture(seriesId).then(texture => { installTexture(seriesId, texture); begin(); }).catch(() => begin(true));
  Object.keys(sources).filter(id => id !== seriesId).forEach(id => { loadTexture(id).catch(() => {}); });
  setTimeout(() => begin(!atlas.naturalWidth), 8000);
})();

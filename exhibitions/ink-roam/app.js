(() => {
  'use strict';

  const body = document.body;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo({ top: 0, left: 0, behavior: 'auto' });
  const threshold = document.querySelector('.threshold');
  const openingCanvas = document.querySelector('#opening-ink-canvas');
  const openingContext = openingCanvas.getContext('2d');
  const thresholdInk = document.querySelector('.threshold-ink');
  const cursor = document.querySelector('.ink-cursor');
  const gestureCanvas = document.querySelector('#gesture-canvas');
  const gestureContext = gestureCanvas.getContext('2d');
  const soundControl = document.querySelector('.sound-control');
  const portfolioReturn = document.querySelector('.portfolio-return');
  const guideControl = document.querySelector('.guide-control');
  const artDialog = document.querySelector('.art-dialog');
  const dialogImage = artDialog.querySelector('img');
  const nav = document.querySelector('.passage-index');
  const releaseMark = document.querySelector('.release-mark');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = matchMedia('(pointer: coarse)').matches;

  const state = {
    entered: false,
    enteredAt: 0,
    pointer: { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, active: false },
    gathering: false,
    suppressClick: false,
    gatherTimer: null,
    ripples: [],
    blooms: [],
    revealed: new Set(),
    nextReveal: 1,
    wheelDepth: 0,
    scrollRatio: 0,
    activePassage: 0,
    hushUntil: 0,
    audio: null,
    soundEnabled: new URLSearchParams(location.search).get('sound') !== '0',
    lastTrail: { x: innerWidth / 2, y: innerHeight / 2 },
    openingStartedAt: performance.now(),
  };

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  soundControl.setAttribute('aria-pressed', String(state.soundEnabled));
  if (portfolioReturn) {
    portfolioReturn.href = new URLSearchParams(location.search).get('return') ||
      (location.port === '3003'
        ? 'http://127.0.0.1:8080/portfolio-entry-preview.html#opening'
        : '../../portfolio-entry-preview.html#opening');
  }
  soundControl.setAttribute('aria-label', state.soundEnabled ? '关闭环境声音' : '开启环境声音');

  function enterMuseum() {
    if (state.entered) return;
    state.entered = true;
    state.enteredAt = performance.now();
    body.classList.add('entered');
    initAudio();
    addInkBloom(state.pointer.x, state.pointer.y, 1.7);
    addRipple(state.pointer.x, state.pointer.y, true);
  }

  function createOpeningInk() {
    const image = new Image();
    let ratio = 1;
    let seed = 7631;
    const fluid = {
      columns: coarsePointer ? 18 : 26,
      rows: coarsePointer ? 8 : 11,
      cells: [],
      pointer: { x: innerWidth / 2, y: innerHeight / 2, lastX: innerWidth / 2, lastY: innerHeight / 2, lastAt: 0 },
      wakes: [],
      ready: false,
    };
    const random = () => {
      seed = Math.imul(seed ^ seed >>> 15, 1 | seed);
      seed ^= seed + Math.imul(seed ^ seed >>> 7, 61 | seed);
      return ((seed ^ seed >>> 14) >>> 0) / 4294967296;
    };
    const drops = Array.from({ length: 13 }, (_, index) => ({
      x: .08 + random() * .84,
      y: .22 + random() * .56,
      delay: index * .17 + random() * .55,
      size: 24 + random() * 76,
      stretch: .55 + random() * 1.3,
      phase: random() * Math.PI * 2,
      tone: index % 4 === 0 ? 'warm' : 'ink',
    }));

    function resetFluid() {
      fluid.cells = Array.from({ length: fluid.columns * fluid.rows }, () => ({ x: 0, y: 0, vx: 0, vy: 0 }));
      fluid.wakes.length = 0;
      fluid.ready = false;
    }

    function imageRect() {
      const width = Math.min(innerWidth * (innerWidth < 760 ? 1.38 : .88), 1560);
      const height = width * (image.naturalHeight || 815) / (image.naturalWidth || 1857);
      return { width, height, left: (innerWidth - width) / 2, top: (innerHeight - height) / 2 };
    }

    function resize() {
      ratio = Math.min(devicePixelRatio || 1, 1.4);
      openingCanvas.width = Math.round(innerWidth * ratio);
      openingCanvas.height = Math.round(innerHeight * ratio);
      openingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      resetFluid();
    }

    function stirInk(event) {
      if (state.entered || !fluid.ready || reducedMotion) return;
      const now = performance.now();
      const dx = event.clientX - fluid.pointer.lastX;
      const dy = event.clientY - fluid.pointer.lastY;
      const elapsed = Math.max(8, now - fluid.pointer.lastAt);
      const speed = Math.min(52, Math.hypot(dx, dy) * 16 / elapsed);
      fluid.pointer = { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, lastAt: now };
      if (speed < .45) return;

      const rect = imageRect();
      const radius = Math.min(190, 108 + speed * 2.1);
      for (let row = 0; row < fluid.rows; row += 1) {
        for (let column = 0; column < fluid.columns; column += 1) {
          const index = row * fluid.columns + column;
          const cell = fluid.cells[index];
          const px = rect.left + (column + .5) / fluid.columns * rect.width + cell.x;
          const py = rect.top + (row + .5) / fluid.rows * rect.height + cell.y;
          const offsetX = px - event.clientX;
          const offsetY = py - event.clientY;
          const distance = Math.hypot(offsetX, offsetY);
          if (distance >= radius || distance < 1) continue;
          const falloff = Math.pow(1 - distance / radius, 2);
          const tangentX = -offsetY / distance;
          const tangentY = offsetX / distance;
          const direction = dx * offsetY - dy * offsetX > 0 ? 1 : -1;
          cell.vx += (dx * .19 + tangentX * speed * .74 * direction) * falloff;
          cell.vy += (dy * .19 + tangentY * speed * .74 * direction) * falloff;
        }
      }
      fluid.wakes.push({ x: event.clientX, y: event.clientY, dx, dy, life: 1, radius: 18 + speed * 1.9 });
      if (fluid.wakes.length > 24) fluid.wakes.shift();
    }

    function wetShape(drop, growth, time) {
      const x = drop.x * innerWidth + Math.sin(time * .00032 + drop.phase) * 22;
      const y = drop.y * innerHeight + Math.cos(time * .00025 + drop.phase) * 13;
      const radius = drop.size * (1 - Math.pow(1 - growth, 2.4));
      openingContext.save();
      openingContext.translate(x, y);
      openingContext.rotate(drop.phase + Math.sin(time * .00018) * .16);
      openingContext.scale(drop.stretch, .72 + Math.sin(drop.phase) * .11);
      const shape = new Path2D();
      const points = 30;
      const edgePoints = [];
      for (let point = 0; point < points; point += 1) {
        const angle = point / points * Math.PI * 2;
        const edge = 1 + Math.sin(angle * 5 + drop.phase) * .13 + Math.sin(angle * 9 - drop.phase) * .055;
        edgePoints.push({ x: Math.cos(angle) * radius * edge, y: Math.sin(angle) * radius * edge });
      }
      const first = edgePoints[0];
      const last = edgePoints[edgePoints.length - 1];
      shape.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
      edgePoints.forEach((point, index) => {
        const next = edgePoints[(index + 1) % edgePoints.length];
        shape.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
      });
      shape.closePath();
      const wash = openingContext.createRadialGradient(-radius * .18, -radius * .12, 1, 0, 0, radius * 1.14);
      const warm = drop.tone === 'warm';
      wash.addColorStop(0, warm ? `rgba(112,78,56,${.2 * growth})` : `rgba(8,13,12,${.42 * growth})`);
      wash.addColorStop(.48, warm ? `rgba(126,97,73,${.07 * growth})` : `rgba(25,36,34,${.16 * growth})`);
      wash.addColorStop(.78, `rgba(47,61,58,${.075 * growth})`);
      wash.addColorStop(1, 'rgba(38,48,46,0)');
      openingContext.fillStyle = wash;
      openingContext.shadowBlur = 16 + radius * .22;
      openingContext.shadowColor = `rgba(20,29,27,${.18 * growth})`;
      openingContext.fill(shape);
      openingContext.shadowBlur = 0;
      openingContext.globalAlpha = .28 * growth;
      openingContext.filter = `blur(${Math.max(1.5, radius * .045)}px)`;
      openingContext.fill(shape);
      openingContext.filter = 'none';
      openingContext.restore();
    }

    function brushFlight(progress, time) {
      const travel = Math.min(1, progress * 1.45);
      const startX = -innerWidth * .1;
      const endX = innerWidth * 1.08;
      const head = startX + (endX - startX) * travel;
      openingContext.save();
      openingContext.lineCap = 'round';
      for (let strand = 0; strand < 7; strand += 1) {
        const offset = (strand - 3) * 7;
        openingContext.beginPath();
        openingContext.moveTo(startX, innerHeight * .54 + offset);
        openingContext.bezierCurveTo(
          innerWidth * .24,
          innerHeight * (.28 + strand * .012),
          innerWidth * .64,
          innerHeight * (.72 - strand * .014),
          head,
          innerHeight * .47 + Math.sin(time * .0012 + strand) * 18 + offset
        );
        openingContext.strokeStyle = `rgba(19,28,26,${.028 + (6 - strand) * .009})`;
        openingContext.lineWidth = 2 + (strand % 3) * 2.2;
        openingContext.stroke();
      }
      openingContext.restore();
    }

    function drawCalligraphy(progress, time) {
      if (!image.complete || !image.naturalWidth || progress <= 0) return;
      const width = Math.min(innerWidth * (innerWidth < 760 ? 1.38 : .88), 1560);
      const height = width * image.naturalHeight / image.naturalWidth;
      const left = (innerWidth - width) / 2;
      const top = (innerHeight - height) / 2;
      const columns = 34;
      openingContext.save();
      openingContext.globalCompositeOperation = 'multiply';
      for (let column = 0; column < columns; column += 1) {
        const phase = column / columns;
        const local = Math.max(0, Math.min(1, (progress - phase * .48) / .36));
        if (local <= 0) continue;
        const sourceX = image.naturalWidth * phase;
        const sourceWidth = image.naturalWidth / columns + 2;
        const destX = left + width * phase;
        const destWidth = width / columns + 2;
        const bleed = (1 - local) * (8 + Math.sin(column * 2.17) * 4);
        openingContext.globalAlpha = .2 + local * .7;
        openingContext.filter = `blur(${Math.max(0, bleed)}px)`;
        openingContext.drawImage(image, sourceX, 0, sourceWidth, image.naturalHeight, destX, top, destWidth, height);
      }
      openingContext.filter = 'none';
      openingContext.globalAlpha = .13 + Math.sin(time * .0016) * .025;
      openingContext.drawImage(image, left - 2, top + 2, width + 4, height);
      openingContext.restore();
    }

    function updateFluid() {
      const nextVelocity = fluid.cells.map((cell, index) => {
        const column = index % fluid.columns;
        const row = Math.floor(index / fluid.columns);
        let neighborX = 0;
        let neighborY = 0;
        let count = 0;
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([cx, cy]) => {
          const nx = column + cx;
          const ny = row + cy;
          if (nx < 0 || nx >= fluid.columns || ny < 0 || ny >= fluid.rows) return;
          const neighbor = fluid.cells[ny * fluid.columns + nx];
          neighborX += neighbor.vx;
          neighborY += neighbor.vy;
          count += 1;
        });
        const smoothX = count ? neighborX / count : 0;
        const smoothY = count ? neighborY / count : 0;
        return {
          vx: (cell.vx * .82 + smoothX * .09 - cell.x * .018) * .955,
          vy: (cell.vy * .82 + smoothY * .09 - cell.y * .018) * .955,
        };
      });
      fluid.cells.forEach((cell, index) => {
        cell.vx = nextVelocity[index].vx;
        cell.vy = nextVelocity[index].vy;
        cell.x = clamp(cell.x + cell.vx, -88, 88);
        cell.y = clamp(cell.y + cell.vy, -72, 72);
      });
    }

    function drawFluidCalligraphy(opacity = 1) {
      if (!image.complete || !image.naturalWidth) return;
      const rect = imageRect();
      const sourceWidth = image.naturalWidth / fluid.columns;
      const sourceHeight = image.naturalHeight / fluid.rows;
      const tileWidth = rect.width / fluid.columns;
      const tileHeight = rect.height / fluid.rows;
      updateFluid();
      openingContext.save();
      openingContext.globalCompositeOperation = 'multiply';
      openingContext.globalAlpha = .9 * opacity;
      for (let row = 0; row < fluid.rows; row += 1) {
        for (let column = 0; column < fluid.columns; column += 1) {
          const cell = fluid.cells[row * fluid.columns + column];
          const angle = clamp(cell.vx * .006, -.09, .09);
          const centerX = rect.left + (column + .5) * tileWidth + cell.x;
          const centerY = rect.top + (row + .5) * tileHeight + cell.y;
          openingContext.save();
          openingContext.translate(centerX, centerY);
          openingContext.rotate(angle);
          openingContext.drawImage(
            image,
            column * sourceWidth,
            row * sourceHeight,
            sourceWidth + 2,
            sourceHeight + 2,
            -tileWidth / 2 - 1.2,
            -tileHeight / 2 - 1.2,
            tileWidth + 2.4 + Math.min(9, Math.abs(cell.vx) * .28),
            tileHeight + 2.4 + Math.min(7, Math.abs(cell.vy) * .25)
          );
          openingContext.restore();
        }
      }
      openingContext.restore();
    }

    function drawFluidWakes() {
      fluid.wakes = fluid.wakes.filter((wake) => wake.life > .025);
      fluid.wakes.forEach((wake) => {
        wake.life *= .935;
        wake.radius += 1.45;
        const speed = Math.max(1, Math.hypot(wake.dx, wake.dy));
        const angle = Math.atan2(wake.dy, wake.dx);
        openingContext.save();
        openingContext.translate(wake.x, wake.y);
        openingContext.rotate(angle);
        openingContext.scale(1.55, .72);
        const gradient = openingContext.createRadialGradient(0, 0, 1, 0, 0, wake.radius);
        gradient.addColorStop(0, `rgba(18,27,25,${wake.life * .115})`);
        gradient.addColorStop(.38, `rgba(41,55,51,${wake.life * .07})`);
        gradient.addColorStop(.75, `rgba(64,82,77,${wake.life * .035})`);
        gradient.addColorStop(1, 'rgba(50,68,63,0)');
        openingContext.fillStyle = gradient;
        openingContext.beginPath();
        openingContext.ellipse(0, 0, wake.radius + speed * .35, wake.radius, 0, 0, Math.PI * 2);
        openingContext.fill();
        openingContext.restore();
      });
    }

    function animate(now) {
      openingContext.clearRect(0, 0, innerWidth, innerHeight);
      const seconds = (now - state.openingStartedAt) / 1000;
      const progress = reducedMotion ? 1 : clamp(seconds / 4.4);
      drops.forEach((drop) => {
        const growth = clamp((seconds - drop.delay) / (1.35 + drop.size / 120));
        if (growth > 0) wetShape(drop, growth * (state.entered ? .65 : 1), now);
      });
      if (!state.entered) {
        brushFlight(progress, now);
        const reveal = clamp((seconds - .55) / 3.7);
        if (reveal < .9) drawCalligraphy(reveal, now);
        if (reveal > .72) drawFluidCalligraphy(clamp((reveal - .72) / .28));
        drawFluidWakes();
        if (reveal >= .985 && !fluid.ready) {
          fluid.ready = true;
          fluid.pointer = {
            x: state.pointer.x,
            y: state.pointer.y,
            lastX: state.pointer.x,
            lastY: state.pointer.y,
            lastAt: performance.now(),
          };
          body.classList.add('ink-ready');
        }
      }
      requestAnimationFrame(animate);
    }

    image.src = './assets/calligraphy/calligraphy-ink.png';
    resize();
    addEventListener('resize', resize);
    addEventListener('pointermove', stirInk, { passive: true });
    addEventListener('ink-replay', resetFluid);
    requestAnimationFrame(animate);
  }

  function replayGuide() {
    threshold.style.transitionDelay = '0s';
    body.classList.remove('entered');
    body.classList.remove('ink-ready');
    dispatchEvent(new Event('ink-replay'));
    state.entered = false;
    state.enteredAt = 0;
    state.openingStartedAt = performance.now();
    state.revealed.clear();
    state.nextReveal = 1;
    document.querySelectorAll('.passage').forEach((passage) => passage.classList.remove('is-revealed', 'is-summoning'));
    scrollTo({ top: 0, left: 0, behavior: 'auto' });
    thresholdInk.style.animation = 'none';
    void thresholdInk.offsetWidth;
    thresholdInk.style.animation = '';
    setTimeout(() => { threshold.style.transitionDelay = ''; }, 60);
  }

  threshold.addEventListener('pointerdown', enterMuseum);
  threshold.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      enterMuseum();
    }
  });
  guideControl.addEventListener('click', replayGuide);

  function setPointer(event) {
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    state.pointer.nx = event.clientX / innerWidth * 2 - 1;
    state.pointer.ny = -(event.clientY / innerHeight * 2 - 1);
    state.pointer.active = true;
    body.classList.add('pointer-active');
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) scale(1)`;
    body.style.setProperty('--mist-x', `${state.pointer.nx * 7}vw`);
    body.style.setProperty('--mist-y', `${-state.pointer.ny * 4}vh`);
    body.style.setProperty('--mist-x-back', `${state.pointer.nx * -4.5}vw`);
    body.style.setProperty('--mist-y-back', `${state.pointer.ny * 2.2}vh`);

    const activeSpirit = document.querySelector('.passage.is-active .spirit');
    if (activeSpirit) {
      activeSpirit.style.setProperty('--look-x', `${state.pointer.nx * 13}px`);
      activeSpirit.style.setProperty('--look-y', `${-state.pointer.ny * 8}px`);
    }

    if (state.entered && !coarsePointer) {
      const trailDistance = Math.hypot(event.clientX - state.lastTrail.x, event.clientY - state.lastTrail.y);
      if (trailDistance > 34) {
        const trailAngle = Math.atan2(event.clientY - state.lastTrail.y, event.clientX - state.lastTrail.x);
        addRipple(event.clientX, event.clientY, false, true, trailAngle);
        state.lastTrail = { x: event.clientX, y: event.clientY };
      }
    }
  }

  addEventListener('pointermove', setPointer, { passive: true });
  addEventListener('pointerleave', () => {
    state.pointer.active = false;
    body.classList.remove('pointer-active');
    document.querySelector('.passage.is-active .spirit')?.style.setProperty('--look-x', '0px');
    document.querySelector('.passage.is-active .spirit')?.style.setProperty('--look-y', '0px');
  });

  document.addEventListener('pointerdown', (event) => {
    if (!state.entered || event.target.closest('button, dialog')) return;
    addRipple(event.clientX, event.clientY);
    clearTimeout(state.gatherTimer);
    state.gatherTimer = setTimeout(() => {
      state.gathering = true;
      state.suppressClick = true;
      body.classList.add('gathering');
    }, 420);
  });

  function releaseGather() {
    clearTimeout(state.gatherTimer);
    const didGather = state.gathering;
    state.gathering = false;
    body.classList.remove('gathering');
    if (didGather) {
      addInkBloom(state.pointer.x, state.pointer.y, 1.28);
      setTimeout(() => { state.suppressClick = false; }, 120);
    }
  }

  addEventListener('pointerup', releaseGather);
  addEventListener('pointercancel', releaseGather);
  document.addEventListener('dblclick', (event) => {
    if (event.target.closest('button, dialog')) return;
    state.hushUntil = performance.now() + 2300;
    body.classList.add('hushed');
    setTimeout(() => body.classList.remove('hushed'), 2300);
  });

  function resizeGestureCanvas() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    gestureCanvas.width = Math.round(innerWidth * ratio);
    gestureCanvas.height = Math.round(innerHeight * ratio);
    gestureContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function addRipple(x, y, strong = false, trail = false, angle = 0) {
    state.ripples.push({
      x,
      y,
      radius: strong ? 8 : trail ? 2.4 : 3,
      life: 1,
      strong,
      trail,
      angle,
      phase: Math.random() * Math.PI * 2,
      stretch: .78 + Math.random() * 1.35,
    });
    if (state.ripples.length > 46) state.ripples.shift();
  }

  function addInkBloom(x, y, strength = 1) {
    const phase = Math.random() * Math.PI * 2;
    const droplets = Array.from({ length: 9 }, (_, index) => ({
      angle: phase + index / 9 * Math.PI * 2 + Math.sin(index * 3.1) * .2,
      distance: .66 + (index % 4) * .16,
      size: .018 + (index % 3) * .011,
    }));
    state.blooms.push({ x, y, radius: 9, life: 1, phase, strength, droplets });
    if (state.blooms.length > 7) state.blooms.shift();
  }

  function revealPassage(number, x = innerWidth / 2, y = innerHeight / 2) {
    const sceneNumber = clamp(Number(number), 1, 10);
    const passage = document.querySelector(`.passage[data-passage="${sceneNumber}"]`);
    if (!passage) return;

    addInkBloom(x, y);
    addRipple(x, y, true);
    passage.classList.add('is-summoning');
    passage.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: sceneNumber === 10 ? 'end' : 'start',
    });

    if (sceneNumber <= 9 && !state.revealed.has(sceneNumber)) {
      state.revealed.add(sceneNumber);
      setTimeout(() => passage.classList.add('is-revealed'), reducedMotion ? 0 : 380);
      setTimeout(chime, reducedMotion ? 0 : 460);
    }

    state.nextReveal = Math.min(10, sceneNumber + 1);
    setTimeout(() => passage.classList.remove('is-summoning'), reducedMotion ? 20 : 2100);
  }

  document.addEventListener('click', (event) => {
    if (!state.entered || state.suppressClick || event.target.closest('button, dialog')) return;
    const current = state.activePassage >= 1 && state.activePassage <= 9 && !state.revealed.has(state.activePassage)
      ? state.activePassage
      : state.nextReveal;
    revealPassage(current, event.clientX, event.clientY);
  });

  function drawRipples() {
    gestureContext.clearRect(0, 0, innerWidth, innerHeight);
    state.blooms = state.blooms.filter((bloom) => bloom.life > .02);
    state.blooms.forEach((bloom) => {
      bloom.life *= .978;
      bloom.radius += 2.15 * bloom.strength;
      gestureContext.save();
      gestureContext.translate(bloom.x, bloom.y);
      gestureContext.rotate(bloom.phase + bloom.radius * .004);
      gestureContext.scale(1, .68);

      const wetEdge = new Path2D();
      const points = 42;
      for (let index = 0; index <= points; index += 1) {
        const angle = index / points * Math.PI * 2;
        const wobble = 1 + Math.sin(angle * 5 + bloom.phase) * .085 + Math.sin(angle * 11 - bloom.phase * .7) * .045;
        const radius = bloom.radius * wobble;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (index === 0) wetEdge.moveTo(px, py);
        else wetEdge.lineTo(px, py);
      }
      wetEdge.closePath();

      const wash = gestureContext.createRadialGradient(
        -bloom.radius * .17,
        -bloom.radius * .12,
        bloom.radius * .03,
        0,
        0,
        bloom.radius * 1.05
      );
      wash.addColorStop(0, `rgba(19, 25, 23, ${bloom.life * .16})`);
      wash.addColorStop(.28, `rgba(35, 47, 44, ${bloom.life * .105})`);
      wash.addColorStop(.71, `rgba(75, 91, 86, ${bloom.life * .048})`);
      wash.addColorStop(.9, `rgba(27, 34, 32, ${bloom.life * .075})`);
      wash.addColorStop(1, 'rgba(27, 34, 32, 0)');
      gestureContext.fillStyle = wash;
      gestureContext.shadowBlur = 10 + bloom.radius * .08;
      gestureContext.shadowColor = `rgba(38, 50, 47, ${bloom.life * .06})`;
      gestureContext.fill(wetEdge);

      gestureContext.shadowBlur = 0;
      gestureContext.strokeStyle = `rgba(19, 25, 23, ${bloom.life * .09})`;
      gestureContext.lineWidth = .55 + bloom.life * .8;
      gestureContext.stroke(wetEdge);

      bloom.droplets.forEach((drop, index) => {
        const distance = bloom.radius * drop.distance;
        const size = Math.max(1.1, bloom.radius * drop.size);
        gestureContext.beginPath();
        gestureContext.ellipse(
          Math.cos(drop.angle) * distance,
          Math.sin(drop.angle) * distance,
          size * (1 + index % 2 * .45),
          size,
          drop.angle,
          0,
          Math.PI * 2
        );
        gestureContext.fillStyle = `rgba(22, 29, 27, ${bloom.life * (.045 + index % 3 * .012)})`;
        gestureContext.fill();
      });
      gestureContext.restore();
    });
    state.ripples = state.ripples.filter((ripple) => ripple.life > .012);
    state.ripples.forEach((ripple) => {
      if (ripple.trail) {
        ripple.life *= .93;
        ripple.radius += .12;
        gestureContext.save();
        gestureContext.translate(ripple.x, ripple.y);
        gestureContext.rotate(ripple.angle);
        const dryBrush = gestureContext.createLinearGradient(-18 * ripple.stretch, 0, 18 * ripple.stretch, 0);
        dryBrush.addColorStop(0, 'rgba(16, 20, 18, 0)');
        dryBrush.addColorStop(.17, `rgba(16, 20, 18, ${ripple.life * .025})`);
        dryBrush.addColorStop(.5, `rgba(16, 20, 18, ${ripple.life * .073})`);
        dryBrush.addColorStop(.83, `rgba(16, 20, 18, ${ripple.life * .018})`);
        dryBrush.addColorStop(1, 'rgba(16, 20, 18, 0)');
        gestureContext.beginPath();
        gestureContext.ellipse(0, 0, ripple.radius * (4.4 + ripple.stretch), ripple.radius * .68, 0, 0, Math.PI * 2);
        gestureContext.fillStyle = dryBrush;
        gestureContext.fill();
        for (let strand = -1; strand <= 1; strand += 1) {
          gestureContext.beginPath();
          gestureContext.moveTo(-ripple.radius * 3.2, strand * 1.8);
          gestureContext.quadraticCurveTo(0, strand * 2.6 + Math.sin(ripple.phase) * 2, ripple.radius * 3.2, strand * 1.3);
          gestureContext.strokeStyle = `rgba(17, 20, 18, ${ripple.life * (.028 - Math.abs(strand) * .006)})`;
          gestureContext.lineWidth = .45;
          gestureContext.stroke();
        }
        gestureContext.restore();
        return;
      }
      ripple.life *= ripple.strong ? .974 : .957;
      ripple.radius += ripple.strong ? 2.15 : 1.35;
      for (let ring = 0; ring < (ripple.strong ? 3 : 1); ring += 1) {
        gestureContext.beginPath();
        gestureContext.ellipse(
          ripple.x,
          ripple.y,
          ripple.radius + ring * 11,
          (ripple.radius + ring * 11) * (.91 + ring * .025),
          ripple.phase * .08,
          0,
          Math.PI * 2
        );
        gestureContext.strokeStyle = `rgba(17, 19, 17, ${ripple.life * (ripple.strong ? .13 / (ring + 1) : .075)})`;
        gestureContext.lineWidth = .45 + ripple.life * .65;
        gestureContext.stroke();
      }
    });
    requestAnimationFrame(drawRipples);
  }

  function initAudio() {
    if (state.audio || !state.soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const reverb = context.createConvolver();
    const reverbGain = context.createGain();
    master.gain.value = .42;
    compressor.threshold.value = -24;
    compressor.knee.value = 22;
    compressor.ratio.value = 3;
    compressor.attack.value = .08;
    compressor.release.value = .7;

    const impulseLength = Math.floor(context.sampleRate * 3.1);
    const impulse = context.createBuffer(2, impulseLength, context.sampleRate);
    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let index = 0; index < impulseLength; index += 1) {
        const decay = Math.pow(1 - index / impulseLength, 3.2);
        data[index] = (Math.random() * 2 - 1) * decay * (channel ? .82 : 1);
      }
    }
    reverb.buffer = impulse;
    reverbGain.gain.value = .19;
    reverb.connect(reverbGain).connect(master);
    master.connect(compressor).connect(context.destination);

    const spatial = (source, pan = 0, wet = .35) => {
      const panner = context.createStereoPanner ? context.createStereoPanner() : context.createGain();
      if (panner.pan) panner.pan.value = pan;
      source.connect(panner);
      panner.connect(master);
      const send = context.createGain();
      send.gain.value = wet;
      panner.connect(send).connect(reverb);
      return panner;
    };

    const playBowl = (frequency = 196, when = context.currentTime, volume = .034, pan = 0) => {
      if (!state.soundEnabled) return;
      [1, 2.015, 3.91].forEach((multiple, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(frequency * multiple, when);
        oscillator.detune.setValueAtTime(index * 2.4, when);
        const level = volume / (1 + index * 2.1);
        gain.gain.setValueAtTime(.0001, when);
        gain.gain.exponentialRampToValueAtTime(level, when + .025 + index * .018);
        gain.gain.exponentialRampToValueAtTime(.0001, when + 5.8 - index * .8);
        oscillator.connect(gain);
        spatial(gain, pan, .72);
        oscillator.start(when);
        oscillator.stop(when + 6.1);
      });
    };

    const playGuqin = (frequency, when = context.currentTime, pan = 0) => {
      if (!state.soundEnabled) return;
      const fundamental = context.createOscillator();
      const overtone = context.createOscillator();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      fundamental.type = 'triangle';
      overtone.type = 'sine';
      fundamental.frequency.setValueAtTime(frequency * 1.018, when);
      fundamental.frequency.exponentialRampToValueAtTime(frequency, when + .32);
      overtone.frequency.setValueAtTime(frequency * 2.01, when);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, when);
      filter.frequency.exponentialRampToValueAtTime(520, when + 2.2);
      filter.Q.value = 1.4;
      gain.gain.setValueAtTime(.0001, when);
      gain.gain.exponentialRampToValueAtTime(.025, when + .012);
      gain.gain.exponentialRampToValueAtTime(.006, when + .46);
      gain.gain.exponentialRampToValueAtTime(.0001, when + 3.1);
      fundamental.connect(filter);
      overtone.connect(filter);
      filter.connect(gain);
      spatial(gain, pan, .44);
      fundamental.start(when);
      overtone.start(when);
      fundamental.stop(when + 3.2);
      overtone.stop(when + 3.2);
    };

    const playFluteBreath = (frequency, when = context.currentTime, pan = 0) => {
      if (!state.soundEnabled) return;
      const tone = context.createOscillator();
      const breath = context.createOscillator();
      const vibrato = context.createOscillator();
      const vibratoDepth = context.createGain();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      tone.type = 'sine';
      breath.type = 'triangle';
      vibrato.type = 'sine';
      tone.frequency.value = frequency;
      breath.frequency.value = frequency * 2.002;
      vibrato.frequency.value = 4.7;
      vibratoDepth.gain.value = 3.4;
      vibrato.connect(vibratoDepth).connect(tone.frequency);
      filter.type = 'lowpass';
      filter.frequency.value = 1750;
      gain.gain.setValueAtTime(.0001, when);
      gain.gain.linearRampToValueAtTime(.011, when + .7);
      gain.gain.setValueAtTime(.011, when + 2.1);
      gain.gain.exponentialRampToValueAtTime(.0001, when + 3.9);
      tone.connect(filter);
      breath.connect(filter);
      filter.connect(gain);
      spatial(gain, pan, .58);
      tone.start(when);
      breath.start(when);
      vibrato.start(when);
      tone.stop(when + 4);
      breath.stop(when + 4);
      vibrato.stop(when + 4);
    };

    const playInkChord = (root, when = context.currentTime) => {
      if (!state.soundEnabled) return;
      [1, 1.5, 2, 2.25].forEach((ratio, index) => {
        const oscillator = context.createOscillator();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        oscillator.type = index % 2 ? 'sine' : 'triangle';
        oscillator.frequency.value = root * ratio;
        filter.type = 'lowpass';
        filter.frequency.value = 720 + index * 130;
        gain.gain.setValueAtTime(.0001, when);
        gain.gain.exponentialRampToValueAtTime(.0075 - index * .0008, when + 1.7 + index * .2);
        gain.gain.setValueAtTime(.0065 - index * .0007, when + 7.2);
        gain.gain.exponentialRampToValueAtTime(.0001, when + 11.4);
        oscillator.connect(filter).connect(gain);
        spatial(gain, -.48 + index * .32, .62);
        oscillator.start(when);
        oscillator.stop(when + 11.5);
      });
    };

    const windLength = Math.floor(context.sampleRate * 5);
    const windBuffer = context.createBuffer(1, windLength, context.sampleRate);
    const windData = windBuffer.getChannelData(0);
    let lastNoise = 0;
    for (let index = 0; index < windLength; index += 1) {
      lastNoise = lastNoise * .985 + (Math.random() * 2 - 1) * .015;
      windData[index] = lastNoise;
    }
    const wind = context.createBufferSource();
    const windFilter = context.createBiquadFilter();
    const windGain = context.createGain();
    wind.buffer = windBuffer;
    wind.loop = true;
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 410;
    windFilter.Q.value = .38;
    windGain.gain.value = .021;
    wind.connect(windFilter).connect(windGain);
    spatial(windGain, -.16, .38);
    wind.start();

    const drone = context.createOscillator();
    const droneFifth = context.createOscillator();
    const droneGain = context.createGain();
    drone.type = 'sine';
    droneFifth.type = 'sine';
    drone.frequency.value = 55;
    droneFifth.frequency.value = 82.41;
    droneGain.gain.value = .009;
    drone.connect(droneGain);
    droneFifth.connect(droneGain);
    spatial(droneGain, 0, .52);
    drone.start();
    droneFifth.start();

    const pentatonic = [146.83, 164.81, 196, 220, 246.94, 293.66, 329.63];
    let phraseIndex = 2;
    const schedulePhrase = () => {
      const delay = 4100 + Math.random() * 4300;
      if (state.soundEnabled) {
        const direction = Math.random() > .48 ? 1 : -1;
        phraseIndex = clamp(phraseIndex + direction, 0, pentatonic.length - 1);
        const note = pentatonic[phraseIndex];
        const when = context.currentTime + .08;
        playInkChord([55, 61.74, 65.41, 73.42][Math.floor(state.activePassage / 3) % 4], when);
        playGuqin(note, when, -.62 + Math.random() * 1.24);
        if (Math.random() > .68) playFluteBreath(note * (Math.random() > .5 ? 2 : 1.5), when + 1.1, -.45 + Math.random() * .9);
        if (Math.random() > .76) playBowl(note * .75, when + .35, .021, -.3 + Math.random() * .6);
      }
      state.audio.scheduler = setTimeout(schedulePhrase, delay);
    };

    state.audio = { context, master, playBowl, playGuqin, playFluteBreath, playInkChord, scheduler: null };
    playBowl(146.83, context.currentTime + .05, .025, -.14);
    playInkChord(55, context.currentTime + .08);
    setTimeout(schedulePhrase, 2400);
  }

  function chime() {
    if (!state.audio || !state.soundEnabled) return;
    const note = [146.83, 164.81, 196, 220, 246.94][Math.max(0, state.activePassage) % 5];
    state.audio.playBowl(note, state.audio.context.currentTime, .026, state.pointer.nx * .35);
  }

  function leaveForInkCourtyard(event) {
    event.preventDefault();
    event.stopPropagation();
    if (body.classList.contains('leaving-moyou')) return;
    chime();
    body.classList.add('leaving-moyou');
    const localDev = location.port === '3003';
    const returnUrl = new URLSearchParams(location.search).get('return') ||
      '../../portfolio-entry-preview.html#opening';
    const nextRealm = localDev ? 'http://127.0.0.1:3002/' : '../between-forms/';
    window.setTimeout(
      () => window.location.assign(`${nextRealm}?sound=${state.soundEnabled ? '1' : '0'}&return=${encodeURIComponent(returnUrl)}`),
      reducedMotion ? 60 : 1250,
    );
  }

  soundControl.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    soundControl.setAttribute('aria-pressed', String(state.soundEnabled));
    soundControl.setAttribute('aria-label', state.soundEnabled ? '关闭环境声音' : '开启环境声音');
    if (state.soundEnabled && !state.audio) initAudio();
    if (state.audio) {
      if (state.audio.context.state === 'suspended') state.audio.context.resume();
      state.audio.master.gain.cancelScheduledValues(state.audio.context.currentTime);
      state.audio.master.gain.linearRampToValueAtTime(state.soundEnabled ? .42 : 0, state.audio.context.currentTime + .65);
    }
  });

  function bindSpirits() {
    document.querySelectorAll('.spirit').forEach((spirit) => {
      spirit.addEventListener('pointerenter', () => body.classList.add('over-spirit'));
      spirit.addEventListener('pointerleave', () => body.classList.remove('over-spirit'));
      spirit.addEventListener('click', () => openArtwork(spirit));
    });
  }

  function openArtwork(spirit) {
    chime();
    const source = spirit.dataset.original;
    const alt = spirit.querySelector('img').alt;
    const reveal = () => {
      dialogImage.src = source;
      dialogImage.alt = `${alt}完整原作`;
      artDialog.showModal();
    };
    if (document.startViewTransition && !reducedMotion) document.startViewTransition(reveal);
    else reveal();
  }

  artDialog.querySelector('.dialog-close').addEventListener('click', () => artDialog.close());
  artDialog.addEventListener('cancel', () => body.classList.remove('over-spirit'));

  function buildNavigation() {
    const passages = [...document.querySelectorAll('.passage:not(.passage--opening)')];
    nav.replaceChildren();
    passages.forEach((passage, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.toggle('is-exit', index === passages.length - 1);
      button.setAttribute('aria-label', index === passages.length - 1 ? '前往展览尾厅' : `前往第${index + 1}个达摩场景`);
      button.addEventListener('click', () => revealPassage(index + 1));
      nav.appendChild(button);
    });
  }

  function updatePassages() {
    const passages = [...document.querySelectorAll('.passage')];
    let nearest = { index: 0, distance: Infinity };
    passages.forEach((passage, index) => {
      const rectangle = passage.getBoundingClientRect();
      const progress = clamp((innerHeight - rectangle.top) / (innerHeight + rectangle.height));
      const center = rectangle.top + rectangle.height / 2;
      const presence = clamp(1 - Math.abs(center - innerHeight / 2) / (rectangle.height * .5));
      passage.style.setProperty('--scene-progress', progress.toFixed(4));
      passage.style.setProperty('--presence', presence.toFixed(4));
      const distance = Math.abs(center - innerHeight / 2);
      if (distance < nearest.distance) nearest = { index, distance };
    });
    state.activePassage = nearest.index;
    body.dataset.scene = String(nearest.index);
    passages.forEach((passage, index) => passage.classList.toggle('is-active', index === nearest.index));
    const artIndex = Math.max(0, nearest.index - 1);
    [...nav.children].forEach((button, index) => button.setAttribute('aria-current', String(index === artIndex)));
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    state.scrollRatio = scrollY / maxScroll;
  }

  addEventListener('scroll', updatePassages, { passive: true });
  addEventListener('wheel', (event) => {
    state.wheelDepth = clamp(state.wheelDepth + event.deltaY * .00055, -1, 1);
  }, { passive: true });

  function createInkWorld() {
    if (!window.THREE) return;
    const canvas = document.querySelector('#ink-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !coarsePointer, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarsePointer ? 1.35 : 1.8));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 100);
    camera.position.z = 12;
    const inkGroup = new THREE.Group();
    scene.add(inkGroup);
    const inkPieces = [];
    const clock = new THREE.Clock();

    function seeded(seed) {
      let value = seed >>> 0;
      return () => {
        value += 0x6D2B79F5;
        let t = value;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    const random = seeded(9076);
    const between = (min, max) => min + (max - min) * random();

    function splitCalligraphy(image) {
      const source = document.createElement('canvas');
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      const context = source.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, source.width, source.height).data;
      const columns = new Array(source.width).fill(0);

      for (let y = 0; y < source.height; y += 3) {
        for (let x = 0; x < source.width; x += 2) {
          if (pixels[(y * source.width + x) * 4 + 3] > 24) columns[x] += 1;
        }
      }

      const ranges = [];
      let start = -1;
      let lastActive = -1;
      for (let x = 0; x < columns.length; x += 1) {
        if (columns[x] > 1) {
          if (start < 0) start = x;
          lastActive = x;
        } else if (start >= 0 && x - lastActive > 14) {
          ranges.push([start, lastActive]);
          start = -1;
        }
      }
      if (start >= 0) ranges.push([start, lastActive]);

      const usable = ranges.filter(([left, right]) => right - left > 10);
      const segments = usable.length >= 8 ? usable : Array.from({ length: 14 }, (_, index) => {
        const width = source.width / 14;
        return [Math.floor(index * width), Math.floor((index + 1) * width)];
      });

      segments.forEach(([left, right], index) => {
        let top = source.height;
        let bottom = 0;
        for (let x = left; x <= right; x += 2) {
          for (let y = 0; y < source.height; y += 2) {
            if (pixels[(y * source.width + x) * 4 + 3] > 24) {
              top = Math.min(top, y);
              bottom = Math.max(bottom, y);
            }
          }
        }
        if (bottom <= top) return;
        const padding = 14;
        const cropX = Math.max(0, left - padding);
        const cropY = Math.max(0, top - padding);
        const cropWidth = Math.min(source.width - cropX, right - left + padding * 2);
        const cropHeight = Math.min(source.height - cropY, bottom - top + padding * 2);
        const segment = document.createElement('canvas');
        segment.width = cropWidth;
        segment.height = cropHeight;
        segment.getContext('2d').drawImage(source, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        addInkPiece(segment, index, segments.length);
      });
    }

    function addInkPiece(canvasTexture, index, total) {
      const texture = new THREE.CanvasTexture(canvasTexture);
      texture.encoding = THREE.sRGBEncoding;
      texture.minFilter = THREE.LinearFilter;
      const aspect = canvasTexture.width / canvasTexture.height;
      const height = between(2.25, 4.4);
      const width = Math.max(.42, height * aspect);
      const geometry = new THREE.PlaneGeometry(width, height, 12, 16);
      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          map: { value: texture },
          time: { value: 0 },
          opacity: { value: between(.28, .74) },
          phase: { value: between(0, Math.PI * 2) },
        },
        vertexShader: `
          varying vec2 vUv;
          uniform float time;
          uniform float phase;
          void main() {
            vUv = uv;
            vec3 p = position;
            p.z += sin(uv.y * 5.2 + time * .48 + phase) * .055;
            p.x += sin(uv.y * 3.5 + time * .25 + phase) * .025;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform sampler2D map;
          uniform float opacity;
          void main() {
            vec4 ink = texture2D(map, vUv);
            if (ink.a < .018) discard;
            gl_FragColor = vec4(ink.rgb * vec3(.84, .86, .82), ink.a * opacity);
          }
        `,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const angle = total > 1 ? index / total * Math.PI * 2 : 0;
      const home = new THREE.Vector3(
        between(-7.4, 7.4) + Math.sin(angle) * 1.2,
        between(-4.5, 4.5) + Math.cos(angle) * .7,
        between(-8.5, 1.8)
      );
      mesh.position.copy(home);
      mesh.rotation.z = between(-.12, .12);
      mesh.rotation.y = between(-.24, .24);
      mesh.userData = {
        home,
        phase: between(0, Math.PI * 2),
        depth: clamp((home.z + 8.5) / 10.3),
        baseOpacity: material.uniforms.opacity.value,
        scatter: new THREE.Vector3(Math.sign(home.x || 1) * between(4, 8), Math.sign(home.y || 1) * between(2, 5), between(-3, 3)),
      };
      inkGroup.add(mesh);
      inkPieces.push(mesh);
    }

    const image = new Image();
    image.src = './assets/calligraphy/calligraphy-ink.png';
    image.onload = () => splitCalligraphy(image);

    function animate() {
      const time = clock.getElapsedTime();
      const hushed = performance.now() < state.hushUntil || reducedMotion;
      const mouseWorldX = state.pointer.nx * 7.2;
      const mouseWorldY = state.pointer.ny * 4.4;
      const entryProgress = state.entered ? clamp((performance.now() - state.enteredAt) / 1800) : 0;
      const entryRelease = (1 - Math.pow(1 - entryProgress, 3)) * .36;
      const storyPush = Math.max(entryRelease, clamp(state.scrollRatio * 6.5));
      state.wheelDepth *= .965;
      body.style.setProperty('--wheel-depth', `${state.wheelDepth * 92}px`);

      inkPieces.forEach((piece, index) => {
        const data = piece.userData;
        piece.material.uniforms.time.value = hushed ? 0 : time;
        const driftX = hushed ? 0 : Math.sin(time * (.12 + data.depth * .06) + data.phase) * (.22 + data.depth * .22);
        const driftY = hushed ? 0 : Math.cos(time * (.1 + data.depth * .04) + data.phase) * (.16 + data.depth * .19);
        let targetX = data.home.x + driftX;
        let targetY = data.home.y + driftY;
        let targetZ = data.home.z + Math.sin(time * .11 + data.phase) * .24;

        if (storyPush > 0) {
          targetX += data.scatter.x * storyPush;
          targetY += data.scatter.y * storyPush * .32;
          targetZ -= storyPush * 2.8;
        }

        if (state.gathering) {
          const orbit = index / Math.max(1, inkPieces.length) * Math.PI * 2;
          targetX = mouseWorldX + Math.cos(orbit) * (1.1 + index % 4 * .24);
          targetY = mouseWorldY + Math.sin(orbit) * (1.1 + index % 3 * .3);
          targetZ = lerp(targetZ, 1.4, .78);
        } else if (state.pointer.active && storyPush < .92) {
          const dx = piece.position.x - mouseWorldX;
          const dy = piece.position.y - mouseWorldY;
          const distance = Math.hypot(dx, dy);
          const radius = 2.15 + data.depth * .75;
          if (distance < radius && distance > .001) {
            const pressure = (radius - distance) / radius;
            targetX += dx / distance * pressure * 1.45;
            targetY += dy / distance * pressure * 1.15;
            piece.rotation.y = lerp(piece.rotation.y, dx * .08, .08);
          }
        }

        piece.position.x = lerp(piece.position.x, targetX, state.gathering ? .085 : .028);
        piece.position.y = lerp(piece.position.y, targetY, state.gathering ? .085 : .028);
        piece.position.z = lerp(piece.position.z, targetZ, .025);
        piece.rotation.z += hushed ? 0 : Math.sin(time * .09 + data.phase) * .00016;
        piece.material.uniforms.opacity.value = data.baseOpacity * lerp(1, .28, storyPush);
      });

      camera.position.x = lerp(camera.position.x, state.pointer.nx * .38, .025);
      camera.position.y = lerp(camera.position.y, state.pointer.ny * .24, .025);
      camera.position.z = lerp(camera.position.z, 12 + state.wheelDepth * 1.15, .055);
      inkGroup.rotation.z = lerp(inkGroup.rotation.z, state.wheelDepth * .018, .05);
      camera.lookAt(0, 0, -1.2);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function resize() {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarsePointer ? 1.35 : 1.8));
      renderer.setSize(innerWidth, innerHeight, false);
    }

    addEventListener('resize', resize);
    requestAnimationFrame(animate);
  }

  addEventListener('resize', resizeGestureCanvas);
  bindSpirits();
  releaseMark?.addEventListener('click', leaveForInkCourtyard);
  buildNavigation();
  resizeGestureCanvas();
  updatePassages();
  createOpeningInk();
  createInkWorld();
  requestAnimationFrame(drawRipples);
})();

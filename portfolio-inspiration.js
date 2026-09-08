'use strict';
(() => {
  const mount = document.getElementById('atelier-discovery-mount');
  if (!mount || document.getElementById('portfolio-inspiration-dialog')) return;

  const catalogue = {
    ...(typeof workDetails === 'undefined' ? {} : workDetails),
    ...(window.DREAM_EXTRA || {})
  };
  const covers = window.ScrollExhibits?.build(catalogue).covers || {};
  const isLocalImage = value => typeof value === 'string' && /^images\/[\w./-]+$/.test(value);
  const entries = Object.entries(catalogue)
    .filter(([id, work]) => id !== 'more' && work && typeof work.title === 'string')
    .map(([id, work]) => ({
      id,
      title: work.title,
      category: typeof work.cat === 'string' ? work.cat : '',
      images: [...new Set([covers[id], work.cover, ...(work.gallery || []).map(item => item.src)])].filter(isLocalImage)
    }))
    .filter(work => work.images.length);
  if (!entries.length) return;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'inspiration-tag';
  trigger.textContent = '随手翻一张 ↗';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'portfolio-inspiration-dialog');
  mount.appendChild(trigger);

  const dialog = document.createElement('dialog');
  dialog.id = 'portfolio-inspiration-dialog';
  dialog.className = 'inspiration-dialog';
  dialog.setAttribute('aria-labelledby', 'inspiration-project-title');
  dialog.innerHTML = '<div class="inspiration-topline"><span>PEIJIA\'S COLLECTION / POSTCARD</span><button class="inspiration-close" type="button" aria-label="关闭作品明信片">关闭 ×</button></div>' +
    '<div class="inspiration-print"><img class="inspiration-image" alt="" decoding="async"><p class="inspiration-image-message" hidden>图片暂时未能显示，可打开作品查看。</p></div>' +
    '<div class="inspiration-caption"><p class="inspiration-category"></p><h2 id="inspiration-project-title"></h2></div>' +
    '<div class="inspiration-footer"><span class="inspiration-position"></span><div class="inspiration-actions"><button class="inspiration-next" type="button">换一张</button><button class="inspiration-open" type="button">打开这件作品 ↗</button></div></div>' +
    '<p class="sr-only inspiration-announcement" aria-live="polite" aria-atomic="true"></p>';
  document.body.appendChild(dialog);

  const closeButton = dialog.querySelector('.inspiration-close');
  const nextButton = dialog.querySelector('.inspiration-next');
  const openButton = dialog.querySelector('.inspiration-open');
  const image = dialog.querySelector('.inspiration-image');
  const imageMessage = dialog.querySelector('.inspiration-image-message');
  const print = dialog.querySelector('.inspiration-print');
  const title = dialog.querySelector('#inspiration-project-title');
  const category = dialog.querySelector('.inspiration-category');
  const position = dialog.querySelector('.inspiration-position');
  const announcement = dialog.querySelector('.inspiration-announcement');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let queue = [];
  let current = null;
  let imageIndex = 0;

  function refill() {
    queue = entries.slice();
    for (let index = queue.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [queue[index], queue[other]] = [queue[other], queue[index]];
    }
    // A completed collection starts a fresh shuffle without repeating its last card.
    if (queue.length > 1 && queue[queue.length - 1].id === current?.id) {
      [queue[0], queue[queue.length - 1]] = [queue[queue.length - 1], queue[0]];
    }
  }

  function showNext() {
    if (!queue.length) refill();
    current = queue.pop();
    imageIndex = 0;
    image.hidden = false;
    imageMessage.hidden = true;
    image.alt = current.title + ' · 作品原图';
    image.src = current.images[imageIndex];
    title.textContent = current.title;
    category.textContent = current.category;
    position.textContent = String(entries.length - queue.length).padStart(2, '0') + ' / ' + entries.length;
    openButton.dataset.project = current.id;
    announcement.textContent = current.title + '，' + current.category;
    print.classList.remove('is-turning');
    if (!reducedMotion.matches && !document.body.classList.contains('reduce-motion')) {
      // Replay only the short paper movement; the content and actions update immediately.
      void print.offsetWidth;
      print.classList.add('is-turning');
    }
  }

  image.addEventListener('error', () => {
    imageIndex += 1;
    if (current && imageIndex < current.images.length) {
      image.src = current.images[imageIndex];
    } else {
      image.hidden = true;
      imageMessage.hidden = false;
    }
  });
  print.addEventListener('animationend', () => print.classList.remove('is-turning'));
  trigger.addEventListener('click', () => {
    showNext();
    dialog.showModal();
    document.body.classList.add('inspiration-is-open');
    closeButton.focus({ preventScroll: true });
  });
  nextButton.addEventListener('click', showNext);
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('inspiration-is-open');
    trigger.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  // data-project deliberately bubbles to scroll-world.js. Its native project dialog
  // opens above this one, so returning from the project preserves the drawn card.
})();

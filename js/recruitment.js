(() => {
  'use strict';
  const config = window.PORTFOLIO_VIEW || {};
  const url = new URL(window.location.href);
  const modes = config.modes || {};
  const validMode = value => Object.prototype.hasOwnProperty.call(modes, value) ? value : 'selected';
  let mode = validMode(url.searchParams.get('view'));
  const selectedGrid = document.querySelector('[data-selected-grid]');
  const status = document.querySelector('[data-view-status]');
  const applyView = (next, writeHistory = false) => {
    mode = validMode(next);
    if (selectedGrid && modes[mode]) {
      const fragment = document.createDocumentFragment();
      for (const id of modes[mode]) {
        const template = document.getElementById('work-template-' + id);
        if (template) fragment.append(template.content.cloneNode(true));
      }
      if (fragment.childElementCount) selectedGrid.replaceChildren(fragment);
      selectedGrid.classList.remove('view-flash');
      if (writeHistory) requestAnimationFrame(() => selectedGrid.classList.add('view-flash'));
    }
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === mode)));
    if (status) status.textContent = config.notes?.[mode] || '';
    document.querySelectorAll('[data-case-link]').forEach(link => {
      const destination = new URL(link.getAttribute('href'), location.href);
      if (mode === 'selected') destination.searchParams.delete('view');
      else destination.searchParams.set('view', mode);
      link.setAttribute('href', destination.pathname + destination.search + destination.hash);
    });
    document.querySelectorAll('[data-back-selected]').forEach(link => {
      const destination = new URL(link.getAttribute('href'), location.href);
      if (mode === 'selected') destination.searchParams.delete('view');
      else destination.searchParams.set('view', mode);
      link.setAttribute('href', destination.pathname + destination.search + '#selected');
    });
    if (writeHistory) {
      const nextUrl = new URL(location.href);
      if (mode === 'selected') nextUrl.searchParams.delete('view');
      else nextUrl.searchParams.set('view', mode);
      history.pushState({ view: mode }, '', nextUrl.pathname + nextUrl.search + nextUrl.hash);
    }
  };
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => applyView(button.dataset.view, true)));
  applyView(mode);
  const search = document.querySelector('[data-archive-search]');
  const filters = [...document.querySelectorAll('[data-category]')];
  const tiles = [...document.querySelectorAll('[data-archive-tile]')];
  const groups = new Set(filters.map(button => button.dataset.category));
  let category = groups.has(url.searchParams.get('category')) ? url.searchParams.get('category') : 'all';
  if (search) search.value = url.searchParams.get('q') || '';
  const applyFilter = (writeHistory = false) => {
    const term = (search?.value || '').trim().toLocaleLowerCase();
    let count = 0;
    for (const tile of tiles) {
      const matches = (category === 'all' || tile.dataset.group === category) && (!term || (tile.dataset.search || '').includes(term));
      tile.hidden = !matches;
      if (matches) count++;
    }
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    const counter = document.querySelector('[data-archive-count]');
    if (counter) counter.textContent = String(count).padStart(2, '0') + ' / 25 works';
    const empty = document.querySelector('[data-archive-empty]');
    if (empty) empty.hidden = count > 0;
    if (writeHistory) {
      const nextUrl = new URL(location.href);
      if (category === 'all') nextUrl.searchParams.delete('category'); else nextUrl.searchParams.set('category', category);
      if (term) nextUrl.searchParams.set('q', search.value.trim()); else nextUrl.searchParams.delete('q');
      history.replaceState({}, '', nextUrl.pathname + nextUrl.search + nextUrl.hash);
    }
  };
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.category; applyFilter(true); }));
  search?.addEventListener('input', () => applyFilter(true));
  if (tiles.length) applyFilter();
  window.addEventListener('popstate', () => {
    const current = new URL(location.href);
    applyView(current.searchParams.get('view'));
    if (tiles.length) {
      category = groups.has(current.searchParams.get('category')) ? current.searchParams.get('category') : 'all';
      if (search) search.value = current.searchParams.get('q') || '';
      applyFilter();
    }
  });
  const markImageFailure = target => {
    if (target instanceof HTMLImageElement) target.closest('.media, .card-visual, .case-hero')?.classList.add('image-unavailable');
  };
  document.addEventListener('error', event => markImageFailure(event.target), true);
  document.querySelectorAll('img').forEach(img => { if (img.complete && !img.naturalWidth) markImageFailure(img); });
  const progress = document.querySelector('[data-scroll-progress]');
  let scheduled = false;
  const updateProgress = () => {
    const span = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (span > 0 ? Math.min(100, scrollY / span * 100) : 0) + '%';
    scheduled = false;
  };
  if (progress) {
    addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
    addEventListener('resize', updateProgress);
    updateProgress();
  }
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.case-nav a')];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }, { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('.case-section').forEach(section => observer.observe(section));
  }
})();

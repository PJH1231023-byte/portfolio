'use strict';
(() => {
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  scrollTo(0, 0);
  const enter = document.querySelector('#enter-exhibition');
  const markers = [...document.querySelectorAll('.realm-nav .marker')];
  const sections = [...document.querySelectorAll('.realm[data-realm]')];
  enter?.addEventListener('click', event => {
    event.preventDefault();
    if (document.body.classList.contains('gate-opening')) return;
    document.body.classList.add('gate-opening');
    setTimeout(() => {
      const exhibition = new URL('exhibitions/formless/', location.href);
      const portfolio = new URL('portfolio-entry-preview.html#opening', location.href);
      exhibition.searchParams.set('from', 'portfolio');
      exhibition.searchParams.set('return', portfolio.href);
      location.assign(exhibition.href);
    }, 620);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        markers.forEach(marker => marker.classList.toggle('active', marker.dataset.target === entry.target.id));
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
})();

'use strict';
/* Portfolio-only media; the game never loads or waits for this short film. */
window.WorkShowcase = (() => {
 const escape = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(work) {
  const film = work?.showcase;
  if (!film || !/^media\/[\w/-]+\.webm$/.test(film.src)) return '';
  const poster = /^images\/[\w./-]+$/.test(film.poster) ? film.poster : '';
  return `<figure class="work-showcase"><figcaption><span class="showcase-label">CHARACTER MOTION / 角色动画</span><h3>${escape(film.title)}</h3><p>${escape(film.caption)}</p></figcaption><video class="work-showcase-video" controls playsinline muted preload="none" poster="${poster}" aria-label="${escape(film.title)}"><source src="${film.src}" type="video/webm">当前浏览器无法播放短片。<a href="${film.src}">打开动画文件</a></video><p class="showcase-note">${escape(film.note)}</p></figure>`;
 }
 function pause(root = document) { root.querySelectorAll('.work-showcase-video').forEach(video => video.pause()); }
 document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
 window.addEventListener('pagehide', () => pause());
 return {render, pause};
})();

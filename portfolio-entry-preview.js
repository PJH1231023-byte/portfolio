'use strict';
(() => {
  const M = window.ScrollWorldModel;
  const catalogue = {...workDetails, ...window.DREAM_EXTRA};
  const exhibition = window.ScrollExhibits.build(catalogue);
  document.body.classList.add('atelier-edition');
  const reduced = () => document.body.classList.contains('reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const definitions = [
    {id:'product', name:'产品与交互设计', code:'产品', focus:'智能产品', front:'#d1d7b5', back:'#8e9f7b', hint:'智能产品、界面流程与交互原型', picks:['pet-app','gourd-museum']},
    {id:'brand', name:'品牌与视觉设计', code:'品牌', focus:'视觉系统', front:'#e2ceb0', back:'#b4a083', hint:'品牌识别、包装物料与空间应用', picks:['cattea','fulu']},
    {id:'film', name:'人工智能影像', code:'影像', focus:'生成叙事', front:'#c9c7d9', back:'#9197b0', hint:'人工智能广告短片、叙事影像与制作过程', picks:['eye-mountain-river','orderly-journey']},
    {id:'character', name:'原创角色设计', code:'角色', focus:'形象设定', front:'#e0cabd', back:'#b29a89', hint:'角色设定、表情动作与衍生应用', picks:['cosmic-astra','sylva']},
    {id:'print', name:'字体与平面设计', code:'平面', focus:'版式实验', front:'#ced6b8', back:'#91a082', hint:'字体实验、字形构建与印刷卡牌', picks:['wild-geometry','word-of-plants']},
    {id:'play', name:'编程与互动作品', code:'互动', focus:'可玩原型', front:'#bad1cd', back:'#7f9d96', hint:'网页游戏、交互实验与可玩演示', picks:['starling-merge','pet-garden-battle']}
  ];
  const folderRoot = document.querySelector('#entry-folders');
  const escape = M.escape;
  const fileIds = Object.keys(catalogue).filter(id => id !== 'more');
  const fileCount = document.querySelector('#entry-file-count');
  fileCount.textContent = fileIds.length + ' 件作品';
  const sample = document.querySelector('#entry-sample');
  let sampleId = null;
  function previewWork(definition, id, count) {
    if (!sample || !id || id === sampleId) return;
    sampleId = id;
    const work = catalogue[id], src = exhibition.covers[id] || work.cover;
    document.querySelector('#entry-folder-hint').textContent = definition.hint + ' / ' + count + ' 件作品';
    document.querySelector('#entry-sample-title').textContent = exhibition.names[id] || work.title;
    const image = document.querySelector('#entry-sample-image');
    image.src = src;
    sample.dataset.project = id;
    sample.setAttribute('aria-label', '查看' + work.title);
    sample.style.setProperty('--sample-accent', definition.back);
    folderRoot.querySelectorAll('.entry-folder').forEach(button => button.classList.toggle('is-previewed', button.dataset.launchFolder === definition.id));
    if (!reduced()) {
      sample.querySelectorAll('.entry-sample-art,.entry-sample-copy').forEach(part => {
        part.getAnimations().forEach(animation => animation.cancel());
        part.animate([{opacity:.45,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:170,easing:'ease-out'});
      });
    }
  }
  definitions.forEach(definition => {
    const ids = fileIds.filter(id => M.type(catalogue[id]) === definition.id);
    const picks = [...new Set([...definition.picks.filter(id => ids.includes(id)), ...ids])].slice(0,2);
    const images = picks.map(id => {
      const src = exhibition.covers[id] || catalogue[id].cover;
      return /^images\/[\w./-]+$/.test(src || '') ? '<img src="'+escape(src)+'" alt="" width="45" height="39" decoding="async">' : '';
    }).join('');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'entry-folder';
    button.dataset.launchFolder = definition.id;
    button.style.setProperty('--folder-front', definition.front);
    button.style.setProperty('--folder-back', definition.back);
    button.setAttribute('aria-label','打开'+definition.name+'文件夹，'+ids.length+'件作品。'+definition.hint);
    button.title = definition.hint;
    button.innerHTML = '<span class="entry-folder-art" aria-hidden="true">'+images+'<span class="entry-folder-front"><small>'+definition.code+'</small><b>↗</b></span></span><span class="entry-folder-name">'+definition.name+'</span><span class="entry-folder-count">'+ids.length+' 件 · '+definition.focus+'</span>';
    const showHint = () => previewWork(definition, picks[0], ids.length);
    button.addEventListener('pointerenter', showHint);
    button.addEventListener('focus', showHint);
    button.addEventListener('click', () => {
      showHint();
      document.querySelector('#entry-open-desktop').click();
      document.querySelector('#desktop-folders [data-folder="'+definition.id+'"]').click();
      const archiveWindow = document.querySelector('#desktop-windows [data-window="'+definition.id+'"]');
      archiveWindow.dataset.archiveCategory = definition.id;
      archiveWindow.style.setProperty('--archive-tab',definition.back);
      if (!reduced()) archiveWindow.animate([{opacity:.65,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:190,easing:'ease-out'});
      const close = archiveWindow.querySelector('[data-close-window]');
      close?.focus();
    });
    folderRoot.appendChild(button);
    if (!sampleId) showHint();
  });
  const intro = document.querySelector('#opening');
  const nav = document.querySelector('.chapter-nav');
  const observer = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    document.body.classList.toggle('entry-is-visible', visible);
    nav.inert = visible;
  }, {rootMargin:'-88px 0px 0px 0px'});
  observer.observe(intro);
  const monitor = document.querySelector('.entry-monitor');
  let reflectionFrame = 0, reflectionX = 22, reflectionY = 18;
  monitor.addEventListener('pointermove', event => {
    if (reduced() || event.pointerType !== 'mouse' || !matchMedia('(hover: hover) and (pointer: fine)').matches || document.querySelector('dialog[open]')) return;
    const rect = monitor.getBoundingClientRect();
    reflectionX = (event.clientX - rect.left) / rect.width * 100;
    reflectionY = (event.clientY - rect.top) / rect.height * 100;
    if (!reflectionFrame) reflectionFrame = requestAnimationFrame(() => {
      monitor.style.setProperty('--reflection-x', reflectionX + '%');
      monitor.style.setProperty('--reflection-y', reflectionY + '%');
      reflectionFrame = 0;
    });
  }, {passive:true});
  monitor.addEventListener('pointerleave', () => {
    cancelAnimationFrame(reflectionFrame);reflectionFrame = 0;
    monitor.style.removeProperty('--reflection-x');monitor.style.removeProperty('--reflection-y');
  });
  const ambient = document.createElement('div');
  ambient.className = 'atelier-ambient';ambient.setAttribute('aria-hidden','true');
  document.body.prepend(ambient);
  const tones = {archive:'#99ac94',brand:'#c1a07b',character:'#a998b9',film:'#9387b5',product:'#8fad98',print:'#b3ac7e',play:'#79a6a5',closing:'#c4a888'};
  let sceneObserver;
  function observeScenes() {
    sceneObserver?.disconnect();
    const inset = Math.round(innerHeight * .44);
    sceneObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) ambient.style.backgroundColor = tones[entry.target.dataset.category || entry.target.dataset.scene] || tones.archive;
    }, {rootMargin:'-' + inset + 'px 0px -' + inset + 'px 0px',threshold:0});
    document.querySelectorAll('.scroll-chapter').forEach(chapter => sceneObserver.observe(chapter));
  }
  observeScenes();
  addEventListener('resize',observeScenes);
  addEventListener('pagehide',()=>cancelAnimationFrame(reflectionFrame));
})();

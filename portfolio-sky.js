'use strict';
(() => {
  const opening = document.querySelector('.entry-chapter');
  const bottom = opening?.querySelector('.entry-bottom');
  if (!bottom) return;
  const skies = [
    {id:'cliffs',name:'宇宙山脊',title:'宇宙山脊 · 船底座星云',en:'COSMIC CLIFFS / NGC 3324',src:'images/sky/cosmic-cliffs.png',position:'65% 48%',color:'#c69a68',note:'韦布望远镜的红外观测，经可见色映射呈现。',credit:'NASA, ESA, CSA, STScI',url:'https://science.nasa.gov/asset/webb/cosmic-cliffs-in-the-carina-nebula-nircam-image/',alt:'蓝色星空下，金色星际尘埃形成绵延的山脊轮廓。'},
    {id:'rho',name:'星云花园',title:'星云花园 · 蛇夫座 ρ',en:'RHO OPHIUCHI / STELLAR NURSERY',src:'images/sky/rho-ophiuchi.png',position:'60% 48%',color:'#bc91a2',note:'韦布望远镜的红外观测，经可见色映射呈现。',credit:'Image: NASA, ESA, CSA, STScI, Klaus Pontoppidan (STScI); Image Processing: Alyssa Pagan (STScI)',url:'https://science.nasa.gov/asset/webb/rho-ophiuchi-nircam-image/',alt:'深色星云间，红色喷流与淡金色尘埃围绕明亮的新生恒星。'},
    {id:'sunset',name:'地球日落',title:'地球日落 · 从太空望向家园',en:'ORBITAL SUNSET / EARTH',src:'images/sky/orbital-sunset.jpg?v=iss068e022267',position:'60% 50%',color:'#c38d73',note:'国际空间站拍摄的日落与云影，2022 年 11 月 13 日。',credit:'NASA; photograph by Koichi Wakata',url:'https://www.nasa.gov/image-article/cloud-shadows-stretch-across-earth-during-an-orbital-sunset/',alt:'蓝色大气沿地球的弧形地平线铺开，暖色夕照照亮云顶，云影延伸到远处。'}
  ];
  const escape = window.ScrollWorldModel.escape;
  const background = document.createElement('div');
  background.className = 'entry-sky';
  background.setAttribute('aria-hidden','true');
  background.innerHTML = '<div class="sky-image-stack"></div><div class="sky-reading-shade"></div>';
  opening.prepend(background);
  opening.classList.add('has-sky');
  const stack = background.querySelector('.sky-image-stack');
  const images = new Map();
  const controls = document.createElement('div');
  controls.className = 'sky-controls';
  controls.innerHTML = '<span class="sky-controls-label">窗外</span><div class="sky-choices" role="group" aria-label="选择窗外的风景"></div><button class="sky-expand" type="button" aria-haspopup="dialog" aria-controls="portfolio-sky-dialog">看一会儿风景 <span aria-hidden="true">↗</span></button>';
  bottom.insertBefore(controls,bottom.lastElementChild);
  const credit = document.createElement('p');
  credit.className = 'sky-credit';
  credit.hidden = true;
  bottom.appendChild(credit);
  const status = document.createElement('p');
  status.className = 'sr-only'; status.setAttribute('role','status');
  bottom.appendChild(status);

  const dialog = document.createElement('dialog');
  dialog.className = 'sky-dialog'; dialog.id = 'portfolio-sky-dialog';
  dialog.setAttribute('aria-labelledby','sky-view-title');
  dialog.innerHTML = '<header class="sky-view-header"><div><p>PEIJIA’S WINDOW / 灵感来处</p><h2 id="sky-view-title"></h2></div><button type="button" class="sky-close" autofocus>回到作品集 <span aria-hidden="true">×</span></button></header><figure class="sky-view-figure"><div class="sky-view-print"><img class="sky-view-image" alt="" decoding="async"></div><figcaption><span class="sky-view-note"></span><a class="sky-view-credit" target="_blank" rel="noopener noreferrer"></a></figcaption></figure><footer class="sky-view-footer"><div><p class="sky-view-invitation">让目光，在这里停一会儿。</p><div class="sky-view-choices" role="group" aria-label="切换完整风景"></div></div><p class="sky-view-gesture">移动鼠标，轻轻改变视角</p></footer>';
  document.body.appendChild(dialog);
  const catalogue = {...workDetails,...window.DREAM_EXTRA};
  const related = document.createElement('div');
  related.className = 'sky-related';
  related.innerHTML = '<p>继续探索我的作品</p><div class="sky-related-list">' +
    ['cosmic-astra','eye-mountain-river','gourd-museum'].filter(id => catalogue[id]).map(id => '<button type="button" data-project="'+id+'">'+escape(catalogue[id].title)+' <span aria-hidden="true">↗</span></button>').join('') +
    '</div><button class="sky-related-archive" type="button" data-desktop>打开作品档案 ↗</button>';
  dialog.querySelector('.sky-view-gesture').replaceWith(related);
  const viewImage = dialog.querySelector('.sky-view-image');
  const viewFeedback = dialog.querySelector('.sky-view-invitation');
  viewFeedback.setAttribute('role','status');
  const expand = controls.querySelector('.sky-expand');
  expand.disabled = true;
  const choices = [];
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const pointerQuery = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = () => reducedQuery.matches || document.body.classList.contains('reduce-motion');
  let current = null, request = 0, frame = 0, x = 0, y = 0;
  let heroVisible = true;

  function setCredit(node, sky) {
    node.replaceChildren();
    const link = document.createElement('a');
    link.href = sky.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = sky.credit + ' ↗';
    node.append('影像来源：',link);
  }
  function updateView(sky) {
    dialog.querySelector('#sky-view-title').textContent = sky.title;
    dialog.querySelector('.sky-view-note').textContent = sky.note;
    const link = dialog.querySelector('.sky-view-credit');
    link.textContent = sky.credit + ' · 查看 NASA 原图 ↗'; link.href = sky.url;
    viewImage.src = sky.src; viewImage.alt = sky.alt;
    viewImage.style.setProperty('--sky-position',sky.position);
    dialog.style.setProperty('--sky-accent',sky.color);
  }
  async function choose(sky, announce = true) {
    const token = ++request;
    status.classList.add('sr-only'); status.classList.remove('sky-load-error');
    status.textContent = announce ? '正在打开' + sky.name + '…' : '';
    if (dialog.open) viewFeedback.textContent = '正在打开' + sky.name + '…';
    controls.setAttribute('aria-busy','true');
    try {
      let entry = images.get(sky.id);
      if (!entry) {
        const image = new Image();
        image.className = 'sky-photo'; image.alt = ''; image.decoding = 'async';
        image.style.objectPosition = sky.position;
        const ready = new Promise((resolve,reject) => {
          image.onload = resolve;
          image.onerror = () => { image.remove(); images.delete(sky.id); reject(new Error('Image unavailable')); };
        });
        entry = {image,ready}; images.set(sky.id,entry);
        stack.appendChild(image); image.src = sky.src;
      }
      await entry.ready;
      if (token !== request) return;
      current = sky;
      for (const [id,{image}] of images) image.classList.toggle('is-active',id === sky.id);
      opening.dataset.sky = sky.id;
      opening.style.setProperty('--sky-accent',sky.color);
      choices.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.skyChoice === sky.id)));
      setCredit(credit,sky); credit.hidden = false;
      expand.disabled = false;
      if (dialog.open) updateView(sky);
      viewFeedback.textContent = '让目光，在这里停一会儿。';
      status.textContent = announce ? '窗外已换成' + sky.name : '';
    } catch {
      if (token === request) {
        status.textContent = '这片风景暂时未能打开，请再试一次。';
        status.classList.remove('sr-only'); status.classList.add('sky-load-error');
        viewFeedback.textContent = status.textContent;
      }
    } finally {
      if (token === request) controls.removeAttribute('aria-busy');
    }
  }
  for (const root of [controls.querySelector('.sky-choices'), dialog.querySelector('.sky-view-choices')]) {
    skies.forEach(sky => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'sky-choice';
      button.dataset.skyChoice = sky.id; button.setAttribute('aria-pressed','false');
      button.innerHTML = '<span class="sky-swatch" aria-hidden="true" style="--swatch:'+sky.color+'"></span>'+escape(sky.name);
      button.addEventListener('click',() => choose(sky));
      root.appendChild(button); choices.push(button);
    });
  }
  expand.addEventListener('click',() => {
    if (!current) return;
    updateView(current);
    dialog.showModal(); document.body.classList.add('sky-is-open');
    resetPointer();
  });
  dialog.querySelector('.sky-close').addEventListener('click',() => dialog.close());
  dialog.addEventListener('close',() => {
    document.body.classList.remove('sky-is-open'); resetPointer(); expand.focus({preventScroll:true});
  });
  function resetPointer() {
    cancelAnimationFrame(frame); frame = 0; x = 0; y = 0;
    for (const node of [background,dialog]) {
      node.style.removeProperty('--sky-x');node.style.removeProperty('--sky-y');
    }
  }
  document.addEventListener('pointermove',event => {
    if (event.pointerType !== 'mouse' || !pointerQuery.matches || reduced() || document.hidden) return;
    if (!dialog.open && (!heroVisible || document.querySelector('dialog[open]'))) return;
    x = (event.clientX / innerWidth - .5) * 18;
    y = (event.clientY / innerHeight - .5) * 12;
    if (!frame) frame = requestAnimationFrame(() => {
      const target = dialog.open ? dialog : background;
      target.style.setProperty('--sky-x',x.toFixed(2)+'px');
      target.style.setProperty('--sky-y',y.toFixed(2)+'px');
      frame = 0;
    });
  }, {passive:true});
  document.documentElement.addEventListener('pointerleave',resetPointer);
  document.addEventListener('visibilitychange',resetPointer);
  addEventListener('pagehide',resetPointer);
  reducedQuery.addEventListener('change',resetPointer);
  new MutationObserver(() => {if(reduced()) resetPointer();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  new IntersectionObserver(entries => {heroVisible = entries[0].isIntersecting; if(!heroVisible)resetPointer();}).observe(opening);
  choose(skies[0],false);
})();

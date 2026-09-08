'use strict';
(() => {
  const main = document.getElementById('main');
  const dialog = document.getElementById('brand-detail-dialog');
  const content = document.getElementById('brand-dialog-content');
  const closeButton = dialog.querySelector('[data-brand-close]');
  const catalogue = typeof workDetails === 'undefined' ? {} : workDetails;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const validImage = source => /^images\/[\w./-]+$/.test(source || '') ? source : '';
  const brands = {
    cattea: {
      name: 'Cattea', eyebrow: 'CATTEA / TEA & COMPANY',
      heading: '把茶杯，当作猫窝。', intro: '进来坐坐。每个小细节，都是品牌的一部分。',
      scene: 'images/cattea-05-store-interior.jpg',
      items: [
        {x:30,y:35,label:'看一眼菜单',key:'menu'},
        {x:91,y:59,label:'包装与周边',key:'packaging'},
        {x:65,y:59,label:'猫咪的空间',key:'space'},
        {x:39,y:75,label:'调一杯心情',key:'mix'}
      ],
      details: {
        menu: ['今天想喝什么？','images/cattea-01-menu.jpeg'],
        packaging: ['把茶香带回家','images/cattea-04-merchandise.jpg'],
        space: ['给猫咪，也给人留一个角落','images/cattea-02-store-layout.png']
      },
      mixTitle: '调一杯今天的心情', tastes: ['清新的抹茶','温柔的奶茶','明亮的果茶']
    },
    woola: {
      name: 'Woola', eyebrow: 'WOOLA / FRESH LITTLE JOYS',
      heading: '好事，刚刚出炉。', intro: '一只小狗，一间烘焙店，一些温暖的日常。',
      scene: 'images/woola-01-store.jpg',
      items: [
        {x:26,y:54,label:'挑选甜点',key:'mix'},
        {x:17,y:72,label:'打包好心情',key:'packaging'},
        {x:50,y:32,label:'认识 Woola',key:'identity'},
        {x:79,y:68,label:'换个座位',key:'space'}
      ],
      details: {
        packaging: ['把好心情，装进纸袋','images/woola-03-packaging.jpg'],
        identity: ['从这只小狗开始','images/woola-02-brand-system.jpg'],
        space: ['另一张桌子，另一个角度','images/woola-04-store.jpg']
      },
      mixTitle: '挑一份今天的小确幸', tastes: ['草莓奶油','浓郁可可','清香柠檬']
    }
  };
  let activeBrand = 'cattea';
  let restoreFocus = null;
  let revealObserver = null;

  function show(title, html) {
    restoreFocus = document.activeElement;
    content.innerHTML = '<p class="eyebrow">' + escape(brands[activeBrand].name) + ' / BRAND DETAILS</p><h2 id="brand-dialog-title">' + escape(title) + '</h2>' + html;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    closeButton.focus({preventScroll:true});
  }

  function imageView(source, title) {
    const image = validImage(source);
    if (image) show(title, '<img src="' + escape(image) + '" alt="' + escape(title) + '">');
  }

  function gallery(work) {
    return '<div class="project-gallery" aria-label="完整品牌设计图集">' + (work.gallery || []).filter(item => validImage(item.src)).map((item, index) => {
      const caption = item.caption || work.title;
      return '<figure class="reveal"><button type="button" class="image-open" data-brand-image="' + escape(item.src) + '" data-image-title="' + escape(caption) + '" aria-label="放大图片：' + escape(caption) + '"><img src="' + escape(item.src) + '" alt="' + escape(caption) + '" loading="lazy" decoding="async"><span>放大 ↗</span></button><figcaption>' + String(index + 1).padStart(2, '0') + ' / ' + escape(caption) + '</figcaption></figure>';
    }).join('') + '</div>';
  }

  function render(id, initial = false) {
    if (!Object.hasOwn(brands, id) || !catalogue[id]) return;
    if (dialog.open) dialog.close();
    revealObserver?.disconnect();
    activeBrand = id;
    const brand = brands[id];
    const work = catalogue[id];
    const other = id === 'cattea' ? 'woola' : 'cattea';
    document.body.dataset.brand = id;
    document.title = brand.name + ' · 品牌空间体验 · 黄佩嘉';
    document.querySelectorAll('[data-brand-nav]').forEach(link => {
      if (link.dataset.brandNav === id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const hotspots = brand.items.map(item => '<button type="button" class="hotspot" data-brand-action="' + item.key + '"' + (item.x > 75 ? ' data-edge="end"' : '') + ' style="--x:' + item.x + '%;--y:' + item.y + '%"><span class="point" aria-hidden="true"></span><span class="hot-label">' + escape(item.label) + ' ↗</span></button>').join('');
    const shortcuts = brand.items.map(item => '<button type="button" class="pill" data-brand-action="' + item.key + '">' + escape(item.label) + ' ↗</button>').join('');
    main.innerHTML = '<section class="brand-page ' + id + '"><div class="brand-heading shell"><a class="back-link" href="index.html#atlas">← 回到作品集</a><p class="eyebrow">' + escape(brand.eyebrow) + '</p><h1>' + escape(brand.heading) + '</h1><p>' + escape(brand.intro) + '</p></div><div class="brand-stage"><img class="brand-room" src="' + brand.scene + '" alt="' + escape(work.title) + ' · 门店空间" fetchpriority="high">' + hotspots + '</div><div class="brand-shortcuts shell" role="group" aria-label="探索品牌细节">' + shortcuts + '</div><section class="shell section-pad"><div class="section-top"><div><p class="eyebrow">INSIDE THE BRAND</p><h2>从一个形象，<br>到一整个日常。</h2></div><p>' + escape(work.desc) + '</p></div>' + gallery(work) + '<div class="button-row"><a class="pill" href="#' + other + '">去隔壁的 ' + brands[other].name + ' 看看 ↗</a><a class="text-button" href="index.html#atlas">回到品牌与空间图鉴 ↗</a></div></section></section>';
    wireMotion();
    if (!initial) {
      scrollTo({top:0,behavior:'instant'});
      main.focus({preventScroll:true});
    }
  }

  function brandAction(key) {
    const brand = brands[activeBrand];
    if (key === 'mix') {
      const options = brand.tastes.map(taste => '<button type="button" class="pill" data-brand-mix="' + escape(taste) + '" aria-pressed="false">' + escape(taste) + '</button>').join('');
      show(brand.mixTitle, '<p>选一个口味，收下一张小小的品牌便签。</p><div class="mix-options" role="group" aria-label="选择口味">' + options + '</div><div class="mix-result" id="brand-mix-result" aria-live="polite" aria-atomic="true"><span>' + escape(brand.name.toUpperCase()) + '</span><p>今天，留一点时间给自己。</p></div>');
      return;
    }
    const detail = brand.details[key];
    if (detail) imageView(detail[1], detail[0]);
  }

  function wireMotion() {
    const elements = main.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      }), {threshold:.08});
      elements.forEach(element => revealObserver.observe(element));
    } else elements.forEach(element => element.classList.add('visible'));
    const stage = main.querySelector('.brand-stage');
    stage.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || reducedMotion.matches || !finePointer.matches || dialog.open) return;
      const bounds = stage.getBoundingClientRect();
      stage.style.setProperty('--mx', (event.clientX - bounds.left) / bounds.width * 2 - 1);
      stage.style.setProperty('--my', (event.clientY - bounds.top) / bounds.height * 2 - 1);
    }, {passive:true});
    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--mx', 0);
      stage.style.setProperty('--my', 0);
    });
  }

  main.addEventListener('click', event => {
    const image = event.target.closest('[data-brand-image]');
    if (image) return imageView(image.dataset.brandImage, image.dataset.imageTitle);
    const action = event.target.closest('[data-brand-action]');
    if (action) brandAction(action.dataset.brandAction);
  });
  content.addEventListener('click', event => {
    const choice = event.target.closest('[data-brand-mix]');
    if (!choice) return;
    const result = document.getElementById('brand-mix-result');
    result.innerHTML = '<span>' + escape(choice.dataset.brandMix) + '</span><p>给今天留一点甜，给自己留一点慢。</p><small>一张来自 ' + escape(brands[activeBrand].name) + ' 的心情便签</small>';
    content.querySelectorAll('[data-brand-mix]').forEach(button => button.setAttribute('aria-pressed', String(button === choice)));
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (restoreFocus?.isConnected) restoreFocus.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    revealObserver?.disconnect();
    main.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
    const stage = main.querySelector('.brand-stage');
    stage?.style.setProperty('--mx', 0);
    stage?.style.setProperty('--my', 0);
  });
  function route(initial = false) {
    const hash = location.hash.slice(1).toLowerCase();
    if (hash === 'main') {
      main.focus();
      if (main.querySelector('.brand-page')) return;
    }
    if (hash && hash !== 'main' && !Object.hasOwn(brands, hash)) {
      location.replace('index.html#atlas');
      return;
    }
    render(Object.hasOwn(brands, hash) ? hash : 'cattea', initial);
  }
  addEventListener('hashchange', () => route());
  route(true);
})();

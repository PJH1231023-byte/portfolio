/* ============================================================
   scene25d.js — 2.5D 星空主题作品空间（人物 + 洞洞板）
   独立模块，接管房子点击
   ============================================================ */

(function () {
  'use strict';

  /* ===== 13 件作品钥匙扣图片裁剪位置 ===== */
  var WORK_CROP = {
    'woola':            'center',
    'cattea':           'center',
    'mistscent':        'center',
    'fulu':             'center top',
    'cosmic-astra':     'center',
    'sylva':            'center',
    'tea-yanyan':       'center',
    'kalio':            'center',
    'wangcaicai':       'center',
    'pet-app':          'center top',
    'odyssey':          'center',
    'orderly-journey':  'center',
    'word-of-plants':   'center'
  };

  /* ===== 新钥匙扣封面（用户提供的精选图） ===== */
  var NEW_COVERS = {
    'woola':            'images/woola-cover.png',
    'cattea':           'images/cattea-cover.png',
    'mistscent':        'images/mistscent-cover.png',
    'fulu':             'images/fulu-cover.png',
    'cosmic-astra':     'images/cosmic-astra-cover.png',
    'sylva':            'images/sylva-cover.png',
    'tea-yanyan':       'images/tea-yanyan-cover.png',
    'kalio':            'images/kalio-cover.png',
    'wangcaicai':       'images/wangcaicai-cover.png',
    'pet-app':          'images/petapp-cover.png',
    'odyssey':          'images/odyssey-cover.png',
    'orderly-journey':  'images/orderly-journey-cover.png',
    'word-of-plants':   'images/word-of-plants-cover.png'
  };

  /* 福芦补充数据 */
  var EXTRA_WORKS = {
    'fulu': {
      cat: 'BRAND · 品牌全案',
      title: '福芦 · Fu Lu',
      cover: 'images/fulu-cover.png',
      desc: '以葫芦为核心意象的中式传统文化品牌，主张"传承古今之美，艺术与自然的完美融合"。完整 VI 体系：Logo/色彩/字体/图形/海报/社媒模板/店铺陈列/物料周边。',
      list: ['Logo：葫芦轮廓内嵌凤凰/牡丹/竹/云纹，5种锁定版本', '色彩：藏红花黄/陶土橙/自然米/深棕/灰绿', '字体：HanziPen SC定制品牌字 + Noto Sans SC + Songti SC', '图形：8款葫芦图案 + 牡丹/凤凰/竹/窗棂/祥云装饰', '应用：店铺陈列/社交媒体模板/物料周边'],
      gallery: []
    },
    'word-of-plants': {
      cat: 'PRINT · 平面印刷 / 互动装置',
      title: 'The Word of Plants · 植物之语',
      cover: 'images/word-of-plants-cover.png',
      desc: '一套以植物诠释塔罗牌大阿卡纳的印刷卡片系列。每张塔罗牌对应一种独特的植物，通过植物的形态与象征意义解读塔罗牌的内涵。使用者可以像抽塔罗牌一样，心中带着问题随机抽取一张植物牌，通过植物的花语与象征意义，结合自身问题进行解读与反思。整体采用丝网印刷/Risograph质感，大胆撞色，探索植物、文字与玄学之间的诗意关联。',
      list: [
        '灵感来源：塔罗牌抽牌仪式 + 植物花语文化，将自然意象与玄学解读结合，创造一套可以"抽牌问卜"的植物神谕卡',
        '大阿卡纳系列：愚者/魔术师/女祭司/女皇/皇帝/教皇/恋人/战车/力量/隐者/命运之轮/正义，每张牌对应一种植物',
        '互动方式：心中默念问题 → 随机抽一张植物牌 → 读取该植物的花语与象征 → 结合自身问题综合解读，得出启示',
        '风格：丝网印刷/Risograph 质感，大胆撞色，每张牌独立配色与插画风格，统一中求变化',
        '排版：3行×5列卡牌阵列，左右配以装饰性花纹边框，营造神秘仪式感'
      ],
      gallery: [{ src: 'images/word-of-plants-cover.png', caption: 'The Word of Plants · 植物之语 完整系列', wide: true }]
    }
  };

  /* ===== 洞洞板布局（分类摆放：品牌/IP/UI+视频/平面，4列均匀间距） ===== */
  var PEG_LAYOUT = [
    { y: 8, items: [
      { type: 'keychain', x: 10, id: 'woola' },
      { type: 'keychain', x: 35, id: 'cattea' },
      { type: 'keychain', x: 60, id: 'mistscent' },
      { type: 'keychain', x: 85, id: 'fulu' }
    ]},
    { y: 30, items: [
      { type: 'keychain', x: 10, id: 'cosmic-astra' },
      { type: 'keychain', x: 35, id: 'sylva' },
      { type: 'keychain', x: 60, id: 'tea-yanyan' },
      { type: 'keychain', x: 85, id: 'kalio' }
    ]},
    { y: 52, items: [
      { type: 'keychain', x: 10, id: 'wangcaicai' },
      { type: 'keychain', x: 35, id: 'pet-app' },
      { type: 'keychain', x: 60, id: 'odyssey' },
      { type: 'keychain', x: 85, id: 'orderly-journey' }
    ]},
    { y: 74, items: [
      { type: 'keychain', x: 43, id: 'word-of-plants' }
    ]}
  ];

  /* ===== SVG 装饰图标 ===== */
  var SVG_ICONS = {
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M10.85 12.15L19 4"/><path d="M18 5l2 2"/><path d="M15 8l2 2"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    plant: '<svg viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"/><path d="M7 15c0-3 2-5 5-5s5 2 5 5"/><path d="M12 10c-2-3-1-6 2-7"/><path d="M12 10c2-3 1-6-2-7"/><path d="M9 22h6"/></svg>',
    palette: '<svg viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="#d4af37"/><circle cx="17.5" cy="10.5" r=".5" fill="#d4af37"/><circle cx="8.5" cy="7.5" r=".5" fill="#d4af37"/><circle cx="6.5" cy="12.5" r=".5" fill="#d4af37"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>'
  };

  /* ===== 简历内容 ===== */
  var RESUME_DATA = {
    name: '黄佩嘉',
    role: '产品设计师 / AI 创作者',
    intro: '来自广州，多伦多大学艺术与艺术史专业本科毕业。专注于产品设计与 AI 创作，主张不追求 AI 生成的偶然性，追求 AI 在交付中的「确定性」——用艺术史的眼光判断什么是美，用 AI 的能力把它稳定交付出来。在品牌设计、IP 角色、UI/UX、AI 视频、GEO 等领域有持续的实践与探索。',
    education: [
      { school: '多伦多大学 × 谢尔丹学院 联合培养', major: '艺术与艺术史（Art and Art History）', period: '2020.09 – 2025.06', note: '本科双学位' }
    ],
    hobbies: ['户外徒步', '看展', '电影', '玄学/塔罗', '上海话'],
    fields: ['品牌视觉设计', 'IP 角色创作', 'UI/UX 设计', 'AI 视频生成', 'Vibe Coding / AI 辅助开发', 'GEO / AI Skill 开发'],
    strengths: [
      '设计+AI 双能力：艺术史专业背景培养审美判断力，熟练运用主流 AI 工具实现创意的稳定交付',
      '产品全链路思维：从需求调研、产品文档到上线交付的完整闭环能力，独立完成多个 0→1 项目',
      'GEO 与 AI 工具链落地：探索 GEO 完整流程，开发 AI Skill 提升执行效率，兼具内容思维与工具落地能力',
      'Vibe Coding 实践：用 AI 辅助开发快速搭建可运行产品（Chrome 扩展 / 作品集网站），能将设计落地为可交互体验'
    ],
    experience: [
      { period: '2025 - 至今', role: '独立创作者 / 产品设计师', desc: '独立完成品牌全案、IP 角色设计、AI 视频作品；开发 Chrome 扩展「BOSS阵地粗筛助手」；设计小微物业 SaaS 产品闭环方案；探索 GEO 全套流程与 AI Skill 开发；用 Vibe Coding 方式搭建个人作品集网站。' },
      { period: '2024 - 2025', role: '内容运营 / 新媒体运营', desc: '海外社媒运营与 TikTok 冷启动，产出 25+ 条视频，单条最高播放破万，互动率提升约 30%。' },
      { period: '2023 - 2025', role: 'UTRMB 电影制作社团 · 设计部副部长', desc: '统筹 200 人线下活动，AIGC 栏目内容平均阅读 400+。' }
    ],
    projects: [
      'BOSS 阵地粗筛助手 — Chrome 扩展（Manifest V3），提升招聘筛选效率',
      '小微物业 SaaS — 轻量化巡检流程产品设计与闭环方案',
      'GEO 全套方案与 Skill 开发 — 从内容撰写、数据分析到后续跟进的完整 GEO 流程，配套开发 AI Skill',
      '上海话语音数据标注 — 参与某语音识别模型训练项目，负责上海话语料标注与方言判定',
      '多件完整设计作品 — 品牌全案 / IP 角色 / UI 设计 / AI 视频 / 平面印刷'
    ]
  };

  /* ===== 状态 ===== */
  var overlay, exitBtn, hintEl, particleCanvas, particleCtx;
  var innerEl, contentEl, avatarWindow, resumePanel;
  var imgViewer, imgViewerImg;
  var particles = [];
  var trailParticles = [];
  var mouseX = 0, mouseY = 0;
  var lastMouseX = 0, lastMouseY = 0;
  var targetRotX = 0, targetRotY = 0;
  var curRotX = 0, curRotY = 0;
  var isOpen = false;
  var animId = null;

  /* ===== 工具 ===== */
  function getWork(id) {
    if (EXTRA_WORKS[id]) return EXTRA_WORKS[id];
    if (window.workDetails && window.workDetails[id]) return window.workDetails[id];
    return null;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ===== 构建 DOM ===== */
  function buildDOM() {
    /* 粒子层 */
    var particleWrap = el('div', 'scene25d-particles');
    particleCanvas = document.createElement('canvas');
    particleWrap.appendChild(particleCanvas);
    document.body.appendChild(particleWrap);
    particleCtx = particleCanvas.getContext('2d');

    /* 退出按钮 */
    exitBtn = el('button', 'scene25d-exit', '✕');
    exitBtn.setAttribute('aria-label', '退出场景');
    exitBtn.addEventListener('click', closeScene);
    document.body.appendChild(exitBtn);

    /* 提示文字 */
    hintEl = el('div', 'scene25d-hint', '移动鼠标感受空间 · 点击钥匙扣查看作品 · 点击人物或头像查看简历');
    document.body.appendChild(hintEl);

    /* 左上角头像窗口 */
    avatarWindow = el('div', 'scene25d-avatar-window');
    avatarWindow.setAttribute('role', 'button');
    avatarWindow.setAttribute('tabindex', '0');
    avatarWindow.setAttribute('aria-label', '点击查看简历');
    avatarWindow.innerHTML = '<div class="scene25d-avatar-window__ring"></div><img src="images/avatar-portrait.jpg" alt="黄佩嘉" onerror="this.src=\'images/avatar-home-cutout.png\'" />';
    avatarWindow.addEventListener('click', openResume);
    avatarWindow.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openResume(); }
    });
    document.body.appendChild(avatarWindow);

    /* 简历面板 */
    buildResumePanel();

    /* 场景遮罩 */
    overlay = el('div', 'scene25d-overlay');
    overlay.setAttribute('aria-hidden', 'true');

    innerEl = el('div', 'scene25d-inner');

    /* 星空背景 */
    innerEl.appendChild(el('div', 'scene25d-bg'));
    innerEl.appendChild(el('div', 'scene25d-nebula scene25d-nebula--1'));
    innerEl.appendChild(el('div', 'scene25d-nebula scene25d-nebula--2'));
    innerEl.appendChild(el('div', 'scene25d-nebula scene25d-nebula--3'));

    /* 生成星点 */
    var starsContainer = el('div', 'scene25d-stars');
    for (var i = 0; i < 60; i++) {
      var star = el('div', 'scene25d-star');
      var size = Math.random() * 2 + 0.5;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (2 + Math.random() * 3) + 's';
      starsContainer.appendChild(star);
    }
    innerEl.appendChild(starsContainer);

    /* 内容区 */
    contentEl = el('div', 'scene25d-content');
    contentEl.appendChild(buildCharacter());
    contentEl.appendChild(buildPegboard());
    innerEl.appendChild(contentEl);

    /* Contact Me 区域 */
    var contact = el('div', 'scene25d-contact');
    contact.innerHTML =
      '<div class="scene25d-contact__inner">' +
        '<h2 class="scene25d-contact__title">CONTACT ME</h2>' +
        '<p class="scene25d-contact__sub">欢迎联系我，一起创造有趣的作品</p>' +
        '<div class="scene25d-contact__list">' +
          '<div class="scene25d-contact__item">' +
            '<span class="scene25d-contact__icon">📧</span>' +
            '<span class="scene25d-contact__label">邮箱</span>' +
            '<span class="scene25d-contact__value">i6619774588@163.com</span>' +
          '</div>' +
          '<div class="scene25d-contact__item">' +
            '<span class="scene25d-contact__icon">📱</span>' +
            '<span class="scene25d-contact__label">电话</span>' +
            '<span class="scene25d-contact__value">+86 183-2175-9459</span>' +
          '</div>' +
          '<div class="scene25d-contact__item">' +
            '<span class="scene25d-contact__icon">💬</span>' +
            '<span class="scene25d-contact__label">微信</span>' +
            '<span class="scene25d-contact__value">VvWeChatid18288388</span>' +
          '</div>' +
        '</div>' +
        '<p class="scene25d-contact__footer">© 2026 黄佩嘉 · Portfolio</p>' +
      '</div>';
    innerEl.appendChild(contact);

    overlay.appendChild(innerEl);
    document.body.appendChild(overlay);

    /* 图片放大查看器 */
    buildImgViewer();

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (imgViewer && imgViewer.classList.contains('is-open')) {
          closeImgViewer();
        } else if (resumePanel && resumePanel.classList.contains('is-open')) {
          closeResume();
        } else if (isOpen) {
          closeScene();
        }
      }
    });
  }

  /* ===== 简历面板 ===== */
  function buildResumePanel() {
    resumePanel = el('div', 'scene25d-resume-panel');
    resumePanel.setAttribute('aria-hidden', 'true');

    var backdrop = el('div', 'scene25d-resume-backdrop');
    backdrop.addEventListener('click', closeResume);

    var content = el('div', 'scene25d-resume-content');

    /* 左侧人物 */
    var left = el('div', 'scene25d-resume-left');
    left.innerHTML =
      '<img src="images/avatar-home-shoes-cutout.png" alt="黄佩嘉" />' +
      '<div class="scene25d-resume-name">' + RESUME_DATA.name + '</div>' +
      '<div class="scene25d-resume-role">' + RESUME_DATA.role + '</div>';
    content.appendChild(left);

    /* 右侧内容 */
    var right = el('div', 'scene25d-resume-right');

    var closeBtn = el('button', 'scene25d-resume-close', '✕');
    closeBtn.addEventListener('click', closeResume);
    content.appendChild(closeBtn);

    /* 个人简介 */
    right.appendChild(buildResumeSection('个人简介', '<p>' + RESUME_DATA.intro + '</p>'));

    /* 教育背景 */
    if (RESUME_DATA.education) {
      var eduHtml = RESUME_DATA.education.map(function (e) {
        return '<p style="margin-bottom:10px"><strong style="color:#d4af37">' + e.school + '</strong> · ' + e.major + '<br/><span style="color:#999;font-size:13px">' + e.period + (e.note ? ' · ' + e.note : '') + '</span></p>';
      }).join('');
      right.appendChild(buildResumeSection('教育背景', eduHtml));
    }

    /* 爱好 */
    var hobbiesHtml = '<ul>' + RESUME_DATA.hobbies.map(function (h) {
      return '<li>' + h + '</li>';
    }).join('') + '</ul>';
    right.appendChild(buildResumeSection('兴趣爱好', hobbiesHtml));

    /* 创作领域 */
    if (RESUME_DATA.fields) {
      var fieldsHtml = '<ul>' + RESUME_DATA.fields.map(function (f) {
        return '<li>' + f + '</li>';
      }).join('') + '</ul>';
      right.appendChild(buildResumeSection('创作领域', fieldsHtml));
    }

    /* 个人优势 */
    var strengthsHtml = '<ul>' + RESUME_DATA.strengths.map(function (s) {
      return '<li>' + s + '</li>';
    }).join('') + '</ul>';
    right.appendChild(buildResumeSection('个人优势', strengthsHtml));

    /* 工作经历 */
    var expHtml = RESUME_DATA.experience.map(function (e) {
      return '<p style="margin-bottom:10px"><strong style="color:#d4af37">' + e.period + '</strong> · ' + e.role + '<br/>' + e.desc + '</p>';
    }).join('');
    right.appendChild(buildResumeSection('工作经历', expHtml));

    /* 项目经历 */
    var projHtml = '<ul>' + RESUME_DATA.projects.map(function (p) {
      return '<li>' + p + '</li>';
    }).join('') + '</ul>';
    right.appendChild(buildResumeSection('项目经历', projHtml));

    content.appendChild(right);
    resumePanel.appendChild(backdrop);
    resumePanel.appendChild(content);
    document.body.appendChild(resumePanel);
  }

  function buildResumeSection(title, html) {
    var section = el('div', 'scene25d-resume-section');
    section.innerHTML = '<h3>' + title + '</h3>' + html;
    return section;
  }

  function openResume() {
    if (!resumePanel) return;
    resumePanel.classList.add('is-open');
    resumePanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    if (!resumePanel) return;
    resumePanel.classList.remove('is-open');
    resumePanel.setAttribute('aria-hidden', 'true');
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }

  /* ===== 图片放大查看器 ===== */
  function buildImgViewer() {
    imgViewer = el('div', 'img-viewer');
    imgViewer.setAttribute('aria-hidden', 'true');

    var scroll = el('div', 'img-viewer__scroll');
    imgViewerImg = document.createElement('img');
    imgViewerImg.alt = '';
    scroll.appendChild(imgViewerImg);
    imgViewer.appendChild(scroll);

    var closeBtn = el('button', 'img-viewer__close', '✕');
    closeBtn.setAttribute('aria-label', '关闭图片');
    closeBtn.addEventListener('click', closeImgViewer);
    imgViewer.appendChild(closeBtn);

    var hint = el('div', 'img-viewer__hint', '滚动查看长图 · 点击空白处或按 ESC 关闭');
    imgViewer.appendChild(hint);

    /* 点击背景关闭 */
    imgViewer.addEventListener('click', function (e) {
      if (e.target === imgViewer || e.target === scroll) closeImgViewer();
    });

    document.body.appendChild(imgViewer);

    /* 事件委托：监听模态框里的图片点击 */
    document.addEventListener('click', function (e) {
      var target = e.target;
      if (target.tagName !== 'IMG') return;
      /* 只响应模态框里的图片，排除头像窗口和查看器自身 */
      if (target.closest('.modal') && !target.closest('.img-viewer')) {
        e.preventDefault();
        openImgViewer(target.src);
      }
    });
  }

  function openImgViewer(src) {
    if (!imgViewer || !imgViewerImg) return;
    imgViewerImg.src = src;
    imgViewer.classList.add('is-open');
    imgViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    /* 重置滚动位置 */
    var scroll = imgViewer.querySelector('.img-viewer__scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  function closeImgViewer() {
    if (!imgViewer) return;
    imgViewer.classList.remove('is-open');
    imgViewer.setAttribute('aria-hidden', 'true');
    /* 如果模态框还开着，保持 body overflow hidden */
    var modalOpen = document.querySelector('.modal.is-open');
    if (!modalOpen && !isOpen) document.body.style.overflow = '';
  }

  /* ===== 人物（场景内，可点击查看简历） ===== */
  function buildCharacter() {
    var char = el('div', 'scene25d-character');
    char.setAttribute('role', 'button');
    char.setAttribute('tabindex', '0');
    char.setAttribute('aria-label', '点击查看简历');

    var img = document.createElement('img');
    img.src = 'images/avatar-home-shoes-cutout.png';
    img.alt = '黄佩嘉';
    img.onerror = function () { img.src = 'images/avatar-art-stand.png'; };
    char.appendChild(img);
    char.appendChild(el('div', 'scene25d-char-shadow'));

    /* 悬停提示 */
    var tooltip = el('div', 'scene25d-char-tooltip', '关于我');
    char.appendChild(tooltip);

    /* 点击打开简历 */
    char.addEventListener('click', openResume);
    char.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openResume(); }
    });

    return char;
  }

  /* ===== 洞洞板 ===== */
  function buildPegboard() {
    var board = el('div', 'scene25d-pegboard');
    board.appendChild(el('div', 'scene25d-peg-title', 'MY WORKS · 作品墙'));
    board.appendChild(el('div', 'scene25d-peg-frame'));

    var surface = el('div', 'scene25d-peg-surface');

    PEG_LAYOUT.forEach(function (row) {
      row.items.forEach(function (item) {
        var pegItem;
        if (item.type === 'keychain') pegItem = buildKeychain(item.id);
        else if (item.type === 'note') pegItem = buildNote(item);
        else if (item.type === 'deco') pegItem = buildDeco(item.svg);

        if (pegItem) {
          pegItem.style.left = item.x + '%';
          pegItem.style.top = row.y + '%';
          surface.appendChild(pegItem);
        }
      });
    });

    board.appendChild(surface);
    return board;
  }

  /* ===== 作品钥匙扣 ===== */
  function buildKeychain(id) {
    var work = getWork(id);
    var title = work ? (work.title || id) : id;
    var cover = NEW_COVERS[id] || (work ? (work.cover || '') : '');
    var crop = WORK_CROP[id] || 'center';

    var item = el('div', 'peg-item peg-keychain');
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', '查看作品 ' + title);

    var imgHtml = cover
      ? '<img src="' + cover + '" alt="' + title + '" loading="lazy" style="object-position:' + crop + '" onerror="this.style.display=\'none\';this.parentNode.style.background=\'#2a2a40\'" />'
      : '';

    item.innerHTML =
      '<div class="peg-hook"></div>' +
      '<div class="peg-keychain__ring"></div>' +
      '<div class="peg-keychain__string"></div>' +
      '<div class="peg-keychain__card">' + imgHtml + '</div>';

    item.addEventListener('click', function (e) {
      e.stopPropagation();
      if (typeof window.openModal === 'function') window.openModal(id);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });

    return item;
  }

  /* ===== 便签卡片 ===== */
  function buildNote(data) {
    var item = el('div', 'peg-item peg-note');
    item.innerHTML =
      '<div class="peg-hook"></div>' +
      '<div class="peg-note__card">' +
        '<div class="peg-note__icon">' + data.icon + '</div>' +
        '<div class="peg-note__title">' + data.title + '</div>' +
        '<div class="peg-note__value">' + data.value + '</div>' +
      '</div>';
    return item;
  }

  /* ===== SVG 装饰 ===== */
  function buildDeco(svgKey) {
    var item = el('div', 'peg-item peg-deco');
    item.innerHTML = '<div class="peg-hook"></div><div class="peg-string"></div><div>' + (SVG_ICONS[svgKey] || '') + '</div>';
    return item;
  }

  /* ===== 粒子系统 ===== */
  function initParticles() {
    resizeParticles();
    particles = [];
    trailParticles = [];
    for (var i = 0; i < 80; i++) {
      var rand = Math.random();
      var hue;
      if (rand < 0.4) hue = '212,175,55';       // 金色 40%
      else if (rand < 0.7) hue = '139,92,246';   // 紫色 30%
      else hue = '59,130,246';                    // 蓝色 30%
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.08,
        size: Math.random() * 2.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.25,
        hue: hue,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function resizeParticles() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  /* ===== 鼠标拖尾粒子（绽放效果） ===== */
  function spawnTrailParticle(x, y) {
    if (trailParticles.length > 60) return;
    var rand = Math.random();
    var hue = rand < 0.65 ? '212,175,55' : '139,92,246';
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 0.8 + 0.2;
    trailParticles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.3,
      size: 0,
      maxSize: Math.random() * 3 + 1.5,
      opacity: 0.8 + Math.random() * 0.2,
      hue: hue,
      life: 1.0,
      decay: 0.015 + Math.random() * 0.015,
      grow: 0.15 + Math.random() * 0.1
    });
  }

  function updateParticles() {
    /* 背景氛围粒子 */
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy; p.pulse += 0.015;
      var dx = p.x - mouseX, dy = p.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        var force = (1 - dist / 120) * 0.8;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }
      if (p.x < -20) p.x = particleCanvas.width + 20;
      if (p.x > particleCanvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = particleCanvas.height + 20;
      if (p.y > particleCanvas.height + 20) p.y = -20;
    }
    /* 鼠标拖尾粒子（绽放效果） */
    for (var j = trailParticles.length - 1; j >= 0; j--) {
      var t = trailParticles[j];
      t.x += t.vx;
      t.y += t.vy;
      t.vx *= 0.96;
      t.vy *= 0.96;
      t.life -= t.decay;
      /* 绽放：先放大到maxSize，然后随生命衰减 */
      if (t.size < t.maxSize) {
        t.size += t.grow;
      } else {
        t.size = t.maxSize * t.life;
      }
      t.opacity = Math.max(0, t.life * 0.9);
      if (t.life <= 0) {
        trailParticles.splice(j, 1);
      }
    }
  }

  function drawParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    /* 背景氛围粒子 */
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var flicker = 0.7 + Math.sin(p.pulse) * 0.3;
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      particleCtx.fillStyle = 'rgba(' + p.hue + ',' + (p.opacity * flicker) + ')';
      particleCtx.fill();
      if (p.size > 1.5) {
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        particleCtx.fillStyle = 'rgba(' + p.hue + ',' + (p.opacity * 0.1 * flicker) + ')';
        particleCtx.fill();
      }
    }
    /* 鼠标拖尾粒子（绽放光晕） */
    for (var j = 0; j < trailParticles.length; j++) {
      var t = trailParticles[j];
      if (t.size <= 0) continue;
      /* 外层光晕 */
      particleCtx.beginPath();
      particleCtx.arc(t.x, t.y, t.size * 3.5, 0, Math.PI * 2);
      particleCtx.fillStyle = 'rgba(' + t.hue + ',' + (t.opacity * 0.12) + ')';
      particleCtx.fill();
      /* 中层光晕 */
      particleCtx.beginPath();
      particleCtx.arc(t.x, t.y, t.size * 1.8, 0, Math.PI * 2);
      particleCtx.fillStyle = 'rgba(' + t.hue + ',' + (t.opacity * 0.25) + ')';
      particleCtx.fill();
      /* 核心亮点 */
      particleCtx.beginPath();
      particleCtx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      particleCtx.fillStyle = 'rgba(' + t.hue + ',' + t.opacity + ')';
      particleCtx.fill();
    }
  }

  /* ===== 动画循环 ===== */
  function animLoop() {
    if (!isOpen) return;
    curRotX += (targetRotX - curRotX) * 0.06;
    curRotY += (targetRotY - curRotY) * 0.06;
    if (innerEl) innerEl.style.transform = 'rotateX(' + curRotX + 'deg) rotateY(' + curRotY + 'deg)';
    updateParticles();
    drawParticles();
    animId = requestAnimationFrame(animLoop);
  }

  /* ===== 打开 / 关闭 ===== */
  function openScene() {
    if (!overlay) buildDOM();
    isOpen = true;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    exitBtn.classList.add('is-visible');
    hintEl.classList.add('is-visible');
    avatarWindow.classList.add('is-visible');
    initParticles();
    document.querySelector('.scene25d-particles').classList.add('is-active');
    animId = requestAnimationFrame(animLoop);
  }

  function closeScene() {
    isOpen = false;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    exitBtn.classList.remove('is-visible');
    hintEl.classList.remove('is-visible');
    avatarWindow.classList.remove('is-visible');
    if (resumePanel) closeResume();
    document.querySelector('.scene25d-particles').classList.remove('is-active');
    if (animId) cancelAnimationFrame(animId);
    targetRotX = targetRotY = curRotX = curRotY = 0;
    if (innerEl) innerEl.style.transform = '';
  }

  /* ===== 接管房子点击 ===== */
  function takeoverHouseClick() {
    var house = document.getElementById('heroHouse');
    if (!house) { setTimeout(takeoverHouseClick, 500); return; }
    var newHouse = house.cloneNode(true);
    house.parentNode.replaceChild(newHouse, house);
    newHouse.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openScene();
    });
    console.log('[Scene25D] 星空主题版本已就绪');
  }

  /* ===== 鼠标事件 ===== */
  function bindMouse() {
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!isOpen) return;
      var nx = (e.clientX / window.innerWidth - 0.5) * 2;
      var ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = nx * 4; targetRotX = -ny * 2.5;
      /* 鼠标拖尾粒子：根据移动速度生成 */
      var dx = mouseX - lastMouseX, dy = mouseY - lastMouseY;
      var speed = Math.sqrt(dx * dx + dy * dy);
      var count = Math.min(Math.floor(speed / 8) + 1, 4);
      for (var i = 0; i < count; i++) {
        spawnTrailParticle(
          lastMouseX + dx * (i / count),
          lastMouseY + dy * (i / count)
        );
      }
      lastMouseX = mouseX; lastMouseY = mouseY;
    });
    window.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        var t = e.touches[0];
        mouseX = t.clientX; mouseY = t.clientY;
        if (!isOpen) return;
        var nx = (t.clientX / window.innerWidth - 0.5) * 2;
        var ny = (t.clientY / window.innerHeight - 0.5) * 2;
        targetRotY = nx * 4; targetRotX = -ny * 2.5;
      }
    }, { passive: true });
    window.addEventListener('resize', function () { if (particleCtx) resizeParticles(); });
  }

  /* ===== 初始化 ===== */
  function init() {
    /* 把 EXTRA_WORKS 合并到全局 workDetails，让 openModal 能找到所有作品 */
    if (window.workDetails) {
      for (var key in EXTRA_WORKS) {
        if (!window.workDetails[key]) {
          window.workDetails[key] = EXTRA_WORKS[key];
        }
      }
    }
    /* 模态框打开时暂停场景动画，关闭时恢复（性能优化） */
    var modal = document.getElementById('workModal');
    if (modal) {
      var modalObserver = new MutationObserver(function () {
        if (modal.classList.contains('is-open')) {
          if (animId) { cancelAnimationFrame(animId); animId = null; }
        } else if (isOpen && !animId) {
          animId = requestAnimationFrame(animLoop);
        }
      });
      modalObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }
    bindMouse();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', takeoverHouseClick);
    } else {
      takeoverHouseClick();
    }
  }

  window.Scene25D = { open: openScene, close: closeScene };
  init();
})();

/* =========================================================
   黄佩嘉 · Portfolio 2026 — 交互脚本（原生 JS，无第三方依赖）
   模块：加载动画 / 滚动揭示 / 磨砂导航 / 平滑滚动 /
        星空粒子（星星+流星）/ Hero 视差+房子转动 / 主题切换 /
        作品浮窗 / 洞洞板挂卡
   ========================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 作品数据（点击卡片填充浮窗） ---------------- */
  var workDetails = {
    'woola': {
      cat: 'BRAND · 品牌全案',
      title: 'Woola Cake Shop',
      cover: 'images/woola-02-brand-system.jpg',
      desc: '「Woola」是一个面向年轻女性客群的精品蛋糕咖啡店，以一只圆嘟嘟的小狗为品牌 IP。整套系统覆盖品牌识别 / 包装 / 门店空间，让品牌同时具备线上传播的可爱与线下的高级感。',
      list: [
        '角色 IP：小狗 Woola（主视觉、名片、贴纸、徽章多场景复用）',
        '主色：薄荷绿 / 蜜桃粉 / 暖米色 / 焦糖棕',
        '延展：纸袋 / 外卖杯 / 蛋糕盒 / 烘焙纸 / 杯套 / 托盘',
        '门店：墙面壁画 + 木地板蜡封 + 大理石展柜，视觉与外带一致',
        '社媒：Instagram 9 格模板可承载不同产品海报'
      ],
      gallery: [
        { src: 'images/woola-01-store.jpg', caption: '门店空间 · 落地壁画 + 大理石展柜', wide: true },
        { src: 'images/woola-02-brand-system.jpg', caption: '品牌系统 · 名片 / 配色 / 贴纸 / 收银条' },
        { src: 'images/woola-03-packaging.jpg', caption: '包装延展 · 纸袋 / 外卖杯 / 烘焙包' },
        { src: 'images/woola-04-store.jpg', caption: '门店 · 蛋糕柜 + 多人位桌椅区', wide: true }
      ]
    },
    'cattea': {
      cat: 'BRAND · 品牌全案',
      title: 'Cattea · 茶饮品牌',
      cover: 'images/cattea-05-store-interior.jpg',
      desc: '「Cattea」是一只蜷在茶杯里喝奶茶的小白猫，主打「把茶杯当作猫窝」的暖系治愈体验。整套系统围绕这只白猫展开，从菜单到门店都强调舒适、可爱、可被触摸的细节。',
      list: [
        'IP 主形象：蜷坐茶杯的小白猫（线条版 + 拟人版两套）',
        '色彩：Comfortaa 棕 #D2B48C + 米白 #F5F5DC + 奶油 #FFFFFF',
        '菜单：Cozy Brews（热饮）+ Playful Pours（冰饮）+ Teatime Treats',
        '门店三种布局：Cozy Nook / Catwalk Lounge / Tea Leaf Library',
        '周边：围裙 / 隔热杯垫 / 茶漏 / 笔记本 / 帆布袋 / 贴纸',
        '包装：方盒蛋糕包装 + 茶包自立袋 + 品牌马克杯'
      ],
      gallery: [
        { src: 'images/cattea-05-store-interior.jpg', caption: '门店 · 吧台 + 猫爬架 + 拱形门洞', wide: true },
        { src: 'images/cattea-01-menu.jpeg', caption: '菜单 · Cozy Brews & Playful Pours' },
        { src: 'images/cattea-07-brand-guidelines.jpg', caption: '品牌指南 · Logo / 配色 / 字体 / 图案库', wide: true },
        { src: 'images/cattea-02-store-layout.png', caption: '三种门店布局：Nook / Lounge / Library' },
        { src: 'images/cattea-03-cake-packaging.png', caption: '蛋糕方盒包装 + 标签 / 价签' },
        { src: 'images/cattea-04-merchandise.jpg', caption: '周边 · 围裙 / 茶漏 / 杯垫 / 笔记本 / 帆布袋', wide: true },
        { src: 'images/cattea-06-drinks.jpg', caption: '饮品实拍 · 热饮与冰饮系列' },
        { src: 'images/cattea-08-tea-products.jpg', caption: '茶包 + 马克杯 + 帆布袋礼盒套装' }
      ]
    },
    'pet-app': {
      cat: 'UI · 产品设计',
      title: '宠物健康记录 App',
      cover: 'images/petapp-02-home.jpg',
      desc: '面向「多宠物家庭」的轻量健康记录 App，支持猫咪 / 狗狗 / 其他宠物的切换与差异化记录。整套设计强调「温暖的医疗感」：柔和的薄荷绿 + 暖橙 + 蜜桃粉，配合圆润的卡通图标拉近距离。',
      list: [
        '多宠物切换：Mimi（英短）+ Lucky（柯基）双角色支持',
        '记录维度：喂养 / 遛弯 / 健康（呕吐 / 腹泻 / 状态）/ 照片',
        '档案：基本信息 / 疫苗 / 医疗史 / 详细偏好',
        '色彩：Soft Blue #ADE7E5 · Mint Green #BCE2C8 · Warm Orange #F7C59F · Blush Pink #F4A6B0',
        '组件：按钮 / 输入 / 卡片 / 图标 / 徽章 / 底部 Tab / 侧边菜单',
        '落地：完整配色 + 组件库交付文档'
      ],
      gallery: [
        { src: 'images/petapp-02-home.jpg', caption: '首页 · 今日摘要 + 快速操作', wide: true },
        { src: 'images/petapp-01-record.png', caption: '新增记录 · 喂养 / 遛弯 / 健康多维度' },
        { src: 'images/petapp-03-profile.jpg', caption: '宠物档案 · 基本信息 + 疫苗 + 医疗史', wide: true },
        { src: 'images/petapp-04-design-system.jpg', caption: '设计系统 · 配色 + 组件库', wide: true }
      ]
    },
    'orderly-journey': {
      cat: 'FILM · AI 视频',
      title: '有序的远行 / Orderly Journey',
      cover: 'images/orderly-journey-cover.png',
      desc: '这是一场关于"旅行收纳美学"的视觉盛宴。通过致敬导演韦斯·安德森的经典视觉公式，为虚构高端旅行箱品牌 "Precise Wandering" 打造了一段充满秩序感、强迫症快感与复古奇幻色彩的广告视频。视频核心围绕主角塞莱斯特 (Celeste) 与神秘装置"金色绝对收纳框"展开，探讨了在旅途中，如何在有限的行李箱空间中装进最多的行李。',
      list: [
        '品牌名称 (Brand)：Precise Wandering',
        '核心理念 (Insight)：探讨旅途中如何在有限行李箱空间装进最多行李',
        '品牌口号 (Slogan)：误差 0.00% / 有序，即自由',
        '色彩矩阵：粉黛色 (Dusty Pink) · 柠檬黄 (Lemon Yellow) · 粉末蓝 (Powder Blue) · 奶油色 (Cream)',
        '流程：角色设定 → 剧本 → 分镜脚本 → 文生图 → 图生视频 → 文生音乐 → 剪辑',
        '参数：137 Seconds / 28 Shots / 1080p Resolution',
        '视频链接：https://my.feishu.cn/wiki/BtonwroMHiQ5yvkrW1jcHtNcnlf'
      ],
      gallery: [
        { src: 'images/pptx/image3.jpeg', caption: '作品介绍 · 品牌概念与色彩矩阵', wide: true },
        { src: 'images/pptx/image4.png', caption: '色彩矩阵 · 粉黛 / 柠檬黄 / 粉末蓝 / 奶油色' },
        { src: 'images/pptx/image5.png', caption: '角色设定 · 主角塞莱斯特 (Celeste)' },
        { src: 'images/pptx/image6.png', caption: '制作流程 · 7 步：角色设定→剧本→分镜→文生图→图生视频→文生音乐→剪辑', wide: true },
        { src: 'images/pptx/image7.png', caption: '视频参数 · 137s / 28 shots / 1080p', wide: true }
      ]
    },
    'wild-geometry': {
      cat: 'TYPE · 字体设计',
      title: '狂乱几何 · Wild Geometry',
      cover: 'images/pptx/image53.png',
      color: 'linear-gradient(135deg, #1b1916, #a8512f 50%, #f6f4ef)',
      desc: '探索"暗黑自然主义"在数字手绘环境下的线性表达。设计核心在于模拟生命体在"绞杀"与"干缩"状态下的受力图形。灵感捕捉自绞杀型藤蔓的缠绕逻辑与干枯古木的开裂纹理，用 Procreate 手绘完成。',
      list: [
        '概念：暗黑自然主义 · 绞杀藤蔓缠绕 + 干枯古木开裂',
        'Geometric Fracture（几何断裂）：所有弧线均由锐利多边形切向组成',
        'Pressure Sensitivity（压力感应）：线条粗细对应生命能量的迸发与衰竭',
        'Abstraction（去具象化）：拒绝复刻自然，用"密集排线"构建体积感',
        '工具：Procreate 手绘 + 字体软件后处理',
        '包含大小写 + 数字 + 标点共 64 字位'
      ],
      gallery: [
        { src: 'images/pptx/image53.png', caption: '字体设计概念 · 暗黑自然主义', wide: true },
        { src: 'images/pptx/image54.png', caption: '狂乱几何 · 字符样张' },
        { src: 'images/pptx/image55.png', caption: '字体延展 · 应用场景', wide: true },
        { src: 'images/pptx/image56.png', caption: '字体延展 · 更多字位' }
      ]
    },
    'cosmic-astra': {
      cat: 'IP · 角色设计',
      title: 'Cosmic Astra · 月灵兔',
      cover: 'images/pptx/image8.png',
      desc: '在当代都市文明的坚硬外壳下，灵魂对未知的向往，本质上是对情感寄托与精神自愈的渴求。月灵兔是一种"被遗忘的能量具象"——在不同文明的残篇中似乎能捕捉到流传已久的"月亮与兔子"的潜意识关联。它是连接自然、星辰与都市人破碎情感的唯一介质，跨越成为可以触碰、可以共鸣的"灵魂具象"。',
      list: [
        '世界观：超现实童话 · 星辰与情感深度融合的能量结晶',
        '能力：吸收星尘并转化为情感自愈能量',
        '视觉风格：波普幻觉主义 · 灵感源自 Keith Haring 粗黑线条 + Brian Froud 精灵眼神 + Mati Klarwein 超现实肌理',
        '灵感来源：神秘 / 星空 / 玄学 / 塔罗',
        '色彩体系（Healing Spectrum）：天空蓝 · 蜜桃粉 · 薄荷绿 · 薰衣草紫 · 七彩星海 · 落日黄',
        '延展：人形拟人化方案 · 风格换装 · 表情包'
      ],
      gallery: [
        { src: 'images/pptx/image8.png', caption: '月灵兔 · 角色主形象', wide: true },
        { src: 'images/pptx/image9.jpeg', caption: '视觉基因 · 波普幻觉主义 · 三艺术家灵感碰撞' },
        { src: 'images/pptx/image10.png', caption: '色彩体系 · Healing Spectrum of Astra', wide: true },
        { src: 'images/pptx/image11.png', caption: '角色设定 · 拟人化人形方案' },
        { src: 'images/pptx/image12.png', caption: '角色延展 · 细节展示', wide: true },
        { src: 'images/pptx/image13.png', caption: '角色延展 · 细节展示' },
        { src: 'images/pptx/image14.jpeg', caption: '风格换装 · 多版本形态测试', wide: true },
        { src: 'images/pptx/image15.png', caption: '风格换装 · 形态方案' },
        { src: 'images/pptx/image16.png', caption: '风格换装 · 方案延展' },
        { src: 'images/pptx/image17.png', caption: '风格换装 · 方案延展' },
        { src: 'images/pptx/image18.jpeg', caption: '表情包延展', wide: true },
        { src: 'images/pptx/image19.jpeg', caption: '表情包延展 · 续' },
        { src: 'images/pptx/image20.jpeg', caption: '表情包延展 · 续' },
        { src: 'images/pptx/image21.jpeg', caption: '表情包延展 · 续' }
      ]
    },
    'sylva': {
      cat: 'IP · 角色设计',
      title: 'SYLVA · 萝卜出逃计划',
      cover: 'images/pptx/image30.png',
      desc: '在名为"Greenhouse"的未来数字实验室中，原生精灵 SYLVA 觉醒了自我意识。它不再是受控的试验品，而是进化出了感知情感与穿梭次元的能力。本作品旨在探讨"生命有机体"与"机械电子"之间的边界，通过 SYLVA 呆萌治愈的外表，传递在冷冰冰的赛博世界中依然存在的生命温度。',
      list: [
        '世界观：未来数字实验室 Greenhouse · 原生精灵觉醒',
        '主题：生命有机体 vs 机械电子的边界',
        '角色性格：呆萌治愈 · 传递赛博世界中的生命温度',
        '能力：感知情感 + 穿梭次元',
        '延展：表情包 · 盲盒款式 · 角色三视图'
      ],
      gallery: [
        { src: 'images/pptx/image30.png', caption: 'SYLVA · 角色主形象与介绍', wide: true },
        { src: 'images/pptx/image31.jpeg', caption: '表情包延展' },
        { src: 'images/pptx/image32.jpeg', caption: '表情包延展 · 续' },
        { src: 'images/pptx/image33.png', caption: '表情包延展 · 续' },
        { src: 'images/pptx/image34.png', caption: '表情包延展 · 续' },
        { src: 'images/pptx/image35.jpeg', caption: '盲盒款式 · 角色三视图', wide: true },
        { src: 'images/pptx/image36.png', caption: '盲盒款式 · 三视图续' },
        { src: 'images/pptx/image37.png', caption: '盲盒款式 · 三视图续' },
        { src: 'images/pptx/image38.png', caption: '盲盒款式 · 三视图续' },
        { src: 'images/pptx/image39.png', caption: '盲盒款式 · 三视图续' },
        { src: 'images/pptx/image40.jpeg', caption: '盲盒款式 · 三视图续' },
        { src: 'images/pptx/image41.png', caption: '盲盒款式 · 三视图续' },
        { src: 'images/pptx/image42.jpeg', caption: '盲盒款式 · 三视图续' },
        { src: 'images/pptx/image43.jpeg', caption: '盲盒款式 · 三视图续' }
      ]
    },
    'tea-yanyan': {
      cat: 'IP · 角色设计',
      title: '茶言言 · Tea Persona',
      cover: 'images/pptx/image44.png',
      desc: '"万物皆可茶，凡事皆可言"——茶言言是一个拟人化的茶业 IP 角色。他安静，是那种会静静听你说话、为你递上一杯热茶的陪伴者。他深谙茶道，懂很多山川自然的秘密，但偶尔会因为被茶香陶醉而发呆。',
      list: [
        '信条 (#Belief)：万物皆可茶，凡事皆可言',
        '性格 (#Personality)：INFJ · 安静 · 倾听者 · 递茶人',
        '特质：深谙茶道 · 懂山川自然秘密 · 被茶香陶醉会发呆',
        '延展：色彩体系 (Color Palette) · 表情动作 · 换装 · 杯套'
      ],
      gallery: [
        { src: 'images/pptx/image44.png', caption: '茶言言 · 角色主形象', wide: true },
        { src: 'images/pptx/image45.png', caption: '角色设定 · 性格与信条' },
        { src: 'images/pptx/image46.png', caption: '色彩体系 · Color Palette', wide: true },
        { src: 'images/pptx/image47.png', caption: '色彩体系 · 续' },
        { src: 'images/pptx/image48.png', caption: '表情包动作延展' },
        { src: 'images/pptx/image49.png', caption: '表情包动作延展 · 续' },
        { src: 'images/pptx/image50.png', caption: '茶言言换装', wide: true },
        { src: 'images/pptx/image51.png', caption: '换装 · 续' },
        { src: 'images/pptx/image52.png', caption: '杯套设计延展', wide: true }
      ]
    },
    'mistscent': {
      cat: 'BRAND · 品牌全案',
      title: 'MISTSCENT · 雾香',
      cover: 'images/mistscent-01-overview.jpg',
      desc: '面向「气味疗愈」人群的精品香薰蜡烛品牌。整套系统以「水波涟漪 + 雾」为视觉母题，强调克制、留白与自然质感——所有包装几乎不用彩色，主色调由低饱和的莫兰迪绿与米白构成。',
      list: [
        '视觉母题：手绘水波纹 + 涟漪 Logo（同心不规则圆环）',
        '主色：雾绿 / 米白 / 浅褐，主张「像雾一样」的不打扰设计',
        '产品线：香薰蜡烛（玻璃杯）/ 香薰蜡片（旅行装）/ 芳疗火柴',
        '包装延展：玻璃杯贴标、瓦楞纸盒、牛皮纸手提袋、礼盒、蜡封贴纸',
        'Logo 系统：主标 + 仅图形 + 副标 + 香型独立印章',
        '场景感：留白与阴影让产品在桌面陈列自带「禅意」氛围'
      ],
      gallery: [
        { src: 'images/mistscent-01-overview.jpg', caption: '品牌全家福 · 蜡烛 / 蜡片 / 火柴 / 礼盒 / 标签', wide: true },
        { src: 'images/mistscent-04-logo.png', caption: '品牌 Logo · 雾绿 + 米白 + 中文「雾香」' },
        { src: 'images/mistscent-02-matchbox.jpg', caption: '芳疗火柴盒 · Cedarwood & Moss' },
        { src: 'images/mistscent-05-candle-glass.jpg', caption: '玻璃杯蜡烛 · Forest Bath', wide: true },
        { src: 'images/mistscent-03-wax-tablets.jpg', caption: '旅行装香薰蜡片盒 · Cedarwood & Moss' }
      ]
    },
    'kalio': {
      cat: 'IP · 角色延展',
      title: 'Kalio · 巧巧兔',
      cover: 'images/kalio-01-bunny.jpg',
      desc: '粉系治愈 IP「巧巧兔 Kalio」——一只粉色兔耳、头戴蝴蝶结的女孩角色。整套延展围绕「害羞但好奇」的性格展开，延伸出 5 大主题场景和全品类周边，建立完整的角色生态。',
      list: [
        '三视图：正面 / 侧面 / 背面，含头身比例标注',
        '情绪矩阵：开心 / 害羞 / 撒娇 / 睡觉 / 比心 等 8 种标准表情',
        '5 大场景：樱花林 / 糖果天空 / 星空 / 海底世界 / 雨夜窗边 / 彩虹',
        '周边系统：徽章 / 杯套 / 帆布袋 / 手机壳 / 笔记本 / 围巾袜子',
        '衍生品：3D 化造型（毛绒玩具方向）',
        '配色：奶油粉 #FCE4EC + 蜜桃粉 #FFB6C1 + 樱花粉 #FFD1DC'
      ],
      gallery: [
        { src: 'images/kalio-01-bunny.jpg', caption: '角色延展 · 三视图 + 表情 + 场景 + 周边', wide: true }
      ]
    },
    'wangcaicai': {
      cat: 'IP · 角色延展',
      title: '旺财财 · Husky',
      cover: 'images/wangcaicai-01-husky.jpg',
      desc: '反差萌哈士奇 IP「旺财财」——外形是凶萌的灰白哈士奇，却总是叼着金链子、吐着舌头笑。一套完整 IP 设定，含 6 大场景与全品类周边，适合做表情包、潮玩与品牌联名。',
      list: [
        '三视图：正面 / 侧面 / 背面 + 金链道具的多种戴法',
        '情绪：兴奋 / 卖萌 / 撒娇 / 跑步 / 装酷 / 睡觉 6 大姿态',
        '6 大场景：Park Adventures / Space Husky / Winter Fun / Beach Day / Cozy Home / City Explorer',
        '周边：徽章 / 杯套 / 帆布袋 / 围巾 / 袜子 / 手套 / 笔记本 / 钥匙扣 / 手机壳 / 眼罩',
        '联名方向：咖啡 / 户外 / 滑雪潮牌',
        '配色：哈士奇灰 #4A5568 + 雪白 #F7FAFC + 焦糖棕 #B45309'
      ],
      gallery: [
        { src: 'images/wangcaicai-01-husky.jpg', caption: '角色延展 · 三视图 + 表情 + 6 场景 + 周边', wide: true }
      ]
    },
    'more': {
      cat: 'COMING SOON',
      title: '更多作品即将上架',
      desc: '作品集持续更新中。如需完整版作品集（含影视成片、脚本原文、活动方案与项目复盘），欢迎通过下方联系方式获取云盘链接。',
      list: [
        '影视成片 × 5 · 编导脚本 × 8',
        '活动策划方案 × 6 · 0→1 项目复盘 × 4',
        '联系方式见页脚：i6619774588@163.com',
        'TODO：替换为真实作品封面与详情'
      ]
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    /* ===== 1. 作品封面：把 data-color 写入 CSS 变量 ===== */
    document.querySelectorAll('.work-card__cover[data-color]').forEach(function (c) {
      c.style.setProperty('--c', c.dataset.color);
    });

    /* ===== 2. 加载动画 0% → 100% ===== */
    (function runLoader() {
      var loader = document.getElementById('loader');
      var num = document.getElementById('loaderNum');
      var bar = document.getElementById('loaderBar');
      if (!loader) return;

      document.body.style.overflow = 'hidden';

      if (prefersReduced) {
        num.textContent = '100%';
        bar.style.width = '100%';
        loader.classList.add('is-done');
        document.body.style.overflow = '';
        setTimeout(function () { loader.style.display = 'none'; }, 650);
        return;
      }

      var p = 0;
      function tick() {
        p += Math.random() * 8 + 4;
        if (p > 100) p = 100;
        num.textContent = Math.floor(p) + '%';
        bar.style.width = p + '%';
        if (p < 100) {
          setTimeout(tick, 70 + Math.random() * 70);
        } else {
          setTimeout(function () {
            loader.classList.add('is-done');
            document.body.style.overflow = '';
            setTimeout(function () { loader.style.display = 'none'; }, 650);
          }, 250);
        }
      }
      setTimeout(tick, 150);
    })();

    /* ===== 3. 滚动揭示（只进不退） ===== */
    (function reveals() {
      var items = document.querySelectorAll('.reveal');
      if (prefersReduced || !('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-revealed'); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-revealed');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      items.forEach(function (el) { io.observe(el); });
    })();

    /* ===== 4. 顶部导航：滚动后磨砂玻璃 ===== */
    (function stickyNav() {
      var nav = document.getElementById('topnav');
      if (!nav) return;
      function onScroll() {
        if (window.scrollY > 40) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();

    /* ===== 5. 平滑滚动（顶部导航 / 锚点 / 挂卡） ===== */
    function smoothScrollTo(target) {
      var el = document.querySelector(target);
      if (!el) return;
      var navH = 72;
      var top = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href.length > 1) {
          e.preventDefault();
          smoothScrollTo(href);
        }
      });
    });

    /* ===== 6. Hero 星云：Canvas 绚烂流动星海（鼠标流动 + 主题变色 + 保留流星点缀） ===== */
    (function nebulaCanvas() {
      if (prefersReduced) return;
      var canvas = document.getElementById('heroNebula');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var hero = document.getElementById('hero');
      var W = 0, H = 0;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var parts = [];
      var mouse = { x: -9999, y: -9999, active: false };
      var scrollP = 0;
      var theme = document.body.getAttribute('data-theme') || 'nebulae';

      var palettes = {
        nebulae: [[165,180,252],[139,122,255],[96,165,250],[244,114,182],[167,139,250],[94,234,212],[255,255,255]],
        silver: [[203,213,225],[148,163,184],[100,116,139],[56,189,248],[165,243,252],[226,232,240],[255,255,255]],
        gold: [[231,192,106],[240,201,107],[255,220,150],[244,63,94],[160,113,56],[255,180,120],[255,255,230]]
      };

      function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

      function initParts() {
        var count = Math.round(Math.min(460, Math.max(220, W / 3.6)));
        parts = [];
        var colors = palettes[theme] || palettes.nebulae;
        for (var i = 0; i < count; i++) {
          var big = Math.random() < 0.13;
          var c = pick(colors);
          parts.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: big ? (2.2 + Math.random() * 3.4) : (0.4 + Math.random() * 1.6),
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2 - 0.05,
            c: c,
            glow: big ? 9 : 3.2,
            a: big ? 0.24 + Math.random() * 0.42 : 0.16 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            freq: 0.4 + Math.random() * 0.9,
            amp: 0.12 + Math.random() * 0.4
          });
        }
      }

      function resize() {
        var r = hero.getBoundingClientRect();
        W = r.width; H = r.height;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParts();
      }

      function frame(t) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        var tms = t * 0.00016;
        var fade = Math.max(0, 1 - scrollP * 1.25);
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.vx += Math.sin(tms * p.freq + p.phase) * 0.0016;
          p.vy += Math.cos(tms * p.freq * 0.8 + p.phase) * 0.0012;
          if (mouse.active) {
            var dx = p.x - mouse.x, dy = p.y - mouse.y;
            var d2 = dx * dx + dy * dy;
            var R = 250;
            if (d2 < R * R && d2 > 0.01) {
              var d = Math.sqrt(d2);
              var f = (1 - d / R) * 0.14;
              p.vx += (-dy / d) * f - (dx / d) * 0.09 * (1 - d / R);
              p.vy += (dx / d) * f - (dy / d) * 0.09 * (1 - d / R);
            }
          }
          var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (sp > 0.95) { p.vx = p.vx * 0.95 / sp; p.vy = p.vy * 0.95 / sp; }
          p.x += p.vx + Math.sin(tms + p.phase) * p.amp;
          p.y += p.vy + Math.cos(tms * 1.3 + p.phase) * p.amp * 0.8;
          if (p.x < -40) p.x = W + 40; else if (p.x > W + 40) p.x = -40;
          if (p.y < -40) p.y = H + 40; else if (p.y > H + 40) p.y = -40;

          var alpha = p.a * fade;
          if (alpha < 0.012) continue;
          var tw = 0.72 + 0.28 * Math.sin(tms * 2 + p.phase);
          var a = Math.min(1, alpha * tw);
          var col = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = col + a + ')';
          ctx.fill();
          var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * p.glow);
          g.addColorStop(0, col + (a * 0.4) + ')');
          g.addColorStop(1, col + '0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * p.glow, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(frame);
      }

      window.addEventListener('resize', resize);
      new MutationObserver(function () {
        theme = document.body.getAttribute('data-theme') || 'nebulae';
        initParts();
      }).observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

      window.__nebula = {
        setMouse: function (x, y, on) { mouse.x = x; mouse.y = y; mouse.active = on; },
        setScroll: function (p) { scrollP = p; }
      };

      resize();
      requestAnimationFrame(frame);
    })();

    /* ===== 6.1 CSS 流星点缀 ===== */
    (function shooting() {
      if (prefersReduced) return;
      var shootBox = document.getElementById('heroShooting');
      if (!shootBox) return;
      var SHOOT = 3;
      for (var j = 0; j < SHOOT; j++) {
        var m = document.createElement('span');
        m.className = 'shooting';
        m.style.top = (4 + Math.random() * 36).toFixed(1) + '%';
        m.style.right = (-(Math.random() * 14)).toFixed(1) + '%';
        m.style.setProperty('--sd', (5 + Math.random() * 5).toFixed(1) + 's');
        m.style.setProperty('--sd-delay', (Math.random() * 8).toFixed(1) + 's');
        shootBox.appendChild(m);
      }
    })();

    /* ===== 7. Hero：鼠标视差 + 房子 3D 转动 + 滚动四散转场 ===== */
    (function parallax() {
      if (prefersReduced) return;
      var hero = document.getElementById('hero');
      var bg = document.getElementById('heroBg');
      var house = document.getElementById('heroHouse');
      var mount = document.querySelector('.hero__mount');
      var neb = window.__nebula;
      var mx = 0, my = 0, scrollP = 0, raf = null;
      if (!hero || !bg) return;

      function update() {
        bg.style.transform = 'translate(' + (mx * -30).toFixed(1) + 'px, ' + (my * -30).toFixed(1) + 'px)';
        if (house) {
          var ry = mx * 16, rx = -my * 10;
          var tx = scrollP * -150, ty = -scrollP * 170;
          var sc = 1 - scrollP * 0.55;
          var rot = scrollP * -20;
          house.style.transform =
            'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ') rotate(' + rot.toFixed(1) + 'deg) perspective(900px) rotateY(' + ry.toFixed(1) + 'deg) rotateX(' + rx.toFixed(1) + 'deg)';
          house.style.opacity = String(Math.max(0, 1 - scrollP * 1.3));
        }
        if (mount) {
          mount.style.transform = 'translateY(' + (scrollP * 110).toFixed(1) + 'px) scaleX(' + (1 + scrollP * 0.14).toFixed(3) + ')';
          mount.style.opacity = String(Math.max(0, 1 - scrollP * 1.15));
        }
        if (neb) neb.setScroll(scrollP);
      }

      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
        if (neb) neb.setMouse(e.clientX - r.left, e.clientY - r.top, true);
        update();
      });
      hero.addEventListener('mouseleave', function () {
        mx = 0; my = 0;
        if (neb) neb.setMouse(-9999, -9999, false);
        update();
      });
      window.addEventListener('scroll', function () {
        var h = hero.offsetHeight || 1;
        scrollP = Math.min(1, Math.max(0, window.scrollY / h));
        if (!raf) {
          raf = requestAnimationFrame(function () { raf = null; update(); });
        }
      }, { passive: true });
    })();

    /* ===== 7.5 星空主题切换（记住选择） ===== */
    (function themeSwitch() {
      var root = document.body;
      var btns = document.querySelectorAll('[data-theme-btn]');
      if (!btns.length) return;
      var saved = null;
      try { saved = localStorage.getItem('portfolio-theme'); } catch (e) {}
      if (saved && ['nebulae', 'silver', 'gold'].indexOf(saved) > -1) {
        root.setAttribute('data-theme', saved);
      }
      function sync() {
        var cur = root.getAttribute('data-theme') || 'nebulae';
        btns.forEach(function (b) {
          var on = b.getAttribute('data-theme-btn') === cur;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
      }
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var t = b.getAttribute('data-theme-btn');
          root.setAttribute('data-theme', t);
          try { localStorage.setItem('portfolio-theme', t); } catch (e) {}
          sync();
        });
      });
      sync();
    })();

    /* ===== 8. 作品浮窗 ===== */
    var openModal; /* 暴露给钥匙扣模块调用 */
    (function modal() {
      var modal = document.getElementById('workModal');
      if (!modal) return;
      var cover = document.getElementById('modalCover');
      var cat = document.getElementById('modalCat');
      var title = document.getElementById('modalTitle');
      var desc = document.getElementById('modalDesc');
      var list = document.getElementById('modalList');
      var gallery = document.getElementById('modalGallery');

      function open(key) {
        var d = workDetails[key];
        if (!d) return;
        cat.textContent = d.cat;
        title.textContent = d.title;
        desc.textContent = d.desc;
        list.innerHTML = '';
        (d.list || []).forEach(function (li) {
          var node = document.createElement('li');
          node.textContent = li;
          list.appendChild(node);
        });

        // 封面：有 cover 图片就用图片，否则用 color 渐变
        cover.innerHTML = '';
        if (d.cover) {
          cover.classList.add('has-img');
          cover.style.removeProperty('--c');
          var coverImg = document.createElement('img');
          coverImg.src = d.cover;
          coverImg.alt = d.title;
          cover.appendChild(coverImg);
        } else {
          cover.classList.remove('has-img');
          cover.style.setProperty('--c', d.color || 'linear-gradient(135deg, #1a221a, #243024)');
        }

        // 图集：渲染作品的所有图
        gallery.innerHTML = '';
        (d.gallery || []).forEach(function (item) {
          var fig = document.createElement('figure');
          if (item.wide) fig.className = 'is-wide';
          var img = document.createElement('img');
          img.src = item.src;
          img.alt = item.caption || '';
          img.loading = 'lazy';
          fig.appendChild(img);
          if (item.caption) {
            var cap = document.createElement('figcaption');
            cap.textContent = item.caption;
            fig.appendChild(cap);
          }
          gallery.appendChild(fig);
        });

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
      function close() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      document.querySelectorAll('.work-card').forEach(function (card) {
        card.addEventListener('click', function () {
          open(card.dataset.work || 'more');
        });
      });
      modal.querySelectorAll('[data-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
      });

      /* 暴露 open 给外部模块（钥匙扣等） */
      openModal = open;
      window.openModal = open;
    })();

    /* ===== 9. 按钮点击涟漪反馈 ===== */
    (function ripple() {
      document.querySelectorAll('.hero__cta, .modal__close').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          var rect = btn.getBoundingClientRect();
          var span = document.createElement('span');
          var d = Math.max(rect.width, rect.height);
          span.style.cssText =
            'position:absolute;border-radius:50%;background:rgba(var(--accent-rgb),.35);' +
            'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - rect.left - d / 2) + 'px;' +
            'top:' + (e.clientY - rect.top - d / 2) + 'px;transform:scale(0);' +
            'animation:ripple .6s ease-out forwards;pointer-events:none;';
          var prev = btn.style.position;
          if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
          btn.appendChild(span);
          setTimeout(function () { span.remove(); btn.style.position = prev; }, 620);
        });
      });
      if (!document.getElementById('rippleKeyframes')) {
        var st = document.createElement('style');
        st.id = 'rippleKeyframes';
        st.textContent = '@keyframes ripple{to{transform:scale(2.4);opacity:0;}}';
        document.head.appendChild(st);
      }
    })();

    /* 钥匙扣数据：取 workDetails 中有 cover 的作品（外层作用域，供洞洞板/作品墙共用） */
    var keychainWorks = [
      'woola', 'cattea', 'pet-app', 'orderly-journey',
      'cosmic-astra', 'sylva', 'tea-yanyan', 'wild-geometry',
      'mistscent', 'kalio', 'wangcaicai'
    ];

    /* ===== 10. 钥匙扣板：动态生成 + 悬停摇晃 + 点击展开 ===== */
    (function keychainBoard() {
      var board = document.getElementById('keychainBoard');
      if (!board) return;

      /* 动态生成钥匙扣 DOM */
      keychainWorks.forEach(function (key) {
        var d = workDetails[key];
        if (!d || !d.cover) return;

        var kc = document.createElement('div');
        kc.className = 'keychain reveal';
        kc.dataset.work = key;

        var pin = document.createElement('span');
        pin.className = 'keychain__pin';
        kc.appendChild(pin);

        var str = document.createElement('span');
        str.className = 'keychain__string';
        kc.appendChild(str);

        var ring = document.createElement('span');
        ring.className = 'keychain__ring';
        kc.appendChild(ring);

        var panel = document.createElement('div');
        panel.className = 'keychain__panel';

        var img = document.createElement('img');
        img.src = d.cover;
        img.alt = d.title;
        img.loading = 'lazy';
        panel.appendChild(img);

        var label = document.createElement('div');
        label.className = 'keychain__label';

        var badge = document.createElement('span');
        badge.className = 'keychain__badge';
        badge.textContent = (d.cat || '').split('·')[0].trim() || 'WORK';
        label.appendChild(badge);

        var name = document.createElement('p');
        name.className = 'keychain__name';
        name.textContent = d.title;
        label.appendChild(name);

        panel.appendChild(label);
        kc.appendChild(panel);
        board.appendChild(kc);
      });

      /* 重新观察新生成的 reveal 元素 */
      if ('IntersectionObserver' in window && !prefersReduced) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('is-revealed');
              io.unobserve(en.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        board.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
      } else {
        board.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-revealed'); });
      }

      /* 悬停摇晃：鼠标移动时跟随鼠标轻微倾斜 + 进入时播放摇晃动画 */
      var swayTimers = {};
      board.querySelectorAll('.keychain').forEach(function (kc) {
        /* 鼠标进入 → 播放摇晃 keyframes */
        kc.addEventListener('mouseenter', function () {
          kc.classList.add('is-hovering');
          kc.classList.remove('is-swaying');
          /* 强制 reflow 以重启动画 */
          void kc.offsetWidth;
          kc.classList.add('is-swaying');
          clearTimeout(swayTimers[kc.dataset.work]);
          swayTimers[kc.dataset.work] = setTimeout(function () {
            kc.classList.remove('is-swaying');
          }, 600);
        });

        /* 鼠标离开 → 恢复 */
        kc.addEventListener('mouseleave', function () {
          kc.classList.remove('is-hovering');
          kc.style.transform = '';
        });

        /* 鼠标在钥匙扣上移动 → 轻微跟随倾斜 */
        kc.addEventListener('mousemove', function (e) {
          if (prefersReduced) return;
          var r = kc.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          var rotY = x * 12;
          var rotX = -y * 8;
          kc.style.transform = 'perspective(600px) rotateX(' + rotX.toFixed(1) + 'deg) rotateY(' + rotY.toFixed(1) + 'deg)';
        });

        /* 点击 → 打开作品浮窗 */
        kc.addEventListener('click', function () {
          var key = kc.dataset.work;
          if (key && workDetails[key]) {
            openModal(key);
          }
        });
      });
    })();

    /* ===== 11. 头像鼠标跟随 3D 旋转 ===== */
    (function avatar3D() {
      var avatar = document.getElementById('expAvatar');
      var inner = document.getElementById('avatarInner');
      if (!avatar || !inner || prefersReduced) return;

      avatar.addEventListener('mousemove', function (e) {
        var r = avatar.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        var rotY = x * 18;
        var rotX = -y * 12;
        inner.style.transform = 'perspective(800px) rotateX(' + rotX.toFixed(1) + 'deg) rotateY(' + rotY.toFixed(1) + 'deg)';
        avatar.classList.add('is-active');
      });

      avatar.addEventListener('mouseleave', function () {
        inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        avatar.classList.remove('is-active');
      });
    })();

    /* ===== 12. 3D 房间（Three.js 真 3D 场景：温馨原木书房） ===== */
    /* ===== 12. 3D 房间（全新重建：完整封闭房间 · 参考雪原布局 · Y2K 治愈风 · 不穿模） ===== */
    (function room3d() {
      var overlay = document.getElementById('roomOverlay');
      var stage = document.getElementById('roomStage3d');
      var house = document.getElementById('heroHouse');
      var closeBtn = document.getElementById('roomClose');
      if (!overlay || !stage) return;

      var renderer, scene, camera, controls, raycaster, mouse;
      var interactives = [];
      var inited = false;
      var skyMesh, sunMesh, moonMesh, starGroup, lampLight, lampMesh, lampOn = false;
      var sunLight;
      var catGroup, catTail, catHover = false, camAnim = null, sunspot = null, camAnimOnDone = null;
      var timeOfDay = 14;
      var _todM = (window.location.search || '').match(/tod=(\d+(?:\.\d+)?)/);
      if (_todM) timeOfDay = parseFloat(_todM[1]);
      var skyAuto = false;
      var _texCache = {};

      /* ===== 新作品登记：《奥德赛》主题卡牌游戏 UI 系统（作品展示墙新增） ===== */
      if (typeof workDetails !== 'undefined') {
        workDetails['odyssey'] = {
          cat: 'UI · 游戏设计',
          title: '奥德赛 · 英雄之旅',
          cover: 'images/odyssey-01-title.jpg',
          desc: '「奥德赛 · 英雄之旅」是一款以古希腊史诗为背景的卡牌对战游戏 UI 系统。整套界面采用手绘卡通风格：粗犷的黑色描边、鲜艳的撞色搭配与木质描边相框，让厚重的神话题材兼具活泼与史诗感。从奥德修斯扬帆起航的初始界面，到公羊冲锋的史诗战场，再到胜利结算与宝箱奖励，四个核心界面完整覆盖了「出战 → 对局 → 结算 → 领奖」的游戏闭环。公羊、战船、长矛、希腊众神等主题元素贯穿始终，配合金币宝石资源体系与希腊回纹装饰，形成了高度统一的视觉语言。',
          list: [
            '初始界面：奥德修斯航海冒险场景，游戏标题 + START 入口 + 金币宝石资源显示',
            '战斗界面：双方卡牌对局、战力统计、回合控制与暂停，公羊冲锋的史诗战场',
            '结算界面：胜利场景，战果卷轴统计（伤害 / 掉落 / 回数 / 用时）+ 成就徽章',
            '奖励界面：宝箱开启场景，金币 / 宝石 / 特殊卡牌的奖励呈现与领取动效'
          ],
          gallery: [
            { src: 'images/odyssey-01-title.jpg', caption: '初始界面 · 奥德修斯航海冒险 + 标题 + START', wide: false },
            { src: 'images/odyssey-02-battle.jpg', caption: '战斗界面 · 双方卡牌对局 + 战力统计', wide: false },
            { src: 'images/odyssey-03-victory.jpg', caption: '结算界面 · 战果统计 + 成就徽章', wide: false },
            { src: 'images/odyssey-04-reward.jpg', caption: '奖励界面 · 宝箱开启 + 金币宝石卡牌', wide: false }
          ]
        };
        if (typeof keychainWorks !== 'undefined' && keychainWorks.indexOf('odyssey') < 0) keychainWorks.unshift('odyssey');
      }

      function tex(src) {
        if (_texCache[src]) return _texCache[src];
        var t = new THREE.TextureLoader().load(src);
        t.encoding = THREE.sRGBEncoding;
        _texCache[src] = t;
        return t;
      }

      function init() {
        if (inited) return; inited = true;
        var W = stage.clientWidth || 900, H = stage.clientHeight || 600;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;   /* 柔和阴影（Blender 质感） */
        renderer.toneMapping = THREE.ACESFilmicToneMapping; /* 照片级色调映射：去卡通感 */
        renderer.toneMappingExposure = 1.0;
        stage.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2a2233);   /* 房间外暗背景，衬托室内 */

        /* 室内环境反射（PMREM）：让木质/金属/皮质物体有真实的高光反射，显著提升写实感 */
        (function buildEnv() {
          var pmrem = new THREE.PMREMGenerator(renderer);
          var es = new THREE.Scene();
          es.background = new THREE.Color(0xece2d0);
          var e1 = new THREE.DirectionalLight(0xfff1d2, 1.6); e1.position.set(2, 3, 1); es.add(e1);
          var e2 = new THREE.DirectionalLight(0xcfe0ff, 0.6); e2.position.set(-2, 1, 2); es.add(e2);
          var e3 = new THREE.DirectionalLight(0xffb37a, 0.4); e3.position.set(0, 1, -2); es.add(e3);
          scene.environment = pmrem.fromScene(es).texture;
          scene.environmentIntensity = 0.6;
        })();

        /* 第一人称视角：身处房间内，透视相机，旋转视线 */
        camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
        camera.position.set(-0.6, 2.2, 6.6);
        camera.lookAt(-0.8, 1.5, -2.2);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1.6, -0.8);
        controls.enableDamping = true;
        controls.dampingFactor = 0.09;
        /* 防穿模：站在房间内第一视角，旋转限制在开口扇形内 */
        controls.enablePan = false;
        controls.minDistance = 3.4;
        controls.maxDistance = 9.5;
        controls.maxPolarAngle = Math.PI * 0.52;
        controls.minPolarAngle = Math.PI * 0.12;
        controls.minAzimuthAngle = -0.95;
        controls.maxAzimuthAngle = 0.95;

        /* 灯光：室内独立光照（窗外光仅"透进来一点光感"，不足以让房间曝光，保持明暗层次） */
        scene.add(new THREE.AmbientLight(0xfff2e6, 0.22));
        var hemi = new THREE.HemisphereLight(0xfff6ec, 0xbfa98d, 0.42);
        scene.add(hemi);
        sunLight = new THREE.DirectionalLight(0xfff1d2, 0.85);
        sunLight.position.set(-3, 6, -2);
        sunLight.target.position.set(-0.8, 0.6, 0.6);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.set(2048, 2048);
        sunLight.shadow.camera.left = -7; sunLight.shadow.camera.right = 7;
        sunLight.shadow.camera.top = 7; sunLight.shadow.camera.bottom = -7;
        sunLight.shadow.camera.near = 0.5; sunLight.shadow.camera.far = 30;
        sunLight.shadow.bias = -0.0005;
        scene.add(sunLight);
        scene.add(sunLight.target);
        var fill = new THREE.DirectionalLight(0xd8e8ff, 0.15);
        fill.position.set(5, 4, 6);
        scene.add(fill);

        buildRoom();
        buildSky();
        bindSkyControls();
        bindComputerIcons();
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        renderer.domElement.addEventListener('click', onPick);
        window.addEventListener('resize', onResize);
        window.__room3d = { scene: scene, camera: camera, raycaster: raycaster, renderer: renderer, interactives: interactives };
        /* 展示镜头：URL 带 ?focus=dog|bear|shelf|sofa|desk 时自动飞到目标前（调试/演示用，不带参数不影响） */
        var _f = (window.location.search.match(/focus=(\w+)/) || [])[1];
        if (_f) {
          setTimeout(function () {
            var _m = {
              dog: { p: [2.8, 1.2, -1.0], t: [3.1, 0.4, -2.8] },
              bear: { p: [2.3, 1.2, -1.1], t: [2.6, 0.5, -2.8] },
              shelf: { p: [-5.0, 1.6, -1.1], t: [-5.0, 1.3, -4.0] },
              sofa: { p: [5.3, 1.5, -0.1], t: [5.5, 1.1, -1.8] },
              desk: { p: [-0.5, 1.6, -1.5], t: [-1.2, 1.5, -3.2] }
            }[_f];
            if (_m) flyTo(_m.p, _m.t, null, 1300);
          }, 400);
        }
        animate();
      }

      function onResize() {
        if (!renderer) return;
        var W = stage.clientWidth || 900, H = stage.clientHeight || 600;
        camera.aspect = W / H; camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      }

      function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        if (camAnim) {
          camAnim.t += 16 / camAnim.dur;
          if (camAnim.t >= 1) {
            camera.position.copy(camAnim.toP); controls.target.copy(camAnim.toT);
            camAnim = null;
            if (camAnimOnDone) { var _d = camAnimOnDone; camAnimOnDone = null; _d(); }
          } else {
            var _e = camAnim.t * camAnim.t * (3 - 2 * camAnim.t);
            camera.position.lerpVectors(camAnim.fromP, camAnim.toP, _e);
            controls.target.lerpVectors(camAnim.fromT, camAnim.toT, _e);
          }
        }
        if (catTail && catGroup) {
          var _ct = Date.now() / 1000;
          catTail.rotation.z = (catHover ? Math.sin(_ct * 8) * 0.6 : 0);
          catGroup.position.y = 0.06 + (catHover ? Math.sin(_ct * 10) * 0.02 : 0);
        }
        var _now = Date.now() / 1000;
        if (starGroup) {
          starGroup.children.forEach(function (st) {
            var vis = st.material.userData.vis || 0;
            if (vis > 0) st.material.opacity = vis * (0.55 + 0.45 * Math.sin(_now * st.userData.tw + st.position.x * 17));
          });
        }
        if (skyAuto && overlay.classList.contains('is-open')) {
          timeOfDay += 0.006;
          if (timeOfDay > 24) timeOfDay -= 24;
          var sl = document.getElementById('skySlider');
          if (sl) sl.value = timeOfDay;
          updateSky(timeOfDay);
        }
        if (renderer && scene && camera && overlay.classList.contains('is-open')) renderer.render(scene, camera);
      }

      /* 第一人称运镜：平滑飞向目标位置与视线 */
      function flyTo(pos, lookAt, onDone, dur) {
        camAnim = {
          fromP: camera.position.clone(),
          fromT: controls.target.clone(),
          toP: new THREE.Vector3(pos[0], pos[1], pos[2]),
          toT: new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]),
          t: 0, dur: dur || 1200
        };
        camAnimOnDone = onDone || null;
      }

      /* ---------- 点击拾取 → 弹对应面板 / 运镜 ---------- */
      function onPick(e) {
        if (!renderer || !raycaster) return;
        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var hits = raycaster.intersectObjects(interactives.map(function (o) { return o.mesh; }), true);
        if (!hits.length) return;
        var node = hits[0].object;
        while (node && !node.userData.type) node = node.parent;
        if (!node) return;
        switch (node.userData.type) {
          case 'wall': if (window.openWall) window.openWall(); break;
          case 'computer':
            /* 第一人称运镜：坐到橙色椅、面向电脑，然后放大屏幕看三文件 */
            flyTo([-0.9, 1.32, -2.15], [-1.7, 1.85, -3.5], function () { openComputerScreen(); }, 1300);
            break;
          case 'photos':
            /* 第一人称运镜：站到沙发前看照片墙，然后展示全部照片 */
            flyTo([4.2, 1.5, -1.1], [5.9, 2.0, -1.1], function () { if (window.openPhotoWall) window.openPhotoWall(); }, 1300);
            break;
          case 'dog': openItemInfo('dog'); break;
          case 'bear': openItemInfo('bear'); break;
          case 'plant': openItemInfo('plant'); break;
          case 'shelf': openItemInfo('shelf'); break;
          case 'lamp': toggleLamp(); break;
          case 'avatar': if (window.openPerson) window.openPerson(); break;
          default: break;
        }
      }

      /* 橘猫碰触检测：鼠标悬停摇尾巴 */
      window.addEventListener('mousemove', function (e) {
        if (!renderer || !raycaster || !catGroup) return;
        var rect = renderer.domElement.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        var my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
        var hits = raycaster.intersectObjects(catGroup.children, true);
        catHover = hits.length > 0;
      });

      /* 窗外自然景贴图（蓝天 + 白云 + 远山 + 树，随天色联动变色） */
      function drawSkyCanvas() {
        var c = document.createElement('canvas'); c.width = 512; c.height = 512;
        var g = c.getContext('2d');
        var grad = g.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#7fb8f0');
        grad.addColorStop(0.55, '#bcd9f7');
        grad.addColorStop(1, '#eaf4ff');
        g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
        g.fillStyle = 'rgba(255,255,255,0.9)';
        for (var i = 0; i < 5; i++) {
          var x = Math.random() * 512, y = 30 + Math.random() * 150;
          g.beginPath(); g.arc(x, y, 24, 0, 7); g.arc(x + 30, y + 8, 19, 0, 7); g.arc(x - 30, y + 10, 17, 0, 7); g.fill();
        }
        g.fillStyle = '#7c9a68';
        g.beginPath(); g.moveTo(0, 340);
        for (var x = 0; x <= 512; x += 16) { g.lineTo(x, 340 - Math.abs(Math.sin(x / 60)) * 90); }
        g.lineTo(512, 512); g.lineTo(0, 512); g.closePath(); g.fill();
        g.fillStyle = '#5f8452';
        g.beginPath(); g.moveTo(0, 410);
        for (var x = 0; x <= 512; x += 16) { g.lineTo(x, 410 - Math.abs(Math.cos(x / 50)) * 70); }
        g.lineTo(512, 512); g.lineTo(0, 512); g.closePath(); g.fill();
        g.fillStyle = '#4f7a45';
        for (var i = 0; i < 7; i++) {
          var x = Math.random() * 512;
          g.fillRect(x, 380, 6, 70);
          g.beginPath(); g.arc(x + 3, 370, 17, 0, 7); g.fill();
        }
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }

      /* 圆角盒子（去低多边形方块感，让家具更接近真实造型） */
      function roundedBox(w, h, d, r, seg) {
        var geo = new THREE.BoxGeometry(w, h, d, seg || 6, seg || 6, seg || 6);
        var pos = geo.attributes.position;
        var hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
        for (var i = 0; i < pos.count; i++) {
          var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
          var cx = Math.max(-hx, Math.min(hx, x));
          var cy = Math.max(-hy, Math.min(hy, y));
          var cz = Math.max(-hz, Math.min(hz, z));
          var dx = x - cx, dy = y - cy, dz = z - cz;
          var dl = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
          var k = r / dl;
          pos.setXYZ(i, cx + dx * k, cy + dy * k, cz + dz * k);
        }
        geo.computeVertexNormals();
        return geo;
      }

      /* 原木地板纹理（写实木纹：暖木渐变 + 细腻条纹 + 木节 + 板缝） */
      var _woodCanvas = null;
      function drawWoodCanvas() {
        var c = document.createElement('canvas'); c.width = 512; c.height = 512;
        var g = c.getContext('2d');
        var base = g.createLinearGradient(0, 0, 0, 512);
        base.addColorStop(0, '#e2c9a3'); base.addColorStop(0.5, '#d4b58a'); base.addColorStop(1, '#c9a77a');
        g.fillStyle = base; g.fillRect(0, 0, 512, 512);
        /* 木纹沟槽：加深 + 更细密，让颜色纹理有清晰层次（配合法线贴图显立体） */
        for (var i = 0; i < 160; i++) {
          var y = Math.random() * 512;
          g.fillStyle = 'rgba(150,105,60,' + (0.05 + Math.random() * 0.16) + ')';
          g.fillRect(0, y, 512, 1 + Math.random() * 3);
        }
        /* 木孔噪点：细密小点增强表面颗粒感 */
        for (var p = 0; p < 900; p++) {
          g.fillStyle = 'rgba(120,84,48,' + (0.05 + Math.random() * 0.12) + ')';
          g.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random(), 1 + Math.random());
        }
        for (var k = 0; k < 6; k++) {
          var kx = Math.random() * 512, ky = Math.random() * 512;
          g.fillStyle = 'rgba(120,82,45,0.25)';
          g.beginPath(); g.ellipse(kx, ky, 8 + Math.random() * 10, 4 + Math.random() * 5, 0, 0, 7); g.fill();
          g.fillStyle = 'rgba(90,62,32,0.2)';
          g.beginPath(); g.ellipse(kx, ky, 4 + Math.random() * 5, 2 + Math.random() * 3, 0, 0, 7); g.fill();
        }
        for (var x = 0; x < 512; x += 128) {
          g.fillStyle = 'rgba(110,78,48,0.45)'; g.fillRect(x, 0, 3, 512);
          g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x + 3, 0, 2, 512);
        }
        _woodCanvas = c;
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(2, 1);
        return t;
      }

      var _wallCanvas = null;
      /* 微水泥墙面纹理（细腻颗粒噪点，哑光真实质感） */
      function drawWallCanvas() {
        var c = document.createElement('canvas'); c.width = 256; c.height = 256;
        var g = c.getContext('2d');
        g.fillStyle = '#e6ddd0'; g.fillRect(0, 0, 256, 256);
        for (var i = 0; i < 4200; i++) {
          g.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.06) + ')';
          g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
          g.fillStyle = 'rgba(132,112,84,' + (Math.random() * 0.06) + ')';
          g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
        }
        _wallCanvas = c;
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(4, 3);
        return t;
      }

      /* 从高度图（canvas 亮度）生成法线贴图（Sobel 算子）——材质的立体感来源
         降采样到 256 保证低端环境（软件渲染）也流畅，法线高频细节足够 */
      function normalFromCanvas(srcCanvas, strength) {
        var sw = Math.min(srcCanvas.width, 256), sh = Math.min(srcCanvas.height, 256);
        var sc = document.createElement('canvas'); sc.width = sw; sc.height = sh;
        var sg = sc.getContext('2d'); sg.drawImage(srcCanvas, 0, 0, sw, sh);
        var d = sg.getImageData(0, 0, sw, sh).data;
        var n = document.createElement('canvas'); n.width = sw; n.height = sh;
        var ng = n.getContext('2d');
        var out = ng.createImageData(sw, sh);
        var s = strength || 2;
        function idx(x, y) {
          if (x < 0) x = 0; else if (x >= sw) x = sw - 1;
          if (y < 0) y = 0; else if (y >= sh) y = sh - 1;
          return (y * sw + x) * 4;
        }
        function lum(i) { return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; }
        for (var y = 0; y < sh; y++) {
          var yw = y * sw;
          for (var x = 0; x < sw; x++) {
            var i = (yw + x) * 4;
            var tl = lum(idx(x - 1, y - 1)), t = lum(idx(x, y - 1)), tr = lum(idx(x + 1, y - 1));
            var ml = lum(idx(x - 1, y)), mr = lum(idx(x + 1, y));
            var bl = lum(idx(x - 1, y + 1)), b = lum(idx(x, y + 1)), br = lum(idx(x + 1, y + 1));
            var dx = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
            var dy = (bl + 2 * b + br) - (tl + 2 * t + tr);
            var nx = -dx * s / 255, ny = -dy * s / 255, nz = 1;
            var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            out.data[i] = (nx / len * 0.5 + 0.5) * 255;
            out.data[i + 1] = (ny / len * 0.5 + 0.5) * 255;
            out.data[i + 2] = (nz / len * 0.5 + 0.5) * 255;
            out.data[i + 3] = 255;
          }
        }
        ng.putImageData(out, 0, 0);
        var nt = new THREE.CanvasTexture(n);   /* 法线贴图：不设 sRGB，保持线性数据 */
        nt.wrapS = nt.wrapT = THREE.RepeatWrapping;
        return nt;
      }

      /* 缓存木纹法线（与木纹纹理同源，沟槽/节疤/木孔有起伏） */
      var _woodNorm = null;
      function woodNormal() {
        if (_woodNorm) return _woodNorm;
        if (!_woodCanvas) { try { woodTexture(); } catch (e) {} }
        _woodNorm = normalFromCanvas(_woodCanvas, 2.4);
        _woodNorm.repeat.set(2, 1);
        return _woodNorm;
      }
      /* 缓存墙面法线（微水泥颗粒） */
      var _wallNorm = null;
      function wallNormal() {
        if (_wallNorm) return _wallNorm;
        if (!_wallCanvas) drawWallCanvas();
        _wallNorm = normalFromCanvas(_wallCanvas, 1.6);
        _wallNorm.repeat.set(4, 3);
        return _wallNorm;
      }

      /* 缓存木纹纹理（家具与地板共用，Blender 质感暖木） */
      var _woodTex = null;
      function woodTexture() {
        if (!_woodTex) _woodTex = drawWoodCanvas();
        return _woodTex;
      }

      /* ---------- 完整封闭房间（第一人称身处室内：原木地板 + 奶油微水泥墙 + 天花板，不穿模） ---------- */
      function buildRoom() {
        var floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8.5), new THREE.MeshStandardMaterial({ map: drawWoodCanvas(), normalMap: woodNormal(), color: 0xffffff, roughness: 0.72 }));
        floor.position.set(0, -0.1, -0.25); scene.add(floor);
        var ceil = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8.5), new THREE.MeshStandardMaterial({ color: 0xdfe0e2, roughness: 0.9 }));
        ceil.position.set(0, 4.3, -0.25); scene.add(ceil);
        var wallMat = new THREE.MeshStandardMaterial({ map: drawWallCanvas(), normalMap: wallNormal(), color: 0xffffff, roughness: 0.92 });
        var left = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.4, 8.5), wallMat);
        left.position.set(-6, 2.2, -0.25); scene.add(left);
        var right = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.4, 8.5), wallMat);
        right.position.set(6, 2.2, -0.25); scene.add(right);
        var backL = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.4, 0.2), wallMat);
        backL.position.set(-3.4, 2.2, -4.5); scene.add(backL);
        var backR = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.4, 0.2), wallMat);
        backR.position.set(3.4, 2.2, -4.5); scene.add(backR);
        var winTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.0, 0.2), wallMat);
        winTop.position.set(0, 3.7, -4.5); scene.add(winTop);
        var winBot = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 0.2), wallMat);
        winBot.position.set(0, 0.45, -4.5); scene.add(winBot);

        buildRug();
        buildDesk();
        buildChair();
        buildPegboard();
        buildPhotos();
        buildShelf();
        buildSofa();
        buildCoffeeTable();
        // buildGoldenDog();  /* 已按用户要求去掉金毛，函数保留备用 */
        buildSunspot();
        buildWindow();
        buildLamp();
        buildBearPlush();   /* 泰迪熊+金毛：照片贴图版（卡通化+抠图 billboard） */
        // buildSleepingDog(); /* 几何版金毛趴睡，已被贴图版替代，函数保留备用 */

        /* 柔和阴影：家具投影 + 地板/墙接收，形成体积感与环境光遮蔽般的明暗 */
        scene.traverse(function (o) {
          if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
        });
      }

      /* 桌前圆地毯（暖米底 + 双色描边圈，像参考图的条纹地毯） */
      function drawRugCanvas() {
        var c = document.createElement('canvas'); c.width = 256; c.height = 256;
        var g = c.getContext('2d');
        g.fillStyle = '#f2ead8'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill();
        g.strokeStyle = '#c98a5a'; g.lineWidth = 16; g.beginPath(); g.arc(128, 128, 108, 0, 7); g.stroke();
        g.strokeStyle = '#8fa08a'; g.lineWidth = 7; g.beginPath(); g.arc(128, 128, 94, 0, 7); g.stroke();
        g.fillStyle = 'rgba(201,138,90,0.35)';
        for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; g.beginPath(); g.arc(128 + Math.cos(a) * 70, 128 + Math.sin(a) * 70, 6, 0, 7); g.fill(); }
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }
      function buildRug() {
        var m = new THREE.Mesh(new THREE.CircleGeometry(1.7, 56), new THREE.MeshStandardMaterial({ map: drawRugCanvas(), roughness: 0.92 }));
        m.rotation.x = -Math.PI / 2; m.position.set(0, 0.03, -1.6); scene.add(m);
      }

      /* 靠后墙胡桃木大书桌（Blender 质感：深暖木圆角桌面 + 木质桌腿，屏幕朝观众） */
      function buildDesk() {
        var g = new THREE.Group();
        var top = new THREE.Mesh(roundedBox(3.2, 0.13, 1.5, 0.05, 5), new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xc9a070, roughness: 0.55 }));
        top.position.y = 0.86; g.add(top);
        var legMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xffffff, roughness: 0.6 });
        [[-1.4, -0.55], [1.4, -0.55], [-1.4, 0.55], [1.4, 0.55]].forEach(function (p) {
          var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.78, 16), legMat);
          leg.position.set(p[0], 0.4, p[1]); g.add(leg);
        });
        /* 台式 iMac（桌面偏左，银白一体机复刻雪原） */
        var screen = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.07), new THREE.MeshStandardMaterial({ color: 0xd8dde6, roughness: 0.3, metalness: 0.35 }));
        screen.position.set(-0.9, 1.7, 0.1); g.add(screen);
        var bezel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.03), new THREE.MeshStandardMaterial({ color: 0x23262e, roughness: 0.4 }));
        bezel.position.set(-0.9, 1.7, 0.132); g.add(bezel);
        var panel = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.87), new THREE.MeshBasicMaterial({ map: drawDesktopCanvas() }));
        panel.position.set(-0.9, 1.7, 0.14); g.add(panel);
        var stand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.5, 0.14), new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.5, roughness: 0.4 }));
        stand.position.set(-0.9, 0.98, 0.08); g.add(stand);
        var base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.3), new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.5, roughness: 0.4 }));
        base.position.set(-0.9, 0.84, 0.08); g.add(base);
        /* 笔记本（桌面偏右，屏幕朝观众） */
        var nbBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.6), new THREE.MeshStandardMaterial({ color: 0x3a4152, metalness: 0.4, roughness: 0.5 }));
        nbBase.position.set(0.95, 1.0, -0.1); g.add(nbBase);
        var nbScr = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.58, 0.04), new THREE.MeshStandardMaterial({ color: 0x4a5366, roughness: 0.6 }));
        nbScr.position.set(0.95, 1.3, -0.08); nbScr.rotation.x = -0.4; g.add(nbScr);
        var nbGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.5), new THREE.MeshBasicMaterial({ color: 0x7c8ac0 }));
        nbGlow.position.set(0.95, 1.3, -0.058); nbGlow.rotation.x = -0.4; g.add(nbGlow);
        /* 键盘（显示器前） */
        var kb = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.26), new THREE.MeshStandardMaterial({ color: 0xe8ecf3, roughness: 0.6 }));
        kb.position.set(-0.9, 0.94, 0.48); g.add(kb);
        /* 电话（桌面中左） */
        var phoneB = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.2), new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.5 }));
        phoneB.position.set(-0.05, 0.97, 0.42); g.add(phoneB);
        var phoneR = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 8, 16), new THREE.MeshStandardMaterial({ color: 0x9aa3b5, roughness: 0.5 }));
        phoneR.position.set(-0.05, 1.05, 0.44); phoneR.rotation.x = 0.3; g.add(phoneR);
        /* 茶具（桌面中右） */
        var cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0xffe3b8, roughness: 0.4 }));
        cup.position.set(0.45, 1.0, 0.45); g.add(cup);
        var saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.03, 16), new THREE.MeshStandardMaterial({ color: 0xfff2dc, roughness: 0.5 }));
        saucer.position.set(0.45, 0.95, 0.45); g.add(saucer);
        /* 彩色书本（桌面左后，色彩点缀） */
        var book1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.24), new THREE.MeshStandardMaterial({ color: 0xc95d33, roughness: 0.6 }));
        book1.position.set(0.35, 0.99, -0.28); g.add(book1);
        var book2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.17, 0.22), new THREE.MeshStandardMaterial({ color: 0x7aa8d8, roughness: 0.6 }));
        book2.position.set(0.2, 0.97, -0.27); book2.rotation.y = 0.25; g.add(book2);
        var book3 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0x8fa98f, roughness: 0.6 }));
        book3.position.set(0.32, 0.96, -0.38); book3.rotation.y = -0.15; g.add(book3);
        /* 小盆栽（桌面中左，绿色点缀） */
        var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.11, 10), new THREE.MeshStandardMaterial({ color: 0xb98a5e, roughness: 0.6 }));
        pot.position.set(-0.05, 0.94, -0.35); g.add(pot);
        var leafM = new THREE.MeshStandardMaterial({ color: 0x6f8f60, roughness: 0.8 });
        for (var li = 0; li < 4; li++) {
          var lf = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), leafM);
          lf.position.set(-0.05 + Math.cos(li * 1.7) * 0.05, 1.02 + Math.abs(Math.sin(li * 1.3)) * 0.04, -0.35 + Math.sin(li * 1.7) * 0.05);
          g.add(lf);
        }
        /* 主机（桌下地面右侧） */
        var tower = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.42), new THREE.MeshStandardMaterial({ color: 0xdfe3ec, metalness: 0.3, roughness: 0.5 }));
        tower.position.set(1.3, 0.35, 0.35); g.add(tower);
        var towerGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.08), new THREE.MeshBasicMaterial({ color: 0x7ad9b8 }));
        towerGlow.position.set(1.3, 0.42, 0.563); g.add(towerGlow);
        g.position.set(-0.8, 0.14, -3.6);
        g.userData.type = 'computer';
        scene.add(g);
        interactives.push({ mesh: g, type: 'computer' });
      }

      /* 桌前办公椅（复刻雪原：红色低多边形办公椅） */
      function buildChair() {
        var chair = new THREE.Group();
        var seat = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.16, 24), new THREE.MeshStandardMaterial({ color: 0xc0522d, roughness: 0.5 }));
        seat.position.y = 0.5; chair.add(seat);
        var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0x8a8f98, metalness: 0.5, roughness: 0.4 }));
        pole.position.y = 0.25; chair.add(pole);
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.05, 12), new THREE.MeshStandardMaterial({ color: 0x8a8f98, metalness: 0.5, roughness: 0.4 }));
        base.position.y = 0.03; chair.add(base);
        var backr = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.5, 6, 12), new THREE.MeshStandardMaterial({ color: 0xc0522d, roughness: 0.5 }));
        backr.position.set(0, 0.85, -0.28); backr.rotation.x = 0.25; chair.add(backr);
        chair.position.set(-0.8, 0.14, -2.2); chair.rotation.y = 0.35;
        scene.add(chair);
      }

      /* 左墙黑色钉板贴图（复刻雪原：文档+红图钉+海报+便签） */
      /* 洞洞板贴图：黑色板 + 规则圆孔阵列（洞洞质感） */
      function drawHoleboardCanvas() {
        var c = document.createElement('canvas'); c.width = 512; c.height = 512;
        var g = c.getContext('2d');
        g.fillStyle = '#2a2a2a'; g.fillRect(0, 0, 512, 512);
        g.fillStyle = '#141414';
        for (var y = 30; y < 510; y += 36) { for (var x = 30; x < 510; x += 36) { g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); } }
        g.fillStyle = 'rgba(255,255,255,0.05)';
        for (var y = 30; y < 510; y += 36) { for (var x = 30; x < 510; x += 36) { g.beginPath(); g.arc(x + 2, y + 2, 8, 0, 7); g.fill(); } }
        var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
      }

      /* 洞洞板（窗右侧后墙，上半个墙）：黑色带孔洞板 + 小钥匙扣作品集，可点击放大 */
      function buildPegboard() {
        var g = new THREE.Group();
        var board = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 0.12), new THREE.MeshStandardMaterial({ map: drawHoleboardCanvas(), roughness: 0.85 }));
        board.position.set(0, 1.0, 0); g.add(board);
        var ringMat = new THREE.MeshStandardMaterial({ color: 0xd8b64a, metalness: 0.8, roughness: 0.3 });
        var lineMat = new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.6, roughness: 0.4 });
        var keys = keychainWorks.slice(0, 9);
        keys.forEach(function (key, idx) {
          var d = workDetails[key];
          if (!d || !d.cover) return;
          var col = idx % 3, row = Math.floor(idx / 3);
          var px = (col - 1) * 0.68, py = 1.46 - row * 0.62;
          var img = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.38), new THREE.MeshBasicMaterial({ map: tex(d.cover) }));
          img.position.set(px, py, 0.08); g.add(img);
          var ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 16), ringMat);
          ring.position.set(px, py + 0.24, 0.09); g.add(ring);
          var line = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.07, 6), lineMat);
          line.position.set(px, py + 0.15, 0.09); g.add(line);
        });
        g.position.set(3.5, 1.5, -4.42);
        g.userData.type = 'wall';
        scene.add(g);
        interactives.push({ mesh: g, type: 'wall' });
      }

      /* 右墙照片墙（更高位置，圆/方异形彩色相框混搭，可点击放大） */
      function buildPhotos() {
        var g = new THREE.Group();
        var shots = [
          'images/photo-life-1.png', 'images/photo-life-2.png', 'images/photo-life-3.png',
          'images/photo-life-4.png', 'images/photo-life-5.png', 'images/photo-life-6.png'
        ];
        var styles = [
          { shape: 'circle', color: 0xf0d9ae },
          { shape: 'square', color: 0xffffff },
          { shape: 'circle', color: 0xa8c0a8 },
          { shape: 'square', color: 0xd8c9b0 },
          { shape: 'circle', color: 0xe3b7a9 },
          { shape: 'square', color: 0x9aa3b5 }
        ];
        for (var i = 0; i < 6; i++) {
          var col = i % 3, row = Math.floor(i / 3);
          var st = styles[i];
          var px = (col - 1) * 0.72, py = 2.6 - row * 0.8;
          if (st.shape === 'circle') {
            var frame = new THREE.Mesh(new THREE.CircleGeometry(0.29, 28), new THREE.MeshStandardMaterial({ color: st.color, roughness: 0.4, side: THREE.DoubleSide }));
            frame.position.set(px, py, 0.04); g.add(frame);
            var img = new THREE.Mesh(new THREE.CircleGeometry(0.24, 28), new THREE.MeshBasicMaterial({ map: tex(shots[i]), side: THREE.DoubleSide }));
            img.position.set(px, py, 0.055); g.add(img);
          } else {
            var frame = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.64), new THREE.MeshStandardMaterial({ color: st.color, roughness: 0.4, side: THREE.DoubleSide }));
            frame.position.set(px, py, 0.04); g.add(frame);
            var img = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.56), new THREE.MeshBasicMaterial({ map: tex(shots[i]) }));
            img.position.set(px, py, 0.055); g.add(img);
          }
        }
        g.position.set(5.9, 0.24, -1.1); g.rotation.y = -Math.PI / 2;
        g.userData.type = 'photos';
        scene.add(g);
        interactives.push({ mesh: g, type: 'photos' });
      }

      /* 右上角搁板 + 金色奖杯（复刻雪原：标准奖杯造型，置于墙上架，位置合理） */
      function buildTrophy() {
        var g = new THREE.Group();
        var shelf = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 1.5), new THREE.MeshStandardMaterial({ color: 0x8a5a35, roughness: 0.6 }));
        shelf.position.y = 0.04; g.add(shelf);
        var troMat = new THREE.MeshStandardMaterial({ color: 0xf7d27a, metalness: 0.75, roughness: 0.25 });
        var cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.22, 20), troMat);
        cup.position.set(0, 0.3, 0); g.add(cup);
        var ear = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), troMat);
        ear.position.set(-0.13, 0.34, 0); g.add(ear);
        var ear2 = ear.clone(); ear2.position.x = 0.13; g.add(ear2);
        var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 12), troMat);
        stem.position.set(0, 0.17, 0); g.add(stem);
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.05, 16), troMat);
        base.position.set(0, 0.09, 0); g.add(base);
        var topBall = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), troMat);
        topBall.position.set(0, 0.43, 0); g.add(topBall);
        g.position.set(5.0, 2.35, -1.7); g.rotation.y = -Math.PI / 2;
        scene.add(g);
      }

      /* 右墙角大型绿植（复刻雪原：龟背竹大叶，低多边形） */
      function buildPlant() {
        var g = new THREE.Group();
        var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.6, 20), new THREE.MeshStandardMaterial({ color: 0xb98a5e, roughness: 0.6 }));
        pot.position.y = 0.3; g.add(pot);
        var leafMat = new THREE.MeshStandardMaterial({ color: 0x6f8f60, roughness: 0.8, side: THREE.DoubleSide });
        for (var i = 0; i < 7; i++) {
          var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 1.15, 6), leafMat);
          stem.position.set(Math.cos(i * 1.05) * 0.2, 0.9 + i * 0.04, Math.sin(i * 1.05) * 0.2);
          stem.rotation.z = Math.cos(i * 1.05) * 0.32;
          g.add(stem);
          var leaf = new THREE.Mesh(new THREE.CircleGeometry(0.3, 14), leafMat);
          leaf.position.set(Math.cos(i * 1.05) * 0.48, 1.2 + i * 0.07, Math.sin(i * 1.05) * 0.48);
          leaf.rotation.z = 0.4;
          leaf.scale.set(1, 1.5, 1);
          g.add(leaf);
        }
        g.position.set(5.3, 0.14, -3.6);
        g.userData.type = 'plant';
        scene.add(g);
        interactives.push({ mesh: g, type: 'plant' });
      }

      /* 后墙书架（Blender 质感：浅暖木圆角，底部贴地面，多层搁板摆满书） */
      function buildShelf() {
        var g = new THREE.Group();
        var wood = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xe0c69e, roughness: 0.6 });
        var backMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xd2b285, roughness: 0.7 });
        /* 厚实侧板 + 顶板 + 底板：完整木柜框架，贴着墙那一侧也是清晰木头侧板，不再"像墙" */
        var frameMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xd9b98c, roughness: 0.6 });
        var sideL = new THREE.Mesh(roundedBox(0.16, 2.4, 0.62, 0.05, 4), frameMat); sideL.position.set(-1.0, 1.2, 0); g.add(sideL);
        var sideR = sideL.clone(); sideR.position.x = 1.0; g.add(sideR);
        var top = new THREE.Mesh(roundedBox(2.16, 0.14, 0.62, 0.05, 4), frameMat); top.position.set(0, 2.4, 0); g.add(top);
        var bot = new THREE.Mesh(roundedBox(2.16, 0.12, 0.62, 0.05, 4), frameMat); bot.position.set(0, 0.06, 0); g.add(bot);
        var back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 0.06), backMat); back.position.set(0, 1.2, -0.27); g.add(back);
        var bookCols = [0xc95d33, 0x7aa8d8, 0x8fa98f, 0xe0b080, 0xa8b6d8, 0xc9a070, 0xe0a08a];
        for (var i = 0; i < 5; i++) {
          var shelf = new THREE.Mesh(roundedBox(2.0, 0.06, 0.6, 0.03, 4), wood); shelf.position.set(0, 0.12 + i * 0.54, 0); g.add(shelf);
          if (i < 4) {
            for (var b = 0; b < 7; b++) {
              var bh = 0.28 + Math.random() * 0.14;
              var book = new THREE.Mesh(roundedBox(0.09, bh, 0.34, 0.02, 3), new THREE.MeshStandardMaterial({ color: bookCols[Math.floor(Math.random() * bookCols.length)], roughness: 0.5 }));
              book.position.set(-0.85 + b * 0.28, 0.15 + i * 0.54 + bh / 2, 0.05); g.add(book);
            }
          }
        }
        g.position.set(-5.0, 0.02, -4.15); g.rotation.y = 0;   /* 移除左墙后书架贴后墙左侧 */
        g.userData.type = 'shelf';
        scene.add(g);
      }

      /* 右墙照片墙下贴墙长沙发（复古皮沙发：深棕皮 + 木腿 + 彩色抱枕） */
      function buildSofa() {
        var g = new THREE.Group();
        var sof = new THREE.MeshStandardMaterial({ color: 0x8fa8c8, roughness: 0.5 });   /* 雾蓝布艺（与陶土橙形成冷暖对比） */
        var dark = new THREE.MeshStandardMaterial({ color: 0x7e9cbe, roughness: 0.55 });
        var base = new THREE.Mesh(roundedBox(3.0, 0.42, 0.85, 0.12, 5), sof); base.position.y = 0.21; g.add(base);
        var back = new THREE.Mesh(roundedBox(3.0, 0.75, 0.24, 0.1, 5), sof); back.position.set(0, 0.7, -0.32); g.add(back);
        var pad = new THREE.Mesh(roundedBox(2.9, 0.1, 0.76, 0.05, 5), dark); pad.position.set(0, 0.45, 0.02); g.add(pad);
        var armL = new THREE.Mesh(roundedBox(0.2, 0.55, 0.9, 0.07, 5), sof); armL.position.set(-1.42, 0.33, 0); g.add(armL);
        var armR = armL.clone(); armR.position.x = 1.42; g.add(armR);
        /* 彩色抱枕（橙/雾蓝/浅粉/黄绿四色），为深色沙发增加丰富色彩 */
        var pill = [ { c: 0xc95d33, p: [-0.95, 0.52, 0.05] }, { c: 0xe0b0a0, p: [0.95, 0.52, 0.05] }, { c: 0xd98a5a, p: [-0.55, 0.5, -0.12] }, { c: 0x9aaa83, p: [0.55, 0.5, -0.12] } ];
        pill.forEach(function (q) {
          var pp = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 14), new THREE.MeshStandardMaterial({ color: q.c, roughness: 0.75 }));
          pp.scale.set(1.35, 0.85, 0.5); pp.position.set(q.p[0], q.p[1], q.p[2]); pp.rotation.x = 0.3; g.add(pp);
        });
        var legMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xffffff, roughness: 0.6 });
        [[-1.3, -0.3], [1.3, -0.3], [-1.3, 0.3], [1.3, 0.3]].forEach(function (p) {
          var l = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 10), legMat);
          l.position.set(p[0], 0.11, p[1]); g.add(l);
        });
        g.position.set(5.5, 0.02, -1.9); g.rotation.y = -Math.PI / 2;
        scene.add(g);
      }

      /* 沙发前圆形矮桌（深木纹桌面 + 木质支柱底座） */
      function buildCoffeeTable() {
        var g = new THREE.Group();
        var woodM = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xa97c4f, roughness: 0.55 });
        var top = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.07, 28), woodM);
        top.position.y = 0.42; g.add(top);
        var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.4, 14), woodM);
        leg.position.y = 0.2; g.add(leg);
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.05, 18), woodM);
        base.position.y = 0.025; g.add(base);
        g.position.set(4.3, 0.02, -1.9);
        scene.add(g);
      }

      /* 洞洞板下方地板蜷缩的橘猫（鼠标碰触摇尾巴） */
      /* 洞洞板下方地板趴着的金毛犬（大型犬，脸朝向观众，鼠标碰触摇尾巴） */
      function buildGoldenDog() {
        catGroup = new THREE.Group();
        var gold = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.8 });
        var dark = new THREE.MeshStandardMaterial({ color: 0xc08a30, roughness: 0.8 });
        var black = new THREE.MeshStandardMaterial({ color: 0x2b1f18, roughness: 0.3 });
        /* 俯卧身体（大型犬：宽而长） */
        var body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16), gold);
        body.scale.set(1.5, 0.62, 1.15); body.position.y = 0.22; catGroup.add(body);
        /* 头（身体前方、脸朝观众 z+） */
        var head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16), gold);
        head.position.set(0, 0.3, 0.55); head.scale.set(1, 0.95, 1); catGroup.add(head);
        /* 口鼻 */
        var muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), gold);
        muzzle.position.set(0, 0.26, 0.72); catGroup.add(muzzle);
        /* 鼻头 */
        var nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), black);
        nose.position.set(0, 0.3, 0.84); catGroup.add(nose);
        /* 眼睛（面向观众） */
        var eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), black);
        eyeL.position.set(-0.12, 0.38, 0.68); catGroup.add(eyeL);
        var eyeR = eyeL.clone(); eyeR.position.x = 0.12; catGroup.add(eyeR);
        /* 金毛大垂耳（两侧垂下） */
        var earL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), dark);
        earL.position.set(-0.3, 0.32, 0.5); earL.scale.set(0.7, 1.6, 0.6); catGroup.add(earL);
        var earR = earL.clone(); earR.position.x = 0.3; catGroup.add(earR);
        /* 四条腿（两侧趴着） */
        var legM = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.2, 8), gold);
        var legs = [[-0.36, 0.1, 0.15], [0.36, 0.1, 0.15], [-0.36, 0.1, -0.25], [0.36, 0.1, -0.25]];
        legs.forEach(function (p) { var l = legM.clone(); l.position.set(p[0], p[1], p[2]); catGroup.add(l); });
        /* 尾巴（后部翘起，可摆动） */
        catTail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 0.6, 8), gold);
        catTail.position.set(0, 0.32, -0.72); catTail.rotation.x = -0.9; catGroup.add(catTail);
        catGroup.position.set(3.5, 0.06, -3.35);
        catGroup.userData.type = 'dog';
        scene.add(catGroup);
        interactives.push({ mesh: catGroup, type: 'dog' });
      }

      /* 洞洞板下方靠墙的泰迪熊玩偶（坐姿朝观众，暖棕毛绒，颜色鲜明） */
      /* 泰迪熊 + 金毛：卡通贴图版（真实照片 → 卡通化 → 抠图 → billboard 立体形象）
         用带透明背景的贴图做公告板，随视角保持正面，比几何建模真实且可爱 */
            /* 泰迪熊 + 金毛：卡通贴图版（真实照片 → 卡通化 → 抠图 → billboard 立体形象）
         用带透明背景的贴图做公告板，随视角保持正面，比几何建模真实且可爱 */
      function buildBearPlush() {
        var btex = tex('images/bear-dog-cutout.png');
        var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: btex, transparent: true, depthWrite: false }));
        sp.scale.set(0.92, 1.15, 1);
        sp.position.set(2.5, 0.58, -2.9);
        sp.userData.type = 'bear';
        scene.add(sp);
        interactives.push({ mesh: sp, type: 'bear' });
        var sh = new THREE.Mesh(new THREE.CircleGeometry(0.5, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false }));
        sh.rotation.x = -Math.PI / 2; sh.position.set(2.5, 0.02, -2.9); scene.add(sh);
      }

      /* 金毛趴在泰迪熊身边睡觉（面向观众，能看清狗脸：闭眼/垂耳/粉腮红，鲜明金黄） */
      function buildSleepingDog() {
        var g = new THREE.Group();
        var gold = new THREE.MeshBasicMaterial({ color: 0xe3a83a });    /* 鲜明金黄（不受光照，夜晚也可见） */
        var goldL = new THREE.MeshBasicMaterial({ color: 0xf2c469 });    /* 浅金黄（胸/口鼻/爪） */
        var dark = new THREE.MeshBasicMaterial({ color: 0xc9882a });     /* 深金黄（耳/背） */
        var eyeMat = new THREE.MeshBasicMaterial({ color: 0x2b1f18 });
        var noseM = new THREE.MeshBasicMaterial({ color: 0x3a2418 });
        var blushM = new THREE.MeshBasicMaterial({ color: 0xf2a9a0 });
        /* 身体：趴卧，前后方向（+z 为头朝向观众） */
        var body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 14), gold);
        body.scale.set(1.1, 0.55, 1.35); body.position.set(0, 0.16, -0.05); g.add(body);
        /* 头：朝 +z（面向观众），微微侧向熊 */
        var head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), gold);
        head.position.set(0, 0.26, 0.32); g.add(head);
        /* 口鼻：浅金黄小圆 */
        var snout = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), goldL);
        snout.position.set(0, 0.24, 0.46); snout.scale.set(1, 0.7, 0.8); g.add(snout);
        /* 鼻子 */
        var nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), noseM);
        nose.position.set(0, 0.27, 0.53); g.add(nose);
        /* 大垂耳（两侧耷拉） */
        var earM = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), dark);
        var earL = earM.clone(); earL.position.set(-0.19, 0.3, 0.2); earL.scale.set(0.7, 1.4, 0.6); g.add(earL);
        var earR = earM.clone(); earR.position.set(0.19, 0.3, 0.2); earR.scale.set(0.7, 1.4, 0.6); g.add(earR);
        /* 闭眼（两道眯眼线，朝观众） */
        var eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.02), eyeMat); eyeL.position.set(-0.09, 0.31, 0.47); g.add(eyeL);
        var eyeR = eyeL.clone(); eyeR.position.x = 0.09; g.add(eyeR);
        /* 粉色腮红 */
        var bl = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), blushM); bl.position.set(-0.14, 0.2, 0.42); g.add(bl);
        var br = bl.clone(); br.position.set(0.14, 0.2, 0.42); g.add(br);
        /* 前爪：头两侧前伸 */
        var pawM = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.26, 10), goldL);
        var pawL = pawM.clone(); pawL.position.set(-0.2, 0.1, 0.28); pawL.rotation.x = 0.5; g.add(pawL);
        var pawR = pawM.clone(); pawR.position.set(0.2, 0.1, 0.28); pawR.rotation.x = 0.5; g.add(pawR);
        /* 后腿：收拢在身后 */
        var hipM = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.18, 10), gold);
        var hipL = hipM.clone(); hipL.position.set(-0.18, 0.1, -0.35); hipL.rotation.x = -0.4; g.add(hipL);
        var hipR = hipM.clone(); hipR.position.set(0.18, 0.1, -0.35); hipR.rotation.x = -0.4; g.add(hipR);
        /* 尾巴：贴地 */
        var tail = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), gold);
        tail.position.set(0, 0.15, -0.5); tail.scale.set(1, 0.7, 1.2); g.add(tail);
        g.position.set(2.95, 0.02, -2.85);
        g.rotation.y = -0.25;   /* 微微转向熊，依偎感 */
        g.userData.type = 'dog';
        scene.add(g);
        interactives.push({ mesh: g, type: 'dog' });
      }

      /* 窗外阳光光斑（白天从窗洒进室内的光影） */
      function buildSunspot() {
        var c = document.createElement('canvas'); c.width = 256; c.height = 256;
        var g = c.getContext('2d');
        var rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        rg.addColorStop(0, 'rgba(255,244,196,0.8)');
        rg.addColorStop(0.6, 'rgba(255,238,180,0.4)');
        rg.addColorStop(1, 'rgba(255,238,180,0)');
        g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
        var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
        sunspot = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false }));
        sunspot.rotation.x = -Math.PI / 2;
        sunspot.position.set(0, 0.08, -2.6);
        scene.add(sunspot);
      }

      /* 后墙书桌后方落地窗（窗外自然景），田字窗框 + 两侧窗帘 + 顶部帘杆 */
      function buildWindow() {
        var g = new THREE.Group();
        var frMat = new THREE.MeshStandardMaterial({ color: 0xd9b98c, roughness: 0.5 });
        var fL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.14), frMat); fL.position.set(-1.62, 1.62, 0); g.add(fL);
        var fR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.14), frMat); fR.position.set(1.62, 1.62, 0); g.add(fR);
        var fT = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 0.14), frMat); fT.position.set(0, 3.24, 0); g.add(fT);
        var fB = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 0.14), frMat); fB.position.set(0, 0.08, 0); g.add(fB);
        var glass = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.1), new THREE.MeshBasicMaterial({ color: 0xdff0ff, transparent: true, opacity: 0.18, side: THREE.DoubleSide }));
        glass.position.set(0, 1.66, 0.03); g.add(glass);
        /* 田字中框：横中框 + 竖中框 */
        var fM = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.07, 0.07), frMat); fM.position.set(0, 1.66, 0.07); g.add(fM);
        var fV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 3.1, 0.07), frMat); fV.position.set(0, 1.66, 0.07); g.add(fV);
        /* 窗帘：墨绿布帘（为房间增加饱和色彩层次） */
        var curMat = new THREE.MeshStandardMaterial({ color: 0x8fa08a, roughness: 0.92 });
        var curL = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.3, 0.07), curMat); curL.position.set(-2.15, 1.66, 0.05); g.add(curL);
        var curR = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.3, 0.07), curMat); curR.position.set(2.15, 1.66, 0.05); g.add(curR);
        var curTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.28, 0.07), curMat); curTop.position.set(0, 3.32, 0.05); g.add(curTop);
        var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 4.0, 12), new THREE.MeshStandardMaterial({ color: 0x6b5543, roughness: 0.6 }));
        rod.rotation.z = Math.PI / 2; rod.position.set(0, 3.4, -0.06); g.add(rod);
        g.position.set(0, 0.14, -4.45);
        scene.add(g);
      }

      /* 卡通 AI 形象：真正坐在桌前椅上（底部贴椅面，不悬空），点击弹出个人介绍 */
      function buildAvatar3D() {
        var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('images/avatar-3d-sit.png'), transparent: true, depthWrite: false, alphaTest: 0.05 }));
        sp.scale.set(1.0, 1.66, 1);
        sp.position.set(-0.8, 1.42, -1.78);
        sp.userData.type = 'avatar';
        scene.add(sp);
        interactives.push({ mesh: sp, type: 'avatar' });
      }

      /* 窗外弯月贴图（月牙形状） */
      function drawMoonCanvas() {
        var c = document.createElement('canvas'); c.width = 128; c.height = 128;
        var g = c.getContext('2d');
        g.fillStyle = '#fff6e0';
        g.beginPath(); g.arc(60, 64, 50, 0, 7); g.fill();
        g.globalCompositeOperation = 'destination-out';
        g.beginPath(); g.arc(80, 52, 44, 0, 7); g.fill();
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }

      /* 窗外天空：自然景板 + 太阳 + 弯月 + 星海光点（与进入前的户外天空前后呼应） */
      function buildSky() {
        skyMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0xcfeaff, map: drawSkyCanvas() }));
        skyMesh.position.set(0, 1.8, -5.5);
        skyMesh.lookAt(0, 1.8, -1);
        scene.add(skyMesh);
        sunMesh = new THREE.Mesh(new THREE.CircleGeometry(0.5, 44), new THREE.MeshBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0 }));
        sunMesh.position.set(-1.0, 2.9, -5.3);
        sunMesh.lookAt(0, 1.8, -1);
        scene.add(sunMesh);
        moonMesh = new THREE.Mesh(new THREE.CircleGeometry(0.34, 44), new THREE.MeshBasicMaterial({ color: 0xfff6e0, transparent: true, opacity: 0, map: drawMoonCanvas() }));
        moonMesh.position.set(1.0, 2.9, -5.3);
        moonMesh.lookAt(0, 1.8, -1);
        scene.add(moonMesh);
        /* 星空光点：发光圆点贴图，随夜晚闪烁 */
        var starMap = drawStarCanvas();
        starGroup = new THREE.Group();
        var starMat = new THREE.MeshBasicMaterial({ map: starMap, transparent: true, opacity: 0, depthWrite: false });
        for (var s = 0; s < 120; s++) {
          var sz = 0.06 + Math.random() * 0.2;
          var st = new THREE.Mesh(new THREE.PlaneGeometry(sz, sz), starMat.clone());
          st.position.set(-1.6 + Math.random() * 3.2, 0.4 + Math.random() * 2.9, -5.3);
          st.lookAt(0, 1.8, -1);
          st.userData.tw = 0.5 + Math.random() * 1.6;
          starGroup.add(st);
        }
        scene.add(starGroup);
        updateSky(timeOfDay);
      }

      /* 星星发光光点贴图（径向渐变圆点） */
      function drawStarCanvas() {
        var c = document.createElement('canvas'); c.width = 64; c.height = 64;
        var g = c.getContext('2d');
        var rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        rg.addColorStop(0, 'rgba(255,255,255,1)');
        rg.addColorStop(0.35, 'rgba(255,255,255,0.75)');
        rg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }

      /* 高落地灯（复古黄铜，可开关，靠左墙、离桌较远、比电脑高，灯罩高位） */
      function buildLamp() {
        lampMesh = new THREE.Group();
        var brass = new THREE.MeshStandardMaterial({ color: 0xc9974f, metalness: 0.6, roughness: 0.35 });
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.08, 20), brass);
        base.position.y = 0.04; lampMesh.add(base);
        var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.9, 12), brass);
        pole.position.y = 1.05; lampMesh.add(pole);
        var shade = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffd3a3, roughness: 0.4, emissive: 0xffc983, emissiveIntensity: 0.9 }));
        shade.position.y = 2.05; lampMesh.add(shade);
        var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfff3d6, transparent: true, opacity: 0.25 }));
        bulb.position.y = 2.02; lampMesh.add(bulb);
        lampMesh.position.set(-3.2, 0.02, -2.8);
        lampMesh.userData.type = 'lamp';
        scene.add(lampMesh);
        interactives.push({ mesh: lampMesh, type: 'lamp' });
        lampLight = new THREE.PointLight(0xffc983, 0, 9);
        lampLight.position.set(-3.2, 2.1, -2.8);
        scene.add(lampLight);
      }

      /* 时间 → 窗外天色 + 室内光照联动 */
      function updateSky(t) {
        var daylight, sunH, sunVis, moonVis, starVis;
        var skyCol = new THREE.Color();
        if (t >= 5 && t < 8) {
          var k = (t - 5) / 3;
          daylight = 0.35 + k * 0.5;
          skyCol.lerpColors(new THREE.Color(0x35507a), new THREE.Color(0x9ac8f0), k);
          sunH = k; sunVis = 1; moonVis = 1 - k; starVis = 0.4 * (1 - k);
        } else if (t >= 8 && t < 17) {
          daylight = 0.85;
          skyCol.set(0xcfeaff);
          sunH = 1 - Math.abs((t - 12.5) / 4.5) * 0.3; sunVis = 1; moonVis = 0; starVis = 0;
        } else if (t >= 17 && t < 20) {
          var k2 = (t - 17) / 3;
          daylight = 0.85 - k2 * 0.5;
          skyCol.lerpColors(new THREE.Color(0xcfeaff), new THREE.Color(0x3a2a5e), k2);
          sunH = 1 - k2; sunVis = 1 - k2; moonVis = k2; starVis = 0.55 * k2;
        } else {
          daylight = 0.3;
          skyCol.set(0x0b1030);
          sunH = 0; sunVis = 0; moonVis = 1; starVis = 1;
        }
        if (skyMesh) skyMesh.material.color.copy(skyCol);
        if (sunMesh) { sunMesh.material.opacity = sunVis; sunMesh.visible = sunVis > 0.05; sunMesh.position.set(-1.4 + sunH * 2.8, 0.7 + sunH * 2.6, -5.3); }
        if (moonMesh) { moonMesh.material.opacity = moonVis; moonMesh.visible = moonVis > 0.05; }
        if (starGroup) starGroup.children.forEach(function (st) { st.material.userData.vis = starVis; st.material.opacity = starVis; });
        var ambient = scene.children.filter(function (o) { return o.isAmbientLight; })[0];
        if (ambient) ambient.intensity = 0.16 + daylight * 0.12;   /* 室内光独立，窗外光不造成曝光 */
        var hemi = scene.children.filter(function (o) { return o.isHemisphereLight; })[0];
        if (hemi) hemi.intensity = 0.18 + daylight * 0.2;
        var warm = scene.children.filter(function (o) { return o.isPointLight && o.position.y > 3; })[0];
        if (warm) warm.intensity = (lampOn ? 1.5 : 0.4) + daylight * 0.5;
        if (sunLight) sunLight.intensity = 0.2 + daylight * 0.62;   /* 窗外光仅"透进来一点光感" */
        if (sunspot) sunspot.material.opacity = daylight * 0.55;      /* 阳光光斑：白天洒进室内，夜晚消失 */
      }

      function toggleLamp() {
        lampOn = !lampOn;
        if (lampLight) lampLight.intensity = lampOn ? 2.2 : 0;
        var shade = lampMesh ? lampMesh.children[2] : null;
        if (shade && shade.material) shade.material.emissiveIntensity = lampOn ? 2.4 : 0.9;
        var btn = document.getElementById('lampToggle');
        if (btn) btn.textContent = lampOn ? '台灯 已开' : '台灯 关闭';
      }

      function bindSkyControls() {
        var sl = document.getElementById('skySlider');
        if (sl) sl.addEventListener('input', function () {
          timeOfDay = parseFloat(sl.value); updateSky(timeOfDay);
        });
        document.querySelectorAll('.room__sky-btn[data-t]').forEach(function (b) {
          b.addEventListener('click', function () {
            timeOfDay = parseFloat(b.getAttribute('data-t'));
            if (sl) sl.value = timeOfDay;
            updateSky(timeOfDay);
          });
        });
        var auto = document.getElementById('skyAuto');
        if (auto) auto.addEventListener('change', function () { skyAuto = auto.checked; });
        var lamp = document.getElementById('lampToggle');
        if (lamp) lamp.addEventListener('click', toggleLamp);
      }

      /* iMac 桌面贴图：Y2K 渐变 + 简历/游戏/项目三图标 */
      function drawDesktopCanvas() {
        var c = document.createElement('canvas'); c.width = 1024; c.height = 640;
        var g = c.getContext('2d');
        var grd = g.createLinearGradient(0, 0, 1024, 640);
        grd.addColorStop(0, '#eaf4ff'); grd.addColorStop(0.5, '#e8dcff'); grd.addColorStop(1, '#e0f6ec');
        g.fillStyle = grd; g.fillRect(0, 0, 1024, 640);
        g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.arc(840, 120, 120, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.4)'; g.beginPath(); g.arc(160, 500, 160, 0, 7); g.fill();
        g.fillStyle = 'rgba(122,82,112,0.9)';
        g.font = '600 32px "PingFang SC", "Microsoft YaHei", sans-serif';
        g.textAlign = 'center';
        g.fillText('黄佩嘉的 iMac', 512, 62);
        var icons = [
          { x: 300, label: '简历', sub: '个人介绍', color: '#ff8fbd', type: 'doc' },
          { x: 512, label: '游戏', sub: '贪吃蛇', color: '#7ab8ff', type: 'game' },
          { x: 724, label: '项目', sub: '含钥匙扣作品集', color: '#bfe8d4', type: 'folder' }
        ];
        icons.forEach(function (ic) {
          if (ic.type === 'doc') {
            g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(ic.x - 40, 200, 80, 92, 12); g.fill();
            g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 26, 212, 52, 40, 8); g.fill();
            g.fillStyle = '#ffffff'; g.fillRect(ic.x - 18, 222, 36, 4); g.fillRect(ic.x - 18, 230, 36, 4); g.fillRect(ic.x - 18, 238, 22, 4);
            g.fillStyle = '#ececec'; g.beginPath(); g.moveTo(ic.x + 40, 200); g.lineTo(ic.x + 18, 200); g.lineTo(ic.x + 40, 222); g.closePath(); g.fill();
          } else if (ic.type === 'game') {
            g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(ic.x - 40, 200, 80, 92, 12); g.fill();
            g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 30, 220, 60, 44, 12); g.fill();
            g.fillStyle = '#ffffff';
            g.beginPath(); g.arc(ic.x - 12, 242, 5, 0, 7); g.fill();
            g.beginPath(); g.arc(ic.x + 12, 242, 5, 0, 7); g.fill();
            g.fillRect(ic.x - 3, 231, 6, 12); g.fillRect(ic.x - 9, 237, 12, 6);
          } else {
            g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 40, 204, 80, 88, 10); g.fill();
            g.fillStyle = 'rgba(255,255,255,0.55)';
            g.beginPath(); g.moveTo(ic.x - 40, 204); g.lineTo(ic.x - 20, 204); g.lineTo(ic.x - 12, 222); g.lineTo(ic.x - 40, 222); g.closePath(); g.fill();
          }
          g.fillStyle = '#7a5270';
          g.font = '600 26px "PingFang SC", sans-serif';
          g.fillText(ic.label, ic.x, 340);
          g.font = '14px sans-serif';
          g.fillStyle = 'rgba(122,82,112,0.6)';
          g.fillText(ic.sub, ic.x, 360);
        });
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }

      /* 电脑第一视角桌面：点 iMac → 全屏桌面（简历/游戏/项目） */
      function openComputerScreen() {
        var cs = document.getElementById('computerScreen');
        if (!cs) return;
        cs.classList.add('is-open');
        cs.setAttribute('aria-hidden', 'false');
      }
      function closeComputerScreen() {
        var cs = document.getElementById('computerScreen');
        if (!cs) return;
        cs.classList.remove('is-open');
        cs.setAttribute('aria-hidden', 'true');
      }
      function bindComputerIcons() {
        var cs = document.getElementById('computerScreen');
        if (!cs) return;
        cs.querySelectorAll('[data-target]').forEach(function (ic) {
          ic.addEventListener('click', function () {
            var target = ic.getAttribute('data-target');
            if (target === 'resume' && window.openPerson) window.openPerson();
            else if (target === 'game' && window.openGame) window.openGame();
            else if (target === 'project' && window.openWall) window.openWall();
          });
        });
        var closeBtn2 = document.getElementById('computerClose');
        if (closeBtn2) closeBtn2.addEventListener('click', closeComputerScreen);
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && cs.classList.contains('is-open')) {
            closeComputerScreen();
            e.stopImmediatePropagation();
          }
        }, true);
      }

      /* 物品信息浮窗（狗 / 绿植 / 奖杯） */
      var ITEM_INFO = {
        dog: { title: '我的金毛 · 睡午觉', body: '它趴在泰迪熊身边睡得正香，脑袋枕着熊的脚掌，耳朵耷拉着，是家里最治愈的小管家。' },
        bear: { title: '泰迪熊玩偶', body: '靠在墙边的浅棕色泰迪熊，是我的童年伙伴，也是金毛最好的靠枕。' },
        plant: { title: '我的绿植', body: '角落的绿植给房间添了生机——创作要像植物一样，向下扎根、向上生长。' },
        shelf: { title: '我的小书架', body: '多层书架摆满了我爱看的书——灵感都藏在这些书页里。' }
      };
      function openItemInfo(key) {
        var info = document.getElementById('itemInfo');
        if (!info) return;
        var d = ITEM_INFO[key] || { title: key, body: '' };
        var t = document.getElementById('itemInfoTitle'); if (t) t.textContent = d.title;
        var b = document.getElementById('itemInfoBody'); if (b) b.textContent = d.body;
        info.classList.add('is-open');
        info.setAttribute('aria-hidden', 'false');
      }
      function closeItemInfo() {
        var info = document.getElementById('itemInfo');
        if (!info) return;
        info.classList.remove('is-open');
        info.setAttribute('aria-hidden', 'true');
      }
      (function bindItemInfo() {
        var info = document.getElementById('itemInfo');
        if (!info) return;
        var cb = document.getElementById('itemInfoClose');
        if (cb) cb.addEventListener('click', closeItemInfo);
        info.addEventListener('click', function (e) {
          if (e.target === info) closeItemInfo();
        });
      })();

      /* ---------- 进入 / 退出房间（点击 Hero 房子进入，首次点击懒初始化 3D） ---------- */
      function openRoom() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        init();
      }
      function closeRoom() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      if (house) house.addEventListener('click', function (e) {
        e.preventDefault();
        openRoom();
      });
      if (closeBtn) closeBtn.addEventListener('click', closeRoom);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open') &&
            !document.querySelector('.computer.is-open,.item-info.is-open,.wall.is-open,.photo-zoom.is-open,.game.is-open')) {
          closeRoom();
        }
      });
      window.openRoom = openRoom;
      window.closeRoom = closeRoom;

      /* 调试/直达：URL 带 ?autoclick=1（或 ?room=1）时模拟真实点击房子进入房间（验证点击绑定链路） */
      if (/autoclick=1|room=1/.test(window.location.search || '')) {
        setTimeout(function () {
          var hh = document.getElementById('heroHouse');
          if (hh && hh.dispatchEvent) {
            hh.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          } else if (window.openRoom) {
            window.openRoom();
          }
        }, 900);
      }

      /* 调试自测：URL 带 ?selftest=1 时自动跑完整交互链路，结果写入 document.title（headless 读取验证） */
      if (/selftest=1/.test(window.location.search || '')) {
        var _log = [];
        function _st(n, ok) { _log.push(n + ':' + (ok ? 'OK' : 'FAIL')); document.title = 'SELFTEST_RUNNING ' + _log.join('|'); }
        setTimeout(function () {
          var hh = document.getElementById('heroHouse');
          if (hh) hh.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          setTimeout(function () {
            var ov = document.getElementById('roomOverlay');
            _st('enterRoom', !!ov && ov.classList.contains('is-open'));
            if (window.openComputerScreen) window.openComputerScreen();
            else { openComputerScreen(); }
            setTimeout(function () {
              var cs = document.getElementById('computerScreen');
              _st('computer', !!cs && cs.classList.contains('is-open'));
              if (window.openGame) window.openGame();
              setTimeout(function () {
                var g = document.getElementById('gameOverlay');
                _st('game', !!g && g.classList.contains('is-open'));
                if (window.closeGame) window.closeGame();
                if (window.openWall) window.openWall();
                setTimeout(function () {
                  var w = document.getElementById('worksWall');
                  _st('wall', !!w && w.classList.contains('is-open'));
                  if (window.closeWall) window.closeWall();
                  if (window.openPhotoWall) window.openPhotoWall();
                  setTimeout(function () {
                    var p = document.getElementById('photoWallZoom');
                    _st('photoWall', !!p && p.classList.contains('is-open'));
                    if (window.closePhotoWall) window.closePhotoWall();
                    if (window.openPerson) window.openPerson();
                    setTimeout(function () {
                      var pp = document.getElementById('personPanel');
                      _st('person', !!pp && pp.classList.contains('is-open'));
                      document.title = 'SELFTEST_DONE ' + _log.join('|');
                    }, 400);
                  }, 400);
                }, 400);
              }, 400);
            }, 400);
          }, 700);
        }, 1300);
      }
    })();


    /* ===== 12.1 人物介绍面板 ===== */
    var openPerson = (function () {
      var panel = document.getElementById('personPanel');
      if (!panel) return function () {};
      function open() {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
      function close() {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      }
      panel.querySelectorAll('[data-person-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      panel.querySelectorAll('.person__tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var key = tab.getAttribute('data-person-tab');
          panel.querySelectorAll('.person__tab').forEach(function (t) {
            t.classList.toggle('is-active', t === tab);
          });
          panel.querySelectorAll('.person__pane').forEach(function (pane) {
            pane.classList.toggle('is-active', pane.getAttribute('data-person-pane') === key);
          });
        });
      });
      window.closePerson = close;
      window.openPerson = open;
      return open;
    })();


    /* ===== 12.1b 照片墙放大面板 ===== */
    var openPhotoWall = (function () {
      var el = document.getElementById('photoWallZoom');
      if (!el) return function () {};
      function open() { el.classList.add('is-open'); document.body.classList.add('room-locked'); }
      function close() { el.classList.remove('is-open'); document.body.classList.remove('room-locked'); }
      var btn = document.getElementById('photoZoomClose');
      if (btn) btn.addEventListener('click', close);
      var back = el.querySelector('.photo-zoom__backdrop');
      if (back) back.addEventListener('click', close);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && el.classList.contains('is-open')) { close(); e.stopImmediatePropagation(); }
      }, true);
      window.closePhotoWall = close;
      window.openPhotoWall = open;
      return open;
    })();


    /* ===== 12.2 作品墙面板 ===== */
    var openWall = (function () {
      var panel = document.getElementById('worksWall');
      var board = document.getElementById('wallBoard');
      if (!panel) return function () {};
      function open() {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
      function close() {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      }
      /* 生成作品墙钥匙扣（复用 keychain 结构 + 交互） */
      if (board && keychainWorks) {
        keychainWorks.forEach(function (key) {
          var d = workDetails[key];
          if (!d || !d.cover) return;
          var kc = document.createElement('div');
          kc.className = 'keychain';
          kc.dataset.work = key;
          var pin = document.createElement('span'); pin.className = 'keychain__pin'; kc.appendChild(pin);
          var str = document.createElement('span'); str.className = 'keychain__string'; kc.appendChild(str);
          var ring = document.createElement('span'); ring.className = 'keychain__ring'; kc.appendChild(ring);
          var panelEl = document.createElement('div'); panelEl.className = 'keychain__panel';
          var img = document.createElement('img'); img.src = d.cover; img.alt = d.title; img.loading = 'lazy';
          panelEl.appendChild(img);
          var label = document.createElement('div'); label.className = 'keychain__label';
          var badge = document.createElement('span'); badge.className = 'keychain__badge';
          badge.textContent = (d.cat || '').split('·')[0].trim() || 'WORK';
          label.appendChild(badge);
          var name = document.createElement('p'); name.className = 'keychain__name'; name.textContent = d.title;
          label.appendChild(name);
          panelEl.appendChild(label);
          kc.appendChild(panelEl);
          board.appendChild(kc);
          kc.addEventListener('mouseenter', function () {
            kc.classList.add('is-hovering'); kc.classList.remove('is-swaying');
            void kc.offsetWidth; kc.classList.add('is-swaying');
            setTimeout(function () { kc.classList.remove('is-swaying'); }, 600);
          });
          kc.addEventListener('mouseleave', function () {
            kc.classList.remove('is-hovering');
            kc.style.transform = '';
          });
          kc.addEventListener('click', function () {
            if (workDetails[key]) openModal(key);
          });
        });
      }
      panel.querySelectorAll('[data-wall-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      window.closeWall = close;
      window.openWall = open;
      return open;
    })();


    /* ===== 13. 电脑贪吃蛇小游戏 ===== */
    var openGame = (function () {
      var overlay = document.getElementById('gameOverlay');
      if (!overlay) return function () {};
      var canvas = document.getElementById('gameCanvas');
      var ctx = canvas.getContext('2d');
      var scoreEl = document.getElementById('gameScore');
      var N = 20, cell = canvas.width / N;
      var snake, dir, nextDir, food, score, timer, over;

      function placeFood() {
        do {
          food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
      }
      function reset() {
        snake = [{ x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }];
        dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
        score = 0; over = false;
        if (scoreEl) scoreEl.textContent = '0';
        placeFood();
        draw();
      }
      function step() {
        if (over) return;
        dir = nextDir;
        var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) { over = true; draw(); return; }
        for (var i = 0; i < snake.length; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y) { over = true; draw(); return; }
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 10; if (scoreEl) scoreEl.textContent = String(score);
          placeFood();
        } else {
          snake.pop();
        }
        draw();
      }
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb') || '165,180,252';
        ctx.strokeStyle = 'rgba(120,140,200,.07)';
        ctx.lineWidth = 1;
        for (var i = 1; i < N; i++) {
          ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
        }
        /* 食物 */
        ctx.fillStyle = 'rgb(' + accent + ')';
        ctx.shadowColor = 'rgb(' + accent + ')';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.34, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        /* 蛇 */
        for (var k = 0; k < snake.length; k++) {
          var s = snake[k];
          var pad = k === 0 ? 1 : 2;
          ctx.fillStyle = 'rgba(140,205,255,' + (1 - (k / snake.length) * 0.55).toFixed(2) + ')';
          ctx.shadowColor = 'rgba(140,205,255,.55)';
          ctx.shadowBlur = 6;
          ctx.fillRect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2);
        }
        ctx.shadowBlur = 0;
        if (over) {
          ctx.fillStyle = 'rgba(255,255,255,.92)';
          ctx.font = '600 22px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 8);
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255,255,255,.6)';
          ctx.fillText('RESTART · 空格 / 按钮', canvas.width / 2, canvas.height / 2 + 20);
        }
      }
      function open() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        reset();
        timer = setInterval(step, 130);
      }
      function close() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (timer) { clearInterval(timer); timer = null; }
      }
      var KEYS = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
        W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0]
      };
      document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('is-open')) return;
        if (KEYS[e.key]) {
          var nd = KEYS[e.key];
          if (nd[0] === -dir.x && nd[1] === -dir.y) return;
          nextDir = { x: nd[0], y: nd[1] };
          e.preventDefault();
        }
        if (e.key === ' ' && over) reset();
      });
      overlay.querySelectorAll('[data-game-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      var restart = document.getElementById('gameRestart');
      if (restart) restart.addEventListener('click', function () { reset(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
          close();
          e.stopImmediatePropagation();
        }
      }, true);
      window.openGame = open;
      window.closeGame = close;
      return open;
    })();
  });
}());

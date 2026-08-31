/* =========================================================
   data/works.js — 作品数据（workDetails）+ 钥匙扣清单（keychainWorks）+ 奥德赛登记
   ⚠️ 独立文件，改动作品内容只动这里
   ========================================================= */
'use strict';

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

var keychainWorks = [
  'woola', 'cattea', 'pet-app', 'orderly-journey',
  'cosmic-astra', 'sylva', 'tea-yanyan', 'wild-geometry',
  'mistscent', 'kalio', 'wangcaicai'
];

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

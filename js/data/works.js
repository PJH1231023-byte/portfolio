/* =========================================================
   data/works.js — 作品数据（workDetails）+ 钥匙扣清单（keychainWorks）+ 奥德赛登记
   ⚠️ 独立文件，改动作品内容只动这里
   ========================================================= */
'use strict';

var workDetails = {
  'gourd-museum': {
    cat: 'UI · 数字展陈',
    format: 'exhibit',
    title: '葫芦数字博物馆',
    cover: 'images/gourd-museum-display-hd.png',
    summary: '从手机拍照、自动抠图到伪 3D 陈列，为真实葫芦收藏搭建可以自由布展的数字策展空间。',
    desc: '朋友是一位葫芦手艺人，家中收藏了各式各样的葫芦。这个 MVP 让他用手机拍摄藏品，上传后自动分离背景，再把抠出的照片作为伪 3D 展品放进空间：书架、桌子、矮柜，甚至地面都可以陈列，还能一键打乱上架藏品、尝试新的布局。我参与数字展陈、葫芦上架与陈列，并设计不同的家具皮肤。这里以真实展柜照片为视觉原型，提供可以直接进入和自由布展的互动展厅。',
    list: [
      '参与内容：数字展示空间搭建 / 葫芦作品上架与陈列 / 家具皮肤设计',
      '原 MVP 流程：手机拍照上传 → 自动抠图 → 生成伪 3D 图片展品 → 空间策展',
      '拍摄要求：光线充足、主体清晰；背景可以杂乱，由系统分离葫芦轮廓',
      '策展方式：书架、桌面、矮柜和地面陈列；一键打乱上架藏品，并更换家具皮肤',
      '本站展示：直接进入互动展厅；选择展位与葫芦、调整家具和墙面，并保存自己的陈列'
    ],
    gallery: [{src: 'images/gourd-museum-display-hd.png', caption: '葫芦藏品与数字展柜陈列', wide: true}],
    overviewEmbed: 'apps/gourd-museum/demo.html?v=2',
    overviewLabel: '观看项目简介 ↗',
    overviewType: '项目简介 / 策展流程',
    overviewTitle: '葫芦数字博物馆 · 项目简介',
    overviewWide: true,
    interactiveEmbed: 'apps/gourd-museum/index.html?v=3',
    interactiveLabel: '进入互动展厅 ↗',
    interactiveType: '数字策展 / 互动展厅',
    interactiveWide: true,
    interactiveTitle: '葫芦数字博物馆 · 互动展厅'
  },
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
    title: '宠物健康记录',
    cover: 'images/petapp-02-home.jpg',
    interactiveEmbed: 'apps/pet-health/index.html?v=4b13e64cf040',
    interactiveLabel: '体验手机原型 ↗',
    interactiveType: '互动原型 / 健康记录',
    desc: '面向「多宠物家庭」的轻量健康记录工具，支持猫咪 / 狗狗 / 其他宠物的切换与差异化记录。整套设计强调「温暖的医疗感」：柔和的薄荷绿 + 暖橙 + 蜜桃粉，配合圆润的卡通图标拉近距离。',
    list: [
      '多宠物切换：猫咪「咪咪」+ 狗狗「旺旺」，昵称与档案可自定义',
      '记录维度：喂养 / 遛弯 / 健康（呕吐 / 腹泻 / 状态）/ 照片',
      '档案：基本信息 / 疫苗 / 医疗史 / 详细偏好',
      '色彩：柔和蓝绿 #ADE7E5 · 薄荷绿 #BCE2C8 · 暖橙 #F7C59F · 蜜桃粉 #F4A6B0',
      '组件：按钮 / 输入框 / 卡片 / 图标 / 徽章 / 底部导航 / 侧边菜单',
      '互动演示：新增与修改记录、保存真实照片、编辑宠物档案，本机保留数据'
    ],
    gallery: [
      { src: 'images/petapp-02-home.jpg', caption: '首页 · 今日摘要 + 快速操作', wide: true },
      { src: 'images/petapp-01-record.png', caption: '新增记录 · 喂养 / 遛弯 / 健康多维度' },
      { src: 'images/petapp-03-profile.jpg', caption: '宠物档案 · 基本信息 + 疫苗 + 医疗史', wide: true },
      { src: 'images/petapp-04-design-system.jpg', caption: '设计系统 · 配色 + 组件库', wide: true }
    ]
  },
  'project-management': {
    cat: 'UI · 系统与工具',
    format: 'system',
    title: '创想工作台 · 项目管理中心',
    cover: 'images/project-management-dashboard.png',
    summary: '把创作项目、待办任务和常用工具集中起来，让想法与下一步行动有迹可循。',
    desc: '从管理自己的创作项目出发，我搭建了「创想工作台」。它将项目、任务、AI 赛事与 Agent 项目，以及常用工具和 Skills 入口集中在一个工作界面，通过仪表盘梳理待办、项目进展与截止时间，让分散的创作事项有一个清晰的归处。',
    list: [
      '项目概览：仪表盘集中呈现任务摘要、快速开始与进行中的项目。',
      '项目组织：区分 AI 赛事与 Agent 项目，通过项目卡片呈现进度和截止时间。',
      '工具入口：将成品工具与办公效率、开发工具、创意设计等 Skills 分类组织。',
      '个人工作流：连接项目管理、常用工具与数字图书馆入口。'
    ],
    gallery: [
      { src: 'images/project-management-dashboard.png', caption: '项目管理中心 · 仪表盘界面截图', wide: true }
    ]
  },
  'stock-radar': {
    cat: 'UI · 系统与工具',
    format: 'system',
    title: '股票雷达 · StockRadar',
    cover: 'images/stock-radar-dashboard.png',
    summary: '以市场概览为起点，组织指数、板块与个股信息，构建个人股票研究工作台。',
    desc: '「股票雷达」是我围绕个人股票研究与信息整理搭建的系统。界面以市场概览为入口，将指数走势、市场情绪、板块热度与个股信号分层呈现，并组织股票检测、自选股、技术指标和交易日志等模块，让不同维度的信息更容易浏览与对照。',
    list: [
      '市场概览：用指数卡片、趋势图和市场摘要建立信息层级。',
      '板块观察：通过红绿区分的板块热度矩阵呈现不同板块的变化。',
      '个股信息：以表格组织股票名称、价格、涨跌幅、信号标签与所属板块。',
      '研究入口：将自选股、技术指标、交易日志、选股策略与预警等模块分组导航。'
    ],
    gallery: [
      { src: 'images/stock-radar-dashboard.png', caption: '股票雷达 · 市场概览界面截图', wide: true }
    ]
  },
  'digital-library': {
    cat: 'UI · 系统与工具',
    format: 'system',
    title: '数字图书馆 · 个人知识管理',
    cover: 'images/digital-library-dashboard.png',
    summary: '将书籍、阅读笔记与 AI 学习资源归入一个知识空间，连接阅读、学习与实践。',
    desc: '「数字图书馆」是我为个人阅读、学习与资料整理搭建的知识管理系统。它把书籍书架、读书笔记、阅读进度与 AI 学习资源放在同一个空间，再通过学习路线、方法论和实践资料的分类，将零散收集的内容整理成便于回看和继续学习的知识结构。',
    list: [
      '知识总览：集中呈现阅读与学习摘要，以及最近加入的书籍。',
      '阅读组织：设置书籍书架、读书笔记、阅读进度和每日笔记入口。',
      'AI 学习：整理学习路线图、方法论、工具资讯与 Skills 工具库。',
      '实践资料：按 Agent 搭建、MCP 开发与产品方法等主题组织学习内容。'
    ],
    gallery: [
      { src: 'images/digital-library-dashboard.png', caption: '数字图书馆 · 知识总览界面截图', wide: true }
    ]
  },
  'life-os': {
    cat: 'UI · 系统与工具',
    format: 'system',
    title: 'LifeOS · 人生管理系统',
    cover: 'images/life-os-review.png',
    summary: '从每日记录和复盘出发，把目标、任务、习惯与 AI 助手纳入个人生活管理。',
    desc: '「LifeOS」是我围绕个人生活管理搭建的系统，希望把目标与日常行动连接起来。每日页面以早间记录、晚间复盘和周期回顾为切入点，整理任务、习惯与心情；AI 多助手页面则按不同需求组织对话角色，让生活记录、规划与思考有一个持续使用的空间。',
    list: [
      '每日复盘：用任务摘要、心情评分与一句话记录，降低回顾一天的填写负担。',
      '生活组织：围绕目标、任务、习惯、财务、健康、时间与日记设置统一导航。',
      'AI 多助手：呈现人生规划、数据分析、写作、学习等可选择的助手角色。',
      '对话界面：将助手选择、聊天内容、文件上传与输入区域组织在同一页面。'
    ],
    gallery: [
      { src: 'images/life-os-review.png', caption: 'LifeOS · 每日复盘界面截图', previewLabel: '每日复盘', wide: true },
      { src: 'images/life-os-assistants.png', caption: 'LifeOS · AI 多助手聊天室界面截图', previewLabel: 'AI 多助手', wide: true }
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
  'eye-mountain-river': {
    cat: 'FILM · AI 视频',
    title: '眼中山河 / Eyes of Mountains',
    cover: 'images/eye-mountain-cover.jpg',
    desc: '《眼中山河》是一支63秒的AI品牌广告片，为2026上海国际AIGC创新大赛参赛作品。全程AI生成图片与视频，真人配音。灵感源自宋代五大名窑——汝、官、哥、钧、定的釉色。以宋代釉色为色卡，从天然矿物和植物中寻找相同颜色——石青、花青、朱砂、蛤粉——研磨成粉，做成眼影。色彩从盘中蘸取，化为山河，最终又回到盘中。',
    list: [
      '品牌：青釉 QINGYOU',
      '类型：AI品牌广告片 / 63秒',
      '身份：2026 上海国际AIGC创新大赛 参赛作品',
      '制作：全程AI生成图片与视频，真人配音',
      '灵感：宋代五大名窑（汝、官、哥、钧、定）釉色',
      '概念：以宋代釉色为色卡，天然矿物植物研磨成粉做眼影，色彩化为山河',
      '视频链接：https://my.feishu.cn/wiki/Vy8BwixUAit3tDk53J9coYcOnmh'
    ],
    gallery: [
      { src: 'images/eye-mountain-product1.jpg', caption: '青釉 QINGYOU · 品牌Logo与产品', wide: true },
      { src: 'images/eye-mountain-product2.jpg', caption: '产品展示 · 眼影盘与宋代釉色' },
      { src: 'images/eye-mountain-product3.png', caption: '品牌视觉 · 釉色灵感与设计' }
    ]
  },
  'filter-life': {
    cat: 'FILM · AI 视频',
    title: '滤镜人生 / Filter Life',
    cover: 'images/filter-life-cover-new.jpg',
    desc: '《滤镜人生》是一支53秒的AI叙事短视频。讲的是社交媒体P图焦虑的故事——我们花在P图上的时间比化妆还久，在社交媒体上展示的完美背后，是无数次推脸、缩鼻、调色。但P到最后，最累的是自己。这条视频想说的是：P图不是造假，是我们想把自己觉得好看的那一面留下来。而那个没P的、有点瑕疵的你，也一样真实。全程 MiniMax H3 生成，以本人照片制作三视图为人物原型。',
    list: [
      '类型：AI叙事短视频 / 53秒',
      '主题：社交媒体P图焦虑',
      '概念：P图不是造假，是想把自己觉得好看的那一面留下来；没P的、有点瑕疵的你也一样真实',
      '制作：全程 MiniMax H3 生成，以本人照片制作三视图为人物原型',
      '视频链接：https://my.feishu.cn/wiki/NfsEwrmGvimhakk9FuOcq4suneg'
    ],
    gallery: [
      { src: 'images/filter-life-keyframe1.jpg', caption: '视频关键帧 · 社交媒体与P图焦虑', wide: true },
      { src: 'images/filter-life-3view.jpg', caption: '角色设定 · 以本人照片制作三视图' }
    ]
  },
  'spirit-roam': {
    cat: 'CODE · 互动小游戏',
    title: '精灵漫游',
    cover: 'images/spirit-roam-cover.png',
    summary: '五位原创精灵，六片珠宝风景。自由选关，在跳跃、战斗与收集中展开横屏冒险。',
    desc: '《精灵漫游》是一款融合原创角色设计、珠宝场景与互动动画的横版闯关小游戏。五位软陶质感的精灵，穿行于粉晶花园、珍珠水廊、翡翠瀑谷、紫晶洞窟、琥珀潮岸和月光浮岛。选择喜欢的旅伴与关卡，在多层台阶间二段跳跃、发射晶光、收集旅途印记，挑战自己的三星纪录。每片风景都有独立的场景与机关，让一次小小的冒险，也成为一场关于色彩、材质和角色性格的漫游。',
    list: [
      '角色：慢拍、棱棱、贝眠、星啾、晶甲五位旅伴 / 五种关卡怪物 / 软陶与珠宝材质',
      '场景：六片独立风景 / 多层长短台阶 / 弹簧花、升降台、气流、碎裂晶桥、潮汐喷泉与浮动渡台',
      '玩法：六关自由选择 / 二段跳与踩踏 / 晶光攻击 / 回血药水与护盾 / 计时三星挑战 / 18 枚旅途印记',
      '动画：伙伴互动展示短片 / 游戏内快速飘入开场 / 行走、跳跃与攻击动作',
      '操作：方向键或 A、D 移动，空格二段跳，按住 J 或 X 连续攻击；手机横屏使用触控按钮',
      '进度：最高星级、最好时间与旅途印记保存在当前浏览器，可自由重玩、刷新成绩与补齐收藏'
    ],
    gallery: [
      { src: 'images/spirit-roam-cover.png', caption: '精灵漫游 · 五位原创伙伴与珠宝庭院', wide: true },
      { src: 'images/spirit-roam-gameplay.png', caption: '粉晶花园 · 多层花阶实机画面', wide: true }
    ],
    gameHint: '横屏游玩 · 方向键移动 / 空格二段跳 / 按住 J 连续攻击 / H 操作说明 / P 或 Esc 暂停',
    gameEmbed: 'games/spirit-roam/index.html?v=4.10',
    gameStandalone: 'games/spirit-roam/index.html?v=4.10',
    showcase: {
      src: 'media/spirit-friends.webm', poster: 'images/spirit-roam-cover.png',
      title: '精灵漫游 · 伙伴互动与动作展示',
      caption: '五位伙伴相互招呼、挥手与点头，接着由晶甲展示行走、转身和起跳。',
      note: '约 11 秒 · 无声短片 · 点击播放，可全屏观看'
    }
  },
  'starling-merge': {
    cat: 'CODE · 互动小游戏',
    title: '绒绒野餐会 · Little Picnic Club',
    cover: 'images/little-picnic-club-title.png',
    summary: '动物与点心，两场软乎乎的野餐。瞄准发射、三个合一，各自开启八关旅程。',
    desc: '《绒绒野餐会》是一款以原创毛绒动物和点心伙伴为主角的弹珠合成小游戏。在阳光下的野餐小院里，瞄准发射，让三个相同的小伙伴碰在一起，合成下一位朋友。绒绒动物园和点心野餐会可以自由选择，各有八个逐步解锁的关卡，分别保存当前局面与旅程星星。奶油色桌布、鼠尾草绿遮阳篷和温暖的手绘质感，陪伴一场轻松的小小相遇；玩家头像独立选择，不影响正在玩的主题。',
    list: [
      '玩法：底部瞄准发射 / 圆形碰撞回弹 / 三个同级接触合成 / 连锁加分',
      '成长：动物与点心两套原创伙伴 / 每套八关 / 合成目标 / 三星成绩 / 伙伴图鉴',
      '体验：过关保留桌面 / 低级伙伴持续随机出现 / 桌满重开整局 / 每局三次撤回 / 两套旅程分别存档',
      '操作：鼠标或触屏拖动后松开发射，也支持方向键和空格',
      '结构：独立游戏目录，可从展台或电脑的小游戏文件夹打开'
    ],
    gallery: [
      { src: 'images/little-picnic-club-title.png', caption: '绒绒野餐会 · 开始封面与主题菜单', wide: true },
      { src: 'images/little-picnic-club-preview.png', caption: '绒绒动物园 · 游戏实机界面', wide: true },
      { src: 'images/little-picnic-club-food-preview.png', caption: '点心野餐会 · 游戏实机界面', wide: true }
    ],
    gameHint: '动物与点心自由选择，各自闯关 · 按住瞄准、松手发射，三个同伴合成 · Esc 暂停并返回展台',
    gameEmbed: 'games/starling-merge/index.html?v=20260910-wide-stage2'
  },
  'snake-game': {
    cat: 'CODE · 互动小游戏',
    title: '贪吃蛇 · Snake Game',
    cover: 'images/snake-game-cover.png',
    summary: '一局复古街机小挑战。控制小蛇收集食物，避开碰撞，刷新自己的最高分。',
    desc: '一款复古风格的贪吃蛇小游戏，用原生 JavaScript + Canvas 开发。暗绿色调配合发光效果，致敬经典街机游戏。支持键盘方向键和 WASD 控制，移动端支持虚拟按键，带有分数记录和最高分本地存储。下方即可直接开始游戏。',
    list: [
      '类型：互动小游戏 / 原生 JavaScript + Canvas',
      '玩法：方向键控制小蛇，吃到绿色食物得分，撞墙或撞到自己游戏结束',
      '特性：分数系统 / 最高分本地存储 / 暂停继续 / 移动端虚拟按键',
      '风格：复古街机 · 暗绿色调 · 发光效果',
      '开发：AI 辅助开发（Vibe Coding）'
    ],
    gallery: [],
    gameEmbed: 'snake-game.html'
  },
  'pet-garden-battle': {
    cat: 'CODE · 互动小游戏',
    title: '浮光守卫',
    cover: 'images/dream-guardians-cover.png',
    summary: '十幅印象派画境，十二位动物守卫。在河岸布阵、培养伙伴，守住墨潮中的莲花。',
    desc: '《浮光守卫》是一款梦境河道塔防小游戏。十幅印象派画境全部开放，十二位原创动物守卫在岸边布阵，阻止持续进入的墨潮抵达莲花。每关免费自带金币工坊，玩家在升级生产、扩展火力与培养伙伴之间做选择。完整图片奖池展示所有角色、碎片、道具与概率；击败怪物和通关获得永久星尘，挑战三星获得额外抽奖券。游戏有独立文件夹与便携包，作品集只连接其入口。',
    list: [
      '类型：原创网页塔防 / 原生 JavaScript + Canvas / 独立便携游戏包',
      '战斗：十二秒初始布阵后自动连续出怪，河岸部署、升级、优先目标与清障',
      '经济：免费金币工坊、击败金币、波次补给、永久星尘，各资源来源明确展示',
      '关卡：十幅场景全部开放，不再逐关上锁，一至三星成绩与不同挑战强度',
      '伙伴：初始萤巡免费，其余通过抽奖获得；前两抽固定给减速与范围攻击伙伴',
      '奖池：所有角色、碎片、道具与星尘的图片和概率公开，支持心愿碎片目标',
      '存档：保留旧版伙伴与成长，支持导出迁移；独立包与作品集共用同一份游戏源文件'
    ],
    gallery: [{ src: 'images/dream-guardians-cover.png', caption: '浮光守卫 · 梦境花庭世界观概念图，非实机截图', wide: true }],
    gameHint: '河岸加号部署 · 金币工坊自动生产 · 怪物连续入场 · 空格暂停 · 十关自由挑战',
    gameEmbed: 'games/dream-guardians/index.html?v=2.3'
  },
  'wild-geometry': {
    cat: 'TYPE · 字体设计',
    title: '狂乱几何 · Wild Geometry',
    cover: 'images/wild-geometry-title.png',
    color: 'linear-gradient(135deg, #1b1916, #a8512f 50%, #f6f4ef)',
    desc: '探索"暗黑自然主义"在数字手绘环境下的线性表达。设计核心在于模拟生命体在"绞杀"与"干缩"状态下的受力图形。灵感捕捉自绞杀型藤蔓的缠绕逻辑与干枯古木的开裂纹理，用 Procreate 手绘完成。',
    list: [
      '概念：暗黑自然主义 · 绞杀藤蔓缠绕 + 干枯古木开裂',
      'Geometric Fracture（几何断裂）：所有弧线均由锐利多边形切向组成',
      'Pressure Sensitivity（压力感应）：线条粗细对应生命能量的迸发与衰竭',
      'Abstraction（去具象化）：拒绝复刻自然，用"密集排线"构建体积感',
      '工具：Procreate 手绘 + 字体软件后处理',
      '展示内容：字母设计、数字设计与项目标题组合'
    ],
    gallery: [
      { src: 'images/wild-geometry-title.png', caption: '狂乱几何 · Wild Geometry · 项目标题', wide: true },
      { src: 'images/wild-geometry-alphabet.png', caption: '字母设计 · A–Z 字形探索', wide: true },
      { src: 'images/wild-geometry-numerals.png', caption: '数字设计 · 0–9 字形探索', wide: true }
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
      '延展：人形拟人化方案 · 风格换装 · 表情包',
      'IP衍生设计：Elena 表情包形象 — 灵感源自月灵兔的星辰能量，宇宙精灵主题，含三视图与30+日常表情包'
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
      { src: 'images/pptx/image21.jpeg', caption: '表情包延展 · 续' },
      { src: 'images/elena-3view.jpg', caption: '【IP衍生设计】Elena · 角色三视图 — 灵感源自月灵兔星辰能量', wide: true },
      { src: 'images/elena-stickers1.jpg', caption: '【IP衍生设计】Elena · 表情包合集（一）' },
      { src: 'images/elena-stickers2.jpg', caption: '【IP衍生设计】Elena · 表情包合集（二）', wide: true },
      { src: 'images/elena-sticker-single.png', caption: '【IP衍生设计】Elena · 表情包单张展示' }
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
    gameEmbed: 'games/odyssey/index.html?v=002a075fa4d4',
    cover: 'images/odyssey-01-title.jpg',
    desc: '「奥德赛 · 英雄之旅」是一款以古希腊史诗为背景的卡牌对战游戏 UI 系统。整套界面采用手绘卡通风格：粗犷的黑色描边、鲜艳的撞色搭配与木质描边相框，让厚重的神话题材兼具活泼与史诗感。从奥德修斯扬帆起航的初始界面，到公羊冲锋的史诗战场，再到胜利结算与宝箱奖励，四个核心界面完整覆盖了「出战 → 对局 → 结算 → 领奖」的游戏闭环。公羊、战船、长矛、希腊众神等主题元素贯穿始终，配合金币宝石资源体系与希腊回纹装饰，形成了高度统一的视觉语言。',
    list: [
      '可玩衍生版：单人回合制卡牌冒险，三段航程、六种卡牌、敌人意图、战后祝福与本地存档；点击「开始游戏」体验',
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

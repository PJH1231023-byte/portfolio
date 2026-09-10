(() => {
  'use strict';
  const phrases = [
    ["PEIJIA'S PERSONAL COMPUTER", '黄佩嘉的个人电脑'],
    ["PEIJIA'S COLLECTION / VOL. 01", '黄佩嘉的创作收藏 · 第一期'],
    ['PEIJIA — PERSONAL ARCHIVE', '黄佩嘉的创作档案'],
    ['ABOUT ME / DESIGN & EXPLORATION', '关于我 / 设计与探索'],
    ["LET'S KEEP IN TOUCH", '期待与你交流'],
    ['CONTACT / EMAIL', '联系方式 / 电子邮箱'],
    ['PERSONAL SYSTEMS / VIBE CODING', '个人系统 / 人工智能辅助编程'],
    ['DIGITAL EXHIBITION / 数字展陈', '数字展陈 / 交互体验'],
    ['ORGANIC FORMS / LETTERING', '自然形态 / 字体实验'],
    ['BOTANICAL SYMBOLS / TAROT', '植物意象 / 卡牌设计'],
    ['THE WORD OF PLANTS /', '植物之语 /'],
    ['PLAY / VIBE CODING', '互动体验 / 人工智能辅助编程'],
    ['AI 影像 / FILM', '人工智能影像 / 短片'],
    ['Brand & Space', '品牌与空间'],
    ['BRAND & SPACE', '品牌与空间'],
    ['UI & SYSTEMS', '产品与交互'],
    ['Type & Print', '字体与印刷'],
    ['TYPE & PRINT', '字体与印刷'],
    ['COLLECTION 01', '创作收藏 · 第一期'],
    ['PERSONAL ARCHIVE', '个人创作档案'],
    ['KEEP IN TOUCH', '保持联系'],
    ['OWN LITTLE', '属于我的'],
    ['UNIVERSE', '小小宇宙'],
    ['PEIJIA HUANG', '设计与创作'],
    ['PORTFOLIO', '作品集'],
    ['VIBE CODING', '人工智能辅助编程'],
    ['AI FILM', '人工智能影像'],
    ['CHARACTER', '原创角色'],
    ['IP 角色设计', '原创角色设计'],
    ['IP 角色', '原创角色'],
    ['A QUESTION', '一个问题'],
    ['A LEAF', '一片叶子'],
    ['A MOMENT', '片刻思考'],
    ['READY /', '就绪 /'],
    ['ABOUT /', '关于 /'],
    ['SYSTEM /', '系统 /'],
    ['FILES', '件作品'],
    ['Branding', '品牌设计'],
    ['Visual Identity', '视觉识别'],
    ['Creative Coding', '创意编程'],
    ['Vibe Coding', '人工智能辅助编程'],
    ['Interactive Experience', '交互体验'],
    ['Visual Design', '视觉设计'],
    ['Art & Art History', '艺术与艺术史'],
    ['University of Toronto', '多伦多大学'],
    ['Sheridan College', '谢尔丹学院'],
    ['AI-native Designer', '人工智能原生设计师'],
    ['Creative Technologist', '创意技术实践者'],
    ['The Word of Plants', '植物之语'],
    ['Little Picnic Club', '绒绒野餐会'],
    ['Orderly Journey', '有序的远行'],
    ['Eyes of Mountains', '眼中山河'],
    ['Filter Life', '滤镜人生'],
    ['StockRadar', '股票雷达'],
    ['LifeOS', '人生管理系统']
  ];
  const translate = value => {
    if (!/[A-Za-z]/.test(value)) return value;
    let result = value;
    for (const [source, target] of phrases) result = result.split(source).join(target);
    result = result.replace(/\bAI\b/g, '人工智能').replace(/\bUI\b/g, '界面');
    return result.replace(/(绒绒野餐会|有序的远行|眼中山河|滤镜人生|股票雷达|人生管理系统|植物之语)\s*[·/]\s*\1/g, '$1');
  };
  const skip = element => element?.closest('script,style,noscript,code,pre,textarea,input,iframe');
  const translateText = node => {
    if (skip(node.parentElement)) return;
    const value = translate(node.nodeValue || '');
    if (value !== node.nodeValue) node.nodeValue = value;
  };
  const translateElement = element => {
    if (skip(element)) return;
    for (const attribute of ['aria-label', 'title', 'placeholder']) {
      const value = element.getAttribute(attribute);
      if (value) {
        const translated = translate(value);
        if (value !== translated) element.setAttribute(attribute, translated);
      }
    }
  };
  const localize = root => {
    if (root.nodeType === Node.TEXT_NODE) { translateText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE || skip(root)) return;
    translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE) translateText(node);
      else translateElement(node);
    }
  };
  localize(document.body);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') translateText(record.target);
      else if (record.type === 'attributes') translateElement(record.target);
      else record.addedNodes.forEach(localize);
    }
  });
  observer.observe(document.body, {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder']});
  const directions = {
    ai: {folder:'product',label:'产品与交互设计'},
    experience: {folder:'product',label:'产品与交互设计'},
    visual: {folder:'brand',label:'品牌与视觉设计'},
    motion: {folder:'film',label:'人工智能影像'}
  };
  const direction = directions[new URLSearchParams(location.search).get('view')];
  if (direction) {
    const copy = document.querySelector('.entry-copy');
    if (copy) {
      const guide = document.createElement('button');
      guide.type = 'button';
      guide.className = 'entry-direction-guide';
      guide.textContent = '优先看看：' + direction.label + ' ↗';
      guide.addEventListener('click', () => {
        document.querySelector('[data-desktop]')?.click();
        document.querySelector('#desktop-folders [data-folder="' + direction.folder + '"]')?.click();
      });
      copy.appendChild(guide);
    }
  }
})();

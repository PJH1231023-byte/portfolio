/* Floating-light guardians: interface, local progression and the free wish pool. */
(() => {
  'use strict';
  const D = window.DreamData;
  const A = window.DreamArt;
  const G = window.GardenBattle;
  const R = window.GardenRenderer;
  const Rewards = window.DreamRewards;
  const KEY = 'portfolio.dream-guardians.v1';
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const n = (v, max = 10000000) => Math.min(max, Math.max(0, Math.floor(Number(v) || 0)));
  const stars = (count) => `${count} 星`;
  const itemById = Object.fromEntries(D.items.map(item => [item.id, item]));
  const emptyCarry = () => Object.fromEntries(D.items.map(item => [item.id, 0]));
  const defaults = () => ({v:1,rulesVersion:2,dust:0,stamps:5,ticketDryStreak:0,owned:{ying:1},fragments:{},items:emptyCarry(),unlocked:9,clears:{},ratingRewards:{},seen:{},kills:{},recruits:0,noviceDraws:0,wish:'jibai',squad:['ying'],favorite:'ying',introSeen:false,sound:false,milestones:{},active:null});
  let profile;
  let battle = null;
  let view = 'home';
  let paused = true;
  let speed = 1;
  let selectedHero = 'ying';
  let selectedPad = null;
  let aimItem = null;
  let carry = emptyCarry();
  let canvas = null;
  let resizeObserver = null;
  let prepareIndex = 0;
  let prepareSquad = [];
  let prepareCarry = emptyCarry();
  let rosterFilter = 'all';
  let modalResume = false;
  let modalActions = [];
  let toastTimer = 0;
  let introTimer = 0;
  let audioContext = null;
  let storageWarned = false;
  let recruitBusy = false;
  let sideKey = '';
  let lastFrame = 0;
  let accumulator = 0;
  let lastHud = 0;
  let lastSave = 0;
  let hostPaused = false;

  function normalize(raw) {
    if (!raw || typeof raw !== 'object' || raw.v !== 1) throw new Error('这不是浮光守卫的存档，或存档版本不受支持。');
    const p = defaults();
    p.dust = n(raw.dust); p.stamps = n(raw.stamps, 100000) + (raw.rulesVersion>=2?0:5); p.recruits = n(raw.recruits, 1000000);
    p.noviceDraws = raw.rulesVersion>=2?n(raw.noviceDraws,2):0;
    p.ticketDryStreak = n(raw.ticketDryStreak,3);
    for (const h of D.heroes) {
      if (raw.owned && n(raw.owned[h.id], 5)) p.owned[h.id] = Math.max(1, n(raw.owned[h.id], 5));
      p.fragments[h.id] = n(raw.fragments && raw.fragments[h.id], 100000);
    }
    for (const item of D.items) p.items[item.id] = n(raw.items && raw.items[item.id], 9999);
    for (let i = 0; i < D.maps.length; i++) {
      if (raw.clears && raw.clears[i]) p.clears[i] = {petals:Math.max(1,n(raw.clears[i].petals,3))};
      if (raw.ratingRewards && raw.ratingRewards[i]) p.ratingRewards[i] = true;
    }
    p.unlocked = 9;
    for (const e of D.enemies) {
      if (raw.seen && raw.seen[e.id]) p.seen[e.id] = true;
      p.kills[e.id] = n(raw.kills && raw.kills[e.id]);
    }
    p.wish = D.wishIds.includes(raw.wish) ? raw.wish : 'jibai';
    p.squad = [...new Set(Array.isArray(raw.squad) ? raw.squad.filter(id => p.owned[id] && D.byId[id]) : ['ying'])].slice(0,4);
    if (!p.squad.length) p.squad = ['ying'];
    p.favorite = p.owned[raw.favorite] ? raw.favorite : 'ying';
    p.introSeen = !!raw.introSeen; p.sound = !!raw.sound;
    for (const k of ['kills10','kills50']) p.milestones[k] = !!(raw.milestones && raw.milestones[k]);
    if (raw.rulesVersion>=2 && raw.active && raw.active.battle && raw.active.battle.result === 'playing') {
      const snap = raw.active.battle;
      const index = n(snap.index,9);
      if (index === snap.index && index <= p.unlocked && Array.isArray(snap.loadout) && snap.loadout.length >= 1 && snap.loadout.length <= 4 && snap.loadout.every(id => p.owned[id] && D.byId[id])) {
        const normalizedCarry = emptyCarry();
        let remaining = 2;
        for (const item of D.items) {
          normalizedCarry[item.id] = Math.min(n(raw.active.carry && raw.active.carry[item.id],2),p.items[item.id],remaining);
          remaining -= normalizedCarry[item.id];
        }
        const restored = new G.Battle(index,p.owned,snap.loadout,()=>{},snap);
        if (restored.result === 'playing') p.active = {battle:restored.save(),carry:normalizedCarry};
      }
    }
    return p;
  }

  function loadProfile() {
    try { const raw = localStorage.getItem(KEY); return raw ? normalize(JSON.parse(raw)) : defaults(); }
    catch (error) { setTimeout(() => toast(`存档未能载入：${error.message}。本次先使用新档；不会自动删除原存档。`),800); storageWarned = true; return defaults(); }
  }

  function snapshot() {
    profile.active = battle && battle.result === 'playing' ? {battle:battle.save(),carry:{...carry}} : null;
  }

  function save() {
    if (battle) snapshot();
    try { localStorage.setItem(KEY,JSON.stringify(profile)); }
    catch (_) { if (!storageWarned) { storageWarned = true; toast('浏览器暂时不能保存进度。请到设置中导出存档，避免丢失。'); } }
    updateWallet();
  }

  function toast(message) {
    clearTimeout(toastTimer); $('toast').textContent = message; $('toast').classList.add('show');
    toastTimer = setTimeout(() => $('toast').classList.remove('show'), 4400);
  }

  function updateWallet() {
    $('wallet-dust').textContent = profile.dust.toLocaleString('zh-CN');
    $('wallet-stamps').textContent = profile.stamps.toLocaleString('zh-CN');
  }

  function heroImage(id, className = '', extra = '') {
    const h = D.byId[id] || D.heroes[0];
    return `<img class="${className}" src="${esc(A.heroURLs[h.i] || A.fallback(h.color))}" alt="${esc(h.name)}" ${extra}>`;
  }

  function itemImage(id) { return `<img src="${esc(A.icon(id))}" alt="${esc(itemById[id].name)}">`; }
  function button(label,action,attrs='',className='secondary') { return `<button class="${className}" type="button" data-action="${action}" ${attrs}>${label}</button>`; }
  function heading(kicker,title,description,extra='') { return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${description}</p></div>${extra}</div>`; }

  function resourceGuide() {
    return `<div class="resource-guide"><button type="button" data-action="currencies"><strong>金币 · 只在本局使用</strong><small>工坊每 6 秒生产、击败怪物、波次补给、清除墨晶获得，用于部署与战斗升级。</small></button><button type="button" data-action="currencies"><strong>星尘 · 永久保存</strong><small>每击败一只怪物获得 2–5，通关再获奖励；用于抽奖、伙伴培养和购买道具。</small></button><button type="button" data-action="currencies"><strong>抽奖券 · 通关也能随机掉落</strong><small>保留新手、首通、三星与名录奖励。每次通关另有 25%–45% 概率掉 1 张；连续 3 次没掉，下次必掉。当前连续未掉：${profile.ticketDryStreak||0} / 3。</small></button></div>`;
  }

  function currencies() {
    const dropNote=`<h3>额外随机掉券：通关才结算</h3><p>第 1–3 关基础概率 25%，第 4–7 关 35%，第 8–10 关 45%。成功通关时额外判定一次，掉落一张；重玩也可获得，失败不判定。连续三次通关未掉券后，下一次成功通关必掉一张，随后重新累计。</p><p>此奖励与首次通关、首次三星的固定奖励叠加，不要求满血。连续未掉次数跨关卡保存，失败不清零。当前：${profile.ticketDryStreak||0} / 3。</p>`;
    openModal('金币、星尘和抽奖券怎么获得？',`<h3>金币：本局的建造资源</h3><p>进入关卡自带 ${Math.min(...D.maps.map(m=>m.startingCoins))}–${Math.max(...D.maps.map(m=>m.startingCoins))} 金币。免费金币工坊每 6 秒产生 ${D.economy.workshopIncome[1]} 金币；升级后为 ${D.economy.workshopIncome.slice(2).join(" / ")} 金币，升级费用为 ${D.economy.workshopUpgrade.slice(1,3).join(" / ")} 金币。普通怪物掉落 ${Math.min(...D.enemies.slice(0,7).map(e=>e.reward))}–${Math.max(...D.enemies.slice(0,7).map(e=>e.reward))} 金币，首领掉落 ${D.enemies[7].reward}；分裂或召唤的小怪只掉落该类型正常金币的四分之一，向下取整且至少 2 金币。新一波补给 ${Math.min(...D.maps.map(m=>m.waveSupply))}–${Math.max(...D.maps.map(m=>m.waveSupply))} 金币，清除墨晶额外获得 35。</p><p>金币用于部署守卫、战斗内升级和工坊升级。本关结束或重开后重置，不会消耗右上角的星尘。</p><h3>星尘：通过游玩积累的永久资源</h3><p>每击败一只怪物获得 2–5 星尘，随关卡难度提高，失败也保留已获得部分。首次通关第 1–10 关分别奖励 200–425 星尘；重复通关奖励 80–152。抽奖中的星尘奖励、重复伙伴转换也会增加星尘。</p><p>星尘用于永久培养、商店道具，或每次花 100 星尘抽奖。不充值，不用真实金钱。</p><h3>抽奖券：一张抽一次</h3><p>新手 / 本次规则更新赠送 5 张。每关首次通关得 1 张，首次三星通关再得 1 张，累计击败 10 / 50 只怪物各得 1 张。</p>${dropNote}<p class="detail-note">右上角显示永久星尘与抽奖券；战斗顶部显示当局金币。三种资源不会自动相互扣款。</p>`,[{label:'去抽奖',run:()=>{closeModal();show('recruit');}},{label:'明白了',kind:'primary',run:closeModal}]);
  }

  function openModal(title,body,actions=[]) {
    const dialog = $('modal');
    if (!dialog.open) { modalResume = view === 'battle' && !paused && battle && battle.result === 'playing'; paused = true; }
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = body;
    modalActions = actions;
    $('modal-actions').innerHTML = actions.map((a,i) => `<button type="button" class="${a.kind || 'secondary'}" data-modal-action="${i}" ${a.disabled ? 'disabled' : ''}>${a.label}</button>`).join('');
    if (!dialog.open) dialog.showModal();
    refreshBattle();
  }

  function closeModal() {
    if ($('modal').open) $('modal').close();
    if (modalResume && view === 'battle' && battle && battle.result === 'playing' && !document.hidden) paused = false;
    modalResume = false;
    refreshBattle();
  }

  function show(name) {
    if (view === 'battle' && name !== 'battle') { paused = true; aimItem = null; save(); }
    if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
    canvas = null; view = name;
    document.body.classList.toggle('game-home', name === 'home');
    document.querySelectorAll('[data-nav]').forEach(el => { el.classList.toggle('active',el.dataset.nav === name); if (el.dataset.nav === name) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current'); });
    ({home:renderHome,map:renderMap,roster:renderRoster,bestiary:renderBestiary,shop:renderShop,recruit:renderRecruit,battle:renderBattle}[name] || renderHome)();
    updateWallet();
    $('view').focus({preventScroll:true});
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }

  function renderHome() {
    const done = Object.keys(profile.clears).length;
    const h = D.byId[profile.favorite] || D.heroes[0];
    const activeBattle = battle && battle.result === 'playing' ? battle : profile.active?.battle;
    const missing = D.maps.findIndex((m,i) => !profile.clears[i]);
    const suggested = missing < 0 ? D.maps.length - 1 : missing;
    const startIndex = activeBattle ? Math.min(D.maps.length - 1, Math.max(0, Math.floor(Number(activeBattle.index) || 0))) : suggested;
    const sides = ['jibai','feilan','lumi','ember'].filter(id => id !== h.id).slice(0,2);
    const cast = [sides[0],h.id,sides[1]];
    const ticket = '<svg viewBox="0 0 80 80" aria-hidden="true"><defs><linearGradient id="menu-ticket-gold" x2="1" y2="1"><stop stop-color="#fff0b0"/><stop offset="1" stop-color="#dca956"/></linearGradient></defs><path d="M16 16h48v15c-11 0-11 18 0 18v15H16V49c11 0 11-18 0-18Z" fill="url(#menu-ticket-gold)" stroke="#8b642e" stroke-width="2"/><path d="M25 23v34M55 23v34" stroke="#b88741" stroke-width="2" stroke-dasharray="3 4"/><path d="m40 27 4 8 9 2-7 6 1 10-7-5-7 5 1-10-7-6 9-2Z" fill="#fff9dc" stroke="#bb883e" stroke-width="1.5"/></svg>';
    const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 4 11 8-11 8Z" fill="currentColor"/></svg>';
    $('view').innerHTML = `<section class="game-menu" aria-label="浮光守卫游戏主菜单">
      <div class="gm-backdrop" aria-hidden="true"></div><div class="gm-shade" aria-hidden="true"></div>
      <div class="gm-motes" aria-hidden="true">${Array.from({length:16},(_,i)=>'<i style="--x:'+((i*37+9)%100)+'%;--y:'+((i*23+11)%100)+'%;--delay:-'+(i*1.7)+'s;--duration:'+(11+i%5*2)+'s"></i>').join('')}</div>
      <div class="gm-world">
        <div class="gm-title-block"><p class="gm-eyebrow"><span></span> GUARDIANS OF THE PAINTED DREAM</p><h1 class="gm-title"><span>浮光</span><span>守卫</span></h1><p class="gm-tagline">集结你的伙伴，守住梦境之光。</p></div>
        <div class="gm-cast" role="group" aria-label="角色展示，点击查看技能">
          <div class="gm-stage-light" aria-hidden="true"></div><p class="gm-cast-caption">守卫集结 <span>点击角色，认识你的伙伴</span></p>
          ${cast.map((id,i)=>`<button type="button" class="gm-guardian gm-guardian--${i}" data-action="hero-detail" data-id="${id}" aria-label="查看${esc(D.byId[id].name)}的技能，${profile.owned[id]?'已拥有':'可通过抽奖获得'}" style="--entrance-delay:${.25+i*.14}s">${heroImage(id,'gm-character')}<span class="gm-character-name">${esc(D.byId[id].name)}<small>${profile.owned[id]?'Lv.'+profile.owned[id]+' · 已集结':'可招募'}</small></span></button>`).join('')}
        </div>
        <div class="gm-play"><button type="button" class="gm-start" data-action="${activeBattle?'continue':'prepare'}" data-index="${startIndex}"><span class="gm-start-icon">${arrow}</span><span><strong>${activeBattle?'继续守护':'开始守护'}</strong><small>第 ${String(startIndex+1).padStart(2,'0')} 关 · ${esc(D.maps[startIndex].name)}</small></span><span class="gm-start-spark" aria-hidden="true"></span></button>
          <div class="gm-play-links"><button type="button" data-action="map">选择关卡 <span>10 座梦境全部开放</span></button><button type="button" data-action="replay-intro" aria-label="重播开场动画">开场动画</button></div>
          <div class="gm-journey"><span>梦境旅程 <b>${done}<small> / 10</small></b></span><span class="gm-journey-nodes" aria-label="已通关${done}关">${D.maps.map((m,i)=>`<i class="${profile.clears[i]?'cleared':''}"></i>`).join('')}</span></div>
        </div>
      </div>
      <nav class="gm-dock" aria-label="游戏功能">
        <button type="button" class="gm-dock-item" data-nav="roster"><span class="gm-dock-art">${heroImage(h.id)}</span><span class="gm-dock-label"><strong>守卫</strong><small>${Object.keys(profile.owned).length} / ${D.heroes.length} 位伙伴</small></span><span class="gm-dock-arrow" aria-hidden="true">›</span></button>
        <button type="button" class="gm-dock-item gm-dock-draw" data-nav="recruit"><span class="gm-dock-art">${ticket}</span><span class="gm-dock-label"><strong>抽奖</strong><small>${profile.stamps} 张抽奖券</small></span>${profile.noviceDraws<2?'<span class="gm-newcomer">新手必得伙伴</span>':'<span class="gm-dock-arrow" aria-hidden="true">›</span>'}</button>
        <button type="button" class="gm-dock-item" data-nav="shop"><span class="gm-dock-art">${itemImage('spark')}</span><span class="gm-dock-label"><strong>商店</strong><small>补给与战斗道具</small></span><span class="gm-dock-arrow" aria-hidden="true">›</span></button>
        <button type="button" class="gm-dock-item" data-nav="bestiary"><span class="gm-dock-art"><img src="${esc(A.monsterURLs[0] || A.fallback('#78998b'))}" alt=""></span><span class="gm-dock-label"><strong>图鉴</strong><small>${Object.keys(profile.seen).length} / ${D.enemies.length} 种墨怪</small></span><span class="gm-dock-arrow" aria-hidden="true">›</span></button>
      </nav>
      <div class="gm-utility"><span>本地存档 · 免费游玩</span><div><button type="button" data-action="currencies">资源与掉券规则</button><span aria-hidden="true">·</span><button type="button" data-action="help">怎么玩</button></div></div>
    </section>`;
  }

  function sceneThumb(map) {
    const paths = map.paths.map(points => `<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${map.water}" stroke-width="42" stroke-linejoin="round" stroke-linecap="round"/>`).join('');
    const end = map.paths[0][map.paths[0].length-1];
    return `<div class="scene-thumb" style="--sx:${(map.i%5)*25}%;--sy:${Math.floor(map.i/5)*100}%"><svg class="map-route" viewBox="0 0 960 600" aria-hidden="true">${paths}<circle cx="${end[0]}" cy="${end[1]}" r="32" fill="#fff4ca" stroke="#b9a168" stroke-width="8"/></svg></div>`;
  }

  function renderMap() {
    $('view').innerHTML = heading('TEN OPEN CHALLENGES','十幅画境，自由挑战','全部开放，不再逐关上锁。根据建议强度选择挑战；通关后可以重玩，争取更高星级。',`<span class="count-label">${Object.keys(profile.clears).length} / 10 已通关</span>`) + resourceGuide() + `<div class="map-grid">${D.maps.map(map => {
      const unlocked = true;
      const clear = profile.clears[map.i];
      return `<button class="map-card" type="button" data-action="prepare" data-index="${map.i}" aria-label="第 ${map.i+1} 关 ${map.name}，挑战强度 ${map.difficulty}，${clear?clear.petals+' 星通关':'未通关'}">${sceneThumb(map)}<span class="map-number">${String(map.i+1).padStart(2,'0')}</span><h2>${map.name}</h2><span class="difficulty">挑战强度 ${map.difficulty} / 5</span><p>${map.waves} 波连续进攻 · ${map.paths.length} 个入口</p><span class="petals">${clear?`最佳成绩：${clear.petals} / 3 星`:'自由挑战 · 尚未通关'}</span></button>`;
    }).join('')}</div><p class="map-note">莲花满血 10 点通关得三星，剩余 7–9 点得二星，1–6 点得一星。每关首次通关奖励一张抽奖券，首次三星再奖一张。开放不代表难度相同，高难关更适合培养与搭配后的队伍。</p>`;
  }

  function prepare(index,reset=true) {
    if (index > profile.unlocked || !D.maps[index]) return;
    prepareIndex = index;
    if (reset) { prepareSquad = profile.squad.filter(id => profile.owned[id]).slice(0,4); if (!prepareSquad.length) prepareSquad = ['ying']; prepareCarry = emptyCarry(); }
    const map = D.maps[index];
    const unlock = D.unlock[index];
    const first = !profile.clears[index];
    const reward = (first ? `${map.clearDust} 星尘 · 1 张抽奖券` : `${map.replayDust} 星尘（重玩奖励）`) + `；额外抽奖券基础掉率 ${Math.round(Rewards.chance(index)*100)}%${profile.ticketDryStreak>=3?'，本次成功通关触发必掉奖励':'，连续三次未掉后下次必掉'}`;
    openModal(`第 ${index+1} 关 · ${map.name}`,`${sceneThumb(map)}<p class="detail-note">${map.hint}</p><p>${map.waves} 波连续进攻 · ${map.paths.length} 个入口 · 初始 ${map.startingCoins} 金币 · 莲花生命 10</p><p class="onboarding-note">免费自带金币工坊，每 6 秒生产 ${D.economy.workshopIncome[1]} 金币，不占伙伴名额。进入后有 12 秒布阵时间，随后怪物自动、持续入场；随时可以暂停布阵。</p><section class="prepare-section"><h3>携带守卫 <small>${prepareSquad.length} / 4 种</small></h3><p class="muted">同一种守卫可以放置多个。建议结合单体、减速和范围攻击，永久培养在进入关卡时生效。</p><div class="squad-grid">${D.heroes.filter(h=>profile.owned[h.id]).map(h=>`<button type="button" class="squad-choice ${prepareSquad.includes(h.id)?'selected':''}" data-action="squad" data-id="${h.id}" aria-pressed="${prepareSquad.includes(h.id)}">${heroImage(h.id)}<span>${h.name}</span><small>${stars(h.stars)} · Lv.${profile.owned[h.id]}</small></button>`).join('')}</div></section><section class="prepare-section"><h3>随身道具 <small>${Object.values(prepareCarry).reduce((a,b)=>a+b,0)} / 2 件</small></h3><p class="muted">可不携带。点击添加，再点可增加或取消；只有使用时才扣除库存。</p><div class="item-picks">${D.items.map(item=>`<button type="button" class="item-pick ${prepareCarry[item.id]?'selected':''}" data-action="pack" data-id="${item.id}" ${profile.items[item.id]?'':'disabled'} title="${esc(item.effect)}">${itemImage(item.id)}<span>${item.name}<small>携带 ${prepareCarry[item.id]} · 库存 ${profile.items[item.id]}</small></span></button>`).join('')}</div></section><p class="detail-note">每只怪物另获 ${map.killDust} 永久星尘。本次通关奖励：${reward}。首次三星再得 1 张抽奖券。</p>`,[{label:'再想一想',run:closeModal},{label:'进入画境',kind:'primary',run:()=>{
      if ((battle && battle.result==='playing') || profile.active) {
        openModal('开始一场新的守护？','<p>当前关卡内的金币、布阵和波次将重置。已经获得的伙伴、星尘和未使用道具都会保留。</p>',[{label:'保留当前战斗',run:closeModal},{label:'开始新的一局',kind:'primary',run:startPrepared}]);
      } else startPrepared();
    }}]);
  }

  function startPrepared() {
    modalResume = false; closeModal();
    profile.squad = [...prepareSquad]; carry = {...prepareCarry};
    battle = new G.Battle(prepareIndex,{...profile.owned},prepareSquad,onBattleEvent);
    selectedHero = prepareSquad[0]; selectedPad = null; aimItem = null; speed = 1; paused = false; accumulator = 0;
    save(); show('battle');
    if (prepareIndex===0 && !profile.clears[0]) toast('12 秒后自动出怪。先部署萤巡，再补位与升级；只放开局几个守卫会被后续强敌突破。可暂停思考。');
  }

  function continueBattle() {
    if (!battle && profile.active && profile.active.battle.flow?.balanceVersion !== D.balanceVersion) {
      const index = profile.active.battle.index;
      openModal("关卡平衡已更新", "<p>十关的敌人、经济和路线规则已统一更新。伙伴、培养、星尘、抽奖券、掉券保底和通关星级全部保留；旧版本未完成的战局需要重新布阵，避免混用两套数值。</p><p>选择重新布阵只重置这场未完成战斗，不会重置养成进度。</p>", [{label:"暂不重开",run:closeModal},{label:"按新规则重新布阵",kind:"primary",run:()=>{closeModal();profile.active=null;save();prepare(index);}}]);
      return;
    }
    if (!battle && profile.active) {
      try { carry = {...profile.active.carry}; const s = profile.active.battle; battle = new G.Battle(s.index,s.levels,s.loadout,onBattleEvent,s); }
      catch (_) { profile.active = null; toast('这场战斗的记录不完整，已保留养成进度，请重新进入关卡。'); save(); show('map'); return; }
    }
    if (!battle || battle.result !== 'playing') { show('map'); return; }
    selectedHero = battle.loadout.includes(selectedHero)?selectedHero:battle.loadout[0];
    paused = false; accumulator = 0; show('battle');
  }

  function onBattleEvent(event) {
    // The simulation uses the numeric enemy type for creature events.
    if (typeof event.type === 'number') {
      const enemy = D.enemies[event.type];
      if (enemy) {
        profile.seen[enemy.id] = true;
        if (event.reward != null) {
          profile.kills[enemy.id] = (profile.kills[enemy.id] || 0)+1;
          profile.dust += battle ? battle.map.killDust : 2;
          const total = Object.values(profile.kills).reduce((a,b)=>a+b,0);
          for (const threshold of [10,50]) if (total >= threshold && !profile.milestones[`kills${threshold}`]) { profile.milestones[`kills${threshold}`] = true; profile.stamps++; toast(`名录里程碑：累计击败 ${threshold} 只墨怪，获得 1 张抽奖券。`); }
        }
      }
      return;
    }
    if (event.type === 'end') finishBattle();
    if (event.type === 'wave') tone(480,.07);
    if (event.type === 'supply') toast(`第 ${battle.wave} 波开始进入，获得 ${event.amount} 金币补给。`);
    if (event.type === 'leak') tone(150,.12);
    sideKey = '';
  }

  function finishBattle() {
    if (!battle || battle.rewardClaimed) return;
    battle.rewardClaimed = true; paused = true; aimItem = null;
    const won = battle.result === 'won';
    const index = battle.index;
    const rewards = [];
    const first = !profile.clears[index];
    let petals = 0;
    if (won) {
      petals = battle.hp >= 10 ? 3 : battle.hp >= 7 ? 2 : 1;
      profile.clears[index] = {petals:Math.max(profile.clears[index]?.petals||0,petals)};
      profile.unlocked = 9;
      const dustReward=first?battle.map.clearDust:battle.map.replayDust;
      profile.dust += dustReward; rewards.push(`${dustReward} 星尘（另加已获得的击败奖励）`);
      if (first) { profile.stamps++; rewards.push('首次通关：1 张抽奖券'); }
      if (petals===3&&!profile.ratingRewards[index]) { profile.ratingRewards[index]=true;profile.stamps++;rewards.push('首次三星：1 张抽奖券'); }
      const ticketDrop=Rewards.rollTicket(index,profile.ticketDryStreak);
      profile.ticketDryStreak=ticketDrop.nextStreak;
      if(ticketDrop.count){profile.stamps+=ticketDrop.count;rewards.push(ticketDrop.guaranteed?'连续通关保底：额外抽奖券 × 1':'随机通关掉落：额外抽奖券 × 1');}
      else rewards.push(`本次未额外掉券：已连续 ${ticketDrop.nextStreak} / 3 次；连续三次未掉后下次通关必掉`);
      tone(720,.18);
    }
    save();
    queueMicrotask(()=>{
      const earnedHero = won && first && D.unlock[index];
      const picture = earnedHero ? heroImage(earnedHero) : '<img src="assets/icon.svg" alt="守护之莲">';
      openModal(won?'挑战成功':'本次守护失败',`<div class="result-art">${picture}</div><p class="result-title">${won ? D.maps[index].name+' · 通关' : '试试先增加火力，再投资金币工坊。'}</p><div class="result-metrics"><span><b>${battle.kills}</b><small>击退墨怪</small></span><span><b>${battle.hp} / 10</b><small>莲花生命</small></span><span><b>${battle.producedCoins||0}</b><small>工坊生产金币</small></span></div>${won?`<p class="result-petals">本次成绩：${petals} / 3 星</p><p>${rewards.join('<br>')}</p>`:`<p class="detail-note">已经从击败怪物中获得 ${battle.kills*battle.map.killDust} 星尘，失败也会保留。伙伴培养、名录与未使用道具都保留，本局布阵和金币重置。</p>`}`,won?[{label:'回到关卡选择',run:()=>{modalResume=false;closeModal();show('map');}},{label:'同关挑战三星',run:()=>prepare(index)},{label:'去抽奖获得伙伴',kind:'primary',run:()=>{modalResume=false;closeModal();show('recruit');}}]:[{label:'调整伙伴',run:()=>{modalResume=false;closeModal();show('roster');}},{label:'重新布阵',kind:'primary',run:()=>prepare(index)}]);
    });
  }

  function renderBattle() {
    if (!battle) { show('map'); return; }
    const map = battle.map;
    $('view').innerHTML = `<div class="battle-heading">${button('返回关卡','map','','back')}<div><p class="eyebrow">CHAPTER ${String(battle.index+1).padStart(2,'0')}</p><h1>${map.name}</h1></div><div class="battle-hud"><span>莲花 <b id="hud-hp"></b></span><span>本局金币 <b id="hud-coins"></b></span><span>波次 <b id="hud-wave"></b></span><span class="income-label" id="hud-income"></span>${button('资源说明','currencies','','wallet-help')}</div><div class="battle-tools">${button('暂停','pause','id="pause-button"','small-button')}${button(`${speed} 倍速`,'speed','id="speed-button"','small-button')}${button('全屏','fullscreen','','small-button')}</div></div><div class="battle-layout" id="battle-layout"><div class="battle-main"><div class="canvas-wrap"><canvas id="battle-canvas" width="960" height="600" aria-label="守卫战场。点击河岸加号部署守卫，点击金币小屋升级生产。"></canvas><div class="battle-banner" id="battle-banner" hidden></div></div><div class="battle-deck" id="battle-deck">${battle.loadout.map((id,i)=>{const h=D.byId[id];return `<button type="button" class="deck-card ${id===selectedHero?'selected':''}" data-action="select-hero" data-id="${id}" aria-pressed="${id===selectedHero}">${heroImage(id)}<b>${h.name}</b><small>${h.cost} 金币 · ${i+1}</small></button>`;}).join('')}</div><div class="battle-bottom"><div><p id="wave-note"></p><div class="wave-timeline"><i id="wave-progress"></i></div></div>${button('跳过准备，立即开始','next-wave','id="next-wave"','primary next-wave')}</div><div class="battle-items" id="battle-items"></div></div><aside class="battle-side" id="battle-side"></aside></div>`;
    canvas = $('battle-canvas');
    const resize = () => { if (!canvas) return; const width = canvas.getBoundingClientRect().width; const ratio = Math.min(2,window.devicePixelRatio||1); canvas.width = Math.max(1,Math.round(width*ratio)); canvas.height = Math.max(1,Math.round(width*ratio*600/960)); };
    resize(); resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
    canvas.addEventListener('pointerdown',event=>{
      if (!battle || battle.result !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const point = {x:(event.clientX-rect.left)/rect.width*960,y:(event.clientY-rect.top)/rect.height*600};
      if (aimItem) { useItem(aimItem,point); return; }
      const pad = battle.pads.map(p=>({p,d:Math.hypot(p.x-point.x,p.y-point.y)})).sort((a,b)=>a.d-b.d)[0];
      selectedPad = pad && pad.d < 43 ? pad.p.id : null;
      sideKey = ''; refreshBattle();
    });
    sideKey = ''; refreshBattle();
  }

  function refreshBattle() {
    if (view !== 'battle' || !battle || !$('hud-hp')) return;
    $('hud-hp').textContent = `${battle.hp} / 10`;
    $('hud-coins').textContent = Math.floor(battle.coins);
    $('hud-wave').textContent = `${battle.wave} / ${battle.map.waves}`;
    $('hud-income').textContent = `工坊 +${battle.income()} / 6 秒`;
    updateWallet();
    $('pause-button').textContent = paused?'继续':'暂停';
    $('pause-button').disabled = battle.result !== 'playing';
    $('speed-button').textContent = `${speed} 倍速`;
    const next = $('next-wave');
    next.disabled = battle.started || battle.result!=='playing';
    next.textContent = '跳过准备，立即开始';
    const waiting=battle.queue.length?Math.max(0,battle.queue[0].at-battle.time):0;
    $('wave-note').textContent = !battle.started?`${Math.max(0,Math.ceil(battle.preparationEnd-battle.time))} 秒后自动出怪。先布阵，金币工坊正在生产；需要更多思考时间可暂停。`:`持续进攻中 · 场上 ${battle.enemies.filter(e=>!e.dead).length} 只 · ${battle.queue.length?`下一只 ${waiting.toFixed(1)} 秒后进入，后续还有 ${battle.queue.length} 只`:'所有怪物已入场，消灭剩余敌人即可通关'}`;
    $('wave-progress').style.width=`${battle.wave/battle.map.waves*100}%`;
    const banner = $('battle-banner');
    banner.hidden = !paused || battle.result!=='playing';
    banner.textContent = '画境已暂停 · 可以安心调整布阵';
    document.querySelectorAll('.deck-card').forEach(el=>{const active=el.dataset.id===selectedHero;el.classList.toggle('selected',active);el.setAttribute('aria-pressed',String(active));});
    const key = JSON.stringify([selectedPad,selectedHero,Math.floor(battle.coins),battle.workshopTier,battle.towers.map(t=>[t.id,t.tier,t.priority]),battle.pads.filter(p=>p.blocked).map(p=>[p.id,Math.ceil(p.hp)]),battle.focus,battle.result,Math.floor(battle.time/2)]);
    if (key !== sideKey) { sideKey=key;renderBattleSide(); }
    $('battle-items').innerHTML = D.items.filter(item=>carry[item.id]>0).map(item=>`<button type="button" class="battle-item ${aimItem===item.id?'selected':''}" data-action="use-item" data-id="${item.id}" title="${esc(item.effect)}" ${battle.canUse(item.id)?'':'disabled'}>${itemImage(item.id)}<span>${item.name} × ${carry[item.id]}</span></button>`).join('') || '<p class="muted">未携带道具。守卫的配合也能守住花庭。</p>';
  }

  function renderBattleSide() {
    const side = $('battle-side');
    const pad = battle.pads.find(p=>p.id===selectedPad);
    const t = pad && battle.towers.find(t=>t.pad===pad.id);
    if(pad&&pad.id===battle.workshopPad){const cost=battle.workshopCost();side.innerHTML=`<div class="workshop-details"><p class="eyebrow">FREE COIN WORKSHOP</p><img src="assets/workshop.svg" alt="金币工坊"><h2>金币工坊 · ${['','I','II','III'][battle.workshopTier]} 阶</h2><p>每关免费赠送，不占伙伴队伍，不攻击。金币自动入账，不需要反复点击收取。</p><p class="income-counter">+${battle.income()} 金币 / 6 秒</p><p>本局已生产 ${battle.producedCoins} 金币；距离下一次约 ${Math.ceil(6-battle.incomeClock)} 秒。</p>${cost?`<p class="workshop-next">升级花费 ${cost} 金币，之后每 6 秒生产 ${D.economy.workshopIncome[battle.workshopTier+1]} 金币。本次升级每 6 秒多 ${D.economy.workshopIncome[battle.workshopTier+1]-battle.income()} 金币，约 ${Math.ceil(cost*6/(D.economy.workshopIncome[battle.workshopTier+1]-battle.income()))} 秒回本。先确保火力能守住。</p>`:'<p class="workshop-next">生产已满级，接下来将金币投入守卫。</p>'}<div class="actions">${button(cost?`升级工坊 · ${cost} 金币`:'已达最高等级','upgrade-workshop',!cost||battle.coins<cost||battle.result!=='playing'?'disabled':'','primary')}</div></div>`;return;}
    if (!pad) { side.innerHTML=`<p class="eyebrow">YOUR LITTLE GUARDIANS</p>${heroImage(selectedHero,'selected-image')}<h2>布阵、升级，经营火力</h2><p>点河岸「＋」部署伙伴；点金币小屋升级生产。怪物会持续进入，不需要逐波点击。</p><p class="detail-note">${battle.map.hint}</p><p>每只怪物奖励 ${battle.map.killDust} 永久星尘，另外掉落本局金币。相同伙伴可以反复部署。</p>${button('查看资源来源','currencies','','text-button')}`;return; }
    if (pad.blocked) { side.innerHTML=`<p class="eyebrow">SLEEPING CRYSTAL</p><h2>沉睡的墨晶</h2><p>剩余耐久 ${Math.max(0,Math.ceil(pad.hp))}。指挥射程内的守卫清除它，获得 35 金币与一个新落脚点。</p><p class="detail-note">清除期间，这些守卫会优先攻击墨晶。敌人接近时可以取消。</p><div class="actions">${button(battle.focus===pad.id?'取消清除':'集中清除','clear-pad','','primary')}</div>`;return; }
    if (t) {
      const h=D.byId[t.hero],s=battle.stats(t),cost=battle.upgradeCost(t);
      const next=t.tier<3?D.stats(t.hero,battle.levels[t.hero],t.tier+1):null;
      side.innerHTML=`<p class="eyebrow">${stars(h.stars)} · 培养 Lv.${battle.levels[t.hero]||1}</p>${heroImage(h.id,'selected-image')}<h2>${h.name} <small>${['','I','II','III'][t.tier]}</small></h2><p>${h.skill}</p><div class="stat-mini"><span><b>${Math.round(s.attack)}</b><small>攻击</small></span><span><b>${s.interval.toFixed(2)}s</b><small>攻击间隔</small></span><span><b>${Math.round(s.range)}</b><small>射程</small></span></div>${next?`<p class="detail-note">下一阶基础攻击 ${next.attack} · 射程 ${Math.round(next.range)}。战斗升级在本关结束后重置。</p>`:'<p class="detail-note">已经是本场战斗的最高阶。</p>'}<div class="actions">${button(t.tier<3?`升级 · ${cost} 金币`:'已达 III 阶','upgrade',t.tier>=3||battle.coins<cost||battle.result!=='playing'?'disabled':'','primary')}${button(t.priority==='strong'?'目标：高血量':'目标：最接近莲花','priority','','small-button')}${button(`出售 · 返还 ${Math.floor(t.spent*.7)} 金币`,'sell',battle.result!=='playing'?'disabled':'','text-button')}</div>`;
    } else {
      const h=D.byId[selectedHero],s=D.stats(h.id,battle.levels[h.id]||1,1);
      side.innerHTML=`<p class="eyebrow">${h.title}</p>${heroImage(h.id,'selected-image')}<h2>${h.name}</h2><p>${h.skill}</p><div class="stat-mini"><span><b>${s.attack}</b><small>攻击</small></span><span><b>${s.interval.toFixed(2)}s</b><small>攻击间隔</small></span><span><b>${Math.round(s.range)}</b><small>射程</small></span></div><div class="actions">${button(`放置守卫 · ${h.cost} 金币`,'build',battle.coins<h.cost||battle.result!=='playing'?'disabled':'','primary')}</div><p class="detail-note">点击下方伙伴卡切换要部署的角色。</p>`;
    }
  }

  function useItem(id,point) {
    if (!battle || !carry[id] || !profile.items[id] || !battle.canUse(id)) { toast('这件道具现在还不能使用。');return; }
    if (id==='spark'&&!point) { aimItem=aimItem==='spark'?null:'spark';toast(aimItem?'点击蓝色河道投下星火瓶，按 Esc 取消。':'已收起星火瓶。');return; }
    if (battle.use(id,point)) { profile.items[id]--;carry[id]--;aimItem=null;save();tone(600,.1);refreshBattle(); }
    else if (id==='spark') toast('请选在蓝色河道上；这次没有消耗道具。');
  }

  function renderRoster() {
    const list = D.heroes.filter(h=>rosterFilter==='all'||rosterFilter==='owned'&&profile.owned[h.id]||String(h.stars)===rosterFilter);
    $('view').innerHTML=heading('YOUR GUARDIANS','守卫与培养','萤巡免费获得，其余守卫通过抽奖获得。星级是稀有度，培养等级是永久成长；旧版已获得伙伴全部保留。',`<span class="count-label">${Object.keys(profile.owned).length} / ${D.heroes.length} 已拥有</span>`)+`<div class="filter-row">${[['all','全部伙伴'],['owned','我的伙伴'],['1','一星'],['2','二星'],['3','三星'],['4','四星'],['5','五星']].map(([id,label])=>button(label,'filter',`data-id="${id}"`,rosterFilter===id?'active':'')).join('')}${button('抽奖与完整奖池','recruit','','primary')}</div><div class="hero-grid">${list.map(h=>`<button class="hero-card ${profile.owned[h.id]?'':'not-owned'}" type="button" data-action="hero-detail" data-id="${h.id}" style="--hero-color:${h.color}"><span class="tag">${h.title}</span>${heroImage(h.id)}<span class="star-line">${stars(h.stars)}</span><h2>${h.name}</h2><p>${h.skill}</p><span class="level">${profile.owned[h.id]?`培养 Lv.${profile.owned[h.id]}`:h.stars>=4?`碎片 ${profile.fragments[h.id]||0} / ${h.stars===5?24:12}`:'抽奖获得 · 尚未拥有'}</span>${profile.favorite===h.id?'<span class="badge">首页伙伴</span>':''}</button>`).join('')}</div><p class="map-note">低星伙伴便宜，适合快速铺开；高星伙伴更强，也需要更多金币。金币工坊是每关免费建筑，不占队伍名额，不在奖池中。</p>`;
  }

  function heroDetail(id) {
    const h=D.byId[id];if(!h)return;
    const owned=profile.owned[id],level=owned||1,s=D.stats(id,level,1),next=level<5?D.stats(id,level+1,1):null;
    const threshold=h.stars===5?24:12;
    const unlockAt=D.unlock.indexOf(id);
    const source=owned?'已经拥有':id==='ying'?'免费初始伙伴':h.stars>=4?`抽奖获得完整伙伴，或收集 ${threshold} 枚专属碎片合成`:`抽奖获得${id==='lumi'?'；新手第一抽固定获得':id==='ember'?'；新手第二抽固定获得':''}`;
    const rows=[['攻击',s.attack,next?.attack],['攻击间隔',s.interval.toFixed(2)+' 秒',next?next.interval.toFixed(2)+' 秒':null],['射程',Math.round(s.range),next?Math.round(next.range):null]];
    const actions=[{label:'关闭',run:closeModal}];
    if(owned){actions.push({label:'设为首页伙伴',run:()=>{profile.favorite=id;save();toast(`${h.name}会在首页迎接你。`);heroDetail(id);}});if(level<5)actions.push({label:`培养至 Lv.${level+1} · ${D.trainCosts[level-1]} 星尘`,kind:'primary',disabled:profile.dust<D.trainCosts[level-1],run:()=>{if(profile.dust<D.trainCosts[level-1]||profile.owned[id]!==level)return;profile.dust-=D.trainCosts[level-1];profile.owned[id]++;save();heroDetail(id);if(view==='roster')renderRoster();tone(680,.12);}});}
    else if(h.stars>=4)actions.push({label:`使用 ${threshold} 枚碎片合成`,kind:'primary',disabled:(profile.fragments[id]||0)<threshold,run:()=>craftHero(id)});
    else actions.push({label:'去抽奖',kind:'primary',run:()=>{closeModal();show('recruit');}});
    openModal(h.name,`<div class="detail-hero">${heroImage(id)}<div><p class="eyebrow">${h.title}</p><p class="star-line">${stars(h.stars)} · ${owned?`培养 Lv.${level}`:'未拥有'}</p><p>${h.story}</p></div></div><h3>独特能力</h3><p>${h.skill}</p><table class="stat-table"><thead><tr><th>属性</th><th>Lv.${level}</th><th>${next?`Lv.${level+1}`:'已满级'}</th></tr></thead><tbody>${rows.map(([name,a,b])=>`<tr><td>${name}</td><td>${a}</td><td>${b??'—'}</td></tr>`).join('')}<tr><td>部署消耗</td><td>${h.cost} 金币</td><td>不变</td></tr></tbody></table><p class="detail-note">每升一级，基础攻击增加初始值的 10%，射程增加 3；Lv.5 额外缩短攻击间隔 5%。培养消耗永久星尘，击败怪物与通关均可获得。新属性从下一场战斗生效。</p><p>${source}</p>${h.stars>=4&&!owned?`<p>现有碎片：${profile.fragments[id]||0} / ${threshold}。</p>`:''}`,actions);
  }

  function renderBestiary() {
    const total=Object.values(profile.kills).reduce((a,b)=>a+b,0);
    $('view').innerHTML=heading('THE INK FIELD NOTES','墨潮名录','每种墨怪有不同的速度、生命与应对方式。击败怪物同时获得本局金币与永久星尘。',`<span class="count-label">${Object.keys(profile.seen).length} / 8 已发现</span>`)+`<div class="hero-grid bestiary">${D.enemies.map(e=>`<button type="button" class="hero-card ${profile.seen[e.id]?'':'unseen'}" data-action="enemy-detail" data-id="${e.id}"><img src="${esc(A.monsterURLs[e.i]||A.fallback('#727676'))}" alt="${profile.seen[e.id]?e.name:'尚未发现的墨怪轮廓'}"><h2>${profile.seen[e.id]?e.name:'尚未发现'}</h2><p>${profile.seen[e.id]?e.story:'自由挑战其他关卡，发现不同怪物。'}</p><span class="level">${profile.seen[e.id]?`累计击败 ${profile.kills[e.id]||0} 只`:'未知的墨潮'}</span></button>`).join('')}</div><p class="map-note">已击败 ${total} 只墨怪。累计击败 10 / 50 只分别奖励 1 张抽奖券，自动发放且各限一次。${profile.milestones.kills10?'10 只奖励已领取。':''}${profile.milestones.kills50?'50 只奖励已领取。':''}</p>`;
  }

  function enemyDetail(id) {
    const e=D.enemies.find(e=>e.id===id);if(!e)return;
    if(!profile.seen[id]){toast('这只墨怪还没有出现在你的旅途中。');return;}
    openModal(e.name,`<div class="detail-hero"><img src="${esc(A.monsterURLs[e.i]||A.fallback('#727676'))}" alt="${e.name}"><div><p>${e.story}</p><p>累计击败 ${profile.kills[id]||0} 只</p></div></div><table class="stat-table"><tbody><tr><th>基础生命</th><td>${e.hp}</td></tr><tr><th>行进速度</th><td>${e.speed} / 秒</td></tr><tr><th>基础护甲减伤</th><td>${Math.round(e.armor*100)}%</td></tr><tr><th>击败金币</th><td>${e.reward}</td></tr><tr><th>抵达莲花的伤害</th><td>${e.leak}</td></tr></tbody></table><h3>守护笔记</h3><p>${e.tip}</p><p class="detail-note">生命随画境与波次提升。同种怪物的基础速度一致，减速技能可暂时改变速度；所有墨怪与召唤物始终沿当前蓝色河道行进。</p>`,[{label:'收好笔记',kind:'primary',run:closeModal}]);
  }

  function renderShop() {
    $('view').innerHTML=heading('ITEM SHOP','道具商店','消耗通过击败怪物、通关获得的星尘购买道具，没有付费商品。',`<span class="count-label">${profile.dust} 星尘</span>`)+resourceGuide()+`<p class="shop-sign">每次进入画境可携带两件道具，不使用就不会扣除。道具不是通关的必要条件。</p><div class="shop-grid">${D.items.map(item=>`<article class="item-card">${itemImage(item.id)}<h2>${item.name}</h2><p>${item.story}</p><p>${item.effect}</p><small>背包库存 ${profile.items[item.id]} 件</small>${button(`${item.price} 星尘 · 查看购买`,'buy-item',`data-id="${item.id}"`,'small-button')}</article>`).join('')}</div>`;
  }

  function buyItem(id) {
    const item=itemById[id];if(!item)return;
    openModal(item.name,`<div class="result-art">${itemImage(id)}</div><p>${item.story}</p><p class="detail-note">${item.effect}</p><p>价格 ${item.price} 星尘 · 当前库存 ${profile.items[id]} 件</p>`,[{label:'先不买',run:closeModal},{label:`购买一件 · ${item.price} 星尘`,kind:'primary',disabled:profile.dust<item.price,run:()=>{if(profile.dust<item.price)return;profile.dust-=item.price;profile.items[id]++;save();closeModal();renderShop();toast(`${item.name}已放进背包。`);}}]);
  }

  function renderRecruit() {
    const wish=D.byId[profile.wish];
    const progress=profile.owned[wish.id]?24:Math.min(24,profile.fragments[wish.id]||0);
    $('view').innerHTML=heading('GUARDIAN DRAW & PRIZE POOL','守卫抽奖','能抽到什么、每件奖品长什么样、概率是多少，都在这里直接展示。')+resourceGuide()+`${profile.noviceDraws<2?`<p class="onboarding-note"><strong>新手固定奖励：</strong>第一抽获得露米（减速），第二抽获得烬团（范围火焰）。当前完成 ${profile.noviceDraws} / 2 次。这两抽不使用随机奖池概率；已拥有的伙伴转换为 45 星尘。</p>`:''}<div class="recruit-layout"><section class="wish-stage">${heroImage(wish.id)}<div class="wish-caption"><p class="eyebrow">TARGET FIVE-STAR FRAGMENTS</p><h2>${wish.name}</h2><span>${stars(wish.stars)} · 心愿碎片目标</span></div></section><section class="recruit-info"><p class="eyebrow">CHOOSE A FRAGMENT TARGET</p><h2>选择想收集的五星碎片</h2><p>选择只影响五星碎片和每五抽额外奖励的归属，不改变完整角色概率。换目标不丢失已有碎片。</p><div class="wish-options">${D.wishIds.map(id=>`<button type="button" class="wish-option ${profile.wish===id?'active':''}" data-action="wish" data-id="${id}" aria-pressed="${profile.wish===id}">${heroImage(id)}<span>${D.byId[id].name}</span></button>`).join('')}</div><div class="progress-track"><i style="width:${progress/24*100}%"></i></div><p class="progress-copy">${profile.owned[wish.id]?'已经拥有，重复碎片转为星尘':`${wish.name}碎片 ${profile.fragments[wish.id]||0} / 24`}</p><p class="recruit-note">每 5 抽额外获得 6 枚心愿五星碎片。距离下次额外奖励还有 ${5-profile.recruits%5} 抽。</p><div class="actions">${button('抽奖一次 · 1 张抽奖券','recruit-stamp',profile.stamps<1?'disabled':'','primary')}${button('抽奖一次 · 100 星尘','recruit-dust',profile.dust<100?'disabled':'')}${button('概率与规则','probabilities','','text-button')}${button('查看下方完整奖池','pool-scroll','','text-button')}</div><p class="pool-cost-note">持有 ${profile.stamps} 张抽奖券、${profile.dust} 星尘。击败怪物和通关获得星尘；首次通关、首次三星与名录里程碑获得抽奖券。没有付费充值。</p></section></div><section id="prize-pool">${poolOverview()}</section>`;
  }

  function chanceText(value){return `${Number(value.toFixed(3))}%${value===2/3?'（约）':''}`;}

  function prizeCard(entry){
    const id=entry.kind==='wish'?profile.wish:entry.id;
    const h=D.byId[id];
    let name='',image='',sub='',action='currencies',extra='';
    if(entry.kind==='hero'){name=h.name;image=heroImage(id);sub=`${stars(h.stars)} · 完整角色${profile.owned[id]?' · 已拥有':''}`;action='hero-detail';extra=`data-id="${id}"`;}
    else if(entry.kind==='fragment'||entry.kind==='wish'){name=`${h.name}碎片 × ${entry.count}`;image=heroImage(id);sub=`${stars(h.stars)} · ${h.stars===5?24:12} 枚合成${entry.kind==='wish'?' · 当前心愿':''}`;action='hero-detail';extra=`data-id="${id}"`;}
    else if(entry.kind==='item'){const item=itemById[id];name=item.name+' × 1';image=itemImage(id);sub=item.effect;action='prize-item';extra=`data-id="${id}"`;}
    else{name=`星尘 × ${entry.count}`;image='<img src="assets/icon.svg" alt="永久星尘">';sub='培养、抽奖与购买道具';}
    return `<button type="button" class="pool-prize ${entry.kind==='fragment'||entry.kind==='wish'?'fragment-prize':''}" data-action="${action}" ${extra}>${image}<strong>${name}</strong><small>${sub}</small><span class="prize-chance">${chanceText(entry.chance)}</span></button>`;
  }

  function poolOverview(){
    return `<div class="pool-heading"><h2>奖池里的全部奖励</h2><p>下面是新手固定两抽之后的随机奖池，点击图片查看详情。</p></div><h3>完整守卫 · 合计 36%</h3><div class="pool-grid">${D.pool.filter(e=>e.kind==='hero').map(prizeCard).join('')}</div><div class="pool-heading"><h2>伙伴碎片 · 合计 42%</h2><p>四星各 8%；当前心愿五星 18%。换心愿会替换这里的五星碎片。</p></div><div class="pool-grid">${D.pool.filter(e=>e.kind==='fragment'||e.kind==='wish').map(prizeCard).join('')}</div><div class="pool-heading"><h2>道具与星尘 · 合计 22%</h2><p>每种道具 3.4%，星尘 5%。道具图片可以点开查看用途。</p></div><div class="pool-grid">${D.pool.filter(e=>e.kind==='item'||e.kind==='dust').map(prizeCard).join('')}</div><p class="map-note">萤巡与金币工坊免费赠送，不占奖池。已拥有伙伴依然可能抽到，会转换成星尘；所有基础与高星守卫都可在这里查看，不再通过指定关卡解锁。</p>`;
  }

  function probabilities() {
    openModal('抽奖概率与规则',`<p class="onboarding-note">新手前两抽为固定角色：露米、烬团，不参与下表随机分配。之后每抽独立随机，以下概率合计 100%。</p><table class="stat-table"><thead><tr><th>奖品分类</th><th>概率</th></tr></thead><tbody><tr><td>一星完整角色</td><td>8%</td></tr><tr><td>二星完整角色</td><td>12%，两位各 6%</td></tr><tr><td>三星完整角色</td><td>8%，两位各 4%</td></tr><tr><td>四星完整角色</td><td>6%，三位各 2%</td></tr><tr><td>五星完整角色</td><td>2%，三位各约 0.667%</td></tr><tr><td>四星角色碎片 × 3</td><td>24%，三位各 8%</td></tr><tr><td>当前心愿五星碎片 × 3</td><td>18%</td></tr><tr><td>随机道具 × 1</td><td>17%，五种各 3.4%</td></tr><tr><td>星尘 × 60</td><td>5%</td></tr></tbody></table><h3>每五抽的额外奖励</h3><p>累计每五抽额外发放六枚当前心愿五星碎片，不占本次随机奖品。始终选择同一目标，二十抽可只靠额外奖励凑齐二十四枚。固定新手抽奖也计入次数。更换心愿不会重置计数，也不会转移已获得碎片。</p><h3>重复与合成</h3><p>重复一至五星完整角色分别转换为 25 / 45 / 70 / 120 / 240 星尘。四星十二枚、五星二十四枚碎片可在伙伴详情中合成。已拥有角色的四星 / 五星碎片每枚转为 10 / 15 星尘，多余碎片同样转换。</p><p class="detail-note">每次使用一张抽奖券，或由你明确选择使用 100 星尘。全部资源来自游戏赠送与游玩，没有真实金钱支付。</p>`,[{label:'查看带图片的完整奖池',kind:'primary',run:()=>{closeModal();if(view!=='recruit')show('recruit');$('prize-pool')?.scrollIntoView({behavior:'smooth',block:'start'});}},{label:'关闭',run:closeModal}]);
  }

  function grantHero(id) {
    const h=D.byId[id];
    if(profile.owned[id]){const amount=D.duplicateDust[h.stars];profile.dust+=amount;return `${h.name}已经拥有，转换为 ${amount} 星尘`;}
    profile.owned[id]=1;
    if(profile.squad.length<4&&!profile.squad.includes(id))profile.squad.push(id);
    const extra=(profile.fragments[id]||0)*(h.stars===5?15:10);profile.dust+=extra;profile.fragments[id]=0;
    return `${h.name}加入守卫队${extra?`，已有碎片转换为 ${extra} 星尘`:''}`;
  }

  function grantFragments(id,count) {
    const h=D.byId[id];
    if(profile.owned[id]){const amount=count*(h.stars===5?15:10);profile.dust+=amount;return `${h.name}碎片 × ${count}，转换为 ${amount} 星尘`;}
    profile.fragments[id]=(profile.fragments[id]||0)+count;
    return `${h.name}碎片 × ${count}（现有 ${profile.fragments[id]} / ${h.stars===5?24:12}）`;
  }

  function craftHero(id) {
    const h=D.byId[id];if(!h||h.stars<4||profile.owned[id])return;
    const required=h.stars===5?24:12;
    if((profile.fragments[id]||0)<required)return;
    profile.fragments[id]-=required;
    const message=grantHero(id);save();heroDetail(id);if(view==='roster')renderRoster();else if(view==='recruit')renderRecruit();toast(message);tone(780,.18);
  }

  function confirmRecruit(currency) {
    if(recruitBusy)return;
    const cost=currency==='stamps'?1:100,name=currency==='stamps'?'张抽奖券':'星尘';
    openModal('确认抽奖一次？',`<p>消耗 ${cost} ${name}。${profile.noviceDraws<2?`本次是新手固定奖励：${D.byId[['lumi','ember'][profile.noviceDraws]].name}，不使用随机概率。`:'本次按照公开概率抽取一件奖品。'}</p><p>当前五星碎片心愿：${D.byId[profile.wish].name}。</p><p class="detail-note">抽奖后累计次数为 ${profile.recruits+1}。${(profile.recruits+1)%5===0?'这次另有六枚心愿碎片奖励。':'每五抽额外奖励六枚心愿碎片。'}</p>`,[{label:'取消',run:closeModal},{label:`确认抽奖 · ${cost} ${name}`,kind:'primary',disabled:profile[currency]<cost,run:()=>recruit(currency)}]);
  }

  function recruit(currency) {
    const cost=currency==='stamps'?1:100;
    if(recruitBusy||profile[currency]<cost)return;
    recruitBusy=true;profile[currency]-=cost;profile.recruits++;
    let entry;
    const novice=profile.noviceDraws<2;
    if(novice){entry={kind:'hero',id:['lumi','ember'][profile.noviceDraws],count:1};profile.noviceDraws++;}
    else{let roll=Math.random()*100;entry=D.pool[D.pool.length-1];for(const candidate of D.pool){roll-=candidate.chance;if(roll<0){entry=candidate;break;}}}
    let title='',picture='',description='';
    if(entry.kind==='hero'){const id=entry.id;title=`${stars(D.byId[id].stars)}角色 · ${D.byId[id].name}`;picture=heroImage(id);description=grantHero(id);}
    else if(entry.kind==='fragment'||entry.kind==='wish'){const id=entry.kind==='wish'?profile.wish:entry.id;title=`${D.byId[id].name}碎片 × ${entry.count}`;picture=`<div class="shard"></div>${heroImage(id)}`;description=grantFragments(id,entry.count);}
    else if(entry.kind==='item'){const item=itemById[entry.id];profile.items[item.id]++;title=item.name;picture=itemImage(item.id);description=`获得 1 件。${item.effect}`;}
    else{profile.dust+=entry.count;title=`星尘 × ${entry.count}`;picture='<img src="assets/icon.svg" alt="星尘奖励">';description=`获得 ${entry.count} 永久星尘，可用于培养、道具与抽奖。`;}
    const bonus=profile.recruits%5===0?grantFragments(profile.wish,6):'';
    save();renderRecruit();tone(820,.17);
    openModal(novice?'新手固定抽奖奖励':'抽奖结果',`<div class="loot-box">${picture}<h3>${title}</h3><p>${description}</p></div>${bonus?`<p class="detail-note">累计第 ${profile.recruits} 抽的额外奖励：${bonus}</p>`:''}<p class="muted">奖励已保存。新角色在队伍有空位时自动加入出战准备；碎片足够后可在伙伴详情中合成。</p>`,[{label:'领取并关闭',kind:'primary',run:closeModal},{label:'查看伙伴与培养',run:()=>{closeModal();show('roster');}}]);
    setTimeout(()=>{recruitBusy=false;},500);
  }

  function tone(frequency,duration) {
    if(!profile.sound)return;
    try{audioContext=audioContext||new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=frequency;g.gain.setValueAtTime(.045,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration);}catch(_){}
  }

  function settings() {
    openModal('游戏设置',`<p>进度保存在当前浏览器、当前网址中。独立包与作品集网址的存档互不覆盖，需要迁移时请导出再导入。</p><div class="settings-grid">${button(profile.sound?'轻音效：开启':'轻音效：关闭','sound')}${button('重看开场','replay-intro')}${button('导出存档','export')}${button('导入存档','import')}${button('玩法说明','help')}${button('金币、星尘怎么获得','currencies')}</div><p class="detail-note">新版开放十关，保留旧版伙伴、培养、库存和资源。旧版尚未结束的战斗不沿用原波次，请重新布阵，体验新的连续进攻规则。</p>`,[{label:'返回游戏',kind:'primary',run:closeModal}]);
  }

  function help() {
    openModal('玩法、成长与通关规则',`<h3>不用逐波点击的塔防</h3><p>十关全部开放。携带最多四种伙伴进入后，有十二秒初始布阵时间，然后怪物会自动、持续进入。每只之间有间隔，新一波不会等待前一波全部消灭。最后一波也打完后才结算，没有生存倒计时。</p><p>点岸边加号部署伙伴，同一种可以放置多个。点击已部署伙伴查看射程、战斗升级、目标优先级或出售。金币不足时可以等工坊生产、击败敌人或波次补给。</p><h3>免费金币工坊</h3><p>每关自带一座，不需要抽奖、不占出战名额。每 6 秒生产 ${D.economy.workshopIncome[1]} 金币，花 ${D.economy.workshopUpgrade.slice(1,3).join(" / ")} 金币升级到每 6 秒 ${D.economy.workshopIncome.slice(2).join(" / ")} 金币。自动收取，暂停与两倍速对生产和战斗统一生效。</p><h3>伙伴获得与培养</h3><p>免费初始伙伴是萤巡。其他伙伴通过抽奖获得，新手前两抽固定给露米、烬团。击败怪物和通关获得星尘，可培养伙伴、抽奖和购买道具。每关首通、首次三星与名录奖励提供抽奖券。</p><p>星级固定一至五星；永久培养上限 Lv.5；当局升级最高 III 阶。三个概念分开。高星角色更强但也更贵，低星角色适合迅速铺开火力。</p><h3>通关与星级</h3><p>清除全部敌人并保住莲花即通关。满血十分得三星，七至九点得二星，一至六点得一星。零点失败，保留永久星尘和培养，只重置当局金币与布阵。</p><p class="detail-note">键盘 1–4 选伙伴，空格暂停 / 继续，Esc 取消瞄准或暂停。最多携带两件道具，成功使用才消耗。支持一倍 / 两倍速和全屏。</p>`,[{label:'资源获取说明',run:currencies},{label:'明白了',kind:'primary',run:closeModal}]);
  }

  function exportSave() {
    save();
    const blob=new Blob([JSON.stringify(profile,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`dream-guardians-save-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('存档已导出；换浏览器或独立包时可以导入。');
  }

  function playIntro() {
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){profile.introSeen=true;save();return;}
    const ids=[profile.favorite,...Object.keys(profile.owned).filter(id=>id!==profile.favorite)].slice(0,4);
    $('intro-cast').innerHTML=ids.map((id,i)=>heroImage(id,'',`style="--delay:${.35+i*.38}s"`)).join('');
    $('intro').hidden=false;
    clearTimeout(introTimer);introTimer=setTimeout(skipIntro,4900);
  }

  function skipIntro(){clearTimeout(introTimer);$('intro').hidden=true;profile.introSeen=true;save();}

  const actions = {
    home:()=>show('home'),map:()=>show('map'),roster:()=>show('roster'),recruit:()=>show('recruit'),continue:continueBattle,
    settings,help,currencies,'skip-intro':skipIntro,
    'replay-intro':()=>{closeModal();paused=true;show('home');playIntro();},
    sound:()=>{profile.sound=!profile.sound;save();tone(600,.12);settings();},
    export:exportSave,import:()=>{$('import-save').value='';$('import-save').click();},
    prepare:el=>prepare(Number(el.dataset.index)),
    squad:el=>{const id=el.dataset.id;if(!profile.owned[id])return;if(prepareSquad.includes(id)){if(prepareSquad.length===1){toast('至少带上一位伙伴。');return;}prepareSquad=prepareSquad.filter(x=>x!==id);}else{if(prepareSquad.length>=4){toast('每次携带最多四种伙伴，先取消一位再替换。');return;}prepareSquad.push(id);}prepare(prepareIndex,false);},
    pack:el=>{const id=el.dataset.id,total=Object.values(prepareCarry).reduce((a,b)=>a+b,0);if(prepareCarry[id]&& (total>=2||prepareCarry[id]>=profile.items[id]))prepareCarry[id]=0;else if(total<2&&prepareCarry[id]<profile.items[id])prepareCarry[id]++;else toast('随身口袋只有两个位置。');prepare(prepareIndex,false);},
    'select-hero':el=>{if(!battle.loadout.includes(el.dataset.id))return;selectedHero=el.dataset.id;aimItem=null;sideKey='';refreshBattle();},
    build:()=>{if(battle&&selectedPad!==null&&battle.build(selectedPad,selectedHero)){tone(520,.06);save();refreshBattle();}},
    upgrade:()=>{const t=battle?.towers.find(t=>t.pad===selectedPad);if(t&&battle.upgrade(t.id)){tone(690,.08);save();refreshBattle();}},
    'upgrade-workshop':()=>{if(battle?.upgradeWorkshop()){tone(680,.09);save();sideKey='';refreshBattle();}},
    sell:()=>{const t=battle?.towers.find(t=>t.pad===selectedPad);if(t&&battle.result==='playing'){battle.sell(t.id);save();refreshBattle();}},
    priority:()=>{const t=battle?.towers.find(t=>t.pad===selectedPad);if(t){t.priority=t.priority==='strong'?'first':'strong';save();refreshBattle();}},
    'clear-pad':()=>{if(battle?.result==='playing'){battle.focus=battle.focus===selectedPad?null:selectedPad;save();refreshBattle();}},
    pause:()=>{if(battle?.result==='playing'){paused=!paused;accumulator=0;save();refreshBattle();}},
    speed:()=>{speed=speed===1?2:1;refreshBattle();},
    'next-wave':()=>{if(battle?.result==='playing'&&!battle.started){paused=false;battle.beginWave();save();refreshBattle();}},
    fullscreen:()=>{const el=$('battle-layout');if(document.fullscreenElement){document.exitFullscreen?.();}else if(el?.requestFullscreen){el.requestFullscreen().catch(()=>toast('浏览器暂不支持全屏，可使用横屏游玩。'));}else toast('此浏览器不支持页面全屏，可将设备转为横屏。');},
    'use-item':el=>useItem(el.dataset.id),
    filter:el=>{rosterFilter=el.dataset.id;renderRoster();},
    'hero-detail':el=>heroDetail(el.dataset.id),
    'enemy-detail':el=>enemyDetail(el.dataset.id),
    'buy-item':el=>buyItem(el.dataset.id),
    'prize-item':el=>{const item=itemById[el.dataset.id];if(item)openModal(item.name,`<div class="result-art">${itemImage(item.id)}</div><p>${item.story}</p><p class="detail-note">${item.effect}</p><p>抽奖概率：3.4%。也可在商店以 ${item.price} 星尘购买。当前库存 ${profile.items[item.id]} 件。</p>`,[{label:'关闭',kind:'primary',run:closeModal}]);},
    'pool-scroll':()=>{$('prize-pool')?.scrollIntoView({behavior:'smooth',block:'start'});},
    wish:el=>{const id=el.dataset.id;if(!D.wishIds.includes(id)||id===profile.wish)return;profile.wish=id;save();renderRecruit();toast(`心愿碎片目标改为${D.byId[id].name}，旧碎片保留。`);},
    'recruit-stamp':()=>confirmRecruit('stamps'),'recruit-dust':()=>confirmRecruit('dust'),probabilities
  };

  document.addEventListener('click',event=>{
    const modalButton=event.target.closest('[data-modal-action]');
    if(modalButton&&!modalButton.disabled){const action=modalActions[Number(modalButton.dataset.modalAction)];if(action&&!action.disabled)action.run();return;}
    const nav=event.target.closest('[data-nav]');if(nav){closeModal();show(nav.dataset.nav);return;}
    const target=event.target.closest('[data-action]');if(target&&!target.disabled&&actions[target.dataset.action])actions[target.dataset.action](target);
  });
  $('modal-close').addEventListener('click',closeModal);
  $('modal').addEventListener('cancel',event=>{event.preventDefault();closeModal();});
  $('import-save').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    if(file.size>2000000){toast('存档文件过大，请选择本游戏导出的 JSON 文件。');return;}
    try{const imported=normalize(JSON.parse(await file.text()));openModal('用这份存档继续旅途？',`<p>文件：${esc(file.name)}</p><p>已通关 ${Object.keys(imported.clears).length} 幕，拥有 ${Object.keys(imported.owned).length} 位伙伴与 ${imported.dust} 星尘。</p><p class="detail-note">导入会替换此浏览器当前游戏的进度，不影响作品集中的其他小游戏。建议先导出当前存档。</p>`,[{label:'取消',run:closeModal},{label:'先导出当前存档',run:exportSave},{label:'确认替换',kind:'primary',run:()=>{modalResume=false;closeModal();battle=null;paused=true;profile=imported;save();show('home');toast('存档已导入，可以继续旅途。');}}]);}catch(error){toast(`未导入：${error.message}`);}
  });
  document.addEventListener('keydown',event=>{
    if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')||event.ctrlKey||event.metaKey||event.altKey)return;
    if(event.key==='Escape'){
      if(!$('intro').hidden){skipIntro();return;}
      if($('modal').open)return;
      if(aimItem){aimItem=null;toast('已收起星火瓶。');return;}
      if(view==='battle'&&battle?.result==='playing'){paused=true;save();refreshBattle();}return;
    }
    if(view!=='battle'||$('modal').open||!battle||!$('intro').hidden)return;
    if(['1','2','3','4'].includes(event.key)){const id=battle.loadout[Number(event.key)-1];if(id){selectedHero=id;sideKey='';refreshBattle();}}
    if(event.code==='Space'&&!event.repeat){event.preventDefault();actions.pause();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){paused=true;save();refreshBattle();}});
  window.addEventListener('pagehide',save);
  window.addEventListener('message',event=>{
    if(event.source!==window.parent||event.origin!==window.location.origin||!event.data||typeof event.data!=='object')return;
    const action=event.data.action||event.data.type;
    if(action==='pause'||action==='game-pause'){hostPaused=!paused;paused=true;save();refreshBattle();}
    if((action==='resume'||action==='game-resume')&&hostPaused){hostPaused=false;if(view==='battle'&&!$('modal').open&&!document.hidden)paused=false;}
  });

  function frame(now) {
    const elapsed=Math.min(.1,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
    if(view==='battle'&&battle){
      if(!paused&&!document.hidden&&!$('modal').open&&battle.result==='playing'){
        accumulator+=elapsed*speed;
        let steps=0;
        while(accumulator>=1/60&&steps<12&&battle.result==='playing'){battle.update(1/60);accumulator-=1/60;steps++;}
        if(steps===12)accumulator=Math.min(accumulator,1/60);
      }else accumulator=0;
      if(canvas)R.draw(canvas,battle,selectedPad,aimItem);
      if(now-lastHud>120){refreshBattle();lastHud=now;}
      if(now-lastSave>3000){save();lastSave=now;}
    }
    requestAnimationFrame(frame);
  }

  async function boot() {
    profile=loadProfile();updateWallet();
    $('wallet-dust').parentElement.title='永久星尘：击败怪物与通关获得，用于培养、道具与抽奖';
    $('wallet-stamps').parentElement.title='抽奖券：新手、首通、三星、名录奖励与通关随机掉落；连续三次未掉后下次通关必掉';
    document.querySelector('[data-nav="recruit"]').textContent='抽奖';
    $('wallet-stamps').parentElement.insertAdjacentHTML('afterend',button('资源说明','currencies','','wallet-help'));
    const failed=await A.load();
    show('home');
    if(failed.length)toast(location.protocol==='file:'?'请通过「启动游戏.cmd」打开游戏，以正确加载独立角色素材。':`部分插画没有载入，暂用备用形象：${failed.join('、')}`);
    if(!profile.introSeen)playIntro();
    requestAnimationFrame(frame);
    if(Number(location.port)>=8877&&Number(location.port)<=8886)setInterval(()=>fetch('__heartbeat',{cache:'no-store'}).catch(()=>{}),60000);
  }
  boot().catch(error=>{$('view').innerHTML=`<section class="page-heading"><div><p class="eyebrow">A LITTLE PAUSE</p><h1>画境暂时没有打开</h1><p>${esc(error.message)}</p><p>请从独立包中的「启动游戏.cmd」进入，或通过作品集里的游戏入口打开。你的原存档不会在这里被删除。</p></div></section>`;});
})();

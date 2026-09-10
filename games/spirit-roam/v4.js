(function () {
  'use strict';

  const E = window.SpiritEngine;
  if (!E || !E.Game || window.__spiritRoamV4) return;
  window.__spiritRoamV4 = true;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'v4.css?v=4.10';
  document.head.appendChild(css);

  const META_KEY = 'portfolio.spirit-roam.progress.v4';
  const LEVELS = [
    { name: '星芽庭院', title: '清理拦路者', kind: 'kills', target: 6, limit: 220, reward: 24, detail: '击败 6 只影兽，点亮出口。' },
    { name: '珍珠浅滩', title: '星光采集', kind: 'gems', target: 20, limit: 245, reward: 30, detail: '收集 20 枚粉色星光，潮汐会改变落脚点。' },
    { name: '翡翠林冠', title: '遗物搜寻', kind: 'keepsakes', target: 3, limit: 260, reward: 38, detail: '走上高处，找齐 3 件精灵遗物。' },
    { name: '水晶峡谷', title: '精英追猎', kind: 'elites', target: 3, limit: 275, reward: 48, detail: '击败 3 只带光环的精英影兽。' },
    { name: '琥珀潮汐', title: '点亮航标', kind: 'seals', target: 5, limit: 290, reward: 56, detail: '穿越涨落的平台，依次点亮 5 座航标。' },
    { name: '月影渡口', title: '终幕守门者', kind: 'boss', target: 1, limit: 330, reward: 90, detail: '搭乘月影渡船，击败出口前的巨型守门者。' }
  ];

  const CATALOG = [
    {
      id: 'vitality', name: '生命芽', type: 'upgrade', max: 3, prices: [80, 140, 220],
      description: '让旅伴每次出发时拥有更多生命。适合容易被怪物连续碰到，或正在练习跳跃的玩家。',
      effect: level => level ? '当前效果：最大生命增加 ' + (level * 12) + ' 点' : '当前效果：尚未强化',
      next: '购买后，每局多 12 点生命'
    },
    {
      id: 'power', name: '勇气结晶', type: 'upgrade', max: 3, prices: [90, 160, 250],
      description: '让按下 J 或 X 发射的晶光更有力量，可以用更少的攻击次数击败怪物。',
      effect: level => level ? '当前效果：每次攻击增加 ' + (level * 4) + ' 点伤害' : '当前效果：尚未强化',
      next: '购买后，每次攻击多 4 点伤害'
    },
    {
      id: 'magnet', name: '星光罗盘', type: 'upgrade', max: 3, prices: [60, 110, 180],
      description: '靠近粉色星光时自动把它吸过来，不需要让角色精准碰到星光。',
      effect: level => level ? '当前效果：星光吸取距离增加 ' + (level * 18) + ' 像素' : '当前效果：尚未强化',
      next: '购买后，附近星光更容易收集'
    },
    {
      id: 'shield', name: '启程护盾', type: 'item', max: 5, price: 35,
      description: '购买后存进行囊。下一次开始关卡时自动使用，前 6 秒受到攻击不会扣血。',
      effect: count => '当前持有：' + count + ' 个',
      next: '消耗品，每开始一局自动使用 1 个'
    },
    {
      id: 'revive', name: '回声羽毛', type: 'item', max: 3, price: 75,
      description: '购买后存进行囊。下一局生命变为 0 时自动复苏，恢复 45% 生命并获得短暂保护。',
      effect: count => '当前持有：' + count + ' 个',
      next: '消耗品，每局最多自动复苏 1 次'
    }
  ];

  const COMPANIONS = {
    '03': {
      name: '慢拍',
      personality: '温柔慢热、观察力很强。它不着急抢第一名，更在意大家有没有安全抵达。',
      habit: '到一个新地方，会先数完三片叶子，再认真记住回去的路。',
      hobby: '喜欢收集雨声、晒暖石头，也会把漂亮的小路画进旅行本。',
      journey: '适合慢慢看清平台与怪物动作，再稳稳向前。'
    },
    '04': {
      name: '棱棱',
      personality: '嘴上逞强、心里很软。遇到危险时总是第一个冲过去，又假装只是顺路。',
      habit: '每天出发前都会擦亮额头的小晶角，把路线画在叶片背面。',
      hobby: '喜欢和风比赛、整理彩色石子，还偷偷给伙伴准备备用绷带。',
      journey: '喜欢快速判断路线，用干脆的跳跃穿过危险区域。'
    },
    '09': {
      name: '贝眠',
      personality: '安静、细腻，很会照顾别人的心情。即使害怕，也会轻声提醒伙伴别担心。',
      habit: '中午一定要小睡一会儿，醒来后会把今天的好心情藏进贝壳。',
      hobby: '喜欢听潮水、捡小贝壳、讲睡前故事，也擅长发现不起眼的隐藏角落。',
      journey: '喜欢探索支路和高处，常常能发现别人错过的遗物。'
    },
    '10': {
      name: '星啾',
      personality: '好奇、乐观、精力充沛。看到任何发光的东西都会想再靠近一点。',
      habit: '每天晚上给星星点名，早晨用三次小跳确认自己已经完全醒来。',
      hobby: '喜欢画星座、追发光的小虫、给新发现取名字，还会把笑话讲给月亮听。',
      journey: '喜欢主动收集星光，在连续跳跃中寻找更明亮的路线。'
    },
    '12': {
      name: '晶甲',
      personality: '沉稳可靠、很有责任感。话不多，但总会走在队伍最后确认大家都在。',
      habit: '睡前检查护甲和行囊，把松动的扣子一颗颗重新系好。',
      hobby: '喜欢修理小工具、培育软软的苔藓，也会替伙伴制作结实的护身符。',
      journey: '面对怪物时更愿意保持距离、看准时机，再保护大家通过。'
    }
  };

  function itemIcon(id) {
    const common = 'viewBox="0 0 64 64" aria-hidden="true" focusable="false"';
    const icons = {
      vitality: '<svg ' + common + '><path class="icon-soft" d="M32 55C18 47 10 38 10 25c0-8 5-14 13-14 5 0 8 3 9 7 2-4 5-7 10-7 8 0 13 6 13 14 0 13-9 22-23 30Z"/><path class="icon-line" d="M32 47V26m0 8c-8-1-13-5-14-11 8-1 13 3 14 11Zm0-2c7-1 11-5 12-10-7-1-11 3-12 10Z"/></svg>',
      power: '<svg ' + common + '><path class="icon-soft" d="m32 6 20 15-8 29-12 8-12-8-8-29L32 6Z"/><path class="icon-line" d="m32 6-7 20 7 32m0-52 8 20-8 32M12 21l13 5h15l12-5M20 50l12-9 12 9"/><path class="icon-spark" d="m51 8 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"/></svg>',
      magnet: '<svg ' + common + '><circle class="icon-soft" cx="32" cy="32" r="23"/><circle class="icon-line" cx="32" cy="32" r="17"/><path class="icon-line" d="m32 13 5 14 14 5-14 5-5 14-5-14-14-5 14-5 5-14Z"/><circle class="icon-spark" cx="32" cy="32" r="4"/></svg>',
      shield: '<svg ' + common + '><path class="icon-soft" d="M32 6c8 6 15 8 23 9v16c0 14-8 22-23 28C17 53 9 45 9 31V15c8-1 15-3 23-9Z"/><path class="icon-line" d="M32 13v37c10-5 16-10 16-20V20c-6-1-11-3-16-7Z"/><path class="icon-spark" d="m29 25 3-7 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/></svg>',
      revive: '<svg ' + common + '><path class="icon-soft" d="M49 7C31 10 17 21 13 43c10 5 23 2 31-8 7-9 7-19 5-28Z"/><path class="icon-line" d="M10 57c9-17 20-29 37-43M19 42c4-1 8 0 12 3m-4-13c5-1 9 0 13 3m-4-14c4 0 7 1 10 3"/><path class="icon-spark" d="m16 13 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"/></svg>'
    };
    return icons[id] || '';
  }

  function safeNumber(value, fallback) {
    value = Number(value);
    return Number.isFinite(value) ? value : fallback;
  }

  function cleanMeta(raw) {
    raw = raw && typeof raw === 'object' ? raw : {};
    const upgrades = raw.upgrades && typeof raw.upgrades === 'object' ? raw.upgrades : {};
    const inventory = raw.inventory && typeof raw.inventory === 'object' ? raw.inventory : {};
    return {
      starlight: Math.max(0, Math.floor(safeNumber(raw.starlight, 60))),
      upgrades: {
        vitality: Math.max(0, Math.min(3, Math.floor(safeNumber(upgrades.vitality, 0)))),
        power: Math.max(0, Math.min(3, Math.floor(safeNumber(upgrades.power, 0)))),
        magnet: Math.max(0, Math.min(3, Math.floor(safeNumber(upgrades.magnet, 0))))
      },
      inventory: {
        shield: Math.max(0, Math.min(5, Math.floor(safeNumber(inventory.shield, 0)))),
        revive: Math.max(0, Math.min(3, Math.floor(safeNumber(inventory.revive, 0))))
      },
      earned: Math.max(0, Math.floor(safeNumber(raw.earned, 0))),
      spent: Math.max(0, Math.floor(safeNumber(raw.spent, 0)))
    };
  }

  function loadMeta() {
    try { return cleanMeta(JSON.parse(localStorage.getItem(META_KEY) || 'null')); }
    catch (error) { return cleanMeta(null); }
  }

  function saveMeta(meta) {
    localStorage.setItem(META_KEY, JSON.stringify(cleanMeta(meta)));
    updateWallet();
  }

  function countKeepsakes(value) {
    if (typeof value === 'number') return value;
    if (Array.isArray(value)) return value.length;
    if (value && typeof value.size === 'number') return value.size;
    return 0;
  }

  function pushEvent(game, event) {
    if (Array.isArray(game.events)) game.events.push(event);
  }

  function showToast(message, tone) {
    let toast = document.getElementById('v4-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'v4-toast';
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.dataset.tone = tone || '';
    toast.classList.remove('is-visible');
    void toast.offsetWidth;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  const BaseGame = E.Game;

  class PurposefulGame extends BaseGame {
    constructor(index, hero) {
      super(index, hero);
      this.v4Le4el = Math.max(0, Math.min(LEVELS.length - 1, Number(index) || 0));
      this.v4Mission = LEVELS[this.v4Le4el];
      this.v4GemPickups = 0;
      this.v4EliteKills = 0;
      this.v4BossKills = 0;
      this.v4Seals = new Set();
      this.v4Settled = false;
      this.v4Reward = 0;
      this.v4GoalMessageAt = 0;
      this.lossReason = '';

      const meta = loadMeta();
      this.v4Upgrades = Object.assign({}, meta.upgrades);
      this.v4Re4i4eA4ailable = meta.inventory.revive > 0;
      this.v4Re4i4eUsed = false;
      if (meta.inventory.revive > 0) meta.inventory.revive -= 1;
      if (meta.inventory.shield > 0) {
        meta.inventory.shield -= 1;
        if (this.player) this.player.shield = Math.max(safeNumber(this.player.shield, 0), 6);
      }
      saveMeta(meta);

      if (this.player) {
        const hpBonus = this.v4Upgrades.vitality * 12;
        this.player.maxHp = safeNumber(this.player.maxHp, 100) + hpBonus;
        this.player.hp = Math.min(this.player.maxHp, safeNumber(this.player.hp, 100) + hpBonus);
      }

      this.v4TuneWorld();
      window.__spiritV4Game = this;
      setTimeout(() => {
        showToast(this.v4Mission.title + '：' + this.v4Mission.detail, 'mission');
        updateMissionPanel();
      }, 80);
    }

    v4TuneWorld() {
      const stage = this.v4Le4el;
      const hpScale = 1 + stage * 0.09;
      if (Array.isArray(this.enemies)) {
        this.enemies.forEach(enemy => {
          enemy.maxHp = Math.ceil(safeNumber(enemy.maxHp, safeNumber(enemy.hp, 40)) * hpScale);
          enemy.hp = enemy.maxHp;
          if (typeof enemy.speed === 'number') enemy.speed *= 1 + stage * 0.025;
          if (typeof enemy.vx === 'number') enemy.vx *= 1 + stage * 0.025;
        });
        if (stage === 5 && this.enemies.length) {
          this.v4Boss = this.enemies.reduce((rightmost, enemy) => safeNumber(enemy.x, 0) > safeNumber(rightmost.x, 0) ? enemy : rightmost, this.enemies[0]);
          this.v4Boss.tier = 3;
          this.v4Boss.maxHp = Math.ceil(safeNumber(this.v4Boss.maxHp, 80) * 3.1);
          this.v4Boss.hp = this.v4Boss.maxHp;
          this.v4Boss.isV4Boss = true;
        }
      }
      if (Array.isArray(this.items)) {
        let gemIndex = 0;
        let healCount = 0;
        let shieldCount = 0;
        this.items = this.items.filter(item => {
          if (item.type === 'gem') {
            gemIndex += 1;
            return gemIndex % 3 === 1;
          }
          if (item.type === 'heal') {
            healCount += 1;
            return healCount <= 3;
          }
          if (item.type === 'shield') {
            shieldCount += 1;
            return shieldCount <= 2;
          }
          return true;
        });
      }
    }

    v4MissionProgress() {
      const mission = this.v4Mission;
      if (mission.kind === 'kills') return safeNumber(this.kills, 0);
      if (mission.kind === 'gems') return this.v4GemPickups;
      if (mission.kind === 'keepsakes') return countKeepsakes(this.keepsakes);
      if (mission.kind === 'elites') return this.v4EliteKills;
      if (mission.kind === 'seals') return this.v4Seals.size;
      if (mission.kind === 'boss') return this.v4BossKills;
      return 0;
    }

    v4MissionComplete() {
      return this.v4MissionProgress() >= this.v4Mission.target;
    }

    v4TryRe4i4e() {
      if (this.status !== 'lost' || !this.v4Re4i4eA4ailable || this.v4Re4i4eUsed) return false;
      this.v4Re4i4eUsed = true;
      this.v4Re4i4eA4ailable = false;
      this.status = 'playing';
      if (this.player) {
        this.player.hp = Math.max(1, Math.ceil(safeNumber(this.player.maxHp, 100) * 0.45));
        this.player.invuln = Math.max(safeNumber(this.player.invuln, 0), 2);
        this.player.shield = Math.max(safeNumber(this.player.shield, 0), 2);
        this.player.vx = 0;
        this.player.vy = 0;
      }
      pushEvent(this, { type: 'v4Re4i4e' });
      showToast('回声羽毛唤回了精灵，生命恢复 45%', 'good');
      return true;
    }

    damagePlayer(amount) {
      const args = Array.prototype.slice.call(arguments, 1);
      const stageScale = 1 + this.v4Le4el * 0.1;
      const result = super.damagePlayer.apply(this, [Math.ceil(safeNumber(amount, 1) * stageScale)].concat(args));
      if (this.player && this.player.invuln > 0.82) this.player.invuln = 0.82;
      this.v4TryRe4i4e();
      return result;
    }

    respawn() {
      const result = super.respawn.apply(this, arguments);
      this.v4TryRe4i4e();
      return result;
    }

    damageEnemy(enemy, amount) {
      const args = Array.prototype.slice.call(arguments, 2);
      return super.damageEnemy.apply(this, [enemy, safeNumber(amount, 0) + this.v4Upgrades.power * 4].concat(args));
    }

    update(dt) {
      const beforeGems = safeNumber(this.gems, 0);
      const beforeKills = safeNumber(this.kills, 0);
      const beforeEnemies = Array.isArray(this.enemies) ? this.enemies.slice() : [];

      if (this.player && Array.isArray(this.items) && this.v4Upgrades.magnet > 0) {
        const radius = 42 + this.v4Upgrades.magnet * 18;
        const px = safeNumber(this.player.x, 0) + safeNumber(this.player.w, 24) / 2;
        const py = safeNumber(this.player.y, 0) + safeNumber(this.player.h, 34) / 2;
        this.items.forEach(item => {
          if (item.type !== 'gem') return;
          const ix = safeNumber(item.x, 0) + safeNumber(item.w, 18) / 2;
          const iy = safeNumber(item.y, 0) + safeNumber(item.h, 18) / 2;
          if (Math.hypot(px - ix, py - iy) <= radius) {
            item.x = px - safeNumber(item.w, 18) / 2;
            item.y = py - safeNumber(item.h, 18) / 2;
          }
        });
      }

      const result = super.update(dt);
      const rawGemGain = Math.max(0, safeNumber(this.gems, 0) - beforeGems);
      if (rawGemGain) this.v4GemPickups += rawGemGain;

      const killGain = Math.max(0, safeNumber(this.kills, 0) - beforeKills);
      if (killGain) {
        const bounty = killGain * (2 + Math.floor(this.v4Le4el / 2));
        this.gems = safeNumber(this.gems, 0) + bounty;
        pushEvent(this, { type: 'v4Bounty', amount: bounty });
      }

      if (beforeEnemies.length && Array.isArray(this.enemies)) {
        const removed = beforeEnemies.filter(enemy => this.enemies.indexOf(enemy) === -1 && (safeNumber(enemy.hp, 0) <= 0 || enemy.dead));
        removed.forEach(enemy => {
          if (safeNumber(enemy.tier, 1) >= 2) this.v4EliteKills += 1;
          if (enemy === this.v4Boss || enemy.isV4Boss) this.v4BossKills = 1;
        });
      }

      if (this.v4Mission.kind === 'seals' && this.player) {
        const worldEnd = Math.max(this.goal ? safeNumber(this.goal.x, 0) : 0, 1);
        const ratio = Math.max(0, Math.min(1, safeNumber(this.player.x, 0) / worldEnd));
        [0.16, 0.34, 0.53, 0.72, 0.9].forEach((point, index) => {
          if (ratio >= point && !this.v4Seals.has(index)) {
            this.v4Seals.add(index);
            showToast('航标 ' + this.v4Seals.size + '/5 已点亮', 'good');
          }
        });
      }

      if (this.status === 'won' && !this.v4MissionComplete()) {
        this.status = 'playing';
        if (this.player) {
          this.player.x = Math.max(0, safeNumber(this.player.x, 0) - 56);
          this.player.vx = -180;
        }
        const now = Date.now();
        if (now - this.v4GoalMessageAt > 1400) {
          this.v4GoalMessageAt = now;
          showToast('出口尚未开启：' + this.v4Mission.title + ' ' + Math.min(this.v4MissionProgress(), this.v4Mission.target) + '/' + this.v4Mission.target, 'warning');
        }
      }

      if (this.status === 'playing' && safeNumber(this.time, 0) >= this.v4Mission.limit) {
        this.lossReason = 'timeout';
        this.status = 'lost';
        showToast('星路正在闭合，本次探索超时', 'danger');
      }

      this.v4TryRe4i4e();
      if ((this.status === 'won' || this.status === 'lost') && !this.v4Settled) this.v4Settle();
      updateMissionPanel();
      return result;
    }

    v4Settle() {
      this.v4Settled = true;
      const won = this.status === 'won';
      let rating = 0;
      if (won && typeof E.stars === 'function') {
        try { rating = safeNumber(E.stars(this.time, this.level), 0); } catch (error) { rating = 0; }
      }
      const runLight = Math.max(0, Math.floor(safeNumber(this.gems, 0)));
      const reward = won ? runLight + this.v4Mission.reward + rating * 5 : Math.floor(runLight * 0.25);
      const meta = loadMeta();
      meta.starlight += reward;
      meta.earned += reward;
      saveMeta(meta);
      this.v4Reward = reward;

      setTimeout(() => {
        const stats = document.getElementById('result-stats');
        if (stats && !stats.querySelector('[data-v4-reward]')) {
          const line = document.createElement('span');
          line.dataset.v4Reward = 'true';
          line.className = 'v4-result-reward';
          line.textContent = (won ? '本局获得 ' : '失败保留 ') + reward + ' 星光 · 当前余额 ' + meta.starlight;
          stats.appendChild(line);
        }
        if (!won && this.lossReason === 'timeout') {
          const copy = document.getElementById('result-copy');
          if (copy) copy.textContent = '星路闭合前没有完成任务。强化能力、调整路线，再试一次。';
        }
      }, 0);
    }
  }

  E.Game = PurposefulGame;

  function ensureMissionPanel() {
    if (document.getElementById('v4-mission-panel')) return;
    const panel = document.createElement('section');
    panel.id = 'v4-mission-panel';
    panel.hidden = true;
    panel.innerHTML = '<div class="v4-mission-head"><span>本关任务</span><b id="v4-mission-time">--:--</b></div><strong id="v4-mission-title">等待启程</strong><div class="v4-mission-track"><i id="v4-mission-fill"></i></div><small id="v4-mission-copy">完成任务后出口才会开启</small>';
    document.body.appendChild(panel);
  }

  function updateMissionPanel() {
    ensureMissionPanel();
    const panel = document.getElementById('v4-mission-panel');
    const game = window.__spiritV4Game;
    if (!panel || !game || game.status !== 'playing') {
      if (panel) panel.hidden = true;
      return;
    }
    panel.hidden = false;
    const mission = game.v4Mission;
    const progress = Math.min(game.v4MissionProgress(), mission.target);
    const remaining = Math.max(0, Math.ceil(mission.limit - safeNumber(game.time, 0)));
    document.getElementById('v4-mission-time').textContent = Math.floor(remaining / 60) + ':' + String(remaining % 60).padStart(2, '0');
    document.getElementById('v4-mission-title').textContent = mission.title + '  ' + progress + '/' + mission.target;
    document.getElementById('v4-mission-copy').textContent = game.v4MissionComplete() ? '任务完成，出口已开启' : mission.detail;
    document.getElementById('v4-mission-fill').style.width = Math.min(100, progress / mission.target * 100) + '%';
    panel.classList.toggle('is-complete', game.v4MissionComplete());
  }

  function ensureShop() {
    if (document.getElementById('v4-shop')) return;
    const rail = document.querySelector('.utility-rail');
    if (rail) {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'open-shop';
      button.innerHTML = '<span class="v4-rail-symbol">✦</span><b>星光商店</b><small>SHOP</small>';
      rail.appendChild(button);
    }

    const wallet = document.createElement('button');
    wallet.type = 'button';
    wallet.id = 'v4-wallet';
    wallet.setAttribute('aria-label', '打开星光商店');
    wallet.innerHTML = '<span>✦</span><b id="v4-wallet-value">0</b><small>可用星光</small>';
    const progress = document.getElementById('journey-progress');
    if (progress && progress.parentNode) {
      progress.insertAdjacentElement('afterend', wallet);
      const note = document.createElement('p');
      note.className = 'v4-wallet-note';
      note.textContent = '粉色星光是旅行货币。通关后存入余额，点击这里兑换能力和保命道具。';
      wallet.insertAdjacentElement('afterend', note);
    }

    const modal = document.createElement('section');
    modal.id = 'v4-shop';
    modal.className = 'v4-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'v4-shop-title');
    modal.innerHTML =
      '<div class="v4-modal-backdrop" data-close-shop></div>' +
      '<div class="v4-shop-card"><header class="v4-shop-header"><div><small>能力与道具商店</small><h2 id="v4-shop-title">星光工坊</h2><p>把旅途中收集的粉色星光，兑换成下一次出发时真正能用到的能力。</p></div><button type="button" class="v4-shop-close" data-close-shop aria-label="关闭">×</button></header>' +
      '<div class="v4-shop-balance"><span>可用星光</span><strong><i>✦</i> <b id="v4-shop-balance">0</b></strong><small>通关保留本局全部星光，并获得任务与星级奖励；失败仅保留 25%。</small></div>' +
      '<div class="v4-shop-guide"><article><b>星光是什么？</b><p>关卡里漂浮的粉色菱形就是星光。捡到它或击败怪物，都能增加本局星光。</p></article><article><b>什么时候存下来？</b><p>完成任务并抵达出口后，本局星光会全部进入余额；失败时只带回四分之一。</p></article><article><b>为什么要花？</b><p>永久强化会让以后每一局都更轻松；护盾和羽毛只保护下一局，使用后会消耗。</p></article></div>' +
      '<h3 class="v4-shop-section-title">选择要兑换的能力</h3><div id="v4-shop-grid" class="v4-shop-grid"></div><footer><b>一局游戏应该这样玩</b><span>探索并收集星光 → 完成本关任务 → 抵达出口结算 → 回到工坊强化 → 再挑战更难的关卡</span></footer></div>';
    document.body.appendChild(modal);

    document.addEventListener('click', event => {
      const target = event.target;
      if (target.closest && (target.closest('#open-shop') || target.closest('#v4-wallet'))) openShop();
      if (target.closest && target.closest('[data-close-shop]')) closeShop();
      const buy = target.closest && target.closest('[data-buy]');
      if (buy) purchase(buy.dataset.buy);
    });
  }

  function renderShop() {
    const meta = loadMeta();
    const balance = document.getElementById('v4-shop-balance');
    if (balance) balance.textContent = meta.starlight;
    const grid = document.getElementById('v4-shop-grid');
    if (!grid) return;
    grid.innerHTML = CATALOG.map(item => {
      const value = item.type === 'upgrade' ? meta.upgrades[item.id] : meta.inventory[item.id];
      const soldOut = value >= item.max;
      const price = item.type === 'upgrade' ? item.prices[Math.min(value, item.prices.length - 1)] : item.price;
      const disabled = soldOut || meta.starlight < price;
      const rank = item.type === 'upgrade' ? ('等级 ' + value + '/' + item.max) : ('持有 ' + value + '/' + item.max);
      const effect = item.effect(value);
      const note = soldOut ? '已达到最高等级' : item.next;
      return '<article class="v4-shop-item"><div class="v4-item-icon" data-kind="' + item.id + '">' + itemIcon(item.id) + '</div><div class="v4-item-body"><div><h3>' + item.name + '</h3><span>' + rank + '</span></div><p>' + item.description + '</p><small>' + effect + '</small><em>' + note + '</em></div><button type="button" data-buy="' + item.id + '"' + (disabled ? ' disabled' : '') + '>' + (soldOut ? '已满级' : '<b>✦ ' + price + '</b><span>兑换</span>') + '</button></article>';
    }).join('');
  }

  function purchase(id) {
    const item = CATALOG.find(entry => entry.id === id);
    if (!item) return;
    const meta = loadMeta();
    const value = item.type === 'upgrade' ? meta.upgrades[id] : meta.inventory[id];
    if (value >= item.max) return;
    const price = item.type === 'upgrade' ? item.prices[value] : item.price;
    if (meta.starlight < price) {
      showToast('星光不足，继续探索或提高通关星级', 'warning');
      return;
    }
    meta.starlight -= price;
    meta.spent += price;
    if (item.type === 'upgrade') meta.upgrades[id] += 1;
    else meta.inventory[id] += 1;
    saveMeta(meta);
    renderShop();
    showToast(item.name + ' 已收入行囊', 'good');
  }

  function openShop() {
    const modal = document.getElementById('v4-shop');
    if (!modal) return;
    renderShop();
    modal.hidden = false;
    document.body.classList.add('v4-shop-open');
  }

  function closeShop() {
    const modal = document.getElementById('v4-shop');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('v4-shop-open');
  }

  function updateWallet() {
    const wallet = document.getElementById('v4-wallet-value');
    if (wallet) wallet.textContent = loadMeta().starlight;
  }

  function replaceText(root, from, to) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.nodeValue && node.nodeValue.indexOf(from) >= 0) node.nodeValue = node.nodeValue.replace(from, to);
    });
  }

  function enrichHelp() {
    const help = document.getElementById('help-dialog');
    if (!help) return;
    replaceText(help, '星级只按时间评定，无须消灭全部怪物。', '每关必须先完成独立任务，出口才会开启；更快完成仍可获得更高星级。');
    if (!help.querySelector('.v4-help-rules')) {
      const rules = document.createElement('section');
      rules.className = 'v4-help-rules';
      rules.innerHTML = '<h3>为什么要收集星光？</h3><p>粉色星光是永久货币。战斗、探索和通关都能获得星光，可以在「星光商店」强化生命、攻击和吸附范围，也能购买护盾与复苏道具。</p><h3>风险规则</h3><p>怪物接触伤害会随关卡提升，受伤后的无敌时间更短；治疗和护盾只在关键节点出现。超时、坠落或生命归零都会失败，失败只保留本局 25% 星光。</p>';
      help.appendChild(rules);
    }
  }

  function enrichMap() {
    const map = document.getElementById('map-dialog');
    if (!map || map.querySelector('.v4-map-missions')) return;
    const section = document.createElement('section');
    section.className = 'v4-map-missions';
    section.innerHTML = '<h3>六段旅程，六种目标</h3><div>' + LEVELS.map((level, index) => '<span><b>' + (index + 1) + '</b><i>' + level.title + '</i></span>').join('') + '</div><p>背景不再只是换色：搜集、探索高处、精英战、航标与首领战会逐关加入。</p>';
    map.appendChild(section);
  }

  function ensureHeroProfile() {
    if (document.getElementById('v4-profile-modal')) return;
    const line = document.getElementById('featured-line');
    if (!line || !line.parentNode) return;
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.id = 'v4-profile-open';
    openButton.innerHTML = '<span>旅伴性格档案</span><b>认识它的生活与爱好</b><i>查看档案</i>';
    line.insertAdjacentElement('afterend', openButton);

    const featured = document.getElementById('featured');
    if (featured) {
      featured.tabIndex = 0;
      featured.setAttribute('role', 'button');
      featured.setAttribute('title', '点击查看当前旅伴的性格档案');
      const hint = document.createElement('span');
      hint.id = 'v4-featured-hint';
      hint.textContent = '点击大角色，看看它的性格档案';
      featured.insertAdjacentElement('afterend', hint);
      featured.addEventListener('click', event => {
        event.stopPropagation();
        openHeroProfile();
      });
      featured.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openHeroProfile();
        }
      });
    }

    const modal = document.createElement('section');
    modal.id = 'v4-profile-modal';
    modal.className = 'v4-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'v4-profile-name');
    modal.innerHTML =
      '<div class="v4-modal-backdrop" data-close-profile></div>' +
      '<article class="v4-profile-card">' +
        '<button type="button" class="v4-profile-close" data-close-profile aria-label="关闭角色档案">×</button>' +
        '<div class="v4-profile-portrait-wrap"><span>TRAVEL COMPANION</span><canvas id="v4-profile-portrait" width="666" height="585" role="img"></canvas></div>' +
        '<div class="v4-profile-story"><p class="v4-profile-kicker">旅伴性格档案</p><h2 id="v4-profile-name"></h2><p id="v4-profile-personality" class="v4-profile-lead"></p>' +
          '<dl><div><dt>它每天都会做什么</dt><dd id="v4-profile-habit"></dd></div><div><dt>它真正喜欢的事情</dt><dd id="v4-profile-hobby"></dd></div><div><dt>和它一起旅行的感觉</dt><dd id="v4-profile-journey"></dd></div></dl>' +
          '<button type="button" class="v4-profile-confirm" data-close-profile>就和它一起出发</button>' +
        '</div>' +
      '</article>';
    document.body.appendChild(modal);

    openButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openHeroProfile();
    });
    modal.addEventListener('click', event => {
      const target = event.target;
      if (target.closest && target.closest('[data-close-profile]')) closeHeroProfile();
    });
    updateHeroProfile();
  }

  function updateHeroProfile() {
    const profile = document.getElementById('v4-profile-modal');
    const featured = document.getElementById('featured');
    if (!profile || !featured) return;
    const id = featured.dataset.hero || '10';
    const companion = COMPANIONS[id] || COMPANIONS['10'];
    document.getElementById('v4-profile-name').textContent = companion.name;
    document.getElementById('v4-profile-personality').textContent = companion.personality;
    document.getElementById('v4-profile-habit').textContent = companion.habit;
    document.getElementById('v4-profile-hobby').textContent = companion.hobby;
    document.getElementById('v4-profile-journey').textContent = companion.journey;
    const portrait = document.getElementById('v4-profile-portrait');
    portrait.setAttribute('aria-label', companion.name + '的角色形象');
    const portraitContext = portrait.getContext('2d');
    portraitContext.clearRect(0, 0, portrait.width, portrait.height);
    portraitContext.drawImage(featured, 0, 0, portrait.width, portrait.height);
    profile.dataset.hero = id;
  }

  function openHeroProfile() {
    updateHeroProfile();
    const profile = document.getElementById('v4-profile-modal');
    if (!profile) return;
    profile.hidden = false;
    document.body.classList.add('v4-profile-open');
  }

  function closeHeroProfile() {
    const profile = document.getElementById('v4-profile-modal');
    if (!profile) return;
    profile.hidden = true;
    document.body.classList.remove('v4-profile-open');
  }

  function init() {
    ensureMissionPanel();
    ensureShop();
    ensureHeroProfile();
    enrichHelp();
    enrichMap();
    updateWallet();
    setInterval(updateMissionPanel, 250);
    document.addEventListener('click', event => {
      const button = event.target && event.target.closest ? event.target.closest('button') : null;
      const id = button ? button.id : '';
      if (id === 'open-help') setTimeout(enrichHelp, 0);
      if (id === 'open-map') setTimeout(enrichMap, 0);
      if (button && (button.matches('.hero-card') || button.closest('.lobby-party'))) setTimeout(updateHeroProfile, 520);
    }, true);
    document.addEventListener('keydown', event => {
      const shop = document.getElementById('v4-shop');
      if (event.key === 'Escape' && shop && !shop.hidden) closeShop();
      const profile = document.getElementById('v4-profile-modal');
      if (event.key === 'Escape' && profile && !profile.hidden) closeHeroProfile();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

/* V4.9: distinguish the portfolio stage from the standalone game. */
if (window.self !== window.top || new URLSearchParams(window.location.search).has('theme')) {
  document.documentElement.classList.add('portfolio-embed');
}

/* Compact inside the portfolio, spacious again when the parent stage is fullscreen. */
function syncPortfolioFullscreen() {
  let fullscreen = false;
  try { fullscreen = !!window.parent.document.fullscreenElement; } catch (error) { fullscreen = false; }
  document.documentElement.classList.toggle('portfolio-fullscreen', fullscreen);
}
try {
  window.parent.document.addEventListener('fullscreenchange', syncPortfolioFullscreen);
  syncPortfolioFullscreen();
} catch (error) {
  syncPortfolioFullscreen();
}

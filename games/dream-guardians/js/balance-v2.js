/* Second-edition progression and encounter tuning. Load before the simulation. */
(() => {
  'use strict';
  const old = window.DreamData;
  const tuning = {
    ying:[55,10,.85,145],tai:[65,30,1.35,162],lumi:[85,9,1.1,155],
    ember:[110,15,.85,142],mian:[140,32,1.4,175],echo:[120,18,1,180],
    bobo:[145,8,1.4,178],milo:[220,47,1.15,228],thorn:[165,36,.9,190],
    song:[145,16,1.1,184],jibai:[250,61,1.45,240],feilan:[235,41,1.1,202]
  };
  const heroes = old.heroes.map(h => {
    const [cost,attack,interval,range] = tuning[h.id];
    return {...h,cost,attack,interval,range,exclusive:h.id!=='ying'};
  });
  const byId = Object.fromEntries(heroes.map(h=>[h.id,h]));
  const enemyStats = [
    [52,35,0,8],[42,53,0,10],[160,26,.28,17],[112,30,.05,14],
    [175,28,.08,18],[165,32,.05,18],[225,26,.1,24],[1850,19,.2,110]
  ];
  const enemies = old.enemies.map((e,i)=>{
    const [hp,speed,armor,reward] = enemyStats[i];
    return {...e,hp,speed,armor,reward};
  });
  const waves = [6,7,8,9,10,10,11,12,13,15];
  const advice = [
    '入门 · 先部署萤巡，再补位并升级；后续波次的敌人会更耐打，不能只守开局。',
    '初级 · 建议带上露米，用减速延长攻击时间。',
    '初级 · 第 3 波加入护甲怪，建议带烬团；别把所有金币都投进生产。',
    '进阶 · 建议三种伙伴、培养 Lv.2，分配两个入口的火力。',
    '进阶 · 范围攻击应对分裂，空闲时清除墨晶扩展布阵。',
    '进阶 · 建议培养 Lv.3，集中输出，不给再生怪恢复的机会。',
    '困难 · 建议四种伙伴，持续输出配合辅助应对护盾。',
    '困难 · 建议培养 Lv.4；第 5 波开放第三入口，提前在右岸补位，后期优先处理召唤怪。',
    '挑战 · 建议培养 Lv.4，有限落脚点更需要升级与搭配。',
    '终章 · 建议培养 Lv.4–5，保留金币升级主力，迎接首领。'
  ];
  const maps = old.maps.map((m,i)=>({...m,paths:i===7?[m.paths[0],m.paths[1],[[990,85],[650,85],[650,200],[835,200],[835,490]]]:m.paths,pressure:i===8?1.3:i===9?1.1:1,healthGrowth:.38/(1+i*.3),waveSupply:12+Math.floor(i/3)*4,waves:waves[i],enemyTypes:i===0?[0,1]:m.enemyTypes,hint:advice[i],startingCoins:[190,200,210,225,235,250,265,280,300,320][i],clearDust:200+i*25,replayDust:80+i*8,killDust:2+Math.floor(i/3),difficulty:Math.min(5,1+Math.floor(i/2))}));
  function stats(id,level=1,tier=1) {
    const h=byId[id],l=Math.min(5,Math.max(1,level)),t=Math.min(3,Math.max(1,tier));
    return {attack:Math.round(h.attack*(1+.1*(l-1))*[1,1.65,3.2][t-1]),interval:h.interval*(l===5?.95:1)*[1,.95,.9][t-1],range:(h.range+3*(l-1))*[1,1.05,1.1][t-1]};
  }
  const economy = {workshopIncome:[0,12,20,30],workshopUpgrade:[0,50,80,0],towerUpgrade:[.85,2.3],childReward:.25};
  const pool = [];
  for(const h of heroes.filter(h=>h.id!=='ying')) {
    const chance={1:8,2:6,3:4,4:2,5:2/3}[h.stars];
    pool.push({kind:'hero',id:h.id,chance,count:1});
  }
  for(const h of heroes.filter(h=>h.stars===4))pool.push({kind:'fragment',id:h.id,chance:8,count:3});
  pool.push({kind:'wish',id:'wish',chance:18,count:3});
  for(const item of old.items)pool.push({kind:'item',id:item.id,chance:3.4,count:1});
  pool.push({kind:'dust',id:'dust',chance:5,count:60});
  window.DreamData = {...old,balanceVersion:3,economy,heroes,byId,enemies,maps,stats,unlock:Array(10).fill(null),pool,wishIds:['milo','jibai','feilan'],duplicateDust:[0,25,45,70,120,240]};
})();

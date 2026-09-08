(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Odyssey=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const cards={
 spear:{name:'英雄之矛',cost:1,attack:7,kind:'进攻',art:'spear',text:'造成 7 点伤害。'},
 ram:{name:'金羊冲锋',cost:2,attack:13,kind:'进攻',art:'ram',text:'造成 13 点伤害。'},
 shield:{name:'雅典娜之盾',cost:1,block:8,kind:'防御',art:'shield',text:'获得 8 点护盾。'},
 ship:{name:'顺风之船',cost:1,block:4,draw:2,kind:'策略',art:'ship',text:'获得 4 点护盾，抽 2 张牌。'},
 nectar:{name:'神赐甘露',cost:1,heal:6,kind:'恢复',art:'nectar',text:'恢复 6 点生命。'},
 thunder:{name:'宙斯之雷',cost:2,attack:10,block:6,kind:'神谕',art:'thunder',text:'造成 10 点伤害，获得 6 点护盾。'}
};
const stages=[
 {name:'独眼巨人的海岸',enemy:'波吕斐摩斯',hp:34,story:'巨人的脚步震动海岸。读懂他的意图，在重击落下前举起盾牌。',pattern:[{attack:7,block:0,label:'巨石投掷'},{attack:11,block:0,label:'蓄力重击'},{attack:4,block:5,label:'岩壁守势'}]},
 {name:'塞壬的海峡',enemy:'塞壬',hp:52,story:'歌声穿过海雾。借着顺风补充手牌，在她的守势之间寻找突破。',pattern:[{attack:6,block:8,label:'迷雾之歌'},{attack:10,block:0,label:'碎浪回响'},{attack:13,block:0,label:'风暴合唱'}]},
 {name:'波塞冬的试炼',enemy:'波塞冬',hp:76,story:'伊萨卡就在海的另一边。战胜最后的风暴，带着你的船员回家。',pattern:[{attack:10,block:6,label:'潮汐之壁'},{attack:15,block:0,label:'三叉戟'},{attack:19,block:0,label:'怒海狂澜'}]}
];
function shuffle(a,rng){for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function log(s,t){s.log.unshift(t);s.log=s.log.slice(0,6);}
function draw(s,n,rng){for(let i=0;i<n;i++){if(!s.deck.length){if(!s.discard.length)break;s.deck=shuffle(s.discard.splice(0),rng);}if(s.hand.length<9)s.hand.push(s.deck.pop());}}
function intent(s){return stages[s.stage].pattern[(s.turn-1)%3];}
function startBattle(s,rng){s.status='battle';s.enemyHP=stages[s.stage].hp;s.enemyMax=s.enemyHP;s.enemyBlock=0;s.block=0;s.turn=1;s.energy=s.maxEnergy;s.hand=[];s.discard=[];s.deck=shuffle([...s.baseDeck],rng);draw(s,5,rng);log(s,'抵达'+stages[s.stage].name+'。');}
function create(rng=Math.random){const s={version:1,status:'battle',stage:0,unlocked:1,completed:0,hp:48,maxHP:48,maxEnergy:3,bonus:0,damage:0,totalTurns:0,relics:[],rewardHistory:[],baseDeck:['spear','spear','spear','ram','ram','shield','shield','shield','ship','ship','nectar','thunder'],log:[]};startBattle(s,rng);return s;}
function start(s,index,rng=Math.random){if(!['map','defeat'].includes(s.status)||!Number.isInteger(index)||index<0||index>=stages.length)return false;s.completed=s.completed||0;s.unlocked=s.unlocked||1;if(index!==s.completed||index>=s.unlocked)return false;s.stage=index;startBattle(s,rng);return true;}
function play(s,index,rng=Math.random){if(s.status!=='battle'||!Number.isInteger(index)||index<0||index>=s.hand.length)return false;const id=s.hand[index],c=cards[id];if(c.cost>s.energy)return false;s.energy-=c.cost;s.hand.splice(index,1);s.discard.push(id);let detail=[];
 if(c.attack){const hit=Math.max(0,c.attack+s.bonus-s.enemyBlock);s.enemyBlock=Math.max(0,s.enemyBlock-c.attack-s.bonus);const actual=Math.min(s.enemyHP,hit);s.enemyHP=Math.max(0,s.enemyHP-hit);s.damage+=actual;detail.push('伤害 '+actual);}
 if(c.block){s.block+=c.block;detail.push('护盾 +'+c.block);}
 if(c.heal){const healed=Math.min(c.heal,s.maxHP-s.hp);s.hp+=healed;detail.push('生命 +'+healed);}
 if(c.draw)draw(s,c.draw,rng);log(s,c.name+' · '+detail.join(' / '));
 if(s.enemyHP===0){s.status=s.stage===2?'victory':'reward';log(s,'战胜'+stages[s.stage].enemy+'！');}return true;
}
function endTurn(s,rng=Math.random){if(s.status!=='battle')return false;const move=intent(s),hit=Math.max(0,move.attack-s.block);s.hp=Math.max(0,s.hp-hit);s.totalTurns++;log(s,stages[s.stage].enemy+' · '+move.label+'，受到 '+hit+' 点伤害。');if(!s.hp){s.status='defeat';return true;}s.enemyBlock=move.block;s.block=0;s.discard.push(...s.hand);s.hand=[];s.turn++;s.energy=s.maxEnergy;draw(s,5,rng);return true;}
const rewards=[{name:'阿瑞斯的锋芒',text:'所有攻击牌的伤害永久 +2。',art:'spear'},{name:'雅典娜的祝福',text:'生命上限 +8，额外恢复 12 点生命。',art:'nectar'},{name:'赫尔墨斯的风',text:'每回合行动力永久 +1。',art:'ship'}];
function reward(s,index,rng=Math.random){if(s.status!=='reward'||!Number.isInteger(index)||index<0||index>2)return false;if(index===0)s.bonus+=2;if(index===1){s.maxHP+=8;s.hp=Math.min(s.maxHP,s.hp+12);}if(index===2)s.maxEnergy++;s.relics.push(rewards[index].name);s.rewardHistory=s.rewardHistory||[];s.rewardHistory.push({stage:s.stage+1,goldEarned:500,goldSpent:500,gemsEarned:20,gemsSpent:20,blessing:rewards[index].name});s.hp=Math.min(s.maxHP,s.hp+10);s.completed=Math.max(s.completed||0,s.stage+1);s.unlocked=Math.min(stages.length,Math.max(s.unlocked||1,s.completed+1));s.stage=Math.min(s.completed,stages.length-1);s.status='map';s.enemyBlock=0;s.block=0;s.energy=s.maxEnergy;s.hand=[];s.discard=[];s.deck=[];s.turn=1;log(s,'领取'+rewards[index].name+'，新的航程已标记在地图上。');return true;}
// A stale or malformed browser save must never prevent the title screen opening.
function valid(s){if(!s||s.version!==1||!['battle','reward','victory','defeat','map','complete'].includes(s.status)||!Number.isInteger(s.stage)||s.stage<0||s.stage>=3)return false;if(!Number.isInteger(s.completed))s.completed=s.status==='victory'||s.status==='complete'?3:Math.min(2,Math.max(0,s.stage));if(!Number.isInteger(s.unlocked))s.unlocked=Math.min(3,Math.max(1,s.completed+1));return Number.isInteger(s.unlocked)&&s.unlocked>=1&&s.unlocked<=3&&Number.isInteger(s.completed)&&s.completed>=0&&s.completed<=3&&['hp','maxHP','maxEnergy','bonus','enemyHP','enemyMax','enemyBlock','block','turn','energy','damage','totalTurns'].every(k=>Number.isFinite(s[k])&&s[k]>=0)&&s.hp<=s.maxHP&&s.turn>=1&&['baseDeck','deck','hand','discard'].every(k=>Array.isArray(s[k])&&s[k].every(id=>Object.hasOwn(cards,id)))&&Array.isArray(s.relics)&&s.relics.every(x=>typeof x==='string')&&Array.isArray(s.log)&&s.log.every(x=>typeof x==='string');}
return{cards,stages,rewards,create,start,play,endTurn,reward,intent,valid};
});

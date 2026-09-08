/* Deterministic platform/combat simulation shared by browser and Node tests. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SpiritEngine=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const HEROES=[{id:'03',name:'慢拍',line:'慢一点，也会抵达闪光的地方。',color:'#cbb6e5'},{id:'04',name:'棱棱',line:'才没有等你。只是刚好顺路。',color:'#e997b4'},{id:'09',name:'贝眠',line:'把今天的好心情，藏进贝壳里。',color:'#f1cfa2'},{id:'10',name:'星啾',line:'再跳一下，就能碰到星星！',color:'#9ed7ee'},{id:'12',name:'晶甲',line:'你慢慢走，我来挡在前面。',color:'#8ed8ca'}];
 const TYPES={ '05':{hp:35,damage:8,speed:64,range:230,kind:'charge',size:64},'06':{hp:65,damage:20,speed:42,range:380,kind:'spike',size:66},'07':{hp:40,damage:12,speed:42,range:460,kind:'water',size:64},'08':{hp:110,damage:26,speed:32,range:300,kind:'wave',size:82},'11':{hp:55,damage:16,speed:58,range:170,kind:'claw',size:74}};
 // Native orientation is art metadata, independent of world movement direction.
 const NATIVE_FACING={'03':1,'04':-1,'09':1,'10':1,'12':-1,'05':1,'06':1,'07':1,'08':1,'11':1};
 const spriteFlip=(id,facing)=>(facing<0?-1:1)*(NATIVE_FACING[id]||1);
 const {META,KEEPSAKES,level}=typeof module==='object'&&module.exports?require('./levels.js'):globalThis.SpiritLevels;
 function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
 function stars(time,l){return time<=l.three?3:time<=l.two?2:1;}
 class Game{
  constructor(index=0,hero='03'){this.load(index,hero);}
  load(index,hero){
   this.level=level(index);this.hero=HEROES.some(h=>h.id===hero)?hero:'03';this.time=0;this.status='playing';this.gems=0;this.kills=0;this.keepsakes=[];this.events=[];this.projectiles=[];this.effects=[];this.checkpoint=0;this.stomps=0;
   this.player={x:70,y:this.level.platforms[0].y-66,w:42,h:66,vx:0,vy:0,hp:100,maxHp:100,jumps:0,grounded:true,platform:'g0',facing:1,invuln:0,shield:0,cooldown:0,attackFlash:0,coyote:.1,drop:0,jumpBuffer:0};
   this.enemies=this.level.enemies.map(e=>{const t=TYPES[e.type],p=this.level.platforms.find(p=>p.id===e.platform),hp=t.hp*(e.tier===2?1.35:1);return {...e,...t,maxHp:hp,hp,w:t.size*.74,h:t.size,x:e.x,y:p.y-t.size,dir:-1,state:'patrol',timer:0,cooldown:.8,flash:0,dead:false};});
   this.items=this.level.items.map(i=>({...i,taken:false}));return this;
  }
  event(type,x,y,value){this.events.push({type,x,y,value});}
  damagePlayer(amount,sourceX){const p=this.player;if(this.status!=='playing'||p.invuln>0)return false;if(p.shield>0){p.invuln=.25;this.event('block',p.x,p.y);return false;}p.hp=Math.max(0,p.hp-amount);p.invuln=1.2;p.vx=p.x<sourceX?-200:200;this.event('hurt',p.x,p.y,amount);if(p.hp===0)this.status='lost';return true;}
  damageEnemy(e,amount,stomp=false){if(e.dead)return;if(e.type==='11'&&!stomp){this.event('armor',e.x,e.y);return;}e.hp=Math.max(0,e.hp-amount);e.flash=.16;this.event('hit',e.x,e.y,amount);if(e.hp===0){e.dead=true;for(const shot of this.projectiles)if(shot.source===e.id)shot.life=0;this.kills++;this.event('defeat',e.x,e.y,e.type);this.effects.push({x:e.x+e.w/2,y:e.y+e.h/2,life:.6,max:.6,color:'#e6bfdc'});}}
  jump(){const p=this.player;if(this.status!=='playing')return false;if(!p.grounded&&p.coyote<=0&&p.jumps===0)p.jumps=1;if(p.jumps>=2)return false;p.jumps++;p.vy=p.jumps===1?-610:-555;p.grounded=false;p.platform=null;p.coyote=0;this.event('jump',p.x,p.y,p.jumps);return true;}
  attack(){const p=this.player;if(this.status!=='playing'||p.cooldown>0)return false;p.cooldown=.34;p.attackFlash=.18;this.projectiles.push({owner:'player',x:p.x+p.w/2+p.facing*23,y:p.y+30,w:18,h:12,vx:p.facing*610,vy:0,life:.9,damage:25,type:'spark'});this.event('attack',p.x,p.y);return true;}
  respawn(){const p=this.player,c=this.level.checkpoints[this.checkpoint];p.hp=Math.max(0,p.hp-20);this.event('fall',p.x,p.y,20);if(p.hp===0){this.status='lost';return;}p.x=c.x;p.y=c.y;p.vx=0;p.vy=0;p.jumps=0;p.grounded=true;p.platform=c.platform;p.invuln=1.5;p.shield=0;p.jumpBuffer=0;}
  step(dt,input={}){
   if(this.status!=='playing')return;dt=Math.min(.04,Math.max(0,dt));this.time+=dt;const p=this.player;
   for(const a of this.level.platforms){if(a.kind==='crumble'){if(a.trigger>0){a.trigger-=dt;if(a.trigger<=0){a.trigger=0;a.gone=true;a.restore=3.4;}}else if(a.gone){a.restore-=dt;if(a.restore<=0){a.gone=false;a.trigger=0;}}}if(a.axis){a.origin??=a[a.axis];const before=a[a.axis];a[a.axis]=a.origin+Math.sin(this.time*Math.PI*2/a.period+a.phase)*a.amplitude;if(p.grounded&&p.platform===a.id){p[a.axis]+=a[a.axis]-before;}}}
   for(const d of this.level.devices){if(d.type==='tide'){const phase=(this.time+d.phase)%d.period;d.active=phase>2.3&&phase<3.8;d.warning=phase>1.65&&phase<=2.3;if(d.active&&overlaps(p,d))this.damagePlayer(d.damage,d.x+d.w/2);}if(d.type==='wind'&&overlaps(p,d)){p.vy=Math.max(-490,p.vy-2550*dt);p.grounded=false;}if(d.type==='spring'&&p.vy>=0&&p.x+p.w>d.x&&p.x<d.x+d.w&&p.y+p.h>=d.y-3&&p.y+p.h<=d.y+22){p.vy=-880;p.jumps=1;p.grounded=false;this.event('spring',d.x,d.y);}}
   for(const key of ['invuln','shield','cooldown','attackFlash','drop','coyote','jumpBuffer'])p[key]=Math.max(0,p[key]-dt);
   if(p.grounded)p.coyote=.10;
   const move=(input.right?1:0)-(input.left?1:0);if(move)p.facing=move;
   if(input.jump)p.jumpBuffer=.12;if(p.jumpBuffer>0&&this.jump())p.jumpBuffer=0;if(input.attack)this.attack();
   if(input.down&&p.grounded){const plat=this.level.platforms.find(a=>a.id===p.platform);if(plat?.oneWay){p.drop=.23;p.y+=8;p.grounded=false;p.platform=null;}}
   const target=move*290;p.vx+=(target-p.vx)*Math.min(1,dt*(p.grounded?18:9));
   const oldX=p.x;p.x+=p.vx*dt;p.x=Math.max(0,Math.min(this.level.width-p.w,p.x));
   for(const a of this.level.platforms)if(!a.gone&&!a.oneWay&&overlaps(p,a)){if(oldX+p.w<=a.x+1)p.x=a.x-p.w;else if(oldX>=a.x+a.w-1)p.x=a.x+a.w;p.vx=0;}
   const oldY=p.y;p.vy=Math.min(950,p.vy+1650*dt);p.y+=p.vy*dt;p.grounded=false;p.platform=null;
   for(const a of this.level.platforms){if(a.gone)continue;if(p.x+p.w<=a.x||p.x>=a.x+a.w)continue;if(p.vy>=0&&oldY+p.h<=a.y+2&&p.y+p.h>=a.y&&!(a.oneWay&&p.drop>0)){p.y=a.y-p.h;p.vy=0;p.grounded=true;p.jumps=0;p.platform=a.id;if(a.kind==='crumble'&&(a.trigger||0)<=0)a.trigger=.62;}else if(!a.oneWay&&p.vy<0&&oldY>=a.y+a.h&&p.y<a.y+a.h){p.y=a.y+a.h;p.vy=0;}}
   if(p.grounded&&p.jumpBuffer>0&&!input.down&&this.jump())p.jumpBuffer=0;
   if(p.y>this.level.height+60)this.respawn();if(this.status!=='playing')return;
   for(let i=this.checkpoint+1;i<this.level.checkpoints.length;i++){const c=this.level.checkpoints[i];if(p.x>=c.x&&p.x<c.x+260&&Math.abs(p.y-c.y)<500){this.checkpoint=i;this.event('checkpoint',c.x,c.y);}}
   for(const item of this.items){if(item.taken)continue;if(overlaps(p,{x:item.x-16,y:item.y-18,w:32,h:36})){if(item.type==='heal'&&p.hp===p.maxHp)continue;item.taken=true;if(item.type==='gem')this.gems++;if(item.type==='heal')p.hp=Math.min(p.maxHp,p.hp+35);if(item.type==='shield')p.shield=6;if(item.type==='keepsake')this.keepsakes.push(item.slot);this.event(item.type,item.x,item.y,item.type==='keepsake'?item.slot:undefined);}}
   for(const e of this.enemies){
    if(e.dead)continue;e.flash=Math.max(0,e.flash-dt);e.cooldown=Math.max(0,e.cooldown-dt);
    const plat=this.level.platforms.find(a=>a.id===e.platform);e.y=plat.y-e.h;const dx=p.x+p.w/2-e.x-e.w/2,dy=p.y+p.h/2-e.y-e.h/2,seen=Math.abs(dx)<e.range&&Math.abs(dy)<(['water','spike'].includes(e.kind)?300:110);
    if(e.state==='windup'){
     e.timer-=dt;if(e.timer<=0){e.state='attack';e.timer=e.kind==='charge'?.55:.25;
      if(e.kind==='spike'){for(const spread of [-.22,0,.22]){const angle=Math.atan2(dy,Math.abs(dx))+spread;this.projectiles.push({owner:'enemy',source:e.id,x:e.x+e.w/2,y:e.y+e.h*.35,w:14,h:14,vx:e.dir*Math.cos(angle)*275,vy:Math.sin(angle)*275,damage:e.damage,life:2,type:'spike'});}}
      if(e.kind==='water'||e.kind==='wave'){const wave=e.kind==='wave',speed=wave?240:260,angle=wave?0:Math.atan2(dy,Math.abs(dx));this.projectiles.push({owner:'enemy',source:e.id,x:e.x+e.w/2,y:wave?e.y+e.h-32:e.y+e.h*.35,w:wave?36:20,h:wave?30:20,vx:e.dir*Math.cos(angle)*speed,vy:wave?0:Math.sin(angle)*speed,damage:e.damage*(e.tier===2?1.2:1),life:2.2,type:wave?'wave':'water'});}
     }
    }else if(e.state==='attack'){e.timer-=dt;if(e.kind==='charge')e.x+=e.dir*240*dt;if(e.timer<=0){e.state='recover';e.timer=.65;}}
    else if(e.state==='recover'){e.timer-=dt;if(e.timer<=0){e.state='patrol';e.cooldown=.55;}}
    else{if(seen)e.dir=Math.sign(dx)||e.dir;const melee=Math.abs(dx)<e.w+48;
     if(seen&&e.cooldown===0&&(e.kind==='water'||e.kind==='charge'||e.kind==='wave'||e.kind==='spike'||melee)){e.state='windup';e.timer=e.kind==='charge'?.6:.7;}
     else{e.x+=e.dir*e.speed*(seen?1.25:1)*dt;}
    }
    if(e.x<=plat.x+5){e.x=plat.x+5;e.dir=1;}if(e.x+e.w>=plat.x+plat.w-5){e.x=plat.x+plat.w-e.w-5;e.dir=-1;}
    const box=e.state==='attack'&&(e.kind==='claw'||e.kind==='spike')?{x:e.x-25,y:e.y,w:e.w+50,h:e.h}:e;
    if(overlaps(p,box)){const topLanding=p.vy>50&&oldY+p.h<=e.y+18&&p.x+p.w>e.x+5&&p.x<e.x+e.w-5;if(topLanding&&['05','07','11'].includes(e.type)){this.damageEnemy(e,e.maxHp,true);this.stomps++;p.y=e.y-p.h;p.vy=-480;p.jumps=1;p.grounded=false;this.event('stomp',e.x,e.y);}else this.damagePlayer(e.damage*(e.tier===2?1.2:1),e.x+e.w/2);}
   }
   for(const b of this.projectiles){b.life-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.life<=0)continue;
    if(this.level.platforms.some(a=>!a.oneWay&&overlaps(b,a))){b.life=0;continue;}
    if(b.owner==='player'){for(const e of this.enemies)if(!e.dead&&overlaps(b,e)){this.damageEnemy(e,b.damage);b.life=0;break;}}
    else if(overlaps(b,p)){this.damagePlayer(b.damage,b.x);b.life=0;}
   }
   this.projectiles=this.projectiles.filter(b=>b.life>0);this.enemies=this.enemies.filter(e=>!e.dead);for(const e of this.effects)e.life-=dt;this.effects=this.effects.filter(e=>e.life>0);
   if(this.status==='playing'&&overlaps(p,this.level.goal)){this.status='won';this.event('win',p.x,p.y,stars(this.time,this.level));}
  }
 }
 function cleanSave(raw){const out={version:3,moonRoute:2,hero:'03',unlocked:6,records:Array(6).fill(null),keepsakes:Array.from({length:6},()=>[]),sound:true,music:true,volume:.5,reducedMotion:false,effects:true,nickname:'珠光旅人',tutorialSeen:false};if(!raw||typeof raw!=='object')return out;if(HEROES.some(h=>h.id===raw.hero))out.hero=raw.hero;out.sound=raw.sound!==false;out.music=raw.music!==false;out.volume=Number.isFinite(raw.volume)?Math.max(0,Math.min(1,raw.volume)):.5;out.reducedMotion=raw.reducedMotion===true;out.effects=raw.effects!==false;out.tutorialSeen=raw.tutorialSeen===true;if(typeof raw.nickname==='string'&&raw.nickname.trim())out.nickname=Array.from(raw.nickname.trim()).slice(0,16).join('');
  if(raw.version!==3&&Array.isArray(raw.records)){out.legacyRecords=raw.records.slice(0,6).map(r=>r&&Number.isFinite(r.best)&&r.best>0?{best:r.best,stars:Math.max(1,Math.min(3,Math.floor(r.stars)||1))}:null);return out;}if(Array.isArray(raw.legacyRecords))out.legacyRecords=raw.legacyRecords;if(Array.isArray(raw.records))out.records=out.records.map((_,i)=>{const r=raw.records[i];return r&&Number.isFinite(r.best)&&r.best>0&&Number.isInteger(r.stars)&&r.stars>=1&&r.stars<=3?{best:r.best,stars:r.stars}:null;});
  const validMoon=r=>r&&Number.isFinite(r.best)&&r.best>0&&Number.isInteger(r.stars)&&r.stars>=1&&r.stars<=3;if(validMoon(raw.legacyMoonRecord))out.legacyMoonRecord={best:raw.legacyMoonRecord.best,stars:raw.legacyMoonRecord.stars};if(raw.moonRoute!==2&&out.records[5]){out.legacyMoonRecord=out.records[5];out.records[5]=null;}
  out.keepsakes=Array.from({length:6},(_,i)=>Array.isArray(raw.keepsakes?.[i])?[...new Set(raw.keepsakes[i].filter(n=>Number.isInteger(n)&&n>=0&&n<3))].sort():[]);
  return out;
 }
 function record(save,index,time){const s=cleanSave(save),l=level(index),n=stars(time,l),prev=s.records[index];s.records[index]={best:prev?Math.min(time,prev.best):time,stars:prev?Math.max(n,prev.stars):n};return cleanSave(s);}
 function rememberKeepsake(save,index,slot){const s=cleanSave(save);s.keepsakes??=Array.from({length:6},()=>[]);if(Number.isInteger(index)&&index>=0&&index<6&&Number.isInteger(slot)&&slot>=0&&slot<3&&!s.keepsakes[index].includes(slot))s.keepsakes[index].push(slot);return s;}
 return {Game,HEROES,TYPES,META,KEEPSAKES,NATIVE_FACING,spriteFlip,level,stars,overlaps,cleanSave,record,rememberKeepsake};
});

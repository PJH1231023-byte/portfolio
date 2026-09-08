(function(){
  'use strict';
  const D=DreamData, clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function route(points){
    const out=[],push=(x,y)=>{if(!out.length||Math.hypot(x-out[out.length-1].x,y-out[out.length-1].y)>.1)out.push({x,y});};
    const p=points.map(a=>({x:a[0],y:a[1]}));push(p[0].x,p[0].y);
    for(let i=1;i<p.length-1;i++){
      const a=p[i-1],b=p[i],c=p[i+1],la=dist(a,b),lb=dist(b,c),r=Math.min(40,la/3,lb/3);
      const s={x:b.x+(a.x-b.x)*r/la,y:b.y+(a.y-b.y)*r/la},e={x:b.x+(c.x-b.x)*r/lb,y:b.y+(c.y-b.y)*r/lb};
      push(s.x,s.y);for(let k=1;k<=12;k++){let t=k/12,u=1-t;push(u*u*s.x+2*u*t*b.x+t*t*e.x,u*u*s.y+2*u*t*b.y+t*t*e.y);}
    }
    push(p[p.length-1].x,p[p.length-1].y);let length=0;out[0].s=0;for(let i=1;i<out.length;i++){length+=dist(out[i-1],out[i]);out[i].s=length;}return {points:out,length};
  }
  function at(r,s){s=clamp(s,0,r.length);let i=1;while(i<r.points.length-1&&r.points[i].s<s)i++;const a=r.points[i-1],b=r.points[i],t=(s-a.s)/(b.s-a.s||1);return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,angle:Math.atan2(b.y-a.y,b.x-a.x)};}
  function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t);}
  function distanceToRoutes(p,routes){let d=Infinity;for(const r of routes)for(let i=1;i<r.points.length;i++)d=Math.min(d,segmentDistance(p,r.points[i-1],r.points[i]));return d;}
  function makePads(routes,index){
    const candidates=[],end=at(routes[0],routes[0].length);
    for(let y=48;y<=550;y+=52)for(let x=58;x<=905;x+=56){const p={x:x+((Math.round(y/52)%2)*11),y},d=distanceToRoutes(p,routes);if(d>68&&d<144&&dist(p,end)>82)candidates.push({...p,d});}
    candidates.sort((a,b)=>Math.abs(a.d-90)-Math.abs(b.d-90));const chosen=[];
    for(const p of candidates){if(chosen.every(q=>dist(p,q)>94)){chosen.push({id:chosen.length,x:p.x,y:p.y,blocked:false,hp:0});if(chosen.length>=(index===8?11:16))break;}}
    chosen.sort((a,b)=>a.x-b.x||a.y-b.y);chosen.forEach((p,i)=>{p.id=i;p.blocked=index>=4&&i%5===3;p.hp=p.blocked?65+index*10:0;});return chosen;
  }
  class Battle{
    constructor(index,heroLevels,loadout,onEvent,snapshot){
      this.index=index;this.map=D.maps[index];this.routes=this.map.paths.map(route);this.pads=makePads(this.routes,index);this.levels={...heroLevels};this.loadout=[...loadout];this.onEvent=onEvent;
      this.time=0;this.wave=0;this.coins=180+index*10;this.hp=10;this.maxHp=10;this.towers=[];this.enemies=[];this.projectiles=[];this.fx=[];this.queue=[];this.nextId=1;this.phase='ready';this.gap=0;this.kills=0;this.rewardClaimed=false;this.result='playing';this.focus=null;this.slowUntil=0;this.buffUntil=0;this.flowerShield=0;
      if(snapshot)this.restore(snapshot);
    }
    emit(type,extra={}){this.onEvent?.({type,...extra});}
    save(){return {v:1,index:this.index,levels:this.levels,loadout:this.loadout,time:this.time,wave:this.wave,coins:this.coins,hp:this.hp,towers:this.towers,enemies:this.enemies,queue:this.queue,nextId:this.nextId,phase:this.phase,gap:this.gap,kills:this.kills,pads:this.pads,rewardClaimed:this.rewardClaimed,result:this.result,slowUntil:this.slowUntil,buffUntil:this.buffUntil,flowerShield:this.flowerShield,focus:this.focus};}
    restore(s){
      if(s.v!==1||s.index!==this.index||!Array.isArray(s.towers)||!Array.isArray(s.enemies)||!Array.isArray(s.queue)||s.enemies.length>300||s.queue.length>300||!Number.isFinite(s.time)||!Number.isFinite(s.coins)||!Number.isInteger(s.wave)||s.wave<0||s.wave>this.map.waves)throw new Error('Invalid battle save');
      if(s.towers.some(t=>!D.byId[t.hero]||!this.pads[t.pad]||!Number.isFinite(t.cool))||s.enemies.some(e=>!D.enemies[e.type]||!this.routes[e.route]||!Number.isFinite(e.s)||!Number.isFinite(e.hp)))throw new Error('Invalid units');
      for(const k of ['time','wave','coins','hp','towers','enemies','queue','nextId','phase','gap','kills','rewardClaimed','result','slowUntil','buffUntil','flowerShield','focus'])if(s[k]!==undefined)this[k]=s[k];
      this.coins=clamp(this.coins,0,1e7);this.hp=clamp(this.hp,0,10);this.levels=s.levels||this.levels;this.loadout=s.loadout.filter(id=>D.byId[id]);
      if(Array.isArray(s.pads))s.pads.forEach((p,i)=>{if(this.pads[i]){this.pads[i].blocked=!!p.blocked;this.pads[i].hp=clamp(Number(p.hp)||0,0,500);}});
      this.enemies.forEach(e=>Object.assign(e,at(this.routes[e.route],e.s)));this.projectiles=[];
    }
    build(padId,hero){const p=this.pads[padId],h=D.byId[hero];if(this.result!=='playing'||!p||p.blocked||!h||!this.loadout.includes(hero)||this.towers.some(t=>t.pad===padId)||this.coins<h.cost)return false;this.coins-=h.cost;this.towers.push({id:this.nextId++,pad:padId,hero,tier:1,cool:.15,spent:h.cost,x:p.x,y:p.y,priority:'first'});this.emit('change');return true;}
    upgrade(id){const t=this.towers.find(t=>t.id===id);if(!t||t.tier>=3||this.result!=='playing')return false;const cost=this.upgradeCost(t);if(this.coins<cost)return false;this.coins-=cost;t.spent+=cost;t.tier++;this.fx.push({kind:'ring',x:t.x,y:t.y,color:D.byId[t.hero].color,life:.6,max:.6,r:42});this.emit('change');return true;}
    upgradeCost(t){return Math.round(D.byId[t.hero].cost*D.economy.towerUpgrade[t.tier-1]);}
    sell(id){const t=this.towers.find(t=>t.id===id);if(!t||this.result!=='playing')return false;this.coins+=Math.floor(t.spent*.7);this.towers=this.towers.filter(x=>x.id!==id);this.emit('change');return true;}
    stats(t){const s=D.stats(t.hero,this.levels[t.hero]||1,t.tier);for(const a of this.towers){if(a===t)continue;const h=D.byId[a.hero],r=D.stats(a.hero,this.levels[a.hero]||1,a.tier).range;if(dist(a,t)<=r){if(h.kind==='aura')s.interval/=(1+.18+.035*(a.tier-1));if(h.kind==='song')s.range*=1.15;}}if(this.time<this.buffUntil)s.attack*=1.25;return s;}
    beginWave(){if(this.result!=='playing'||this.phase==='active'||this.wave>=this.map.waves)return false;this.wave++;this.phase='active';this.gap=0;const count=4+Math.floor((this.wave-1)/3)+Math.floor(this.index/3),types=this.map.enemyTypes;
      for(let i=0;i<count;i++){let type=types[(i+this.wave*2)%types.length];if(this.wave===1&&i<2)type=0;let routeIndex=this.routes.length===3&&this.wave<5?i%2:i%this.routes.length;this.queue.push({at:this.time+i*Math.max(.5,1.05-this.index*.035),type,route:routeIndex});}
      if(this.index===9&&this.wave===this.map.waves)this.queue.push({at:this.time+count, type:7,route:0});this.emit('wave',{wave:this.wave});return true;
    }
    spawn(type,routeIndex,s=0,child=false){if(this.enemies.length>=240)return;const d=D.enemies[type],scale=(1+this.index*.19)*(1+this.wave*.025),hp=Math.round(d.hp*scale);const e={id:this.nextId++,type,route:routeIndex,s:clamp(s,0,this.routes[routeIndex].length),hp,maxHp:hp,shield:d.kind==='shield'?Math.round(hp*.5):0,slowUntil:0,slow:1,burnUntil:0,burn:0,weakUntil:0,markUntil:0,summoned:0,summonAt:this.time+8,bossStage:0,dead:false,child};Object.assign(e,at(this.routes[routeIndex],e.s));this.enemies.push(e);this.emit('seen',{type});}
    damage(e,value,kind='magic'){if(!e||e.dead)return;const d=D.enemies[e.type];let armor=d.armor*(e.weakUntil>this.time?.5:1);if(kind==='burn')armor*=.3;value*=1-armor;if(e.markUntil>this.time)value*=1.25;const shield=Math.min(e.shield,value);e.shield-=shield;value-=shield;e.hp-=value;if(e.hp<=0)this.die(e);}
    die(e){if(e.dead)return;e.dead=true;const d=D.enemies[e.type];const reward=e.child?Math.max(2,Math.floor(d.reward*D.economy.childReward)):d.reward;this.coins+=reward;this.kills++;this.emit('kill',{type:e.type,reward});this.fx.push({kind:'ring',x:e.x,y:e.y,color:'#e9d69b',life:.4,max:.4,r:22});if(d.kind==='split'&&!e.child){this.spawn(0,e.route,e.s-12,true);this.spawn(0,e.route,e.s+9,true);}}
    hit(e,t,attack){if(!e||e.dead)return;const kind=D.byId[t.hero].kind;
      if(kind==='slow'||kind==='frostbeam'||kind==='chain'){e.slowUntil=this.time+(kind==='slow'?2.4:1.4);e.slow=Math.min(e.slowUntil>this.time?e.slow:1,.7-.02*((this.levels[t.hero]||1)-1));}
      if(kind==='burn'){e.burnUntil=this.time+3.5;e.burn=Math.max(e.burn,attack*.3);}
      if(kind==='weaken')e.weakUntil=this.time+3;
      if(kind==='mark')e.markUntil=this.time+3;
      this.damage(e,attack,kind==='heavy'?'physical':kind);
    }
    attack(t,targets,s){const h=D.byId[t.hero],target=targets[0],color=h.color;
      if(h.kind==='beam'||h.kind==='frostbeam'){const dx=target.x-t.x,dy=target.y-t.y,len=Math.hypot(dx,dy)||1;for(const e of targets){const ex=e.x-t.x,ey=e.y-t.y,along=(ex*dx+ey*dy)/len,side=Math.abs(ex*dy-ey*dx)/len;if(along>0&&along<=s.range&&side<27)this.hit(e,t,s.attack);}this.fx.push({kind:'beam',x:t.x,y:t.y-14,ex:t.x+dx/len*s.range,ey:t.y+dy/len*s.range,color,life:.24,max:.24});}
      else if(h.kind==='burn'){const angle=Math.atan2(target.y-t.y,target.x-t.x);for(const e of targets){const d=Math.atan2(Math.sin(Math.atan2(e.y-t.y,e.x-t.x)-angle),Math.cos(Math.atan2(e.y-t.y,e.x-t.x)-angle));if(Math.abs(d)<.72)this.hit(e,t,s.attack);}this.fx.push({kind:'flame',x:t.x,y:t.y-8,angle,r:s.range,color,life:.35,max:.35});}
      else if(h.kind==='chain'){let prev=t;for(const e of targets.slice(0,3)){this.hit(e,t,s.attack*(prev===t?1:.75));this.fx.push({kind:'beam',x:prev.x,y:prev.y,ex:e.x,ey:e.y,color,life:.3,max:.3});prev=e;}}
      else this.projectiles.push({x:t.x,y:t.y-15,target:target.id,hero:t.hero,towerId:t.id,attack:s.attack,color,speed:h.kind==='heavy'?260:390,kind:h.kind});
    }
    canUse(id){return this.result==='playing'&&(id!=='dew'||this.hp<10)&&(id!=='veil'||this.flowerShield===0)&&(id!=='hourglass'||(this.enemies.some(e=>!e.dead)&&this.slowUntil<=this.time))&&(id!=='dawn'||(this.towers.length>0&&this.buffUntil<=this.time));}
    use(id,p){if(!this.canUse(id))return false;if(id==='spark'&&(!p||distanceToRoutes(p,this.routes)>55))return false;
      if(id==='dew')this.hp=Math.min(10,this.hp+2);if(id==='veil')this.flowerShield=3;if(id==='hourglass')this.slowUntil=this.time+6;if(id==='dawn')this.buffUntil=this.time+8;
      if(id==='spark'){for(const e of [...this.enemies])if(dist(e,p)<=90)this.damage(e,120,'burn');this.fx.push({kind:'ring',...p,r:90,color:'#f0b279',life:.7,max:.7});}this.emit('change');return true;
    }
    update(dt){if(this.result!=='playing')return;this.time+=dt;this.fx.forEach(f=>f.life-=dt);this.fx=this.fx.filter(f=>f.life>0);
      for(let i=this.queue.length-1;i>=0;i--)if(this.queue[i].at<=this.time){const q=this.queue.splice(i,1)[0];this.spawn(q.type,q.route);}
      for(const e of [...this.enemies]){if(e.dead)continue;const d=D.enemies[e.type];if(e.burnUntil>this.time)this.damage(e,e.burn*dt,'burn');if(e.dead)continue;
        if(d.kind==='regen')e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.022*dt);
        if(d.kind==='summon'&&e.summoned<3&&this.time>=e.summonAt){e.summoned++;e.summonAt=this.time+9;this.spawn(0,e.route,e.s-15,true);}
        if(d.kind==='boss'&&e.bossStage<2&&e.hp/e.maxHp<1-(e.bossStage+1)*.33){e.bossStage++;this.spawn(1,e.route,e.s-20,true);this.spawn(2,e.route,e.s-38,true);}
        let speed=d.speed*(e.slowUntil>this.time?e.slow:1);if(e.slowUntil<=this.time)e.slow=1;if(this.slowUntil>this.time)speed*=d.kind==='boss'?.75:.5;
        e.s+=speed*dt;Object.assign(e,at(this.routes[e.route],e.s));if(e.s>=this.routes[e.route].length){e.dead=true;const blocked=Math.min(this.flowerShield,d.leak);if(this.flowerShield)this.flowerShield=0;this.hp=Math.max(0,this.hp-d.leak+blocked);this.emit('leak');if(this.hp===0){this.result='lost';this.emit('end',{result:'lost'});return;}}
      }
      for(const t of this.towers){t.cool-=dt;if(t.cool>0)continue;const s=this.stats(t);const obstacle=this.focus!==null?this.pads[this.focus]:null;
        if(obstacle?.blocked&&dist(t,obstacle)<s.range){obstacle.hp-=s.attack;t.cool=s.interval;this.fx.push({kind:'beam',x:t.x,y:t.y-10,ex:obstacle.x,ey:obstacle.y,color:D.byId[t.hero].color,life:.16,max:.16});if(obstacle.hp<=0){obstacle.blocked=false;this.coins+=35;this.focus=null;this.emit('change');}continue;}
        const targets=this.enemies.filter(e=>!e.dead&&dist(t,e)<=s.range);targets.sort(t.priority==='strong'?(a,b)=>b.hp-a.hp:(a,b)=>(this.routes[a.route].length-a.s)-(this.routes[b.route].length-b.s));if(targets.length){this.attack(t,targets,s);t.cool=s.interval;}
      }
      for(const p of this.projectiles){const e=this.enemies.find(e=>e.id===p.target&&!e.dead);if(!e){p.dead=true;continue;}const dx=e.x-p.x,dy=e.y-p.y,length=Math.hypot(dx,dy);if(length<=p.speed*dt+5){const t={hero:p.hero};if(p.kind==='blast'){for(const v of [...this.enemies])if(!v.dead&&dist(v,e)<60)this.hit(v,t,p.attack);this.fx.push({kind:'ring',x:e.x,y:e.y,r:60,color:p.color,life:.45,max:.45});}else this.hit(e,t,p.attack);p.dead=true;}else{p.x+=dx/length*p.speed*dt;p.y+=dy/length*p.speed*dt;}}
      this.projectiles=this.projectiles.filter(p=>!p.dead);this.enemies=this.enemies.filter(e=>!e.dead);
      if(this.phase==='active'&&!this.queue.length&&!this.enemies.length){if(this.wave===this.map.waves){this.result='won';this.emit('end',{result:'won'});}else{this.phase='gap';this.gap=5;this.emit('change');}}
      if(this.phase==='gap'){this.gap-=dt;if(this.gap<=0)this.beginWave();}
    }
  }
  window.GardenBattle={Battle,route,at,distanceToRoutes,makePads,clamp};
})();

/* Continuous encounters and a complimentary, upgradable coin workshop. */
(() => {
  'use strict';
  const D=window.DreamData,G=window.GardenBattle,R=window.GardenRenderer;
  const OriginalBattle=G.Battle;
  class ContinuousBattle extends OriginalBattle {
    constructor(index,levels,loadout,onEvent,snapshot) {
      super(index,levels,loadout,onEvent,snapshot);
      const f=snapshot&&snapshot.flow;
      this.workshopTier=f?Math.min(3,Math.max(1,Number(f.workshopTier)||1)):1;
      this.incomeClock=f?Math.max(0,Math.min(6,Number(f.incomeClock)||0)):0;
      this.producedCoins=f?Math.max(0,Number(f.producedCoins)||0):0;
      this.workshopPulse=-20;
      this.started=!!(f&&f.started);
      this.preparationEnd=f?Math.max(this.time,Number(f.preparationEnd)||this.time):this.time+12;
      this.waveStarts=f&&Array.isArray(f.waveStarts)?f.waveStarts.filter(Number.isFinite):[];
      this.suppliedThrough=f?Math.max(1,Number(f.suppliedThrough)||1):1;
      this.waveSupply=D.maps[index].waveSupply;
      const savedPad=f&&this.pads.find(p=>p.id===f.workshopPad&&!this.towers.some(t=>t.pad===p.id));
      const pad=savedPad||[...this.pads].reverse().find(p=>!this.towers.some(t=>t.pad===p.id));
      this.workshopPad=pad?pad.id:null;
      if(pad){pad.blocked=false;pad.producer=true;}
      if(!snapshot){this.coins=D.maps[index].startingCoins;this.phase='ready';}
    }
    save(){return {...super.save(),flow:{balanceVersion:D.balanceVersion,workshopTier:this.workshopTier,incomeClock:this.incomeClock,producedCoins:this.producedCoins,started:this.started,preparationEnd:this.preparationEnd,waveStarts:[...this.waveStarts],suppliedThrough:this.suppliedThrough,workshopPad:this.workshopPad}};}
    income(){return D.economy.workshopIncome[this.workshopTier];}
    workshopCost(){return D.economy.workshopUpgrade[this.workshopTier];}
    upgradeWorkshop(){const cost=this.workshopCost();if(this.result!=='playing'||!cost||this.coins<cost)return false;this.coins-=cost;this.workshopTier++;this.emit('change');return true;}
    build(padId,hero){if(padId===this.workshopPad)return false;return super.build(padId,hero);}
    beginWave(){
      if(this.started||this.result!=='playing')return false;
      this.started=true;this.phase='active';this.wave=1;this.queue=[];this.waveStarts=[];
      let cursor=this.time+.6;
      for(let wave=1;wave<=this.map.waves;wave++){
        this.waveStarts.push(cursor);
        const count=7+Math.floor(this.index/3)+Math.floor((wave-1)/3);
        const interval=Math.max(1.7,2.5-this.index*.085);
        const available=this.map.enemyTypes.slice(0,Math.min(this.map.enemyTypes.length,2+Math.floor((wave-1)/2)));
        for(let j=0;j<count;j++){
          let type=available[(j+wave-1)%available.length];
          if(this.index===0){type=wave>=3&&j%4===2?1:0;}
          else if(wave===1&&j<3)type=0;
          if(type===6&&j%3!==1)type=0;
          if(type===3&&j%3===2)type=1;
          const entryCount=this.routes.length===3&&wave<=4?2:this.routes.length;
          this.queue.push({at:cursor,type,route:(j+wave-1)%entryCount,sourceWave:wave});
          cursor+=interval+(j%4===3?.55:0);
        }
        if(this.index===9&&wave===this.map.waves){this.queue.push({at:cursor,type:7,route:0,sourceWave:wave});cursor+=3;}
        cursor+=wave===this.map.waves?0:3;
      }
      this.emit('wave');return true;
    }
    spawn(type,routeIndex,s=0,child=false){
      const before=this.enemies.length;
      super.spawn(type,routeIndex,s,child);
      const e=this.enemies.length>before?this.enemies[this.enemies.length-1]:null;
      if(e){const factor=this.map.pressure*(1+this.index*.14)/(1+this.index*.19)*(1+(this.wave-1)*this.map.healthGrowth)/(1+this.wave*.025);e.hp*=factor;e.maxHp*=factor;e.shield*=factor;}
    }
    update(dt){
      if(this.result!=='playing')return;
      if(!this.started&&this.time+dt>=this.preparationEnd)this.beginWave();
      if(this.started){
        const current=this.waveStarts.filter(t=>t<=this.time+dt+.0001).length;
        this.wave=Math.max(1,current);
        while(this.suppliedThrough<this.wave){this.suppliedThrough++;this.coins+=this.waveSupply;this.emit('supply',{amount:this.waveSupply});}
      }
      this.incomeClock+=dt;
      while(this.incomeClock>=6){this.incomeClock-=6;const amount=this.income();this.coins+=amount;this.producedCoins+=amount;this.workshopPulse=this.time;this.emit('income',{amount});}
      super.update(dt);
    }
  }
  window.GardenBattle={...G,Battle:ContinuousBattle};
  const workshop=new Image();workshop.src='assets/workshop.svg';
  const originalDraw=R.draw;
  R.draw=(canvas,battle,selectedPad,aimItem)=>{
    originalDraw(canvas,battle,selectedPad,aimItem);
    const pad=battle.pads.find(p=>p.id===battle.workshopPad);if(!pad)return;
    const ctx=canvas.getContext('2d');ctx.save();ctx.setTransform(canvas.width/960,0,0,canvas.height/600,0,0);
    if(selectedPad===pad.id){ctx.beginPath();ctx.ellipse(pad.x,pad.y+3,39,19,0,0,Math.PI*2);ctx.strokeStyle='#eed28a';ctx.lineWidth=3;ctx.stroke();}
    if(workshop.complete&&workshop.naturalWidth)ctx.drawImage(workshop,pad.x-38,pad.y-65,76,76);
    else{ctx.fillStyle='#d1af60';ctx.fillRect(pad.x-21,pad.y-38,42,40);}
    ctx.font='bold 12px Georgia, serif';ctx.textAlign='center';ctx.fillStyle='#493c2c';ctx.fillText(`+${battle.income()} / 6s`,pad.x,pad.y+26);
    const age=battle.time-battle.workshopPulse;
    if(age>=0&&age<1.6){ctx.globalAlpha=1-age/1.6;ctx.fillStyle='#fff0a9';ctx.strokeStyle='#695332';ctx.lineWidth=3;ctx.font='bold 20px Georgia, serif';const y=pad.y-69-age*22;ctx.strokeText(`+${battle.income()}`,pad.x,y);ctx.fillText(`+${battle.income()}`,pad.x,y);}
    ctx.restore();
  };
})();

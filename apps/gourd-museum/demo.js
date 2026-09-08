'use strict';
(()=>{
 const steps=[
  {at:0,name:'手机拍照',title:'手机拍照，记录真实藏品',copy:'光线充足、主体清晰；拍下家中各式各样的葫芦。',badge:'拍摄要求 · 光线与清晰度'},
  {at:5,name:'自动抠图',title:'上传照片，分离杂乱背景',copy:'原 MVP 自动提取葫芦轮廓，将图片转为可陈列的伪 3D 展品。',badge:'上传 → 背景分离 → 图片展品'},
  {at:10,name:'自由策展',title:'书架之外，也有它的位置',copy:'书架、桌面、矮柜和地面，都可以成为藏品的展位。',badge:'平面图片 · 空间陈列'},
  {at:18,name:'一键重排',title:'同一批藏品，换一种相遇',copy:'一键打乱所有上架葫芦的位置，快速尝试新的陈列组合。',badge:'一键打乱 · 重新布展'},
  {at:24,name:'家具换肤',title:'让空间，也拥有自己的气质',copy:'更换家具皮肤与空间氛围，为不同的珍藏找到合适的背景。',badge:'胡桃木 / 浅竹木 / 墨色描金'}
 ];
 const $=s=>document.querySelector(s),room=$('#room');let time=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,frame=0,last=0,active=-1,lastSent=-1;
 const cutout=$('.gourd-art').cloneNode(true);cutout.querySelector('linearGradient').id='cutout-skin';cutout.querySelector('[fill]').setAttribute('fill','url(#cutout-skin)');cutout.removeAttribute('aria-label');$('#cutout-art').append(cutout);
 $('#chapters').innerHTML=steps.map((s,i)=>`<button type="button" data-step="${i}" aria-current="false">${String(i+1).padStart(2,'0')} ${s.name}</button>`).join('');
 function update(){
  const index=steps.findLastIndex(s=>time>=s.at),s=steps[index];
  if(index!==active){active=index;$('.stage').dataset.step=index;$('.stage').dataset.room=String(index>=2);$('#step-number').textContent=String(index+1).padStart(2,'0')+' / 05';$('#step-title').textContent=s.title;$('#step-copy').textContent=s.copy;$('#action-badge').textContent=s.badge;$('#photo-label').textContent=index===1?'上传照片 · 背景分离中':'手机照片 · 主体清晰';document.querySelectorAll('[data-step]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-current',String(+b.dataset.step===index));});}
  $('.stage').style.setProperty('--scan',((time-5)/5*100)%100+'%');$('#progress').style.width=time/32*100+'%';$('#time').textContent='00:'+String(Math.floor(time)).padStart(2,'0')+' / 00:32';$('#play').textContent=playing?'暂停':'播放';$('#play').setAttribute('aria-label',playing?'暂停演示':'播放演示');
  if(Math.abs(time-lastSent)>.025||!playing){room.contentWindow?.postMessage({type:'gourd-tour',time},location.origin);lastSent=time;}
 }
 function tick(now){frame=0;if(!playing||document.hidden)return;if(last)time=Math.min(32,time+(now-last)/1000);last=now;if(time>=32)playing=false;update();if(playing)frame=requestAnimationFrame(tick);}
 function start(){last=0;if(playing&&!frame&&!document.hidden)frame=requestAnimationFrame(tick);update();}
 function seek(t){time=t;last=0;lastSent=-1;update();}
 $('#play').onclick=()=>{playing=!playing;if(playing&&time>=32)seek(0);if(!playing){cancelAnimationFrame(frame);frame=0;}start();};$('#replay').onclick=()=>{playing=true;seek(0);start();};
 $('#chapters').onclick=e=>{const b=e.target.closest('button');if(b)seek(steps[+b.dataset.step].at+.1);};
 document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);frame=0;last=0;if(!document.hidden)start();});
 addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='portfolio-game-pause'){playing=false;cancelAnimationFrame(frame);frame=0;update();}});
 addEventListener('pagehide',()=>cancelAnimationFrame(frame));room.addEventListener('load',()=>{lastSent=-1;update();});
 window.GourdFilm={seek,pause(){playing=false;cancelAnimationFrame(frame);frame=0;update();},play(){playing=true;start();},get time(){return time;}};
 start();
})();

'use strict';
(() => {
const M=ScrollWorldModel,$=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)],escape=M.escape;
const works={...workDetails,...window.DREAM_EXTRA};
const validImage=s=>/^images\/[\w./-]+$/.test(s||'')?s:'';
const ids=Object.keys(works).filter(id=>id!=='more');
const contactEmail='i6619774588@163.com';
const exhibition=ScrollExhibits.build(works),group=category=>exhibition.groups.find(g=>g.category===category).works;
const selection=group('brand'),cast=group('character'),filmIds=group('film');
const covers=exhibition.covers,shortNames=exhibition.names,captions=exhibition.captions;
let reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,activeAtlas=0,activeProject=null,projectIndex=0,projectGallery=[],deck=[],drawing=false,drawTimer=null,windowZ=10,toastTimer;
const desktop=$('#desktop-modal'),projectDialog=$('#project-modal'),chapters=$$('.scroll-chapter');
document.body.classList.toggle('reduce-motion',reduce);
$('#motion-toggle').setAttribute('aria-pressed',String(reduce));
$('#motion-toggle').textContent=reduce?'恢复动态':'减少动态';
function toast(text){const e=$('#world-toast');e.textContent=text;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),2200);}
$('#atlas-list').innerHTML=exhibition.atlas;
function selectAtlas(index){if(index<0||index>=selection.length)return;activeAtlas=index;$$('[data-atlas-item]').forEach((el,i)=>{el.classList.toggle('active',i===index);$('button',el).setAttribute('aria-pressed',String(i===index));});$('#atlas-caption').textContent=captions[selection[index]];}
$$('[data-atlas]').forEach(button=>{button.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')selectAtlas(+button.dataset.atlas);});button.addEventListener('focus',()=>selectAtlas(+button.dataset.atlas));button.addEventListener('click',()=>selectAtlas(+button.dataset.atlas));});
$('#atlas-open').addEventListener('click',()=>openProject(selection[activeAtlas]));
selectAtlas(0);
$('#orbit-cast').innerHTML=exhibition.orbit;
$('#film-exhibits').innerHTML=exhibition.screening;
$('#product-exhibits').innerHTML=exhibition.products;
$('#paper-exhibits').innerHTML=exhibition.paper;
$('#archive-count').textContent=ids.length+' 件作品 · '+exhibition.groups.length+' 个创作分类';
let filmIndex=0,lastFilmScrollIndex=-1,gameInView=false;
function selectFilm(index){
 if(!Number.isInteger(index)||index<0||index>=filmIds.length)return;
 const id=filmIds[index],work=works[id];filmIndex=index;
 $$('.film-choice').forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index));});
 $('#film-still').src=work.cover;$('#film-still').alt=work.title+'的封面';
 $('#film-title').textContent=shortNames[id]||work.title;$('#film-description').textContent=captions[id]||work.desc;
 const video=ScrollExhibits.videoURL(work);$('#film-watch').hidden=!video;$('#film-watch').href=video;
 $('#film-project').dataset.project=id;
 if(!reduce){$('#film-still').animate?.([{opacity:.25,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:550,easing:'ease-out'});}
}
$$('[data-film]').forEach(button=>button.addEventListener('click',()=>selectFilm(Number(button.dataset.film))));
function selectInterface(id,index){
 if(!group('product').includes(id)||!Number.isInteger(index))return;
 const item=works[id].gallery[index];if(!item)return;
 const image=$('[data-product-image="'+id+'"]');image.src=item.src;image.alt=item.caption||works[id].title;
 $$('[data-interface="'+id+'"]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.step)===index)));
}
$$('[data-interface]').forEach(button=>button.addEventListener('click',()=>selectInterface(button.dataset.interface,Number(button.dataset.step))));
$$('.paper-preview').forEach(button=>{button.addEventListener('pointermove',e=>{if(reduce||e.pointerType==='touch')return;const r=button.getBoundingClientRect();button.style.setProperty('--tilt',((e.clientX-r.left)/r.width-.5)*7+'deg');});button.addEventListener('pointerleave',()=>button.style.setProperty('--tilt','0deg'));});
const gameThemeParam='theme=starlight';
let activeArcadeGame=$('#arcade-reveal')?.dataset?.activeGame||'snake-game';
function withTheme(url){if(!url)return'';return url.includes('theme=')?url:(url+(url.includes('?')?'&':'?')+gameThemeParam);}
function pauseGame(){for(const id of['arcade-game','modal-game'])$('#'+id)?.contentWindow?.postMessage({type:'portfolio-game-pause'},location.origin);}
function setArcadeMeta(id){const work=works[id];if(!work)return;activeArcadeGame=id;const buttonBar=$('#arcade-game-switch');if(buttonBar){$$('[data-arcade-game]',buttonBar).forEach(b=>{const active=b.dataset.arcadeGame===id;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});}$('#arcade-game-title').textContent=work.title;$('#arcade-project-link').dataset.project=id;$('#arcade-reveal').dataset.activeGame=id;$('#arcade-hint').textContent=work.gameHint||(id==='snake-game'?'方向键或 WASD 控制小蛇 · Esc 离开游戏':'在网格里放置角色防守波次 · 鼠标或触屏点击即可，Esc 离开游戏');}
function mountArcade(){if($('#light-stage').dataset.lit!=='true')return;const game=works[activeArcadeGame];if(!game?.gameEmbed)return;const mount=$('#arcade-mount');mount.innerHTML='';const frame=document.createElement('iframe');frame.id='arcade-game';frame.title=game.title+' · 互动小游戏';frame.src=withTheme(game.gameEmbed);frame.addEventListener('load',()=>{if($('#light-stage').dataset.lit!=='true')pauseGame();});mount.appendChild(frame);}
function openArcadeGame(id){if(!works[id]?.gameEmbed)return;setArcadeMeta(id);mountArcade();}
addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='portfolio-game-exit')return;if(event.source===$('#arcade-game')?.contentWindow)$('#light-switch').focus({preventScroll:true});else if(event.source===$('#modal-game')?.contentWindow)projectDialog.close();});
const orbitElements=$$('.orbit-character');
function updateScroll(){
 const vh=innerHeight;let current=0;
 chapters.forEach((chapter,i)=>{
  const r=chapter.getBoundingClientRect(),p=reduce?.45:M.progress(r.top,chapter.offsetHeight,vh),focus=M.clamp((vh-r.top)/(vh*.65));
  chapter.style.setProperty('--p',p.toFixed(4));chapter.style.setProperty('--focus',focus.toFixed(4));
  if(r.top<vh*.5&&r.bottom>vh*.3)current=i;
  if(chapter.dataset.scene==='opening'){const phase=M.phases(p);chapter.style.setProperty('--title',reduce?1:phase.title);chapter.style.setProperty('--verse',reduce?0:phase.verse);}
  if(chapter.dataset.scene==='orbit'){
   const phase=M.phases(p);chapter.style.setProperty('--disc-y',phase.discY);chapter.style.setProperty('--rotation',phase.rotation);
   let selected=0,best=-Infinity;orbitElements.forEach((el,j)=>{const point=M.orbit(p,j,cast.length);el.style.left=point.x+'%';el.style.top=point.y+'%';el.style.opacity=point.opacity;el.style.pointerEvents=point.opacity>.3?'auto':'none';el.inert=point.opacity<.3;if(point.opacity>best){best=point.opacity;selected=j;}});$('#orbit-name').textContent=shortNames[cast[selected]];
  }
  if(chapter.dataset.scene==='screening'&&!reduce&&r.top<vh*.6&&r.bottom>vh*.4){const index=M.sequence(M.range(p,.06,.94),filmIds.length);if(index!==lastFilmScrollIndex){lastFilmScrollIndex=index;selectFilm(index);}}
  if(chapter.dataset.scene==='theatre'){const visible=r.top<vh*.7&&r.bottom>vh*.3;if(gameInView&&!visible)pauseGame();gameInView=visible;}
 });
 $$('.chapter-nav a').forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
 worldProgress=M.clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-vh));
}
let scrollQueued=false,worldProgress=0;
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;updateScroll();if(reduce)paintCosmos(0);});}},{passive:true});
addEventListener('resize',updateScroll);
$('#motion-toggle').addEventListener('click',()=>{reduce=!reduce;document.body.classList.toggle('reduce-motion',reduce);$('#motion-toggle').setAttribute('aria-pressed',String(reduce));$('#motion-toggle').textContent=reduce?'恢复动态':'减少动态';updateScroll();if(!reduce)startCosmos();else{cancelAnimationFrame(cosmosFrame);cosmosFrame=0;trail=[];paintCosmos(0);}});
setArcadeMeta(activeArcadeGame);
$('#light-switch').addEventListener('click',()=>{const lit=$('#light-stage').dataset.lit!=='true';$('#light-stage').dataset.lit=String(lit);$('#light-switch').setAttribute('aria-checked',String(lit));$('#light-state').textContent=lit?'游戏已唤醒 · 再点可关灯':'点击开关 · 唤醒游戏';$('#arcade-reveal').inert=!lit;if(lit)mountArcade();else pauseGame();});
$('#disc-toggle').addEventListener('click',()=>{const paused=$('#disc-toggle').getAttribute('aria-pressed')==='true';$('#disc-toggle').setAttribute('aria-pressed',String(!paused));$('#disc-toggle').setAttribute('aria-label',paused?'开始光盘转动':'暂停光盘转动');$('#disc-toggle').style.animationPlayState=paused?'paused':'running';});
const canvas=$('#cosmos'),ctx=canvas.getContext('2d');let w=innerWidth,h=innerHeight,cosmosFrame=0,lastTime=0,trail=[];
const stars=Array.from({length:180},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+.25,phase:Math.random()*6.28}));
const mouse={x:-1000,y:-1000};
function resizeCosmos(){if(!ctx)return;w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.6);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);paintCosmos(0);}
function paintCosmos(t){if(!ctx)return;ctx.fillStyle='#101824';ctx.fillRect(0,0,w,h);const centers=[[.25,.57,.56,[69,87,112]],[.8,.33,.55,[73,78,111]],[.53,.86,.7,[51,88,87]]];centers.forEach(([x,y,size,c],i)=>{const px=(x+Math.sin(t*.00005+i+worldProgress*2)*.12)*w,py=(y-worldProgress*.2)*h;const g=ctx.createRadialGradient(px,py,0,px,py,w*size);g.addColorStop(0,'rgba('+c.join(',')+',.35)');g.addColorStop(1,'rgba('+c.join(',')+',0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);});stars.forEach(s=>{const x=s.x*w+Math.sin(s.phase+t*.00007)*4,y=((s.y+worldProgress*.17)%1)*h;ctx.globalAlpha=.22+(Math.sin(s.phase+t*.0004)*.5+.5)*.55;ctx.fillStyle='#e6d8b7';ctx.beginPath();ctx.arc(x,y,s.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;for(let i=trail.length-1;i>=0;i--){const p=trail[i];ctx.globalAlpha=p.life;ctx.strokeStyle='#c7b393';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(p.x-3,p.y);ctx.lineTo(p.x+3,p.y);ctx.moveTo(p.x,p.y-3);ctx.lineTo(p.x,p.y+3);ctx.stroke();p.life-=.04;p.y-=.2;if(p.life<=0)trail.splice(i,1);}ctx.globalAlpha=1;}
function tick(t){if(reduce||document.hidden){cosmosFrame=0;return;}if(t-lastTime>32){paintCosmos(t);lastTime=t;}cosmosFrame=requestAnimationFrame(tick);}
function startCosmos(){if(!cosmosFrame&&!reduce)cosmosFrame=requestAnimationFrame(tick);}
addEventListener('pointermove',e=>{if(reduce||e.pointerType==='touch'||desktop.open||projectDialog.open||document.body.classList.contains('atelier-edition'))return;if(Math.hypot(e.clientX-mouse.x,e.clientY-mouse.y)>15&&trail.length<30){trail.push({x:e.clientX,y:e.clientY,life:.7});mouse.x=e.clientX;mouse.y=e.clientY;}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(cosmosFrame);cosmosFrame=0;pauseGame();}else startCosmos();});
addEventListener('resize',resizeCosmos);
const folderDefinitions=[['brand','品牌与空间'],['character','角色图鉴'],['film','影像放映室'],['product','产品与交互'],['print','字体与印刷'],['play','小游戏'],['tarot','植物塔罗'],['about','关于我']];
$('#desktop-folders').innerHTML=folderDefinitions.map(([id,name])=>'<button type="button" class="desktop-folder" data-folder="'+id+'"><span class="folder-icon" aria-hidden="true"></span><span>'+name+'</span></button>').join('');
function openDesktop(){if(!desktop.open)desktop.showModal();syncModal();}
function openContact(){
 WorkShowcase.pause(projectDialog);clearTimeout(drawTimer);drawing=false;
 $('#project-type').textContent='CONTACT / EMAIL';
 $('#project-content').innerHTML=`<section class="contact-card"><p class="kicker">LET'S KEEP IN TOUCH</p><h2 id="project-title">联系我</h2><p>如果有合适的岗位或合作机会，欢迎给我写信。</p><label for="contact-email">电子邮箱</label><div class="contact-email-row"><input id="contact-email" type="text" value="${escape(contactEmail)}" readonly spellcheck="false" autocomplete="off"><button type="button" data-copy-contact>复制邮箱</button></div><p id="contact-copy-status" class="contact-copy-status" role="status" aria-live="polite">复制邮箱地址，即可在你的邮箱中给我写信。</p></section>`;
 if(!projectDialog.open)projectDialog.showModal();syncModal();
}
async function copyContact(){
 const button=$('[data-copy-contact]'),field=$('#contact-email'),status=$('#contact-copy-status');
 if(!button||!field||!status)return;
 button.disabled=true;
 try{
  await navigator.clipboard.writeText(contactEmail);
  if(!button.isConnected)return;
  button.textContent='已复制 ✓';status.textContent='邮箱已复制，可以粘贴到收件人栏。';
 }catch{
  if(!field.isConnected)return;
  field.focus();field.select();field.setSelectionRange(0,field.value.length);
  status.textContent='请复制上方已选中的邮箱地址。';
 }finally{if(button.isConnected)button.disabled=false;}
}
function syncModal(){const open=desktop.open||projectDialog.open;document.body.style.overflow=open?'hidden':'';if(open)pauseGame();if(projectDialog.open)WorkShowcase.pause(desktop);}
function closeDesktop(){WorkShowcase.pause(desktop);desktop.close();}
desktop.addEventListener('close',()=>{WorkShowcase.pause(desktop);syncModal();});
desktop.addEventListener('cancel',()=>WorkShowcase.pause(desktop));

projectDialog.addEventListener('close',()=>{WorkShowcase.pause(projectDialog);clearTimeout(drawTimer);drawing=false;$('#modal-game')?.remove();syncModal();});
$$('[data-close-desktop]').forEach(b=>b.addEventListener('click',closeDesktop));
$('[data-close-project]').addEventListener('click',()=>{WorkShowcase.pause(projectDialog);projectDialog.close();});
projectDialog.addEventListener('cancel',()=>WorkShowcase.pause(projectDialog));
for(const d of[desktop,projectDialog])d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
function clock(){const now=new Date();$('#desktop-clock').textContent=now.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});}
clock();let clockTimer=setInterval(clock,30000);
function createWindow(id,title,html){const old=$('[data-window="'+id+'"]');if(old){old.style.zIndex=++windowZ;old.focus({preventScroll:true});return old;}const win=document.createElement('section');win.className='desktop-window'+(id==='about'?' about-window':'');win.dataset.window=id;win.setAttribute('aria-label',title);win.tabIndex=-1;win.style.zIndex=++windowZ;const count=$$('.desktop-window').length;win.style.left=id==='about'?'8%':(30+count%3*3)+'%';win.style.top=id==='about'?'6%':(7+count%3*4)+'%';win.innerHTML='<div class="window-bar"><h3>'+escape(title)+'</h3><button type="button" data-close-window aria-label="关闭'+escape(title)+'">×</button></div><div class="window-content">'+html+'</div>';$('#desktop-windows').appendChild(win);$('[data-close-window]',win).addEventListener('click',()=>{WorkShowcase.pause(win);win.remove();$('#desktop-status').textContent='READY / 作品档案';});win.addEventListener('pointerdown',()=>win.style.zIndex=++windowZ);const bar=$('.window-bar',win);let dragging=null;bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||innerWidth<650)return;const parent=win.parentElement.parentElement.getBoundingClientRect(),rect=win.getBoundingClientRect();dragging={x:e.clientX,y:e.clientY,left:rect.left-parent.left,top:rect.top-parent.top};bar.setPointerCapture(e.pointerId);});bar.addEventListener('pointermove',e=>{if(!dragging)return;const surface=$('.desktop-surface'),nx=M.clamp(dragging.left+e.clientX-dragging.x,0,Math.max(0,surface.clientWidth-win.offsetWidth)),ny=M.clamp(dragging.top+e.clientY-dragging.y,0,Math.max(0,surface.clientHeight-80));win.style.left=nx+'px';win.style.top=ny+'px';});bar.addEventListener('pointerup',()=>dragging=null);bar.addEventListener('pointercancel',()=>dragging=null);win.focus({preventScroll:true});return win;}
function openFolder(id){const definition=folderDefinitions.find(d=>d[0]===id);if(!definition)return;if(id==='tarot'){openTarot();return;}if(id==='about'){openAbout();return;}const filtered=ids.filter(key=>M.type(works[key])===id);const entries=filtered.map(key=>'<button class="file-item" type="button" data-project="'+key+'"><img src="'+validImage(covers[key]||works[key].cover)+'" alt="" loading="lazy"><span>'+escape(works[key].title)+'</span></button>').join('');const count=filtered.length;createWindow(id,definition[1]+' / '+count+' 项','<div class="window-items">'+entries+'</div>');$('#desktop-status').textContent=definition[1]+' / '+count+' 项';}
function openAbout(){
 const projects=[
  {id:'gourd-museum',label:'合作项目 · 数字展陈',text:'朋友收藏了许多葫芦，也是一位手艺人。这个项目把手机照片经自动抠图变成伪 3D 展品，再放进书架、桌柜和地面自由策展。我参与展陈、作品上架和家具皮肤设计，让真实的收藏有一个新的展示空间。'},
  {id:'project-management',label:'个人系统 · 项目与任务',text:'创作时，想法、资料和待办很容易散落在不同地方。我把它们组织进一个工作台，让每个项目的进展和下一步更清楚。'},
  {id:'digital-library',label:'个人系统 · 阅读与知识',text:'把书籍、阅读笔记和学习资源放在同一个知识空间里，尝试让收藏下来的内容更容易被找回，也更容易用于下一次创作。'},
  {id:'life-os',label:'个人系统 · 记录与复盘',text:'从每日记录和复盘出发，把目标、任务、习惯与 AI 助手放在一起，探索一种更适合自己的生活管理方式。'},
  {id:'stock-radar',label:'个人系统 · 信息与研究',text:'从市场概览到板块和个股，把分散的信息整理成有层次的研究界面。这也是一次关于信息密度、阅读顺序和重点呈现的设计练习。'},
  {id:'pet-app',label:'产品设计 · 可交互原型',text:'围绕宠物照护设计信息与操作流程，尝试让健康记录和日常管理更直观，也让工具的视觉表达保留一点亲近感。'}
 ];
 openDesktop();
 createWindow('about','ABOUT / 黄佩嘉',`
  <div class="desktop-about profile-archive">
   <aside class="profile-portrait"><img src="images/avatar-home-shoes-cutout.png" alt="黄佩嘉人物形象"><p>黄佩嘉<small>PEIJIA HUANG</small></p><button class="profile-contact" type="button" data-contact aria-haspopup="dialog">联系我 ↗</button></aside>
   <div class="profile-text">
    <p class="profile-kicker">ABOUT ME / DESIGN & EXPLORATION</p>
    <h3>你好，我是佩嘉。</h3>
    <p class="profile-education-line">多伦多大学 · 艺术与艺术史专业 · 已毕业</p>
    <p class="profile-intro">我做品牌视觉、角色、字体与影像，也喜欢把想法继续往前推一步，做成可以使用的工具、可以亲自游玩的游戏。在这些看起来不同的作品里，我一直在关心相似的事情：一个形象为什么让人记住，一种颜色和材质能带来什么感受，一个界面又怎样让人愿意继续探索。</p>
    <p class="profile-intro">我偏爱有性格、也有一点小情绪的角色，希望它们让人产生亲近感，甚至在某个时刻带来陪伴。我喜欢软陶和毛绒的柔软，也着迷于珠宝、玻璃的光泽；印象派的光色、版画的纹理，以及自然形态和传统文化里的意象，都会成为我的视觉线索。我会反复尝试它们怎样出现在同一个画面里，形成自己的表达。</p>
    <p class="profile-intro">很多作品都从身边的事情开始：想把日常的资料整理得更顺手，或是为朋友的手作找到合适的展示方式。我也借助 AI 生成工具与辅助编程，把原本停留在草图里的想法做出来，再通过筛选、调整和实际体验继续打磨。我希望作品有自己的审美和情绪，也能让使用它的人感到顺手、愿意停留。</p>
    <section class="profile-section" aria-labelledby="profile-projects">
     <h4 id="profile-projects">从日常与合作中长出来的项目</h4>
     <p class="profile-section-intro">这些实践把我的视觉兴趣带到了具体的使用场景中。下面保留项目图片与设计说明，完成了互动样例的作品也可以直接体验。</p>
     <div class="profile-project-grid">
      ${projects.map(item=>{const w=works[item.id];return `<article class="profile-project-card" id="profile-${item.id}">
       <button type="button" class="profile-card-image" data-project="${item.id}" aria-label="查看${escape(w.title)}"><img src="${validImage(w.cover||w.gallery?.[0]?.src)}" alt="${escape(w.title)}项目界面" loading="lazy"></button>
       <small>${escape(item.label)}</small><h5>${escape(w.title)}</h5><p>${escape(item.text)}</p>
       <div class="profile-card-links"><button class="profile-project-link" type="button" data-project="${item.id}">查看项目 ↗</button>${w.interactiveEmbed?`<button class="profile-project-link" type="button" data-experience="${item.id}">${item.id==='gourd-museum'?'观看策展演示':'体验交互原型'} ↗</button>`:''}</div>
      </article>`;}).join('')}
     </div>
     <aside class="profile-context-note"><h5>还有一些小工具，藏在日常使用里</h5><p>我也做过 BOSS 直聘智能岗位筛选工具。这是一款浏览器插件，用于辅助整理筛选条件、进行岗位初筛。它和这些个人系统一样，都来自一个很具体的想法：让重复的信息处理少一点，让时间留给更值得投入的事情。</p></aside>
    </section>
    <p class="profile-footer">还在尝试，也还在慢慢找到自己的表达。谢谢你来看看我的作品。</p>
   </div>
  </div>`);
}
$('[data-home-folders]').addEventListener('click',()=>{WorkShowcase.pause($('#desktop-windows'));$('#desktop-windows').innerHTML='';$('#desktop-status').textContent='READY / 作品档案';});
function projectLinks(id){const w=works[id],video=(w.list||[]).find(s=>s.startsWith('视频链接：'))?.match(/https:\/\/[^\s]+/)?.[0];let links=video?'<a href="'+escape(video)+'" target="_blank" rel="noopener">观看完整影片 ↗</a>':'';if(id==='word-of-plants')links+='<button type="button" data-tarot>抽一张植物牌 ↗</button>';if(id==='cattea'||id==='woola')links+='<a href="brand-experience.html#'+id+'">探索品牌空间 ↗</a>';if(w.interactiveEmbed)links+='<a href="'+escape(w.interactiveEmbed.split('?')[0])+'" data-experience="'+id+'">'+escape(w.interactiveLabel||'体验原型 ↗')+'</a>';if(w.gameEmbed)links+='<button type="button" data-game="'+id+'">开始游戏 ↗</button>';return links;}
function openProject(id){if(!Object.hasOwn(works,id)||id==='more')return;WorkShowcase.pause(projectDialog);clearTimeout(drawTimer);drawing=false;activeProject=id;projectIndex=0;const w=works[id];projectGallery=(w.gallery||[]).filter(x=>validImage(x.src));if(!projectGallery.length&&validImage(w.cover))projectGallery=[{src:w.cover,caption:w.title}];$('#project-type').textContent=w.cat;$('#project-content').innerHTML='<div class="project-content-inner"><h2 id="project-title">'+escape(w.title)+'</h2><div class="project-view"><div class="project-image"><img id="gallery-image" src="'+(projectGallery[0]?.src||validImage(w.cover))+'" alt="'+escape(projectGallery[0]?.caption||w.title)+'"><nav aria-label="作品图片"><button type="button" data-gallery="-1" aria-label="上一张图片">←</button><span id="gallery-position"></span><button type="button" data-gallery="1" aria-label="下一张图片">→</button></nav><p id="gallery-caption" class="gallery-caption" aria-live="polite"></p><div class="project-links"><a id="full-image" href="'+(projectGallery[0]?.src||validImage(w.cover))+'" target="_blank" rel="noopener">打开原图 ↗</a></div></div><div class="project-notes"><p>'+escape(w.desc)+'</p><ul>'+(w.list||[]).filter(s=>!s.startsWith('视频链接：')).map(s=>'<li>'+escape(s)+'</li>').join('')+'</ul><div class="project-links">'+projectLinks(id)+'</div></div></div>'+WorkShowcase.render(w)+'</div>';updateGallery();if(!projectDialog.open)projectDialog.showModal();syncModal();}
function updateGallery(){if(!projectGallery.length)return;const item=projectGallery[projectIndex];$('#gallery-image').src=item.src;$('#gallery-image').alt=item.caption||works[activeProject].title;$('#gallery-position').textContent=String(projectIndex+1).padStart(2,'0')+' / '+String(projectGallery.length).padStart(2,'0');$('#full-image').href=item.src;$('#gallery-caption').textContent=item.caption||works[activeProject].title;$$('[data-gallery]').forEach(b=>b.disabled=projectGallery.length<2);}
function openTarot(){clearTimeout(drawTimer);drawing=false;deck=PlantTarot.shuffle();$('#project-type').textContent='THE WORD OF PLANTS / 植物神谕';$('#project-content').innerHTML='<section class="tarot-experience"><p class="kicker">A QUESTION, A LEAF, A MOMENT</p><h2 id="project-title">植物之语</h2><p id="tarot-status" role="status">心里留一个问题，选一张植物牌。</p><div class="tarot-choice-grid">'+deck.map((_,i)=>'<button class="tarot-card-back" type="button" data-tarot-card="'+i+'" aria-label="选择第'+(i+1)+'张牌"><span>✧</span><small>'+String(i+1).padStart(2,'0')+'</small></button>').join('')+'</div><div id="tarot-reading" hidden></div><p class="tarot-note">十二张植物牌 · 单张正位 · 借植物的象征，与自己对话</p><button type="button" class="line-link" data-project="word-of-plants">看看这套卡牌的设计 ↗</button></section>';if(!projectDialog.open)projectDialog.showModal();syncModal();}
function drawTarot(i){if(drawing||!Number.isInteger(i)||i<0||i>=deck.length)return;drawing=true;const card=deck[i];$$('[data-tarot-card]').forEach(b=>b.disabled=true);$('#tarot-status').textContent='一片叶子，正在展开…';drawTimer=setTimeout(()=>{const reading=$('#tarot-reading');if(!reading)return;$('.tarot-choice-grid').hidden=true;reading.hidden=false;reading.className='tarot-reading';reading.innerHTML='<div class="tarot-crop" role="img" aria-label="'+escape(card.name+' · '+card.plant)+'" style="'+escape(PlantTarot.artStyle(card))+'"></div><div><small>'+escape(card.number+' / '+card.english)+'</small><h3>'+escape(card.name)+'</h3><small>'+escape(card.plant+' · '+card.words)+'</small><p>'+escape(card.meaning)+'</p><small>问问自己</small><p>'+escape(card.question)+'</p><small>可以试试</small><p>'+escape(card.action)+'</p><button type="button" class="tarot-reset" data-tarot>再抽一张 ↻</button></div>';$('#tarot-status').textContent='你抽到了：'+card.name+' · '+card.plant;$('[data-tarot]',reading).focus({preventScroll:true});},reduce?0:550);}
function openExperienceModal(id){
 const w=works[id];if(!w?.interactiveEmbed)return;
 WorkShowcase.pause(projectDialog);
 const src=withTheme(w.interactiveEmbed),plain=w.interactiveEmbed.split('?')[0],label=w.interactiveTitle||(w.interactiveWide?'互动展厅':'可交互手机原型');
 $('#project-type').textContent=w.interactiveType||'互动原型 / 可交互';
 $('#project-content').innerHTML=`<h2 id="project-title" class="sr-only">${escape(w.title)} · ${label}</h2><div class="demo-launch-bar"><span>${escape(w.title)} · ${label}</span><a href="${escape(plain)}" target="_blank" rel="noopener">独立页面打开 ↗</a></div><iframe id="modal-game" class="world-game${w.interactiveWide?' world-exhibit':''}" src="${escape(src)}" title="${escape(w.title)} · ${label}"></iframe>`;
 if(!projectDialog.open)projectDialog.showModal();syncModal();
}
function openGameModal(id){const w=works[id];if(!w?.gameEmbed)return;WorkShowcase.pause(projectDialog);const gameEmbed=withTheme(w.gameEmbed);$('#project-type').textContent='PLAY / VIBE CODING';$('#project-content').innerHTML='<h2 id="project-title" class="sr-only">'+escape(w.title)+' · 互动小游戏</h2><iframe id="modal-game" class="world-game" src="'+gameEmbed+'" title="'+escape(w.title)+' · 互动小游戏"></iframe>';if(!projectDialog.open)projectDialog.showModal();syncModal();}
document.addEventListener('click',e=>{const t=e.target;if(t.closest('[data-contact]')){e.preventDefault();return openContact();}if(t.closest('[data-copy-contact]'))return copyContact();if(t.closest('[data-desktop]'))return openDesktop();if(t.closest('[data-about]'))return openAbout();if(t.closest('[data-tarot]'))return openTarot();const experience=t.closest('[data-experience]');if(experience){e.preventDefault();return openExperienceModal(experience.dataset.experience);}if(t.closest('[data-game]'))return openGameModal(t.closest('[data-game]').dataset.game);if(t.closest('[data-arcade-game]'))return openArcadeGame(t.closest('[data-arcade-game]').dataset.arcadeGame);const folder=t.closest('[data-folder]');if(folder)return openFolder(folder.dataset.folder);const project=t.closest('[data-project]');if(project)return openProject(project.dataset.project);const gallery=t.closest('[data-gallery]');if(gallery&&projectGallery.length){projectIndex=(projectIndex+Number(gallery.dataset.gallery)+projectGallery.length)%projectGallery.length;updateGallery();return;}const card=t.closest('[data-tarot-card]');if(card)return drawTarot(Number(card.dataset.tarotCard));});
document.addEventListener('keydown',e=>{if(projectDialog.open&&$('#gallery-image')&&!e.target.closest('input,textarea,select,video')){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();projectIndex=(projectIndex+(e.key==='ArrowRight'?1:-1)+projectGallery.length)%projectGallery.length;updateGallery();}}});
addEventListener('pagehide',()=>{cancelAnimationFrame(cosmosFrame);clearInterval(clockTimer);clearTimeout(drawTimer);clearTimeout(toastTimer);});
resizeCosmos();updateScroll();startCosmos();
if(new URLSearchParams(location.search).get('view')==='about')openAbout();
addEventListener('pageshow',event=>{if(event.persisted){cosmosFrame=0;resizeCosmos();updateScroll();startCosmos();clock();clearInterval(clockTimer);clockTimer=setInterval(clock,30000);}});
const modelContext=document.modelContext;
if(modelContext?.registerTool){
 const lifecycle=new AbortController();
 const definitions=[{
  name:'list_portfolio_works',title:'列出作品档案',description:'读取作品的编号、名称和分类。',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},
  execute(){return {works:ids.map(id=>({id,title:works[id].title,category:M.type(works[id])}))};}
 },{
  name:'open_portfolio_work',title:'打开一件作品',description:'用作品编号打开作品展示窗口。',inputSchema:{type:'object',properties:{id:{type:'string',enum:ids}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},
  execute(input){if(!input||typeof input.id!=='string'||!ids.includes(input.id))throw new Error('请选择作品档案中存在的编号。');openProject(input.id);return {id:input.id,title:works[input.id].title,opened:projectDialog.open};}
 }];
 for(const definition of definitions){try{Promise.resolve(modelContext.registerTool(definition,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
 addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
})();

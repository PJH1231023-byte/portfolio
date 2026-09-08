'use strict';
(()=>{
 const M=GourdModel,$=id=>document.getElementById(id),copy=v=>JSON.parse(JSON.stringify(v));
 const presentation=new URLSearchParams(location.search).has('presentation');if(presentation)document.body.classList.add('presentation');
 let loaded;try{loaded=M.load(localStorage);}catch{loaded={state:M.initial(),restored:false};}
 let state=loaded.state,selected=0,history=[],saved=loaded.restored,scene,camera,renderer,controls,raf=0,toastTimer,active=true;
 const groups=[],slotRoots=[],picking=[],cabinetMats=[],lights=[],frames=[];
 const surface=$('gallery'),skins=$('skins'),catalog=$('collection'),slots=$('slots');
 const gourdIcon=c=>`<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M21 6q4-5 2-5" fill="none" stroke="#786d48" stroke-width="2"/><path d="M20 6c-10 0-12 12-5 17C1 29 8 45 20 45s19-16 5-22c7-5 5-17-5-17Z" fill="${c.color}" stroke="#6a543332"/><path d="M16 10q-5 5-1 10M13 28q-5 7 0 11" fill="none" stroke="#fff7c955" stroke-width="2.4" stroke-linecap="round"/></svg>`;
 skins.innerHTML=M.SKINS.map(s=>`<button data-skin="${s.id}" aria-pressed="false"><span class="wood-swatch" style="--wood:${s.color}"></span>${s.name}</button>`).join('');
 catalog.innerHTML=M.CATALOG.map(c=>`<button data-gourd="${c.id}" title="上架${c.name}" aria-label="上架${c.name}">${gourdIcon(c)}${c.name}</button>`).join('');
 function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2200);}
 function change(fn){history.push(copy(state));if(history.length>25)history.shift();fn();saved=false;refresh();}
 function select(index){selected=Math.max(0,Math.min(35,index));$('cabinet').value=Math.floor(selected/12);refreshUI();highlight();requestRender();}
 function refreshUI(){
  for(const b of skins.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.skin===state.skin));
  const cab=+ $('cabinet').value;
  slots.innerHTML=Array.from({length:12},(_,i)=>{const n=cab*12+i;return`<button data-slot="${n}" class="${state.slots[n]?'occupied':'empty'}" aria-pressed="${n===selected}" aria-label="展位${n+1}，${M.CATALOG.find(c=>c.id===state.slots[n])?.name||'空位'}">${String(n+1).padStart(2,'0')}</button>`;}).join('');
  const item=M.CATALOG.find(c=>c.id===state.slots[selected]);
  $('selection').innerHTML=item?`${item.name}<small>展位 ${String(selected+1).padStart(2,'0')} · ${item.note}</small>`:`展位 ${String(selected+1).padStart(2,'0')} · 等待一件藏品<small>点击下方葫芦，将它放到这里。</small>`;
  $('remove').disabled=!item;$('undo').disabled=!history.length;$('wall').value=state.wall;
  $('exhibit-count').textContent=state.slots.filter(Boolean).length;
  $('save-state').textContent=saved?'已保存 · 下次打开可继续布展':'陈列保存在本机 · 点击「保存展厅」';
 }
 function disposeTree(group){group.traverse(o=>{o.geometry?.dispose();if(o.material&&!o.userData.shared){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
 function woodTexture(){const c=document.createElement('canvas');c.width=128;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#c5b194';ctx.fillRect(0,0,128,256);for(let i=0;i<180;i++){const x=(i*47)%128;ctx.strokeStyle=i%3?'#80664018':'#efe0c823';ctx.lineWidth=i%4*.4+.3;ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x+Math.sin(i)*6,70,x-3,190,x+2,256);ctx.stroke();}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,2);return t;}
 function material(color,roughness=.55,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
 function box(w,h,d,x,y,z,mat,parent=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function gourd(id,index){
  const item=M.CATALOG.find(c=>c.id===id),group=new THREE.Group();
  const profiles=[[[0,0],[.15,.01],[.26,.10],[.30,.23],[.27,.36],[.16,.47],[.13,.53],[.21,.65],[.22,.78],[.16,.9],[.065,.96],[.03,1]],[[0,0],[.18,.02],[.28,.15],[.28,.3],[.20,.42],[.08,.48],[.06,.71],[.09,.83],[.08,.92],[.025,1.05]],[[0,0],[.22,.02],[.35,.14],[.36,.31],[.29,.44],[.15,.52],[.13,.57],[.21,.68],[.19,.8],[.075,.88],[.035,.94]]];
  const raw=profiles[item.shape],curve=new THREE.SplineCurve(raw.map(([x,y])=>new THREE.Vector2(x,y))),points=curve.getPoints(48);for(const p of points)p.x=Math.max(0,p.x);
  const body=new THREE.Mesh(new THREE.LatheGeometry(points,32),material(item.color,item.shape===2?.32:.43,.055));body.castShadow=true;body.receiveShadow=true;group.add(body);
  const top=raw[raw.length-1][1],stemCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,top,0),new THREE.Vector3(.015,top+.065,0),new THREE.Vector3(.085,top+.11,-.02),new THREE.Vector3(.095,top+.15,-.015)]);
  const stem=new THREE.Mesh(new THREE.TubeGeometry(stemCurve,9,.019,6,false),material('#665934'));stem.castShadow=true;group.add(stem);
  if(item.shape===2){const belt=new THREE.Mesh(new THREE.TorusGeometry(.142,.012,6,32),material('#c9a957',.3,.7));belt.rotation.x=Math.PI/2;belt.position.y=.535;group.add(belt);}
  if(index%4===0){const bead=new THREE.Mesh(new THREE.SphereGeometry(.034,10,8),material('#d0b05c',.3,.55));bead.position.set(.09,top+.08,0);group.add(bead);}
  group.scale.setScalar(item.scale*.78);group.rotation.y=index*.79;group.userData.slot=index;return group;
 }
 function room(){
  const texture=woodTexture(),wood=new THREE.MeshStandardMaterial({color:'#805337',map:texture,roughness:.68}),back=material('#352b22',.8),trim=material('#a08350',.4,.4);cabinetMats.push(wood,back,trim);
  const floorMat=new THREE.MeshStandardMaterial({color:'#82705a',map:texture,roughness:.82});box(40,.12,40,0,-.08,10,floorMat);
  for(let i=-20;i<=20;i++){const line=box(.008,.002,40,i,0,10,material('#433d30'));line.material.transparent=true;line.material.opacity=.18;}
  const wall=material(M.WALLS[state.wall],.94);wall.name='wall';box(40,16,.15,0,7.5,-2.2,wall);scene.userData.wall=wall;
  const molding=material('#b8aa91',.75);box(40,.13,.18,0,.15,-2.05,molding);box(40,.055,.08,0,5.3,-2.08,molding);
  for(let ci=0;ci<3;ci++){
   const group=new THREE.Group();group.position.set((ci-1)*3.28,0,ci===1?-.6:0);group.rotation.y=ci===0?.12:ci===2?-.12:0;scene.add(group);groups.push(group);
   box(3.04,4.2,.12,0,2.52,-.44,back,group);
   for(const x of [-1.53,1.53]){box(.16,4.65,.86,x,2.39,0,wood,group);box(.023,4.24,.023,x,2.47,.443,trim,group);}
   box(3.24,.18,.94,0,4.71,0,wood,group);box(3.05,.23,.91,0,.27,0,wood,group);
   for(let row=0;row<4;row++)box(3.02,.1,.89,0,3.48-row*.93,0,wood,group);
   // Small lattice band recalls the timber display cabinets in the reference.
   box(3,.055,.06,0,4.49,.42,trim,group);for(let i=-6;i<=6;i++){const o=box(.018,.17,.025,i*.215,4.36,.405,trim,group);o.rotation.z=i%2?.55:-.55;}
   for(let r=0;r<4;r++)for(let col=0;col<3;col++){
    const index=ci*12+r*3+col,slot=new THREE.Group();slot.position.set((col-1)*.88,3.545-r*.93,.12);group.add(slot);slotRoots[index]=slot;
    const base=new THREE.Mesh(new THREE.CylinderGeometry(.285,.30,.035,28),material('#4a3928',.65));base.position.y=.015;base.castShadow=true;base.receiveShadow=true;base.userData.slot=index;slot.add(base);picking.push(base);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.30,.012,5,32),material('#e9bc58',.4,.3));ring.rotation.x=Math.PI/2;ring.position.y=.04;ring.visible=false;slot.add(ring);frames[index]=ring;
   }
   const strip=new THREE.PointLight('#ffe5b4',.42,4);strip.position.set(0,4.28,1.05);group.add(strip);lights.push(strip);
  }
  // Companion table and low stools use the same furniture skin.
  const furniture=new THREE.Group();furniture.position.set(-5.5,0,.35);scene.add(furniture);
  box(1.4,.11,.72,0,1.48,0,wood,furniture);for(const x of [-.56,.56])for(const z of [-.24,.24])box(.07,1.43,.07,x,.715,z,wood,furniture);
  const bowl=new THREE.Mesh(new THREE.SphereGeometry(.25,24,12,0,Math.PI*2,0,Math.PI/2),material('#b79960',.6));bowl.rotation.x=Math.PI;bowl.position.set(0,1.77,0);furniture.add(bowl);
  const stool=new THREE.Group();stool.position.set(5.6,0,.45);scene.add(stool);box(1.05,.09,.68,0,.8,0,wood,stool);for(const x of [-.4,.4])for(const z of [-.22,.22])box(.055,.75,.055,x,.375,z,wood,stool);
  const rug=new THREE.Mesh(new THREE.PlaneGeometry(8.4,2.2),material('#c5b598',.98));rug.rotation.x=-Math.PI/2;rug.position.set(0,.002,2);rug.receiveShadow=true;scene.add(rug);
 }
 function highlight(){for(let i=0;i<frames.length;i++)frames[i].visible=i===selected;}
 function refresh(){
  refreshUI();if(!scene)return;
  const skin=M.SKINS.find(s=>s.id===state.skin);cabinetMats[0].color.set(skin.color);cabinetMats[1].color.set(skin.dark);cabinetMats[2].color.set(skin.trim);scene.userData.wall.color.set(M.WALLS[state.wall]);
  for(let i=0;i<36;i++){const slot=slotRoots[i],old=slot.userData.exhibit;if(old){slot.remove(old);disposeTree(old);}slot.userData.exhibit=null;
   if(state.slots[i]){const item=gourd(state.slots[i],i);item.position.y=.04;slot.add(item);slot.userData.exhibit=item;}}
  highlight();requestRender();
 }
 function resize(){if(!renderer)return;const r=surface.parentElement.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();requestRender();}
 function render(){raf=0;if(!active||document.hidden||!renderer)return;controls.update();renderer.render(scene,camera);}
 function requestRender(){if(!raf&&renderer&&active&&!document.hidden)raf=requestAnimationFrame(render);}
 function viewpoint(angle=0){if(!camera)return;const radius=camera.position.distanceTo(controls.target);const delta=camera.position.clone().sub(controls.target);delta.applyAxisAngle(new THREE.Vector3(0,1,0),angle);camera.position.copy(controls.target).add(delta.normalize().multiplyScalar(radius));controls.update();requestRender();}
 function zoom(factor){if(!camera)return;const delta=camera.position.clone().sub(controls.target);delta.setLength(Math.max(7,Math.min(21,delta.length()*factor)));camera.position.copy(controls.target).add(delta);controls.update();requestRender();}
 function front(){if(!camera)return;controls.target.set(0,2.35,0);camera.position.set(0,4.4,14.5);controls.update();requestRender();}
 function setup(){
  try{
   THREE.ColorManagement.legacyMode=false;renderer=new THREE.WebGLRenderer({canvas:surface,antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
   scene=new THREE.Scene();scene.background=new THREE.Color('#e5dfd2');scene.fog=new THREE.Fog('#e5dfd2',24,40);camera=new THREE.PerspectiveCamera(39,1,.1,60);camera.position.set(4.8,4.7,14.6);
   controls=new THREE.OrbitControls(camera,surface);controls.target.set(0,2.3,0);controls.enablePan=false;controls.minDistance=7;controls.maxDistance=21;controls.minPolarAngle=.9;controls.maxPolarAngle=1.56;controls.minAzimuthAngle=-.62;controls.maxAzimuthAngle=.62;controls.enableDamping=false;controls.rotateSpeed=.55;controls.addEventListener('change',requestRender);controls.update();
   scene.add(new THREE.HemisphereLight('#fff8e9','#80725d',.7));const sun=new THREE.DirectionalLight('#fff1d6',1.35);sun.position.set(-4,9,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-9,right:9,top:8,bottom:-6,near:.5,far:25});sun.shadow.bias=-.0003;sun.shadow.normalBias=.035;scene.add(sun);const fill=new THREE.DirectionalLight('#d7e1dc',.4);fill.position.set(7,4,5);scene.add(fill);
   room();refresh();if(presentation){controls.enabled=false;GourdTourScene({scene,camera,controls,slotRoots,frames,cabinetMats,box,material,requestRender});}new ResizeObserver(resize).observe(surface.parentElement);resize();$('fallback').hidden=true;
   const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;
   surface.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,time:performance.now()};});
   surface.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7||performance.now()-down.time>600)return;const r=surface.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(slotRoots,true);for(const hit of hits){let o=hit.object;while(o&&o.userData.slot===undefined)o=o.parent;if(o){select(o.userData.slot);break;}}down=null;});
   surface.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','+','-'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')viewpoint(-.12);if(e.key==='ArrowRight')viewpoint(.12);if(e.key==='+')zoom(.9);if(e.key==='-')zoom(1.1);}});
  }catch(error){$('fallback').hidden=false;surface.hidden=true;for(const id of ['turn-left','turn-right','view-front','zoom-in','zoom-out'])$(id).disabled=true;console.warn('3D preview unavailable:',error.message);}
 }
 skins.addEventListener('click',e=>{const b=e.target.closest('[data-skin]');if(b&&state.skin!==b.dataset.skin)change(()=>state.skin=b.dataset.skin);});
 slots.addEventListener('click',e=>{const b=e.target.closest('[data-slot]');if(b)select(+b.dataset.slot);});
 catalog.addEventListener('click',e=>{const b=e.target.closest('[data-gourd]');if(!b)return;const old=state.slots[selected];change(()=>state.slots[selected]=b.dataset.gourd);toast(old?'已替换当前展位，可撤销':'已上架到展位 '+(selected+1));});
 $('cabinet').onchange=()=>select(+$('cabinet').value*12);$('wall').onchange=()=>change(()=>state.wall=$('wall').value);
 $('remove').onclick=()=>{change(()=>state.slots[selected]=null);toast('已移回藏品库');};
 $('undo').onclick=()=>{if(history.length){state=history.pop();saved=false;refresh();toast('已撤销上一步');}};
 $('reset').onclick=()=>{change(()=>state=M.initial());toast('已恢复示例陈列，可撤销');};
 $('save').onclick=()=>{try{localStorage.setItem(M.KEY,JSON.stringify(state));saved=true;refreshUI();toast('展厅已保存，下次打开可继续');}catch{toast('浏览器未允许保存，当前陈列仍可继续体验');}};
 $('retry').onclick=()=>location.reload();$('view-front').onclick=front;$('turn-left').onclick=()=>viewpoint(-.17);$('turn-right').onclick=()=>viewpoint(.17);$('zoom-in').onclick=()=>zoom(.88);$('zoom-out').onclick=()=>zoom(1.12);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else requestRender();});
 addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='portfolio-game-pause'){active=false;cancelAnimationFrame(raf);raf=0;}});
 document.addEventListener('pointerdown',()=>{active=true;requestRender();});document.addEventListener('keydown',()=>{active=true;requestRender();});addEventListener('pagehide',()=>{cancelAnimationFrame(raf);clearTimeout(toastTimer);});
 refreshUI();setup();
 if(new URLSearchParams(location.search).has('test'))window.__gourdTest={get state(){return copy(state);},get selected(){return selected;},get ready(){return !!scene;},get camera(){return camera?.position.toArray();},get meshCount(){let n=0;scene?.traverse(o=>{if(o.isMesh)n++;});return n;},get image(){render();return surface.toDataURL('image/png');},select,projectSlot(i){const v=new THREE.Vector3();slotRoots[i].getWorldPosition(v);v.y+=.3;v.project(camera);const r=surface.getBoundingClientRect();return{x:r.x+(v.x+1)*r.width/2,y:r.y+(1-v.y)*r.height/2};}};
})();

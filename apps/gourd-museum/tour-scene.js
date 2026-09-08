/* A staged portfolio presentation. Cutout artwork is illustrative, not an upload service. */
window.GourdTourScene=function({scene,camera,controls,slotRoots,frames,cabinetMats,box,material,requestRender}){
 const T=THREE,objects=[],targets=[],start=[],end=[];
 const colors=['#c4974b','#b88742','#d8b966','#e6d4a4','#b48042','#c6a36b'];
 slotRoots.forEach((slot,i)=>{if(slot.userData.exhibit)slot.userData.exhibit.visible=false;frames[i].visible=false;});
 const tex=color=>{const c=document.createElement('canvas');c.width=192;c.height=280;const x=c.getContext('2d');
  const g=x.createLinearGradient(40,0,140,0);g.addColorStop(0,'#795123');g.addColorStop(.3,color);g.addColorStop(.6,'#ebca83');g.addColorStop(1,'#89602c');
  x.fillStyle=g;x.beginPath();x.moveTo(94,42);x.bezierCurveTo(47,34,38,103,73,132);x.bezierCurveTo(10,158,22,251,95,254);x.bezierCurveTo(172,255,180,165,118,132);x.bezierCurveTo(156,94,139,36,94,42);x.fill();
  x.strokeStyle='#745732';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(96,44);x.bezierCurveTo(94,16,121,34,116,14);x.stroke();
  x.globalAlpha=.12;x.fillStyle='#6d431c';for(let j=0;j<80;j++){const px=37+(j*47)%120,py=48+(j*31)%200;if(x.getImageData(px,py,1,1).data[3])x.fillRect(px,py,1.8,1.8);}const texture=new T.CanvasTexture(c);texture.encoding=T.sRGBEncoding;return texture;
 };
 const textures=colors.map(tex);
 scene.updateMatrixWorld(true);
 for(let i=0;i<36;i++){const v=new T.Vector3();slotRoots[i].getWorldPosition(v);v.y+=.04;targets.push(v);}
 // Both furniture surfaces and floor positions are part of the exhibition.
 const wood=cabinetMats[0],trim=cabinetMats[2];
 box(1.7,.85,.85,3.1,.46,2.15,wood);box(1.82,.10,.95,3.1,.93,2.15,wood);
 box(.025,.62,.03,3.1,.48,2.60,trim);box(.07,.07,.035,2.96,.49,2.62,trim);box(.07,.07,.035,3.24,.49,2.62,trim);
 [[-5.65,1.54,.4],[-5.2,1.54,.35],[2.75,.99,2.15],[3.4,.99,2.15],[5.6,.85,.45],[-4.7,.035,2.7],[-3.7,.035,3],[-1.7,.035,2.7],[.4,.035,3.05]].forEach(p=>targets.push(new T.Vector3(...p)));
 const used=[0,1,3,4,6,7,9,10,12,13,15,16,18,19,21,22,24,25,27,28,30,31,33,34,36,37,38,39,40,41,42,43,44];
 for(let i=0;i<used.length;i++){
  const root=new T.Group(),h=.64+(i%4)*.075,w=h*(.50+i%3*.11);
  const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:textures[i%6],transparent:true,alphaTest:.08,side:T.DoubleSide,depthWrite:true}));mesh.position.y=h/2-h*.09;root.add(mesh);
  const shadow=new T.Mesh(new T.CircleGeometry(w*.37,24),new T.MeshBasicMaterial({color:'#34271b',transparent:true,opacity:.22,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.008;shadow.scale.y=.53;root.add(shadow);
  root.position.copy(targets[used[i]]);scene.add(root);objects.push(root);start.push(root.position.clone());end.push(targets[used[(i*7+5)%used.length]].clone());
 }
 function show(time){
  const shuffle=Math.max(0,Math.min(1,(time-18)/2.1)),ease=shuffle*shuffle*(3-2*shuffle);
  objects.forEach((o,i)=>{o.position.lerpVectors(start[i],end[i],ease);o.position.y+=Math.sin(ease*Math.PI)*(.45+i%3*.13);o.children[0].rotation.y=Math.atan2(camera.position.x-o.position.x,camera.position.z-o.position.z);o.visible=time>=9.5+(i%6)*.12;});
  const skin=time<24?GourdModel.SKINS[0]:time<27?GourdModel.SKINS[1]:GourdModel.SKINS[2];
  cabinetMats[0].color.set(skin.color);cabinetMats[1].color.set(skin.dark);cabinetMats[2].color.set(skin.trim);
  camera.position.set(Math.sin((time-10)*.055)*3.5,4.7,16);controls.target.set(0,2.15,.5);controls.update();requestRender();
 }
 addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='gourd-tour')return;const t=Number(e.data.time);if(Number.isFinite(t))show(Math.max(0,Math.min(32,t)));});
 show(10);window.gourdTourReady=true;
};

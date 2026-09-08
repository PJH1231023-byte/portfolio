/* Six authored route grammars. World units are shared with the 1280 × 720 camera. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SpiritLevels=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const META=[
 ['粉晶花园','沿着花阶攀登，用弹簧花跃上长廊。',0,'花阶与弹跳',95,155],
 ['珍珠水廊','穿过长短拱桥，搭乘贝壳升降台。',1,'水廊与升降',110,175],
 ['翡翠瀑谷','借上升气流飞越瀑布，探索高处栈道。',2,'气流与栈道',115,180],
 ['紫晶洞窟','碎裂桥会在脚下消失，留意带刺守卫。',3,'碎桥与伏击',115,185],
 ['琥珀潮岸','观察潮泉的预警，选择礁石上的安全路线。',4,'潮泉与礁石',120,195],
 ['月光浮岛','穿过漂浮渡台与星环，抵达月光之门。',5,'浮岛与渡台',135,210]
 ];
 const KEEPSAKES=[
  {name:'粉晶花印',color:'#f2a6cf',shape:'flower',hint:'沿花阶向上，花印藏在最高的花廊。'},
  {name:'珍珠贝印',color:'#b3e5ed',shape:'shell',hint:'搭乘升降台，去上层贝壳水廊找找。'},
  {name:'翡翠叶印',color:'#8ae0ba',shape:'leaf',hint:'借风柱升高，再向右跳往瀑布上的栈道。'},
  {name:'紫晶棱印',color:'#cfb0f7',shape:'crystal',hint:'登上带裂纹的高桥，取到印记后及时跳开。'},
  {name:'琥珀潮印',color:'#ffd18b',shape:'drop',hint:'避开潮泉，印记在较高的礁石平台。'},
  {name:'月光星印',color:'#dddfff',shape:'moon',hint:'借弹簧或漂浮台，登上高处的月石台座。'}
 ];
 const plans=[
  {widths:[1050,720,1250,800,1100,650,1400,900,1150,780,1350,850,1200,700,1450,900,1100,1200],ys:[850,810,730,810,850,770],gaps:[0,80,0,120,70,0]},
  {widths:[1200,660,1500,780,980,620,1400,900,750,1250,860,1100,660,1350,950,740,1300,1150],ys:[850,760,790,850,720,800],gaps:[110,0,130,60,0,100]},
  {widths:[1050,700,980,1100,620,1450,760,1250,800,1100,650,1400,800,1150,700,1300,1000,1200,900],ys:[850,760,670,750,840,760],gaps:[110,110,0,130,90,0]},
  {widths:[950,1300,680,1100,780,1450,750,1100,880,1300,660,1200,950,1350,680,1100,900,1250,1050],ys:[850,810,850,760,820,750],gaps:[70,120,0,90,110,0]},
  {widths:[1200,650,1050,800,1450,760,1200,700,1300,880,1100,650,1450,850,1250,700,1350,1050,1000],ys:[850,780,850,790,850,740],gaps:[100,100,80,0,130,60]},
  {widths:[1000,850,1250,700,1100,850,1400,700,1100,900,1250,750,1350,800,1050,900,1400,800,1200,1100],ys:[850,770,690,780,850,770],gaps:[130,110,0,130,100,0]}
 ];
 function level(index){
  const m=META[index],plan=plans[index];if(!m)throw new Error('Unknown level');
  const platforms=[],enemies=[],items=[],checkpoints=[],devices=[],signs=[];let x=0,serial=0;
  const add=(x,y,w,kind='normal',extra={})=>{const p={id:'p'+serial++,x,y,w,h:kind==='ground'?330:30,oneWay:kind!=='ground',kind,...extra};platforms.push(p);return p;};
  const item=(type,x,y)=>items.push({id:'i'+items.length,type,x,y});
  const enemy=(type,p,at=.55,tier=1)=>enemies.push({id:'e'+enemies.length,type,platform:p.id,x:p.x+p.w*at,tier});
  plan.widths.forEach((w,s)=>{
   const y=plan.ys[s%plan.ys.length],base=add(x,y,w,'ground');base.id='g'+s;
   if(s===0||s%3===0)checkpoints.push({x:x+45,y:y-66,platform:base.id});
   let upper=[];
   if(index===0){
    // Continuous little flights lead to long flower balconies, followed by a descent.
    upper=[add(x+160,y-95,135,'petal'),add(x+285,y-190,155,'petal'),add(x+425,y-280,Math.max(220,w-500),'petal')];
    if(s%2===0)devices.push({type:'spring',x:x+135,y:y-14,w:52,h:14});
   }else if(index===1){
    upper=[add(x+140,y-135,Math.max(240,w*.43),'shell'),add(x+w*.61,y-285,Math.max(190,w*.3),'shell')];
    add(x+w*.48,y-160,135,'lift',{axis:'y',amplitude:115,period:5,phase:s*.7});
    if(s%3===1)add(x+40,y-390,Math.max(250,w*.48),'shell');
   }else if(index===2){
    upper=[add(x+250,y-205,Math.max(260,w*.43),'jade'),add(x+w*.65,y-355,Math.max(180,w*.3),'jade')];
    devices.push({type:'wind',x:x+100,y:y-480,w:125,h:480});
    add(x+40,y-100,125,'jade');
   }else if(index===3){
    upper=[add(x+100,y-110,180,'crystal'),add(x+300,y-225,Math.max(230,w-390),'crystal')];
    for(let k=0;k<4;k++)add(x+180+k*130,y-345,115,'crumble');
   }else if(index===4){
    upper=[add(x+130,y-115,160,'reef'),add(x+340,y-195,Math.max(190,w*.34),'reef'),add(x+w-190,y-105,155,'reef')];
    if(s>0)devices.push({type:'tide',x:x+w*.47,y:y-200,w:95,h:200,phase:s*.63,period:4.8,damage:18});
   }else{
    upper=[add(x+140,y-130,210,'moon'),add(x+w*.68,y-300,Math.max(180,w*.26),'moon')];
    add(x+w*.42,y-245,165,'ferry',{axis:'x',amplitude:110,period:5.5,phase:s*.6});
    if(s%2===1)devices.push({type:'spring',x:x+60,y:y-14,w:52,h:14});
   }
   if(s>0){const types=[['05','07','05','11'],['07','11','05','08'],['06','07','05','11'],['06','11','08','05'],['08','07','11','06'],['11','06','08','07']][index];enemy(types[(s-1)%types.length],base,.67,s%4===0?2:1);if(s%2===0)enemy(s%4===0?'11':index===3?'06':'07',upper[upper.length-1],.3,1);if(s%5===3)enemy('05',base,.85,1);}
   for(let k=0;k<Math.floor(w/130)-1;k++)item('gem',x+100+k*130,y-50);
   upper.forEach((p,j)=>{for(let k=0;k<Math.floor(p.w/75);k++)item('gem',p.x+35+k*75,p.y-40);if(j===upper.length-1&&s%3===1)item('shield',p.x+p.w*.7,p.y-48);});
   if(s>0&&s%2===0){item('heal',x+70,y-42);const high=upper[upper.length-1];item('heal',high.x+high.w-45,high.y-42);}
   if([2,8,14].includes(s)){
    const high=index===3?platforms.find(p=>p.kind==='crumble'&&p.x===x+440):index===4?upper[1]:upper.at(-1),slot=[2,8,14].indexOf(s);
    items.push({id:'keepsake-'+slot,type:'keepsake',slot,x:high.x+high.w*.42,y:high.y-44,platform:high.id});
    signs.push({x:x+35,y:y-140,short:true,text:'↑ '+['花廊','水廊','栈道','碎桥','礁石','月台'][index]+'上的'+KEEPSAKES[index].name});
   }
   if(s===0||s===6||s===12)signs.push({x:x+80,y:y-115,text:s===0?m[1]:s===6?'旅途已过三分之一 · 上层藏着晶石与护盾':'后半程 · 点亮灯塔，向珠光之门前进'});
   x+=w+plan.gaps[s%plan.gaps.length];
  });
  if(index===5){
   // A real crossing in the main route: the moving ferry joins two distant docks.
   const dock=platforms.find(p=>p.id==='g9'),shore=platforms.find(p=>p.id==='g10');
   dock.w=180;
   const removed=new Set(platforms.filter(p=>p.oneWay&&p.x>=dock.x&&p.x<shore.x).map(p=>p.id));
   for(let i=platforms.length-1;i>=0;i--)if(removed.has(platforms[i].id))platforms.splice(i,1);
   for(let i=enemies.length-1;i>=0;i--)if(enemies[i].platform===dock.id||removed.has(enemies[i].platform))enemies.splice(i,1);
   for(let i=items.length-1;i>=0;i--)if(items[i].x>=dock.x&&items[i].x<shore.x)items.splice(i,1);
   for(let i=devices.length-1;i>=0;i--)if(devices[i].x>=dock.x&&devices[i].x<shore.x)devices.splice(i,1);
   add(10155,755,220,'ferry',{id:'moon-crossing',axis:'x',origin:10155,amplitude:430,period:8,phase:0});
   items.push({id:'dock-heal',type:'heal',x:dock.x+75,y:dock.y-42});
   checkpoints.push({x:shore.x+90,y:shore.y-66,platform:shore.id});checkpoints.sort((a,b)=>a.x-b.x);
   signs.push({x:dock.x+10,y:dock.y-115,text:'等渡台靠岸后跳上 · 站稳随台前进'});
  }
  const end=platforms.filter(p=>!p.oneWay).at(-1),width=end.x+end.w;
  signs.push({x:width-470,y:end.y-335,text:'终点在地面 · 按 ↓ 穿过薄平台，走入发光拱门'});
  return {revision:3,index,name:m[0],subtitle:m[1],scene:index,mechanic:m[3],three:m[4],two:m[5],width,height:1220,platforms,enemies,items,checkpoints,devices,signs,goal:{x:width-150,y:end.y-145,w:95,h:145}};
 }
 return {META,KEEPSAKES,level};
});

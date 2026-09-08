(function(root){'use strict';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const range=(v,a,b)=>clamp((v-a)/(b-a));
const progress=(top,height,viewport)=>clamp(-top/Math.max(1,height-viewport));
function phases(p){return {title:1-range(p,.1,.55),verse:range(p,.45,.72)*(1-range(p,.88,1)),reveal:range(p,0,.45),discY:(1-range(p,0,.25))*-72,rotation:-35+range(p,.18,1)*160};}
function orbit(p,index,count){const travel=range(p,.15,.96);const angle=(index/count*360+170-travel*245)*Math.PI/180;return{x:50+Math.cos(angle)*39,y:83+Math.sin(angle)*51,opacity:clamp((-Math.sin(angle)+.1)*2),angle};}
function escape(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function type(work){return({BRAND:'brand',IP:'character',FILM:'film',UI:'product',CODE:'play',TYPE:'print',PRINT:'print'}[work.cat.split(' · ')[0]]||'print');}
const sectionDefinitions=[
 {id:'atlas',category:'brand',label:'品牌与空间'},
 {id:'orbit',category:'character',label:'IP 角色设计'},
 {id:'screening',category:'film',label:'影像放映室'},
 {id:'products',category:'product',label:'产品与交互'},
 {id:'paper',category:'print',label:'字体与印刷'},
 {id:'theatre',category:'play',label:'小游戏'}
];
function catalogueSections(works){return sectionDefinitions.map(section=>({...section,works:Object.keys(works).filter(id=>id!=='more'&&type(works[id])===section.category)}));}
function sequence(progress,count){return Math.min(Math.max(0,count-1),Math.floor(clamp(progress)*Math.max(1,count)));}
root.ScrollWorldModel={clamp,range,progress,phases,orbit,escape,type,catalogueSections,sequence};
if(typeof module!=='undefined')module.exports=root.ScrollWorldModel;
})(typeof window!=='undefined'?window:globalThis);

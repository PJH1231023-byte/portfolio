(function(root){'use strict';
 const CATALOG=[
  {id:'honey',name:'展柜原型 · 蜜金葫芦',note:'取自真实展柜照片 · 饱满双腹 · 蜜金原色',color:'#d3a24f',shape:0,scale:.96,image:'../../images/gourd-prototype-honey.png'},
  {id:'long',name:'细颈葫芦',note:'细长颈部 · 暖棕光泽',color:'#aa6b31',shape:1,scale:1},
  {id:'ivory',name:'素白葫芦',note:'温润浅色 · 圆润双腹',color:'#e8d6a7',shape:0,scale:.8},
  {id:'jade',name:'青玉葫芦',note:'青绿色釉感 · 金色束腰',color:'#7f9e8a',shape:2,scale:.92},
  {id:'amber',name:'琥珀匏器',note:'矮身宽腹 · 琥珀色泽',color:'#ae7233',shape:2,scale:.75},
  {id:'blue',name:'天青葫芦',note:'青瓷色调 · 细颈造型',color:'#7fa5af',shape:1,scale:.84}
 ];
 const SKINS=[{id:'walnut',name:'胡桃木',color:'#805337',dark:'#352b22',trim:'#a08350'},{id:'bamboo',name:'浅竹木',color:'#c7aa77',dark:'#8a7759',trim:'#b58a43'},{id:'ink',name:'墨色描金',color:'#354443',dark:'#202c2b',trim:'#bd995e'}];
 const WALLS={warm:'#e5ddd0',sage:'#cbd2c3',ink:'#697c72'},KEY='portfolio.gourd-museum.demo.v1';
 function initial(){return {version:1,skin:'walnut',wall:'warm',slots:Array.from({length:36},(_,i)=>i%3===2?null:CATALOG[(i*7+Math.floor(i/12))%CATALOG.length].id)};}
 function normalize(raw){const d=initial();if(!raw||raw.version!==1)return d;return{version:1,skin:SKINS.some(s=>s.id===raw.skin)?raw.skin:d.skin,wall:Object.hasOwn(WALLS,raw.wall)?raw.wall:d.wall,slots:Array.from({length:36},(_,i)=>CATALOG.some(c=>c.id===raw.slots?.[i])?raw.slots[i]:null)};}
 function load(storage){try{const value=storage.getItem(KEY);return{state:value?normalize(JSON.parse(value)):initial(),restored:!!value};}catch{return{state:initial(),restored:false};}}
 root.GourdModel={CATALOG,SKINS,WALLS,KEY,initial,normalize,load};if(typeof module!=='undefined')module.exports=root.GourdModel;
})(typeof window!=='undefined'?window:globalThis);

/* Runtime chroma-key texture upload. The atlas is never displayed as a green rectangle. */
window.SpiritAssets={
 async load(onProgress=()=>{},onCast=()=>{}){
  let loaded=0;const image=(src,label)=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{loaded++;onProgress(loaded*20,label);resolve(im);};im.onerror=()=>reject(new Error('无法加载 '+src));im.src=src;});
  onProgress(0,'正在打开珠宝庭院');
  const otherAssets=Promise.all([image('assets/worlds-six-v2.png','六片独立珠宝风景已就绪'),image('assets/courtyard.png','庭院已点亮'),image('assets/terrain.png','晶石台阶已就绪')]);
  // Attach rejection handling immediately while the atlas is decoded below.
  otherAssets.catch(()=>{});
  const atlas=await image('assets/cast-key.png','五位旅伴正在苏醒');
  const c=document.createElement('canvas');c.width=atlas.width;c.height=atlas.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(atlas,0,0);const im=ctx.getImageData(0,0,c.width,c.height),d=im.data,w=c.width,h=c.height;
  for(let p=0;p<d.length;p+=4){const spill=d[p+1]-Math.max(d[p],d[p+2]);if(spill>65){d[p+3]=0;}else if(spill>25&&d[p+1]>130){d[p+3]=Math.round(255*(65-spill)/40);d[p+1]=Math.max(d[p],d[p+2])+15;}}
  const seen=new Uint8Array(w*h),queue=new Int32Array(w*h),regions=[];
  for(let i=0;i<w*h;i++){if(seen[i]||d[i*4+3]<50)continue;let r=0,n=1;queue[0]=i;seen[i]=1;let minX=w,minY=h,maxX=0,maxY=0,count=0;
   const add=j=>{if(!seen[j]&&d[j*4+3]>=50){seen[j]=1;queue[n++]=j;}};
   while(r<n){const p=queue[r++],x=p%w,y=Math.floor(p/w);count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);if(x>0)add(p-1);if(x<w-1)add(p+1);if(y>0)add(p-w);if(y<h-1)add(p+w);}
   if(count>1800)regions.push({minX,minY,maxX,maxY,count});
  }
  if(regions.length!==10)throw new Error('角色图集分离失败：识别到 '+regions.length+' 个形象');
  regions.sort((a,b)=>(a.minY+a.maxY)-(b.minY+b.maxY));const sorted=[...regions.slice(0,5).sort((a,b)=>a.minX-b.minX),...regions.slice(5).sort((a,b)=>a.minX-b.minX)];
  ctx.putImageData(im,0,0);const ids=['03','04','09','10','12','05','06','07','08','11'],sprites={},urls={};
  sorted.forEach((r,i)=>{const out=document.createElement('canvas');out.width=r.maxX-r.minX+5;out.height=r.maxY-r.minY+5;out.getContext('2d').drawImage(c,r.minX-2,r.minY-2,out.width,out.height,0,0,out.width,out.height);sprites[ids[i]]=out;urls[ids[i]]=out.toDataURL('image/png');});
  onCast({sprites,urls});const [worlds,courtyard,terrain]=await otherAssets;onProgress(100,'准备完成 · 任意关卡都可以出发');
  return {sprites,urls,worlds,courtyard,terrain};
 }
};

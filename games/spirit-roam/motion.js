/* Art-preserving 2D character rig. One continuous textured mesh, with local limb controls. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SpiritMotion=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
 const RIGS={
  '03':{feet:[[.36,.91,.34,.985,.14],[.63,.91,.65,.985,.14]],arms:[[.40,.29,.14,.79,.22],[.64,.39,.89,.82,.19]],head:.36,stride:1},
  '04':{feet:[[.30,.86,.28,.98,.15],[.46,.86,.48,.98,.14]],arms:[[.38,.63,.25,.74,.14],[.39,.63,.45,.73,.13]],tail:[.59,.87,.90,.73,.17],head:.35,stride:1.1,folded:true},
  '09':{feet:[[.43,.86,.43,.98,.11],[.59,.86,.59,.98,.11]],arms:[[.35,.81,.41,.70,.13],[.66,.81,.65,.69,.13]],head:.37,stride:1},
  '10':{feet:[[.39,.83,.35,.96,.14],[.71,.81,.77,.91,.14]],arms:[[.25,.57,.16,.68,.17],[.79,.54,.91,.66,.17]],head:.40,stride:1.25},
  '12':{feet:[[.14,.68,.08,.90,.15],[.60,.70,.59,.97,.16],[.86,.59,.90,.83,.13]],arms:[],head:.47,stride:.8}
 };
 function pose(id,action='idle',phase=0,strength=1,attacking=false){
  const s=Math.sin(phase),c=Math.cos(phase),rig=RIGS[id],p={left:0,right:0,armL:0,armR:0,tail:0,nod:0,bob:0,lean:0,squash:0,look:0};
  if(!rig)return p;
  p.nod=Math.sin(phase)*.008;p.bob=Math.sin(phase)*.002;
  if(action==='walk'){p.left=s*strength;p.right=-s*strength;p.armL=s*(rig.folded?.07:.19)*strength;p.armR=-p.armL;p.tail=Math.sin(phase-.6)*.13;p.bob=-Math.abs(c)*.010*strength;p.lean=.013*s*strength;p.nod=.012*c;}
  if(action==='wave'){p.armL=rig.folded?.035:-.13;p.armR=rig.folded?.045:.38+s*.17;p.tail=s*.22;p.lean=-.022;p.nod=.022*s;}
  if(action==='listen'){p.nod=.04*s;p.lean=.018;p.tail=.10*s;p.look=.015;}
  if(action==='bow'){p.nod=.09*(.5+.5*s);p.lean=.045*(.5+.5*s);p.tail=.20*c;p.squash=.018*(.5+.5*s);}
  if(action==='cheer'){p.armL=rig.folded?-.05:-.30-.13*s;p.armR=rig.folded?.05:.30+.13*s;p.left=.30;p.right=.30;p.bob=-.025*Math.max(0,s);p.squash=.025*c;p.tail=.22*s;p.nod=.018*s;}
  if(action==='jump'||action==='fall'){p.left=action==='jump'?.8:-.25;p.right=action==='jump'?.55:-.25;p.armL=-.20;p.armR=.24;p.tail=-.13;p.lean=action==='jump'?-.035:.025;p.squash=action==='jump'?-.025:.015;}
  if(action==='attack'||attacking){p.armL=rig.folded?-.05:-.10;p.armR=rig.folded?.09:.40;p.lean-=.035;p.tail=.22;p.nod=-.035;}
  return p;
 }
 function influence(x,y,bone){const [px,py,tx,ty,r]=bone,dx=tx-px,dy=ty-py,len=dx*dx+dy*dy,t=((x-px)*dx+(y-py)*dy)/len,u=clamp(t),dist=Math.hypot(x-(px+u*dx),y-(py+u*dy));return Math.pow(clamp(1-dist/r),2)*smooth(-.08,.45,t);}
 function deform(id,x,y,p){const rig=RIGS[id];if(!rig)return {x,y};let dx=0,dy=0;
  const rotate=(bone,angle)=>{const w=influence(x,y,bone),rx=x-bone[0],ry=y-bone[1],c=Math.cos(angle),s=Math.sin(angle);dx+=(rx*c-ry*s-rx)*w;dy+=(rx*s+ry*c-ry)*w;};
  rig.feet.forEach((bone,i)=>{const step=i%2?p.right:p.left,w=influence(x,y,bone);dx+=step*.030*w;dy-=Math.max(0,step)*.036*w;rotate(bone,step*.24);});
  rig.arms.forEach((bone,i)=>rotate(bone,(i?p.armR:p.armL)*(id==='03'?.24:1)));if(rig.tail)rotate(rig.tail,p.tail);
  const upper=1-smooth(.80,.97,y),head=1-smooth(.50,.73,y),rx=x-.5,ry=y-.84;
  dx+=(-ry*p.lean+p.look*head)*upper;dy+=(rx*p.lean+p.bob+(y-.84)*p.squash)*upper;
  // The face and its material move together; the artwork itself is never repainted.
  dy+=(x-.5)*p.nod*head;dx-=(y-rig.head)*p.nod*head;
  return {x:x+dx,y:y+dy};
 }
 function triangle(ctx,im,src,dst){const [a,b,c]=src,[u,v,w]=dst,det=(b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y);if(Math.abs(det)<1e-8)return;
  const A=((v.x-u.x)*(c.y-a.y)-(w.x-u.x)*(b.y-a.y))/det,B=((v.y-u.y)*(c.y-a.y)-(w.y-u.y)*(b.y-a.y))/det,C=((w.x-u.x)*(b.x-a.x)-(v.x-u.x)*(c.x-a.x))/det,D=((w.y-u.y)*(b.x-a.x)-(v.y-u.y)*(c.x-a.x))/det;
  ctx.save();ctx.beginPath();const center={x:(u.x+v.x+w.x)/3,y:(u.y+v.y+w.y)/3};for(let i=0;i<3;i++){const q=dst[i],vx=q.x-center.x,vy=q.y-center.y,len=Math.hypot(vx,vy),xx=q.x+vx/len*.42,yy=q.y+vy/len*.42;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.closePath();ctx.clip();ctx.setTransform(A,B,C,D,u.x-A*a.x-C*a.y,u.y-B*a.x-D*a.y);ctx.drawImage(im,0,0);ctx.restore();
 }
 function createRenderer(sprites){const cache=new Map(),stats={generated:0,hits:0};
  function frame(id,action,phase,strength=1,attacking=false){const steps=action==='walk'?16:12,bin=Math.round((((phase%TAU)+TAU)%TAU)/TAU*steps)%steps,power=action==='walk'?Math.max(.5,Math.round(strength*2)/2):1,key=[id,action,bin,power,attacking?1:0].join(':');
   if(cache.has(key)){const out=cache.get(key);cache.delete(key);cache.set(key,out);stats.hits++;return out;}
   const im=sprites[id],scale=280/Math.max(im.width,im.height),w=im.width*scale,h=im.height*scale,pad=24,out=document.createElement('canvas');out.width=Math.ceil(w)+pad*2;out.height=Math.ceil(h)+pad*2;const ctx=out.getContext('2d'),p=pose(id,action,bin/steps*TAU,power,attacking),cols=18,rows=22,points=[];
   for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const x=i/cols,y=j/rows,d=deform(id,x,y,p);points.push({src:{x:x*im.width,y:y*im.height},dst:{x:pad+d.x*w,y:pad+d.y*h}});}
   for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i,b=a+1,c=a+cols+1,d=c+1;for(const tri of [[a,b,d],[a,d,c]])triangle(ctx,im,tri.map(n=>points[n].src),tri.map(n=>points[n].dst));}
   const result={canvas:out,pad,w,h};cache.set(key,result);stats.generated++;if(cache.size>150)cache.delete(cache.keys().next().value);return result;
  }
  function draw(ctx,id,x,y,w,h,options={}){const im=sprites[id];if(!im)return;const scale=Math.min(w/im.width,h/im.height),dw=im.width*scale,dh=im.height*scale;if(options.reduced||!RIGS[id]){ctx.drawImage(im,x+(w-dw)/2,y+h-dh,dw,dh);return;}
   const f=frame(id,options.action||'idle',options.phase||0,options.strength??1,options.attack),factor=dw/f.w;ctx.drawImage(f.canvas,x+(w-dw)/2-f.pad*factor,y+h-dh-f.pad*factor,f.canvas.width*factor,f.canvas.height*factor);
  }
  return {draw,frame,stats,get cacheSize(){return cache.size;}};
 }
 return {RIGS,pose,deform,createRenderer};
});

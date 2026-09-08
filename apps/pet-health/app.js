(() => {
'use strict';
const M = window.PetHealthModel;
const $ = (s, r = document) => r.querySelector(s);
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let stored = null;
try { stored = JSON.parse(localStorage.getItem(M.STORAGE_KEY)); } catch {}
const storage = { setItem(key, value) { window.localStorage.setItem(key, value); } };
let state = M.hydrate(stored, M.DEFAULT_DATE);
const ui = { view:'home', type:'feed', date:state.date || M.DEFAULT_DATE, drafts:{}, filter:'all', busy:false, photoToken:0 };
const labels = { feed:'喂食', walk:'遛弯', health:'健康' };
const screen = $('#app-screen');
const dialog = $('#app-dialog');
const current = () => state.pets[state.pet];
const dateText = d => { const [y,m,day]=d.split('-'); return y+'年'+Number(m)+'月'+Number(day)+'日'; };
const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
const at = (x,y,w,h) => 'style="--x:'+x+';--y:'+y+';--w:'+w+';--h:'+h+'"';
function mask(x,y,w,h,content,cls='',surface='') { return '<div class="positioned mask '+cls+'" '+at(x,y,w,h).replace('"','"'+(surface?'--surface:'+surface+';':''))+'>'+content+'</div>'; }
function button(x,y,w,h,label,attrs,cls='hotspot',content='') { return '<button type="button" class="positioned '+cls+'" '+at(x,y,w,h)+' aria-label="'+esc(label)+'" '+attrs+'>'+content+'</button>'; }
function crop(file,x,y,w,h) { return '<span class="crop" aria-hidden="true"><svg viewBox="'+[x,y,w,h].join(' ')+'" preserveAspectRatio="xMidYMid slice"><image href="assets/'+file+'" width="768" height="1376"></image></svg></span>'; }
function portrait(id) { return '<span class="pet-portrait">'+(id==='mimi'?crop('home.jpg',88,416,82,82):crop('home.jpg',425,405,88,88))+'</span>'; }
function startArt(name, title) { return '<section class="artboard '+name+'-art" aria-label="'+title+'"><img class="source-art" src="assets/'+name+(name==='record'?'.png':'.jpg')+'" width="768" height="1376" alt="">'; }
function nav() {
  const items=[['home','首页',84,1282,56,46],['record','记录',268,1280,52,46],['health','健康',451,1280,47,47],['profile','我的',634,1280,45,46]];
  return '<nav class="nav-art screen-nav" aria-label="主要功能">'+items.map(([v,l,x,y,w,h],i)=>'<button type="button" data-view="'+v+'" style="left:'+i*25+'%" '+(ui.view===v?'aria-current="page"':'')+'><span class="nav-icon">'+crop('home.jpg',x,y,w,h)+'</span>'+l+'</button>').join('')+'</nav>';
}
function petSwitch(mode) {
  const isHome=mode==='home';
  return ['mimi','lucky'].map((id,i)=>{
    const p=state.pets[id], x=isHome?(i?394:53):(i?396:40), y=isHome?382:223, w=isHome?320:331, h=isHome?143:121;
    const nameX=isHome?(i?529:189):(i?539:182), nameY=isHome?414:250;
    const surface=isHome?(i?'#fcf3eb':'#edf8ff'):(i?'#ffeadb':'#daf3ef');
    return mask(nameX,nameY,isHome?(i?166:129):153,44,'<span class="pet-name">'+esc(p.name)+'</span>','name',surface)
      +mask(nameX,nameY+47,isHome?166:150,38,'品种：'+esc(p.kind),'breed',surface)
      +button(x,y,w,h,'切换到'+p.name,'data-pet="'+id+'" aria-pressed="'+(state.pet===id)+'"')
      +(state.pet===id?'<div class="positioned pet-outline" '+at(x,y,w,h)+'><span class="selected-check">✓</span></div>':'');
  }).join('');
}
function home() {
  const s=M.summary(state,state.pet,ui.date), health=s.health;
  return startArt('home','宠物健康记录首页')
    +petSwitch('home')
    +mask(169,697,266,39,'已完成 '+s.feedDone+'次/'+s.feedGoal+'次')
    +mask(168,815,265,43,'已完成 '+s.walkCount+'次，'+s.walkMinutes+'分钟')
    +mask(168,931,140,44,esc(health)+(health==='良好'?' ☺':''),'pill '+(health==='良好'?'':'caution'))
    +mask(170,1120,183,78,'<span>'+dateText(ui.date)+'</span><small>'+weekdays[new Date(ui.date+'T12:00:00').getDay()]+'</small>','date-copy')
    +mask(515,1171,112,38,esc(health),'', '#fffefb')
    +mask(521,1110,63,61,'')
    +'<div class="positioned live-meter" '+at(422,1131,182,26)+'><span style="left:'+(health==='良好'?72:health==='需要观察'?45:health==='需要关注'?15:50)+'%">'+crop('home.jpg',524,1115,51,55)+'</span></div>'
    +'<span class="positioned health-dot" '+at(592,1178,21,21).replace('"','"background:'+(health==='良好'?'#68d375':health==='待记录'?'#bbc4c2':'#e3b271')+';')+'></span>'
    +button(70,647,370,102,'修改'+current().name+'的喂食记录','data-summary="feed"')
    +button(70,765,370,102,'修改'+current().name+'的遛弯记录','data-summary="walk"')
    +button(70,885,370,107,'修改'+current().name+'的健康记录','data-summary="health"')
    +button(485,628,230,165,'新增记录','data-action="new-record"')
    +button(485,817,230,198,'查看宠物档案','data-view="profile"')
    +button(55,1040,317,188,'选择摘要日期','data-action="date"')
    +button(395,1040,320,188,'查看健康状态与记录','data-view="health"')
    +[['home','首页'],['record','记录'],['health','健康'],['profile','我的']].map(([v,l],i)=>button(i*192,1261,192,115,l,'data-view="'+v+'"'+(v==='home'?' aria-current="page"':''))).join('')
    +'</section>';
}
function makeDraft(type, existing) {
  const p=current();
  return existing?{...existing,symptoms:[...(existing.symptoms||[])]}:{pet:state.pet,type,date:ui.date,time:new Date().toTimeString().slice(0,5),food:p.food,amount:p.portion,activity:p.animal==='猫咪'?'室内活动':'户外遛弯',minutes:30,status:'良好',symptoms:['正常'],note:'',photo:''};
}
function prepareRecord(type='feed', existing=null) {
  ui.type=type;
  ui.drafts=Object.fromEntries(M.TYPES.map(t=>[t,makeDraft(t,t===type?existing:null)]));
  ui.photoToken++;
}
function activeDraft(){ return ui.drafts[ui.type]; }
function selectOptions(items,value) { return [...new Set([value,...items])].map(v=>'<option value="'+esc(v)+'"'+(v===value?' selected':'')+'>'+esc(v)+'</option>').join(''); }
function field(x,y,w,h,type,key,label,value,extra='',classes='') {
  return '<input class="positioned field '+classes+'" '+at(x,y,w,h)+' data-field="'+key+'" data-kind="'+type+'" aria-label="'+label+'" value="'+esc(value)+'" '+extra+'>';
}
function record() {
  if (!ui.drafts.feed) prepareRecord();
  const f=ui.drafts.feed,w=ui.drafts.walk,h=ui.drafts.health,d=activeDraft();
  const selectedIndex=M.TYPES.indexOf(ui.type);
  let html=startArt('record','新增与修改宠物记录')
    +mask(305,130,430,46,esc(current().name)+' · '+d.date,'record-subtitle')
    +button(315,20,120,39,'返回首页','data-view="home"','mode-back','‹ 返回首页')
    +button(510,20,217,39,'查看已保存的记录','data-view="history"','mode-back','已保存的记录 ›')
    +petSwitch('record')
    +'<form id="record-form" data-record-form novalidate>'
    +mask(305,72,430,59,d.id?'修改记录':'新增记录','record-page-title','#eaf6f6');
  html+='<div class="positioned type-cover" '+at(254,385,132,140)+' '+(ui.type==='feed'?'hidden':'')+'>'+crop('record.png',285,411,75,57)+'喂食</div>';
  // The artwork already contains these section titles; the buttons only add interaction.
  html+=M.TYPES.map((t,i)=>button(252+i*157,382,140,146,'选择'+labels[t]+'记录','data-type="'+t+'" aria-pressed="'+(t===ui.type)+'"')).join('')
    +'<div class="positioned type-ring" '+at(252+selectedIndex*157,382,140,146)+'></div>'
    +button(70,577,207,43,'选择喂食记录','data-type="feed"','hotspot record-heading-link '+(ui.type==='feed'?'is-selected':''))
    +button(618,574,84,39,'编辑喂食记录时间与备注','data-action="record-details" data-kind="feed"','small-control','编辑 ▴')
    +'<input class="positioned field food" '+at(72,666,299,58)+' data-field="food" data-kind="feed" aria-label="食物类型" list="food-options" value="'+esc(f.food)+'" maxlength="100"><datalist id="food-options">'+selectOptions(['猫粮','狗粮','湿粮','营养罐头','冻干零食'],f.food)+'</datalist>'
    +'<span class="positioned field-icon" '+at(84,680,36,33)+'>'+crop('record.png',85,682,35,29)+'</span>'
    +field(397,666,299,58,'feed','amount','喂食量（克）',f.amount,'type="number" min="0.1" max="10000" step="0.1"','amount')
    +'<span class="positioned field-icon" '+at(412,679,36,33)+'>'+crop('record.png',412,680,33,34)+'</span>'
    +field(72,781,299,58,'feed','time','喂食时间',f.time,'type="time"')
    +field(397,781,299,58,'feed','note','喂食备注',f.note,'placeholder="写下今天的食欲" maxlength="2000"','note')
    +button(71,906,168,43,'选择遛弯记录','data-type="walk"','hotspot record-heading-link '+(ui.type==='walk'?'is-selected':''))
    +button(274,903,82,39,'编辑遛弯时间和备注','data-action="record-details" data-kind="walk"','small-control','编辑 ▾')
    +'<div class="positioned walk-values" '+at(71,954,278,39)+'><select data-field="activity" data-kind="walk" aria-label="活动类型">'+selectOptions(['室内活动','户外遛弯','玩具互动'],w.activity)+'</select><output id="walk-output">'+w.minutes+' 分钟</output></div>'
    +'<div class="positioned" '+at(72,995,274,30)+'><input class="walk-slider" type="range" min="0" max="'+Math.max(120,w.minutes)+'" value="'+w.minutes+'" data-field="minutes" data-kind="walk" aria-label="活动分钟数"></div>'
    +button(423,906,174,43,'选择健康记录','data-type="health"','hotspot record-heading-link '+(ui.type==='health'?'is-selected':''))
    +button(625,903,83,39,'编辑健康时间和备注','data-action="record-details" data-kind="health"','small-control','编辑 ▾')
    +'<div class="positioned symptom-options" '+at(423,956,281,39)+'>'+['正常','呕吐','腹泻'].map(s=>'<label><input type="checkbox" data-symptom="'+s+'"'+(h.symptoms.includes(s)?' checked':'')+'>'+s+'</label>').join('')+'</div>'
    +'<div class="positioned symptom-options" '+at(423,996,148,34)+'><label><input type="checkbox" data-symptom="食欲下降"'+(h.symptoms.includes('食欲下降')?' checked':'')+'>食欲下降</label></div>'
    +'<select class="positioned health-status" '+at(578,995,129,38)+' data-field="status" data-kind="health" aria-label="健康状态">'+selectOptions(M.STATUSES,h.status)+'</select>'
    +'<input id="record-photo" class="upload-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" aria-label="添加记录照片">'
    +button(72,1120,160,112,'上传记录照片','data-action="upload"')
    +button(247,1121,113,111,d.photo?'查看或替换照片':'添加记录照片','data-action="upload" data-photo-preview','photo-tile',photoPreview(d))
    +button(386,1121,110,111,'添加或替换记录照片','data-action="upload"','photo-tile','<span style="font-size:8cqw">＋</span>')
    +button(518,1142,170,45,'移除本条记录的照片','data-action="remove-photo" '+(d.photo?'':'hidden'),'photo-remove','移除照片')
    +mask(210,1241,362,30,(d.id?'修改':'新增')+' · '+labels[ui.type]+'记录','record-help')
    +'<button class="positioned save-art" '+at(185,1282,398,67)+' type="submit" '+(ui.busy?'disabled':'')+'>'+(ui.busy?'保存中…':d.id?'保存修改':'保存')+crop('record.png',415,1296,40,40)+'</button>'
    +'</form></section>';
  return html;
}
function profile() {
  const p=current(),s=M.summary(state,state.pet,ui.date);
  const vaccines=p.vaccines.map(v=>v.name+'：'+(v.done?'已完成':v.due||'待记录'));
  return startArt('profile','宠物档案')
    +button(20,20,145,45,'返回首页','data-view="home"','mode-back','‹ 返回首页')
    +mask(70,356,280,42,'宠物切换','profile-title')
    +['mimi','lucky'].map((id,i)=>button(i?315:70,405,i?224:224,90,'切换到'+state.pets[id].name,'data-pet="'+id+'" aria-pressed="'+(state.pet===id)+'"','profile-switch',portrait(id)+'<span><strong>'+esc(state.pets[id].name)+'</strong><small>'+(state.pet===id?'当前宠物':'点击切换')+'</small></span>')).join('')
    +'<article class="positioned profile-main" '+at(67,518,634,213)+'>'+portrait(state.pet)+'<div><h1>'+esc(p.name)+'</h1><p>品种：'+esc(p.kind)+'</p><dl><div><dt>年龄</dt><dd>'+esc(p.age)+'</dd></div><div><dt>身高</dt><dd>'+esc(p.height)+'</dd></div><div><dt>体重</dt><dd>'+p.weight+' kg</dd></div></dl></div><button class="edit-round" type="button" data-action="edit-profile" aria-label="编辑昵称、年龄和体重">✎</button></article>'
    +mask(140,765,225,40,'基本信息','profile-section-title')
    +mask(88,812,260,103,'<p>芯片：'+esc(p.chip||'未填写')+'</p><p>生日：'+esc(p.birthday||'未填写')+'</p><p>毛色：'+esc(p.color||'未填写')+'</p>','profile-body')
    +button(69,747,305,181,'编辑宠物基本信息','data-action="edit-profile"')
    +mask(460,765,235,40,'健康记录','profile-section-title')
    +mask(413,812,277,103,'<p>喂食：'+s.feedDone+' / '+s.feedGoal+' 次</p><p>运动：'+s.walkMinutes+' 分钟</p><p>健康状态：'+esc(s.health)+'</p>','profile-body')
    +button(395,747,305,181,'查看宠物健康记录','data-view="health"')
    +mask(141,966,229,40,'疫苗记录','profile-section-title')
    +mask(86,1013,279,66,vaccines.slice(0,2).map(v=>'<p>'+esc(v)+'</p>').join('')||'<p>暂无疫苗记录</p>','profile-body')
    +button(87,1083,268,39,'管理疫苗记录','data-action="vaccines"','profile-link','管理记录 ＋')
    +mask(460,966,234,40,'医疗历史','profile-section-title')
    +mask(413,1013,276,66,'<p>'+esc(p.history[0]||'暂无就诊记录')+'</p>','profile-body')
    +button(413,1083,268,39,'查看完整健康与医疗记录','data-view="history"','profile-link','查看完整记录')
    +mask(140,1168,295,43,'宠物详情','profile-section-title')
    +mask(88,1220,442,101,'<p>喜欢的食物：'+esc(p.favorite||'未填写')+'</p><p>过敏情况：'+esc(p.allergies||'未填写')+'</p><p>特别备注：'+esc(p.notes||'未填写')+'</p>','profile-body detail-body')
    +button(70,1156,632,180,'编辑宠物偏好和详细档案','data-action="edit-profile"')
    +'</section>'+nav();
}
function describe(r) {
  if(r.type==='feed') return r.food+' '+r.amount+'g';
  if(r.type==='walk') return r.activity+' '+r.minutes+' 分钟';
  return (r.symptoms||[]).join('、')||r.status;
}
function recordRows(records) {
  return records.map(r=>'<button type="button" class="utility-row" data-edit="'+esc(r.id)+'"><span><strong>'+labels[r.type]+' · '+esc(describe(r))+'</strong><small>'+r.date+' '+r.time+'</small><small>'+esc(r.note)+'</small></span>'+(r.photo?'<img src="'+esc(r.photo)+'" alt="'+esc(labels[r.type])+'记录照片">':'')+'<b>修改 ›</b></button>').join('')||'<p class="empty">还没有这一类记录，添加一条吧。</p>';
}
function utility() {
  const p=current(),s=M.summary(state,state.pet,ui.date);
  let records=M.recordsFor(state,state.pet).slice().reverse();
  if(ui.filter!=='all') records=records.filter(r=>r.type===ui.filter);
  return '<section class="utility-screen"><header class="utility-head"><div><h1>'+(ui.view==='health'?'健康记录':'已保存的记录')+'</h1><p>'+esc(p.name)+' · '+dateText(ui.date)+'</p></div>'+portrait(state.pet)+'</header>'
    +'<div class="utility-chips">'+['mimi','lucky'].map(id=>'<button type="button" data-pet="'+id+'" aria-pressed="'+(state.pet===id)+'">'+esc(state.pets[id].name)+'</button>').join('')+'</div>'
    +(ui.view==='health'?'<article class="utility-card"><h2>'+esc(s.health)+'</h2><p>已记录喂食 '+s.feedDone+' 次、活动 '+s.walkMinutes+' 分钟。'+(s.health==='待记录'?'今天还没有健康观察记录。':'状态来自你填写的健康观察。')+'</p><button class="utility-button" type="button" data-new-type="health">＋ 添加健康记录</button></article><article class="utility-card"><h2>疫苗与健康档案</h2>'+p.vaccines.map(v=>'<div class="utility-row"><span><strong>'+esc(v.name)+'</strong><small>'+esc(v.due)+'</small></span><b>'+(v.done?'已完成':'待确认')+'</b></div>').join('')+'<button class="utility-button" type="button" data-action="vaccines">编辑疫苗记录</button></article>':'')
    +'<article class="utility-card"><h2>记录列表</h2><div class="utility-chips">'+[['all','全部'],...Object.entries(labels)].map(([id,l])=>'<button type="button" data-filter="'+id+'" aria-pressed="'+(ui.filter===id)+'">'+l+'</button>').join('')+'</div>'+recordRows(records)+'<button type="button" class="utility-button" data-action="new-record">＋ 新增记录</button></article>'
    +(ui.view==='history'?'<article class="utility-card"><h2>医疗历史</h2>'+p.history.map(line=>'<p>'+esc(line)+'</p>').join('')+'<button type="button" class="utility-button" data-action="medical">添加就诊记录</button></article>':'')
    +'</section>'+nav();
}
function render(keepScroll=false) {
  const scroll=screen.scrollTop;
  screen.className='app-screen view-'+ui.view;
  screen.innerHTML=({home,record,profile,health:utility,history:utility}[ui.view]||home)();
  screen.scrollTop=keepScroll?scroll:0;
}
function persist(message='已保存') {
  state.date=ui.date;
  const ok=M.persist(storage,state);
  toast(ok?message:'本次修改已生效，但浏览器空间不足，刷新后可能丢失。请减少照片后再保存。');
  return ok;
}
function toast(message) {
  const t=$('#toast');t.textContent=message;t.classList.add('show');
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3000);
}
function openDialog(title,content) {
  dialog.innerHTML='<div class="dialog-top"><h2 id="dialog-title">'+title+'</h2><button class="close-dialog" type="button" data-action="close" aria-label="关闭">×</button></div>'+content;
  positionDialog();
  if(!dialog.open) dialog.showModal();
}
function positionDialog() {
  const rect=$('.phone-shell').getBoundingClientRect();
  dialog.style.left=(rect.left+4)+'px';
  dialog.style.width=(rect.width-8)+'px';
  dialog.style.bottom=Math.max(4,window.innerHeight-rect.bottom+4)+'px';
  dialog.style.maxHeight=Math.max(160,rect.height*.9)+'px';
}
window.addEventListener('resize',()=>{if(dialog.open)positionDialog();});
function photoPreview(d) {
  return d.photo?'<img src="'+esc(d.photo)+'" alt="本条记录的照片">':'<span class="sample-photo">'+crop('record.png',249,1122,110,110)+'</span><small>示例 · 点击替换</small>';
}
function activateType(type) {
  ui.type=type;
  const d=activeDraft();
  const title=$('.record-page-title');if(title)title.textContent=d.id?'修改记录':'新增记录';
  const subtitle=$('.record-subtitle');if(subtitle)subtitle.textContent=current().name+' · '+d.date;
  const ring=$('.type-ring');if(ring)ring.style.setProperty('--x',252+M.TYPES.indexOf(type)*157);
  const cover=$('.type-cover');if(cover)cover.hidden=type==='feed';
  const help=$('.record-help');if(help)help.textContent=(d.id?'修改':'新增')+' · '+labels[type]+'记录';
  const save=$('.save-art');if(save)save.firstChild.textContent=d.id?'保存修改':'保存';
  const preview=$('[data-photo-preview]');if(preview)preview.innerHTML=photoPreview(d);
  const remove=$('[data-action="remove-photo"]');if(remove)remove.hidden=!d.photo;
  document.querySelectorAll('[data-type]').forEach(b=>{
    b.setAttribute('aria-pressed',String(b.dataset.type===type));
    b.classList.toggle('is-selected',b.dataset.type===type);
  });
}
function dialogField(name,label,value,extra='') {return '<label>'+label+'<input name="'+name+'" value="'+esc(value)+'" '+extra+'></label>';}
function profileEditor() {
  const p=current();
  openDialog('编辑'+esc(p.name)+'的档案','<form data-profile-form><div class="form-grid">'
    +dialogField('name','宠物昵称',p.name,'required maxlength="12"')
    +dialogField('kind','品种',p.kind,'required maxlength="24"')
    +dialogField('age','年龄',p.age,'required placeholder="例如：2岁6个月" maxlength="24"')
    +dialogField('weight','体重（kg）',p.weight,'type="number" min="0.1" max="300" step="0.1" required')
    +dialogField('height','身高',p.height,'maxlength="24"')
    +dialogField('birthday','生日',p.birthday,'type="date"')
    +dialogField('color','毛色',p.color,'maxlength="50"')
    +dialogField('feedGoal','每日喂食目标（次）',p.feedGoal,'type="number" min="1" max="20" step="1" required')
    +'</div>'+dialogField('chip','芯片编号',p.chip,'maxlength="50"')
    +dialogField('favorite','喜欢的食物',p.favorite,'maxlength="100"')
    +dialogField('allergies','过敏情况',p.allergies,'maxlength="100"')
    +'<label>特别备注<textarea name="notes" maxlength="1000">'+esc(p.notes)+'</textarea></label><p class="form-error" role="alert"></p><button class="dialog-save" type="submit">保存档案</button></form>');
}
function detailsEditor(type) {
  ui.type=type;
  const d=activeDraft();
  openDialog(labels[type]+'记录','<form data-detail-form><p class="record-meta"><span>'+esc(current().name)+'</span><span>'+(d.id?'正在修改已有记录':'新增一条记录')+'</span></p><div class="form-grid">'
    +dialogField('date','记录日期',d.date,'type="date" required')
    +dialogField('time','记录时间',d.time,'type="time" required')+'</div>'
    +(type==='walk'?dialogField('minutes','活动分钟数',d.minutes,'type="number" min="0" max="1440" required'):'')
    +'<label>备注<textarea name="note" maxlength="2000">'+esc(d.note)+'</textarea></label><button class="dialog-save" type="submit">更新填写内容</button>'
    +(d.id?'<button class="dialog-save destructive" type="button" data-action="delete-record">删除这条记录</button>':'')+'</form>');
}
function vaccinations() {
  openDialog('疫苗记录','<form data-vaccine-form>'+current().vaccines.map((v,i)=>'<div class="form-grid">'+dialogField('vname-'+i,'疫苗名称',v.name,'required maxlength="60"')+dialogField('vdue-'+i,'接种或到期时间',v.due,'maxlength="80"')+'</div><label>接种状态<select name="vdone-'+i+'"><option value="false"'+(!v.done?' selected':'')+'>待确认</option><option value="true"'+(v.done?' selected':'')+'>已完成</option></select></label>').join('')
    +'<hr>'+dialogField('new-name','新增疫苗（选填）','','maxlength="60"')+dialogField('new-due','接种或到期时间','','maxlength="80"')+'<button class="dialog-save" type="submit">保存疫苗记录</button></form>');
}
function navigate(view) {
  if(ui.busy)return;
  if(view==='record')prepareRecord();
  ui.view=view;render();
}
function readPhoto(file) {
  return new Promise((resolve,reject)=>{
    if(!file||!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type))return reject(new Error('请选择 JPG、PNG、WebP、GIF 或 AVIF 图片'));
    if(file.size>1500000)return reject(new Error('请选择小于 1.5 MB 的照片，方便保存到本机'));
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('照片读取失败，请重新选择'));
    reader.readAsDataURL(file);
  });
}
document.addEventListener('click',event=>{
  const b=event.target.closest('button, [data-view]'); if(!b||b.disabled)return;
  if(b.dataset.view){navigate(b.dataset.view);return;}
  if(b.dataset.pet){
    if(ui.busy)return;
    state.pet=b.dataset.pet;
    if(ui.view==='record')prepareRecord(ui.type);
    M.persist(storage,state);render(true);return;
  }
  if(b.dataset.summary){
    const type=b.dataset.summary;
    prepareRecord(type,M.lastRecord(state,state.pet,type,ui.date));ui.view='record';render();return;
  }
  if(b.dataset.edit){
    const r=state.records.find(item=>item.id===b.dataset.edit);
    if(r){prepareRecord(r.type,r);ui.view='record';render();}return;
  }
  if(b.dataset.newType){prepareRecord(b.dataset.newType);ui.view='record';render();return;}
  if(b.dataset.type){ui.type=b.dataset.type;render(true);return;}
  if(b.dataset.filter){ui.filter=b.dataset.filter;render(true);return;}
  const action=b.dataset.action;
  if(action==='close'){dialog.close();return;}
  if(action==='new-record'){prepareRecord();ui.view='record';render();}
  if(action==='edit-profile')profileEditor();
  if(action==='record-details')detailsEditor(b.dataset.kind);
  if(action==='vaccines')vaccinations();
  if(action==='design')openDialog('配色与组件设计说明','<p>原始设计稿 · 首页、记录与档案沿用这套柔和配色、圆润组件和动物插画。</p><img class="design-image" src="assets/design-system.jpg" alt="配色与组件设计说明原稿">');
  if(action==='date')openDialog('选择摘要日期','<form data-date-form>'+dialogField('date','查看这一天的记录',ui.date,'type="date" required')+'<p>演示初始记录为 2024年5月20日，可切换日期添加自己的记录。</p><button class="dialog-save" type="submit">查看这一天</button></form>');
  if(action==='upload')$('#record-photo')?.click();
  if(action==='remove-photo'){activeDraft().photo='';render(true);}
  if(action==='medical')openDialog('添加就诊记录','<form data-medical-form>'+dialogField('date','就诊日期',ui.date,'type="date" required')+'<label>就诊内容<textarea name="note" maxlength="400" required placeholder="医院、就诊原因与检查记录"></textarea></label><button class="dialog-save" type="submit">保存就诊记录</button></form>');
  if(action==='delete-record')openDialog('删除这条记录？','<p>删除后，首页对应的摘要也会更新。</p><button class="dialog-save destructive" type="button" data-action="confirm-delete">确认删除</button><button class="dialog-save dialog-secondary" type="button" data-action="close">保留记录</button>');
  if(action==='confirm-delete'){
    state=M.removeRecord(state,activeDraft().id);dialog.close();ui.view='home';persist('记录已删除，首页已更新');render();
  }
  if(action==='reset')openDialog('重置演示数据？','<p>将恢复咪咪、旺旺的示例档案。本机添加的记录和照片会被清除。</p><button class="dialog-save destructive" type="button" data-action="confirm-reset">恢复初始演示</button><button class="dialog-save dialog-secondary" type="button" data-action="close">保留我的记录</button>');
  if(action==='confirm-reset'){
    state=M.defaults();ui.date=state.date;ui.view='home';ui.drafts={};dialog.close();persist('已恢复示例档案');render();
  }
});
document.addEventListener('input',event=>{
  const el=event.target;
  if(el.dataset.field){
    const d=ui.drafts[el.dataset.kind];
    d[el.dataset.field]=['amount','minutes'].includes(el.dataset.field)?Number(el.value):el.value;
    // Keep typing stable; focus selects the record without replacing the input node.
    if(el.dataset.field==='minutes'&&$('#walk-output'))$('#walk-output').textContent=el.value+' 分钟';
  }
});
document.addEventListener('focusin',event=>{
  const type=event.target.dataset.kind;
  if(type&&ui.view==='record'&&!dialog.open&&ui.type!==type){
    activateType(type);
  }
});
document.addEventListener('change',async event=>{
  const el=event.target;
  if(el.dataset.field){
    const d=ui.drafts[el.dataset.kind];
    d[el.dataset.field]=['amount','minutes'].includes(el.dataset.field)?Number(el.value):el.value;
    if(el.dataset.kind)activateType(el.dataset.kind);
  }
  if(el.dataset.symptom){
    ui.type='health';
    const d=ui.drafts.health,s=el.dataset.symptom;
    d.symptoms=el.checked?[...new Set([...d.symptoms,s])]:d.symptoms.filter(v=>v!==s);
    if(el.checked&&s==='正常')d.symptoms=['正常'];
    else if(el.checked)d.symptoms=d.symptoms.filter(v=>v!=='正常');
    if(d.symptoms.some(v=>v!=='正常')&&d.status==='良好')d.status='需要观察';
    render(true);
  }
  if(el.id==='record-photo'&&el.files?.[0]){
    const d=activeDraft(),token=++ui.photoToken;
    try{
      ui.busy=true;
      const photo=await readPhoto(el.files[0]);
      if(token===ui.photoToken){d.photo=photo;toast('照片已添加，点击保存后写入记录');}
    }catch(error){toast(error.message);}
    finally{ui.busy=false;if(ui.view==='record')render(true);}
  }
});
document.addEventListener('submit',event=>{
  const form=event.target;
  if(!form.matches('[data-record-form],[data-profile-form],[data-detail-form],[data-date-form],[data-vaccine-form],[data-medical-form]'))return;
  event.preventDefault();
  try{
    if(form.matches('[data-record-form]')){
      if(ui.busy)return;
      const d=activeDraft(),editing=Boolean(d.id);
      state=M.upsertRecord(state,d);ui.date=d.date;ui.view='home';
      persist((editing?'记录已修改':'新增记录已保存')+'，首页摘要已更新');render();return;
    }
    const data=new FormData(form);
    if(form.matches('[data-profile-form]')){
      const patch=Object.fromEntries(data.entries());patch.weight=Number(patch.weight);patch.feedGoal=Number(patch.feedGoal);
      state=M.updatePet(state,state.pet,patch);dialog.close();persist('宠物档案已更新，昵称已同步');render(true);
    }
    if(form.matches('[data-detail-form]')){
      Object.assign(activeDraft(),{date:String(data.get('date')),time:String(data.get('time')),note:String(data.get('note'))});
      if(ui.type==='walk')activeDraft().minutes=Number(data.get('minutes'));
      dialog.close();render(true);toast('填写内容已更新，点击底部保存写入记录');
    }
    if(form.matches('[data-date-form]')){
      ui.date=String(data.get('date'));dialog.close();persist('已切换摘要日期');render();
    }
    if(form.matches('[data-vaccine-form]')){
      const vaccines=current().vaccines.map((v,i)=>({name:String(data.get('vname-'+i)),due:String(data.get('vdue-'+i)),done:data.get('vdone-'+i)==='true'}));
      if(String(data.get('new-name')||'').trim())vaccines.push({name:String(data.get('new-name')),due:String(data.get('new-due')),done:false});
      state=M.updatePet(state,state.pet,{vaccines});dialog.close();persist('疫苗记录已更新');render(true);
    }
    if(form.matches('[data-medical-form]')){
      state=M.updatePet(state,state.pet,{history:[dateText(String(data.get('date')))+' '+String(data.get('note')).trim(),...current().history]});
      dialog.close();persist('就诊记录已保存');render(true);
    }
  }catch(error){
    const target=$('.form-error',form);
    if(target)target.textContent=error.message;else toast(error.message);
  }
});
render();
})();

/* Original interpretations for the twelve unique cards in The Word of Plants. */
(function(root) {
'use strict';
const cards = [
 {id:'fool',number:'0',name:'愚者',english:'The Fool',plant:'缠绕的枝蔓',x:212,y:0,words:'好奇 · 出发 · 留白',meaning:'枝蔓还不知道会长向哪里，却已经开始寻找光。新的尝试不需要在第一步就拥有完整答案。',question:'如果暂时放下“必须做好”，你最想先试哪一步？',action:'为心里的想法留出十分钟，做一个小到今天就能完成的尝试。'},
 {id:'magician',number:'I',name:'魔术师',english:'The Magician',plant:'蕨叶与菌菇',x:409,y:0,words:'行动 · 资源 · 转化',meaning:'蕨叶展开已有的力量，菌菇把隐蔽的养分连接起来。你可以先看看手中已有的能力、素材和支持。',question:'你正在等待的东西，有没有一部分其实已经在你身边？',action:'写下三样现成的资源，选一件把它真正用起来。'},
 {id:'priestess',number:'II',name:'女祭司',english:'The High Priestess',plant:'睡莲',x:606,y:0,words:'直觉 · 静观 · 内在',meaning:'水面看起来安静，水下仍有细微的变化。给自己一点时间，分辨外界的声音和自己的真实感受。',question:'当没有人评价时，你对这件事的第一感受是什么？',action:'暂停寻找新的意见，把已经感受到却还没说出口的想法写下来。'},
 {id:'empress',number:'III',name:'女皇',english:'The Empress',plant:'石榴',x:804,y:0,words:'滋养 · 创造 · 丰盛',meaning:'果实需要时间与照料。你关心的事物，或许更需要持续的养分，而非一次用尽全部力气。',question:'你希望什么继续生长？它现在需要怎样的照顾？',action:'为一个重要的人、作品或日常习惯，安排一次具体的照料。'},
 {id:'emperor',number:'IV',name:'皇帝',english:'The Emperor',plant:'橡树叶',x:1000,y:0,words:'边界 · 结构 · 稳定',meaning:'树木依靠枝干承托繁盛。清楚的边界与规则，可以为自由留下更可靠的空间。',question:'什么需要被确定下来，才能让你更安心地行动？',action:'为当前的事情写下一条清楚的边界或一个可执行的步骤。'},
 {id:'hierophant',number:'V',name:'教皇',english:'The Hierophant',plant:'银杏',x:606,y:264,words:'传承 · 学习 · 价值',meaning:'银杏的叶脉把过去与现在连接。旧经验可以成为支点，也值得经过你自己的理解再使用。',question:'你遵循的规则里，哪些仍然与你的价值一致？',action:'重读一条影响你的建议，写下你今天会怎样解释它。'},
 {id:'lovers',number:'VI',name:'恋人',english:'The Lovers',plant:'玫瑰与常春藤',x:804,y:264,words:'连接 · 选择 · 真诚',meaning:'花与藤共享空间，也保留各自的方向。好的连接需要真实的表达，选择也需要回应内心的价值。',question:'什么选择能让你的行动更接近你真正重视的东西？',action:'用一句不带指责的话，表达一件真实的需要。'},
 {id:'chariot',number:'VII',name:'战车',english:'The Chariot',plant:'蓟',x:1000,y:264,words:'方向 · 坚定 · 推进',meaning:'蓟的轮廓带着锋芒，花仍朝着自己的方向盛开。把分散的力气收回来，为下一段路选一个方向。',question:'你现在最需要推进的一件事是什么？',action:'暂时放下一个次要目标，让重要的事情获得一段不被打断的时间。'},
 {id:'strength',number:'VIII',name:'力量',english:'Strength',plant:'向日葵',x:409,y:532,words:'勇气 · 温柔 · 耐心',meaning:'向光生长也可以是一种温柔的坚持。你可以承认不安，同时给自己一个继续尝试的机会。',question:'面对这件事，你能否对自己稍微温柔一点？',action:'把一句苛刻的自我评价，改写成一句可以帮助行动的话。'},
 {id:'hermit',number:'IX',name:'隐者',english:'The Hermit',plant:'灯笼果',x:606,y:532,words:'独处 · 观察 · 微光',meaning:'薄薄的果壳里藏着一盏小灯。独处可以帮助你重新找到自己的节奏，听见更细小的声音。',question:'最近哪些声音太响，让你听不见自己？',action:'留一段没有通知打扰的时间，观察自己真正想做什么。'},
 {id:'wheel',number:'X',name:'命运之轮',english:'Wheel of Fortune',plant:'种子之环',x:804,y:532,words:'周期 · 变化 · 可能',meaning:'不同种子有不同的生长时节。变化提醒你重新观察局面，调整能由自己决定的部分。',question:'什么正在变化？你愿意怎样回应这个变化？',action:'分开写下“我能行动的”和“需要等待的”，先照顾前一项。'},
 {id:'justice',number:'XI',name:'正义',english:'Justice',plant:'相对的枝叶',x:1000,y:532,words:'平衡 · 诚实 · 责任',meaning:'相对的枝叶让画面取得平衡。试着同时看见自己的需要、事实与他人的位置。',question:'如果换一个角度观察，你还会补充什么信息？',action:'把事实与猜测分别写下，再决定下一步。'}
];
function shuffle(random=Math.random) {
 const deck=cards.slice();
 for(let i=deck.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[deck[i],deck[j]]=[deck[j],deck[i]];}
 return deck;
}
function artStyle(card) {
 const w=166,h=236;
 return 'background-image:url("images/word-of-plants-cover.png");background-size:'+(1376/w*100)+'% '+(768/h*100)+'%;background-position:'+(card.x/(1376-w)*100)+'% '+(card.y/(768-h)*100)+'%';
}
root.PlantTarot={cards,shuffle,artStyle};
if(typeof module!=='undefined')module.exports=root.PlantTarot;
})(typeof window!=='undefined'?window:globalThis);


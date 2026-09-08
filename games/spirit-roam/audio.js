/* Small original generative score. Audio starts only after a user gesture. */
window.SpiritAudio=(()=>{let ac,master,music,sfx,preferences={},interval=null,note=0,unlocked=false;const notes=[261.63,329.63,392,493.88,440,392,329.63,293.66,220,329.63,440,523.25,493.88,392,329.63,293.66];
 function tone(channel,freq,duration,level,type='sine',delay=0){if(!ac||ac.state!=='running')return;const at=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=freq;o.connect(g);g.connect(channel);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(level,at+.025);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.start(at);o.stop(at+duration+.05);o.onended=()=>{o.disconnect();g.disconnect();};}
 function phrase(){if(!preferences.music||document.hidden||!unlocked)return;const f=notes[note++%notes.length];tone(music,f,2,.035);tone(music,f*2,1.1,.009,'sine',.06);if(note%4===1)tone(music,f/2,3,.018);}
 // Settings affect the live audio graph, including notes that are already ringing.
 // Keep the score clock independent so slider changes never trigger another note.
 function sync(p){preferences={...p};if(!ac)return;const volume=Number.isFinite(p.volume)?Math.max(0,Math.min(1,p.volume)):.5;master.gain.setValueAtTime(volume,ac.currentTime);music.gain.setValueAtTime(p.music?1:0,ac.currentTime);sfx.gain.setValueAtTime(p.sound?1:0,ac.currentTime);}
 function startClock(){if(interval!==null||document.hidden)return;phrase();interval=setInterval(phrase,850);}
 async function unlock(p){preferences={...p};try{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();music=ac.createGain();sfx=ac.createGain();music.connect(master);sfx.connect(master);master.connect(ac.destination);}sync(preferences);await ac.resume();unlocked=true;startClock();}catch{}}
 function fx(type){if(!preferences.sound||!unlocked)return;const f={keepsake:1320,gem:1100,jump:440,attack:660,hurt:130,defeat:260,heal:780,shield:880,win:1046,block:587,checkpoint:932,select:740}[type]||450;tone(sfx,f,.18,.065,type==='hurt'?'triangle':'sine');if(type==='win'||type==='keepsake'){tone(sfx,f*1.25,.35,.045,'sine',.12);tone(sfx,f*1.5,.5,.04,'sine',.25);}}
 document.addEventListener('visibilitychange',async()=>{if(document.hidden){if(interval!==null)clearInterval(interval);interval=null;try{await ac?.suspend();}catch{}}else if(unlocked){try{await ac.resume();startClock();}catch{}}});
 return {unlock,sync,fx,get unlocked(){return unlocked;}};
})();

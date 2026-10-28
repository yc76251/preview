'use strict';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='pinkduck-evp-progress-v1';
const fresh=()=>({seen:[],review:[],practiced:[],last:'sample',mode:'session',solved:[],finalSolved:[],lastStop:'receive',examBest:null,dopsKnown:[],kitSolved:[],kitLast:'pick',aidSolved:[],aidLast:'unr'});
let state=fresh(),practice='sequence',reagentIndex=0,caseIndex=0,casePhase=0,oralIndex=0,quizIndex=0,oralMode='build';
const oralDrafts={},oralChoices={},caseDone=new Set();
function cleanProgress(v){
 if(!v||typeof v!=='object'||v.app&&v.app!=='pinkduck-evp')throw Error('不是本教材的進度檔');
 const keep=(a,ids)=>Array.isArray(a)?[...new Set(a.filter(x=>ids.includes(x)))]:[];
 return {seen:keep(v.seen,CARDS.map(c=>c.id)),review:keep(v.review,CARDS.map(c=>c.id)),practiced:keep(v.practiced,ACTIVITY_TABS.map(x=>x[0])),last:TOPICS.some(t=>t.id===v.last)?v.last:'sample',mode:v.mode==='local'?'local':'session',solved:keep(v.solved,STOPS.map(s=>s.id)),finalSolved:keep(v.finalSolved,FINAL_QUIZ.map(q=>q.id)),lastStop:STOPS.some(s=>s.id===v.lastStop)?v.lastStop:'receive',examBest:v.examBest&&Number.isFinite(v.examBest.score)?{score:Math.max(0,Math.min(100,Math.round(v.examBest.score))),right:Number(v.examBest.right)||0,total:Number(v.examBest.total)||0,at:String(v.examBest.at||'').slice(0,10)}:null,dopsKnown:keep(v.dopsKnown,((window.EVP_DOPS||{}).cards||[]).map(c=>c.id)),kitSolved:keep(v.kitSolved,KIT_STOPS.map(s=>s.id)),kitLast:KIT_STOPS.some(s=>s.id===v.kitLast)?v.kitLast:'pick',aidSolved:keep(v.aidSolved,AID_STOPS.map(s=>s.id)),aidLast:AID_STOPS.some(s=>s.id===v.aidLast)?v.aidLast:'unr'};
}
try{const mode=localStorage.getItem(KEY+'-mode')==='local'?'local':'session';const raw=(mode==='local'?localStorage:sessionStorage).getItem(KEY);if(raw)state=cleanProgress(JSON.parse(raw));state.mode=mode;}catch(e){console.warn('[EVP] 進度暫存受限',e.name);}
function earned(){return FINAL_QUIZ.every(q=>state.finalSolved.includes(q.id));}
function updateProgress(){const badge=$('#walkStamp');badge.textContent=earned()?'✓ 檢體章':'① 檢體章';badge.classList.toggle('earned',earned());badge.setAttribute('aria-label',`門一：${earned()?'已蓋章':`小練習 ${state.solved.length} / 8，終點 ${state.finalSolved.length} / 4`}，查看進度`);updateRoomStamps();}
function save(){try{(state.mode==='local'?localStorage:sessionStorage).setItem(KEY,JSON.stringify(state));}catch(e){toast('目前無法暫存進度，可以從上方檢體章匯出。');}updateProgress();}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
function go(route){if(location.hash==='#'+route){render();window.scrollTo({top:0});}else location.hash=route;}
function currentRoute(){return location.hash.slice(1).split('/')[0]||'home';}
function modal(html){$('#modalBody').innerHTML=html;$('#modal').showModal();}
function recordPractice(kind){if(!state.practiced.includes(kind)){state.practiced.push(kind);save();}}
function pageHead(kicker,title,desc=''){return `<header class="page-head"><span class="eyebrow">${kicker}</span><h1>${title}</h1>${desc?`<p>${desc}</p>`:''}</header>`;}
function portal(kind,title,sub,n,route){return `<button class="portal portal-${kind}" ${route?`data-enter="${route}"`:'disabled'} aria-label="${title}${route?'，進入世界':'，尚未開放'}"><span class="doorway"><span class="behind-door"></span><span class="door-leaf"><span class="door-number">0${n}</span>${sceneSVG(kind,title+'入口示意')}<span class="door-knob"></span></span></span><span class="portal-title">${title}</span><span class="portal-sub">${sub}</span><span class="portal-action">${route?'推門，出發 →':'尚未開放'}</span></button>`;}
function plank(n,title,sub,route,dir){return `<button class="plank plank-${dir} plank-${n}" ${route?`data-enter="${route}"`:'disabled'} aria-label="${title}${route?'，出發':'，整修中'}"><span class="board"><span class="plank-title">${title}</span><span class="plank-sub">${sub}</span></span>${route?'':'<span class="closed-tag">整修中</span>'}</button>`;}
function home(){return `<section class="trailhead"><div class="th-sky" aria-hidden="true"><span class="th-sun"></span><span class="cloud cloud-one"></span><span class="cloud cloud-two"></span><span class="cloud cloud-three"></span>${hillsSVG()}</div><header class="th-head"><div class="title-sign"><span class="rope rope-l" aria-hidden="true"></span><span class="rope rope-r" aria-hidden="true"></span><h1>BD MAX 探索小徑</h1><span class="sign-tag">EVP 腸胃道病毒</span></div><p class="th-sub">拿好地圖，繫好鞋帶，<br class="m-br">選一條適合你的步道出發吧！</p></header><div class="signpost-big"><span class="pole" aria-hidden="true"></span>${plank(1,'跟著檢體走','從收檢體，一路走到發報告','walk','right')}${plank(2,'開箱試劑盒','每支管子，各有什麼任務','kit','left')}${plank(3,'異常急救站','遇到怪結果，下一步走哪','aid','right')}<span class="adun-guide" tabindex="0" aria-label="阿盾：安全第一，今天由我帶路！"><img class="adun adun-home" src="assets/adun-wave.png" alt=""><span class="guide-bubble" aria-hidden="true">安全第一，今天由我帶路！</span></span></div><a class="library-box" href="#library"><span class="lib-roof" aria-hidden="true"></span><img src="assets/library-books.png" alt=""><b>小小圖書館</b><span>查數字、查細節 ↗</span></a></section>`;}
function mapPage(){return `<section class="mountain-world">${pageHead('門一 · 跟著檢體走','一份檢體的山路旅行','從第 1 站出發，也可以直接點想去的站。')}<div class="trail-intro"><span>小練習 ${state.solved.length} / 8</span><a href="#walk/${state.lastStop}">接著走：${STOPS.find(s=>s.id===state.lastStop).title} →</a></div><div class="trail-map"><div class="cloud cloud-one"></div><div class="cloud cloud-two"></div><div class="mountain ridge-one"></div><div class="mountain ridge-two"></div>${treesSVG()}<svg class="trail-line" viewBox="0 0 900 1100" preserveAspectRatio="none" aria-hidden="true"><path class="edge" d="M252 80C252 160 648 145 648 220S252 275 252 360 648 415 648 500 252 555 252 640 648 695 648 780 252 835 252 920 648 975 648 1060"/><path d="M252 80C252 160 648 145 648 220S252 275 252 360 648 415 648 500 252 555 252 640 648 695 648 780 252 835 252 920 648 975 648 1060"/><path class="dash" d="M252 80C252 160 648 145 648 220S252 275 252 360 648 415 648 500 252 555 252 640 648 695 648 780 252 835 252 920 648 975 648 1060"/></svg><ol class="trail-stops">${STOPS.map((s,i)=>`<li style="--x:${i%2?72:28}%;--y:${(80+i*140)/11}%"><a href="#walk/${s.id}" class="trail-stop ${state.solved.includes(s.id)?'solved':''}" ${state.lastStop===s.id?'aria-current="step"':''}><span class="cabin" aria-hidden="true"><span class="cabin-roof"></span><span class="cabin-body"><span class="cabin-door">${state.solved.includes(s.id)?'✓':i+1}</span></span></span><span class="signpost"><b>${i+1}. ${s.title}</b><small>${s.short}</small></span>${state.lastStop===s.id?'<img class="adun adun-here" src="assets/adun-walk.png" alt=""><span class="visually-hidden">你在這裡</span>':''}</a></li>`).join('')}</ol></div><div class="trail-finish"><span class="flag-pole" aria-hidden="true">⚑</span><h2>山路的最後，一個小關卡。</h2><p>4 題都答對，就把檢體章蓋進旅程裡。可以重試。</p><a class="button primary" href="#finish">${earned()?'看看我的章 →':'走進終點小關卡 →'}</a></div></section>`;}
function noteHTML(c){return `<article class="book-note" id="note-${c.id}"><h2>${c.title}</h2><p class="lead">${c.lead}</p><div class="lesson-body">${c.body}</div>${c.image?`<figure class="reference-image"><img src="${c.image}" loading="lazy" alt="${c.title}的補充圖解"><figcaption>補充圖解 · 點圖可放大</figcaption></figure>`:''}<button class="bookmark" data-review="${c.id}" aria-pressed="${state.review.includes(c.id)}">${state.review.includes(c.id)?'★ 已放書籤':'☆ 放一枚書籤'}</button></article>`;}
function miniQuiz(q,id,kind='station'){
 const done=(kind==='final'?state.finalSolved:ROOMS[kind]?state[ROOMS[kind].solved]:state.solved).includes(id);
 return `<section class="little-question" aria-label="${kind==='final'?'終點題目':'站內小練習'}">${done?'':'<img class="adun adun-think" src="assets/adun-think.png" alt=""><span class="adun-bubble" id="adunBubble" role="status" hidden></span>'}<span class="pencil-label">${done?'✓ 這題已完成':'想一想，再往前走'}</span><h2>${q.q}</h2><div class="answer-options">${(done?[...q.options.keys()]:shuffledOrder(q.options.length)).map((i,pos)=>`<button data-pick="${i}" data-kind="${kind}" data-qid="${id}" ${done?'disabled':''} class="${done&&i===q.answer?'correct':''}"><span>${String.fromCharCode(65+pos)}</span>${q.options[i]}</button>`).join('')}</div><div class="mini-feedback" id="miniFeedback" role="status">${done?`<b>答對了。</b> ${q.explain}`:''}</div></section>`;
}
function stationPage(id,activity){
 const s=STOPS.find(s=>s.id===id)||STOPS[0],i=STOPS.indexOf(s);state.lastStop=s.id;if(!state.seen.includes(s.card))state.seen.push(s.card);save();
 if(activity&&ACTIVITY_TABS.some(a=>a[0]===activity)){practice=activity;return `<section class="station-page">${stationNav(i)}${pageHead('第 '+(i+1)+' 站 · 再練一次',s.title)}<a class="back-link" href="#walk/${s.id}">← 回這一站</a><div id="exercise" class="exercise">${exerciseHTML()}</div></section>`;}
 return `<section class="station-page">${stationNav(i)}${pageHead(`第 ${i+1} 站`,s.title)}${miniQuiz(s,s.id)}<div class="reveal" ${state.solved.includes(s.id)?'':'hidden'}><img class="adun adun-cheer" src="assets/adun-cheer.png" alt=""><div class="why-note"><span>為什麼？</span><p>${s.why}</p><strong class="key-sticker">${s.key}</strong></div></div><figure class="station-figure ${s.photo?'has-photo':''}">${s.photo?`<img class="station-photo" src="${s.photo}" alt="${s.title}的實際照片" loading="lazy" tabindex="0" role="button" aria-label="${s.title}的實際照片，點一下放大">`:sceneSVG(s.art,s.key)}</figure>${stationPractice(s)}<details class="deep-dive"><summary>延伸閱讀</summary>${s.detail.map(id=>noteHTML(CARDS.find(c=>c.id===id))).join('')}</details><nav class="step-footer" aria-label="前後站">${i?`<a href="#walk/${STOPS[i-1].id}">← 上一站</a>`:'<a href="#walk">← 回山路</a>'}<a class="button primary" href="${i===7?'#finish':'#walk/'+STOPS[i+1].id}">${i===7?'走進終點小關卡':'下一站：'+STOPS[i+1].title} →</a></nav></section>`;
}
// 每一站的練習直接放在站內，不用再點進下一層。換站時才重設練習的狀態。
let practiceStop='';
const STATION_SCREENS={startup:[0],worklist:[1],results:[2,3]};
function stationPractice(s){
 if(practiceStop!==s.id){practiceStop=s.id;practice=s.more;screenScope=STATION_SCREENS[s.id]||[0,1,2,3];screenIndex=screenScope[0];screenStep=0;screenHint='';quizIndex=0;caseIndex=0;casePhase=0;}
 practice=s.more;
 const title=s.more==='missing'?'🧭 裝備自我檢查：找找漏掉什麼？':'✦ 多練一次：'+ACTIVITY_TABS.find(a=>a[0]===s.more)[1];
 return `<section class="station-practice"><h2 class="practice-title">${title}</h2><div id="exercise" class="exercise">${exerciseHTML()}</div></section>`;
}
function stationNav(i){return `<nav class="station-nav" aria-label="山路各站"><a class="back-link" href="#walk">↶ 回山路</a><div>${STOPS.map((s,n)=>`<a href="#walk/${s.id}" aria-label="第 ${n+1} 站：${s.title}" ${i===n?'aria-current="step"':''} class="${state.solved.includes(s.id)?'done':''}">${n+1}</a>`).join('')}</div></nav>`;}
function exits(){return `<div class="world-exits"><p>下一段旅程，等你回來。</p><div><a href="#kit">${sceneSVG('kit','試劑盒入口')}<b>開箱試劑盒</b><small>去儲藏室 →</small></a><a href="#aid">${sceneSVG('aid','急救箱入口')}<b>異常急救站</b><small>去急救站 →</small></a></div><a class="button primary" href="#home">回大門 →</a><a class="text-link" href="#walk">回山路再逛逛</a></div>`;}
function finishPage(){
 if(earned())return `<section class="finish-page">${pageHead('門一 · 旅程完成','你把這份檢體送到終點了。')}<div class="celebration"><div class="party"><span class="petals" aria-hidden="true">${Array.from({length:12},(_,i)=>`<i style="--x:${(i*37)%100}%;--d:${(i%6)*.7}s;--t:${5+(i%4)}s;--c:${['#f47aa0','#ffd166','#ff9fbf','#f9c74f'][i%4]}"></i>`).join('')}</span><img class="celebrate-duo" src="assets/celebrate-duo.png" alt="阿盾和小麥一起開心跳起來"></div><span class="confetti-dot"></span><div class="ink-stamp"><small>BD MAX · EVP</small><strong>檢體旅人</strong><span>跟著檢體走 · 完成</span><b>✓</b></div><p>收檢體、上機、看結果、發報告。<br>一步一步，你已經把它們串起來了。</p></div>${exits()}<button class="quiet-button" id="retryFinal">再挑戰一次</button></section>`;
 const q=FINAL_QUIZ.find(q=>!state.finalSolved.includes(q.id)),i=FINAL_QUIZ.indexOf(q);
 return `<section class="finish-page">${pageHead('門一 · 終點小關卡','最後四個小問題。','不計時、不扣分。答錯看看提示，再試一次。')}<div class="quiz-track" aria-label="已完成 ${state.finalSolved.length} 題">${FINAL_QUIZ.map((x,n)=>`<span class="${state.finalSolved.includes(x.id)?'done':''}">${state.finalSolved.includes(x.id)?'✓':n+1}</span>`).join('')}</div>${miniQuiz(q,q.id,'final')}<div id="finishNext"></div><a class="back-link" href="#walk">← 回山路找線索</a></section>`;
}
function libraryPage(id){
 const c=CARDS.find(c=>c.id===id);
 if(c)return `<section class="library-page">${pageHead('小小圖書館',c.title)}<a class="back-link" href="#library">← 回書架</a>${noteHTML(c)}</section>`;
 return `<section class="library-page">${pageHead('小小圖書館','需要時，來翻一頁。','查數字、找干擾物質，或把儀器細節再讀一遍。')}<div class="library-desk"><img class="adun adun-read" src="assets/adun-read.png" alt=""><p>主線裡的細節，留在每一站。<br>這裡放適合隨手查閱的資料。</p></div><div class="bookshelves">${LIBRARY.map(g=>`<section class="shelf"><h2>${g.title}</h2><p>${g.desc}</p><div>${g.ids.map((id,i)=>`<a class="book-spine" href="#library/${id}" style="--book:${g.color};--tilt:${i%2?2:-2}deg">${CARDS.find(c=>c.id===id).title}<span>翻開 ↗</span></a>`).join('')}</div></section>`).join('')}</div>${state.review.length?`<section class="saved-bookmarks"><h2>你留的書籤</h2>${state.review.map(id=>`<a href="#library/${id}">☆ ${CARDS.find(c=>c.id===id).title}</a>`).join('')}</section>`:''}<a class="back-link" href="#home">← 回大門</a></section>`;
}
function render(){
 let [route,id,extra]=location.hash.slice(1).split('/');route=route||'home';
 // Old bookmarks lead to their new location; they never recreate the old navigation.
 if(TOPICS.some(t=>t.id===route)){const target=STOPS.find(s=>s.card===id||(!id&&CARDS.find(c=>c.id===s.card).topic===route));go(target?'walk/'+target.id:'library'+(id?'/'+id:''));return;}
 if(route==='journey'){go('walk');return;}
 // 上課投影已拿掉（2026-10-26），舊連結帶到圖書館的同一張卡。
 if(route==='project'){go(extra?'library/'+extra:'library');return;}
 if(route==='practice'){const target=STOPS.find(s=>s.more===id)||STOPS[1];go('walk/'+target.id+'/'+(ACTIVITY_TABS.some(a=>a[0]===id)?id:target.more));return;}
 document.body.dataset.world=route==='walk'&&id?'cabin':['walk','finish'].includes(route)?'mountain':route==='library'?'library':route==='kit'?'storeroom':route==='aid'?'rescue':['exam','dops'].includes(route)||route.startsWith('paper-')?'camp':'home';
 let html=route==='walk'?(id?stationPage(id,extra):mapPage()):route==='finish'?finishPage():route==='library'?libraryPage(id):route==='kit'?kitPage(id):route==='aid'?aidPage(id):route==='exam'?examPage():route==='dops'?dopsPage():route.startsWith('paper-')?paperCheckPage(route.slice(6)):home();
 $('#main').innerHTML=html;$('#versionLabel').textContent='v'+APP_VERSION;document.title=(route==='walk'?'跟著檢體走':route==='kit'?'開箱試劑盒':route==='aid'?'異常急救站':route==='library'?'圖書館':route==='exam'?'綜合測驗':route==='dops'?'DOPS 口試卡':'BD MAX 探索小徑・EVP')+'｜PinkDuckLab';
 bindMain();updateProgress();
}
function bindMain(){
 $$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
 const guide=$('.adun-guide');if(guide){const talk=()=>{guide.classList.add('talk');clearTimeout(guide.t);guide.t=setTimeout(()=>guide.classList.remove('talk'),2600);};guide.onclick=talk;guide.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();talk();}};}
 $$('[data-enter]').forEach(b=>b.onclick=()=>{if(b.classList.contains('opening'))return;b.classList.add('opening');b.setAttribute('aria-busy','true');setTimeout(()=>go(b.dataset.enter),document.body.classList.contains('motion-off')?0:600);});
 $$('[data-pick]').forEach(b=>b.onclick=()=>{
  const final=b.dataset.kind==='final',room=ROOMS[b.dataset.kind],q=(final?FINAL_QUIZ:room?room.stops:STOPS).find(q=>q.id===b.dataset.qid),ok=Number(b.dataset.pick)===q.answer;
  $$('.answer-options button').forEach(x=>x.classList.remove('wrong'));b.classList.add(ok?'correct':'wrong');
  $('#miniFeedback').innerHTML=ok?`<b>✓ 答對了。</b> ${q.explain}`:`<b>再想一下。</b>`;
  const bubble=$('#adunBubble');if(bubble){if(ok){bubble.hidden=true;}else{bubble.textContent=q.hint;bubble.hidden=false;bubble.classList.remove('say');void bubble.offsetWidth;bubble.classList.add('say');}}
  if(ok){const list=final?state.finalSolved:room?state[room.solved]:state.solved;if(!list.includes(q.id))list.push(q.id);$$('.answer-options button').forEach(x=>x.disabled=true);save();if(!final&&$('.reveal')){$('.reveal').hidden=false;$('.reveal').classList.add('pop');}if(final){$('#finishNext').innerHTML=`<button class="primary" id="nextFinal">${earned()?'蓋上我的檢體章':'下一個問題'} →</button>`;$('#nextFinal').onclick=()=>{render();window.scrollTo({top:0,behavior:'smooth'});};}}
 });
 $$('[data-review]').forEach(b=>b.onclick=()=>{const id=b.dataset.review;state.review=state.review.includes(id)?state.review.filter(x=>x!==id):[...state.review,id];save();b.textContent=state.review.includes(id)?'★ 已放書籤':'☆ 放一枚書籤';b.setAttribute('aria-pressed',String(state.review.includes(id)));});
 $$('.station-photo').forEach(img=>{const show=()=>modal(`<img src="${img.getAttribute('src')}" alt="${esc(img.alt)}">`);img.onclick=show;img.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}};});
 $$('.reference-image img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',img.alt+'，放大');const show=()=>modal(`<img src="${img.getAttribute('src')}" alt="${esc(img.alt)}">`);img.onclick=show;img.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}};});
 if($('#retryFinal'))$('#retryFinal').onclick=()=>{state.finalSolved=[];save();render();};
 if($('#exercise'))bindExercises();
 bindRoom();
 bindExam();
}
function bindExercises(){
 bindActivities();
 $$('[data-answer]').forEach(b=>b.onclick=()=>answer(b.dataset.answer,Number(b.dataset.choice),b));
 if($('#checkMissing'))$('#checkMissing').onclick=()=>{const selected=$$('input[name="missing"]:checked').map(x=>Number(x.value));const matches=MISSING.filter((x,i)=>selected.includes(i)===x.bad).length;$('#answerFeedback').innerHTML=`<div class="feedback">${matches===MISSING.length?`<span class="cheer-box"><img class="adun adun-mini-cheer" src="assets/adun-cheer.png" alt=""><b>✓ 全部判斷正確，裝備檢查通過！</b></span>`:`<b>你判斷對了 ${matches} / ${MISSING.length} 個地方。</b>`}<ul>${MISSING.map(x=>`<li>${x.bad?'需要修正':'做法正確'}：${x.text}<br>${x.why}</li>`).join('')}</ul></div>`;recordPractice('missing');};
 if($('#resetExercise'))$('#resetExercise').onclick=()=>render();
 if($('#nextReagent'))$('#nextReagent').onclick=()=>{if(reagentIndex===REAGENTS.length-1){practiceDone(REAGENTS.length,()=>{reagentIndex=0;});return;}reagentIndex++;render();};
 $$('[data-case]').forEach(b=>b.onclick=()=>openCase(Number(b.dataset.case)));
 if($('#caseReveal'))$('#caseReveal').onclick=()=>{casePhase=1;render();};
 bindOral();
 if($('#nextQuiz'))$('#nextQuiz').onclick=()=>{if(quizIndex===QUIZZES.length-1){practiceDone(QUIZZES.length,()=>{quizIndex=0;});return;}quizIndex++;render();};
}
// 練習做到最後一題：不自動繞回第一題，問要回這一站還是再做一次。
function practiceDone(n,reset){
 const stop=location.hash.slice(1).split('/')[1]||STOPS[0].id;
 modal(`<div class="done-card"><img class="adun adun-celebrate" src="assets/adun-cheer.png" alt=""><h2>${n} 題都做完了！</h2><p>要回到這一站，還是再練一次？</p><div class="dialog-actions"><a class="button primary" href="#walk/${stop}" id="doneBack">← 回這一站</a><button id="doneAgain">↺ 再做一次</button></div></div>`);
 $('#doneBack').onclick=()=>{reset();$('#modal').close();};
 $('#doneAgain').onclick=()=>{reset();$('#modal').close();render();$('#exercise').scrollIntoView({block:'start'});};
}
function progressDialog(){
 modal(`<h2>我的旅行進度</h2><div class="passport"><strong>${earned()?'✓ 檢體章已蓋上':'檢體章，等你走到終點'}</strong><p>站內小練習 ${state.solved.length} / 8<br>終點小關卡 ${state.finalSolved.length} / 4</p><a class="button primary" href="#walk/${state.lastStop}" id="resumeWalk">接著走 →</a></div><p>${kitEarned()?'✓ 試劑章已蓋上':`試劑章：儲藏室小練習 ${state.kitSolved.length} / ${KIT_STOPS.length}`}　<a href="#kit" id="toKit">去儲藏室 →</a><br>${roomEarned('aid')?'✓ 解題章已蓋上':`解題章：急救站小練習 ${state.aidSolved.length} / ${AID_STOPS.length}`}　<a href="#aid" id="toAid">去急救站 →</a></p><h3>考前複習</h3><p>📝 綜合練習最高成績（含舊版）：${state.examBest?`${state.examBest.score} 分（${state.examBest.right} / ${state.examBest.total}${state.examBest.at?'，'+state.examBest.at:''}）`:"還沒考過"}<br>🎤 DOPS 口試卡：答對 ${(state.dopsKnown||[]).length} / ${((window.EVP_DOPS||{}).cards||[]).length} 張</p><h3>🔑 帶走進度</h3><p>換手機或電腦時，用一串進度碼或 QR 帶過去。</p><button class="primary" id="openKey">🔑 拿我的進度碼</button><h3>把進度留在哪裡？</h3><div class="storage-options"><button data-storage="session" aria-pressed="${state.mode==='session'}">本次瀏覽</button><button data-storage="local" aria-pressed="${state.mode==='local'}">我的裝置</button></div><p class="footer-note">本次瀏覽只暫存在這個分頁；我的裝置會保留在目前瀏覽器。換裝置可匯出後匯入。互教草稿不包含在進度檔。</p><div class="dialog-actions"><button id="exportProgress">匯出進度</button><label class="file-label">匯入進度<input id="importProgress" type="file" accept=".json,application/json" class="visually-hidden"></label></div><p id="importStatus" role="status"></p><button id="clearProgress" class="quiet-button">重設這個瀏覽器的學習進度</button>`);
 $('#resumeWalk').onclick=()=>$('#modal').close();$('#openKey').onclick=()=>keyDialog();$('#toKit').onclick=()=>$('#modal').close();$('#toAid').onclick=()=>$('#modal').close();
 $$('[data-storage]').forEach(b=>b.onclick=()=>setStorage(b.dataset.storage));
 $('#exportProgress').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({app:'pinkduck-evp',schema:1,version:APP_VERSION,...state},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='EVP_旅行進度.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 $('#importProgress').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>100000)throw Error('檔案太大');const v=JSON.parse(await f.text());if(v.app!=='pinkduck-evp'||v.schema!==1||!Array.isArray(v.seen)||!Array.isArray(v.review))throw Error('請選擇本教材的進度檔');state={...cleanProgress(v),mode:state.mode};save();render();$('#importStatus').textContent='✓ 進度已匯入。';}catch(e){$('#importStatus').textContent='無法匯入：'+e.message;}};
 $('#clearProgress').onclick=()=>{if(!confirm('重設這個瀏覽器的學習進度？匯出的檔案不受影響。'))return;state=fresh();try{localStorage.removeItem(KEY);localStorage.removeItem(KEY+'-mode');sessionStorage.removeItem(KEY);}catch{}render();$('#modal').close();toast('學習進度已重設。');};
}
// 進度存在哪裡：logo 下面的小開關，跟進度視窗裡的選項同步。
function syncStorageButtons(){$$('[data-storage],[data-save]').forEach(x=>x.setAttribute('aria-pressed',String((x.dataset.storage||x.dataset.save)===state.mode)));}
function setStorage(mode){state.mode=mode==='local'?'local':'session';try{localStorage.setItem(KEY+'-mode',state.mode);(state.mode==='session'?localStorage:sessionStorage).removeItem(KEY);}catch{}save();syncStorageButtons();toast(state.mode==='local'?'進度會存在這台裝置的瀏覽器裡':'進度只存在這個分頁，關掉就不見了');}
$$('[data-save]').forEach(b=>b.onclick=()=>setStorage(b.dataset.save));
$('#saveHelp').onclick=()=>modal(`<h2>進度存在哪裡？</h2><p>你在這裡答對的題目、蓋好的章、放的書籤、綜合測驗最好的成績，都算「學習進度」。這個開關決定它們存在哪裡。</p><h3>本次瀏覽</h3><p>只存在現在這個分頁。關掉分頁，進度就不見了。用別人的電腦或公用電腦時，選這個。</p><h3>我的裝置</h3><p>存在這台裝置的這個瀏覽器裡。下次用同一台、同一個瀏覽器打開，進度還在。</p><h3>換手機或換電腦</h3><p>按「🔑 帶走進度」，把進度碼拍照或抄下來，到另一台輸入，或用手機掃 QR。想留一份完整的檔案，可以在「① 檢體章」裡「匯出進度」。</p>`);
syncStorageButtons();
$('#walkStamp').onclick=progressDialog;
$('#kitStamp').onclick=()=>go('kit');
$('#aidStamp').onclick=()=>go('aid');
// 動態開關：預設開；不跟著系統的「減少動畫」自動關（小狐狸的電腦有開，但她要看到動畫）。
const MOTION_KEY='pinkduck-evp-motion';
function setMotion(on){document.body.classList.toggle('motion-off',!on);const b=$('#motionToggle');if(b){b.setAttribute('aria-pressed',String(on));b.textContent=on?'✨ 動態開關：開':'✨ 動態開關：關';}}
try{setMotion(localStorage.getItem(MOTION_KEY)!=='off');}catch{setMotion(true);}
$('#foxEditor').onclick=()=>modal(`<div class="done-card"><img src="assets/fox-editor.png" alt="抱著平板的粉紅小狐狸" style="width:110px"><h2>維護小幫手</h2><p>這裡可以改綜合測驗題庫和 DOPS 口試卡。</p><p class="footer-note">在小幫手裡修改，網站不會馬上變：要把產生的文字存成 <code>evp-bank.js</code>，再把整個網站資料夾重新上傳一次。</p><div class="dialog-actions"><a class="button primary" href="evp_editor.html" target="_blank" rel="noopener">打開維護小幫手 ↗</a></div></div>`);
$('#motionToggle').onclick=()=>{const on=document.body.classList.contains('motion-off');setMotion(on);try{localStorage.setItem(MOTION_KEY,on?'on':'off');}catch{}};
$('.skip').onclick=e=>{e.preventDefault();$('#main').focus();$('#main').scrollIntoView();};
$('#modal .close-modal').onclick=()=>$('#modal').close();
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#shareBtn').onclick=()=>{
 if(location.protocol==='file:'||['localhost','127.0.0.1','terminal.local'].includes(location.hostname)){modal('<h2>掃我帶走</h2><p>目前開啟的是本機試看版。上傳 Netlify 後，這裡會自動產生網站的 QR code。</p><p>學習進度可從上方「檢體章」匯出。</p>');return;}
 const url=location.origin+location.pathname;let svg='';try{const q=qrcode(0,'M');q.addData(url);q.make();svg=q.createSvgTag({cellSize:5,margin:4,scalable:true});}catch{}
 modal(`<h2>手機掃我帶走</h2>${svg?`<div class="qr-wrap">${svg}</div>`:'<p>可複製下方網址開啟網站。</p>'}<input class="url-input" readonly value="${esc(url)}" aria-label="網站網址"><button id="copyUrl">複製網址</button><p class="footer-note">QR 在瀏覽器內產生。進度請另行匯出。</p>`);$('#copyUrl').onclick=async()=>{try{await navigator.clipboard.writeText(url);toast('網址已複製');}catch{$('.url-input').select();toast('請按 Ctrl+C 或長按複製');}};
};
function enterRoute(){const parts=location.hash.slice(1).split('/');if(parts[0]==='walk'&&parts[2]==='screens'){screenIndex=({startup:0,worklist:1,results:2})[parts[1]]||0;screenStep=0;screenHint='';}if(parts[0]==='walk'&&parts[1]==='rack'&&parts[2]==='oral')oralIndex=1;}
window.addEventListener('hashchange',()=>{enterRoute();render();window.scrollTo({top:0});$('#main').focus({preventScroll:true});});
enterRoute();
render();

'use strict';
/* 綜合測驗（#exam）、考卷核對（#paper-…）、DOPS 口試卡（#dops）。題目在 evp-bank.js。 */
let exam=null;
let examScope='core',examNameDraft='';
const BANK=()=>(window.EVP_BANK&&EVP_BANK.quiz)||[];
const EXAM_SCOPES={core:{name:'核心觀念',icon:'🌱',desc:'認識檢驗用途、原理與結果判讀'},detail:{name:'細節記憶',icon:'🧩',desc:'複習時間、溫度、位置與操作規定'},mixed:{name:'綜合練習',icon:'📚',desc:'核心觀念與操作細節一起練'}};
function questionScope(q){return q.type==='細節記憶'?'detail':'core';}
function scopeInfo(scope){return EXAM_SCOPES[scope]||EXAM_SCOPES.mixed;}
function scopeIndices(scope){return BANK().map((_,i)=>i).filter(i=>scope==='mixed'||questionScope(BANK()[i])===scope);}
function questionType(q){return scopeInfo(questionScope(q)).name;}
function mixedBestText(){return state.examBest?`${state.examBest.score} 分（${state.examBest.right} / ${state.examBest.total}）`:'還沒考過';}
function shuffleList(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function isPick(q){return q.kind==='pick';}
function rightAnswer(q,choice){if(isPick(q)){const s=[...choice].sort((a,b)=>a-b),t=[...q.ans].sort((a,b)=>a-b);return s.length===t.length&&s.every((x,i)=>x===t[i]);}return choice===q.ans;}
function answerText(q){return isPick(q)?q.ans.map(i=>q.opts[i]).join('、'):q.opts[q.ans];}
function choiceText(q,c){return isPick(q)?(c.length?c.map(i=>q.opts[i]).join('、'):'（沒有勾選）'):q.opts[c];}

/* ---------- 出題 ---------- */
function startExam(mode,n,scope=examScope){
 const bank=BANK();scope=EXAM_SCOPES[scope]?scope:'core';const idx=scopeIndices(scope);let pick;
 if(!idx.length){toast('這個範圍目前沒有題目。');return;}
 n=Math.min(idx.length,Math.max(1,Math.floor(Number(n)||5)));
 if(mode==='practice')pick=shuffleList(idx);
 else if(scope!=='mixed')pick=shuffleList(idx).slice(0,n);
 else{const core=shuffleList(idx.filter(i=>questionScope(bank[i])==='core')),detail=shuffleList(idx.filter(i=>questionScope(bank[i])==='detail'));let a=core.slice(0,Math.ceil(n/2)),b=detail.slice(0,Math.floor(n/2));if(a.length+b.length<n){const used=new Set([...a,...b]);a=a.concat(shuffleList(idx.filter(i=>!used.has(i))).slice(0,n-a.length-b.length));}pick=shuffleList([...a,...b]);}
 const name=(($('#examName')||{}).value||examNameDraft).replace(/[.~<>"'&\\/#%]/g,'').slice(0,16).trim();
 examScope=scope;examNameDraft=name;
 exam={mode,scope,items:pick.map(i=>({i,order:shuffleList(bank[i].opts.map((_,k)=>k)),choice:null,ok:null})),pos:0,streak:0,name,at:Date.now()};
 go('exam');
}
function examStats(){const done=exam.items.filter(x=>x.ok!==null);return {right:done.filter(x=>x.ok).length,done:done.length};}
function examPage(){
 const bank=BANK(),info=scopeInfo(examScope),count=scopeIndices(examScope).length;
 if(!exam){
  const sizes=[5,10,15].filter(n=>n<=count);
  return `<section class="exam-page">${pageHead('⚔️ 試煉場','📝 綜合測驗','考前來這裡練一回合')}
  <div class="exam-start"><div class="bank-sticker"><b>${bank.length}</b><span>題題庫</span></div><p class="exam-purpose">先選今天想練的範圍。<br>從核心觀念開始，也可以加練操作細節。</p></div>
  <div class="exam-scopes" role="group" aria-label="出題範圍">${Object.entries(EXAM_SCOPES).map(([key,s])=>`<button data-exam-scope="${key}" aria-pressed="${examScope===key}"><strong>${s.icon} ${s.name}</strong><span>${scopeIndices(key).length} 題</span></button>`).join('')}</div>
  <p class="exam-scope-note" role="status">${info.desc}，共 ${count} 題。</p>
  <div class="ticket-row"><div class="ticket"><h2>📝 抽題考試</h2><p>${examScope==='mixed'?'兩類題目約各半；':'只從「'+info.name+'」抽題；'}題目和選項每次打亂，考完可看考卷。</p><label class="exam-name">名字或 ID（可以不填）<input id="examName" maxlength="16" autocomplete="off" placeholder="例如 小狐狸" value="${esc(examNameDraft)}"></label><div class="ticket-sizes">${sizes.map(n=>`<button class="primary" data-exam-start="exam" data-n="${n}">${n} 題</button>`).join('')}${count&&!sizes.length?`<button class="primary" data-exam-start="exam" data-n="${count}">全部 ${count} 題</button>`:''}</div></div>
  <div class="ticket ticket-all"><h2>📚 練習全部</h2><p>把「${info.name}」全部 ${count} 題打亂做一次，不出考卷。</p><button data-exam-start="practice" ${count?'':'disabled'}>練習全部 ${count} 題 →</button></div></div>
  <p class="exam-best">綜合練習最高成績：${mixedBestText()}</p><p class="exam-record-note">最高成績保留綜合範圍的抽題考試紀錄（含舊版）。單類考試可在本次結果與考卷查看。</p></section>`;
 }
 if(exam.pos>=exam.items.length)return examEnd();
 const it=exam.items[exam.pos],q=bank[it.i],st=examStats(),answered=it.ok!==null;
 const opts=isPick(q)?`<div class="pick-grid">${it.order.map(k=>`<label class="pick-item ${answered?(q.ans.includes(k)?'pick-right':(it.choice.includes(k)?'pick-wrong':'')):''}"><input type="checkbox" value="${k}" ${answered?'disabled':''} ${answered&&it.choice.includes(k)?'checked':''}><span>${q.opts[k]}</span></label>`).join('')}</div>${answered?'':'<button class="primary" id="pickCheck">勾好了，對答案</button>'}`
  :`<div class="answer-options exam-options">${it.order.map((k,pos)=>`<button data-exam-pick="${k}" ${answered?'disabled':''} class="${answered&&k===q.ans?'correct':answered&&k===it.choice?'wrong':''}"><span>${'ABCD'[pos]}</span>${q.opts[k]}</button>`).join('')}</div>`;
 return `<section class="exam-page"><div class="exam-bar"><span class="exam-chip">${scopeInfo(exam.scope).name} · ${exam.mode==='exam'?'📝 考試':'📚 練習全部'}</span><span>第 ${exam.pos+1} / ${exam.items.length} 題</span><span>答對 ${st.right}</span><span class="streak ${exam.streak>=5?'hot':''}">連對 ${exam.streak}${exam.streak>=5?' 🔥':''}</span><button class="quiet-button" id="examQuit">↩ 換範圍</button></div>
 <div class="little-question exam-q"><span class="q-type">${scopeInfo(questionScope(q)).icon} ${questionType(q)}</span><h2 tabindex="-1">${q.q}</h2>${opts}<div class="mini-feedback" id="examFeedback" role="status">${answered?feedbackHTML(q,it):''}</div>${answered?`<button class="primary" id="examNext">${exam.pos===exam.items.length-1?'看結果 →':'下一題 →'}</button>`:''}</div></section>`;
}
function feedbackHTML(q,it){return `<b>${it.ok?'✓ 答對了。':'這題答錯囉。'}</b> 💡 ${q.why}${q.go?` <a class="text-link" href="#${q.go}" target="_blank" rel="noopener">想複習 ↗</a>`:''}`;}
function answerExam(choice){
 const it=exam.items[exam.pos],q=BANK()[it.i];if(it.ok!==null)return;
 it.choice=choice;it.ok=rightAnswer(q,choice);exam.streak=it.ok?exam.streak+1:0;render();
 if(!it.ok){const pos=exam.pos;setTimeout(()=>{if(!exam||exam.pos!==pos||currentRoute()!=='exam')return;modal(`<div class="wrong-pop"><div class="bubble-ico">🫧</div><h2>這題答錯囉</h2><p class="pop-q">${q.q}</p><p class="pop-mine"><small>你選的</small>${choiceText(q,choice)}</p><p class="pop-right"><small>正確答案</small>${answerText(q)}</p><p>💡 ${q.why}</p>${q.go?`<a class="text-link" href="#${q.go}" target="_blank" rel="noopener">想複習 ↗</a>`:''}<button class="primary" id="popNext">${exam.pos===exam.items.length-1?'看結果 →':'下一題 →'}</button></div>`);$('#popNext').onclick=()=>{$('#modal').close();nextExam();};},350);}
}
function nextExam(){
 exam.pos++;if(exam.pos>=exam.items.length)finishExam();render();
 // 新題從題幹開始讀；不回到網站工具列，也不沿用上一題的捲動位置。
 const target=exam.pos<exam.items.length?$('.exam-q h2'):$('.exam-end h1');
 if(target){target.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'instant'});}
}
function finishExam(){
 const st=examStats(),total=exam.items.length,score=Math.round(st.right/total*100);exam.score=score;
 if(exam.mode==='exam'&&(exam.scope||'mixed')==='mixed'&&(!state.examBest||score>=state.examBest.score)){state.examBest={score,right:st.right,total,at:new Date().toISOString().slice(0,10)};save();}
 if(exam.mode==='exam'){const finished=exam;setTimeout(()=>{if(exam===finished&&currentRoute()==='exam')showPaper();},900);}
}
function examEnd(){
 const bank=BANK(),st=examStats(),total=exam.items.length,score=Math.round(st.right/total*100),stars=score>=90?'⭐⭐⭐':score>=70?'⭐⭐':score>=50?'⭐':'🌱',wrong=exam.items.filter(x=>!x.ok);
 return `<section class="exam-page"><div class="exam-end"><img class="adun adun-celebrate" src="assets/adun-cheer.png" alt=""><h1 tabindex="-1">${exam.mode==='exam'?'這一回合結束！':'全部練完了！'}</h1><p class="exam-result-scope">${scopeInfo(exam.scope).icon} ${scopeInfo(exam.scope).name}</p><p class="stars">${stars}</p><p class="score-line">答對 ${st.right} / ${total} 題　·　${score} 分</p>
 ${wrong.length?`<div class="wrong-list"><h2>再看一次答錯的</h2><ol>${wrong.map(x=>{const q=bank[x.i];return `<li><b>${q.q}</b><br>正確答案：${answerText(q)}${q.go?` <a class="text-link" href="#${q.go}" target="_blank" rel="noopener">想複習 ↗</a>`:''}</li>`;}).join('')}</ol></div>`:'<p>全部答對，太厲害了！</p>'}
 <div class="dialog-actions">${exam.mode==='exam'?'<button id="openPaper">📄 看考卷</button>':''}<button class="primary" id="examAgain">${exam.mode==='exam'?`再考一次（${total} 題）→`:'再練一次全部 →'}</button><button id="examQuit2">↩ 換範圍</button></div></div></section>`;
}

/* ---------- 考卷＋驗證碼 ---------- */
function fnv(s){let h=0x811c9dc5;for(const ch of s){h^=ch.codePointAt(0);h=Math.imul(h,0x01000193)>>>0;}return h.toString(36).toUpperCase().padStart(7,'0').slice(-7);}
function paperPayload(e){const bank=BANK();return ['1',EVP_BANK.version,Math.floor(e.at/60000).toString(36),encodeURIComponent(e.name||''),e.items.map(x=>{const q=bank[x.i];return x.i.toString(36).padStart(2,'0')+(isPick(q)?(x.ok?'y':'n'):String(x.choice));}).join(''),e.scope||'mixed'].join('.');}
function paperCode(p){return fnv(p+'.PinkDuckLab-evp-exam-v1');}
function decodePaper(p){const [fmt,ver,t36,name,items,scope]=p.split('.');if(fmt!=='1'||!items||items.length%3||(scope&&!EXAM_SCOPES[scope]))return null;const list=[];for(let k=0;k+3<=items.length;k+=3)list.push({i:parseInt(items.slice(k,k+2),36),c:items[k+2]});try{return {ver,at:parseInt(t36,36)*60000,name:decodeURIComponent(name||''),list,scope:scope||null};}catch{return null;}}
function paperHTML(d,withQR){
 const bank=BANK(),rows=d.list.map((x,n)=>{const q=bank[x.i];if(!q)return `<li>第 ${n+1} 題：題庫裡找不到這一題</li>`;const ok=isPick(q)?x.c==='y':Number(x.c)===q.ans;return `<li class="${ok?'ok':'ng'}"><span class="mark">${ok?'○':'✕'}</span><span class="pq">${n+1}. <small>${questionType(q)}</small> ${q.q}</span><span class="pa">${isPick(q)?(ok?'勾對了':'勾錯了'):`<s>${ok?'':q.opts[Number(x.c)]||''}</s>${ok?q.opts[q.ans]:''}`}</span>${ok?'':`<span class="pr">正確答案：${answerText(q)}</span>`}</li>`;}).join('');
 const right=d.list.filter(x=>{const q=bank[x.i];return q&&(isPick(q)?x.c==='y':Number(x.c)===q.ans);}).length,score=Math.round(right/d.list.length*100),when=new Date(d.at);
 return `<div class="paper"><div class="score-stamp"><b>${score}</b><small>${right} / ${d.list.length}</small></div><p class="paper-brand">PinkDuckLab・BD MAX 探索小徑</p><h2>綜合測驗考卷</h2><p class="paper-scope">出題範圍：${d.scope?scopeInfo(d.scope).name:'綜合練習（舊版考卷）'}</p><p class="paper-meta">姓名／ID：<u>${d.name?esc(d.name):'　　　　　　'}</u>　日期：${when.toLocaleString('zh-TW',{hour12:false})}　題數：${d.list.length}</p><ol class="paper-list">${rows}</ol><div class="paper-foot"><div><p>驗證碼 <b>${d.code.slice(0,4)}-${d.code.slice(4)}</b></p><p>題庫 ${d.ver}・網頁 v${APP_VERSION}</p></div>${withQR||''}</div></div>`;
}
function showPaper(){
 const p=paperPayload(exam),code=paperCode(p),url=location.origin+location.pathname+'#paper-'+p+'.'+code;let qr='';
 if(/^https?:/.test(location.protocol)&&!['localhost','127.0.0.1'].includes(location.hostname)){try{const g=qrcode(0,'M');g.addData(url);g.make();qr=`<div class="paper-qr">${g.createSvgTag({cellSize:3,margin:2,scalable:true})}</div>`;}catch{}}
 modal(paperHTML({...decodePaper(p),code},qr)+`<p class="footer-note">老師掃 QR 可以核對這份考卷有沒有被改過。${qr?'':'上傳網站後才會出現 QR。'}</p>`);
}
function paperCheckPage(raw){
 const cut=raw.lastIndexOf('.'),p=raw.slice(0,cut),code=raw.slice(cut+1),d=decodePaper(p);
 if(!d)return `<section class="exam-page">${pageHead('核對考卷','這個連結讀不出考卷內容')}<a class="button primary" href="#exam">去綜合測驗 →</a></section>`;
 const ok=paperCode(p)===code;
 return `<section class="exam-page">${pageHead('核對考卷',ok?'✅ 驗證碼正確':'⚠️ 驗證碼對不上：內容可能被改過')}${d.ver!==EVP_BANK.version?`<p class="note">這份考卷用的是題庫 ${d.ver}，現在是 ${EVP_BANK.version}，題目可能不一樣。</p>`:''}${paperHTML({...d,code})}<a class="back-link" href="#home">← 回登山口</a></section>`;
}

/* ---------- DOPS 口試卡 ---------- */
function dopsPage(){
 const D=window.EVP_DOPS;if(!D)return '';const known=state.dopsKnown||[];
 return `<section class="dops-page">${pageHead('⚔️ 試煉場','🎤 DOPS 口試卡',`答對 ${known.length} / ${D.cards.length} 張`)}<p class="dops-how">🎤 先口頭回答 → 💡 卡住了才看提示 → ✅ 最後看答案</p>
 <nav class="dops-secs">${D.sections.map(s=>{const n=D.cards.filter(c=>c.sec===s.n).length;return n?`<a href="#dops" data-dops-sec="${s.n}"><b>${s.n}</b>${s.name}<small>${n} 張</small></a>`:'';}).join('')}</nav>
 ${D.cards.map(c=>{const sec=D.sections.find(s=>s.n===c.sec),k=known.includes(c.id);return `<article class="dops-card ${k?'known':''}" id="dops-${c.id}" data-sec="${c.sec}"><header><span class="sec-no">${c.sec}</span><span class="sec-name">${sec?sec.name:''}</span><small>${c.item}</small></header><h2>${c.q}</h2>
 ${c.hint?`<details class="dops-hint"><summary>💡 卡住了？給提示</summary><p>${c.hint.ask}</p><div class="hint-opts">${c.hint.opts.map((o,i)=>`<button data-hint="${c.id}" data-i="${i}">${o}</button>`).join('')}</div></details>`:''}
 <details class="dops-ans"><summary>✅ 看答案</summary><p class="dops-a"><b>${c.a}</b></p>${c.table?`<div class="table-wrap"><table>${c.table.map((r,i)=>`<tr>${r.map(x=>i?`<td>${x}</td>`:`<th>${x}</th>`).join('')}</tr>`).join('')}</table></div>`:''}${c.list?`<ul>${c.list.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}${c.src?`<p class="src-tags">${c.src.map(([t,k])=>`<span class="src-tag src-${k}">${t}</span>`).join('')}</p>`:''}</details>
 <span class="dops-marks" role="group" aria-label="這張卡"><button class="dops-known" data-known="${c.id}" data-val="1" aria-pressed="${k}">✓ 答對</button><button class="dops-known dops-unsure" data-known="${c.id}" data-val="0" aria-pressed="${!k}">還不熟</button></span></article>`;}).join('')}</section>`;
}

/* ---------- 綁定 ---------- */
function bindExam(){
 $$('[data-exam-scope]').forEach(b=>b.onclick=()=>{examNameDraft=($('#examName')||{}).value||examNameDraft;examScope=b.dataset.examScope;render();});
 if($('#examName'))$('#examName').oninput=e=>{examNameDraft=e.target.value;};
 $$('[data-exam-start]').forEach(b=>b.onclick=()=>startExam(b.dataset.examStart,Number(b.dataset.n)||0));
 $$('[data-exam-pick]').forEach(b=>b.onclick=()=>answerExam(Number(b.dataset.examPick)));
 if($('#pickCheck'))$('#pickCheck').onclick=()=>{const c=$$('.pick-item input:checked').map(x=>Number(x.value));if(!c.length){$('#examFeedback').textContent='先勾選你的答案。';return;}answerExam(c);};
 if($('#examNext'))$('#examNext').onclick=nextExam;
 ['#examQuit','#examQuit2'].forEach(s=>{if($(s))$(s).onclick=()=>{exam=null;render();window.scrollTo({top:0});};});
 if($('#examAgain'))$('#examAgain').onclick=()=>{const m=exam.mode,n=exam.items.length,scope=exam.scope;examNameDraft=exam.name;exam=null;examScope=scope;render();startExam(m,n,scope);};
 if($('#openPaper'))$('#openPaper').onclick=showPaper;
 $$('[data-dops-sec]').forEach(a=>a.onclick=e=>{e.preventDefault();const el=$(`.dops-card[data-sec="${a.dataset.dopsSec}"]`);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}});
 $$('[data-hint]').forEach(b=>b.onclick=()=>{const c=EVP_DOPS.cards.find(x=>x.id===b.dataset.hint),ok=Number(b.dataset.i)===c.hint.right;b.classList.add(ok?'right':'chosen');if(ok)$$(`[data-hint="${c.id}"]`).forEach(x=>x.disabled=true);});
 $$('[data-known]').forEach(b=>b.onclick=()=>{const id=b.dataset.known;state.dopsKnown=state.dopsKnown||[];const want=b.dataset.val==='1';state.dopsKnown=state.dopsKnown.filter(x=>x!==id);if(want)state.dopsKnown.push(id);save();const k=want;b.parentNode.querySelectorAll('[data-known]').forEach(x=>x.setAttribute('aria-pressed',String((x.dataset.val==='1')===k)));b.closest('.dops-card').classList.toggle('known',k);const h=$('.dops-page .page-head p');if(h)h.textContent=`答對 ${state.dopsKnown.length} / ${EVP_DOPS.cards.length} 張`;});
}

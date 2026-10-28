'use strict';
const ACTIVITY_TABS=[['sequence','流程排排看'],['missing','找漏項'],['reagent','試劑辨識'],['expiry','期限實驗台'],['quality','品管分類'],['screens','畫面導航'],['care','維護辨別'],['case','結果判斷'],['closing','報告收尾'],['oral','換你來教'],['quiz','小情境']];
const TOPIC_ACTIVITIES={knowledge:['sequence'],sample:['sequence','missing'],run:['screens','missing','sequence'],qc:['quality'],reagent:['reagent','expiry'],instrument:['screens','care'],report:['case','closing']};
const topicViews={};
const SEQUENCES=[
 {title:'液態檢體製備',source:'',steps:['在 SBT 標示檢體資訊，露出條碼','液狀檢體高速振盪 15 秒','5 μL 接種環的環狀部分完全浸入，環柄不深入','伸入 SBT，以旋轉攪拌接種','丟棄透明蓋，換藍色隔膜蓋','接種後最高速振盪至少 10 秒']},
 {title:'儀器裡的核酸旅程',source:'',steps:['酵素與溫度處理，釋放核酸','磁珠捕捉核酸，清洗後溶析','中和後轉入預混管，水化 PCR 試劑','反應液進入 PCR 卡匣，微型閥密封','RNA 標的先反轉錄，再即時 PCR 擴增偵測']}
];
let sequenceIndex=0,sequenceOrder=[3,0,5,2,4,1],sequenceChecked=false;
const SORT_TASKS={
 quality:{title:'今天需要哪些品質確認？',groups:['陽／陰性品管＋平行測試','陽／陰性品管','依對照結果判定通過與否'],source:'',items:[['換成不同批號的 EVP 試劑',0,'品管與平行測試都要完成。'],['同批號，但這次是不同批次進貨',0,'同批號不同批次仍要兩種確認。'],['本月例行至少一次的品管測試',1,'每月至少一次陽性與陰性品管；本情境未加入更換批號／批次條件。'],['正在填寫品管紀錄表的測試結果',2,'陽性及陰性對照均符合預期才通過；任一不符即不通過。']]},
 care:{title:'這個維護做法適合嗎？',groups:['符合手冊原則','需要修正'],source:'',items:[['把清潔液直接噴向儀器表面',1,'不要直接噴灑或傾倒液體。'],['用漂白劑擦卡匣抽屜',1,'卡匣抽屜不可使用腐蝕性清潔劑，包含漂白劑。'],['一般工作面使用次氯酸鈉後，依手冊以二次水及 70% 酒精去除殘留，各換一塊紗布',0,'注意材質與手冊適用範圍。'],['按 Clear All 後，就認定異常已修復',1,'清除顯示不代表排除原因；持續性警示需修正問題。'],['依部位採不同清潔方式，並核對科室保養程序',0,'不同部位的材質不同，清潔方式要分開確認。']]}
};
const sortAnswers={quality:{},care:{}};let sortIndex={quality:0,care:0};
let expiryDays=7,expiryBox='valid';
const SCREEN_TASKS=[{title:'登錄試劑批號',path:['Run','Kit inventory','Enter Kit Barcode'],why:'掃描試劑盒一維條碼並確認資訊；使用中批號勾 Active。',source:''},{title:'建立 EVP 檢體清單',path:['Run','Work List','BD MAX ENT VIR 49'],why:'接著掃描／輸入 Sample tube barcode 與 Accession，確認清單內容。',source:''},{title:'查看執行結果',path:['Results','View'],why:'查看各標的結果，不能只看整批狀態。',source:''},{title:'匯出結果',path:['Results','Export'],why:'匯出 PDF 與 CSV；出現 OK 後再拔除隨身碟。',source:''}];
let screenIndex=0,screenStep=0,screenHint='',screenScope=[0,1,2,3];
let closingResult='positive',closingPicked=[];
const CLOSING_TASKS=['報告備註 BD MAX system','為品管需求留存陽性檢體','填寫品管檢體保存紀錄','透過 LIS 通報開單醫師與相關醫護人員'];
function activitySource(){return '';}
function activityHTML(){
 if(practice==='sequence'){const q=SEQUENCES[sequenceIndex];return `<h2>把步驟排回順序</h2><div class="oral-modes">${SEQUENCES.map((x,i)=>`<button data-sequence="${i}" aria-pressed="${sequenceIndex===i}">${x.title}</button>`).join('')}</div><p>拖拉卡片排順序（也可以按 ↑ ↓），排好後核對。</p><ol class="order-list">${sequenceOrder.map((id,i)=>`<li data-drag="${i}"><span class="order-number drag-handle" title="按住拖拉">⠿ ${i+1}</span><span>${q.steps[id]}</span><div><button data-move="${i}" data-delta="-1" aria-label="第 ${i+1} 步上移" ${i===0?'disabled':''}>↑</button><button data-move="${i}" data-delta="1" aria-label="第 ${i+1} 步下移" ${i===sequenceOrder.length-1?'disabled':''}>↓</button></div></li>`).join('')}</ol><button class="primary" id="checkOrder">核對順序</button><div id="activityFeedback" aria-live="polite">${sequenceChecked?`<div class="feedback">${sequenceOrder.every((x,i)=>x===i)?'<span class=\"cheer-box\"><img class=\"adun adun-mini-cheer\" src=\"assets/adun-cheer.png\" alt=\"\"><b>✓ 順序全對！</b></span>':'不對哦，再想想哪裡還要調整。'}<details><summary>看正確順序</summary><ol>${q.steps.map(x=>`<li>${x}</li>`).join('')}</ol>${activitySource(q.source)}</details></div>`:''}</div>${activitySource(q.source)}`;}
 if(SORT_TASKS[practice]){const q=SORT_TASKS[practice],i=sortIndex[practice],item=q.items[i],picked=sortAnswers[practice][i];return `<h2>${q.title}</h2><div class="scenario-pager">${q.items.map((x,n)=>`<button data-sort-page="${n}" aria-current="${n===i?'step':'false'}">${n+1}${sortAnswers[practice][n]!==undefined?' · 已作答':''}</button>`).join('')}</div><div class="scenario-card"><span>情境 ${i+1} / ${q.items.length}</span><h3>${item[0]}</h3></div><div class="sort-bins">${q.groups.map((x,n)=>`<button data-sort="${n}" class="${picked===n?'active':''}">${x}</button>`).join('')}</div>${picked!==undefined?`<div class="feedback ${picked===item[1]?'':'warm'}" role="status"><b>${picked===item[1]?'✓ 分類正確':'再看看這個重點'}</b><p>${item[2]}</p>${activitySource(q.source)}</div><button id="nextSort">${i<q.items.length-1?'下一個情境 →':'回到第一個情境 ↺'}</button>`:''}${activitySource(q.source)}`;}
 if(practice==='expiry')return `<h2>兩個期限，都要過關</h2><p>假設預混管初次開袋後立即重新密封、全程 2–25°C 保存。調整條件，看看哪道期限先擋下來。</p><label for="expiryDays">開袋後經過：<b id="daysValue">${expiryDays}</b> 天</label><input id="expiryDays" type="range" min="0" max="20" step="1" value="${expiryDays}"><fieldset class="expiry-box"><legend>原標示有效期限</legend><label><input type="radio" name="expiryBox" value="valid" ${expiryBox==='valid'?'checked':''}> 尚未過期</label><label><input type="radio" name="expiryBox" value="expired" ${expiryBox==='expired'?'checked':''}> 已過期</label></fieldset><div id="expiryOutcome" aria-live="polite">${expiryOutcome()}</div><p class="note">這是期限條件示範；不代替試劑外觀、保存紀錄及實際使用前確認。重新密封不會讓計時歸零。</p>${activitySource('')}`;
 if(practice==='screens'){const q=SCREEN_TASKS[screenIndex],options=screenStep===0?['Run','Results']:screenStep===1?(q.path[0]==='Run'?['Kit inventory','Work List']:['View','Export']):['Enter Kit Barcode','BD MAX ENT VIR 49'];return `<h2>找到正確畫面入口</h2><div class="oral-modes">${SCREEN_TASKS.map((x,i)=>screenScope.includes(i)?`<button data-screen-task="${i}" aria-pressed="${screenIndex===i}">${x.title}</button>`:'').join('')}</div><p>任務：${q.title}。點選路徑一步步前進。</p><div class="screen-mock"><div class="screen-breadcrumb">${q.path.slice(0,screenStep).join(' → ')||'請選擇入口'}</div>${screenStep<q.path.length?`<div class="screen-buttons">${options.map(x=>`<button data-screen-option="${x}">${x}</button>`).join('')}</div>`:`<div class="feedback cheer-box"><img class="adun adun-mini-cheer" src="assets/adun-cheer.png" alt=""><div><b>✓ 走到了！${q.path.join(" → ")}</b><p>${q.why}</p></div></div><div class="practice-buttons"><button id="resetScreen">↺ 重新走一次</button></div>`}<p role="status">${screenHint}</p></div>${activitySource(q.source)}<p class="footer-note">先認識入口，再練習下一步。</p>`;}
 if(practice==='closing')return `<h2>幫這份結果完成收尾</h2><p>假設結果及適用品管已確認，現在練習報告的備註、留存、紀錄與通報要求。</p><div class="oral-modes"><button data-closing="positive" aria-pressed="${closingResult==='positive'}">陽性情境</button><button data-closing="negative" aria-pressed="${closingResult==='negative'}">陰性情境</button></div><div class="mock-report"><span>模擬結果 · 無病人資料</span><strong>${closingResult==='positive'?'RoV：Positive':'五組標的：Negative'}</strong></div><p>選出本情境必須完成的項目：</p><div class="closing-grid">${CLOSING_TASKS.map((x,i)=>`<button data-closing-task="${i}" aria-pressed="${closingPicked.includes(i)}" class="${closingPicked.includes(i)?'active':''}">${closingPicked.includes(i)?'✓':'＋'} ${x}</button>`).join('')}</div><button class="primary" id="checkClosing">核對收尾清單</button><div id="activityFeedback" aria-live="polite"></div>${activitySource('、')}<p class="note">陰性情境不依這三條規定觸發「陽性」留存與通報要求；其他科室規範仍須遵循。此處不模擬完整 LIS 發送。</p>`;
 return null;
}
function expiryOutcome(){const opened=expiryDays<=14,box=expiryBox==='valid';return `<div class="expiry-gates"><div class="${opened?'pass':'fail'}">${opened?'✓':'×'} 開袋後 14 天內</div><div class="${box?'pass':'fail'}">${box?'✓':'×'} 原效期內</div></div><div class="feedback ${opened&&box?'':'warm'}">${opened&&box?'兩道期限條件均符合。仍需完成其他使用前確認。':'已有期限不符合，不能因另一個期限還沒到就繼續使用。'}</div>`;}
function bindActivities(){
 $$('[data-open-practice]').forEach(b=>b.onclick=()=>{practice=b.dataset.openPractice;go('practice/'+practice);});
 $$('[data-topic-view]').forEach(b=>b.onclick=()=>{topicViews[currentRoute()]=b.dataset.topicView;render();});
 $$('[data-sequence]').forEach(b=>b.onclick=()=>{sequenceIndex=Number(b.dataset.sequence);sequenceOrder=sequenceIndex===0?[3,0,5,2,4,1]:[2,4,0,3,1];sequenceChecked=false;render();});
 $$('[data-move]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.move),j=i+Number(b.dataset.delta);[sequenceOrder[i],sequenceOrder[j]]=[sequenceOrder[j],sequenceOrder[i]];sequenceChecked=false;render();});
 $$('.order-list li[data-drag]').forEach(li=>li.onpointerdown=startDrag);
 if($('#checkOrder'))$('#checkOrder').onclick=()=>{sequenceChecked=true;recordPractice('sequence');render();};
 $$('[data-sort-page]').forEach(b=>b.onclick=()=>{sortIndex[practice]=Number(b.dataset.sortPage);render();});
 $$('[data-sort]').forEach(b=>b.onclick=()=>{sortAnswers[practice][sortIndex[practice]]=Number(b.dataset.sort);recordPractice(practice);render();});
 if($('#nextSort'))$('#nextSort').onclick=()=>{sortIndex[practice]=(sortIndex[practice]+1)%SORT_TASKS[practice].items.length;render();};
 if($('#expiryDays'))$('#expiryDays').oninput=e=>{expiryDays=Number(e.target.value);$('#daysValue').textContent=expiryDays;$('#expiryOutcome').innerHTML=expiryOutcome();recordPractice('expiry');};
 $$('input[name="expiryBox"]').forEach(b=>b.onchange=()=>{expiryBox=b.value;$('#expiryOutcome').innerHTML=expiryOutcome();recordPractice('expiry');});
 $$('[data-screen-task]').forEach(b=>b.onclick=()=>{screenIndex=Number(b.dataset.screenTask);screenStep=0;screenHint='';render();});
 $$('[data-screen-option]').forEach(b=>b.onclick=()=>{if(b.dataset.screenOption===SCREEN_TASKS[screenIndex].path[screenStep]){screenStep++;screenHint='';if(screenStep===SCREEN_TASKS[screenIndex].path.length)recordPractice('screens');}else screenHint='這個入口不符合目前任務，再試一次。';render();});
 if($('#nextScreen'))$('#nextScreen').onclick=()=>{if(screenIndex===SCREEN_TASKS.length-1){practiceDone(SCREEN_TASKS.length,()=>{screenIndex=0;screenStep=0;screenHint='';});return;}screenIndex++;screenStep=0;screenHint='';render();};
 if($('#resetScreen'))$('#resetScreen').onclick=()=>{screenStep=0;screenHint='';render();};
 $$('[data-closing]').forEach(b=>b.onclick=()=>{closingResult=b.dataset.closing;closingPicked=[];render();});
 $$('[data-closing-task]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.closingTask);closingPicked=closingPicked.includes(i)?closingPicked.filter(x=>x!==i):[...closingPicked,i];render();});
 if($('#checkClosing'))$('#checkClosing').onclick=()=>{const required=closingResult==='positive'?[0,1,2,3]:[0],ok=required.every(i=>closingPicked.includes(i))&&closingPicked.every(i=>required.includes(i));$('#activityFeedback').innerHTML=`<div class="feedback ${ok?'':'warm'}"><b>${ok?'✓ 已抓到本情境的收尾要求。':'對照一下哪些要補上、哪些不是本情境的要求。'}</b><ul>${CLOSING_TASKS.map((x,i)=>`<li>${required.includes(i)?'本情境需做':'本情境未觸發陽性要求'}：${x}</li>`).join('')}</ul>${activitySource('、')}</div>`;recordPractice('closing');};
}

// 排排看：拖拉排序。滑鼠整張卡都可以拖；手機要按住左邊的 ⠿ 拖，才不會擋到捲動。
function startDrag(e){
 if(e.button>0||e.target.closest('button'))return;
 if(e.pointerType==='touch'&&!e.target.closest('.drag-handle'))return;
 const li=e.currentTarget,from=Number(li.dataset.drag),list=li.parentElement;let to=from;
 e.preventDefault();li.setPointerCapture(e.pointerId);li.classList.add('dragging');
 const y0=e.clientY;
 li.onpointermove=ev=>{li.style.transform=`translateY(${ev.clientY-y0}px)`;const others=[...list.children].filter(x=>x!==li);others.forEach(x=>x.classList.remove('drop-target'));
  let t=from;others.forEach(x=>{const r=x.getBoundingClientRect(),i=Number(x.dataset.drag);if(ev.clientY>r.top+r.height/2&&i>from)t=Math.max(t,i);if(ev.clientY<r.top+r.height/2&&i<from)t=Math.min(t,i);});
  to=t;const target=list.querySelector(`[data-drag="${to}"]`);if(to!==from&&target)target.classList.add('drop-target');};
 const end=()=>{li.onpointermove=null;li.onpointerup=null;li.onpointercancel=null;if(to!==from){const [x]=sequenceOrder.splice(from,1);sequenceOrder.splice(to,0,x);sequenceChecked=false;}render();};
 li.onpointerup=end;li.onpointercancel=end;
}

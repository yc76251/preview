'use strict';
// 門二「開箱試劑盒」：山屋儲藏室。五格，每格先答題、答對翻出為什麼，再做格子裡的小練習。
// 內容依 EVP 原廠仿單（試劑與材料、警告及注意事項、儲存和安定性、BD MAX 系統操作）。
const KIT_STOPS=[
 {id:'pick',title:'一份要帶哪些',short:'一支檢體，一整套',photo:'assets/kit-all.jpg',photoAlt:'EVP 試劑盒攤開：試劑條、三個試劑袋、三支小管',
  q:'每支檢體要上機，要從試劑盒拿哪一組？',
  options:['SBT、隔膜蓋、D4、D6、D5 各一，再加一條試劑條','SBT、D4、D6 各一和一條試劑條，D5 兩支檢體共用一支','SBT 和一條試劑條就好，小管已經裝在試劑條上','SBT、D4、D6、D5、試劑條，再加一個盒子裡附的 PCR 卡匣'],answer:0,
  hint:'每一支檢體都要自己的一套。PCR 卡匣，是放在這個盒子裡嗎？',
  explain:'每一支檢體，連外部品管也一樣，都要一支 SBT、一個隔膜蓋、D4、D6、D5 各一支，加一條試劑條。PCR 卡匣不在試劑盒裡，要另外準備。',
  why:'D4、D6、D5 和試劑條是一支檢體專用的一套，少一樣或共用，儀器就做不完這支檢體。',key:'一支檢體，一整套。',
  practice:{type:'judge',title:'🧺 幫一支檢體裝籃子',intro:'點每一樣東西：要放進籃子，還是留在原地？',yes:'放進籃子',no:'留在原地',
   items:[
    {t:'SBT（檢體緩衝管）一支',ok:true,why:'檢體就接種在這裡，一支檢體一支。'},
    {t:'藍色隔膜蓋一個',ok:true,why:'接種後換上它，原本的透明蓋不用。'},
    {t:'盒子裡附的接種環一支',ok:true,why:'要用盒子裡附的接種環；一般的接種環沒有跟這套試劑一起驗證過。'},
    {t:'白色 D4 萃取管一支',ok:true,why:'一支檢體一支。'},
    {t:'綠色 D6 預混管一支',ok:true,why:'一支檢體一支。'},
    {t:'藍色 D5 預混管一支',ok:true,why:'一支檢體一支，不跟別支共用。'},
    {t:'試劑條一條',ok:true,why:'萃取要用的液體和 Tips 都在上面。'},
    {t:'袋子裡的乾燥劑',ok:false,why:'乾燥劑要留在袋子裡，幫剩下的管子防潮。'},
    {t:'PCR 卡匣',ok:false,why:'上機要用，但它不在試劑盒裡，另外準備。'}
   ]},
  more:['外部品管（陽性、陰性）也當成一支檢體，一樣拿一整套。','接種後的 SBT，顏色應該是淡淡的茶色。','PCR 卡匣不在試劑盒裡；一個卡匣一排，最多放 12 支檢體。']},
 {id:'slots',title:'小管住哪裡',short:'白 1、綠 2、藍 4',photos:[{src:'assets/kit-slots.jpg',alt:'試劑條放在檢體架上，位置 1、2、4 插著小管，架上有對應的色帶'},{src:'assets/kit-strip.jpg',alt:'一盒試劑條，每條上面有一排小槽'}],
  q:'試劑條上的位置 1、2、4，各放哪一支小管？',
  options:['1 白色 D4、2 綠色 D6、4 藍色 D5','1 白色 D4、2 藍色 D5、4 綠色 D6','1 綠色 D6、2 白色 D4、4 藍色 D5','1 藍色 D5、2 綠色 D6、4 白色 D4'],answer:0,
  hint:'先萃取，再做 PCR。萃取管會排在最前面嗎？',
  explain:'位置 1 放白色封膜的萃取管 D4，位置 2 放綠色封膜的預混管 D6，位置 4 放藍色封膜的預混管 D5。壓下去，聽到「喀」一聲才算到位。',
  why:'儀器照位置去吸、去混，管子放錯格，就拿錯試劑。',key:'白 1、綠 2、藍 4，喀！',
  practice:{type:'sort',title:'🧩 把小管放進試劑條',strip:true,intro:'先點一支小管，再點它要去的位置（電腦也可以直接拖過去）。',hint:'看封膜的顏色：先萃取的白色排最前面，綠色緊跟在後，藍色隔一格。',
   bins:[{id:'p1',label:'位置 1'},{id:'p2',label:'位置 2'},{id:'p3',label:'位置 3',locked:'試劑條自己的'},{id:'p4',label:'位置 4'}],
   chips:[{id:'d4',t:'D4',color:'white',to:'p1',why:'白色封膜的萃取管，放位置 1。'},{id:'d6',t:'D6',color:'green',to:'p2',why:'綠色封膜的預混管，放位置 2。'},{id:'d5',t:'D5',color:'blue',to:'p4',why:'藍色封膜的預混管，放位置 4。'}]},
  more:['試劑條上架前，在硬的桌面輕敲一兩下，讓液體回到管底。','看一下試劑條，Tips 要都在。','試劑袋上方也有顏色：D6 的袋子是綠色、D5 是藍色，跟小管封膜一樣。']},
 {id:'inside',title:'誰裝了什麼',short:'綠三個、藍兩個',photo:'assets/kit-pouches.jpg',photoAlt:'D4、D6、D5 三個試劑袋，下面是白、綠、藍封膜的三支小管',
  q:'藍色的 D5 預混管，負責找哪兩個病毒？',
  options:['沙波病毒、人類星狀病毒','諾羅病毒、輪狀病毒','腺病毒、諾羅病毒','五個病毒全部都找'],answer:0,
  hint:'五個病毒分成兩管：綠色那管找三個，藍色那管找兩個。',
  explain:'綠色 D6 找諾羅、輪狀、腺病毒；藍色 D5 找沙波病毒和人類星狀病毒。兩管都有 SPC 的引子和探針，所以每一管都看得到自己的 SPC。',
  why:'結果是照兩支預混管分開報告的。知道哪個病毒在哪一管，看到 SPC 或結果有狀況時，才知道是哪一管出問題。',key:'綠三個、藍兩個。',
  practice:{type:'sort',title:'🗂 幫東西找到它的家',intro:'先點一個東西，再點它住的那一支管子或試劑條。',hint:'萃取要用的乾試劑在白色那支；液體和 Tips 在試劑條；五個病毒分兩管，綠色找三個、藍色找兩個。',
   bins:[{id:'d4',label:'D4 白色萃取管',en:'Extraction Tube',color:'white'},{id:'d6',label:'D6 綠色預混管',en:'Master Mix',color:'green'},{id:'d5',label:'D5 藍色預混管',en:'Master Mix',color:'blue'},{id:'urs',label:'試劑條',en:'Unitized Reagent Strip',color:'clear'}],
   chips:[
    {id:'bead',t:'磁珠',en:'Magnetic beads',to:'d4',why:'D4 裡的磁珠負責抓住核酸。'},
    {id:'pk',t:'蛋白酶 K',en:'Proteinase K',to:'d4',why:'D4 裡的蛋白酶 K 幫忙把病毒拆開，放出核酸。'},
    {id:'spc',t:'SPC 本身',en:'Sample Processing Control',to:'d4',why:'SPC 一開始就放在 D4，跟檢體一起走完萃取和 PCR。'},
    {id:'nov',t:'諾羅病毒',en:'Norovirus',to:'d6',why:'D6 找諾羅、輪狀、腺病毒。'},
    {id:'rov',t:'輪狀病毒',en:'Rotavirus',to:'d6',why:'D6 找諾羅、輪狀、腺病毒。'},
    {id:'adv',t:'腺病毒',en:'Adenovirus',to:'d6',why:'D6 找諾羅、輪狀、腺病毒。'},
    {id:'sav',t:'沙波病毒',en:'Sapovirus',to:'d5',why:'D5 找沙波病毒和人類星狀病毒。'},
    {id:'hastv',t:'人類星狀病毒',en:'human Astrovirus',to:'d5',why:'D5 找沙波病毒和人類星狀病毒。'},
    {id:'buf',t:'清洗、溶析、中和液',en:'Wash / Elution / Neutralization buffer',to:'urs',why:'萃取要用的液體，都在試劑條上。'},
    {id:'tip',t:'Tips',to:'urs',why:'Tips 也在試劑條上，上架前看看是不是都在。'}
   ]},
  more:['D4、D6、D5 裡面都是乾的試劑；D6、D5 要等萃取好的核酸流進來，才溶開開始反應。','D6 和 D5 各自帶 SPC 的引子和探針，所以報告上兩管各有一個 SPC。']},
 {id:'check',title:'這袋還能用嗎',short:'四道關，一道都不能漏',art:'pouch',
  q:'打開預混管的袋子，哪一種情況還可以用？',
  options:['乾燥劑完好，開袋第 10 天，外盒效期內','袋子裡的乾燥劑不見了','送來時，外盒的密封標籤就破了','開袋第 16 天，外盒效期還沒到'],answer:0,
  hint:'開袋重新封好之後，2–25°C 可以放幾天？乾燥劑可以不見嗎？',
  explain:'開袋重新密封後，2–25°C 可以放 14 天，而且外盒效期也要還沒到。乾燥劑不見或破掉、外盒封條或袋子送來就破了，都不能用。',
  why:'預混管是乾的試劑，最怕受潮；包裝、乾燥劑、天數、效期，任何一道沒過，都可能讓結果不準。',key:'四道關，一道不過就不用。',
  practice:{type:'judge',title:'🔍 開袋檢查員',intro:'每一袋都看一下：能用，還是不能用？',yes:'能用',no:'不能用',
   items:[
    {t:'乾燥劑在，開袋第 14 天，外盒效期內',ok:true,why:'剛好第 14 天，還在可以用的範圍內。'},
    {t:'開袋第 15 天，外盒效期還沒到',ok:false,why:'開袋重新密封後只能放 14 天；外盒效期還沒到也不行。'},
    {t:'還沒開過的袋子，但外盒效期過了',ok:false,why:'過期就不用，沒開過也一樣。'},
    {t:'袋子裡的乾燥劑破掉了',ok:false,why:'乾燥劑破掉或不見，就不能用。'},
    {t:'試劑送到時，袋子就已經破了',ok:false,why:'送來時包裝破損，不能用。'},
    {t:'這盒的 D6 用完了，拿另一個批號試劑盒的 D6 來湊',ok:false,why:'不同包、不同批號的試劑不要混在一起用。'}
   ]},
  more:['送來時外盒密封標籤破了、試劑袋已經打開或破了，都不能用。','不同包、不同批號的試劑，不要混在一起用。','開袋重新密封後 2–25°C 放 14 天；外盒效期也要還沒到，兩個都要符合。']},
 {id:'store',title:'用完怎麼收',short:'擠空氣、封夾鏈',art:'zip',
  q:'拿完今天要用的管子，剩下的袋子要怎麼收？',
  options:['擠出多餘空氣，夾鏈封好，乾燥劑留在袋裡','把乾燥劑拿出來，免得碰到管子','袋口折兩折就好，明天還要再開','整袋放進冷凍庫，可以放更久'],answer:0,
  hint:'袋子裡的乾式試劑最怕什麼？乾燥劑是來幫忙的，還是來搗亂的？',
  explain:'每次拿完就擠出多餘空氣、把夾鏈封好，乾燥劑不要拿出來。試劑在效期內放 2–25°C，遠離熱源和潮溼的地方。',
  why:'受潮久了會影響試劑的表現。乾燥劑是袋子裡的小除濕機，夾鏈封緊才擋得住水氣。',key:'擠空氣、封夾鏈、乾燥劑留著。',
  practice:{type:'judge',title:'🌡 幫試劑袋找個家',intro:'封好的試劑袋，可以放在這裡嗎？',yes:'可以放',no:'不行',
   items:[
    {t:'2–8°C 的冷藏冰箱',ok:true,why:'在 2–25°C 之內。'},
    {t:'22°C 的試劑櫃',ok:true,why:'在 2–25°C 之內。'},
    {t:'−20°C 的冷凍櫃',ok:false,why:'低於 2°C，不在 2–25°C 的範圍。'},
    {t:'儀器出風口旁邊，摸起來暖暖的',ok:false,why:'要遠離熱源。'},
    {t:'水槽旁邊、常有水氣的檯面',ok:false,why:'要遠離潮溼，受潮會影響試劑。'}
   ]},
  more:['試劑在效期內，放 2–25°C 都穩定。','每次拿完立刻封好：先擠出空氣，再壓緊夾鏈。','乾燥劑一直留在袋子裡，不要拿出來。']}
];
// 架上的小東西（網頁自己畫的示意圖）
function kitIcon(kind){
 const tube=(x,y,c,t)=>`<g transform="translate(${x} ${y})"><rect x="-11" y="0" width="22" height="40" rx="4" fill="#fbfbf7" stroke="#6d6a62" stroke-width="2"/><path d="M-11 34h22v2a11 11 0 0 1-22 0Z" fill="#e9e3d2"/><circle cx="0" cy="-2" r="13" fill="${c}" stroke="#6d6a62" stroke-width="2"/><text x="0" y="3" text-anchor="middle" font-size="11" font-weight="800" fill="#3a3a33">${t}</text></g>`;
 const W='#f7f5ef',G='#cfe7a6',B='#b9d3f0';
 if(kind==='pick')return `<svg viewBox="0 0 140 100" aria-hidden="true"><path d="M24 30q46-34 92 0" fill="none" stroke="#7a4f22" stroke-width="5"/>${tube(44,20,W,'D4')}${tube(70,14,G,'D6')}${tube(96,20,B,'D5')}<path d="M20 48h100l-10 44H30Z" fill="#d9a35f" stroke="#7a4f22" stroke-width="3"/><path d="M26 60h88M28 72h84M30 84h80" stroke="#a8743a" stroke-width="3"/></svg>`;
 if(kind==='slots')return `<svg viewBox="0 0 140 100" aria-hidden="true"><rect x="10" y="40" width="120" height="34" rx="8" fill="#eef4f6" stroke="#6f8790" stroke-width="3"/>${[0,1,2,3].map(i=>`<circle cx="${28+i*28}" cy="57" r="11" fill="${['#fff',G,'#e1e7e9',B][i]}" stroke="#6f8790" stroke-width="2"/><text x="${28+i*28}" y="88" text-anchor="middle" font-size="12" font-weight="800" fill="#4a5b60">${i+1}</text>`).join('')}<path d="M52 22l-6 10M88 22l6 10" stroke="#e2558a" stroke-width="3" stroke-linecap="round"/><text x="70" y="22" text-anchor="middle" font-size="13" font-weight="800" fill="#e2558a">喀！</text></svg>`;
 if(kind==='inside')return `<svg viewBox="0 0 140 100" aria-hidden="true">${tube(35,40,W,'D4')}${tube(70,40,G,'D6')}${tube(105,40,B,'D5')}<circle cx="120" cy="16" r="11" fill="#fff8" stroke="#7a4f22" stroke-width="4"/><path d="M128 24l9 9" stroke="#7a4f22" stroke-width="6" stroke-linecap="round"/></svg>`;
 if(kind==='check'||kind==='pouch')return `<svg viewBox="0 0 140 100" aria-hidden="true"><path d="M30 18h80l-4 74H34Z" fill="#f1f1ec" stroke="#8a8a80" stroke-width="3"/><rect x="30" y="18" width="80" height="9" fill="${G}"/><path d="M34 34h72" stroke="#8a8a80" stroke-width="2" stroke-dasharray="4 3"/><rect x="48" y="48" width="44" height="26" rx="4" fill="#fff" stroke="#c43c3c" stroke-width="2"/><text x="70" y="65" text-anchor="middle" font-size="10" font-weight="800" fill="#c43c3c">EXP</text><circle cx="110" cy="76" r="16" fill="#2f7a55"/><path d="M102 76l6 6 11-12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 if(kind==='store'||kind==='zip')return `<svg viewBox="0 0 140 100" aria-hidden="true"><path d="M26 30h72v62H26Z" fill="#f1f1ec" stroke="#8a8a80" stroke-width="3"/><path d="M26 30h72" stroke="#5f7f9e" stroke-width="6"/><rect x="40" y="58" width="22" height="16" rx="3" fill="#fff" stroke="#8a8a80" stroke-width="2"/><text x="51" y="70" text-anchor="middle" font-size="8" fill="#6d6a62">乾燥</text><path d="M62 18q-14-8-26 0" fill="none" stroke="#e2558a" stroke-width="3" stroke-dasharray="4 4"/><rect x="110" y="16" width="12" height="62" rx="6" fill="#fff" stroke="#6d6a62" stroke-width="2"/><rect x="112" y="40" width="8" height="26" rx="3" fill="#7ec48a"/><circle cx="116" cy="82" r="9" fill="#e2558a" stroke="#6d6a62" stroke-width="2"/><text x="100" y="46" text-anchor="end" font-size="9" font-weight="800" fill="#2f7a55">2–25°C</text></svg>`;
 return '';
}


// ── 共用的「房間」引擎：門二儲藏室、門三急救站都用它。每個房間：一格一題，答對翻出為什麼，再做小練習。
const ROOMS={kit:{stops:KIT_STOPS,solved:'kitSolved',last:'kitLast',unit:'格',home:'#kit',back:'↶ 回儲藏室',backShort:'← 回儲藏室',finish:'回儲藏室看看試劑章',icon:k=>kitIcon(k),stamp:{id:'kitStamp',on:'✓ 試劑章',off:'② 試劑章',door:'門二',go:'前往儲藏室'}}};
function roomEarned(k){const r=ROOMS[k];return r.stops.every(s=>(state[r.solved]||[]).includes(s.id));}
function kitEarned(){return roomEarned('kit');}
function updateRoomStamps(){for(const k of Object.keys(ROOMS)){const r=ROOMS[k],b=document.querySelector('#'+r.stamp.id);if(!b)continue;const n=(state[r.solved]||[]).length,ok=roomEarned(k);b.textContent=ok?r.stamp.on:r.stamp.off;b.classList.toggle('earned',ok);b.setAttribute('aria-label',`${r.stamp.door}：${ok?'已蓋章':`小練習 ${n} / ${r.stops.length}`}，${r.stamp.go}`);}}
function kitPage(id){const s=KIT_STOPS.find(x=>x.id===id);return s?roomStation('kit',s):kitRoom();}
function kitRoom(){
 const solved=state.kitSolved||[],last=KIT_STOPS.find(s=>s.id===state.kitLast)||KIT_STOPS[0];
 const crate=(s,i)=>`<a class="crate ${solved.includes(s.id)?'solved':''}" href="#kit/${s.id}" style="--tilt:${[-2,1.5,-1,2,-1.5][i]}deg">${kitIcon(s.id)}<span class="crate-tag"><b><i>${i+1}</i>${s.title}</b><small>${s.short}</small>${solved.includes(s.id)?'<em class="tag-stamp" aria-label="已完成">✓</em>':''}</span></a>`;
 return `<section class="storeroom">${pageHead('門二 · 開箱試劑盒','山屋儲藏室','點一格，把東西拿下來看看。')}
 <div class="store-wall"><div class="store-window" aria-hidden="true"><span class="snow"></span><span class="snow s2"></span><span class="mullion"></span></div><div class="store-thermo" aria-label="試劑保存溫度 2 到 25°C"><span class="th-band"></span><span class="th-bulb"></span><b>2–25°C</b></div><span class="store-lantern" aria-hidden="true"><i></i></span>
 <div class="store-shelf shelf-top">${KIT_STOPS.slice(0,3).map((s,i)=>crate(s,i)).join('')}</div>
 <div class="store-shelf shelf-low">${KIT_STOPS.slice(3).map((s,i)=>crate(s,i+3)).join('')}<span class="shelf-adun"><img class="adun" src="assets/adun-think.png" alt=""></span></div></div>
 <div class="store-foot">${kitEarned()?`<div class="kit-stamp ink-stamp"><small>BD MAX · EVP</small><strong>試劑管家</strong><span>開箱試劑盒 · 完成</span><b>✓</b></div><p>五格都答對了，試劑章蓋好囉！</p><div class="store-exits"><a class="button primary" href="#home">回大門 →</a><a class="text-link" href="#aid">去「異常急救站」</a></div>`:`<span>小練習 ${solved.length} / ${KIT_STOPS.length}</span><a class="button primary" href="#kit/${last.id}">${solved.length?'接著看：':'從第 1 格開始：'}${last.title} →</a>`}</div></section>`;
}
function roomNav(k,i){const r=ROOMS[k];return `<nav class="station-nav kit-nav" aria-label="各${r.unit}"><a class="back-link" href="${r.home}">${r.back}</a><div>${r.stops.map((s,n)=>`<a href="${r.home}/${s.id}" aria-label="第 ${n+1} ${r.unit}：${s.title}" ${i===n?'aria-current="step"':''} class="${(state[r.solved]||[]).includes(s.id)?'done':''}">${n+1}</a>`).join('')}</div></nav>`;}
// 換格才重設練習。
let roomPracticeKey='',roomStop=null,roomAnswers={},roomPlaced={},roomHeld='';
function roomStation(k,s){
 const r=ROOMS[k],i=r.stops.indexOf(s);state[r.last]=s.id;save();
 if(roomPracticeKey!==k+'/'+s.id){roomPracticeKey=k+'/'+s.id;roomAnswers={};roomPlaced={};roomHeld='';}
 roomStop=s;
 const solved=(state[r.solved]||[]).includes(s.id),last=i===r.stops.length-1;
 return `<section class="station-page kit-station room-${k}">${roomNav(k,i)}${pageHead(`第 ${i+1} ${r.unit}`,s.title)}${miniQuiz(s,s.id,k)}<div class="reveal" ${solved?'':'hidden'}><img class="adun adun-cheer" src="assets/adun-cheer.png" alt=""><div class="why-note"><span>為什麼？</span><p>${s.why}</p><strong class="key-sticker">${s.key}</strong></div></div><figure class="station-figure ${s.photo?'has-photo':''} ${s.photos?'photo-pair':''}">${s.photos?s.photos.map(p=>`<img class="station-photo" src="${p.src}" alt="${p.alt}" loading="lazy" tabindex="0" role="button" aria-label="${p.alt}，點一下放大">`).join('')+'<figcaption>點圖可放大</figcaption>':s.photo?`<img class="station-photo" src="${s.photo}" alt="${s.photoAlt}" loading="lazy" tabindex="0" role="button" aria-label="${s.photoAlt}，點一下放大">`:`<div class="kit-art">${r.icon(s.art||s.id)}</div>`}</figure><section class="station-practice"><h2 class="practice-title">${s.practice.title}</h2><div id="kitPractice" class="exercise">${roomPracticeHTML(s)}</div></section><details class="deep-dive"><summary>延伸閱讀</summary><ul class="kit-more">${s.more.map(x=>`<li>${x}</li>`).join('')}</ul></details><nav class="step-footer" aria-label="前後${r.unit}">${i?`<a href="${r.home}/${r.stops[i-1].id}">← 上一${r.unit}</a>`:`<a href="${r.home}">${r.backShort}</a>`}<a class="button primary" href="${last?r.home:r.home+'/'+r.stops[i+1].id}">${last?r.finish:'下一'+r.unit+'：'+r.stops[i+1].title} →</a></nav></section>`;
}
function roomPracticeHTML(s){
 const p=s.practice;
 if(p.type==='judge'){
  const done=p.items.every((x,n)=>roomAnswers[n]===x.ok);
  return `<p class="intro">${p.intro}</p><ul class="judge-list">${p.items.map((x,n)=>{const a=roomAnswers[n],has=a!==undefined,right=has&&a===x.ok;return `<li class="judge-item ${has?(right?'right':'miss'):''}"><span class="judge-text">${x.t}</span><span class="judge-btns"><button data-judge="${n}" data-val="1" aria-pressed="${a===true}">${p.yes}</button><button data-judge="${n}" data-val="0" aria-pressed="${a===false}">${p.no}</button></span>${has?`<small class="judge-why">${right?'✓ ':'不對哦，'}${x.why}</small>`:''}</li>`;}).join('')}</ul>${done?`<div class="feedback cheer-box"><img class="adun adun-mini-cheer" src="assets/adun-cheer.png" alt=""><b>✓ 全部判斷正確！</b></div><button class="quiet-button" id="kitRedo">↺ 再做一次</button>`:''}`;
 }
 const checked=roomPlaced['?'],placedAll=p.chips.every(c=>roomPlaced[c.id]),allRight=placedAll&&p.chips.every(c=>roomPlaced[c.id]===c.to);
 const chip=c=>`<button class="kit-chip ${c.color?'tube-'+c.color:''} ${roomHeld===c.id?'held':''} ${roomPlaced[c.id]&&roomPlaced[c.id+'!']?(roomPlaced[c.id]===c.to?'right':'miss'):''}" data-chip="${c.id}" draggable="true" aria-pressed="${roomHeld===c.id}">${c.en?`<span class="chip-txt">${c.t}<small>${c.en}</small></span>`:c.t}</button>`;
 return `<p class="intro">${p.intro}</p><div class="chip-tray" data-bin="" aria-label="還沒放的">${p.chips.filter(c=>!roomPlaced[c.id]).map(chip).join('')||'<span class="tray-empty">都放好了</span>'}</div><div class="kit-bins ${p.strip?'strip-bins':''} ${p.bins.length===3?'bins-3':''}">${p.bins.map(b=>`<div class="kit-bin ${b.color?'bin-'+b.color:''} ${b.locked?'locked':''}" ${b.locked?'':`data-bin="${b.id}" role="button" tabindex="0"`} aria-label="${b.label}${b.locked?'，'+b.locked:''}"><b>${b.label}${b.en?`<small class="bin-en">${b.en}</small>`:''}</b>${b.locked?`<small>${b.locked}</small>`:''}<div class="bin-items">${p.chips.filter(c=>roomPlaced[c.id]===b.id).map(chip).join('')}</div></div>`).join('')}</div><div class="kit-actions"><button class="primary" id="kitCheck" ${placedAll?'':'disabled'}>檢查看看</button><button class="quiet-button" id="kitRedo">↺ 重來</button></div><div id="kitFeedback" role="status">${checked?(allRight?`<div class="feedback cheer-box"><img class="adun adun-mini-cheer" src="assets/adun-cheer.png" alt=""><b>✓ 全部放對了！</b></div><ul class="kit-more">${p.chips.map(c=>`<li>${c.why}</li>`).join('')}</ul>`:`<div class="feedback warm"><b>有 ${p.chips.filter(c=>roomPlaced[c.id]!==c.to).length} 個放錯了，紅色那幾個再想想。</b><p>${p.hint}</p><small>點紅色的拿起來，再放到別的地方。</small></div>${p.showKey?`<div class="answer-key"><h3>每一個的答案</h3><ul>${p.chips.map(c=>`<li>${c.t} → <b>${p.bins.find(b=>b.id===c.to).label}</b>：${c.why}</li>`).join('')}</ul></div>`:''}`):''}</div>`;
}
function roomRerender(){if(!roomStop||!$('#kitPractice'))return;$('#kitPractice').innerHTML=roomPracticeHTML(roomStop);bindRoom();}
function bindRoom(){
 if(!$('#kitPractice')||!roomStop)return;
 const s=roomStop;
 $$('[data-judge]').forEach(b=>b.onclick=()=>{roomAnswers[Number(b.dataset.judge)]=b.dataset.val==='1';roomRerender();});
 const place=bin=>{if(!roomHeld)return;if(bin)roomPlaced[roomHeld]=bin;else delete roomPlaced[roomHeld];delete roomPlaced[roomHeld+'!'];delete roomPlaced['?'];roomHeld='';roomRerender();};
 $$('[data-chip]').forEach(c=>{
  c.onclick=e=>{e.stopPropagation();roomHeld=roomHeld===c.dataset.chip?'':c.dataset.chip;roomRerender();};
  c.ondragstart=e=>{roomHeld=c.dataset.chip;try{e.dataTransfer.setData('text/plain',c.dataset.chip);}catch{}};
 });
 $$('#kitPractice [data-bin]').forEach(b=>{
  b.onclick=()=>place(b.dataset.bin);
  b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();place(b.dataset.bin);}};
  b.ondragover=e=>{e.preventDefault();b.classList.add('over');};
  b.ondragleave=()=>b.classList.remove('over');
  b.ondrop=e=>{e.preventDefault();place(b.dataset.bin);};
 });
 if($('#kitCheck'))$('#kitCheck').onclick=()=>{roomPlaced['?']=true;s.practice.chips.forEach(c=>roomPlaced[c.id+'!']=true);roomRerender();};
 if($('#kitRedo'))$('#kitRedo').onclick=()=>{roomAnswers={};roomPlaced={};roomHeld='';roomRerender();};
}

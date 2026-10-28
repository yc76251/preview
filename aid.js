'use strict';
// 門三「異常急救站」：山上的急救站。五張求救單，每張先答題、答對翻出為什麼，再做小練習。
// 內容依 EVP 原廠仿單（結果判讀、重複測試、干擾物質）與檢驗規範的結果分析表。
const AID_STOPS=[
 {id:'unr',title:'UNR 不是陰性',short:'標的沒有，SPC 也沒有',code:'NoV UNR',
  q:'報告出現「NoV UNR」，是什麼意思？',
  options:['諾羅沒偵測到，SPC 也沒偵測到，不能當陰性','諾羅沒偵測到，可以直接報陰性','諾羅有偵測到，只是量太少','儀器故障，要先叫廠商來修'],answer:0,
  hint:'UNR 的全名是 Unresolved（未解決）。沒看到病毒的時候，還要看誰有沒有出現？',
  explain:'UNR 代表標的沒偵測到，SPC 也沒偵測到。可能是檢體裡有抑制物，或試劑失效，所以不能當陰性，要重測。',
  why:'SPC 沒出來，就不知道這次萃取和 PCR 有沒有成功；沒看到病毒，不等於真的沒有。',key:'SPC 不見了，陰性就不算數。',
  practice:{type:'sort',title:'🩺 幫訊號分診',intro:'看標的和 SPC 有沒有訊號，把每一種情況放進它會得到的結果。',hint:'先看標的：有訊號就是 POS。標的沒訊號時，再看 SPC 有沒有出來。',
   bins:[{id:'pos',label:'POS 陽性',color:'pink'},{id:'neg',label:'NEG 陰性',color:'green'},{id:'unr',label:'UNR 未解決',color:'orange'}],
   chips:[
    {id:'a',t:'標的 ✓　SPC ✓',to:'pos',why:'標的有訊號，就是 POS。'},
    {id:'b',t:'標的 ✓　SPC ✗',to:'pos',why:'只要標的有訊號就報 POS，SPC 沒出來不影響陽性。'},
    {id:'c',t:'標的 ✗　SPC ✓',to:'neg',why:'SPC 有出來，代表流程成功，標的沒訊號才能報 NEG。'},
    {id:'d',t:'標的 ✗　SPC ✗',to:'unr',why:'兩個都沒出來，分不出是真的沒有還是流程失敗，所以是 UNR。'}
   ]},
  more:['UNR 可能的原因：檢體裡有抑制物，或試劑失效。','UNR 的檢體只要再重做一次；還是 UNR，就要再送另一份新的檢體。','五個標的分在兩支預混管，各自看自己那一管的 SPC。']},
 {id:'partial',title:'一個陽性，其他 UNR',short:'陽性照報，UNR 不當陰性',code:'POS ＋ UNR',
  q:'同一份檢體：NoV POS，其他四個標的都是 UNR，怎麼看？',
  options:['NoV 照報陽性，其他四個不能當陰性','其他四個當陰性，五個一起報','有 UNR，就整份都不能報','其他四個也當成陽性'],answer:0,
  hint:'陽性是「看到了」。UNR 的那幾個，是「沒有」還是「沒看清楚」？',
  explain:'這叫「部分 UNR」：POS 的標的照報陽性；UNR 的那幾個不能當陰性，要照重測的方式再做一次。',
  why:'陽性是真的看到病毒了；UNR 的標的是「沒看清楚」，不是「沒有」。',key:'看到的照報，沒看清楚的再看一次。',
  practice:{type:'judge',title:'🗒 這樣處理對嗎？',intro:'同一份檢體 NoV POS、其他四個 UNR。下面每一種做法，對還是不對？',yes:'對',no:'不對',
   items:[
    {t:'NoV 照報陽性',ok:true,why:'標的有訊號就是 POS，照報。'},
    {t:'其他四個 UNR，報告寫陰性',ok:false,why:'UNR 不視為陰性。'},
    {t:'UNR 的標的，在時限內用原 SBT 重測',ok:true,why:'在保存時限內，可以用原 SBT 或原檢體重測。'},
    {t:'已經有一個陽性了，其他的不用管',ok:false,why:'其他標的還沒有答案，要重測才知道。'}
   ]},
  more:['「部分 UNR」：至少一個標的 POS，其他標的都是 UNR。','重測方法跟一般 UNR 一樣：在時限內用原 SBT 或原檢體，高速振盪 1 分鐘後上機。']},
 {id:'ind',title:'IND、INC：機器在喊救命',short:'先看錯誤代碼',code:'IND / INC',
  q:'結果是 IND 或 INC 時，畫面通常還會出現什麼？',
  options:['警語或錯誤代碼','特別強的 SPC 訊號','五個標的都陽性','什麼都沒有，跟陰性一樣'],answer:0,
  hint:'IND、INC 跟 UNR 不一樣，問題通常出在儀器系統。系統出事時，會留下什麼線索？',
  explain:'IND（Indeterminate，不確定）和 INC（Incomplete，未完成）通常是系統出了狀況，會同時出現警語或錯誤代碼。先看代碼、查儀器手冊的疑難排解，再用原 SBT 或原檢體重測。',
  why:'UNR 多半跟檢體或試劑有關；IND、INC 多半是機器那一邊出了狀況。先看懂代碼，才知道重測前要先處理什麼。',key:'IND、INC：先看代碼，再重測。',
  practice:{type:'sort',title:'🚑 是哪一種呼救？',showKey:true,intro:'把每一種狀況，放進它會得到的結果。',hint:'UNR 是「做完了，但看不清楚」；IND 是「系統判斷不了」；INC 是「沒做完」。',
   bins:[{id:'unr',label:'UNR 未解決',color:'orange'},{id:'ind',label:'IND 不確定',color:'blue'},{id:'inc',label:'INC 未完成',color:'clear'}],
   chips:[
    {id:'a',t:'標的和 SPC 都沒訊號',to:'unr',why:'標的和 SPC 都沒出來，是 UNR。'},
    {id:'b',t:'檢體裡有抑制物',to:'unr',why:'抑制物是 UNR 常見的原因。'},
    {id:'c',t:'試劑失效',to:'unr',why:'試劑失效也會讓 SPC 出不來，變成 UNR。'},
    {id:'d',t:'系統故障，判讀不出結果',to:'ind',why:'系統判斷不了，是 IND。'},
    {id:'e',t:'檢測沒有跑完',to:'inc',why:'沒跑完，是 INC。'}
   ]},
  more:['IND、INC 也用原 SBT 或原檢體重測，時限和振盪方式跟 UNR 一樣。','錯誤代碼的意思，查儀器手冊的「疑難排解」。']},
 {id:'retest',title:'重測一次就好',short:'振盪 1 分鐘，看時限',code:'↻ 重測',
  q:'UNR 要用原 SBT 重測，上機前要先做什麼？',
  options:['高速振盪 1 分鐘，再照上機流程','最高速振盪 10 秒就好','直接放回架上，不用振盪','再加一環檢體進去'],answer:0,
  hint:'這一路上有三個振盪時間：取樣前 15 秒、接種後至少 10 秒，那重測前呢？',
  explain:'重測前，把原 SBT（或原檢體）高速振盪 1 分鐘，再照上機流程做。時限是 2–8°C 5 天內、2–25°C 48 小時內。',
  why:'重測也要照規定的時限和振盪來做，結果才可靠；UNR 只重做一次，還是 UNR，就要換一份新的檢體。',key:'振盪 1 分鐘，只重來一次。',
  practice:{type:'judge',title:'⏱ 可以這樣重測嗎？',intro:'每一種做法，可以還是不行？',yes:'可以',no:'不行',
   items:[
    {t:'原 SBT 放 2–8°C 第 4 天，拿來重測',ok:true,why:'2–8°C 可以放 5 天。'},
    {t:'原 SBT 放室溫第 3 天，拿來重測',ok:false,why:'2–25°C 只能放 48 小時。'},
    {t:'重測前，高速振盪 1 分鐘',ok:true,why:'重測前要高速振盪 1 分鐘。'},
    {t:'重測前，振盪 10 秒就好',ok:false,why:'10 秒是接種後的振盪；重測前要高速振盪 1 分鐘。'},
    {t:'重測還是 UNR，再重做第三次',ok:false,why:'UNR 只重做一次；還是 UNR，要再送另一份檢體。'},
    {t:'用剩下的原檢體，在時限內接一支新的 SBT 重測',ok:true,why:'剩下的原檢體在時限內，也可以用新的 SBT 重測。'}
   ]},
  more:['一支 SBT 裡的量，夠做一次重測。','原 SBT 的時限從第一次接種算起：2–8°C 5 天內、2–25°C 48 小時內。']},
 {id:'odd',title:'結果對不上時',short:'疫苗、藥膏、取樣',code:'RoV POS？',
  q:'寶寶 5 天前剛口服輪狀病毒疫苗，今天 RoV POS，可能是什麼？',
  options:['疫苗病毒還留在糞便裡，被測到了','疫苗病毒測不到，一定是自然感染','一定是機器錯了，要重測','疫苗會讓五個標的都變陽性'],answer:0,
  hint:'口服疫苗裡的病毒，吃下去之後會從哪裡出來？',
  explain:'輪狀病毒疫苗（RotaTeq）接種後 9 天內，疫苗病毒可能還在糞便裡，會測出輪狀病毒陽性。',
  why:'檢驗看到的是病毒的核酸，分不出是來自疫苗還是感染，所以要配合病人的狀況一起看。',key:'疫苗病毒，也會被看到。',
  practice:{type:'judge',title:'🔎 這會讓結果出錯嗎？',intro:'下面這些情況，可能讓結果出錯嗎？',yes:'可能會',no:'不會',
   items:[
    {t:'檢體裡混了很多 Hydrocortisone 乳膏',ok:true,why:'高濃度的 Hydrocortisone 乳膏會干擾。'},
    {t:'取樣時，環柄也沾了一大坨糞便',ok:true,why:'糞便太多，可能干擾反應。'},
    {t:'檢體忘了加進 SBT',ok:true,why:'沒加檢體，可能變成偽陰性。'},
    {t:'病人有吃止瀉藥',ok:false,why:'測過的止瀉藥，沒有可報告的干擾。'},
    {t:'檢體裡有一點血',ok:false,why:'人類全血測過，沒有可報告的干擾。'},
    {t:'檢體裡有大腸桿菌',ok:false,why:'大腸桿菌測過，沒有可報告的干擾。'}
   ]},
  more:['原廠測過 32 種可能出現在糞便裡的物質，只有高濃度的 Hydrocortisone 乳膏會干擾。','檢體採集、處理或保存不當、檢體搞混、病毒量太低，也可能讓結果不正確。','完整的干擾物質表，在小小圖書館的「查干擾物質」。']}
];

// 求救單上的小圖（網頁自己畫的示意圖）
function aidIcon(kind){
 const tag={POS:['#ffd6e5','#a8325f'],NEG:['#d9f2df','#2f6b46'],UNR:['#ffe3c4','#9a5512'],'—':['#eceae4','#6d6a62']};
 const card=rows=>`<svg viewBox="0 0 140 100" aria-hidden="true"><rect x="16" y="6" width="108" height="88" rx="8" fill="#fff" stroke="#6f8790" stroke-width="2.5"/><rect x="16" y="6" width="108" height="15" rx="8" fill="#6f8790"/><text x="70" y="17" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">Results</text>${rows.map(([n,v],i)=>{const h=rows.length>3?13:20,y=28+i*(h+1),c=tag[v];return `<text x="26" y="${y+h*.72}" font-size="${h>15?11:9}" font-weight="700" fill="#33403c">${n}</text><rect x="78" y="${y}" width="38" height="${h-2}" rx="${(h-2)/2}" fill="${c[0]}"/><text x="97" y="${y+h*.68}" text-anchor="middle" font-size="${h>15?10:8.5}" font-weight="800" fill="${c[1]}">${v}</text>`;}).join('')}</svg>`;
 if(kind==='unr')return card([['NoV','UNR'],['SPC','—']]);
 if(kind==='partial')return card([['NoV','POS'],['RoV','UNR'],['AdV','UNR'],['SaV','UNR'],['hAstV','UNR']]);
 if(kind==='ind')return `<svg viewBox="0 0 140 100" aria-hidden="true"><rect x="14" y="8" width="112" height="72" rx="8" fill="#2f3e46" stroke="#6f8790" stroke-width="3"/><path d="M70 20l22 38H48Z" fill="#ffd166" stroke="#9a5512" stroke-width="2.5" stroke-linejoin="round"/><text x="70" y="53" text-anchor="middle" font-size="20" font-weight="900" fill="#9a5512">!</text><text x="70" y="73" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">IND / INC + 錯誤代碼</text><rect x="54" y="80" width="32" height="8" fill="#6f8790"/><rect x="40" y="88" width="60" height="6" rx="3" fill="#6f8790"/></svg>`;
 if(kind==='retest')return `<svg viewBox="0 0 140 100" aria-hidden="true"><g transform="translate(48 18)"><rect x="-12" y="8" width="24" height="56" rx="6" fill="#fbfbf7" stroke="#6d6a62" stroke-width="2.5"/><path d="M-12 40h24v18a6 6 0 0 1-6 6h-12a6 6 0 0 1-6-6Z" fill="#d9b27a"/><rect x="-14" y="0" width="28" height="12" rx="4" fill="#5f8fd4" stroke="#3d5f93" stroke-width="2"/></g><path d="M22 52q-8-22 12-34M74 30q10 20-6 36" fill="none" stroke="#e2558a" stroke-width="3.5" stroke-linecap="round"/><path d="M30 14l4 4-5 3M70 68l-3-5 6-1" fill="none" stroke="#e2558a" stroke-width="3" stroke-linecap="round"/><circle cx="104" cy="44" r="24" fill="#fff" stroke="#6d6a62" stroke-width="3"/><path d="M104 44V28M104 44l10 6" stroke="#2f3e46" stroke-width="3.5" stroke-linecap="round"/><text x="104" y="86" text-anchor="middle" font-size="12" font-weight="800" fill="#a8325f">1 分鐘</text></svg>`;
 if(kind==='odd')return `<svg viewBox="0 0 140 100" aria-hidden="true"><g transform="rotate(-20 46 50)"><rect x="34" y="20" width="22" height="50" rx="6" fill="#e9f4ff" stroke="#5f7f9e" stroke-width="2.5"/><rect x="38" y="40" width="14" height="26" rx="3" fill="#b9d3f0"/><path d="M40 20v-8h10v8" fill="#f08a4b" stroke="#a85a2a" stroke-width="2"/><path d="M45 70v14" stroke="#5f7f9e" stroke-width="3"/><circle cx="45" cy="88" r="3" fill="#b9d3f0"/></g><rect x="74" y="34" width="54" height="24" rx="12" fill="#ffd6e5"/><text x="101" y="51" text-anchor="middle" font-size="12" font-weight="800" fill="#a8325f">RoV POS</text><text x="101" y="80" text-anchor="middle" font-size="22" font-weight="900" fill="#9a5512">?</text></svg>`;
 return '';
}

ROOMS.aid={stops:AID_STOPS,solved:'aidSolved',last:'aidLast',unit:'張',home:'#aid',back:'↶ 回急救站',backShort:'← 回急救站',finish:'回急救站看看解題章',icon:aidIcon,stamp:{id:'aidStamp',on:'✓ 解題章',off:'③ 解題章',door:'門三',go:'前往急救站'}};
function aidPage(id){const s=AID_STOPS.find(x=>x.id===id);return s?roomStation('aid',s):aidRoom();}
function aidRoom(){
 const solved=state.aidSolved||[],last=AID_STOPS.find(s=>s.id===state.aidLast)||AID_STOPS[0],done=roomEarned('aid');
 const slip=(s,i)=>`<a class="sos-slip ${solved.includes(s.id)?'solved':''}" href="#aid/${s.id}" style="--tilt:${[-3,2,-1.5,2.5,-2][i]}deg"><span class="pin" aria-hidden="true"></span><span class="sos-no">${i+1}</span><span class="sos-code">${s.code}</span><b>${s.title}</b><small>${s.short}</small>${solved.includes(s.id)?'<em class="sos-ok">處理好了 ✓</em>':''}</a>`;
 return `<section class="rescue">${pageHead('門三 · 異常急救站','山上的急救站','結果怪怪的？挑一張求救單，一起想下一步。')}
 <div class="rescue-scene"><span class="beacon" aria-hidden="true"><i class="beam"></i><i class="dome"></i></span><div class="rescue-window" aria-hidden="true"><span class="rain"></span><span class="mullion"></span></div>
 <div class="corkboard"><span class="board-title">求救單</span><div class="slips">${AID_STOPS.map(slip).join('')}<div class="medkit-corner"><img class="adun" src="assets/adun-think.png" alt=""><span class="medkit" aria-hidden="true"><i></i></span></div></div></div></div>
 <div class="store-foot rescue-foot">${done?`<div class="ink-stamp aid-stamp"><small>BD MAX · EVP</small><strong>解題隊長</strong><span>異常急救站 · 完成</span><b>✓</b></div><p>五張求救單都處理好了，解題章蓋好囉！</p><div class="store-exits"><a class="button primary" href="#home">回大門 →</a><a class="text-link" href="#walk">去走「跟著檢體走」</a><a class="text-link" href="#kit">去「開箱試劑盒」</a></div>`:`<span>小練習 ${solved.length} / ${AID_STOPS.length}</span><a class="button primary" href="#aid/${last.id}">${solved.length?'接著看：':'從第 1 張開始：'}${last.title} →</a>`}</div></section>`;
}

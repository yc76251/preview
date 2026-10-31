/* =====================================================================
   🧫 細胞品管任務（闖關）資料＋程式  v1_20261031（v29.1 修改第1、3關與無效結局）  —— 阿澈
   ---------------------------------------------------------------------
   【只想改題目？只要改下面兩段資料就好】
   1. STAGES：每一關。opts 裡 ok:true 的是正確答案；
      每個選項都有 why（學生按了之後看到的說明）。
      出錯誤選項的原則：一次只錯一個地方，而且是學生真的會搞混的。
   2. RESULTS：最後一關的判讀情境，每次隨機抽一個。
      answer 只能是 "positive"、"negative"、"invalid"。
   3. ENDINGS：三種結局的文字。
   ===================================================================== */

var MYCO_FLOW = {

STAGES: [
  {q:"細胞株解凍、繼代後，交給病毒培養工作站使用前，要做什麼品管？",
   opts:[
    {t:"用 PCR 檢測有沒有黴漿菌", ok:true, why:"黴漿菌污染通常看不出來，要用 PCR 驗出它的 DNA。"},
    {t:"看培養液有沒有變混濁", why:"黴漿菌污染時，培養液通常還是清澈的，用看的抓不到。"},
    {t:"一般光學顯微鏡下找黴漿菌", why:"黴漿菌非常小，一般光學顯微鏡下看不到。"},
    {t:"革蘭氏染色找黴漿菌", why:"黴漿菌沒有細胞壁，革蘭氏染色染不出來。"}
  ]},
  {q:"細胞繼代、換液後，什麼時候採檢體最適合？",
   opts:[
    {t:"培養 3–6 天，細胞長到約 80–90% 滿", ok:true, why:"黴漿菌跟著細胞一起增殖，培養 3–6 天菌量才累積到測得到的量。"},
    {t:"剛換完液馬上採", why:"迷思：剛換液最乾淨？剛好相反，這時菌量被新培養液稀釋得最低，容易偽陰性。"},
    {t:"換液後隔天就採", why:"才 1 天，菌量還沒累積起來，容易測不到（偽陰性）。"}
  ]},
  {q:"要怎麼準備檢體？",
   opts:[
    {t:"把細胞刮下來，混進培養液做成細胞懸浮液", ok:true, why:"黴漿菌跟著細胞增殖，也會釋放到培養液，把細胞刮進培養液一起取，才不會漏掉。"},
    {t:"先用 PBS 把細胞洗乾淨，再刮下來", why:"一洗就把培養液裡的黴漿菌洗掉了，菌量少時可能偽陰性。"},
    {t:"離心後只取細胞沉澱", why:"細胞沉澱不能直接拿來測，細胞碎片會干擾 PCR。"}
  ]},
  {q:"取多少細胞懸浮液到滅菌離心管？",
   opts:[
    {t:"100 µL", ok:true, why:"取 100 µL 細胞懸浮液到滅菌離心管，並蓋緊。"},
    {t:"2 µL", why:"2 µL 是最後加進 PCR 反應液的檢體量，不是前處理取的量。"},
    {t:"23 µL", why:"23 µL 是每管分裝的 PCR 反應液量。"},
    {t:"1000 µL", why:"量太多了，SOP 是取 100 µL。"}
  ]},
  {q:"蓋緊後怎麼加熱？",
   opts:[
    {t:"95°C，5 分鐘", ok:true, why:"95°C 加熱 5 分鐘，讓黴漿菌破裂、釋出 DNA。"},
    {t:"95°C，3 分鐘", why:"95°C 3 分鐘是 PCR 程式一開始的步驟，別跟檢體前處理搞混囉。"},
    {t:"55°C，5 分鐘", why:"55°C 是 PCR 循環裡讓引子和探針黏上去（讀螢光）的溫度。"},
    {t:"60°C，5 分鐘", why:"60°C 是 PCR 循環裡的延伸溫度，不是前處理。"}
  ]},
  {q:"加熱後要怎麼處理？",
   opts:[
    {t:"高速離心 30 秒（例如 10,000 × g），取上清液", ok:true, why:"離心讓細胞碎片沉下去，DNA 留在上清液，只取上清液做 PCR。"},
    {t:"高速離心 30 秒，取沉澱", why:"DNA 溶在液體裡，沉下去的是會抑制聚合酶的細胞碎片。"},
    {t:"不用離心，搖勻直接取", why:"細胞碎片會一起被吸進去，干擾 PCR。"}
  ]},
  {q:"每管已分裝 23 µL PCR 反應液，檢體管要加入多少處理好的上清液？",
   opts:[
    {t:"2 µL", ok:true, why:"23 µL 反應液＋2 µL 檢體。"},
    {t:"1 µL", why:"1 µL 是配反應液時每份 internal control 的量。"},
    {t:"8 µL", why:"8 µL 是配反應液時每份 PCR grade water 的量；檢體超過 2 µL 也不適用這個流程。"},
    {t:"23 µL", why:"23 µL 是反應液的量，檢體只加 2 µL。"}
  ]},
  {q:"檢體、陰性品管（NC）、陽性品管（PC），加樣順序是？",
   opts:[
    {t:"先加檢體和 NC（2 µL PCR grade water），最後才加 PC", ok:true, why:"PC 的 DNA 濃度很高，最後才開、才加，避免污染其他管。"},
    {t:"先加 PC，再加檢體和 NC", why:"PC 濃度很高，先開先加，很容易污染接下來的檢體和 NC。"},
    {t:"NC 管什麼都不加，空著上機", why:"NC 要加 2 µL PCR grade water，跟檢體管的體積一樣。"}
  ]},
  {q:"加樣完成後，下一步是？",
   opts:[
    {t:"短暫離心（spin down）後放進 CFX96", ok:true, why:"spin down 把管壁上的液滴集中到管底，再上機跑 PCR。"},
    {t:"再 95°C 加熱 5 分鐘後上機", why:"95°C 5 分鐘是檢體前處理，已經做過了。"},
    {t:"不用離心，直接上機", why:"管壁上的液滴沒集中，反應體積會不準。"}
  ]},
  {q:"PCR 跑完了，判讀檢體之前，要先確認什麼？",
   opts:[
    {t:"PC 和 NC 的結果都符合預期", ok:true, why:"PC、NC 都符合預期，這次結果才能用。"},
    {t:"只要 PC 有擴增就好", why:"NC 如果也出現訊號，代表可能有污染，整批結果不能用。"},
    {t:"只要 NC 沒擴增就好", why:"PC 如果沒出來，代表這次反應可能失敗，陰性也不可信。"},
    {t:"不用看品管，直接看檢體", why:"品管沒過，檢體結果就不能相信。"}
  ]}
],

/* 最後一關：pc/nc 是品管狀態文字，fam/hex 是檢體結果文字 */
RESULTS: [
  {pc:"符合預期", nc:"符合預期", fam:"Ct 31", hex:"Ct 30", answer:"positive",
   why:"FAM Ct 31，小於 40 → 陽性。"},
  {pc:"符合預期", nc:"符合預期", fam:"Ct 38.5", hex:"Ct 30", answer:"positive",
   why:"Ct 38.5 很晚，但還是小於 40 → 陽性。說明書也建議看一下擴增曲線形狀。"},
  {pc:"符合預期", nc:"符合預期", fam:"Ct 22", hex:"無擴增", answer:"positive",
   why:"FAM 很強時，黴漿菌和 internal control 互搶材料，HEX 變弱甚至消失是正常的 → 陽性。"},
  {pc:"符合預期", nc:"符合預期", fam:"無擴增", hex:"Ct 30", answer:"negative",
   why:"FAM 沒訊號，而且 internal control 有出來，證明反應正常 → 陰性。"},
  {pc:"符合預期", nc:"符合預期", fam:"Ct 41.2", hex:"Ct 30", answer:"negative",
   why:"Ct ≥ 40 判陰性。"},
  {pc:"符合預期", nc:"符合預期", fam:"無擴增", hex:"無擴增", answer:"invalid",
   why:"FAM 和 internal control 都沒出來，可能是反應被抑制，不能說是陰性 → 無效。"},
  {pc:"無擴增", nc:"符合預期", fam:"無擴增", hex:"Ct 30", answer:"invalid",
   why:"PC 沒出來，這次反應不可信，檢體看起來陰性也不能用 → 無效。"}
],

ENDINGS: {
  positive:{title:"啊！污染了！", text:"把這支被污染的細胞株丟棄，從液態氮解凍新的細胞，養好後再重新做黴漿菌檢測。記得填寫黴漿菌檢測結果紀錄表。"},
  negative:{title:"太好了！檢測通過！", text:"通知學姊，這支細胞可以開始養給病毒培養工作站使用了！記得填寫黴漿菌檢測結果紀錄表。"},
  invalid:{title:"這次結果不能用", text:"品管或 internal control 有問題，這次的結果不能判讀。要從檢體前處理開始重做：重新取 100 µL 細胞懸浮液、95°C 加熱、離心取上清，再做 PCR。"}
}
};

/* ===================== 以下是程式，改題目不用動 ===================== */
(function(){
  "use strict";
  var root=document.getElementById("flowCard");
  if(!root) return;
  var S=MYCO_FLOW.STAGES, R=MYCO_FLOW.RESULTS, E=MYCO_FLOW.ENDINGS;
  var LABEL={positive:"陽性",negative:"陰性",invalid:"無效，要重新檢測"};
  var step=0, firstTry=0, tried=false, scene=null;

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
  function total(){return S.length+1}

  function bind(btns,check,onRight){
    var fb=document.getElementById("flowFeedback"), done=false;
    btns.forEach(function(b){b.onclick=function(){
      if(done) return;
      var r=check(b); fb.hidden=false;
      if(!r.ok){ tried=true; b.disabled=true; fb.className="fb bad"; fb.textContent="❌ "+r.why; return; }
      done=true; if(!tried) firstTry++;
      fb.className="fb good"; fb.textContent="⭕ 答對了！"+r.why; onRight();
    };});
  }

  function draw(){
    tried=false;
    if(step<S.length){
      var d=S[step];
      root.innerHTML='<span class="qztype">🧫 細胞品管任務 '+(step+1)+' / '+total()+'</span><h2>'+esc(d.q)+'</h2><div class="qzopts">'+
        shuffle(d.opts).map(function(o){return '<button type="button" class="btn flow-opt" data-i="'+d.opts.indexOf(o)+'">'+esc(o.t)+'</button>'}).join("")+
        '</div><div class="fb" id="flowFeedback" hidden></div><button class="btn key" id="flowNext" type="button" hidden>下一關 →</button>';
      bind(root.querySelectorAll(".flow-opt"),function(b){var o=d.opts[+b.dataset.i];return {ok:!!o.ok,why:o.why}},function(){document.getElementById("flowNext").hidden=false});
      document.getElementById("flowNext").onclick=next;
    }else if(step===S.length){
      scene=R[Math.floor(Math.random()*R.length)];
      root.innerHTML='<span class="qztype">📈 最後一關 '+total()+' / '+total()+'</span><h2>PCR 結果出來了，這支細胞的結果是？</h2>'+
        '<p>陽性品管（PC）：'+esc(scene.pc)+'　陰性品管（NC）：'+esc(scene.nc)+'</p>'+
        '<p>檢體 FAM（黴漿菌）：<b>'+esc(scene.fam)+'</b>　HEX（internal control）：<b>'+esc(scene.hex)+'</b></p>'+
        '<div class="qzopts">'+["positive","negative","invalid"].map(function(k){return '<button type="button" class="btn flow-res" data-v="'+k+'">'+LABEL[k]+'</button>'}).join("")+
        '</div><div class="fb" id="flowFeedback" hidden></div><button class="btn key" id="flowNext" type="button" hidden>看結局 →</button>';
      bind(root.querySelectorAll(".flow-res"),function(b){
        return b.dataset.v===scene.answer?{ok:true,why:scene.why}:{ok:false,why:"不是「"+LABEL[b.dataset.v]+"」喔！先看品管，再看 FAM，最後別忘了 HEX。"};
      },function(){document.getElementById("flowNext").hidden=false});
      document.getElementById("flowNext").onclick=next;
    }else{
      var e=E[scene.answer];
      root.innerHTML='<span class="qztype">🎉 任務完成</span><h2>'+esc(e.title)+'</h2><p>'+esc(e.text)+'</p>'+
        '<p>⭐ 一次就答對：<b>'+firstTry+' / '+total()+'</b> 關'+(firstTry===total()?'，全對！太厲害了！':'')+'</p>'+
        '<p><small>最後一關每次會抽不同的結果，多玩幾次練判讀！</small></p><button class="btn key" type="button" id="flowRestart">再玩一次 →</button>';
      document.getElementById("flowRestart").onclick=function(){step=0;firstTry=0;draw();root.scrollIntoView({behavior:"smooth",block:"start"})};
    }
  }
  function next(){step++;draw();root.scrollIntoView({behavior:"smooth",block:"start"})}
  draw();
})();

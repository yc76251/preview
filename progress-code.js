'use strict';
// 🔑 帶走進度：把學習進度變成一串短短的「進度碼」，也可以做成 QR。
// 原理：每一個「做完了沒／放書籤了沒」是一個 0 或 1，排成一長串數字，換成 36 進位（0–9、A–Z），
// 前面放 1 碼版本、最後放 1 碼檢查碼（抄錯一個字就讀不進來）。不傳到任何伺服器。
// 版本 1 的順序寫死在這裡：之後題目增減，要新增版本 2，不能改版本 1 的順序，不然舊代碼會讀錯。
const PCODE_DIG='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PCODE_LAYOUTS={
 '1':{lists:[
  ['solved',['receive','inoculate','startup','worklist','rack','run','results','report']],
  ['finalSolved',['vortex','loop','next','finish']],
  ['kitSolved',['pick','slots','inside','check','store']],
  ['aidSolved',['unr','partial','ind','retest','odd']],
  ['dopsKnown',['d01','d02','d03','d04','d05','d06','d07','d08','d09','d10','d11','d12','d13','d14']],
  ['review',['k1','k2','k3','k4','k5','s1','s2','s4','r1','r2','r3','r4','q1','q2','q3','q4','t1','t2','t3','i1','i2','i3','i4','p1','p2','p3','p4','p5']]
 ],examBits:7}
};
const PCODE_VER='1';
function pcodeCheck(s){let sum=0;for(let i=0;i<s.length;i++)sum+=PCODE_DIG.indexOf(s[i])*(i+1);return PCODE_DIG[sum%36];}
function progressCode(st){
 const L=PCODE_LAYOUTS[PCODE_VER];let n=0n,bit=0n;
 for(const [key,ids] of L.lists){const have=st[key]||[];for(const id of ids){if(have.includes(id))n|=1n<<bit;bit++;}}
 const eb=st.examBest&&st.examBest.total>0?st.examBest:null,lim=(1<<L.examBits)-1;
 n|=BigInt(eb?Math.min(eb.total,lim):0)<<bit;bit+=BigInt(L.examBits);
 n|=BigInt(eb?Math.min(eb.right,lim):0)<<bit;
 const body=PCODE_VER+n.toString(36).toUpperCase();
 return (body+pcodeCheck(body)).replace(/(.{4})(?=.)/g,'$1-');
}
function readProgressCode(raw){
 const s=String(raw||'').toUpperCase().replace(/[^0-9A-Z]/g,'');
 if(s.length<3)return null;
 const body=s.slice(0,-1);if(pcodeCheck(body)!==s.slice(-1))return null;
 const L=PCODE_LAYOUTS[body[0]];if(!L)return null;
 let n=0n;for(const ch of body.slice(1))n=n*36n+BigInt(PCODE_DIG.indexOf(ch));
 const out={},mask=(1n<<BigInt(L.examBits))-1n;let bit=0n;
 for(const [key,ids] of L.lists){out[key]=[];for(const id of ids){if((n>>bit)&1n)out[key].push(id);bit++;}}
 const total=Number((n>>bit)&mask);bit+=BigInt(L.examBits);const right=Number((n>>bit)&mask);
 out.examBest=total>0&&right<=total?{score:Math.round(right/total*100),right,total,at:''}:null;
 return out;
}
// 讀回來的進度跟現在的合併：做過的都留著，測驗留比較好的那次。不會讓進度變少。
function mergeProgress(got){
 const keys=PCODE_LAYOUTS[PCODE_VER].lists.map(x=>x[0]);let added=0;
 for(const k of keys){const cur=state[k]||(state[k]=[]);for(const id of got[k]||[])if(!cur.includes(id)){cur.push(id);added++;}}
 if(got.examBest&&(!state.examBest||got.examBest.score>state.examBest.score)){state.examBest=got.examBest;added++;}
 state=cleanProgress({...state});save();return added;
}
function progressLink(code){return location.origin+location.pathname+'#p-'+code.replace(/-/g,'');}
function keyDialog(){
 const code=progressCode(state),online=!(location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname));
 let svg='';if(online){try{const q=qrcode(0,'M');q.addData(progressLink(code));q.make();svg=q.createSvgTag({cellSize:4,margin:3,scalable:true});}catch{}}
 modal(`<h2>🔑 帶走進度</h2><p>把這串進度碼拍照或抄下來，到別的手機、電腦輸入，就能接著練。${online?'手機掃 QR，會直接打開網站並讀回進度。':''}</p><div class="pcode" id="pcodeText">${code}</div><div class="dialog-actions"><button id="pcodeCopy">複製進度碼</button></div>${svg?`<div class="qr-wrap">${svg}</div>`:'<p class="footer-note">網站放上網路後，這裡會出現 QR。</p>'}<h3>有進度碼？</h3><label class="pcode-read"><span class="visually-hidden">輸入進度碼</span><input id="pcodeInput" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="例如 1A2B-C3D4-…" maxlength="40"></label><div class="dialog-actions"><button class="primary" id="pcodeLoad">讀回進度</button></div><p id="pcodeMsg" role="status"></p><p class="footer-note">進度碼只記哪些題目答對、哪些卡會了、放了哪些書籤、測驗最好的成績；不含名字。讀回來會跟這台現在的進度合在一起，不會把做過的蓋掉。</p>`);
 $('#pcodeCopy').onclick=async()=>{try{await navigator.clipboard.writeText(code);toast('進度碼已複製');}catch{toast('請長按進度碼複製');}};
 $('#pcodeLoad').onclick=()=>{const got=readProgressCode($('#pcodeInput').value);if(!got){$('#pcodeMsg').textContent='讀不到：進度碼可能少抄或抄錯一個字，再對一次看看。';return;}const n=mergeProgress(got);render();$('#pcodeMsg').textContent=n?`✓ 讀回來了，多了 ${n} 項進度。`:'✓ 讀好了，這台的進度已經都有。';};
}
// 掃 QR 打開時，網址後面是 #p-代碼
function takeFromLink(){
 const h=location.hash.slice(1);if(!h.startsWith('p-'))return;
 const got=readProgressCode(h.slice(2));
 if(!got){history.replaceState(null,'',location.pathname);render();toast('這個 QR 的進度碼讀不到，請再掃一次。');return;}
 const n=mergeProgress(got);history.replaceState(null,'',location.pathname+'#home');render();
 toast(n?`🔑 進度讀回來了，多了 ${n} 項。`:'🔑 進度碼讀好了，這台的進度已經都有。');
}
$('#keyBtn').onclick=keyDialog;
window.addEventListener('hashchange',takeFromLink);
takeFromLink();

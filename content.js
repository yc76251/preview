/* 學習內容；來源對照與教師備註留存於本機維護文件。 */
const APP_VERSION = '0.10.1';
const TOPICS = [
  {
    "id": "knowledge",
    "title": "檢驗知識",
    "sub": "知道我們在找什麼",
    "icon": "◎",
    "color": "#FF6AA0",
    "soft": "#FFF0F6"
  },
  {
    "id": "sample",
    "title": "檢體處理",
    "sub": "讓檢體好好進站",
    "icon": "⌁",
    "color": "#E59426",
    "soft": "#FFF6DF"
  },
  {
    "id": "run",
    "title": "檢驗執行",
    "sub": "把每一步接起來",
    "icon": "▷",
    "color": "#328DB9",
    "soft": "#EAF7FF"
  },
  {
    "id": "qc",
    "title": "品管執行",
    "sub": "先確認結果的品質",
    "icon": "✓",
    "color": "#238875",
    "soft": "#E8F8F0"
  },
  {
    "id": "reagent",
    "title": "檢驗試劑",
    "sub": "打開試劑盒看看",
    "icon": "▥",
    "color": "#D55C48",
    "soft": "#FFF0E7"
  },
  {
    "id": "instrument",
    "title": "儀器與維護",
    "sub": "認識畫面與異常",
    "icon": "⚙",
    "color": "#527F38",
    "soft": "#EFF8DE"
  },
  {
    "id": "report",
    "title": "結果與報告",
    "sub": "把結果妥善交出去",
    "icon": "▤",
    "color": "#BE5580",
    "soft": "#FCEBF3"
  }
];
const CARDS = [
  {
    "id": "k1",
    "topic": "knowledge",
    "title": "EVP 測什麼？",
    "lead": "五組標的，各有自己的名字。",
    "body": "<p>這份教材聚焦 <b>BD MAX Enteric Viral Panel（EVP）</b>，檢測檢體中下列病毒核酸，作為病原體感染的輔助測試。</p><ul><li>諾羅病毒（Norovirus）GI、GII</li><li>輪狀病毒（Rotavirus）A</li><li>腺病毒（Adenovirus）F40/41</li><li>沙波病毒（Sapovirus）基因型組 I、II、IV、V</li><li>人類星狀病毒（Human astrovirus）</li></ul><p class=\"note\">本頁的 EVP 與另一套 EV／EV-A71 腸病毒檢測是不同檢驗；試劑、檢體準備與判讀規則分開學習。</p>"
  },
  {
    "id": "k2",
    "topic": "knowledge",
    "title": "檢體進去後，發生什麼？",
    "lead": "把一段自動化旅程，拆成看得懂的小站。",
    "body": "<ol><li>以酵素及溫度處理釋放核酸。</li><li>磁珠捕捉核酸，清洗後溶析。</li><li>核酸經中和後轉入預混試劑管，水化 PCR 試劑。</li><li>反應液進入 PCR 卡匣，微型閥密封。</li><li>RNA 標的先經反轉錄，再以即時 PCR 擴增與偵測；系統依各通道訊號判讀。</li></ol><details><summary>多看一點：水解探針</summary><p>探針完整時，螢光受鄰近的消光劑抑制。探針與目標結合並在延伸時被水解，螢光團與消光劑分離，儀器逐循環監測訊號。</p></details>"
  },
  {
    "id": "k3",
    "topic": "knowledge",
    "title": "兩管預混液，如何看五組標的？",
    "lead": "同一個通道，換一管就可能換一個任務。",
    "body": "<p>2021 年講義以 MM1、MM2 呈現兩組反應。每組都有樣品處理控制（SPC）。</p><div class=\"table-wrap\"><table><thead><tr><th>通道</th><th>MM1</th><th>MM2</th></tr></thead><tbody><tr><td>475/520</td><td>輪狀病毒</td><td>—</td></tr><tr><td>530/565</td><td>腺病毒</td><td>沙波病毒</td></tr><tr><td>585/630</td><td>諾羅病毒</td><td>星狀病毒</td></tr><tr><td>630/665</td><td>—</td><td>—</td></tr><tr><td>680/715</td><td>SPC</td><td>SPC</td></tr></tbody></table></div><p>兩組反應各自配置 SPC；通道數字表示偵測波段。</p><a class=\"text-link\" href=\"https://pinkducklab-pcr-design.netlify.app/\" target=\"_blank\" rel=\"noopener\">延伸互動：PinkDuckLab PCR 設計 ↗</a>",
    "image": "assets/lecture-45.png"
  },
  {
    "id": "k4",
    "topic": "knowledge",
    "title": "性能資料怎麼讀？",
    "lead": "看到數字，先問：它是在什麼條件下測到的？",
    "body": "<p>偵測極限（LoD）定義為至少 95% 測試可得到陽性的最低濃度。表內分為未經處理糞便與 Cary-Blair 處理糞便；這是性能研究的兩種基質，不表示本科室兩種檢體皆已納入常規收件。</p><details><summary>看看不同標的的 LoD 資料（cp/mL）</summary><div class=\"table-wrap\"><table><thead><tr><th>標的／品系</th><th>未處理</th><th>Cary-Blair</th></tr></thead><tbody><tr><td>NoV GI</td><td>6.28×10⁶</td><td>4.71×10⁶</td></tr><tr><td>NoV GII</td><td>2.49×10⁵</td><td>2.49×10⁵</td></tr><tr><td>RoV WA</td><td>6.46×10³</td><td>1.29×10⁴</td></tr><tr><td>RoV Va70</td><td>1.16×10⁴</td><td>5.82×10³</td></tr><tr><td>AdV F40</td><td>6.89×10⁴</td><td>2.75×10⁵</td></tr><tr><td>AdV F41</td><td>8.16×10⁴</td><td>1.22×10⁵</td></tr><tr><td>hAstV 4</td><td>1.75×10⁷</td><td>3.49×10⁷</td></tr><tr><td>hAstV 8</td><td>5.23×10⁶</td><td>2.09×10⁷</td></tr><tr><td>SaV GI</td><td>6.51×10⁷</td><td>6.51×10⁷</td></tr><tr><td>SaV GII</td><td>1.94×10⁶</td><td>1.94×10⁶</td></tr></tbody></table></div></details><p>分析特異性共評估 112 種微生物，並提到高濃度腺病毒第 1 型的交互反應。</p>"
  },
  {
    "id": "k5",
    "topic": "knowledge",
    "title": "防護也是檢驗的一部分",
    "lead": "照顧好自己，也是照顧好結果。",
    "body": "<ul><li>戴手套、口罩及穿著實驗衣；離開實驗室前清洗雙手。</li><li>檢體處理在生物安全操作箱（BSC）中進行。</li><li>進出實驗室及感染物外溢時，依科室程序清潔工作桌面。</li><li>廢棄物依科室的廢棄物處理程序辦理。</li></ul><details><summary>工作環境與桌面清潔</summary><p>操作環境溫度 18–30°C、濕度 20–80%。工作桌面可使用 75% 酒精或十倍稀釋漂白水；儀器表面依材質另選適合的清潔方法。</p></details>"
  },
  {
    "id": "s1",
    "topic": "sample",
    "title": "先確認適用的檢體",
    "lead": "先看檢體，再看容器與標示。",
    "body": "<p>適用檢體為液態或軟便。使用乾燥、潔淨、無處理劑的容器，避免混入尿液、水分、衛生紙或肥皂。病人不須特別準備。</p><p>開始製備時，在 SBT（Sample Buffer Tube，檢體緩衝管）標示對應檢體識別資訊，<b>不要遮住一維與二維條碼</b>。</p>"
  },
  {
    "id": "s2",
    "topic": "sample",
    "title": "把適當的量帶進 SBT",
    "lead": "量要剛好，別讓環柄偷偷多帶一份。",
    "body": "<ol><li>液狀檢體先高速振盪 15 秒。</li><li>使用試劑盒專用的 5 μL 拋棄式接種環，讓環狀部分完全浸入。</li><li>不要讓環柄深入檢體，避免額外帶入過量糞便。</li><li>將接種環伸入 SBT，以旋轉攪拌動作接種。</li><li>丟棄原透明蓋，換上藍色隔膜蓋。</li><li>接種後最高速振盪至少 10 秒。</li></ol>",
    "image": "assets/workflow.png"
  },
  {
    "id": "s4",
    "topic": "sample",
    "title": "保存與再測，分清楚管子和時間",
    "lead": "同樣是保存，管子、時間與情境都要對。",
    "body": "<p>原 SBT 或原檢體用於重測時，冷藏條件為 <b>2–8°C、5 天內</b>。</p><p>無 LIS 連線時，檢測後立即確認結果；樣品緩衝管可再用一次。重測前高速振盪 1 分鐘。</p>"
  },
  {
    "id": "r1",
    "topic": "run",
    "title": "開機、登入、登錄試劑批號",
    "lead": "讓儀器先認識今天的試劑。",
    "body": "<ol><li>先開 BD MAX 主機，再開電腦。</li><li>使用科室授權帳號登入。</li><li>進入 Run → Kit inventory。</li><li>在 Enter Kit Barcode 掃描試劑盒的一維條碼。</li><li>確認自動帶入的資訊，使用中的批號勾選 Active；非使用中批號取消勾選。</li></ol>"
  },
  {
    "id": "r2",
    "topic": "run",
    "title": "建立 Work List",
    "lead": "把檢驗、條碼與檢體編號連成一組。",
    "body": "<ol><li>Run → Work List。</li><li>在 Test 選擇 EVP 的 <b>BD MAX ENT VIR 49</b>。</li><li>掃描或輸入 Sample tube barcode 與 Accession，以 Enter／Tab 移動。</li><li>確認資料出現在右側清單，逐件完成。</li></ol>"
  },
  {
    "id": "r3",
    "topic": "run",
    "title": "裝架前，先看卡匣可用位置",
    "lead": "每個位置都有任務，放進去之前先對一遍。",
    "body": "<ol><li>依卡匣可用空格安排 SBT；新卡匣可從試管架第一格開始。</li><li>URS 在硬面輕敲一兩下，確保液體在管底，再放入架中。</li><li>依架上對應顏色放入白色萃取管、綠色預混管與藍色預混管；壓入聽到喀聲。</li><li>放入振盪後的 SBT。SBT 不必依工作單順序排列，但仍須符合卡匣可用位置與條碼辨識。</li></ol>"
  },
  {
    "id": "r4",
    "topic": "run",
    "title": "上機到 Complete",
    "lead": "機器開始動了，還要再看一個訊號。",
    "body": "<ol><li>Unlock door，將 A 架放左側、B 架放右側；無樣品的架可不放入。</li><li>確認對應 PCR 卡匣已裝入。</li><li>關蓋 → Start，輸入實驗名稱（可使用日期命名）。</li><li>儀器動作後仍需等條碼與設定確認無誤、畫面開始倒數，才可離開。</li><li>完成時狀態顯示 Complete，接著檢查結果。</li></ol><details><summary>下一批什麼時候可裝載？</summary><p>依螢幕顯示的萃取與預混準備時間，時間到且開門鍵回到藍色時，再進行下一批上機。不可只憑經過時間自行開門。</p></details>"
  },
  {
    "id": "q1",
    "topic": "qc",
    "title": "EVP 的品管時機",
    "lead": "換批號、換進貨批次，還有每月的例行確認。",
    "body": "<ul><li>不同批號，或同批號但不同批次進貨：執行陽性、陰性品管各一支。</li><li>每個月至少執行一次陽性與陰性品管液測試。</li><li>記錄於科室指定的腸胃道病原核酸檢測品管紀錄表。</li></ul>"
  },
  {
    "id": "q2",
    "topic": "qc",
    "title": "新批號／新批次，還有平行測試",
    "lead": "兩項確認各有用途，別少做其中一項。",
    "body": "<p>試劑更換批號，或同批號但不同批次進貨時，須以<b>陽性與陰性檢體各一支</b>進行平行測試。</p><p>完成後填入科室指定的平行測試紀錄表。品管和平行測試各有用途，兩項都要完成。</p>"
  },
  {
    "id": "q3",
    "topic": "qc",
    "title": "品管如何判定通過？",
    "lead": "一個符合還不夠，兩個對照都要過關。",
    "body": "<p>陽性及陰性對照皆符合預期，才勾選通過；任一不符合預期，勾選不通過。</p><p>紀錄欄包含測試日期、廠牌、批號、有效期限、陽性品管、陰性品管、測試結果與執行者簽名。</p>"
  },
  {
    "id": "q4",
    "topic": "qc",
    "title": "SPC 與外部對照，看的是不同事情",
    "lead": "它們各自回答什麼問題？先把角色分清楚。",
    "body": "<p>EVP 萃取管 D4 含樣品處理控制（SPC）；預混管含偵測 SPC 的專一引子與探針。兩組 Master Mix 都配置 SPC 偵測通道。</p><p>外部陽性／陰性品管用於確認預期結果；SPC 則在個別反應中發揮控制作用。</p><details><summary>檢體沒加，SPC 能代替你發現嗎？</summary><p>SPC 本來就在試劑內，不能把 SPC 有訊號當成「一定有加到檢體」的證明。漏加檢體可能造成偽陰性。</p></details>"
  },
  {
    "id": "t1",
    "topic": "reagent",
    "title": "打開 EVP 試劑盒",
    "lead": "一條、一支、兩支：先認識 EVP 的搭檔。",
    "body": "<p>套組參考編號 <b>443985</b>。每件檢體使用一條 URS、一支 D4 萃取管、兩支預混管，搭配 SBT、隔膜蓋、專用接種環與 PCR 卡匣。</p><div class=\"table-wrap\"><table><thead><tr><th>套組內容</th><th>數量</th></tr></thead><tbody><tr><td>D5 預混管</td><td>24（2×12）</td></tr><tr><td>D6 預混管</td><td>24（2×12）</td></tr><tr><td>D4 萃取管</td><td>24（2×12）</td></tr><tr><td>URS 試劑條</td><td>24</td></tr><tr><td>SBT 檢體緩衝管</td><td>24（2×12）</td></tr><tr><td>專用拋棄式接種環</td><td>30</td></tr><tr><td>隔膜蓋</td><td>25</td></tr></tbody></table></div>",
    "image": "assets/lecture-44.png"
  },
  {
    "id": "t2",
    "topic": "reagent",
    "title": "每個組件裡裝什麼？",
    "lead": "同樣是管子，裡面的任務可不一樣。",
    "body": "<dl><dt>D4 萃取管</dt><dd>乾燥萃取試劑：DNA／RNA 磁性親和性磁珠、Proteinase K、SPC。</dd><dt>D5、D6 預混管</dt><dd>乾燥反應試劑：講義列 RT-polymerase、核苷酸、標的專一引子與探針，以及 SPC 專一引子與 TaqMan 探針。</dd><dt>URS — Unitized Reagent Strip（整合式試劑條）</dt><dd>檢體處理與 DNA／RNA 萃取所需液體試劑，以及拋棄式吸頭。</dd><dt>SBT — Sample Buffer Tube（檢體緩衝管）</dt><dd>接收檢體的緩衝管；將檢體帶入後續的處理流程。</dd><dt>專用接種環與隔膜蓋</dt><dd>按指定取樣方式轉移檢體，接種後換隔膜蓋。</dd></dl>"
  },
  {
    "id": "t3",
    "topic": "reagent",
    "title": "預混管開袋後，還能放多久？",
    "lead": "外盒日期和開袋計時，兩關都要過。",
    "body": "<ul><li>預混管在標示有效期限內，2–25°C 保存。</li><li>開袋後立即重新密封，避免受潮。</li><li>初次開袋並重新密封後，預混管可在 2–25°C 穩定 14 天。</li><li>不使用過期試劑；兩個期限都必須符合。</li></ul>"
  },
  {
    "id": "i1",
    "topic": "instrument",
    "title": "四個常用畫面入口",
    "lead": "先說你想做什麼，再找對入口。",
    "body": "<div class=\"table-wrap\"><table><thead><tr><th>目的</th><th>畫面路徑</th></tr></thead><tbody><tr><td>登錄試劑批號</td><td>Run → Kit inventory</td></tr><tr><td>建立檢體清單</td><td>Run → Work List</td></tr><tr><td>看結果</td><td>Results → View</td></tr><tr><td>匯出結果</td><td>Results → Export</td></tr></tbody></table></div><p>不同軟體版本的介面名稱可能略有差異。</p>"
  },
  {
    "id": "i2",
    "topic": "instrument",
    "title": "關機與 Restart",
    "lead": "讓軟體先好好收尾，再處理電源。",
    "body": "<p><b>關機：</b>點左下 BD 圖示，選 Shutdown，等使用者介面及電腦依序關閉，再關儀器電源。</p><p><b>重新啟動：</b>點 BD 圖示 → Restart，重新啟動使用者介面。</p><p>開機順序：儀器主機在前，電腦在後。</p>"
  },
  {
    "id": "i3",
    "topic": "instrument",
    "title": "看到警示，先讀訊息",
    "lead": "訊息清掉了，原因也解決了嗎？",
    "body": "<p>作用中警示會讓左上警示圖示閃爍。點入 Alerts，查看日期、執行、訊息；展開後可看位置、處理狀態與發生階段。</p><p>持續性警示須等原因修正才會清除。Clear All 清除的是可清除的非持續性警示，不能把按過清除當作問題已修復。</p><p>依具體錯誤訊息查儀器手冊與科室程序，必要時聯絡 BD；不要自行拆修。UNR／IND／INC 的檢體，還要完成對應的重測處理。</p>"
  },
  {
    "id": "i4",
    "topic": "instrument",
    "title": "維護：先認識材質與範圍",
    "lead": "先認清要擦哪裡，再選對方法。",
    "body": "<p>手冊列每次執行間清潔樣品架，例行工作包含每日與每週清潔；其他維護視需要執行，部分維護須由合格 BD 人員辦理。</p><ul><li>不要直接向表面噴灑或傾倒液體。</li><li>卡匣抽屜不能使用研磨性或腐蝕性清潔劑，包含漂白劑、過氧化氫。</li><li>一般工作面使用次氯酸鈉後，需去除殘留；手冊指定後續用二次水、70% 酒精擦拭，每種溶液更換紗布。</li><li>每週清潔包含卡匣托盤、螢幕、透明上蓋與鏡子，各區使用的清潔方式不同。</li></ul>"
  },
  {
    "id": "p1",
    "topic": "report",
    "title": "先看每個標的的結果",
    "lead": "一張報告有五組標的，別只掃過一個代碼。",
    "body": "<p>Results 選取執行，按 View 或雙擊結果，即可查看摘要。一個或多個標的可能出現 UNR，不能只看整批或一個代碼。</p><div class=\"table-wrap\"><table><thead><tr><th>代碼</th><th>標的</th></tr></thead><tbody><tr><td>NoV</td><td>諾羅病毒 GI／GII</td></tr><tr><td>RoV</td><td>輪狀病毒 A</td></tr><tr><td>AdV</td><td>腺病毒 F40／41</td></tr><tr><td>hAstV</td><td>人類星狀病毒</td></tr><tr><td>SaV</td><td>沙波病毒 I／II／IV／V</td></tr></tbody></table></div><p>逐一確認各標的結果。Negative 或 Positive 可進行結果發送；遇到 UNR、IND 或 INC，先進入相應的處理流程。</p><details><summary>報告用語</summary><p>可報告結果列為 Positive、Not Detected、Invalid；生物參考區間為 Not Detected。</p></details>"
  },
  {
    "id": "p2",
    "topic": "report",
    "title": "UNR：先處理未解決的結果",
    "lead": "還沒得到有效答案，先別急著叫它陰性。",
    "body": "<p>各標的 UNR 表示可能有抑制性檢體或試劑失效，不能當作一般陰性。</p><ol><li>使用符合保存條件的原 SBT 或原檢體重測。</li><li>重測前對 SBT 或檢體高速振盪 <b>1 分鐘</b>，再依上機流程檢測。</li><li>UNR 檢體只再做一次；仍無結果時，可能無法排除抑制，需另送檢體。</li></ol>"
  },
  {
    "id": "p3",
    "topic": "report",
    "title": "IND 與 INC 怎麼辦？",
    "lead": "先讀訊息，才能決定怎麼接下一步。",
    "body": "<dl><dt>IND — Indeterminate</dt><dd>不確定，伴隨警示或錯誤代碼。</dd><dt>INC — Incomplete</dt><dd>檢測未完成，伴隨警示或錯誤代碼。</dd></dl><p>查看警示與錯誤訊息，使用符合保存條件的原 SBT 或原檢體重測；重測前高速振盪 1 分鐘。</p>"
  },
  {
    "id": "p4",
    "topic": "report",
    "title": "匯出、備註、留存與通報",
    "lead": "結果看懂了，還有最後幾件事。",
    "body": "<ul><li>匯出：插入隨身碟，Results 選結果 → Export，包含 PDF 與 CSV；出現 OK 後再拔除。</li><li>不論結果，報告備註註明 <b>BD MAX system</b>。</li><li>陽性結果需為品管需求留存檢體，填寫科室指定的品管檢體保存紀錄。</li><li>陽性結果透過檢驗資訊系統通報開單醫師與相關醫護人員。</li></ul>"
  },
  {
    "id": "p5",
    "topic": "report",
    "title": "結果可能受什麼影響？",
    "lead": "結果背後，也可能藏著檢體與處理的影響。",
    "body": "<ul><li>糞便量太多可能干擾反應。</li><li>採集、處理、保存不當，技術錯誤、檢體混淆、低於分析靈敏度，都可能影響正確性。</li><li>漏加檢體進 SBT，可能造成偽陰性。<details class=\"ic-note\"><summary>為什麼 SPC 抓不到漏加？外源性和內源性內部對照</summary><p><b>外源性內部對照（exogenous IC）</b>：試劑另外加進去的對照，跟病人檢體無關。EVP 的 SPC 就是這一種，放在萃取管 D4 裡，每一管都有。它告訴你萃取和 PCR 有沒有順利、有沒有被抑制；但就算忘了加檢體，SPC 還是會有訊號，所以它<b>不能證明檢體有加進去</b>。</p><p><b>內源性內部對照（endogenous IC）</b>：偵測檢體本身就有的東西，例如人類細胞的基因（像 β-globin、RNase P）。有訊號，代表檢體真的有加、量也夠；不過每份檢體含量不同，糞便裡的人類細胞也不一定多。</p><p>一句話記：<b>外源性看「流程有沒有成功」，內源性看「檢體有沒有加到」。</b></p></details></li><li>高於 25% v/v 的 Hydrocortisone 乳膏會干擾；RotaTeq 疫苗相關病毒在接種後 9 天內的糞便可能造成陽性結果。</li></ul><details><summary>延伸查看：干擾測試的範圍</summary><p>共測試 32 種生物及化學物質，包含七種藥物組成的混合物。表內其餘列示物質在研究條件下無可報告干擾；不能延伸成任意濃度都無影響。所列五種微生物為干擾評估對象，<b>不是 EVP 檢測標的</b>。</p><p>五種微生物：Salmonella typhimurium、Escherichia coli、Proteus vulgaris、Enterococcus faecalis、Peptostreptococcus anaerobius。</p><p>其他測試物質包括糞便脂肪、黏膜、人類全血、抗菌紙巾、灌腸劑／礦物油、痔瘡藥膏、Nystatin 乳膏、外用抗生素、殺精潤滑劑、甘油塞劑、Vagisil、瀉藥、液體／片劑止瀉藥、抗生素混合物、制酸劑與 NSAID。</p></details>"
  }
];
const REAGENTS = [
  {
    "name": "D4 萃取管",
    "tag": "萃取",
    "mark": "D4",
    "color": "#dddfe7",
    "question": "磁珠、Proteinase K 與 SPC，應該在哪一管？",
    "detail": "D4 是乾燥萃取試劑，含 DNA／RNA 磁性親和性磁珠、Proteinase K 及 SPC。"
  },
  {
    "name": "D5／D6 預混管",
    "tag": "反應",
    "mark": "MM",
    "color": "#9DE2C1",
    "question": "標的與 SPC 專一引子、探針，應該在哪一組？",
    "detail": "兩支預混管含反應成分及標的／SPC 專一引子與探針；不可把 SPC 引子探針與 SPC 控制材料混為一談。"
  },
  {
    "name": "URS 試劑條",
    "full": "Unitized Reagent Strip",
    "image": "assets/urs-reference.png",
    "tag": "萃取",
    "mark": "URS",
    "color": "#FFB347",
    "question": "液體萃取試劑與拋棄式吸頭，由哪個組件提供？",
    "detail": "URS 集成檢體處理與 DNA／RNA 萃取所需液體試劑及拋棄式吸頭。"
  },
  {
    "name": "SBT 檢體緩衝管",
    "full": "Sample Buffer Tube",
    "tag": "檢體",
    "mark": "SBT",
    "color": "#5FBFF9",
    "question": "接種環帶來的檢體，要先送進哪一管？",
    "detail": "SBT 接收檢體。標示不可遮住條碼，接種後換藍色隔膜蓋，再振盪至少 10 秒。"
  }
];
const QUIZZES = [
  {
    "id": "identity",
    "topic": "sample",
    "q": "建 Work List 時，如果沒掃 SBT 的管子條碼，會怎樣？",
    "options": [
      "系統不會跳到下一筆，掃了管子條碼才能繼續",
      "沒關係，有檢體編號就能上機",
      "可以先上機，結果出來再補",
      "在管子上手寫檢體編號就好"
    ],
    "a": 0,
    "why": "BD MAX 的 Work List 一筆要有管子條碼（Sample tube barcode）和檢體編號（Accession）；沒掃管子條碼，系統不會跳到下一筆。兩個連成同一筆，結果才對得上這份檢體。"
  },
  {
    "id": "lot",
    "topic": "qc",
    "q": "今天到貨的 EVP 跟上次批號相同，但屬於另一批次進貨。要做什麼？",
    "options": [
      "陽性／陰性品管，加上平行測試",
      "只做陽性／陰性品管",
      "只做平行測試",
      "批號相同，不用另外確認"
    ],
    "a": 0,
    "why": "同批號、不同批次進貨，也要做陽性／陰性品管和平行測試，兩項都要留紀錄。"
  },
  {
    "id": "spc",
    "topic": "knowledge",
    "q": "SPC（Sample Processing Control，樣品處理控制）有訊號，下面哪一句對？",
    "options": [
      "不能證明檢體有加進 SBT",
      "證明檢體一定有加進去",
      "證明這份檢體是陰性",
      "證明病人身分是對的"
    ],
    "a": 0,
    "why": "SPC 是外源性內部對照：本來就放在試劑（萃取管 D4）裡，看的是萃取和 PCR 有沒有成功，不是檢體加了沒有。漏加檢體，SPC 照樣有訊號，結果卻可能是偽陰性。想知道檢體有沒有加到，要靠偵測人類基因的內源性內部對照。"
  },
  {
    "id": "unr",
    "topic": "report",
    "q": "NoV（諾羅病毒）第一次結果是 UNR（Unresolved，未解決），保存條件也符合。下一步？",
    "options": [
      "原 SBT 高速振盪 1 分鐘後重測",
      "原 SBT 振盪 10 秒後重測",
      "當成陰性發出",
      "直接請臨床另送檢體"
    ],
    "a": 0,
    "why": "UNR 不是陰性。保存條件符合時，用原 SBT 或原檢體重測，重測前高速振盪 1 分鐘（不是接種後的 10 秒）。重測後仍是 UNR，才請臨床另送檢體。"
  },
  {
    "id": "expired",
    "topic": "reagent",
    "q": "預混管開袋再密封已經超過 14 天，外盒有效期限還沒到。可以用嗎？",
    "options": [
      "不能用，已超過開袋後的期限",
      "可以用，外盒還沒過期",
      "放回冰箱，重新算 14 天",
      "可以用，再多幾天沒關係"
    ],
    "a": 0,
    "why": "外盒有效期限和開袋後 14 天，兩個都要符合。重新密封或放冰箱，開袋的計時不會歸零。"
  },
  {
    "id": "alert",
    "topic": "instrument",
    "q": "按了 Clear All，警示訊息消失了。這代表什麼？",
    "options": [
      "只是清掉訊息，原因還要確認",
      "問題已經修好了",
      "儀器自動排除了故障",
      "可以直接開始下一批"
    ],
    "a": 0,
    "why": "清掉訊息不等於排除原因。先看訊息、位置和發生階段，再依對應的處理方式做；持續性的警示要等問題修好才會消失。"
  }
];
const MISSING = [
  {
    "text": "接種後仍使用原來的透明蓋",
    "bad": true,
    "why": "應丟棄透明蓋，換藍色隔膜蓋。"
  },
  {
    "text": "SBT 標籤完整露出一維及二維條碼",
    "bad": false,
    "why": "正確，識別標示不能遮住原廠條碼。"
  },
  {
    "text": "URS 液體留在上方，未輕敲使液體回到管底",
    "bad": true,
    "why": "放入前先在硬面輕敲一兩下，確認液體在管底。"
  },
  {
    "text": "對應 PCR 卡匣還沒放入，就準備按 Start",
    "bad": true,
    "why": "裝架時要確認對應的 PCR 卡匣已放入。"
  },
  {
    "text": "依架上顏色放入一支白色萃取管、綠色及藍色預混管",
    "bad": false,
    "why": "EVP 裝架時，依對應顏色放入白色萃取管、綠色及藍色預混管。"
  }
];
const CASES = [
  {
    "title": "案例 01｜第一次出現 UNR",
    "intro": "模擬個別檢體的 NoV（諾羅病毒）結果，需要你決定下一步。",
    "result": "NoV：UNR",
    "detail": "這是第一次檢測；原 SBT 在 2–8°C 保存 1 天，還沒重測過。",
    "q": "下一步怎麼做？",
    "options": [
      "符合保存條件，高速振盪 1 分鐘後重測",
      "直接發 NoV 陰性",
      "振盪 10 秒後重測",
      "直接請臨床另送檢體"
    ],
    "a": 0,
    "why": "UNR 不能當陰性。這支 SBT 符合冷藏時限，重測前高速振盪 1 分鐘，再上機重測一次。另送檢體是重測後仍為 UNR 才做。"
  },
  {
    "title": "案例 02｜再測還是 UNR",
    "intro": "同一件檢體已經用原 SBT 重測過一次。",
    "result": "重測 NoV：仍為 UNR",
    "detail": "第一次也是 UNR；已用原 SBT 完成一次重測。",
    "q": "重測後仍是 UNR，下一步？",
    "options": [
      "可能有抑制，請臨床另送檢體",
      "用同一支 SBT 再重測一次",
      "當成陰性發出",
      "延長振盪時間再測"
    ],
    "a": 0,
    "why": "UNR 只重測一次。重測後仍沒有結果，可能是抑制排除不了，要請臨床另送檢體。"
  },
  {
    "title": "案例 03｜陽性結果的收尾",
    "intro": "結果和適用的品管都確認好了。",
    "result": "RoV（輪狀病毒）：Positive",
    "detail": "準備發報告和處理檢體。",
    "q": "報告備註和檢體處理，哪一組對？",
    "options": [
      "備註 BD MAX system，檢體留存並填表",
      "備註試劑批號，檢體留存並填表",
      "備註 BD MAX system，檢體直接丟棄",
      "不用備註，檢體留存並填表"
    ],
    "a": 0,
    "why": "不論結果，報告備註都要寫 BD MAX system；陽性檢體要留存，並填品管檢體保存紀錄。別忘了還要透過 LIS 發異常通報。"
  }
];
const TEACHBACK = [
  {
    "q": "請向學弟妹說明：D4 與 D5／D6 各自做什麼？",
    "points": [
      "D4：磁珠、Proteinase K、SPC，屬萃取試劑。",
      "D5／D6：兩組預混反應試劑，含標的與 SPC 引子探針。",
      "每件 EVP 檢體搭配一條 URS、一支萃取管與兩支預混管。"
    ]
  },
  {
    "q": "上機前，為什麼不能只看「管子都放了」？",
    "points": [
      "檢體標示與條碼沒有遮擋。",
      "試劑液體在管底、試管確實壓入，且是 EVP 的組件。",
      "卡匣可用位置與裝架相符，對應卡匣已放入。"
    ]
  },
  {
    "q": "學生問：「UNR 不也是沒測到嗎？」你會怎麼回答？",
    "points": [
      "UNR 同時涉及相應 SPC 未偵測到，不能作一般陰性。",
      "依相關條件重測，重測前高速振盪 1 分鐘。",
      "UNR 再測仍未解決，需另送檢體。"
    ]
  }
];
const TEACHBACK_DISTRACTORS = [
  {
    "text": "D4 與 D5／D6 可以互換，只要管數相同就好。",
    "why": "D4 是萃取管，D5／D6 是預混管，功能不同，不能互換。"
  },
  {
    "text": "試管放齊後，就可以省略條碼與 PCR 卡匣位置的確認。",
    "why": "還要確認條碼、試劑狀態與卡匣可用位置，不能只數管子。"
  },
  {
    "text": "UNR 可以當成陰性，直接結束這次結果處理。",
    "why": "UNR 不是一般陰性，需使用符合保存條件的原 SBT 或原檢體完成重測。"
  }
];


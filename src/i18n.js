import { createContext, useContext, useState, useCallback } from "react";

const translations = {
  zh: {
    // Nav
    navTitle: "Meta分析",
    navTitleSuffix: "101",
    navWhat: "概念",
    navWhy: "意義",
    navDemo: "演示",
    navHow: "方法",
    navPlots: "圖表",
    navQuiz: "彩蛋",
    langSwitch: "EN",

    // Hero
    heroBadge: "初學者指南",
    heroTitle1: "到底什麼是",
    heroTitle2: "Meta分析",
    heroTitle3: "？",
    heroDesc: "想像一下，閱讀某個主題的每一項研究，然後用數學方法將它們組合起來找到真正的答案。這就是Meta分析——比你想像的要簡單得多。",
    heroBtn: "開始學習 →",

    // What section
    whatLabel: "基礎知識",
    whatTitle: "Meta分析是什麼？",
    whatIntro: "想像一下：你想知道一種新藥是否有效。你找到了20項研究——有的說有效，有的說無效，有的說可能有效。與其只挑選你最喜歡的那一項，Meta分析會將全部20項結果進行數學組合，得出一個更可靠的答案。就像向20位專家提問，然後計算群體共識，給予最有把握的專家更大的權重。",
    whatCard1Title: "這是數學，不是觀點",
    whatCard1Text: "與作者用自己的話進行總結的傳統文獻綜述不同，Meta分析使用統計公式來計算精確的合併結果。",
    whatCard2Title: "並非所有研究都平等",
    whatCard2Text: "更大、更精確的研究擁有更多影響力。一項納入1000名患者的研究比僅有20名患者的研究更有份量——就像你更信任樣本量更大的民意調查一樣。",
    whatCard3Title: "更大過程的一部分",
    whatCard3Text: "Meta分析存在於「系統綜述」之中——這是一個用於查找、評估和合併某個問題所有相關研究的結構化過程。",
    whatAnalogyTitle: "餐廳評價類比",
    whatAnalogyText: "你會只根據一條評價來選餐廳嗎？大概不會——你會閱讀很多評價，形成一個整體印象。但你會更看重去過5次的人的評價，而不是只路過的人。Meta分析對科學研究所做的正是如此：閱讀所有研究，按質量和規模加權，然後給你最終結論。",

    // Why section
    whyLabel: "研究意義",
    whyTitle: "為什麼要做Meta分析？",
    whyIntro: "單個研究就像拼圖碎片——本身很有價值，但你需要把它們放在一起才能理解全貌。",
    whyCard1Title: "更強的統計效力",
    whyCard1Text: "小型研究往往無法檢測到真實效果。透過匯集數據，Meta分析實現了相當於更大研究的統計效力——有時達數萬名參與者。",
    whyCard2Title: "解決分歧",
    whyCard2Text: "當研究A說「是」而研究B說「否」時，Meta分析提供了公平的、數學化的仲裁，而不是選擇性引用。",
    whyCard3Title: "發現隱藏模式",
    whyCard3Text: "透過亞組分析，你可以發現一種治療對老年患者有效但對年輕患者無效——這是單個研究可能無法揭示的。",
    whyCard4Title: "影響真實決策",
    whyCard4Text: "Meta分析位於證據金字塔的頂端。政府、醫院和指南委員會依靠它們來制定治療和政策決策。",
    whyCard5Title: "揭露缺失證據",
    whyCard5Text: "漏斗圖等工具可以揭示陰性結果的研究是否未被發表——這種現象稱為發表偏倚。",
    whyCard6Title: "指引未來研究",
    whyCard6Text: "透過揭示我們已知和未知的內容，Meta分析突出研究空白，指導最需要新研究的方向。",

    // Combiner
    combinerLabel: "實際演示",
    combinerTitle: "觀看研究如何合併",
    combinerDesc: "這個互動演示展示了Meta分析的工作原理。五項研究各有不同結果——點擊「合併」查看按樣本量加權如何產生一個更可信的答案。",
    combinerScattered: "五項研究，五個不同答案",
    combinerCombining: "正在合併證據……",
    combinerCombined: "合併後的估計值",
    combinerScatteredDesc: "每個圓點是一項研究。它們結果不一——你信任哪一個？",
    combinerCombiningDesc: "按樣本量加權以找出真實訊號……",
    combinerCombinedDesc: (pooled) => `合併效應值：${pooled}——較大的研究將估計值拉向小的正效應`,
    combinerNegative: "← 負效應",
    combinerPositive: "正效應 →",
    combinerNoEffect: "無效應",
    combinerCombineBtn: "合併研究 →",
    combinerResetBtn: "↺ 重置",

    // Study descriptions
    studyADesc: "小型隨機對照試驗——發現中等正效應",
    studyBDesc: "大型試驗——發現幾乎無效應",
    studyCDesc: "小型研究——發現強效應",
    studyDDesc: "最大型試驗——發現小的正效應",
    studyEDesc: "中型研究——發現中等效應",

    // How section
    howLabel: "分步指南",
    howTitle: "如何進行Meta分析",
    howDesc: "這是一個結構化的8步流程。點擊每個步驟展開詳情，查看生動的類比幫助理解。",
    howNote: "基於PRISMA 2020指南和已建立的方法學框架",
    howThinkOfIt: "💡 可以這樣理解：",

    step1Title: "確定研究問題",
    step1Analogy: "就像在去買菜之前先確定你要做什麼菜。",
    step1Detail1: "使用PICO等結構化框架：人群(Population)、干預(Intervention)、對照(Comparison)、結局(Outcome)。",
    step1Detail2: "你的問題決定了一切——納入哪些研究、提取哪些數據，以及如何分析。",
    step1Detail3: "確保你的主題上有足夠的研究來支持定量合成。",
    step1Detail4: "在開始之前，撰寫詳細的計畫書並進行註冊（如在PROSPERO上註冊）。",

    step2Title: "系統檢索文獻",
    step2Analogy: "就像在多個海域撒下大網，確保不漏掉任何一條魚。",
    step2Detail1: "檢索多個資料庫：PubMed、Embase、Cochrane圖書館以及其他與你領域相關的資料庫。",
    step2Detail2: "使用精心構建的關鍵詞組合和布林運算符（AND、OR、NOT）。",
    step2Detail3: "不要忘記「灰色文獻」——學位論文、會議摘要、預印本——以減少偏倚。",
    step2Detail4: "仔細記錄每次檢索。你需要在PRISMA流程圖中報告這些。",

    step3Title: "篩選和選擇研究",
    step3Analogy: "就像從捕獲的魚中挑選出符合你需要的那些。",
    step3Detail1: "將預定義的納入排除標準應用於找到的每項研究。",
    step3Detail2: "至少兩名審稿人應獨立篩選標題、摘要，然後是全文。",
    step3Detail3: "使用參考文獻管理工具（EndNote、Mendeley）和篩選軟體（Rayyan、Covidence）。",
    step3Detail4: "準確記錄每項被排除研究的原因——透明度至關重要。",

    step4Title: "評估品質和偏倚風險",
    step4Analogy: "就像在烹飪前檢查每種食材的新鮮度和品質。",
    step4Detail1: "使用經過驗證的工具：Cochrane偏倚風險工具用於RCT，Newcastle-Ottawa量表用於觀察性研究。",
    step4Detail2: "評估隨機化、盲法、數據不完整和選擇性報告等方面。",
    step4Detail3: "低品質研究可能扭曲整體結果——你可能需要進行排除它們的敏感性分析。",
    step4Detail4: "兩名獨立審稿人應評估品質，並有解決分歧的程序。",

    step5Title: "提取數據和計算效應量",
    step5Analogy: "就像在加入鍋中之前精確測量每種配料。",
    step5Detail1: "使用標準化表格記錄樣本量、均值、標準差和事件數。",
    step5Detail2: "選擇效應量指標：二分類結局用比值比(OR)，連續性指標用均數差(MD)。",
    step5Detail3: "每項研究被編碼為一個數字（效應量）加上一個精確度度量。",
    step5Detail4: "仔細核實提取的數據——即使已發表的Meta分析也被發現存在錯誤。",

    step6Title: "合併結果和分析",
    step6Analogy: "就像將所有精確測量的配料混合在一起，看看做出了什麼菜。",
    step6Detail1: "選擇模型：固定效應（假設存在一個真實效應）vs 隨機效應（假設效應在研究間變化）。",
    step6Detail2: "每項研究按精確度加權——更大、更精確的研究有更多影響力。",
    step6Detail3: "用I²評估異質性：低於25%為低，25-50%為中等，高於50%為高。",
    step6Detail4: "如果異質性高，透過亞組分析或Meta迴歸探索原因。",

    step7Title: "檢查發表偏倚",
    step7Analogy: "就像確保你的食譜書沒有缺頁——尤其是那些失敗食譜的頁面。",
    step7Detail1: "製作漏斗圖：研究效應值 vs 精確度。對稱性表明無偏倚。",
    step7Detail2: "使用Egger檢驗或Begg檢驗來統計量化潛在偏倚。",
    step7Detail3: "剪補法可以估計可能「缺失」了多少研究並調整結果。",
    step7Detail4: "請記住：漏斗圖不對稱也可能反映真正的異質性，而不僅僅是偏倚。",

    step8Title: "報告研究結果",
    step8Analogy: "就像寫下食譜，讓任何人都能精確地重現你的菜餚。",
    step8Detail1: "遵循PRISMA 2020指南——一份涵蓋綜述各個方面的27項清單。",
    step8Detail2: "包含PRISMA流程圖，顯示找到、篩選和納入了多少研究。",
    step8Detail3: "在森林圖中展示所有關鍵統計數據：效應量、信賴區間、I²、P值。",
    step8Detail4: "公開討論局限性：納入研究的品質、潛在偏倚和可推廣性。",

    // Forest plot
    forestLabel: "關鍵視覺化",
    forestTitle: "如何閱讀森林圖",
    forestDesc: "森林圖是Meta分析的標誌性視覺化工具。每個元素都有其含義——點擊下方不同部分了解它們代表什麼。",
    forestNote: "在這個例子中，研究正在測試一種治療是否能減少不良結局。左側的值表示治療有效。",
    forestClickHint: "👆 點擊下方的方塊、線段、中心線或菱形",
    forestFavorsTreatment: "← 有利於治療",
    forestFavorsControl: "有利於對照 →",
    forestOverall: "總體",
    forestSquareTitle: "研究效應值（方塊）",
    forestSquareText: "每個方塊代表一項研究的結果。其大小反映該研究的權重——更大的方塊意味著樣本量更大、更精確的研究，對最終結果貢獻更大。",
    forestLineTitle: "信賴區間（線段）",
    forestLineText: "水平線段顯示合理值的範圍。線段越短=精確度越高。如果它穿過中心線，則該結果本身在統計學上不顯著。",
    forestCenterTitle: "無效線",
    forestCenterText: "這條豎線代表零效應——兩組之間沒有差異。左側的研究有利於治療組；右側的研究有利於對照組。",
    forestDiamondTitle: "合併估計值（菱形）",
    forestDiamondText: "菱形是所有研究的合併結果。其寬度顯示信賴區間。如果整個菱形位於中心線的一側，則總體效應在統計學上是顯著的。",

    // Glossary
    glossaryEffectSize: "效應量",
    glossaryEffectSizeDef: "衡量兩組之間差異大小的數字。常見類型：比值比、風險比和標準化均數差。",
    glossaryCI: "信賴區間",
    glossaryCIDef: "真實效應可能落入的範圍。95%CI意味著我們有95%的把握認為真實答案在這個範圍內。",
    glossaryI2: "I²（異質性）",
    glossaryI2Def: "研究間變異中有多少百分比是真實的（而非隨機雜訊）。低於25%=低，高於75%=非常高。",
    glossaryFunnel: "漏斗圖",
    glossaryFunnelDef: "用於檢查發表偏倚的散佈圖。研究應對稱分佈——如果不對稱，可能有缺失的結果。",
    glossaryFixedRandom: "固定效應 vs 隨機效應",
    glossaryFixedRandomDef: "固定效應假設存在一個真實效應。隨機效應假設效應在研究間變化。隨機效應更常用，也更保守。",
    glossaryPRISMA: "PRISMA",
    glossaryPRISMADef: "確保你的Meta分析透明、可重複和完整的27項報告清單。於2020年更新。",

    // Egg Hunt UI
    eggHuntLabel: "自測",
    eggHuntTitle: "復活節彩蛋狩獵",
    eggHuntDesc: "找到5個隱藏的彩蛋，測試你的Meta分析知識！每個正確答案都能收集一個彩蛋到你的籃子裡。",
    eggHuntStart: "開始狩獵 →",
    eggHuntProgress: (current) => `第${current}個蛋，共5個`,
    eggHuntCorrect: (name) => `你找到了${name}！`,
    eggHuntWrong: "蛋碎了……",
    eggHuntNext: "下一個蛋 →",
    eggHuntResults: "查看你的籃子 →",
    eggHuntBasketTitle: "你的彩蛋籃",
    eggHuntScore: (n) => `你找到了${n}個蛋（共5個）！`,
    eggHuntMaster: "Meta分析大師",
    eggHuntExplorer: "Meta分析探索者",
    eggHuntApprentice: "Meta分析學徒",
    eggHuntKeepTrying: "繼續探索！",
    eggHuntDownload: "下載速查表",
    eggHuntPlayAgain: "再玩一次 →",
    eggHuntAllSheets: "下載綜合速查表",

    // Egg category names
    eggCatDiscovery: "探索蛋",
    eggCatData: "數據蛋",
    eggCatForest: "森林蛋",
    eggCatVariety: "多樣蛋",
    eggCatSearch: "搜索蛋",
    eggCatBias: "偏倚蛋",
    eggCatWisdom: "智慧蛋",

    // Cheat sheet names
    eggSheetDiscovery: "什麼是Meta分析？",
    eggSheetData: "數據提取袖珍指南",
    eggSheetForest: "如何閱讀森林圖",
    eggSheetVariety: "異質性速查表",
    eggSheetSearch: "搜索與篩選指南",
    eggSheetBias: "偏倚偵探卡",
    eggSheetWisdom: "解讀指南針",

    // WW questions
    eggQ_WW01: "什麼是Meta分析？",
    eggQ_WW01_A: "一項收集患者新數據的研究",
    eggQ_WW01_B: "一種統計方法，將同一主題的多項研究結果合併",
    eggQ_WW01_C: "一種僅用文字總結研究結果的文獻綜述",
    eggQ_WW01_D: "一項有很多參與者的大型臨床試驗",
    eggQ_WW01_Exp: "Meta分析使用統計技術將多項獨立研究的數值結果合併，產生一個總體估計值。與敘述性綜述不同，它使用數學——而不僅僅是文字——來綜合證據。",

    eggQ_WW02: "為什麼研究者要做Meta分析，而不是只閱讀個別研究？",
    eggQ_WW02_A: "比閱讀個別論文更快",
    eggQ_WW02_B: "它允許研究者只選擇支持性的研究",
    eggQ_WW02_C: "合併數據增加了統計效力，可以揭示單個研究可能遺漏的模式",
    eggQ_WW02_D: "它消除了同儕審查的需要",
    eggQ_WW02_Exp: "個別研究，特別是小型研究，可能缺乏檢測真實效應的統計效力。匯集數據可以檢測出較小但有意義的效應，並提供更精確的整體估計值。",

    eggQ_WW03: "系統綜述和Meta分析有什麼區別？",
    eggQ_WW03_A: "它們完全一樣",
    eggQ_WW03_B: "系統綜述有方法地搜索和評估研究；Meta分析增加了統計合併結果的步驟",
    eggQ_WW03_C: "Meta分析總是在系統綜述之前進行",
    eggQ_WW03_D: "系統綜述只包括隨機對照試驗",
    eggQ_WW03_Exp: "系統綜述是查找、篩選和評價研究的結構化過程。Meta分析是其中的可選統計匯總步驟。你可以有沒有Meta分析的系統綜述，但反過來不行。",

    eggQ_WW04: "以下哪項不是進行Meta分析的好處？",
    eggQ_WW04_A: "它可以解決研究間矛盾的結果",
    eggQ_WW04_B: "它通過匯集參與者增加了總體樣本量",
    eggQ_WW04_C: "它保證合併結果是正確的",
    eggQ_WW04_D: "它可以探索研究之間結果不同的原因",
    eggQ_WW04_Exp: "Meta分析很強大，但不能保證真實性。如果納入的研究有偏差，合併它們可能產生更精確的錯誤答案——有時被稱為「垃圾進，垃圾出」。",

    eggQ_WW05: "「我找到了10項研究——6項說藥物有效，4項說無效，所以它可能有效。」這個推理有什麼問題？",
    eggQ_WW05_A: "沒問題——多數決是有效的",
    eggQ_WW05_B: "同事應該只計算隨機試驗",
    eggQ_WW05_C: "計算陽性與陰性研究忽略了研究規模、質量和效應量的差異——Meta分析會適當地給每項研究加權",
    eggQ_WW05_D: "你需要至少20項研究才能得出結論",
    eggQ_WW05_Exp: "這種「計票」方法平等對待所有研究，但一項設計良好的5000名參與者的大型試驗應該比只有30名參與者的小型先導研究更有份量。Meta分析使用統計加權來考慮這些差異。",

    // DE questions
    eggQ_DE01: "在Meta分析中，什麼是「效應量」？",
    eggQ_DE01_A: "研究中的參與者數量",
    eggQ_DE01_B: "一個標準化的數字，衡量組間差異或關係的大小",
    eggQ_DE01_C: "原始研究中報告的p值",
    eggQ_DE01_D: "分析中納入的研究數量",
    eggQ_DE01_Exp: "效應量量化了研究發現的大小。常見類型包括比值比、風險比和均數差。它不僅告訴你某種治療是否有效，還告訴你效果有多大。",

    eggQ_DE02: "一項試驗報告死亡率為治療組15/100和對照組22/100。你需要提取哪些關鍵數字？",
    eggQ_DE02_A: "只需要論文中的p值",
    eggQ_DE02_B: "每組的事件數（死亡數）和總參與者數",
    eggQ_DE02_C: "只需要百分比（15%和22%）",
    eggQ_DE02_D: "只需要兩組之間的差異（7%）",
    eggQ_DE02_Exp: "你需要每組的原始事件計數和樣本量。這讓Meta分析軟體計算效應量及其精確度。僅有百分比會丟失關於樣本量的信息，而樣本量影響研究獲得的權重。",

    eggQ_DE03: "為什麼指南建議由兩人獨立從每項研究中提取數據？",
    eggQ_DE03_A: "為了加快過程",
    eggQ_DE03_B: "因為一個人無法理解統計結果",
    eggQ_DE03_C: "為了減少錯誤和偏差——分歧可以被識別和解決",
    eggQ_DE03_D: "這只有Cochrane綜述才需要",
    eggQ_DE03_Exp: "數據提取錯誤可能改變結果。兩個獨立提取者可以發現錯誤並減少主觀偏差。分歧通過討論或第三位審查者解決。",

    eggQ_DE04: "一項研究報告結果為中位數和四分位距，而非均值和標準差。你應該怎麼做？",
    eggQ_DE04_A: "排除該研究——無法使用",
    eggQ_DE04_B: "將中位數當作均值處理",
    eggQ_DE04_C: "使用已建立的轉換公式估計均值和標準差，並在方法中註明",
    eggQ_DE04_D: "聯繫期刊編輯要求提供正確的統計數據",
    eggQ_DE04_Exp: "經過驗證的公式（例如Wan等人或Luo等人的方法）可以從中位數和範圍估計均值和標準差。這是常見做法——只需報告使用了轉換公式。",

    eggQ_DE05: "一項研究報告治療組零死亡。這應該如何處理？",
    eggQ_DE05_A: "排除該研究，因為無法用零計算比率",
    eggQ_DE05_B: "將其記錄為一例死亡而非零",
    eggQ_DE05_C: "應用小的連續性校正（例如，向每個格添加0.5）使計算成為可能，並記錄此操作",
    eggQ_DE05_D: "忽略治療組，只使用對照組數據",
    eggQ_DE05_Exp: "零事件格使比率計算不可能。連續性校正（通常為0.5）是一種標準方法，允許將該研究納入。務必在方法中報告此操作。",

    // FP questions
    eggQ_FP01: "在森林圖中，每條水平線代表什麼？",
    eggQ_FP01_A: "每項研究發表的時間線",
    eggQ_FP01_B: "一項研究效應估計值的信賴區間——線越短=估計值越精確",
    eggQ_FP01_C: "每項研究的參與者數量",
    eggQ_FP01_D: "每項研究的質量評級",
    eggQ_FP01_Exp: "每條水平線是一項研究的信賴區間（通常95%）。線上的方塊標記點估計值。較大的研究往往有較短的線，因為它們提供更精確的估計。",

    eggQ_FP02: "森林圖上在1（比率）或0（差異）處的垂直虛線表示什麼？",
    eggQ_FP02_A: "所有研究的平均效應",
    eggQ_FP02_B: "「無效線」——研究穿過它意味著結果在統計學上不顯著",
    eggQ_FP02_C: "臨床重要性所需的最小效應量",
    eggQ_FP02_D: "發表偏倚的截斷值",
    eggQ_FP02_Exp: "這是「無效線」。對於風險比/比值比，1=無差異。對於均數差，0=無差異。信賴區間穿過此線意味著我們不能確信存在真實效應。",

    eggQ_FP03: "森林圖上的方塊大小不同。大小告訴你什麼？",
    eggQ_FP03_A: "研究花了多少年",
    eggQ_FP03_B: "研究的質量評分",
    eggQ_FP03_C: "給予該研究的權重——較大的方塊意味著對整體結果的影響更大",
    eggQ_FP03_D: "結果是否具有統計學意義",
    eggQ_FP03_Exp: "方塊大小反映研究的權重，通常由樣本量和精確度決定。較大、更精確的研究獲得更大的方塊，對合併菱形的影響更大。",

    eggQ_FP04: "森林圖底部的菱形代表什麼？",
    eggQ_FP04_A: "最重要的單項研究",
    eggQ_FP04_B: "總體合併效應——其寬度顯示合併結果的信賴區間",
    eggQ_FP04_C: "對下一項研究的預測",
    eggQ_FP04_D: "納入的研究數量",
    eggQ_FP04_Exp: "菱形是「底線」。其中心=合併效應估計值，其寬度=95%信賴區間。如果菱形不觸及無效線，則整體結果在統計學上是顯著的。",

    eggQ_FP05: "所有8個方塊和菱形完全位於無效線的左側。你能得出什麼結論？",
    eggQ_FP05_A: "治療有害",
    eggQ_FP05_B: "你需要檢查軸標籤——「左」可能有利於治療或對照，取決於圖表的設置方式",
    eggQ_FP05_C: "所有8項研究的參與者數量相同",
    eggQ_FP05_D: "Meta分析沒有異質性",
    eggQ_FP05_Exp: "森林圖可以兩種方向設置！始終檢查底部的標籤（例如「有利於治療 ← → 有利於對照」）。永遠不要假設哪個方向是「好的」。",

    // HT questions
    eggQ_HT01: "在Meta分析中，「異質性」是什麼意思？",
    eggQ_HT01_A: "研究都是低質量的",
    eggQ_HT01_B: "研究使用了不同的語言",
    eggQ_HT01_C: "研究間的結果差異超出了僅由隨機因素所預期的",
    eggQ_HT01_D: "Meta分析包含了太多研究",
    eggQ_HT01_Exp: "異質性意味著結果之間的差異超過了隨機變異所能解釋的。高異質性表明某些因素——患者群體、劑量、研究設計——正在導致結果分歧。",

    eggQ_HT02: "你的Meta分析顯示I² = 85%。這告訴你什麼？",
    eggQ_HT02_A: "85%的研究發現了顯著結果",
    eggQ_HT02_B: "85%的研究間變異是由真實差異造成的，而非偶然",
    eggQ_HT02_C: "Meta分析的準確率為85%",
    eggQ_HT02_D: "85%的研究應該被排除",
    eggQ_HT02_Exp: "I²描述了總變異中有多少百分比是真正的異質性而非抽樣誤差。85%很高——你應該探索結果為何不同（例如，通過亞組分析或Meta回歸）。",

    eggQ_HT03: "固定效應和隨機效應模型的主要區別是什麼？",
    eggQ_HT03_A: "固定效應用於小型研究，隨機效應用於大型研究",
    eggQ_HT03_B: "固定效應假設所有研究共享一個真實效應；隨機效應假設每項研究估計的是略有不同的真實效應",
    eggQ_HT03_C: "隨機效應總是給出更大的效應量",
    eggQ_HT03_D: "它們總是給出相同的答案",
    eggQ_HT03_Exp: "固定效應：一個普遍的真實效應。隨機效應：真實效應在研究間變化，我們估計的是平均值。當異質性高時，隨機效應通常更合適。",

    eggQ_HT04: "你的Meta分析I² = 75%。最佳的下一步是什麼？",
    eggQ_HT04_A: "刪除研究直到I²降到50%以下",
    eggQ_HT04_B: "報告結果並忽略異質性",
    eggQ_HT04_C: "通過亞組分析或Meta回歸調查異質性的來源",
    eggQ_HT04_D: "切換到固定效應模型以隱藏異質性",
    eggQ_HT04_Exp: "高異質性是一個需要探索的信號，而不是忽略或人為減少。亞組分析和Meta回歸有助於識別什麼驅動了差異。在沒有科學理由的情況下刪除研究是不恰當的。",

    eggQ_HT05: "一項包含4項研究的Meta分析顯示I² = 0%且Q檢驗p = 0.85。你能自信地說沒有異質性嗎？",
    eggQ_HT05_A: "是的——I² = 0%證明結果相同",
    eggQ_HT05_B: "不能——只有4項研究時，I²和Q檢驗都缺乏檢測真實異質性的統計效力",
    eggQ_HT05_C: "是的——Q檢驗確認了這一點",
    eggQ_HT05_D: "這取決於固定效應還是隨機效應",
    eggQ_HT05_Exp: "I²和Cochran's Q在研究數量少時統計效力都很低。4項研究的I² = 0%並不意味著不存在異質性——可能只是無法檢測到。一些專家建議始終使用隨機效應作為謹慎的默認選擇。",

    // SS questions
    eggQ_SS01: "在系統綜述的背景下，PRISMA是什麼？",
    eggQ_SS01_A: "用於運行Meta分析的統計軟體包",
    eggQ_SS01_B: "一個報告指南，提供清單和流程圖，用於透明地報告系統綜述",
    eggQ_SS01_C: "已發表臨床試驗的數據庫",
    eggQ_SS01_D: "一種計算效應量的方法",
    eggQ_SS01_Exp: "PRISMA（系統綜述和Meta分析的首選報告項目）是一套指南，幫助作者透明地報告其綜述過程。流程圖顯示了找到、篩選、排除和納入了多少研究。",

    eggQ_SS02: "為什麼系統綜述應該搜索多個數據庫（如PubMed、Embase、CENTRAL）？",
    eggQ_SS02_A: "不同數據庫有不同格式，所以結果看起來更好",
    eggQ_SS02_B: "沒有單一數據庫索引所有已發表的研究——使用多個數據庫可以減少遺漏相關證據的機會",
    eggQ_SS02_C: "只有在主題罕見時才有必要",
    eggQ_SS02_D: "期刊編輯要求至少三個數據庫才能發表",
    eggQ_SS02_Exp: "每個數據庫覆蓋不同的期刊和研究類型。PubMed在生物醫學文獻方面很強，Embase增加了歐洲和藥理學內容，CENTRAL專注於臨床試驗。只搜索一個數據庫有遺漏重要研究的風險。",

    eggQ_SS03: "系統綜述中的「納入和排除標準」是什麼？",
    eggQ_SS03_A: "期刊用來決定是否發表綜述的規則",
    eggQ_SS03_B: "預先定義的規則，指定哪些研究符合綜述資格，哪些不符合",
    eggQ_SS03_C: "允許為綜述做貢獻的作者名單",
    eggQ_SS03_D: "決定結果是否顯著的統計閾值",
    eggQ_SS03_Exp: "在搜索之前，審查者定義資格標準——通常使用PICO框架（人群、干預、對照、結局）。這確保了研究選擇是系統的和可重複的，而不是基於審查者的偏好。",

    eggQ_SS04: "在篩選過程中，你找到了一篇相關的會議摘要但沒有完整發表的論文。你應該怎麼做？",
    eggQ_SS04_A: "自動排除——只有完整論文才算",
    eggQ_SS04_B: "自動納入——任何證據都是好證據",
    eggQ_SS04_C: "記錄它，嘗試聯繫作者獲取數據，並記錄你納入或排除它的決定和理由",
    eggQ_SS04_D: "用類似的已發表研究替代它",
    eggQ_SS04_Exp: "灰色文獻（會議摘要、學位論文、報告）可能包含重要證據並有助於減少發表偏倚。最佳做法是嘗試獲取數據。如果排除，要說明原因。",

    eggQ_SS05: "一位同事建議添加一項通過閱讀另一篇納入論文的參考文獻列表找到的研究。這可以接受嗎？",
    eggQ_SS05_A: "不行——所有研究必須來自數據庫搜索",
    eggQ_SS05_B: "可以——「參考文獻列表搜索」（滾雪球法）是一種推薦的補充方法，應予以記錄",
    eggQ_SS05_C: "只有在研究是在最近5年內發表的情況下",
    eggQ_SS05_D: "只有在你重新運行整個數據庫搜索的情況下",
    eggQ_SS05_Exp: "檢查納入研究的參考文獻列表是一種標準的推薦技術，可以捕獲你的數據庫搜索可能遺漏的研究。PRISMA指南包含一個專門的位置來報告以這種方式識別的研究。",

    // BQ questions
    eggQ_BQ01: "Meta分析中的「發表偏倚」是什麼？",
    eggQ_BQ01_A: "當期刊只發表知名研究者的研究時",
    eggQ_BQ01_B: "當具有陽性或顯著結果的研究比陰性或無效結果的研究更可能被發表時",
    eggQ_BQ01_C: "當Meta分析包含太多來自同一期刊的研究時",
    eggQ_BQ01_D: "當Meta分析本身未能發表時",
    eggQ_BQ01_Exp: "顯示顯著結果的研究更可能被發表。如果你的Meta分析只找到這些「贏家」，合併估計值可能高估了真實效應。這是Meta分析有效性的最大威脅之一。",

    eggQ_BQ02: "漏斗圖用於什麼？",
    eggQ_BQ02_A: "顯示研究發表的時間線",
    eggQ_BQ02_B: "視覺評估是否可能存在發表偏倚——對稱性表明風險低，不對稱性表明可能存在偏倚",
    eggQ_BQ02_C: "比較所有納入研究的質量評分",
    eggQ_BQ02_D: "顯示PRISMA流程圖",
    eggQ_BQ02_Exp: "漏斗圖將每項研究的效應量與其精確度作圖。沒有偏倚時，小型研究均勻地散佈在合併估計值周圍，形成對稱的漏斗。如果一側「缺失」，可能意味著陰性結果的研究未被發表。",

    eggQ_BQ03: "為什麼評估每項納入研究的「偏倚風險」很重要？",
    eggQ_BQ03_A: "這是期刊要求的形式，但不影響結果",
    eggQ_BQ03_B: "因為設計不良的研究可能產生誤導性結果——不經評估就納入它們可能使合併估計值產生偏差",
    eggQ_BQ03_C: "這只有觀察性研究才需要，隨機試驗不需要",
    eggQ_BQ03_D: "確定每項研究的樣本量",
    eggQ_BQ03_Exp: "Meta分析的質量取決於其納入的研究。Cochrane偏倚風險工具等工具評估隨機化、盲法和不完整結局數據等領域。高風險研究可以在敏感性分析中單獨分析。",

    eggQ_BQ04: "Meta分析中的「敏感性分析」是什麼？",
    eggQ_BQ04_A: "對患者對治療敏感程度的測試",
    eggQ_BQ04_B: "在改變假設的情況下重複分析，看主要發現是否成立",
    eggQ_BQ04_C: "衡量搜索策略在查找研究方面的敏感度",
    eggQ_BQ04_D: "僅針對統計顯著研究的單獨分析",
    eggQ_BQ04_Exp: "敏感性分析測試穩健性。如果刪除高風險研究會大幅改變合併估計值，則結論是脆弱的。如果結果保持穩定，你可以更有信心。",

    eggQ_BQ05: "你的漏斗圖看起來不對稱，左側缺少小型研究。這是否一定意味著發表偏倚？",
    eggQ_BQ05_A: "是的——不對稱總是意味著發表偏倚",
    eggQ_BQ05_B: "不一定——不對稱也可能由真正的異質性、小研究效應或偶然因素造成",
    eggQ_BQ05_C: "只有在少於10項研究時才是",
    eggQ_BQ05_D: "漏斗圖無法檢測發表偏倚",
    eggQ_BQ05_Exp: "漏斗圖不對稱是一個警告信號，而非證據。其他原因包括大小研究之間的真實差異、小型研究的較低質量或隨機變異。Egger檢驗等統計檢驗可以補充視覺評估。",

    // IN questions
    eggQ_IN01: "一項Meta分析發現統計學上顯著的結果（p = 0.03）。這是否一定意味著該發現具有臨床重要性？",
    eggQ_IN01_A: "是的——統計顯著性總是意味著臨床重要性",
    eggQ_IN01_B: "不——結果可以在統計學上顯著但太小以至於在實踐中無關緊要",
    eggQ_IN01_C: "只有在信賴區間窄的情況下",
    eggQ_IN01_D: "只有在I²低於50%的情況下",
    eggQ_IN01_Exp: "有足夠的匯集數據，即使是微小的效應也會變得顯著。血壓降低0.5 mmHg可能在統計學上顯著，但在臨床上毫無意義。始終關注效應量並問：「這個差異是否大到有意義？」",

    eggQ_IN02: "在Meta分析的背景下，什麼是「生態學謬誤」？",
    eggQ_IN02_A: "使用危害環境的研究",
    eggQ_IN02_B: "假設在研究層面發現的關係適用於個體患者",
    eggQ_IN02_C: "在人類Meta分析中包含動物研究",
    eggQ_IN02_D: "忘記在分析中包含環境因素",
    eggQ_IN02_Exp: "Meta回歸可能顯示平均年齡較高的研究有更大的效應，但這並不意味著每項研究中的老年個體反應更好。研究層面的模式不一定反映個體層面的關係。",

    eggQ_IN03: "你的Meta分析匯集了12項RCT，發現藥物X降低了死亡率。你能說藥物X「導致」了更低的死亡率嗎？",
    eggQ_IN03_A: "是的——RCT的Meta分析為因果主張提供了最強的證據",
    eggQ_IN03_B: "不能——Meta分析永遠不能做出因果主張",
    eggQ_IN03_C: "只有在每項研究都單獨顯示顯著結果時",
    eggQ_IN03_D: "只有在I²恰好為0%時",
    eggQ_IN03_Exp: "當納入的研究是設計良好的RCT（通過隨機化建立因果關係）時，Meta分析提供了強有力的因果證據。這就是為什麼RCT的Meta分析位於證據等級的頂端。",

    eggQ_IN04: "2015年的一項Meta分析包含8項研究，未發現顯著效應。此後，又發表了5項新的大型試驗。應該怎麼辦？",
    eggQ_IN04_A: "2015年的結果不變——Meta分析不會過期",
    eggQ_IN04_B: "Meta分析應該更新以包含新證據",
    eggQ_IN04_C: "除非新試驗都一致，否則應忽略",
    eggQ_IN04_D: "只有在原作者同意時才更新",
    eggQ_IN04_Exp: "Meta分析是證據的動態摘要。隨著新研究的出現，合併估計值可能改變——有時足以逆轉結論。定期更新或「活性」Meta分析越來越被認為是最佳實踐。",

    eggQ_IN05: "兩項關於同一主題的Meta分析得出了相反的結論。這怎麼可能？",
    eggQ_IN05_A: "其中一項一定犯了數學錯誤",
    eggQ_IN05_B: "搜索日期、納入標準、結局定義或統計模型的差異可以導致不同結果——兩者在技術上可能都是有效的",
    eggQ_IN05_C: "如果兩者都遵循了PRISMA指南，這是不可能的",
    eggQ_IN05_D: "包含更多研究的那個自動正確",
    eggQ_IN05_Exp: "Meta分析涉及許多判斷：哪些數據庫、哪些研究、如何定義結局、哪個模型。這些選擇可以導致不同的合併估計值。這就是為什麼提前註冊你的計畫書（例如在PROSPERO上）如此重要。",

    // Footer
    footerText: "內容綜合自領先的方法學指南，包括PRISMA 2020、Cochrane手冊和經過同儕審查的Meta分析教程。本站為面向初學者的教育資源。",
    footerBrand: "Meta分析 101",
  },

  en: {
    // Nav
    navTitle: "Meta-Analysis",
    navTitleSuffix: "101",
    navWhat: "What",
    navWhy: "Why",
    navDemo: "Demo",
    navHow: "How",
    navPlots: "Plots",
    navQuiz: "Egg Hunt",
    langSwitch: "中文",

    // Hero
    heroBadge: "A Beginner's Guide",
    heroTitle1: "What on earth is a ",
    heroTitle2: "Meta-Analysis",
    heroTitle3: "?",
    heroDesc: "Imagine reading every study on a topic, then mathematically combining them to find the real answer. That's meta-analysis — and it's simpler than you think.",
    heroBtn: "Start Learning →",

    // What section
    whatLabel: "The Basics",
    whatTitle: "So, What Is a Meta-Analysis?",
    whatIntro: "Picture this: you want to know if a new medication works. You find 20 studies — some say yes, some say no, some say maybe. Instead of just picking the one you like best, a meta-analysis mathematically combines all 20 results into a single, more reliable answer. It's like asking 20 experts and calculating the group consensus, giving more weight to the experts who are most confident.",
    whatCard1Title: "It's Math, Not Opinion",
    whatCard1Text: "Unlike a regular literature review where an author summarizes in their own words, meta-analysis uses statistical formulas to calculate a precise combined result.",
    whatCard2Title: "Not All Studies Are Equal",
    whatCard2Text: "Larger, more precise studies get more influence. A study with 1,000 patients counts more than one with 20 — just as you'd trust a larger poll more.",
    whatCard3Title: "Part of a Bigger Process",
    whatCard3Text: "Meta-analysis lives inside a 'systematic review' — a structured process for finding, evaluating, and combining all relevant studies on a question.",
    whatAnalogyTitle: "The Restaurant Review Analogy",
    whatAnalogyText: "Would you pick a restaurant based on one review? Probably not — you'd read many reviews and form an overall impression. But you'd weigh a review from someone who's visited 5 times over someone who just walked past. That's exactly what meta-analysis does with scientific studies: reads them all, weighs them by quality and size, and gives you the verdict.",

    // Why section
    whyLabel: "The Purpose",
    whyTitle: "Why Bother Doing One?",
    whyIntro: "Single studies are like puzzle pieces — valuable on their own, but you need to see them together to understand the full picture.",
    whyCard1Title: "More Statistical Power",
    whyCard1Text: "Small studies often can't detect real effects. By pooling data, meta-analysis achieves the power of a much larger study — sometimes tens of thousands of participants.",
    whyCard2Title: "Settle Disagreements",
    whyCard2Text: "When Study A says 'yes' and Study B says 'no,' meta-analysis provides a fair, mathematical arbitration instead of cherry-picking.",
    whyCard3Title: "Find Hidden Patterns",
    whyCard3Text: "Through subgroup analysis, you can discover a treatment works for older patients but not younger ones — something no single study might reveal.",
    whyCard4Title: "Shape Real Decisions",
    whyCard4Text: "Meta-analyses sit at the top of the evidence pyramid. Governments, hospitals, and guideline panels rely on them for treatment and policy decisions.",
    whyCard5Title: "Expose Missing Evidence",
    whyCard5Text: "Tools like funnel plots can reveal if studies with negative results weren't published — a phenomenon called publication bias.",
    whyCard6Title: "Map Future Research",
    whyCard6Text: "By revealing what we know and don't know, meta-analyses highlight gaps and guide where new studies are most needed.",

    // Combiner
    combinerLabel: "See It In Action",
    combinerTitle: "Watch Studies Combine",
    combinerDesc: 'This interactive demo shows how meta-analysis works. Five studies each found different results — click "Combine" to see how weighting by sample size produces a single, more trustworthy answer.',
    combinerScattered: "Five Studies, Five Different Answers",
    combinerCombining: "Combining the evidence...",
    combinerCombined: "One Pooled Estimate",
    combinerScatteredDesc: "Each dot is a study. They disagree — which one do you trust?",
    combinerCombiningDesc: "Weighting by sample size to find the true signal...",
    combinerCombinedDesc: (pooled) => `Pooled effect: ${pooled} — larger studies pulled the estimate toward a small positive effect`,
    combinerNegative: "← Negative effect",
    combinerPositive: "Positive effect →",
    combinerNoEffect: "No Effect",
    combinerCombineBtn: "Combine Studies →",
    combinerResetBtn: "↺ Reset",

    // Study descriptions
    studyADesc: "Small RCT — found a moderate positive effect",
    studyBDesc: "Large trial — found almost no effect",
    studyCDesc: "Small study — found a strong effect",
    studyDDesc: "Largest trial — found a small positive effect",
    studyEDesc: "Medium study — found a moderate effect",

    // How section
    howLabel: "Step by Step",
    howTitle: "How To Conduct a Meta-Analysis",
    howDesc: "It's a structured 8-step process. Click each step to expand the details and see a real-world analogy that makes it click.",
    howNote: "Based on PRISMA 2020 guidelines and established methodological frameworks",
    howThinkOfIt: "💡 Think of it like: ",

    step1Title: "Define Your Research Question",
    step1Analogy: "Deciding exactly what recipe you want to cook before going grocery shopping.",
    step1Detail1: "Use a structured framework like PICO: Population, Intervention, Comparison, Outcome.",
    step1Detail2: "Your question determines everything — which studies to include, what data to extract, and how to analyze it.",
    step1Detail3: "Make sure enough studies exist on your topic to justify a quantitative synthesis.",
    step1Detail4: "Write a detailed protocol and register it (e.g., on PROSPERO) before you begin.",

    step2Title: "Search the Literature Systematically",
    step2Analogy: "Casting a wide fishing net across multiple oceans to make sure you don't miss any fish.",
    step2Detail1: "Search multiple databases: PubMed, Embase, Cochrane Library, and others relevant to your field.",
    step2Detail2: "Use carefully constructed keyword combinations with Boolean operators (AND, OR, NOT).",
    step2Detail3: "Don't forget the 'gray literature' — dissertations, conference abstracts, preprints — to reduce bias.",
    step2Detail4: "Keep meticulous records of every search. You'll need to report this in a PRISMA flow diagram.",

    step3Title: "Screen & Select Studies",
    step3Analogy: "Sorting through your catch to keep only the fish that match what you're looking for.",
    step3Detail1: "Apply your pre-defined eligibility criteria to every study found.",
    step3Detail2: "At least two reviewers should independently screen titles, abstracts, then full texts.",
    step3Detail3: "Use reference management tools (EndNote, Mendeley) and screening software (Rayyan, Covidence).",
    step3Detail4: "Document exactly why each excluded study was removed — transparency is key.",

    step4Title: "Assess Quality & Risk of Bias",
    step4Analogy: "Checking the freshness and quality of each ingredient before cooking.",
    step4Detail1: "Use validated tools: Cochrane Risk of Bias for RCTs, Newcastle-Ottawa Scale for observational studies.",
    step4Detail2: "Evaluate randomization, blinding, incomplete data, and selective reporting.",
    step4Detail3: "Low-quality studies can distort your overall result — you may need sensitivity analyses excluding them.",
    step4Detail4: "Two independent reviewers should assess quality, with a process to resolve disagreements.",

    step5Title: "Extract Data & Calculate Effect Sizes",
    step5Analogy: "Measuring each ingredient precisely before adding it to the pot.",
    step5Detail1: "Use standardized forms to capture sample sizes, means, standard deviations, and event counts.",
    step5Detail2: "Choose your effect size metric: Odds Ratio for yes/no outcomes, Mean Difference for continuous measures.",
    step5Detail3: "Each study gets encoded as a single number (effect size) plus a measure of precision.",
    step5Detail4: "Double-check extractions — even published meta-analyses have been found to contain errors.",

    step6Title: "Pool Results & Analyze",
    step6Analogy: "Combining all your carefully measured ingredients and seeing what dish emerges.",
    step6Detail1: "Choose: Fixed-effect (assumes one true effect) vs. Random-effects (assumes effects vary between studies).",
    step6Detail2: "Each study is weighted by precision — larger, more precise studies have more influence.",
    step6Detail3: "Assess heterogeneity with I²: below 25% is low, 25–50% moderate, above 50% high.",
    step6Detail4: "If heterogeneity is high, explore why with subgroup analyses or meta-regression.",

    step7Title: "Check for Publication Bias",
    step7Analogy: "Making sure your recipe book isn't missing pages — especially the ones with failed recipes.",
    step7Detail1: "Create a funnel plot: study effects vs. precision. Symmetry suggests no bias.",
    step7Detail2: "Use Egger's test or Begg's test to statistically quantify potential bias.",
    step7Detail3: "The trim-and-fill method can estimate how many studies might be 'missing' and adjust the result.",
    step7Detail4: "Remember: funnel plot asymmetry can also reflect genuine heterogeneity, not just bias.",

    step8Title: "Report Your Findings",
    step8Analogy: "Writing up the recipe so anyone else could recreate your dish exactly.",
    step8Detail1: "Follow the PRISMA 2020 guidelines — a 27-item checklist covering every aspect of your review.",
    step8Detail2: "Include a PRISMA flow diagram showing how many studies were found, screened, and included.",
    step8Detail3: "Present results in forest plots with all key statistics: effect sizes, confidence intervals, I², p-values.",
    step8Detail4: "Discuss limitations openly: quality of included studies, potential biases, and generalizability.",

    // Forest plot
    forestLabel: "Key Visualizations",
    forestTitle: "Reading a Forest Plot",
    forestDesc: "The forest plot is the signature visualization of meta-analysis. Every element has a meaning — click on different parts below to learn what they represent.",
    forestNote: "In this example, studies are testing whether a treatment reduces a negative outcome. Values to the left mean the treatment helps.",
    forestClickHint: "👆 Click on a square, line, the center line, or the diamond below",
    forestFavorsTreatment: "← Favors Treatment",
    forestFavorsControl: "Favors Control →",
    forestOverall: "Overall",
    forestSquareTitle: "Study Effect (Square)",
    forestSquareText: "Each square shows one study's result. Its size reflects the study's weight — bigger squares mean larger, more precise studies that contribute more to the final answer.",
    forestLineTitle: "Confidence Interval (Line)",
    forestLineText: "The horizontal line shows the range of plausible values. Shorter lines = more precision. If it crosses the center line, the result isn't statistically significant on its own.",
    forestCenterTitle: "Line of No Effect",
    forestCenterText: "This vertical line represents zero effect — no difference between groups. Studies to the left favor treatment; studies to the right favor control.",
    forestDiamondTitle: "Pooled Estimate (Diamond)",
    forestDiamondText: "The diamond is the combined result of ALL studies. Its width shows the confidence interval. If the entire diamond sits on one side of the center line, the overall effect is statistically significant.",

    // Glossary
    glossaryEffectSize: "Effect Size",
    glossaryEffectSizeDef: "A number measuring how big the difference is between two groups. Common types: odds ratios, risk ratios, and standardized mean differences.",
    glossaryCI: "Confidence Interval",
    glossaryCIDef: "The range where the true effect likely falls. A 95% CI means we're 95% confident the real answer is somewhere in that range.",
    glossaryI2: "I² (Heterogeneity)",
    glossaryI2Def: "What percentage of variation between studies is real (not random noise). Under 25% = low, over 75% = very high.",
    glossaryFunnel: "Funnel Plot",
    glossaryFunnelDef: "A scatter plot checking for publication bias. Studies should scatter symmetrically — if not, some results may be missing.",
    glossaryFixedRandom: "Fixed vs. Random Effects",
    glossaryFixedRandomDef: "Fixed assumes one true effect exists. Random assumes effects vary between studies. Random is more common and conservative.",
    glossaryPRISMA: "PRISMA",
    glossaryPRISMADef: "The 27-item reporting checklist ensuring your meta-analysis is transparent, reproducible, and complete. Updated in 2020.",

    // Egg Hunt UI
    eggHuntLabel: "Test Yourself",
    eggHuntTitle: "Easter Egg Hunt",
    eggHuntDesc: "Find 5 hidden eggs and test your meta-analysis knowledge! Each correct answer collects an egg in your basket.",
    eggHuntStart: "Start Hunt →",
    eggHuntProgress: (current) => `Egg ${current} of 5`,
    eggHuntCorrect: (name) => `You found the ${name}!`,
    eggHuntWrong: "The egg cracked...",
    eggHuntNext: "Next Egg →",
    eggHuntResults: "See Your Basket →",
    eggHuntBasketTitle: "Your Egg Basket",
    eggHuntScore: (n) => `You found ${n} out of 5 eggs!`,
    eggHuntMaster: "Meta-Analysis Master",
    eggHuntExplorer: "Meta-Analysis Explorer",
    eggHuntApprentice: "Meta-Analysis Apprentice",
    eggHuntKeepTrying: "Keep exploring!",
    eggHuntDownload: "Download Cheat Sheet",
    eggHuntPlayAgain: "Hunt Again →",
    eggHuntAllSheets: "Download Combined Cheat Sheet",

    // Egg category names
    eggCatDiscovery: "Discovery Egg",
    eggCatData: "Data Egg",
    eggCatForest: "Forest Egg",
    eggCatVariety: "Variety Egg",
    eggCatSearch: "Search Egg",
    eggCatBias: "Bias Egg",
    eggCatWisdom: "Wisdom Egg",

    // Cheat sheet names
    eggSheetDiscovery: "What Is a Meta-Analysis?",
    eggSheetData: "Data Extraction Pocket Guide",
    eggSheetForest: "How to Read a Forest Plot",
    eggSheetVariety: "Heterogeneity Cheat Sheet",
    eggSheetSearch: "Search & Screening Guide",
    eggSheetBias: "Bias Detective Card",
    eggSheetWisdom: "Interpretation Compass",

    // WW questions
    eggQ_WW01: "What is a meta-analysis?",
    eggQ_WW01_A: "A study that collects new data from patients",
    eggQ_WW01_B: "A statistical method that combines results from multiple studies on the same topic",
    eggQ_WW01_C: "A type of literature review that summarizes study findings in words only",
    eggQ_WW01_D: "A single large clinical trial with many participants",
    eggQ_WW01_Exp: "A meta-analysis uses statistical techniques to combine numerical results from multiple independent studies, producing a single overall estimate. Unlike a narrative review, it uses math — not just words — to synthesize evidence.",

    eggQ_WW02: "Why would a researcher do a meta-analysis instead of just reading individual studies?",
    eggQ_WW02_A: "It is faster than reading individual papers",
    eggQ_WW02_B: "It allows the researcher to pick only supportive studies",
    eggQ_WW02_C: "Combining data increases statistical power and can reveal patterns that single studies might miss",
    eggQ_WW02_D: "It eliminates the need for peer review",
    eggQ_WW02_Exp: "Individual studies, especially small ones, may lack power to detect a real effect. Pooling data can detect smaller but meaningful effects and provide a more precise overall estimate.",

    eggQ_WW03: "What is the difference between a systematic review and a meta-analysis?",
    eggQ_WW03_A: "They are exactly the same thing",
    eggQ_WW03_B: "A systematic review searches and evaluates studies methodically; a meta-analysis adds the step of statistically combining results",
    eggQ_WW03_C: "A meta-analysis is always done before a systematic review",
    eggQ_WW03_D: "A systematic review only includes randomized controlled trials",
    eggQ_WW03_Exp: "A systematic review is the structured process of finding, screening, and appraising studies. A meta-analysis is the optional statistical pooling step within it. You can have a systematic review without a meta-analysis, but not the reverse.",

    eggQ_WW04: "Which of the following is NOT a benefit of conducting a meta-analysis?",
    eggQ_WW04_A: "It can settle conflicting results across studies",
    eggQ_WW04_B: "It increases the overall sample size by pooling participants",
    eggQ_WW04_C: "It guarantees that the combined result is correct",
    eggQ_WW04_D: "It can explore why results differ between studies",
    eggQ_WW04_Exp: "A meta-analysis is powerful but does not guarantee truth. If included studies are biased, combining them can produce a more precise wrong answer — sometimes called \"garbage in, garbage out.\"",

    eggQ_WW05: "\"I found 10 studies — 6 say the drug works, 4 say it doesn't, so it probably works.\" What is wrong with this reasoning?",
    eggQ_WW05_A: "Nothing — majority rules is valid",
    eggQ_WW05_B: "The colleague should only count randomized trials",
    eggQ_WW05_C: "Counting positive vs. negative studies ignores differences in study size, quality, and effect size — a meta-analysis weighs each study appropriately",
    eggQ_WW05_D: "You need at least 20 studies to draw any conclusion",
    eggQ_WW05_Exp: "This \"vote counting\" approach treats all studies equally, but a large, well-designed trial with 5,000 participants should carry more weight than a small pilot study with 30. Meta-analysis uses statistical weighting to account for these differences.",

    // DE questions
    eggQ_DE01: "In a meta-analysis, what is an \"effect size\"?",
    eggQ_DE01_A: "The number of participants in a study",
    eggQ_DE01_B: "A standardized number that measures how large the difference or relationship is between groups",
    eggQ_DE01_C: "The p-value reported in the original study",
    eggQ_DE01_D: "The number of studies included in the analysis",
    eggQ_DE01_Exp: "An effect size quantifies the magnitude of a finding. Common types include odds ratios, risk ratios, and mean differences. It tells you not just whether something works, but how much.",

    eggQ_DE02: "A trial reports mortality as 15/100 (treatment) and 22/100 (control). What key numbers do you need to extract?",
    eggQ_DE02_A: "Only the p-value from the paper",
    eggQ_DE02_B: "The number of events (deaths) and total participants in each group",
    eggQ_DE02_C: "Only the percentages (15% and 22%)",
    eggQ_DE02_D: "Just the difference between the two groups (7%)",
    eggQ_DE02_Exp: "You need raw event counts and sample sizes for each group. This lets meta-analysis software calculate the effect size and its precision. Percentages alone lose information about sample size, which affects how much weight a study gets.",

    eggQ_DE03: "Why do guidelines recommend two people independently extract data from each study?",
    eggQ_DE03_A: "To make the process faster",
    eggQ_DE03_B: "Because one person cannot understand statistical results",
    eggQ_DE03_C: "To reduce errors and bias — disagreements can be identified and resolved",
    eggQ_DE03_D: "It is only required for Cochrane reviews",
    eggQ_DE03_Exp: "Data extraction errors can change results. Two independent extractors catch mistakes and reduce subjective bias. Disagreements are resolved by discussion or a third reviewer.",

    eggQ_DE04: "A study reports results as median and interquartile range instead of mean and SD. What should you do?",
    eggQ_DE04_A: "Exclude the study — it cannot be used",
    eggQ_DE04_B: "Treat the median as if it were the mean",
    eggQ_DE04_C: "Use established conversion formulas to estimate the mean and SD, and note this in your methods",
    eggQ_DE04_D: "Contact the journal editor to demand the correct statistics",
    eggQ_DE04_Exp: "Validated formulas (e.g., by Wan et al. or Luo et al.) can estimate means and SDs from medians and ranges. This is common practice — just report that conversions were used.",

    eggQ_DE05: "One study reports zero deaths in the treatment group. How should this be handled?",
    eggQ_DE05_A: "Exclude the study because you cannot calculate a ratio with zero",
    eggQ_DE05_B: "Record it as one death instead of zero",
    eggQ_DE05_C: "Apply a small continuity correction (e.g., adding 0.5 to each cell) so the calculation is possible, and document this",
    eggQ_DE05_D: "Ignore the treatment group and only use the control data",
    eggQ_DE05_Exp: "Zero-event cells make ratio calculations impossible. A continuity correction (typically 0.5) is a standard approach that allows the study to be included. Always report this in your methods.",

    // FP questions
    eggQ_FP01: "In a forest plot, what does each horizontal line represent?",
    eggQ_FP01_A: "The timeline of when each study was published",
    eggQ_FP01_B: "The confidence interval of one study's effect estimate — shorter line = more precise estimate",
    eggQ_FP01_C: "The number of participants in each study",
    eggQ_FP01_D: "The quality rating of each study",
    eggQ_FP01_Exp: "Each horizontal line is a confidence interval (usually 95%) for one study. The square on the line marks the point estimate. Larger studies tend to have shorter lines because they provide more precise estimates.",

    eggQ_FP02: "What does the vertical dashed line at 1 (for ratios) or 0 (for differences) on a forest plot mean?",
    eggQ_FP02_A: "The average effect across all studies",
    eggQ_FP02_B: "The \"line of no effect\" — a study crossing it means the result is not statistically significant",
    eggQ_FP02_C: "The minimum effect size needed for clinical importance",
    eggQ_FP02_D: "The cutoff for publication bias",
    eggQ_FP02_Exp: "This is the \"line of no effect.\" For risk/odds ratios, 1 = no difference. For mean differences, 0 = no difference. A confidence interval crossing this line means we cannot confidently say there is a real effect.",

    eggQ_FP03: "The squares on a forest plot are different sizes. What does the size tell you?",
    eggQ_FP03_A: "How many years the study took",
    eggQ_FP03_B: "The quality score of the study",
    eggQ_FP03_C: "The weight given to that study — larger squares mean more influence on the overall result",
    eggQ_FP03_D: "Whether the result was statistically significant",
    eggQ_FP03_Exp: "Square size reflects the study's weight, typically determined by sample size and precision. Larger, more precise studies get bigger squares and more influence on the pooled diamond.",

    eggQ_FP04: "What does the diamond at the bottom of a forest plot represent?",
    eggQ_FP04_A: "The single most important study",
    eggQ_FP04_B: "The overall pooled effect — its width shows the confidence interval of the combined result",
    eggQ_FP04_C: "A prediction for the next study",
    eggQ_FP04_D: "The number of studies included",
    eggQ_FP04_Exp: "The diamond is the \"bottom line.\" Its center = pooled effect estimate, its width = 95% CI. If the diamond does not touch the line of no effect, the overall result is statistically significant.",

    eggQ_FP05: "All 8 squares and the diamond sit entirely on the left side of the no-effect line. What can you conclude?",
    eggQ_FP05_A: "The treatment is harmful",
    eggQ_FP05_B: "You need to check the axis labels — \"left\" could favor treatment OR control depending on how the plot is set up",
    eggQ_FP05_C: "All 8 studies had the same number of participants",
    eggQ_FP05_D: "The meta-analysis has no heterogeneity",
    eggQ_FP05_Exp: "Forest plots can be oriented either way! Always check the label at the bottom (e.g., \"Favors Treatment ← → Favors Control\"). Never assume which direction is \"good.\"",

    // HT questions
    eggQ_HT01: "In meta-analysis, what does \"heterogeneity\" mean?",
    eggQ_HT01_A: "The studies are all of low quality",
    eggQ_HT01_B: "The studies used different languages",
    eggQ_HT01_C: "The results vary across studies more than expected from chance alone",
    eggQ_HT01_D: "The meta-analysis includes too many studies",
    eggQ_HT01_Exp: "Heterogeneity means results are more different than random variation would explain. High heterogeneity suggests something — patient populations, dosing, study design — is causing results to diverge.",

    eggQ_HT02: "Your meta-analysis shows I² = 85%. What does this tell you?",
    eggQ_HT02_A: "85% of studies found a significant result",
    eggQ_HT02_B: "85% of variability across studies is due to real differences, not chance",
    eggQ_HT02_C: "The meta-analysis is 85% accurate",
    eggQ_HT02_D: "85% of studies should be excluded",
    eggQ_HT02_Exp: "I² describes what percentage of total variation is genuine heterogeneity rather than sampling error. 85% is high — you should explore why results differ (e.g., through subgroup analysis or meta-regression).",

    eggQ_HT03: "What is the main difference between fixed-effect and random-effects models?",
    eggQ_HT03_A: "Fixed-effect is for small studies, random-effects for large ones",
    eggQ_HT03_B: "Fixed-effect assumes one true effect shared by all studies; random-effects assumes each study estimates a slightly different true effect",
    eggQ_HT03_C: "Random-effects always gives a larger effect size",
    eggQ_HT03_D: "They always give the same answer",
    eggQ_HT03_Exp: "Fixed-effect: one universal true effect. Random-effects: the true effect varies across studies, and we estimate the average. When heterogeneity is high, random-effects is usually more appropriate.",

    eggQ_HT04: "Your meta-analysis has I² = 75%. What is the BEST next step?",
    eggQ_HT04_A: "Remove studies until I² drops below 50%",
    eggQ_HT04_B: "Report the result and ignore heterogeneity",
    eggQ_HT04_C: "Investigate sources of heterogeneity through subgroup analysis or meta-regression",
    eggQ_HT04_D: "Switch to fixed-effect model to hide the heterogeneity",
    eggQ_HT04_Exp: "High heterogeneity is a signal to explore, not ignore or artificially reduce. Subgroup analysis and meta-regression help identify what drives differences. Removing studies without scientific justification is inappropriate.",

    eggQ_HT05: "A meta-analysis of 4 studies shows I² = 0% and Q-test p = 0.85. Can you confidently say there is no heterogeneity?",
    eggQ_HT05_A: "Yes — I² = 0% proves identical results",
    eggQ_HT05_B: "No — with only 4 studies, both I² and Q have low power to detect real heterogeneity",
    eggQ_HT05_C: "Yes — the Q-test confirms it",
    eggQ_HT05_D: "It depends on fixed vs. random-effects",
    eggQ_HT05_Exp: "Both I² and Cochran's Q have low power with few studies. I² = 0% with 4 studies does not mean heterogeneity is absent — it may just be undetectable. Some experts recommend always using random-effects as a cautious default.",

    // SS questions
    eggQ_SS01: "What is PRISMA in the context of a systematic review?",
    eggQ_SS01_A: "A statistical software package for running meta-analyses",
    eggQ_SS01_B: "A reporting guideline that provides a checklist and flow diagram for transparent reporting of systematic reviews",
    eggQ_SS01_C: "A database of published clinical trials",
    eggQ_SS01_D: "A method for calculating effect sizes",
    eggQ_SS01_Exp: "PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) is a set of guidelines to help authors report their review process transparently. The flow diagram shows how many studies were found, screened, excluded, and included.",

    eggQ_SS02: "Why should a systematic review search more than one database (e.g., PubMed, Embase, CENTRAL)?",
    eggQ_SS02_A: "Different databases have different formatting, so results look better",
    eggQ_SS02_B: "No single database indexes all published studies — using multiple databases reduces the chance of missing relevant evidence",
    eggQ_SS02_C: "It is only necessary if the topic is rare",
    eggQ_SS02_D: "Journal editors require at least three databases for publication",
    eggQ_SS02_Exp: "Each database covers a different set of journals and study types. PubMed is strong in biomedical literature, Embase adds European and pharmacological content, and CENTRAL focuses on clinical trials. Searching only one risks missing important studies.",

    eggQ_SS03: "What are \"inclusion and exclusion criteria\" in a systematic review?",
    eggQ_SS03_A: "Rules the journal uses to decide whether to publish the review",
    eggQ_SS03_B: "Pre-defined rules that specify which studies qualify for the review and which do not",
    eggQ_SS03_C: "A list of authors who are allowed to contribute to the review",
    eggQ_SS03_D: "Statistical thresholds for deciding whether a result is significant",
    eggQ_SS03_Exp: "Before searching, reviewers define eligibility criteria — often using the PICO framework (Population, Intervention, Comparison, Outcome). This ensures study selection is systematic and reproducible, not based on the reviewers' preferences.",

    eggQ_SS04: "During screening, you find a relevant conference abstract but no full published paper. What should you do?",
    eggQ_SS04_A: "Automatically exclude it — only full papers count",
    eggQ_SS04_B: "Automatically include it — any evidence is good evidence",
    eggQ_SS04_C: "Note it, attempt to contact the authors for data, and document your decision to include or exclude it with a reason",
    eggQ_SS04_D: "Replace it with a similar published study",
    eggQ_SS04_Exp: "Grey literature (conference abstracts, dissertations, reports) can contain important evidence and help reduce publication bias. Best practice is to try to obtain the data. If you exclude it, state why.",

    eggQ_SS05: "A colleague suggests adding a study found by reading the reference list of another included paper. Is this acceptable?",
    eggQ_SS05_A: "No — all studies must come from the database search",
    eggQ_SS05_B: "Yes — \"reference list searching\" (snowballing) is a recommended supplementary method and should be documented",
    eggQ_SS05_C: "Only if the study was published in the last 5 years",
    eggQ_SS05_D: "Only if you re-run the entire database search",
    eggQ_SS05_Exp: "Checking reference lists of included studies is a standard and recommended technique to catch studies your database search may have missed. PRISMA guidelines include a specific spot to report studies identified this way.",

    // BQ questions
    eggQ_BQ01: "What is \"publication bias\" in meta-analysis?",
    eggQ_BQ01_A: "When journals only publish studies from famous researchers",
    eggQ_BQ01_B: "When studies with positive or significant results are more likely to be published than those with negative or null results",
    eggQ_BQ01_C: "When a meta-analysis includes too many studies from one journal",
    eggQ_BQ01_D: "When the meta-analysis itself fails to get published",
    eggQ_BQ01_Exp: "Studies showing significant results are more likely to be published. If your meta-analysis only finds these \"winners,\" the pooled estimate may overestimate the true effect. This is one of the biggest threats to meta-analysis validity.",

    eggQ_BQ02: "What is a funnel plot used for?",
    eggQ_BQ02_A: "To show the timeline of study publications",
    eggQ_BQ02_B: "To visually assess whether publication bias may be present — symmetry suggests low risk, asymmetry suggests possible bias",
    eggQ_BQ02_C: "To compare the quality scores of all included studies",
    eggQ_BQ02_D: "To display the PRISMA flow diagram",
    eggQ_BQ02_Exp: "A funnel plot graphs each study's effect size against its precision. Without bias, small studies scatter evenly around the pooled estimate forming a symmetrical funnel. If one side is \"missing,\" it may mean negative-result studies were not published.",

    eggQ_BQ03: "Why is it important to assess the \"risk of bias\" in each included study?",
    eggQ_BQ03_A: "It is a formality required by journals but does not affect results",
    eggQ_BQ03_B: "Because poorly designed studies can produce misleading results — including them without assessment can bias the pooled estimate",
    eggQ_BQ03_C: "It is only needed for observational studies, not randomized trials",
    eggQ_BQ03_D: "To determine the sample size of each study",
    eggQ_BQ03_Exp: "A meta-analysis is only as good as its included studies. Tools like the Cochrane Risk of Bias tool assess domains such as randomization, blinding, and incomplete outcome data. High-risk studies can be analyzed separately in a sensitivity analysis.",

    eggQ_BQ04: "What is a \"sensitivity analysis\" in meta-analysis?",
    eggQ_BQ04_A: "A test of how sensitive patients were to the treatment",
    eggQ_BQ04_B: "Repeating the analysis while changing assumptions to see if the main finding holds up",
    eggQ_BQ04_C: "Measuring how sensitive the search strategy was at finding studies",
    eggQ_BQ04_D: "A separate analysis only for statistically significant studies",
    eggQ_BQ04_Exp: "Sensitivity analysis tests robustness. If removing high-risk studies changes the pooled estimate dramatically, the conclusion is fragile. If the result stays stable, you can be more confident.",

    eggQ_BQ05: "Your funnel plot looks asymmetrical, with small studies missing from the left side. Does this definitely mean publication bias?",
    eggQ_BQ05_A: "Yes — asymmetry always means publication bias",
    eggQ_BQ05_B: "No — asymmetry can also be caused by genuine heterogeneity, small-study effects, or chance",
    eggQ_BQ05_C: "Only if there are fewer than 10 studies",
    eggQ_BQ05_D: "Funnel plots cannot detect publication bias",
    eggQ_BQ05_Exp: "Funnel plot asymmetry is a warning sign, not proof. Other causes include true differences between small and large studies, lower quality in smaller studies, or random variation. Statistical tests like Egger's test can supplement visual assessment.",

    // IN questions
    eggQ_IN01: "A meta-analysis finds a statistically significant result (p = 0.03). Does this necessarily mean the finding is clinically important?",
    eggQ_IN01_A: "Yes — statistical significance always means clinical importance",
    eggQ_IN01_B: "No — a result can be statistically significant but too small to matter in practice",
    eggQ_IN01_C: "Only if the confidence interval is narrow",
    eggQ_IN01_D: "Only if I² is below 50%",
    eggQ_IN01_Exp: "With enough pooled data, even tiny effects become significant. A blood pressure reduction of 0.5 mmHg might be significant but meaningless clinically. Always look at the effect size and ask: \"Is this difference large enough to matter?\"",

    eggQ_IN02: "What is the \"ecological fallacy\" in the context of meta-analysis?",
    eggQ_IN02_A: "Using studies that harm the environment",
    eggQ_IN02_B: "Assuming that a relationship found at the study level applies to individual patients",
    eggQ_IN02_C: "Including animal studies in a human meta-analysis",
    eggQ_IN02_D: "Forgetting to include environmental factors in the analysis",
    eggQ_IN02_Exp: "Meta-regression might show that studies with higher average age have bigger effects, but this does NOT mean older individuals within each study responded better. Study-level patterns don't necessarily reflect individual-level relationships.",

    eggQ_IN03: "Your meta-analysis pools 12 RCTs and finds Drug X reduces mortality. Can you say Drug X \"causes\" lower mortality?",
    eggQ_IN03_A: "Yes — meta-analysis of RCTs provides the strongest evidence for causal claims",
    eggQ_IN03_B: "No — meta-analysis can never make causal claims",
    eggQ_IN03_C: "Only if every single study individually showed a significant result",
    eggQ_IN03_D: "Only if I² is exactly 0%",
    eggQ_IN03_Exp: "When included studies are well-conducted RCTs (designed to establish causation through randomization), a meta-analysis provides strong causal evidence. This is why meta-analyses of RCTs sit at the top of the evidence hierarchy.",

    eggQ_IN04: "A meta-analysis from 2015 included 8 studies and found no significant effect. Since then, 5 new large trials have been published. What should happen?",
    eggQ_IN04_A: "The 2015 result stands — meta-analyses do not expire",
    eggQ_IN04_B: "The meta-analysis should be updated to include the new evidence",
    eggQ_IN04_C: "The new trials should be ignored unless they all agree",
    eggQ_IN04_D: "Only update if the original authors agree",
    eggQ_IN04_Exp: "Meta-analyses are living summaries of evidence. As new studies appear, the pooled estimate may change — sometimes enough to reverse the conclusion. Regularly updated or \"living\" meta-analyses are increasingly recognized as best practice.",

    eggQ_IN05: "Two meta-analyses on the same topic reach opposite conclusions. How is this possible?",
    eggQ_IN05_A: "One of them must have made a mathematical error",
    eggQ_IN05_B: "Differences in search dates, inclusion criteria, outcome definitions, or statistical models can lead to different results — both may be technically valid",
    eggQ_IN05_C: "This is impossible if both followed PRISMA guidelines",
    eggQ_IN05_D: "The one with more studies is automatically correct",
    eggQ_IN05_Exp: "Meta-analyses involve many judgment calls: which databases, which studies, how to define outcomes, which model. These choices can lead to different pooled estimates. This is why registering your protocol in advance (e.g., on PROSPERO) is so important.",

    // Footer
    footerText: "Content synthesized from leading methodological guides including PRISMA 2020, Cochrane Handbook, and peer-reviewed meta-analysis tutorials. Built as an educational resource for beginners.",
    footerBrand: "Meta-Analysis 101",
  },
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("ma101-lang") || "zh";
    } catch {
      return "zh";
    }
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      try { localStorage.setItem("ma101-lang", next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback(
    (key, ...args) => {
      const val = translations[lang][key];
      if (typeof val === "function") return val(...args);
      return val || key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

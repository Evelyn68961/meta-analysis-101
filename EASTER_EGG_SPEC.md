# Easter Egg Hunt Game — Implementation Spec

## Overview

Replace the existing `Quiz` component in `App.jsx` with an **Easter Egg Hunt** mini-game. The quiz section (`id="quiz"`) stays in the same position in the page. All other sections remain untouched.

The game randomly selects **5 questions** (one per category, drawn from 5 of the 7 available categories) from a pool of **35 questions**. Each correct answer = an egg collected in the user's basket. At the end, collected eggs unlock category-specific cheat sheet downloads.

---

## Files to Modify

| File | What to do |
|------|-----------|
| `App.jsx` | Replace the `Quiz` component with `EggHuntGame`. Update the nav label if desired. Keep all other components identical. |
| `i18n.js` | Add all new i18n keys for the egg hunt UI and the 35 questions (both `zh` and `en`). Remove or keep the old quiz keys (they will no longer be referenced). |

---

## Design Tokens (use existing)

```js
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
```

Egg category colors:
```js
const EGG_COLORS = {
  "what-why":    "#2ECC71",  // Green — Discovery Egg
  "data":        "#3498DB",  // Blue — Data Egg
  "forest":      "#F1C40F",  // Gold — Forest Egg
  "heterogeneity":"#E74C3C", // Red/Pink — Variety Egg
  "search":      "#9B59B6",  // Purple — Search Egg
  "bias":        "#E67E22",  // Orange — Bias Egg
  "interpretation":"#95A5A6", // Silver — Wisdom Egg
};
```

---

## Game Flow

### Phase 1: Welcome Screen
- Show a garden/meadow-themed card with 5 hidden egg silhouettes
- Title: "🥚 Easter Egg Hunt" / "🥚 復活節彩蛋狩獵"
- Subtitle: "Find 5 hidden eggs and test your meta-analysis knowledge!"
- Button: "Start Hunt →"

### Phase 2: Egg Discovery (×5 rounds)
- Show an egg in the category color with a crack animation
- The egg "opens" to reveal the question
- User selects from 4 options (A/B/C/D)
- **Correct**: Egg flies into basket with a celebratory animation. Show green explanation box.
- **Wrong**: Egg fades/cracks apart. Show red explanation box with correct answer highlighted.
- Progress indicator: show 5 egg slots, filled/empty based on progress
- "Next Egg →" button after answering

### Phase 3: Results — Egg Basket
- Show collected eggs (correct answers) in a basket visualization
- Each collected egg is labeled with its category name
- Missed eggs shown as cracked/gray
- Score: "You found X out of 5 eggs!"
- Tier rewards:
  - 0–2 eggs: "Keep exploring! 🔍" — encourage retry
  - 3 eggs: "Meta-Analysis Apprentice 🥉" — unlock collected category cheat sheets
  - 4 eggs: "Meta-Analysis Explorer 🥈" — unlock ALL cheat sheets
  - 5 eggs: "Meta-Analysis Master 🏆" — unlock ALL cheat sheets + comprehensive combined cheat sheet
- Download buttons for unlocked cheat sheets (can be placeholder links for now, e.g., `#cheatsheet-forest`)
- "Hunt Again →" button (reshuffles questions)

---

## Question Selection Logic

```js
// 7 categories, each with 5 questions
// Each game: randomly pick 5 of the 7 categories, then 1 random question from each
const categories = ["what-why", "data", "forest", "heterogeneity", "search", "bias", "interpretation"];
const shuffled = shuffle(categories).slice(0, 5);
const selectedQuestions = shuffled.map(cat => {
  const pool = allQuestions.filter(q => q.category === cat);
  return pool[Math.floor(Math.random() * pool.length)];
});
```

---

## Question Bank (35 questions)

Each question object:
```js
{
  id: "WW-01",
  category: "what-why",       // maps to egg color and cheat sheet
  eggName: "Discovery Egg",   // en
  eggNameZh: "探索蛋",         // zh
  q: "...",                    // question text (i18n key)
  opts: ["A", "B", "C", "D"], // option texts (i18n keys)
  correct: 1,                 // 0-indexed
  explanation: "..."           // i18n key
}
```

### Category 1: What & Why — 🟢 Discovery Egg / 探索蛋

**WW-01**
- Q: What is a meta-analysis?
- Q_zh: 什麼是Meta分析？
- A: A study that collects new data from patients / 一項收集患者新數據的研究
- B: ✅ A statistical method that combines results from multiple studies on the same topic / 一種統計方法，將同一主題的多項研究結果合併
- C: A type of literature review that summarizes study findings in words only / 一種僅用文字總結研究結果的文獻綜述
- D: A single large clinical trial with many participants / 一項有很多參與者的大型臨床試驗
- Explanation: A meta-analysis uses statistical techniques to combine numerical results from multiple independent studies, producing a single overall estimate. Unlike a narrative review, it uses math — not just words — to synthesize evidence.
- Explanation_zh: Meta分析使用統計技術將多項獨立研究的數值結果合併，產生一個總體估計值。與敘述性綜述不同，它使用數學——而不僅僅是文字——來綜合證據。

**WW-02**
- Q: Why would a researcher do a meta-analysis instead of just reading individual studies?
- Q_zh: 為什麼研究者要做Meta分析，而不是只閱讀個別研究？
- A: It is faster than reading individual papers / 比閱讀個別論文更快
- B: It allows the researcher to pick only supportive studies / 它允許研究者只選擇支持性的研究
- C: ✅ Combining data increases statistical power and can reveal patterns that single studies might miss / 合併數據增加了統計效力，可以揭示單個研究可能遺漏的模式
- D: It eliminates the need for peer review / 它消除了同儕審查的需要
- Explanation: Individual studies, especially small ones, may lack power to detect a real effect. Pooling data can detect smaller but meaningful effects and provide a more precise overall estimate.
- Explanation_zh: 個別研究，特別是小型研究，可能缺乏檢測真實效應的統計效力。匯集數據可以檢測出較小但有意義的效應，並提供更精確的整體估計值。

**WW-03**
- Q: What is the difference between a systematic review and a meta-analysis?
- Q_zh: 系統綜述和Meta分析有什麼區別？
- A: They are exactly the same thing / 它們完全一樣
- B: ✅ A systematic review searches and evaluates studies methodically; a meta-analysis adds the step of statistically combining results / 系統綜述有方法地搜索和評估研究；Meta分析增加了統計合併結果的步驟
- C: A meta-analysis is always done before a systematic review / Meta分析總是在系統綜述之前進行
- D: A systematic review only includes randomized controlled trials / 系統綜述只包括隨機對照試驗
- Explanation: A systematic review is the structured process of finding, screening, and appraising studies. A meta-analysis is the optional statistical pooling step within it. You can have a systematic review without a meta-analysis, but not the reverse.
- Explanation_zh: 系統綜述是查找、篩選和評價研究的結構化過程。Meta分析是其中的可選統計匯總步驟。你可以有沒有Meta分析的系統綜述，但反過來不行。

**WW-04**
- Q: Which of the following is NOT a benefit of conducting a meta-analysis?
- Q_zh: 以下哪項不是進行Meta分析的好處？
- A: It can settle conflicting results across studies / 它可以解決研究間矛盾的結果
- B: It increases the overall sample size by pooling participants / 它通過匯集參與者增加了總體樣本量
- C: ✅ It guarantees that the combined result is correct / 它保證合併結果是正確的
- D: It can explore why results differ between studies / 它可以探索研究之間結果不同的原因
- Explanation: A meta-analysis is powerful but does not guarantee truth. If included studies are biased, combining them can produce a more precise wrong answer — sometimes called "garbage in, garbage out."
- Explanation_zh: Meta分析很強大，但不能保證真實性。如果納入的研究有偏差，合併它們可能產生更精確的錯誤答案——有時被稱為「垃圾進，垃圾出」。

**WW-05**
- Q: "I found 10 studies — 6 say the drug works, 4 say it doesn't, so it probably works." What is wrong with this reasoning?
- Q_zh: 「我找到了10項研究——6項說藥物有效，4項說無效，所以它可能有效。」這個推理有什麼問題？
- A: Nothing — majority rules is valid / 沒問題——多數決是有效的
- B: The colleague should only count randomized trials / 同事應該只計算隨機試驗
- C: ✅ Counting positive vs. negative studies ignores differences in study size, quality, and effect size — a meta-analysis weighs each study appropriately / 計算陽性與陰性研究忽略了研究規模、質量和效應量的差異——Meta分析會適當地給每項研究加權
- D: You need at least 20 studies to draw any conclusion / 你需要至少20項研究才能得出結論
- Explanation: This "vote counting" approach treats all studies equally, but a large, well-designed trial with 5,000 participants should carry more weight than a small pilot study with 30. Meta-analysis uses statistical weighting to account for these differences.
- Explanation_zh: 這種「計票」方法平等對待所有研究，但一項設計良好的5000名參與者的大型試驗應該比只有30名參與者的小型先導研究更有份量。Meta分析使用統計加權來考慮這些差異。

### Category 2: Data Extraction — 🔵 Data Egg / 數據蛋

**DE-01**
- Q: In a meta-analysis, what is an "effect size"?
- Q_zh: 在Meta分析中，什麼是「效應量」？
- A: The number of participants in a study / 研究中的參與者數量
- B: ✅ A standardized number that measures how large the difference or relationship is between groups / 一個標準化的數字，衡量組間差異或關係的大小
- C: The p-value reported in the original study / 原始研究中報告的p值
- D: The number of studies included in the analysis / 分析中納入的研究數量
- Explanation: An effect size quantifies the magnitude of a finding. Common types include odds ratios, risk ratios, and mean differences. It tells you not just whether something works, but how much.
- Explanation_zh: 效應量量化了研究發現的大小。常見類型包括比值比、風險比和均數差。它不僅告訴你某種治療是否有效，還告訴你效果有多大。

**DE-02**
- Q: A trial reports mortality as 15/100 (treatment) and 22/100 (control). What key numbers do you need to extract?
- Q_zh: 一項試驗報告死亡率為治療組15/100和對照組22/100。你需要提取哪些關鍵數字？
- A: Only the p-value from the paper / 只需要論文中的p值
- B: ✅ The number of events (deaths) and total participants in each group / 每組的事件數（死亡數）和總參與者數
- C: Only the percentages (15% and 22%) / 只需要百分比（15%和22%）
- D: Just the difference between the two groups (7%) / 只需要兩組之間的差異（7%）
- Explanation: You need raw event counts and sample sizes for each group. This lets meta-analysis software calculate the effect size and its precision. Percentages alone lose information about sample size, which affects how much weight a study gets.
- Explanation_zh: 你需要每組的原始事件計數和樣本量。這讓Meta分析軟體計算效應量及其精確度。僅有百分比會丟失關於樣本量的信息，而樣本量影響研究獲得的權重。

**DE-03**
- Q: Why do guidelines recommend two people independently extract data from each study?
- Q_zh: 為什麼指南建議由兩人獨立從每項研究中提取數據？
- A: To make the process faster / 為了加快過程
- B: Because one person cannot understand statistical results / 因為一個人無法理解統計結果
- C: ✅ To reduce errors and bias — disagreements can be identified and resolved / 為了減少錯誤和偏差——分歧可以被識別和解決
- D: It is only required for Cochrane reviews / 這只有Cochrane綜述才需要
- Explanation: Data extraction errors can change results. Two independent extractors catch mistakes and reduce subjective bias. Disagreements are resolved by discussion or a third reviewer.
- Explanation_zh: 數據提取錯誤可能改變結果。兩個獨立提取者可以發現錯誤並減少主觀偏差。分歧通過討論或第三位審查者解決。

**DE-04**
- Q: A study reports results as median and interquartile range instead of mean and SD. What should you do?
- Q_zh: 一項研究報告結果為中位數和四分位距，而非均值和標準差。你應該怎麼做？
- A: Exclude the study — it cannot be used / 排除該研究——無法使用
- B: Treat the median as if it were the mean / 將中位數當作均值處理
- C: ✅ Use established conversion formulas to estimate the mean and SD, and note this in your methods / 使用已建立的轉換公式估計均值和標準差，並在方法中註明
- D: Contact the journal editor to demand the correct statistics / 聯繫期刊編輯要求提供正確的統計數據
- Explanation: Validated formulas (e.g., by Wan et al. or Luo et al.) can estimate means and SDs from medians and ranges. This is common practice — just report that conversions were used.
- Explanation_zh: 經過驗證的公式（例如Wan等人或Luo等人的方法）可以從中位數和範圍估計均值和標準差。這是常見做法——只需報告使用了轉換公式。

**DE-05**
- Q: One study reports zero deaths in the treatment group. How should this be handled?
- Q_zh: 一項研究報告治療組零死亡。這應該如何處理？
- A: Exclude the study because you cannot calculate a ratio with zero / 排除該研究，因為無法用零計算比率
- B: Record it as one death instead of zero / 將其記錄為一例死亡而非零
- C: ✅ Apply a small continuity correction (e.g., adding 0.5 to each cell) so the calculation is possible, and document this / 應用小的連續性校正（例如，向每個格添加0.5）使計算成為可能，並記錄此操作
- D: Ignore the treatment group and only use the control data / 忽略治療組，只使用對照組數據
- Explanation: Zero-event cells make ratio calculations impossible. A continuity correction (typically 0.5) is a standard approach that allows the study to be included. Always report this in your methods.
- Explanation_zh: 零事件格使比率計算不可能。連續性校正（通常為0.5）是一種標準方法，允許將該研究納入。務必在方法中報告此操作。

### Category 3: Forest Plot — 🟡 Forest Egg / 森林蛋

**FP-01**
- Q: In a forest plot, what does each horizontal line represent?
- Q_zh: 在森林圖中，每條水平線代表什麼？
- A: The timeline of when each study was published / 每項研究發表的時間線
- B: ✅ The confidence interval of one study's effect estimate — shorter line = more precise estimate / 一項研究效應估計值的信賴區間——線越短=估計值越精確
- C: The number of participants in each study / 每項研究的參與者數量
- D: The quality rating of each study / 每項研究的質量評級
- Explanation: Each horizontal line is a confidence interval (usually 95%) for one study. The square on the line marks the point estimate. Larger studies tend to have shorter lines because they provide more precise estimates.
- Explanation_zh: 每條水平線是一項研究的信賴區間（通常95%）。線上的方塊標記點估計值。較大的研究往往有較短的線，因為它們提供更精確的估計。

**FP-02**
- Q: What does the vertical dashed line at 1 (for ratios) or 0 (for differences) on a forest plot mean?
- Q_zh: 森林圖上在1（比率）或0（差異）處的垂直虛線表示什麼？
- A: The average effect across all studies / 所有研究的平均效應
- B: ✅ The "line of no effect" — a study crossing it means the result is not statistically significant / 「無效線」——研究穿過它意味著結果在統計學上不顯著
- C: The minimum effect size needed for clinical importance / 臨床重要性所需的最小效應量
- D: The cutoff for publication bias / 發表偏倚的截斷值
- Explanation: This is the "line of no effect." For risk/odds ratios, 1 = no difference. For mean differences, 0 = no difference. A confidence interval crossing this line means we cannot confidently say there is a real effect.
- Explanation_zh: 這是「無效線」。對於風險比/比值比，1=無差異。對於均數差，0=無差異。信賴區間穿過此線意味著我們不能確信存在真實效應。

**FP-03**
- Q: The squares on a forest plot are different sizes. What does the size tell you?
- Q_zh: 森林圖上的方塊大小不同。大小告訴你什麼？
- A: How many years the study took / 研究花了多少年
- B: The quality score of the study / 研究的質量評分
- C: ✅ The weight given to that study — larger squares mean more influence on the overall result / 給予該研究的權重——較大的方塊意味著對整體結果的影響更大
- D: Whether the result was statistically significant / 結果是否具有統計學意義
- Explanation: Square size reflects the study's weight, typically determined by sample size and precision. Larger, more precise studies get bigger squares and more influence on the pooled diamond.
- Explanation_zh: 方塊大小反映研究的權重，通常由樣本量和精確度決定。較大、更精確的研究獲得更大的方塊，對合併菱形的影響更大。

**FP-04**
- Q: What does the diamond at the bottom of a forest plot represent?
- Q_zh: 森林圖底部的菱形代表什麼？
- A: The single most important study / 最重要的單項研究
- B: ✅ The overall pooled effect — its width shows the confidence interval of the combined result / 總體合併效應——其寬度顯示合併結果的信賴區間
- C: A prediction for the next study / 對下一項研究的預測
- D: The number of studies included / 納入的研究數量
- Explanation: The diamond is the "bottom line." Its center = pooled effect estimate, its width = 95% CI. If the diamond does not touch the line of no effect, the overall result is statistically significant.
- Explanation_zh: 菱形是「底線」。其中心=合併效應估計值，其寬度=95%信賴區間。如果菱形不觸及無效線，則整體結果在統計學上是顯著的。

**FP-05**
- Q: All 8 squares and the diamond sit entirely on the left side of the no-effect line. What can you conclude?
- Q_zh: 所有8個方塊和菱形完全位於無效線的左側。你能得出什麼結論？
- A: The treatment is harmful / 治療有害
- B: ✅ You need to check the axis labels — "left" could favor treatment OR control depending on how the plot is set up / 你需要檢查軸標籤——「左」可能有利於治療或對照，取決於圖表的設置方式
- C: All 8 studies had the same number of participants / 所有8項研究的參與者數量相同
- D: The meta-analysis has no heterogeneity / Meta分析沒有異質性
- Explanation: Forest plots can be oriented either way! Always check the label at the bottom (e.g., "Favors Treatment ← → Favors Control"). Never assume which direction is "good."
- Explanation_zh: 森林圖可以兩種方向設置！始終檢查底部的標籤（例如「有利於治療 ← → 有利於對照」）。永遠不要假設哪個方向是「好的」。

### Category 4: Heterogeneity — 🔴 Variety Egg / 多樣蛋

**HT-01**
- Q: In meta-analysis, what does "heterogeneity" mean?
- Q_zh: 在Meta分析中，「異質性」是什麼意思？
- A: The studies are all of low quality / 研究都是低質量的
- B: The studies used different languages / 研究使用了不同的語言
- C: ✅ The results vary across studies more than expected from chance alone / 研究間的結果差異超出了僅由隨機因素所預期的
- D: The meta-analysis includes too many studies / Meta分析包含了太多研究
- Explanation: Heterogeneity means results are more different than random variation would explain. High heterogeneity suggests something — patient populations, dosing, study design — is causing results to diverge.
- Explanation_zh: 異質性意味著結果之間的差異超過了隨機變異所能解釋的。高異質性表明某些因素——患者群體、劑量、研究設計——正在導致結果分歧。

**HT-02**
- Q: Your meta-analysis shows I² = 85%. What does this tell you?
- Q_zh: 你的Meta分析顯示I² = 85%。這告訴你什麼？
- A: 85% of studies found a significant result / 85%的研究發現了顯著結果
- B: ✅ 85% of variability across studies is due to real differences, not chance / 85%的研究間變異是由真實差異造成的，而非偶然
- C: The meta-analysis is 85% accurate / Meta分析的準確率為85%
- D: 85% of studies should be excluded / 85%的研究應該被排除
- Explanation: I² describes what percentage of total variation is genuine heterogeneity rather than sampling error. 85% is high — you should explore why results differ (e.g., through subgroup analysis or meta-regression).
- Explanation_zh: I²描述了總變異中有多少百分比是真正的異質性而非抽樣誤差。85%很高——你應該探索結果為何不同（例如，通過亞組分析或Meta回歸）。

**HT-03**
- Q: What is the main difference between fixed-effect and random-effects models?
- Q_zh: 固定效應和隨機效應模型的主要區別是什麼？
- A: Fixed-effect is for small studies, random-effects for large ones / 固定效應用於小型研究，隨機效應用於大型研究
- B: ✅ Fixed-effect assumes one true effect shared by all studies; random-effects assumes each study estimates a slightly different true effect / 固定效應假設所有研究共享一個真實效應；隨機效應假設每項研究估計的是略有不同的真實效應
- C: Random-effects always gives a larger effect size / 隨機效應總是給出更大的效應量
- D: They always give the same answer / 它們總是給出相同的答案
- Explanation: Fixed-effect: one universal true effect. Random-effects: the true effect varies across studies, and we estimate the average. When heterogeneity is high, random-effects is usually more appropriate.
- Explanation_zh: 固定效應：一個普遍的真實效應。隨機效應：真實效應在研究間變化，我們估計的是平均值。當異質性高時，隨機效應通常更合適。

**HT-04**
- Q: Your meta-analysis has I² = 75%. What is the BEST next step?
- Q_zh: 你的Meta分析I² = 75%。最佳的下一步是什麼？
- A: Remove studies until I² drops below 50% / 刪除研究直到I²降到50%以下
- B: Report the result and ignore heterogeneity / 報告結果並忽略異質性
- C: ✅ Investigate sources of heterogeneity through subgroup analysis or meta-regression / 通過亞組分析或Meta回歸調查異質性的來源
- D: Switch to fixed-effect model to hide the heterogeneity / 切換到固定效應模型以隱藏異質性
- Explanation: High heterogeneity is a signal to explore, not ignore or artificially reduce. Subgroup analysis and meta-regression help identify what drives differences. Removing studies without scientific justification is inappropriate.
- Explanation_zh: 高異質性是一個需要探索的信號，而不是忽略或人為減少。亞組分析和Meta回歸有助於識別什麼驅動了差異。在沒有科學理由的情況下刪除研究是不恰當的。

**HT-05**
- Q: A meta-analysis of 4 studies shows I² = 0% and Q-test p = 0.85. Can you confidently say there is no heterogeneity?
- Q_zh: 一項包含4項研究的Meta分析顯示I² = 0%且Q檢驗p = 0.85。你能自信地說沒有異質性嗎？
- A: Yes — I² = 0% proves identical results / 是的——I² = 0%證明結果相同
- B: ✅ No — with only 4 studies, both I² and Q have low power to detect real heterogeneity / 不能——只有4項研究時，I²和Q檢驗都缺乏檢測真實異質性的統計效力
- C: Yes — the Q-test confirms it / 是的——Q檢驗確認了這一點
- D: It depends on fixed vs. random-effects / 這取決於固定效應還是隨機效應
- Explanation: Both I² and Cochran's Q have low power with few studies. I² = 0% with 4 studies does not mean heterogeneity is absent — it may just be undetectable. Some experts recommend always using random-effects as a cautious default.
- Explanation_zh: I²和Cochran's Q在研究數量少時統計效力都很低。4項研究的I² = 0%並不意味著不存在異質性——可能只是無法檢測到。一些專家建議始終使用隨機效應作為謹慎的默認選擇。

### Category 5: Search & Selection — 🟣 Search Egg / 搜索蛋

**SS-01**
- Q: What is PRISMA in the context of a systematic review?
- Q_zh: 在系統綜述的背景下，PRISMA是什麼？
- A: A statistical software package for running meta-analyses / 用於運行Meta分析的統計軟體包
- B: ✅ A reporting guideline that provides a checklist and flow diagram for transparent reporting of systematic reviews / 一個報告指南，提供清單和流程圖，用於透明地報告系統綜述
- C: A database of published clinical trials / 已發表臨床試驗的數據庫
- D: A method for calculating effect sizes / 一種計算效應量的方法
- Explanation: PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) is a set of guidelines to help authors report their review process transparently. The flow diagram shows how many studies were found, screened, excluded, and included.
- Explanation_zh: PRISMA（系統綜述和Meta分析的首選報告項目）是一套指南，幫助作者透明地報告其綜述過程。流程圖顯示了找到、篩選、排除和納入了多少研究。

**SS-02**
- Q: Why should a systematic review search more than one database (e.g., PubMed, Embase, CENTRAL)?
- Q_zh: 為什麼系統綜述應該搜索多個數據庫（如PubMed、Embase、CENTRAL）？
- A: Different databases have different formatting, so results look better / 不同數據庫有不同格式，所以結果看起來更好
- B: ✅ No single database indexes all published studies — using multiple databases reduces the chance of missing relevant evidence / 沒有單一數據庫索引所有已發表的研究——使用多個數據庫可以減少遺漏相關證據的機會
- C: It is only necessary if the topic is rare / 只有在主題罕見時才有必要
- D: Journal editors require at least three databases for publication / 期刊編輯要求至少三個數據庫才能發表
- Explanation: Each database covers a different set of journals and study types. PubMed is strong in biomedical literature, Embase adds European and pharmacological content, and CENTRAL focuses on clinical trials. Searching only one risks missing important studies.
- Explanation_zh: 每個數據庫覆蓋不同的期刊和研究類型。PubMed在生物醫學文獻方面很強，Embase增加了歐洲和藥理學內容，CENTRAL專注於臨床試驗。只搜索一個數據庫有遺漏重要研究的風險。

**SS-03**
- Q: What are "inclusion and exclusion criteria" in a systematic review?
- Q_zh: 系統綜述中的「納入和排除標準」是什麼？
- A: Rules the journal uses to decide whether to publish the review / 期刊用來決定是否發表綜述的規則
- B: ✅ Pre-defined rules that specify which studies qualify for the review and which do not / 預先定義的規則，指定哪些研究符合綜述資格，哪些不符合
- C: A list of authors who are allowed to contribute to the review / 允許為綜述做貢獻的作者名單
- D: Statistical thresholds for deciding whether a result is significant / 決定結果是否顯著的統計閾值
- Explanation: Before searching, reviewers define eligibility criteria — often using the PICO framework (Population, Intervention, Comparison, Outcome). This ensures study selection is systematic and reproducible, not based on the reviewers' preferences.
- Explanation_zh: 在搜索之前，審查者定義資格標準——通常使用PICO框架（人群、干預、對照、結局）。這確保了研究選擇是系統的和可重複的，而不是基於審查者的偏好。

**SS-04**
- Q: During screening, you find a relevant conference abstract but no full published paper. What should you do?
- Q_zh: 在篩選過程中，你找到了一篇相關的會議摘要但沒有完整發表的論文。你應該怎麼做？
- A: Automatically exclude it — only full papers count / 自動排除——只有完整論文才算
- B: Automatically include it — any evidence is good evidence / 自動納入——任何證據都是好證據
- C: ✅ Note it, attempt to contact the authors for data, and document your decision to include or exclude it with a reason / 記錄它，嘗試聯繫作者獲取數據，並記錄你納入或排除它的決定和理由
- D: Replace it with a similar published study / 用類似的已發表研究替代它
- Explanation: Grey literature (conference abstracts, dissertations, reports) can contain important evidence and help reduce publication bias. Best practice is to try to obtain the data. If you exclude it, state why.
- Explanation_zh: 灰色文獻（會議摘要、學位論文、報告）可能包含重要證據並有助於減少發表偏倚。最佳做法是嘗試獲取數據。如果排除，要說明原因。

**SS-05**
- Q: A colleague suggests adding a study found by reading the reference list of another included paper. Is this acceptable?
- Q_zh: 一位同事建議添加一項通過閱讀另一篇納入論文的參考文獻列表找到的研究。這可以接受嗎？
- A: No — all studies must come from the database search / 不行——所有研究必須來自數據庫搜索
- B: ✅ Yes — "reference list searching" (snowballing) is a recommended supplementary method and should be documented / 可以——「參考文獻列表搜索」（滾雪球法）是一種推薦的補充方法，應予以記錄
- C: Only if the study was published in the last 5 years / 只有在研究是在最近5年內發表的情況下
- D: Only if you re-run the entire database search / 只有在你重新運行整個數據庫搜索的情況下
- Explanation: Checking reference lists of included studies is a standard and recommended technique to catch studies your database search may have missed. PRISMA guidelines include a specific spot to report studies identified this way.
- Explanation_zh: 檢查納入研究的參考文獻列表是一種標準的推薦技術，可以捕獲你的數據庫搜索可能遺漏的研究。PRISMA指南包含一個專門的位置來報告以這種方式識別的研究。

### Category 6: Bias & Quality — 🟠 Bias Egg / 偏倚蛋

**BQ-01**
- Q: What is "publication bias" in meta-analysis?
- Q_zh: Meta分析中的「發表偏倚」是什麼？
- A: When journals only publish studies from famous researchers / 當期刊只發表知名研究者的研究時
- B: ✅ When studies with positive or significant results are more likely to be published than those with negative or null results / 當具有陽性或顯著結果的研究比陰性或無效結果的研究更可能被發表時
- C: When a meta-analysis includes too many studies from one journal / 當Meta分析包含太多來自同一期刊的研究時
- D: When the meta-analysis itself fails to get published / 當Meta分析本身未能發表時
- Explanation: Studies showing significant results are more likely to be published. If your meta-analysis only finds these "winners," the pooled estimate may overestimate the true effect. This is one of the biggest threats to meta-analysis validity.
- Explanation_zh: 顯示顯著結果的研究更可能被發表。如果你的Meta分析只找到這些「贏家」，合併估計值可能高估了真實效應。這是Meta分析有效性的最大威脅之一。

**BQ-02**
- Q: What is a funnel plot used for?
- Q_zh: 漏斗圖用於什麼？
- A: To show the timeline of study publications / 顯示研究發表的時間線
- B: ✅ To visually assess whether publication bias may be present — symmetry suggests low risk, asymmetry suggests possible bias / 視覺評估是否可能存在發表偏倚——對稱性表明風險低，不對稱性表明可能存在偏倚
- C: To compare the quality scores of all included studies / 比較所有納入研究的質量評分
- D: To display the PRISMA flow diagram / 顯示PRISMA流程圖
- Explanation: A funnel plot graphs each study's effect size against its precision. Without bias, small studies scatter evenly around the pooled estimate forming a symmetrical funnel. If one side is "missing," it may mean negative-result studies were not published.
- Explanation_zh: 漏斗圖將每項研究的效應量與其精確度作圖。沒有偏倚時，小型研究均勻地散佈在合併估計值周圍，形成對稱的漏斗。如果一側「缺失」，可能意味著陰性結果的研究未被發表。

**BQ-03**
- Q: Why is it important to assess the "risk of bias" in each included study?
- Q_zh: 為什麼評估每項納入研究的「偏倚風險」很重要？
- A: It is a formality required by journals but does not affect results / 這是期刊要求的形式，但不影響結果
- B: ✅ Because poorly designed studies can produce misleading results — including them without assessment can bias the pooled estimate / 因為設計不良的研究可能產生誤導性結果——不經評估就納入它們可能使合併估計值產生偏差
- C: It is only needed for observational studies, not randomized trials / 這只有觀察性研究才需要，隨機試驗不需要
- D: To determine the sample size of each study / 確定每項研究的樣本量
- Explanation: A meta-analysis is only as good as its included studies. Tools like the Cochrane Risk of Bias tool assess domains such as randomization, blinding, and incomplete outcome data. High-risk studies can be analyzed separately in a sensitivity analysis.
- Explanation_zh: Meta分析的質量取決於其納入的研究。Cochrane偏倚風險工具等工具評估隨機化、盲法和不完整結局數據等領域。高風險研究可以在敏感性分析中單獨分析。

**BQ-04**
- Q: What is a "sensitivity analysis" in meta-analysis?
- Q_zh: Meta分析中的「敏感性分析」是什麼？
- A: A test of how sensitive patients were to the treatment / 對患者對治療敏感程度的測試
- B: ✅ Repeating the analysis while changing assumptions to see if the main finding holds up / 在改變假設的情況下重複分析，看主要發現是否成立
- C: Measuring how sensitive the search strategy was at finding studies / 衡量搜索策略在查找研究方面的敏感度
- D: A separate analysis only for statistically significant studies / 僅針對統計顯著研究的單獨分析
- Explanation: Sensitivity analysis tests robustness. If removing high-risk studies changes the pooled estimate dramatically, the conclusion is fragile. If the result stays stable, you can be more confident.
- Explanation_zh: 敏感性分析測試穩健性。如果刪除高風險研究會大幅改變合併估計值，則結論是脆弱的。如果結果保持穩定，你可以更有信心。

**BQ-05**
- Q: Your funnel plot looks asymmetrical, with small studies missing from the left side. Does this definitely mean publication bias?
- Q_zh: 你的漏斗圖看起來不對稱，左側缺少小型研究。這是否一定意味著發表偏倚？
- A: Yes — asymmetry always means publication bias / 是的——不對稱總是意味著發表偏倚
- B: ✅ No — asymmetry can also be caused by genuine heterogeneity, small-study effects, or chance / 不一定——不對稱也可能由真正的異質性、小研究效應或偶然因素造成
- C: Only if there are fewer than 10 studies / 只有在少於10項研究時才是
- D: Funnel plots cannot detect publication bias / 漏斗圖無法檢測發表偏倚
- Explanation: Funnel plot asymmetry is a warning sign, not proof. Other causes include true differences between small and large studies, lower quality in smaller studies, or random variation. Statistical tests like Egger's test can supplement visual assessment.
- Explanation_zh: 漏斗圖不對稱是一個警告信號，而非證據。其他原因包括大小研究之間的真實差異、小型研究的較低質量或隨機變異。Egger檢驗等統計檢驗可以補充視覺評估。

### Category 7: Interpretation — ⚪ Wisdom Egg / 智慧蛋

**IN-01**
- Q: A meta-analysis finds a statistically significant result (p = 0.03). Does this necessarily mean the finding is clinically important?
- Q_zh: 一項Meta分析發現統計學上顯著的結果（p = 0.03）。這是否一定意味著該發現具有臨床重要性？
- A: Yes — statistical significance always means clinical importance / 是的——統計顯著性總是意味著臨床重要性
- B: ✅ No — a result can be statistically significant but too small to matter in practice / 不——結果可以在統計學上顯著但太小以至於在實踐中無關緊要
- C: Only if the confidence interval is narrow / 只有在信賴區間窄的情況下
- D: Only if I² is below 50% / 只有在I²低於50%的情況下
- Explanation: With enough pooled data, even tiny effects become significant. A blood pressure reduction of 0.5 mmHg might be significant but meaningless clinically. Always look at the effect size and ask: "Is this difference large enough to matter?"
- Explanation_zh: 有足夠的匯集數據，即使是微小的效應也會變得顯著。血壓降低0.5 mmHg可能在統計學上顯著，但在臨床上毫無意義。始終關注效應量並問：「這個差異是否大到有意義？」

**IN-02**
- Q: What is the "ecological fallacy" in the context of meta-analysis?
- Q_zh: 在Meta分析的背景下，什麼是「生態學謬誤」？
- A: Using studies that harm the environment / 使用危害環境的研究
- B: ✅ Assuming that a relationship found at the study level applies to individual patients / 假設在研究層面發現的關係適用於個體患者
- C: Including animal studies in a human meta-analysis / 在人類Meta分析中包含動物研究
- D: Forgetting to include environmental factors in the analysis / 忘記在分析中包含環境因素
- Explanation: Meta-regression might show that studies with higher average age have bigger effects, but this does NOT mean older individuals within each study responded better. Study-level patterns don't necessarily reflect individual-level relationships.
- Explanation_zh: Meta回歸可能顯示平均年齡較高的研究有更大的效應，但這並不意味著每項研究中的老年個體反應更好。研究層面的模式不一定反映個體層面的關係。

**IN-03**
- Q: Your meta-analysis pools 12 RCTs and finds Drug X reduces mortality. Can you say Drug X "causes" lower mortality?
- Q_zh: 你的Meta分析匯集了12項RCT，發現藥物X降低了死亡率。你能說藥物X「導致」了更低的死亡率嗎？
- A: ✅ Yes — meta-analysis of RCTs provides the strongest evidence for causal claims / 是的——RCT的Meta分析為因果主張提供了最強的證據
- B: No — meta-analysis can never make causal claims / 不能——Meta分析永遠不能做出因果主張
- C: Only if every single study individually showed a significant result / 只有在每項研究都單獨顯示顯著結果時
- D: Only if I² is exactly 0% / 只有在I²恰好為0%時
- Explanation: When included studies are well-conducted RCTs (designed to establish causation through randomization), a meta-analysis provides strong causal evidence. This is why meta-analyses of RCTs sit at the top of the evidence hierarchy.
- Explanation_zh: 當納入的研究是設計良好的RCT（通過隨機化建立因果關係）時，Meta分析提供了強有力的因果證據。這就是為什麼RCT的Meta分析位於證據等級的頂端。

**IN-04**
- Q: A meta-analysis from 2015 included 8 studies and found no significant effect. Since then, 5 new large trials have been published. What should happen?
- Q_zh: 2015年的一項Meta分析包含8項研究，未發現顯著效應。此後，又發表了5項新的大型試驗。應該怎麼辦？
- A: The 2015 result stands — meta-analyses do not expire / 2015年的結果不變——Meta分析不會過期
- B: ✅ The meta-analysis should be updated to include the new evidence / Meta分析應該更新以包含新證據
- C: The new trials should be ignored unless they all agree / 除非新試驗都一致，否則應忽略
- D: Only update if the original authors agree / 只有在原作者同意時才更新
- Explanation: Meta-analyses are living summaries of evidence. As new studies appear, the pooled estimate may change — sometimes enough to reverse the conclusion. Regularly updated or "living" meta-analyses are increasingly recognized as best practice.
- Explanation_zh: Meta分析是證據的動態摘要。隨著新研究的出現，合併估計值可能改變——有時足以逆轉結論。定期更新或「活性」Meta分析越來越被認為是最佳實踐。

**IN-05**
- Q: Two meta-analyses on the same topic reach opposite conclusions. How is this possible?
- Q_zh: 兩項關於同一主題的Meta分析得出了相反的結論。這怎麼可能？
- A: One of them must have made a mathematical error / 其中一項一定犯了數學錯誤
- B: ✅ Differences in search dates, inclusion criteria, outcome definitions, or statistical models can lead to different results — both may be technically valid / 搜索日期、納入標準、結局定義或統計模型的差異可以導致不同結果——兩者在技術上可能都是有效的
- C: This is impossible if both followed PRISMA guidelines / 如果兩者都遵循了PRISMA指南，這是不可能的
- D: The one with more studies is automatically correct / 包含更多研究的那個自動正確
- Explanation: Meta-analyses involve many judgment calls: which databases, which studies, how to define outcomes, which model. These choices can lead to different pooled estimates. This is why registering your protocol in advance (e.g., on PROSPERO) is so important.
- Explanation_zh: Meta分析涉及許多判斷：哪些數據庫、哪些研究、如何定義結局、哪個模型。這些選擇可以導致不同的合併估計值。這就是為什麼提前註冊你的計畫書（例如在PROSPERO上）如此重要。

---

## Cheat Sheet Downloads (Reward Mapping)

| Egg | Cheat Sheet Name | Content Summary |
|-----|-----------------|-----------------|
| 🟢 Discovery | "What Is a Meta-Analysis?" | One-page visual explainer: SR vs MA, when to use, key vocabulary |
| 🔵 Data | "Data Extraction Pocket Guide" | What to extract, handling medians, zero events, conversion formulas |
| 🟡 Forest | "How to Read a Forest Plot" | Annotated diagram: CI lines, squares, diamond, no-effect line |
| 🔴 Variety | "Heterogeneity Cheat Sheet" | I², Q-test, fixed vs random, decision flowchart |
| 🟣 Search | "Search & Screening Guide" | Database tips, PICO, PRISMA flow diagram walkthrough |
| 🟠 Bias | "Bias Detective Card" | Funnel plot reading, risk of bias domains, sensitivity analysis |
| ⚪ Wisdom | "Interpretation Compass" | Clinical vs statistical significance, ecological fallacy, when to update |

### Bonus Tiers
- **3/5 eggs**: "Meta-Analysis Apprentice 🥉" — download cheat sheets for collected egg categories
- **4/5 eggs**: "Meta-Analysis Explorer 🥈" — download ALL cheat sheets
- **5/5 eggs**: "Meta-Analysis Master 🏆" — ALL cheat sheets + combined comprehensive 1-page PDF

For initial implementation, cheat sheet download buttons can link to placeholder anchors (`#cheatsheet-forest`, etc.) — the actual PDFs can be created later.

---

## UI/UX Notes for Implementation

- Match the existing card style: `borderRadius: 20, border: 1px solid ${LIGHT_BORDER}, boxShadow: "0 2px 20px rgba(0,0,0,0.04)"`
- Use the existing `FadeIn` component for entrance animations
- Egg crack animation: CSS keyframe, egg splits in half and question slides out
- Basket: simple grid of 5 circular slots, filled with colored eggs or shown as gray outlines
- Progress bar: 5 egg-shaped indicators instead of the current rectangular progress bars
- Keep the section label "Test Yourself" / "自測" or change to "Egg Hunt" / "彩蛋狩獵"
- The nav item can be updated from "Quiz" to "Egg Hunt" / "🥚 彩蛋"

---

## i18n Keys to Add

In addition to the 35 question keys (pattern: `eggQ_{id}`, `eggQ_{id}_A`, `eggQ_{id}_B`, etc.), add these UI keys in both `zh` and `en`:

```
eggHuntLabel: "Test Yourself" / "自測"
eggHuntTitle: "🥚 Easter Egg Hunt" / "🥚 復活節彩蛋狩獵"
eggHuntDesc: "Find 5 hidden eggs..." / "找到5個隱藏的彩蛋..."
eggHuntStart: "Start Hunt →" / "開始狩獵 →"
eggHuntProgress: "Egg X of 5" / "第X個蛋，共5個"
eggHuntCorrect: "🎉 You found the {eggName}!" / "🎉 你找到了{eggName}！"
eggHuntWrong: "💔 The egg cracked..." / "💔 蛋碎了……"
eggHuntNext: "Next Egg →" / "下一個蛋 →"
eggHuntResults: "See Your Basket →" / "查看你的籃子 →"
eggHuntBasketTitle: "Your Egg Basket" / "你的彩蛋籃"
eggHuntScore: "You found X out of 5 eggs!" / "你找到了X個蛋（共5個）！"
eggHuntMaster: "Meta-Analysis Master 🏆" / "Meta分析大師 🏆"
eggHuntExplorer: "Meta-Analysis Explorer 🥈" / "Meta分析探索者 🥈"
eggHuntApprentice: "Meta-Analysis Apprentice 🥉" / "Meta分析學徒 🥉"
eggHuntKeepTrying: "Keep exploring! 🔍" / "繼續探索！🔍"
eggHuntDownload: "Download Cheat Sheet" / "下載速查表"
eggHuntPlayAgain: "Hunt Again →" / "再玩一次 →"
eggCategoryNames: { discovery, data, forest, variety, search, bias, wisdom } in both languages
```

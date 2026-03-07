// ============================================================
// questionBank.js — Centralized Question Bank for All Courses
// ============================================================
// Structure: Each course has its own export with questions grouped
// by category. Each question is self-contained with bilingual text.
//
// Usage in component:
//   import { course1Questions, pickQuestions } from './questionBank';
//   const questions = pickQuestions(course1Questions, 7); // 7 random Qs
//   // or filter by category first:
//   const catQs = course1Questions.filter(q => q.category === 0);
//
// Adding a new course:
//   1. Add a new exported array (e.g., course2Questions)
//   2. Follow the same { id, category, zh: {...}, en: {...}, correct } shape
// ============================================================

// ── Helper: pick N random questions from a pool ──
export function pickQuestions(pool, n) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// Pick N questions with balanced category coverage
// Tries to pick evenly from each category, then fills remaining randomly
export function pickBalanced(pool, n, numCategories = 7) {
  const byCategory = {};
  pool.forEach(q => {
    if (!byCategory[q.category]) byCategory[q.category] = [];
    byCategory[q.category].push(q);
  });

  // Shuffle within each category
  Object.values(byCategory).forEach(arr => arr.sort(() => Math.random() - 0.5));

  const picked = [];
  let round = 0;
  while (picked.length < n) {
    let addedThisRound = false;
    for (let cat = 0; cat < numCategories && picked.length < n; cat++) {
      if (byCategory[cat] && byCategory[cat][round]) {
        picked.push(byCategory[cat][round]);
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break;
    round++;
  }

  // Final shuffle so categories aren't in order
  return picked.sort(() => Math.random() - 0.5);
}


// ============================================================
// COURSE 1: PICO / PICOS — 70 Questions (10 per category)
// ============================================================
// 7 categories (matching 7 egg colors):
//   0 = Identifying correct PICO format       (翠牙龍 Rex)
//   1 = Population — specificity & scope       (蒼瀾龍 Azure)
//   2 = Intervention — defining the treatment  (金翼龍 Zephyr)
//   3 = Comparison — choosing comparators      (焰角龍 Blaze)
//   4 = Outcome — measurable endpoints         (紫棘龍 Thistle)
//   5 = PICOS & Study design                   (珀爪龍 Velo)
//   6 = Common mistakes & pitfalls             (鐵穹龍 Dome)
// ============================================================

export const course1Categories = {
  zh: ["辨識 PICO 格式", "族群 (P)", "介入措施 (I)", "對照組 (C)", "結果指標 (O)", "PICOS 與研究設計 (S)", "常見錯誤與陷阱"],
  en: ["Identifying PICO Format", "Population (P)", "Intervention (I)", "Comparison (C)", "Outcome (O)", "PICOS & Study Design (S)", "Common Mistakes & Pitfalls"],
};

export const course1Questions = [

  // ════════════════════════════════════════
  // Category 0: Identifying correct PICO format (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-001", category: 0,
    zh: {
      q: "以下哪個是正確的 PICO 格式研究問題？",
      opts: ["糖尿病藥物有效嗎？", "在第二型糖尿病成人中，Metformin 相比安慰劑能否降低 HbA1c？", "Metformin 是最好的藥嗎？", "糖尿病患者應該吃什麼藥？"],
      exp: "選項 B 清楚包含了 P（第二型糖尿病成人）、I（Metformin）、C（安慰劑）和 O（HbA1c 降低），是標準的 PICO 格式。",
    },
    en: {
      q: "Which is a properly formatted PICO research question?",
      opts: ["Do diabetes drugs work?", "In adults with T2DM, does Metformin vs placebo reduce HbA1c?", "Is Metformin the best drug?", "What should diabetes patients take?"],
      exp: "Option B clearly contains P (adults with T2DM), I (Metformin), C (placebo), and O (HbA1c reduction) — a standard PICO format.",
    },
    correct: 1,
  },
  {
    id: "c1-002", category: 0,
    zh: {
      q: "哪一個研究問題最符合 PICO 框架？",
      opts: ["Statin 類藥物安全嗎？", "在高血脂成人中，Atorvastatin 40mg 相比 Rosuvastatin 20mg 在 12 週後降低 LDL-C 的效果如何？", "膽固醇藥有哪些副作用？", "高血脂要不要吃藥？"],
      exp: "選項 B 明確定義了 P（高血脂成人）、I（Atorvastatin 40mg）、C（Rosuvastatin 20mg）、O（12 週後 LDL-C 變化），完整且具體。",
    },
    en: {
      q: "Which research question best follows the PICO framework?",
      opts: ["Are statins safe?", "In adults with hyperlipidemia, does Atorvastatin 40mg vs Rosuvastatin 20mg reduce LDL-C at 12 weeks?", "What are the side effects of cholesterol drugs?", "Should people with high cholesterol take medication?"],
      exp: "Option B clearly defines P (adults with hyperlipidemia), I (Atorvastatin 40mg), C (Rosuvastatin 20mg), O (LDL-C change at 12 weeks).",
    },
    correct: 1,
  },
  {
    id: "c1-003", category: 0,
    zh: {
      q: "以下哪個問題缺少 PICO 的關鍵元素？",
      opts: ["在 COPD 患者中，Tiotropium 相比 Salmeterol 降低急性惡化的頻率如何？", "抗生素能治肺炎嗎？", "在社區型肺炎成人中，Amoxicillin 相比 Azithromycin 的臨床治癒率有何差異？", "在氣喘兒童中，ICS 相比 LTRA 對 FEV1 的改善效果如何？"],
      exp: "「抗生素能治肺炎嗎？」沒有明確的 P（哪種肺炎？哪些病人？）、沒有具體的 I（哪種抗生素？）、沒有 C、O 也不具體。",
    },
    en: {
      q: "Which question is missing key PICO elements?",
      opts: ["In COPD patients, does Tiotropium vs Salmeterol reduce exacerbation frequency?", "Can antibiotics treat pneumonia?", "In adults with CAP, does Amoxicillin vs Azithromycin differ in clinical cure rate?", "In children with asthma, does ICS vs LTRA improve FEV1?"],
      exp: "'Can antibiotics treat pneumonia?' lacks a specific P (which pneumonia? which patients?), specific I (which antibiotic?), C, and measurable O.",
    },
    correct: 1,
  },
  {
    id: "c1-004", category: 0,
    zh: {
      q: "下列哪個研究問題的 PICO 四要素最完整？",
      opts: ["免疫療法對癌症有用嗎？", "運動對老年人有什麼好處？", "在 65 歲以上社區老年人中，每週 3 次有氧運動相比常規活動，6 個月後跌倒發生率是否降低？", "新冠疫苗有效嗎？"],
      exp: "選項 C 精確定義了 P（65 歲以上社區老年人）、I（每週 3 次有氧運動）、C（常規活動）、O（6 個月後跌倒發生率）。",
    },
    en: {
      q: "Which research question has the most complete PICO elements?",
      opts: ["Does immunotherapy work for cancer?", "What are the benefits of exercise for elderly?", "In community-dwelling adults ≥65y, does aerobic exercise 3x/week vs usual activity reduce fall incidence at 6 months?", "Are COVID vaccines effective?"],
      exp: "Option C precisely defines P (community-dwelling adults ≥65y), I (aerobic exercise 3x/week), C (usual activity), O (fall incidence at 6 months).",
    },
    correct: 2,
  },
  {
    id: "c1-005", category: 0,
    zh: {
      q: "以下哪個問題的格式最適合進行系統性回顧？",
      opts: ["降血壓藥物的最新進展是什麼？", "在未控制的高血壓成人中，ARB 相比 ACEi 在 24 週後降低收縮壓的幅度有何差異？", "高血壓患者吃什麼藥比較好？", "哪種降壓藥副作用最少？"],
      exp: "選項 B 有明確的 PICO：P（未控制的高血壓成人）、I（ARB）、C（ACEi）、O（24 週後收縮壓變化），適合作為系統性回顧的問題。",
    },
    en: {
      q: "Which question format is most suitable for a systematic review?",
      opts: ["What are the latest advances in antihypertensives?", "In adults with uncontrolled HTN, do ARBs vs ACEi differ in SBP reduction at 24 weeks?", "Which BP medication is better?", "Which antihypertensive has the fewest side effects?"],
      exp: "Option B has clear PICO: P (adults with uncontrolled HTN), I (ARB), C (ACEi), O (SBP change at 24 weeks) — suitable for systematic review.",
    },
    correct: 1,
  },
  {
    id: "c1-006", category: 0,
    zh: {
      q: "下列哪個問題有完整的 PICO 但研究範圍可能太窄？",
      opts: ["藥物治療對癌症有效嗎？", "在台大醫院 2023 年收治的 HFrEF 成人中，Dapagliflozin 相比安慰劑降低住院率如何？", "在 HFrEF 成人中，SGLT2i 相比安慰劑降低住院率如何？", "心臟衰竭要怎麼治？"],
      exp: "選項 B 雖然 PICO 完整，但限定「台大醫院 2023 年」使得搜尋範圍過窄，幾乎無法找到足夠研究做統合分析。",
    },
    en: {
      q: "Which question has complete PICO but may be too narrow?",
      opts: ["Does drug therapy work for cancer?", "In HFrEF adults admitted to NTUH in 2023, does Dapagliflozin vs placebo reduce hospitalization?", "In HFrEF adults, does SGLT2i vs placebo reduce hospitalization?", "How do we treat heart failure?"],
      exp: "Option B has full PICO but restricting to one hospital in one year makes it too narrow for a meta-analysis.",
    },
    correct: 1,
  },
  {
    id: "c1-007", category: 0,
    zh: {
      q: "哪一個研究問題最能幫助你制定搜尋策略？",
      opts: ["Warfarin 好不好用？", "血栓治療有什麼新進展？", "在非瓣膜性心房顫動成人中，DOAC 相比 Warfarin 對中風和重大出血發生率的影響如何？", "抗凝血劑的種類有哪些？"],
      exp: "選項 C 的 PICO 明確，每個元素都可以直接轉換為搜尋關鍵詞：P→AF, I→DOAC, C→Warfarin, O→stroke/bleeding。",
    },
    en: {
      q: "Which research question best supports developing a search strategy?",
      opts: ["Is Warfarin any good?", "What's new in thrombosis treatment?", "In adults with non-valvular AF, do DOACs vs Warfarin differ in stroke and major bleeding rates?", "What types of anticoagulants exist?"],
      exp: "Option C has clear PICO that directly maps to search terms: P→AF, I→DOAC, C→Warfarin, O→stroke/bleeding.",
    },
    correct: 2,
  },
  {
    id: "c1-008", category: 0,
    zh: {
      q: "以下哪個問題雖然看起來像 PICO 格式，但 Outcome 不夠具體？",
      opts: ["在 T2DM 成人中，GLP-1 RA 相比安慰劑改善血糖控制的效果如何？", "在 T2DM 成人中，Semaglutide 相比安慰劑在 26 週後降低 HbA1c 的幅度？", "在高血壓成人中，Amlodipine 相比安慰劑在 12 週後降低 SBP 的幅度？", "在 CKD 成人中，Finerenone 相比安慰劑在 2 年後的 eGFR 斜率變化？"],
      exp: "「改善血糖控制」太籠統——是 HbA1c？空腹血糖？餐後血糖？什麼時間點？其他選項都有具體量測指標和時間點。",
    },
    en: {
      q: "Which question looks like PICO but has an insufficiently specific Outcome?",
      opts: ["In T2DM adults, does GLP-1 RA vs placebo improve glycemic control?", "In T2DM adults, does Semaglutide vs placebo reduce HbA1c at 26 weeks?", "In HTN adults, does Amlodipine vs placebo reduce SBP at 12 weeks?", "In CKD adults, does Finerenone vs placebo change eGFR slope at 2 years?"],
      exp: "'Improve glycemic control' is vague — HbA1c? fasting glucose? postprandial? what timepoint? The other options specify exact measures and timepoints.",
    },
    correct: 0,
  },
  {
    id: "c1-009", category: 0,
    zh: {
      q: "在以下研究問題中，哪個的 I 和 C 定義最不清楚？",
      opts: ["在重症成人中，延長輸注 (≥3h) 相比 30 分鐘 bolus β-lactam 對院內死亡率的影響？", "在 COPD 患者中，新型藥物相比傳統藥物對急性惡化頻率的影響？", "在 HFrEF 成人中，Dapagliflozin 10mg 相比安慰劑對心血管死亡的影響？", "在 MDD 患者中，Escitalopram 10-20mg 相比安慰劑對 HAM-D 分數的影響？"],
      exp: "「新型藥物」和「傳統藥物」都沒有具體指明是哪些藥，無法據此制定搜尋策略或篩選文獻。",
    },
    en: {
      q: "Which question has the least clear I and C definitions?",
      opts: ["In critically ill adults, prolonged (≥3h) vs 30-min bolus β-lactam on in-hospital mortality?", "In COPD patients, novel drugs vs traditional drugs on exacerbation frequency?", "In HFrEF adults, Dapagliflozin 10mg vs placebo on CV death?", "In MDD patients, Escitalopram 10-20mg vs placebo on HAM-D scores?"],
      exp: "'Novel drugs' and 'traditional drugs' don't specify which drugs — you can't build a search strategy or screen studies from this.",
    },
    correct: 1,
  },
  {
    id: "c1-010", category: 0,
    zh: {
      q: "你的同事問你：「我想研究維生素 D 對骨質疏鬆的效果」。為了轉化為 PICO，你最先建議他釐清什麼？",
      opts: ["該用哪個統計軟體", "P、I、C、O 各自的具體定義——哪些病人、什麼劑量、跟什麼比較、量什麼指標", "要發表在哪個期刊", "要引用多少篇文獻"],
      exp: "將模糊的臨床問題轉化為 PICO 的第一步就是具體化每個元素，才能進行有效的文獻搜尋。",
    },
    en: {
      q: "A colleague says: 'I want to study vitamin D for osteoporosis.' To convert this to PICO, what should they clarify first?",
      opts: ["Which statistical software to use", "Specific definitions for P, I, C, O — which patients, what dose, compared to what, measuring what", "Which journal to submit to", "How many references to cite"],
      exp: "The first step in converting a vague clinical question to PICO is specifying each element for effective literature searching.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 1: Population (P) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-011", category: 1,
    zh: {
      q: "你正在研究「延長輸注 β-lactam 抗生素對重症患者的效果」。以下哪個 Population 定義最恰當？",
      opts: ["所有接受抗生素的患者", "加護病房中接受 β-lactam 抗生素治療的重症成人患者", "住院的患者", "有感染症狀的人"],
      exp: "選項 B 精確定義了場域（ICU）、藥物類別（β-lactam）、嚴重度（重症）和年齡（成人）。其他選項太廣泛。",
    },
    en: {
      q: "For 'prolonged β-lactam infusion in critically ill patients,' which Population is most appropriate?",
      opts: ["All patients receiving antibiotics", "Critically ill adults in ICU receiving β-lactam antibiotics", "Hospitalized patients", "People with infection symptoms"],
      exp: "Option B precisely defines setting (ICU), drug class (β-lactam), severity (critically ill), and age (adults). Others are too broad.",
    },
    correct: 1,
  },
  {
    id: "c1-012", category: 1,
    zh: {
      q: "研究「SGLT2 抑制劑對心衰竭的效果」，以下哪個 P 定義最恰當？",
      opts: ["所有心臟病患者", "射出分率降低的心衰竭 (HFrEF) 成年患者，NYHA class II-IV", "有心血管風險因子的人", "65歲以上老年人"],
      exp: "HFrEF + NYHA class 精確限定了心衰竭類型和嚴重度分級，避免納入不相關的心臟病患者。",
    },
    en: {
      q: "For 'SGLT2 inhibitors in heart failure,' which P is most appropriate?",
      opts: ["All heart disease patients", "Adults with HFrEF, NYHA class II-IV", "People with cardiovascular risk factors", "Adults over 65"],
      exp: "HFrEF + NYHA class precisely limits the HF type and severity, avoiding irrelevant cardiac patients.",
    },
    correct: 1,
  },
  {
    id: "c1-013", category: 1,
    zh: {
      q: "以下哪個 Population 定義過於廣泛，不適合做統合分析？",
      opts: ["第二型糖尿病且 HbA1c > 7% 的成人", "所有患者", "中度至重度阿茲海默症的老年患者 (≥60歲)", "12-17 歲診斷為注意力不足過動症的青少年"],
      exp: "「所有患者」沒有指定任何疾病、年齡或特徵，導致搜尋結果過多且研究之間異質性極大。",
    },
    en: {
      q: "Which Population definition is too broad for a meta-analysis?",
      opts: ["Adults with T2DM and HbA1c > 7%", "All patients", "Elderly (≥60y) with moderate-to-severe Alzheimer's", "Adolescents 12-17y diagnosed with ADHD"],
      exp: "'All patients' specifies no disease, age, or characteristics, yielding excessive, heterogeneous results.",
    },
    correct: 1,
  },
  {
    id: "c1-014", category: 1,
    zh: {
      q: "在研究「Finerenone 對慢性腎臟病的效果」時，以下哪個 P 最合適？",
      opts: ["所有腎臟病患者", "有蛋白尿的人", "合併第二型糖尿病的 CKD 成人，eGFR 25-90 且 UACR ≥ 30 mg/g", "洗腎患者"],
      exp: "選項 C 精確限定了 CKD 合併 T2DM、具體 eGFR 和 UACR 範圍，與 FIDELIO/FIGARO 試驗的納入條件一致。",
    },
    en: {
      q: "For 'Finerenone in CKD,' which Population is most appropriate?",
      opts: ["All kidney disease patients", "People with proteinuria", "Adults with CKD and T2DM, eGFR 25-90, UACR ≥ 30 mg/g", "Dialysis patients"],
      exp: "Option C precisely limits to CKD with T2DM, specific eGFR and UACR ranges, matching FIDELIO/FIGARO trial criteria.",
    },
    correct: 2,
  },
  {
    id: "c1-015", category: 1,
    zh: {
      q: "在定義 Population 時，以下哪個做法是正確的？",
      opts: ["越廣泛越好，這樣能找到更多研究", "應指定疾病、年齡、嚴重度等關鍵特徵", "不需要考慮排除條件", "只需要寫疾病名稱即可"],
      exp: "好的 P 應該明確指定關鍵特徵，讓搜尋結果聚焦且研究之間具有可比性。太廣泛會增加異質性。",
    },
    en: {
      q: "Which approach to defining Population is correct?",
      opts: ["Broader is better — you'll find more studies", "Specify key characteristics: disease, age, severity", "Exclusion criteria aren't needed", "Just the disease name is sufficient"],
      exp: "A good P specifies key characteristics for focused, comparable results. Too broad increases heterogeneity.",
    },
    correct: 1,
  },
  {
    id: "c1-016", category: 1,
    zh: {
      q: "你想做一個關於「抗凝血劑預防中風」的統合分析。以下哪個 P 最適合？",
      opts: ["所有中風患者", "有中風風險的人", "非瓣膜性心房顫動 (NVAF) 且 CHA₂DS₂-VASc ≥ 2 的成人", "心律不整患者"],
      exp: "選項 C 精確限定了心房顫動類型（非瓣膜性）和中風風險（CHA₂DS₂-VASc 分數），確保研究之間的可比性。",
    },
    en: {
      q: "For a meta-analysis on 'anticoagulants for stroke prevention,' which P is best?",
      opts: ["All stroke patients", "People at risk of stroke", "Adults with NVAF and CHA₂DS₂-VASc ≥ 2", "Patients with arrhythmia"],
      exp: "Option C specifies AF type (non-valvular) and stroke risk score (CHA₂DS₂-VASc), ensuring comparability across studies.",
    },
    correct: 2,
  },
  {
    id: "c1-017", category: 1,
    zh: {
      q: "以下哪個 P 定義包含了適當的排除條件？",
      opts: ["所有糖尿病患者", "T2DM 成人，排除 eGFR < 30、懷孕及正在接受胰島素治療者", "糖尿病且身體不好的人", "住院的糖尿病患者"],
      exp: "選項 B 不僅定義了納入條件（T2DM 成人），還明確列出排除條件（腎功能不全、懷孕、已用胰島素），確保族群同質性。",
    },
    en: {
      q: "Which P definition includes appropriate exclusion criteria?",
      opts: ["All diabetes patients", "Adults with T2DM, excluding eGFR < 30, pregnancy, and current insulin use", "Diabetes patients who are unwell", "Hospitalized diabetes patients"],
      exp: "Option B defines inclusion (T2DM adults) AND exclusion criteria (renal impairment, pregnancy, insulin use), ensuring homogeneity.",
    },
    correct: 1,
  },
  {
    id: "c1-018", category: 1,
    zh: {
      q: "為什麼在 P 中指定「成人」或「兒童」很重要？",
      opts: ["只是格式要求，沒有實質意義", "因為兒童和成人的藥物動力學、劑量和結局可能不同，混合會增加異質性", "因為期刊審稿要求", "為了讓字數更多"],
      exp: "兒童和成人在藥物代謝、適應症、劑量和預後方面往往不同，混合分析會增加異質性並使結果難以解讀。",
    },
    en: {
      q: "Why is specifying 'adults' or 'children' important in P?",
      opts: ["Just a formatting requirement", "Because children and adults differ in pharmacokinetics, dosing, and outcomes — mixing increases heterogeneity", "Journal reviewers require it", "To increase word count"],
      exp: "Children and adults often differ in drug metabolism, indications, dosing, and prognosis. Mixing them increases heterogeneity.",
    },
    correct: 1,
  },
  {
    id: "c1-019", category: 1,
    zh: {
      q: "你想研究「PPI 對胃食道逆流的效果」。以下哪個 P 在廣度與精確度之間取得最好的平衡？",
      opts: ["所有消化道疾病患者", "有症狀的胃食道逆流疾病 (GERD) 成人（非手術候選人）", "胃不舒服的人", "確診有食道糜爛的 GERD 患者"],
      exp: "選項 B 限定了疾病（GERD）、症狀（有症狀的）、年齡（成人）和排除（非手術），夠精確但不至於太窄。",
    },
    en: {
      q: "For 'PPIs for GERD,' which P best balances breadth and precision?",
      opts: ["All GI disease patients", "Symptomatic adults with GERD (non-surgical candidates)", "People with stomach discomfort", "GERD patients with confirmed erosive esophagitis"],
      exp: "Option B specifies disease (GERD), symptoms (symptomatic), age (adults), and exclusion (non-surgical) — precise but not too narrow.",
    },
    correct: 1,
  },
  {
    id: "c1-020", category: 1,
    zh: {
      q: "研究「Palbociclib 對乳癌的效果」，以下哪個 P 最精確？",
      opts: ["所有乳癌患者", "所有女性癌症患者", "HR+/HER2− 晚期或轉移性乳癌的停經後女性", "接受化療的乳癌患者"],
      exp: "選項 C 限定了生物標記（HR+/HER2−）、疾病階段（晚期/轉移性）和族群特徵（停經後），與 PALOMA 試驗的納入條件一致。",
    },
    en: {
      q: "For 'Palbociclib in breast cancer,' which P is most precise?",
      opts: ["All breast cancer patients", "All female cancer patients", "Postmenopausal women with HR+/HER2− advanced or metastatic breast cancer", "Breast cancer patients receiving chemotherapy"],
      exp: "Option C specifies biomarkers (HR+/HER2−), stage (advanced/metastatic), and demographics (postmenopausal), matching PALOMA trial criteria.",
    },
    correct: 2,
  },

  // ════════════════════════════════════════
  // Category 2: Intervention (I) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-021", category: 2,
    zh: {
      q: "研究延長輸注 β-lactam 抗生素的效果，以下哪個 I 定義最精確？",
      opts: ["抗生素治療", "延長輸注 (≥3小時持續輸注或間歇延長輸注)", "高劑量抗生素", "持續靜脈輸注"],
      exp: "選項 B 明確定義了給藥方式（≥3 小時持續或間歇延長輸注），比其他選項更精確、可重複驗證。",
    },
    en: {
      q: "For prolonged β-lactam infusion, which Intervention definition is most precise?",
      opts: ["Antibiotic therapy", "Prolonged infusion (≥3h continuous or extended intermittent infusion)", "High-dose antibiotics", "Continuous IV infusion"],
      exp: "Option B clearly defines the administration method (≥3h continuous or extended intermittent), more precise and reproducible.",
    },
    correct: 1,
  },
  {
    id: "c1-022", category: 2,
    zh: {
      q: "以下哪個 Intervention 定義最具體？",
      opts: ["給予降血糖藥物", "Empagliflozin 10mg 每日一次，合併標準治療", "使用新型藥物", "口服藥物治療"],
      exp: "選項 B 包含了藥名、劑量、頻率及合併治療，是最完整的介入措施定義。",
    },
    en: {
      q: "Which Intervention definition is most specific?",
      opts: ["Give glucose-lowering drugs", "Empagliflozin 10mg once daily plus standard therapy", "Use novel agents", "Oral medication therapy"],
      exp: "Option B includes drug name, dose, frequency, and concomitant therapy — the most complete intervention definition.",
    },
    correct: 1,
  },
  {
    id: "c1-023", category: 2,
    zh: {
      q: "在定義 Intervention 時，以下哪個資訊最不需要？",
      opts: ["藥物名稱和劑量", "給藥途徑和頻率", "藥物的發明歷史", "治療持續時間"],
      exp: "藥物的發明歷史與臨床問題無關。I 應包含藥名、劑量、途徑、頻率和持續時間等臨床相關資訊。",
    },
    en: {
      q: "When defining Intervention, which information is least necessary?",
      opts: ["Drug name and dose", "Route and frequency of administration", "History of the drug's invention", "Duration of treatment"],
      exp: "The drug's invention history is clinically irrelevant. I should include name, dose, route, frequency, and duration.",
    },
    correct: 2,
  },
  {
    id: "c1-024", category: 2,
    zh: {
      q: "研究 CBT 治療憂鬱症，以下哪個 I 定義最合適？",
      opts: ["心理治療", "認知行為治療 (CBT)，每週 1 次，持續 12-16 週", "諮商", "CBT 加上藥物"],
      exp: "選項 B 明確指定了治療類型（CBT）、頻率（每週 1 次）和持續時間（12-16 週），具備可重現性。",
    },
    en: {
      q: "For studying CBT in depression, which Intervention is most appropriate?",
      opts: ["Psychotherapy", "CBT, weekly sessions for 12-16 weeks", "Counseling", "CBT plus medication"],
      exp: "Option B specifies the therapy type (CBT), frequency (weekly), and duration (12-16 weeks) for reproducibility.",
    },
    correct: 1,
  },
  {
    id: "c1-025", category: 2,
    zh: {
      q: "以下哪個情境中，I 和 C 可以是同一種藥物？",
      opts: ["比較兩種完全不同的藥物", "比較同一藥物的高劑量 vs 低劑量", "比較藥物 vs 安慰劑", "比較藥物 vs 不治療"],
      exp: "同一藥物的不同劑量比較（如 Atorvastatin 80mg vs 20mg）是合法的 PICO，I 和 C 可以是同一種藥物。",
    },
    en: {
      q: "In which scenario can I and C be the same drug?",
      opts: ["Comparing two completely different drugs", "Comparing high-dose vs low-dose of the same drug", "Comparing drug vs placebo", "Comparing drug vs no treatment"],
      exp: "Dose comparison (e.g., Atorvastatin 80mg vs 20mg) is a valid PICO where I and C are the same drug.",
    },
    correct: 1,
  },
  {
    id: "c1-026", category: 2,
    zh: {
      q: "研究「GLP-1 受體促效劑對體重的效果」，以下哪個 I 最合適？",
      opts: ["減重藥物", "Semaglutide 2.4mg 每週一次皮下注射，持續 68 週", "GLP-1 類藥物", "注射型降血糖藥"],
      exp: "選項 B 指明了藥名、劑量、頻率、給藥途徑和持續時間，是最可操作的介入定義。",
    },
    en: {
      q: "For 'GLP-1 RA on body weight,' which I is most appropriate?",
      opts: ["Weight-loss drugs", "Semaglutide 2.4mg subcutaneous injection weekly for 68 weeks", "GLP-1 class drugs", "Injectable glucose-lowering agents"],
      exp: "Option B specifies drug name, dose, frequency, route, and duration — the most actionable intervention definition.",
    },
    correct: 1,
  },
  {
    id: "c1-027", category: 2,
    zh: {
      q: "以下哪個 I 定義的問題在於「太廣泛」？",
      opts: ["Metformin 500mg BID", "降血糖藥物", "Liraglutide 1.8mg 每日皮下注射", "Dapagliflozin 10mg QD 加上標準治療"],
      exp: "「降血糖藥物」涵蓋了數十種不同機制的藥物（Metformin、SU、DPP-4i、SGLT2i、GLP-1 RA 等），太廣泛無法搜尋。",
    },
    en: {
      q: "Which Intervention definition is problematic because it's too broad?",
      opts: ["Metformin 500mg BID", "Glucose-lowering drugs", "Liraglutide 1.8mg daily SC injection", "Dapagliflozin 10mg QD plus standard therapy"],
      exp: "'Glucose-lowering drugs' covers dozens of different drug classes (Metformin, SU, DPP-4i, SGLT2i, GLP-1 RA, etc.) — far too broad for searching.",
    },
    correct: 1,
  },
  {
    id: "c1-028", category: 2,
    zh: {
      q: "非藥物介入也可以作為 PICO 的 I。以下哪個非藥物 I 定義最好？",
      opts: ["運動", "多動一點", "結構化有氧運動計畫：每週 3 次、每次 45 分鐘中等強度、持續 12 週", "健康的生活方式"],
      exp: "選項 C 明確定義了運動類型、頻率、強度、持續時間，是可重複的非藥物介入定義。",
    },
    en: {
      q: "Non-drug interventions can also be PICO's I. Which is best defined?",
      opts: ["Exercise", "Move more", "Structured aerobic exercise: 3x/week, 45 min moderate intensity, for 12 weeks", "Healthy lifestyle"],
      exp: "Option C specifies exercise type, frequency, intensity, and duration — a reproducible non-drug intervention definition.",
    },
    correct: 2,
  },
  {
    id: "c1-029", category: 2,
    zh: {
      q: "當 I 是複合介入（如藥物＋衛教），你應該怎麼在 PICO 中處理？",
      opts: ["只寫其中一個，太複雜的話省略另一個", "明確列出所有介入組成要素及其執行細節", "不需要寫得太詳細", "把不同介入分開做成兩個不同的 PICO"],
      exp: "複合介入應完整描述所有組成要素。讀者需要知道「藥物＋衛教」的具體內容才能重複驗證或搜尋相關文獻。",
    },
    en: {
      q: "When I is a complex intervention (e.g., drug + education), how should you handle it in PICO?",
      opts: ["Only write one component, omit the other", "Clearly list all intervention components and their implementation details", "Don't need too much detail", "Split into two separate PICOs"],
      exp: "Complex interventions should fully describe all components. Readers need specifics to replicate or search for related literature.",
    },
    correct: 1,
  },
  {
    id: "c1-030", category: 2,
    zh: {
      q: "以下哪個 I 定義犯了「混淆介入與結果」的錯誤？",
      opts: ["Dapagliflozin 10mg QD", "降低血壓的治療", "Amlodipine 5mg QD", "CBT 每週 1 次持續 16 週"],
      exp: "「降低血壓的治療」把想要達成的結果（降低血壓）混進了介入定義中。I 應該描述你做什麼，而不是你希望達到什麼。",
    },
    en: {
      q: "Which I definition makes the mistake of 'confusing intervention with outcome'?",
      opts: ["Dapagliflozin 10mg QD", "Blood pressure-lowering treatment", "Amlodipine 5mg QD", "CBT weekly for 16 weeks"],
      exp: "'Blood pressure-lowering treatment' embeds the desired outcome (lowering BP) into the intervention. I should describe what you DO, not what you hope to ACHIEVE.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 3: Comparison (C) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-031", category: 3,
    zh: {
      q: "在 PICO 中，「C」代表什麼？為什麼它很重要？",
      opts: ["Conclusion（結論）— 統合分析的最終結果", "Comparison（對照組）— 沒有對照就無法判斷因果關係", "Category（分類）— 用來分類不同的研究", "Criteria（標準）— 納入研究的條件"],
      exp: "C 是 Comparison（對照組），它是因果推論的核心。沒有明確的對照組，你無法判斷效果是真實的還是自然發生的。",
    },
    en: {
      q: "What does 'C' in PICO stand for, and why is it important?",
      opts: ["Conclusion — the final result", "Comparison — without it, you can't establish causation", "Category — used to classify studies", "Criteria — conditions for inclusion"],
      exp: "C stands for Comparison. It's the core of causal inference. Without a comparator, you can't tell if the effect is real or natural.",
    },
    correct: 1,
  },
  {
    id: "c1-032", category: 3,
    zh: {
      q: "研究延長輸注抗生素的效果，以下哪個 C 最合適？",
      opts: ["口服抗生素", "不使用抗生素", "傳統間歇輸注 (30分鐘 bolus)", "其他類型抗生素"],
      exp: "既然 I 是延長輸注，最直接的對照就是傳統給藥方式（30 分鐘 bolus），這樣才能比較給藥時間的影響。",
    },
    en: {
      q: "For studying prolonged antibiotic infusion, which Comparison is most appropriate?",
      opts: ["Oral antibiotics", "No antibiotics", "Conventional intermittent infusion (30-min bolus)", "Different antibiotic class"],
      exp: "Since I is prolonged infusion, the direct comparator is conventional administration (30-min bolus) to isolate the effect of infusion time.",
    },
    correct: 2,
  },
  {
    id: "c1-033", category: 3,
    zh: {
      q: "以下哪種對照組設計會讓研究結果最難解讀？",
      opts: ["安慰劑對照", "積極藥物對照 (active comparator)", "標準治療對照", "不設定任何對照組"],
      exp: "完全沒有對照組就無法判斷療效是來自介入措施、安慰劑效應，還是疾病的自然進程。",
    },
    en: {
      q: "Which comparator design makes results hardest to interpret?",
      opts: ["Placebo control", "Active drug comparator", "Standard-of-care control", "No comparator at all"],
      exp: "Without any comparator, you can't distinguish treatment effect from placebo effect or natural disease progression.",
    },
    correct: 3,
  },
  {
    id: "c1-034", category: 3,
    zh: {
      q: "研究 SGLT2 抑制劑治療心衰竭，以下哪個 C 設計最常見？",
      opts: ["不治療", "其他心衰竭藥物", "安慰劑加上標準治療", "健康對照組"],
      exp: "「安慰劑＋標準治療」是心衰竭試驗中最常用的對照設計，既符合倫理（不剝奪標準治療），又能評估新藥的額外效果。",
    },
    en: {
      q: "For SGLT2 inhibitors in HF, which is the most common Comparison design?",
      opts: ["No treatment", "Other HF drugs", "Placebo plus standard therapy", "Healthy controls"],
      exp: "'Placebo + standard therapy' is most common in HF trials — it's ethical (doesn't withhold care) and isolates the added benefit.",
    },
    correct: 2,
  },
  {
    id: "c1-035", category: 3,
    zh: {
      q: "什麼時候選擇「積極對照」(active comparator) 比安慰劑對照更合適？",
      opts: ["當研究經費不足時", "當已有公認有效的標準治療，使用安慰劑不符合倫理時", "當研究者想讓結果看起來更好時", "當樣本量太小時"],
      exp: "如果已有公認有效治療（如抗生素治療細菌性腦膜炎），使用安慰劑會剝奪病人有效治療，不符合倫理。此時應用積極對照。",
    },
    en: {
      q: "When is an active comparator more appropriate than placebo?",
      opts: ["When funding is limited", "When an established effective treatment exists, making placebo unethical", "When researchers want better-looking results", "When sample size is too small"],
      exp: "If an established treatment exists (e.g., antibiotics for bacterial meningitis), using placebo denies effective care — unethical. Use an active comparator.",
    },
    correct: 1,
  },
  {
    id: "c1-036", category: 3,
    zh: {
      q: "以下哪個 C 的定義最有問題？",
      opts: ["安慰劑（外觀與介入組相同的惰性膠囊）", "常規照護", "沒有", "Metformin 500mg BID"],
      exp: "「沒有」不是一個有效的對照。即使是觀察「不做任何事」的效果，也應該說明是「等待名單對照」或「不額外介入的標準照護」。",
    },
    en: {
      q: "Which C definition is most problematic?",
      opts: ["Placebo (inert capsule matching intervention appearance)", "Usual care", "None", "Metformin 500mg BID"],
      exp: "'None' is not a valid comparator. Even if studying 'no intervention,' specify 'wait-list control' or 'standard care without added intervention.'",
    },
    correct: 2,
  },
  {
    id: "c1-037", category: 3,
    zh: {
      q: "在統合分析中，如果不同研究用了不同的對照組（有的用安慰劑、有的用積極對照），應該怎麼處理？",
      opts: ["全部混在一起分析沒關係", "應做次群組分析，分別分析安慰劑對照和積極對照的研究", "只選其中一種對照的研究", "放棄這個統合分析"],
      exp: "不同對照組會影響效果估計值。分成次群組分析可以避免因混合不同對照而引入偏差。",
    },
    en: {
      q: "In a meta-analysis, if studies used different comparators (some placebo, some active), what should you do?",
      opts: ["Mix them all together — it's fine", "Conduct subgroup analyses separating placebo-controlled and active-controlled studies", "Only include one type of comparator", "Abandon the meta-analysis"],
      exp: "Different comparators affect effect estimates. Subgroup analysis avoids bias from mixing different control conditions.",
    },
    correct: 1,
  },
  {
    id: "c1-038", category: 3,
    zh: {
      q: "為什麼「標準治療」(standard of care) 作為 C 時需要特別定義？",
      opts: ["因為標準治療在不同國家、不同時期可能不同，需要說明具體內容", "不需要定義，大家都知道", "因為標準治療永遠不變", "只有在 RCT 中才需要定義"],
      exp: "「標準治療」可能因國家、年代、指引版本而異。必須說明包含哪些具體藥物或措施，否則不同研究之間無法比較。",
    },
    en: {
      q: "Why does 'standard of care' as C need specific definition?",
      opts: ["Because standard care varies by country and era — specify the exact components", "No need to define, everyone knows", "Because standard care never changes", "Only needed in RCTs"],
      exp: "'Standard of care' varies by country, era, and guidelines. Must specify exact drugs/measures, otherwise studies aren't comparable.",
    },
    correct: 0,
  },
  {
    id: "c1-039", category: 3,
    zh: {
      q: "在非劣性試驗 (non-inferiority trial) 中，C 通常是什麼？",
      opts: ["安慰劑", "積極對照（目前公認的最佳治療）", "不治療", "歷史對照"],
      exp: "非劣性試驗的目的是證明新療法「不比現有最佳療法差」，因此 C 必須是目前的標準治療或最佳可用療法。",
    },
    en: {
      q: "In a non-inferiority trial, what is C usually?",
      opts: ["Placebo", "Active comparator (current best treatment)", "No treatment", "Historical control"],
      exp: "Non-inferiority trials aim to show the new therapy is 'no worse than' the current best. C must be the standard or best available treatment.",
    },
    correct: 1,
  },
  {
    id: "c1-040", category: 3,
    zh: {
      q: "以下哪個情境選擇安慰劑作為 C 是合理的？",
      opts: ["研究新抗生素治療嚴重肺炎（已有有效抗生素）", "研究新止癢藥治療輕度濕疹（目前無公認標準治療）", "研究新化療藥治療晚期癌症（已有一線化療方案）", "研究新抗癲癇藥（患者正在發作中）"],
      exp: "當目前沒有公認的標準治療時，使用安慰劑在倫理上是可接受的。對於有有效治療的嚴重疾病，安慰劑對照不合倫理。",
    },
    en: {
      q: "In which scenario is placebo as C ethically appropriate?",
      opts: ["New antibiotic for severe pneumonia (effective antibiotics exist)", "New anti-itch drug for mild eczema (no established standard treatment)", "New chemo for advanced cancer (first-line chemo exists)", "New antiepileptic (patient actively seizing)"],
      exp: "When no established standard treatment exists, placebo is ethically acceptable. For serious diseases with effective treatments, placebo control is unethical.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 4: Outcome (O) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-041", category: 4,
    zh: {
      q: "你想研究「SGLT2 抑制劑對心衰竭患者的效果」。以下哪個 Outcome 定義最合適？",
      opts: ["病人有沒有好轉", "心血管死亡或心衰竭住院的複合終點", "所有不良事件", "醫生的主觀評估"],
      exp: "選項 B 是一個具體、可量測的複合終點，常用於心衰竭臨床試驗（如 DAPA-HF, EMPEROR-Reduced）。",
    },
    en: {
      q: "For 'SGLT2 inhibitors in heart failure,' which Outcome is most appropriate?",
      opts: ["Whether patients got better", "Composite of CV death or HF hospitalization", "All adverse events", "Physician's subjective assessment"],
      exp: "Option B is a specific, measurable composite endpoint used in major HF trials (DAPA-HF, EMPEROR-Reduced).",
    },
    correct: 1,
  },
  {
    id: "c1-042", category: 4,
    zh: {
      q: "研究延長輸注抗生素的效果，以下哪個 O 最合適？",
      opts: ["主要：院內死亡率；次要：臨床治癒率、ICU 住院天數", "抗生素的副作用", "細菌培養結果", "病人有沒有出院"],
      exp: "選項 A 有分主要和次要結局指標，且都是具體、可量測的臨床終點。",
    },
    en: {
      q: "For studying prolonged antibiotic infusion, which Outcome is most appropriate?",
      opts: ["Primary: in-hospital mortality; Secondary: clinical cure rate, ICU LOS", "Antibiotic side effects", "Bacterial culture results", "Whether patients were discharged"],
      exp: "Option A distinguishes primary and secondary outcomes, all specific and measurable clinical endpoints.",
    },
    correct: 0,
  },
  {
    id: "c1-043", category: 4,
    zh: {
      q: "以下哪個是良好 Outcome 定義的特徵？",
      opts: ["越模糊越好，這樣更有彈性", "需要具體、可量測，且指定時間點", "只需要寫「有效」或「無效」", "不需要區分主要和次要結局"],
      exp: "好的 O 必須具體（用什麼工具量？）、可量測（數值變化？事件發生率？）、有時間點（治療後多久？）。",
    },
    en: {
      q: "Which is a characteristic of a good Outcome definition?",
      opts: ["Vaguer is better for flexibility", "Specific, measurable, and with a defined timepoint", "Just say 'effective' or 'ineffective'", "No need to distinguish primary and secondary outcomes"],
      exp: "Good O must be specific (what tool?), measurable (numeric change? event rate?), and time-bound (how long after treatment?).",
    },
    correct: 1,
  },
  {
    id: "c1-044", category: 4,
    zh: {
      q: "研究 CBT 治療重度憂鬱症，以下哪個 O 最合適？",
      opts: ["病人感覺有沒有好一點", "主要：憂鬱量表分數變化 (PHQ-9 或 HAM-D)；次要：緩解率、復發率", "回診率", "治療師的評估"],
      exp: "使用標準化量表（PHQ-9/HAM-D）評估憂鬱嚴重度變化，並區分主次要指標，是最嚴謹的做法。",
    },
    en: {
      q: "For CBT in major depression, which Outcome is most appropriate?",
      opts: ["Whether patients feel better", "Primary: depression score change (PHQ-9/HAM-D); Secondary: remission rate, relapse rate", "Follow-up visit rate", "Therapist's assessment"],
      exp: "Standardized scales (PHQ-9/HAM-D) with primary/secondary distinction is the most rigorous approach.",
    },
    correct: 1,
  },
  {
    id: "c1-045", category: 4,
    zh: {
      q: "為什麼「複合終點」(composite endpoint) 在臨床試驗中常被使用？",
      opts: ["因為比較容易造假", "因為可以增加事件發生率，提高統計檢定力", "因為比較簡單不需要收集太多資料", "因為審查委員會要求"],
      exp: "複合終點（如心血管死亡＋住院）將多個相關事件合併計算，增加事件數，讓研究在較小樣本中也能達到統計顯著性。",
    },
    en: {
      q: "Why are composite endpoints commonly used in clinical trials?",
      opts: ["They're easier to manipulate", "They increase event rates, improving statistical power", "They're simpler and require less data", "Regulatory committees require them"],
      exp: "Composites (e.g., CV death + hospitalization) combine related events, increasing event rates so trials can achieve significance with smaller samples.",
    },
    correct: 1,
  },
  {
    id: "c1-046", category: 4,
    zh: {
      q: "「替代終點」(surrogate endpoint) 和「臨床終點」(clinical endpoint) 有什麼不同？",
      opts: ["沒有不同，只是不同名稱", "替代終點是生物標記（如 HbA1c），臨床終點是病人實際感受到的（如死亡、住院）", "臨床終點比較容易量測", "替代終點更可靠"],
      exp: "替代終點（如 HbA1c、LDL-C）是間接指標，臨床終點（如心肌梗塞、死亡）才直接反映對病人的影響。替代終點不一定能預測臨床結果。",
    },
    en: {
      q: "What's the difference between surrogate and clinical endpoints?",
      opts: ["No difference, just different names", "Surrogate = biomarkers (e.g., HbA1c); Clinical = patient-relevant (e.g., death, hospitalization)", "Clinical endpoints are easier to measure", "Surrogate endpoints are more reliable"],
      exp: "Surrogates (HbA1c, LDL-C) are indirect markers; clinical endpoints (MI, death) directly reflect patient impact. Surrogates don't always predict clinical outcomes.",
    },
    correct: 1,
  },
  {
    id: "c1-047", category: 4,
    zh: {
      q: "以下哪個 O 是「患者報告結局」(PRO, patient-reported outcome)？",
      opts: ["eGFR 斜率", "KCCQ 生活品質問卷分數", "白血球計數", "X 光影像變化"],
      exp: "KCCQ（Kansas City Cardiomyopathy Questionnaire）是由病人自己填寫的量表，屬於患者報告結局。其他都是實驗室或影像指標。",
    },
    en: {
      q: "Which O is a patient-reported outcome (PRO)?",
      opts: ["eGFR slope", "KCCQ quality-of-life questionnaire score", "White blood cell count", "Chest X-ray changes"],
      exp: "KCCQ (Kansas City Cardiomyopathy Questionnaire) is completed by patients — it's a PRO. Others are lab or imaging measures.",
    },
    correct: 1,
  },
  {
    id: "c1-048", category: 4,
    zh: {
      q: "為什麼 Outcome 應該指定量測的時間點？",
      opts: ["只是格式要求", "因為效果可能隨時間改變，不同時間點的結果可能不同", "為了讓文章看起來更專業", "不需要指定，隨時量都一樣"],
      exp: "藥物效果可能隨時間變化（如短期有效但長期無效），不同時間點的結果可能差異很大。明確時間點確保研究可比較。",
    },
    en: {
      q: "Why should Outcome specify a measurement timepoint?",
      opts: ["Just a formatting requirement", "Because effects may change over time — results at different timepoints can differ", "To make the paper look professional", "Not needed, results are the same anytime"],
      exp: "Drug effects may vary over time (e.g., short-term benefit but long-term null). Specifying timepoints ensures comparability across studies.",
    },
    correct: 1,
  },
  {
    id: "c1-049", category: 4,
    zh: {
      q: "在 CKD 研究中，以下哪個 Outcome 指標反映長期腎功能變化最適合？",
      opts: ["單次 eGFR 數值", "eGFR 斜率（月 3-4 起算以避免血流動力學效應干擾）", "尿液顏色", "腎臟超音波大小"],
      exp: "eGFR 斜率可以反映腎功能隨時間的變化趨勢，從月 3-4 起算避免了初始血流動力學效應（如 SGLT2i 的急性 eGFR 下降）的干擾。",
    },
    en: {
      q: "In CKD studies, which O best reflects long-term kidney function change?",
      opts: ["Single eGFR value", "eGFR slope (starting month 3-4 to avoid hemodynamic dip confounding)", "Urine color", "Kidney ultrasound size"],
      exp: "eGFR slope reflects kidney function trajectory over time. Starting at month 3-4 avoids the initial hemodynamic dip (e.g., acute eGFR drop with SGLT2i).",
    },
    correct: 1,
  },
  {
    id: "c1-050", category: 4,
    zh: {
      q: "以下哪一組主要和次要結局的設定最合理？",
      opts: ["主要：所有不良事件；次要：死亡率", "主要：死亡率；次要：不良事件、住院天數、生活品質", "主要：住院天數、死亡率、不良事件、費用、滿意度（全部列為主要）", "主要：無；次要：死亡率"],
      exp: "主要結局應該是最重要的單一或複合指標（如死亡率），次要結局補充其他面向。列太多主要結局會增加多重比較的問題。",
    },
    en: {
      q: "Which primary/secondary outcome setup is most reasonable?",
      opts: ["Primary: all adverse events; Secondary: mortality", "Primary: mortality; Secondary: adverse events, LOS, quality of life", "Primary: LOS, mortality, AEs, cost, satisfaction (all primary)", "Primary: none; Secondary: mortality"],
      exp: "Primary should be the single most important endpoint (e.g., mortality); secondaries cover other dimensions. Too many primaries = multiplicity issues.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 5: PICOS & Study Design (S) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-051", category: 5,
    zh: {
      q: "PICOS 中的 S 代表什麼？什麼時候需要加上它？",
      opts: ["Sample size（樣本量）— 當你想限制研究大小時", "Study design（研究設計）— 當你想限定納入的研究類型時", "Statistics（統計方法）— 當你想指定分析方法時", "Setting（場域）— 當你想限制研究地點時"],
      exp: "S 是 Study design。加上 S 可以幫你限定只看 RCT、或只看世代研究等。",
    },
    en: {
      q: "What does S in PICOS stand for?",
      opts: ["Sample size", "Study design — to specify which study types to include", "Statistics", "Setting"],
      exp: "S = Study design. It lets you restrict to RCTs only, cohort studies, etc.",
    },
    correct: 1,
  },
  {
    id: "c1-052", category: 5,
    zh: {
      q: "如果你的統合分析只想納入隨機對照試驗 (RCT)，應該在 PICOS 的哪個部分說明？",
      opts: ["P — 在族群中限定", "I — 在介入措施中加上", "O — 在結果指標中說明", "S — 在研究設計中限定"],
      exp: "研究設計的篩選（如只納入 RCT）應在 S（Study design）中說明，而不是混在其他元素中。",
    },
    en: {
      q: "If your meta-analysis only includes RCTs, where in PICOS should you specify this?",
      opts: ["P — in the Population", "I — in the Intervention", "O — in the Outcome", "S — in the Study design"],
      exp: "Study type restriction (e.g., RCTs only) belongs in S (Study design), not mixed with other elements.",
    },
    correct: 3,
  },
  {
    id: "c1-053", category: 5,
    zh: {
      q: "以下哪種情況最適合使用 PICOS 而非 PICO？",
      opts: ["當你對研究結果不確定時", "當你想區分觀察性研究和 RCT 的證據等級時", "當你不知道要用什麼統計方法時", "當你的研究問題很簡單時"],
      exp: "當你需要根據研究類型（RCT vs 世代研究 vs 病例對照）來分層分析或限定證據等級時，加上 S 特別有幫助。",
    },
    en: {
      q: "When is PICOS most useful compared to PICO?",
      opts: ["When you're unsure about results", "When you want to differentiate evidence levels by study type (RCT vs observational)", "When you don't know which statistics to use", "When your research question is simple"],
      exp: "Adding S helps when you need to stratify by study type (RCT vs cohort vs case-control) or limit evidence levels.",
    },
    correct: 1,
  },
  {
    id: "c1-054", category: 5,
    zh: {
      q: "以下哪個不是常見的研究設計類型？",
      opts: ["隨機對照試驗 (RCT)", "前瞻性世代研究 (Prospective cohort)", "回顧性病例對照研究 (Case-control)", "隨機問卷調查 (Random questionnaire survey)"],
      exp: "「隨機問卷調查」不是標準的流行病學研究設計分類。RCT、世代研究和病例對照研究才是標準類型。",
    },
    en: {
      q: "Which is NOT a standard study design type?",
      opts: ["Randomized controlled trial (RCT)", "Prospective cohort study", "Retrospective case-control study", "Random questionnaire survey"],
      exp: "'Random questionnaire survey' isn't a standard epidemiological study design. RCT, cohort, and case-control are standard types.",
    },
    correct: 3,
  },
  {
    id: "c1-055", category: 5,
    zh: {
      q: "在統合分析中，將 RCT 和觀察性研究混合分析會有什麼問題？",
      opts: ["沒有問題，資料越多越好", "可能引入偏差，因為觀察性研究的證據等級較低且混雜因子較多", "只會影響計算速度", "觀察性研究的結果一定比 RCT 差"],
      exp: "RCT 和觀察性研究的證據等級不同，混合分析可能因觀察性研究的混雜因子而引入偏差。通常建議分開分析或做次群組分析。",
    },
    en: {
      q: "What problem arises from mixing RCTs and observational studies in a meta-analysis?",
      opts: ["No problem — more data is better", "May introduce bias because observational studies have lower evidence and more confounders", "Only affects computation speed", "Observational results are always worse than RCTs"],
      exp: "RCTs and observational studies differ in evidence level. Mixing may introduce confounding bias. Usually analyze separately or as subgroups.",
    },
    correct: 1,
  },
  {
    id: "c1-056", category: 5,
    zh: {
      q: "在證據等級金字塔中，以下哪個設計的證據等級最高？",
      opts: ["專家意見", "病例報告", "隨機對照試驗的統合分析", "單一世代研究"],
      exp: "RCT 的統合分析（系統性回顧與統合分析）位於證據金字塔頂端，因為它綜合了多個高品質 RCT 的結果。",
    },
    en: {
      q: "In the evidence hierarchy pyramid, which design has the highest level of evidence?",
      opts: ["Expert opinion", "Case report", "Meta-analysis of RCTs", "Single cohort study"],
      exp: "Meta-analysis of RCTs sits at the top of the evidence pyramid because it synthesizes results from multiple high-quality RCTs.",
    },
    correct: 2,
  },
  {
    id: "c1-057", category: 5,
    zh: {
      q: "如果你的研究問題找不到足夠的 RCT，以下哪個做法最合理？",
      opts: ["放棄統合分析", "擴大 S 的範圍納入觀察性研究，但在報告中明確標示證據等級", "偽造 RCT 資料", "直接改成寫文獻回顧，不做統合分析"],
      exp: "當 RCT 不足時，可以納入高品質觀察性研究，但必須在報告中說明研究設計的組成並進行敏感度分析。",
    },
    en: {
      q: "If you can't find enough RCTs for your question, what's the most reasonable approach?",
      opts: ["Abandon the meta-analysis", "Expand S to include observational studies, clearly noting evidence levels in the report", "Fabricate RCT data", "Switch to a narrative review instead"],
      exp: "When RCTs are scarce, include high-quality observational studies but clearly state the study design mix and conduct sensitivity analyses.",
    },
    correct: 1,
  },
  {
    id: "c1-058", category: 5,
    zh: {
      q: "Crossover trial（交叉試驗）有什麼特別之處？",
      opts: ["每個受試者同時接受介入和對照", "每個受試者先後接受介入和對照，自己當自己的對照", "只適用於外科手術研究", "不算是 RCT 的一種"],
      exp: "交叉試驗讓每個受試者在不同時期分別接受介入和對照，消除個體間差異。它是 RCT 的一種，但需要考慮洗脫期和順序效應。",
    },
    en: {
      q: "What's special about a crossover trial?",
      opts: ["Each participant receives intervention and control simultaneously", "Each participant receives both in sequence, serving as their own control", "Only for surgical studies", "Not a type of RCT"],
      exp: "Crossover trials let each participant receive both intervention and control in different periods, eliminating inter-individual variability. It's a type of RCT but needs washout periods.",
    },
    correct: 1,
  },
  {
    id: "c1-059", category: 5,
    zh: {
      q: "Pragmatic trial（實用性試驗）和 Explanatory trial（解釋性試驗）在 S 上有什麼不同？",
      opts: ["沒有不同", "Pragmatic trial 在真實臨床環境中進行、納入標準寬鬆；Explanatory trial 在嚴格控制條件下進行", "Pragmatic trial 只用觀察性設計", "Explanatory trial 不需要對照組"],
      exp: "Pragmatic trial 強調外部效度（真實世界適用性），Explanatory trial 強調內部效度（嚴格的因果推論）。選擇哪種取決於你的研究目的。",
    },
    en: {
      q: "How do pragmatic and explanatory trials differ in terms of S?",
      opts: ["No difference", "Pragmatic: real-world setting, broad criteria; Explanatory: tightly controlled conditions", "Pragmatic trials only use observational designs", "Explanatory trials don't need controls"],
      exp: "Pragmatic trials emphasize external validity (real-world applicability); explanatory trials emphasize internal validity (strict causal inference). Choice depends on your research goal.",
    },
    correct: 1,
  },
  {
    id: "c1-060", category: 5,
    zh: {
      q: "以下哪個研究設計最適合研究「罕見藥物不良反應」？",
      opts: ["小型 RCT", "病例對照研究 (case-control study)", "交叉試驗", "單臂試驗"],
      exp: "罕見事件在 RCT 中難以觀察到（樣本量不夠）。病例對照研究從已發生不良反應的病例出發回溯暴露，是研究罕見事件的最佳設計。",
    },
    en: {
      q: "Which study design is best for studying rare adverse drug reactions?",
      opts: ["Small RCT", "Case-control study", "Crossover trial", "Single-arm trial"],
      exp: "Rare events are hard to observe in RCTs (insufficient sample size). Case-control studies start from cases with the adverse event and look back at exposure — best for rare events.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 6: Common Mistakes & Pitfalls (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-061", category: 6,
    zh: {
      q: "以下哪個是 PICO 的常見錯誤？",
      opts: ["在 Outcome 中指定具體的量測工具和時間點", "先做初步搜尋確認有足夠的研究再確定 PICO", "把 Population 定義為「所有患者」而不限定具體特徵", "在 Comparison 中同時考慮安慰劑和積極對照組"],
      exp: "把族群定義為「所有患者」太過廣泛，會讓搜尋結果過多且不聚焦。好的 P 應該限定年齡、疾病階段、嚴重度等特徵。",
    },
    en: {
      q: "Which is a common PICO mistake?",
      opts: ["Specifying a concrete measurement tool in Outcome", "Doing a preliminary search before finalizing PICO", "Defining Population as 'all patients' without specifics", "Considering both placebo and active comparators"],
      exp: "'All patients' is too broad. A good P should specify age, disease stage, severity.",
    },
    correct: 2,
  },
  {
    id: "c1-062", category: 6,
    zh: {
      q: "以下關於 PICO 各元素的描述，哪個是正確的？",
      opts: ["P 只需要寫疾病名稱就夠了", "I 和 C 可以是同一種藥物的不同劑量", "O 不需要指定量測的時間點", "C 不是必要的，可以省略"],
      exp: "I 和 C 確實可以是同一種藥物的不同劑量（如高劑量 vs 低劑量）。P 需要更多細節，O 應指定時間點，C 不可省略。",
    },
    en: {
      q: "Which statement about PICO elements is correct?",
      opts: ["P only needs the disease name", "I and C can be different doses of the same drug", "O doesn't need a timepoint", "C is optional"],
      exp: "I and C can indeed be different doses (e.g., high-dose vs low-dose). P needs more detail, O should specify timepoints, and C is essential.",
    },
    correct: 1,
  },
  {
    id: "c1-063", category: 6,
    zh: {
      q: "你的同事提出以下 PICO：「P: 糖尿病患者, I: 飲食控制, C: 無, O: 血糖改善」。這個 PICO 有什麼問題？",
      opts: ["完全沒問題", "每個元素都太模糊 — P 未限定糖尿病類型、I 未定義飲食內容、C 缺失、O 不夠具體", "只有 O 有問題", "只有 P 有問題"],
      exp: "四個元素都需改進：P 應指定糖尿病類型和年齡，I 應定義具體飲食方案，C 不能為空（至少要有常規飲食），O 應寫明量測工具和時間點。",
    },
    en: {
      q: "A colleague proposes: 'P: diabetes patients, I: diet control, C: none, O: blood sugar improvement.' What's wrong?",
      opts: ["Nothing — it's fine", "Every element is too vague — P no DM type, I no diet details, C missing, O not specific", "Only O is problematic", "Only P is problematic"],
      exp: "All four need improvement: P (specify DM type, age), I (specific diet protocol), C (can't be empty — at least usual diet), O (measurement tool and timepoint).",
    },
    correct: 1,
  },
  {
    id: "c1-064", category: 6,
    zh: {
      q: "以下哪個做法會導致統合分析搜尋結果過少？",
      opts: ["使用適當的 MeSH 詞彙", "PICO 定義過於狹窄，例如限定特定品牌、特定醫院、特定年份", "搜尋多個資料庫", "納入不同語言的研究"],
      exp: "PICO 太狹窄（如限定某一家醫院的某一年）會讓可納入的研究極少。需要在精確和可行之間取得平衡。",
    },
    en: {
      q: "Which practice leads to too few search results in a meta-analysis?",
      opts: ["Using appropriate MeSH terms", "Defining PICO too narrowly (e.g., specific brand, hospital, year)", "Searching multiple databases", "Including studies in different languages"],
      exp: "Too-narrow PICO (e.g., one hospital in one year) yields very few eligible studies. Balance precision with feasibility.",
    },
    correct: 1,
  },
  {
    id: "c1-065", category: 6,
    zh: {
      q: "在決定 PICO 之前，為什麼建議先做初步文獻搜尋？",
      opts: ["因為 PICO 不重要，隨便定就好", "為了確認研究領域有足夠的文獻量，並根據現有證據調整 PICO 的範圍", "因為老師要求", "為了抄別人的 PICO"],
      exp: "初步搜尋（scoping search）幫助你了解現有文獻的數量和類型，避免 PICO 定義太廣（上千篇）或太窄（個位數篇）。",
    },
    en: {
      q: "Why is a preliminary search recommended before finalizing PICO?",
      opts: ["PICO doesn't matter, just pick anything", "To confirm sufficient literature exists and calibrate PICO scope based on available evidence", "Because the professor requires it", "To copy someone else's PICO"],
      exp: "A scoping search reveals the volume and type of existing literature, preventing PICO that's too broad (thousands of hits) or too narrow (single digits).",
    },
    correct: 1,
  },
  {
    id: "c1-066", category: 6,
    zh: {
      q: "以下哪個錯誤是「把研究範圍當成 PICO」？",
      opts: ["P: HFrEF 成人, I: Dapagliflozin 10mg, C: 安慰劑, O: CV death", "P: 心臟病, I: 藥物, C: 無, O: 病人好轉", "P: COPD, I: Tiotropium, C: Salmeterol, O: 急性惡化頻率", "P: T2DM 成人 HbA1c>7%, I: Metformin 1000mg BID, C: 安慰劑, O: HbA1c 26 週變化"],
      exp: "選項 B 的每個元素都是研究「範圍」而不是可操作的 PICO：「心臟病」太廣、「藥物」不具體、「無」不是有效對照、「好轉」不可量測。",
    },
    en: {
      q: "Which example shows the mistake of 'treating research scope as PICO'?",
      opts: ["P: HFrEF adults, I: Dapagliflozin 10mg, C: placebo, O: CV death", "P: heart disease, I: drugs, C: none, O: patient improvement", "P: COPD, I: Tiotropium, C: Salmeterol, O: exacerbation frequency", "P: T2DM adults HbA1c>7%, I: Metformin 1000mg BID, C: placebo, O: HbA1c change at 26wk"],
      exp: "Option B uses scope-level terms rather than actionable PICO: 'heart disease' is too broad, 'drugs' is vague, 'none' isn't valid, 'improvement' isn't measurable.",
    },
    correct: 1,
  },
  {
    id: "c1-067", category: 6,
    zh: {
      q: "以下哪個是 PICO 中「Outcome 偏差」的例子？",
      opts: ["在統合分析前就決定好要看的結局指標", "做完分析後，選擇 p 值最顯著的結局指標來報告", "同時報告主要和次要結局", "在 PICO 中明列預期的結局方向"],
      exp: "事後挑選最顯著的結局是「選擇性報告偏差」(selective reporting bias)。正確做法是在研究前就預先決定並註冊主要結局。",
    },
    en: {
      q: "Which is an example of 'outcome bias' in PICO?",
      opts: ["Deciding which outcomes to measure before the analysis", "After analysis, choosing the outcome with the most significant p-value to report", "Reporting both primary and secondary outcomes", "Specifying the expected direction of the outcome in PICO"],
      exp: "Choosing the most significant outcome after analysis is 'selective reporting bias.' The correct approach is pre-specifying and registering primary outcomes.",
    },
    correct: 1,
  },
  {
    id: "c1-068", category: 6,
    zh: {
      q: "你的 PICO 搜尋到 2000 篇文獻。以下哪個調整最合理？",
      opts: ["全部讀完", "縮小 P（更具體的族群）或限定 S（只看 RCT）", "放棄這個題目", "隨機選 20 篇來分析"],
      exp: "搜尋結果太多代表 PICO 可能太廣。縮小族群範圍或限定研究設計可以有效減少數量，同時保持研究品質。",
    },
    en: {
      q: "Your PICO search returns 2000 articles. What's the most reasonable adjustment?",
      opts: ["Read them all", "Narrow P (more specific population) or restrict S (RCTs only)", "Abandon the topic", "Randomly pick 20 to analyze"],
      exp: "Too many results means PICO is likely too broad. Narrowing population or restricting study design effectively reduces volume while maintaining quality.",
    },
    correct: 1,
  },
  {
    id: "c1-069", category: 6,
    zh: {
      q: "以下哪個錯誤是把「P 和 I 搞混了」？",
      opts: ["P: ICU 重症成人, I: Meropenem 延長輸注", "P: 接受 Metformin 治療的 T2DM 患者, I: Metformin", "P: 65 歲以上高血壓成人, I: Amlodipine 5mg", "P: NVAF 成人, I: Rivaroxaban 20mg"],
      exp: "選項 B 把已經在使用 Metformin 的病人定義為 P，又把 Metformin 定義為 I，造成 P 和 I 重疊。P 應該在介入之前就定義好。",
    },
    en: {
      q: "Which example shows the mistake of 'confusing P and I'?",
      opts: ["P: ICU critically ill adults, I: Meropenem prolonged infusion", "P: T2DM patients on Metformin, I: Metformin", "P: Adults ≥65y with HTN, I: Amlodipine 5mg", "P: Adults with NVAF, I: Rivaroxaban 20mg"],
      exp: "Option B defines P as patients already on Metformin, then also defines I as Metformin — P and I overlap. P should be defined before the intervention.",
    },
    correct: 1,
  },
  {
    id: "c1-070", category: 6,
    zh: {
      q: "以下哪個不是修改 PICO 的合理理由？",
      opts: ["初步搜尋發現文獻量太少，需要擴大範圍", "發現原本的 O 在大多數研究中沒有報告，需要換指標", "為了讓結果符合你預期的方向而修改 PICO", "發現某個重要的亞群在初步文獻中反覆出現，需要調整 P"],
      exp: "PICO 的修改應基於客觀的文獻狀況，而不是為了迎合預期結果。為了得到想要的答案而改 PICO 是研究偏差的來源。",
    },
    en: {
      q: "Which is NOT a valid reason to modify PICO?",
      opts: ["Preliminary search found too few studies — need to broaden scope", "Original O wasn't reported in most studies — need different measure", "Changing PICO to make results match your expected direction", "An important subgroup keeps appearing in preliminary literature — need to adjust P"],
      exp: "PICO modifications should be based on objective literature findings, not to match desired results. Changing PICO to get a preferred answer is a source of research bias.",
    },
    correct: 2,
  },
];

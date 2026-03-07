import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";
import CuteDino from "./CuteDino";
import DinoEggHatch, { DragonEgg } from "./DinoEggHatch";

// ═══ DESIGN TOKENS (matching existing site) ═══
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const DINO_COLORS = ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6", "#E67E22", "#95A5A6"];

// ═══ REUSABLE COMPONENTS ═══
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 24, height: 2, background: TEAL, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: TEAL }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 640, ...style }}>{children}</p>;
}

const btnPrimary = { background: TEAL, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };

// CuteDino is now imported from ./CuteDino.jsx

// ═══ PICO CARD ═══
function PicoCard({ letter, color, title, desc, example, tip, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ background: CARD_BG, border: `1.5px solid ${hovered ? color + "55" : LIGHT_BORDER}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.3s", boxShadow: hovered ? `0 8px 28px ${color}15` : "none", transform: hovered ? "translateY(-3px)" : "translateY(0)", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color, flexShrink: 0 }}>{letter}</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{title}</h3>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: MUTED, marginBottom: 14 }}>{desc}</p>
        <div style={{ background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color, fontWeight: 600 }}>{example}</span>
        </div>
        <p style={{ fontSize: 12.5, color: `${MUTED}BB`, fontStyle: "italic", lineHeight: 1.6 }}>💡 {tip}</p>
      </div>
    </FadeIn>
  );
}

// ═══ TRAP CARD ═══
function TrapCard({ number, title, bad, good, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "22px 20px", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${CORAL}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: CORAL, flexShrink: 0 }}>{number}</div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{title}</h4>
        </div>
        <div style={{ background: "#FDF2F0", borderRadius: 8, padding: "8px 12px", marginBottom: 8, fontSize: 13, color: "#B83A20", lineHeight: 1.6 }}>✗ {bad}</div>
        <div style={{ background: "#E6F5F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#2A7A5A", lineHeight: 1.6 }}>✓ {good}</div>
      </div>
    </FadeIn>
  );
}

// DinoEggHatch is now imported from ./DinoEggHatch.jsx


// ═══ INTERACTIVE PICO BUILDER (Multiple Choice) ═══
function PicoBuilder({ t, lang }) {
  const [scenario, setScenario] = useState(null);
  const [currentField, setCurrentField] = useState(0);
  const [selections, setSelections] = useState({});
  const [answered, setAnswered] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const fields = ["p", "i", "c", "o"];
  const fieldMeta = {
    p: { letter: "P", color: CORAL, labelZh: "Population 族群", labelEn: "Population" },
    i: { letter: "I", color: "#7B68C8", labelZh: "Intervention 介入措施", labelEn: "Intervention" },
    c: { letter: "C", color: "#D4A843", labelZh: "Comparison 對照組", labelEn: "Comparison" },
    o: { letter: "O", color: "#5B9E5F", labelZh: "Outcome 結果指標", labelEn: "Outcome" },
  };

  const scenarios = {
    A: {
      title: lang === "zh" ? "心血管：SGLT2 抑制劑治療心衰竭" : "Cardiology: SGLT2 inhibitors for heart failure",
      p: {
        options: lang === "zh" ? ["所有心臟病患者", "射出分率降低的心衰竭 (HFrEF) 成年患者，NYHA class II-IV", "有心血管風險因子的人", "65歲以上老年人"] : ["All heart disease patients", "Adults with HFrEF, NYHA class II-IV", "People with cardiovascular risk factors", "Adults over 65"],
        correct: 1,
        explanationZh: "選項 B 精確定義了心衰竭類型（HFrEF）、功能分級（NYHA II-IV）和年齡（成人）。其他選項太廣泛。",
        explanationEn: "Option B precisely defines HF type (HFrEF), functional class (NYHA II-IV), and age (adults). Others are too broad.",
      },
      i: {
        options: lang === "zh" ? ["心衰竭的藥物治療", "SGLT2 抑制劑 (Dapagliflozin 10mg 或 Empagliflozin 10mg) 加上標準治療", "Dapagliflozin", "新型降糖藥"] : ["Drug therapy for heart failure", "SGLT2 inhibitor (Dapagliflozin 10mg or Empagliflozin 10mg) plus standard therapy", "Dapagliflozin", "Novel glucose-lowering agents"],
        correct: 1,
        explanationZh: "選項 B 指定了藥物類別、具體藥名、劑量，並說明是「加上」標準治療。選項 C 缺少劑量。",
        explanationEn: "Option B specifies drug class, specific agents, doses, and notes it\'s \'plus standard therapy.\' Option C lacks dose.",
      },
      c: {
        options: lang === "zh" ? ["不治療", "其他心衰竭藥物", "安慰劑加上標準治療", "健康對照組"] : ["No treatment", "Other heart failure drugs", "Placebo plus standard therapy", "Healthy controls"],
        correct: 2,
        explanationZh: "安慰劑加上標準治療確保兩組唯一的差異就是 SGLT2 抑制劑。「不治療」在心衰竭中不符合倫理。",
        explanationEn: "Placebo plus standard therapy ensures the only difference is the SGLT2 inhibitor. \'No treatment\' is unethical in HF.",
      },
      o: {
        options: lang === "zh" ? ["病人有沒有好轉", "所有不良事件", "心血管死亡或心衰竭住院的複合終點；次要：全因死亡率、KCCQ", "住院天數"] : ["Whether patients improved", "All adverse events", "Composite of CV death or HF hospitalization; Secondary: all-cause mortality, KCCQ", "Length of hospital stay"],
        correct: 2,
        explanationZh: "選項 C 定義了具體的主要複合終點和次要指標，與 DAPA-HF 和 EMPEROR-Reduced 一致。",
        explanationEn: "Option C defines specific primary composite and secondary endpoints, consistent with DAPA-HF and EMPEROR-Reduced.",
      },
    },
    B: {
      title: lang === "zh" ? "感染科：延長輸注 β-lactam 抗生素" : "Infectious Disease: Prolonged β-lactam infusion",
      p: {
        options: lang === "zh" ? ["所有接受抗生素的患者", "加護病房中接受 β-lactam 抗生素治療的重症成人患者", "住院的感染患者", "有肺炎的成年人"] : ["All patients receiving antibiotics", "Critically ill adults in ICU receiving β-lactam antibiotics", "Hospitalized patients with infections", "Adults with pneumonia"],
        correct: 1,
        explanationZh: "選項 B 精確限定了場域（ICU）、藥物類別（β-lactam）、嚴重度（重症）和年齡（成人）。",
        explanationEn: "Option B precisely defines setting (ICU), drug class (β-lactam), severity (critically ill), and age (adults).",
      },
      i: {
        options: lang === "zh" ? ["延長輸注 (≥3小時持續輸注或間歇延長輸注)", "抗生素治療", "高劑量抗生素", "持續靜脈輸注"] : ["Prolonged infusion (≥3h continuous or extended intermittent infusion)", "Antibiotic therapy", "High-dose antibiotics", "Continuous IV infusion"],
        correct: 0,
        explanationZh: "選項 A 明確定義了「延長輸注」的時間閾值（≥3小時）和兩種模式。選項 D 只涵蓋持續輸注。",
        explanationEn: "Option A clearly defines \'prolonged infusion\' with a time threshold and two possible modes.",
      },
      c: {
        options: lang === "zh" ? ["口服抗生素", "不使用抗生素", "傳統間歇輸注 (30分鐘 bolus)", "其他類型抗生素"] : ["Oral antibiotics", "No antibiotics", "Conventional intermittent infusion (30-min bolus)", "Different antibiotic class"],
        correct: 2,
        explanationZh: "傳統間歇輸注是正確的對照——同一種藥、同一種途徑，唯一差異就是輸注時間。",
        explanationEn: "Conventional intermittent infusion is the right comparator — same drug, same route, only duration differs.",
      },
      o: {
        options: lang === "zh" ? ["主要：院內死亡率；次要：臨床治癒率、ICU 住院天數", "抗生素的副作用", "細菌培養結果", "病人有沒有出院"] : ["Primary: in-hospital mortality; Secondary: clinical cure rate, ICU LOS", "Antibiotic side effects", "Bacterial culture results", "Whether patients were discharged"],
        correct: 0,
        explanationZh: "選項 A 定義了分層明確的主要和次要結果指標，涵蓋最重要的臨床結局。",
        explanationEn: "Option A defines clearly tiered primary and secondary outcomes covering the most important endpoints.",
      },
    },
    C: {
      title: lang === "zh" ? "精神科：CBT 治療重度憂鬱症" : "Psychiatry: CBT for major depression",
      p: {
        options: lang === "zh" ? ["心情不好的人", "符合 DSM-5 重度憂鬱症診斷標準的成年患者 (18歲以上)", "有憂鬱症狀的青少年和成人", "精神科門診患者"] : ["People feeling sad", "Adults (≥18y) meeting DSM-5 criteria for major depressive disorder", "Adolescents and adults with depressive symptoms", "Psychiatric outpatients"],
        correct: 1,
        explanationZh: "選項 B 用了標準診斷標準（DSM-5）和明確的年齡限制。「心情不好」太主觀。",
        explanationEn: "Option B uses standardized diagnostic criteria (DSM-5) with clear age limits.",
      },
      i: {
        options: lang === "zh" ? ["心理治療", "認知行為治療 (CBT)，每週 1 次，持續 12-16 週", "諮商", "CBT 加上藥物"] : ["Psychotherapy", "CBT, weekly sessions for 12-16 weeks", "Counseling", "CBT plus medication"],
        correct: 1,
        explanationZh: "選項 B 指定了具體的治療方式（CBT）、頻率（每週）和持續時間（12-16週）。",
        explanationEn: "Option B specifies exact therapy (CBT), frequency (weekly), and duration (12-16 weeks).",
      },
      c: {
        options: lang === "zh" ? ["什麼都不做", "藥物治療 (SSRI) 單獨使用、或等待名單對照", "其他心理治療", "運動治療"] : ["Nothing", "Pharmacotherapy (SSRI) alone, or wait-list control", "Other psychotherapy", "Exercise therapy"],
        correct: 1,
        explanationZh: "選項 B 提供了積極對照（SSRI）和消極對照（等待名單）兩種有意義的比較。",
        explanationEn: "Option B provides both active (SSRI) and passive (wait-list) comparators.",
      },
      o: {
        options: lang === "zh" ? ["病人感覺有沒有好一點", "主要：憂鬱量表分數變化 (PHQ-9 或 HAM-D)；次要：緩解率、復發率", "回診率", "治療師的評估"] : ["Whether patients feel better", "Primary: depression score change (PHQ-9/HAM-D); Secondary: remission rate, relapse rate", "Follow-up visit rate", "Therapist\'s assessment"],
        correct: 1,
        explanationZh: "選項 B 使用標準化量表（PHQ-9、HAM-D）並區分主要和次要結果。",
        explanationEn: "Option B uses standardized instruments (PHQ-9, HAM-D) with primary/secondary separation.",
      },
    },
  };

  const handleScenarioSelect = (s) => { setScenario(s); setCurrentField(0); setSelections({}); setAnswered(false); setShowSummary(false); };
  const handleOptionSelect = (idx) => { if (answered) return; setSelections(prev => ({ ...prev, [fields[currentField]]: idx })); setAnswered(true); };
  const nextField = () => { if (currentField < 3) { setCurrentField(c => c + 1); setAnswered(false); } else { setShowSummary(true); } };
  const reset = () => { setScenario(null); setCurrentField(0); setSelections({}); setAnswered(false); setShowSummary(false); };

  const sc = scenario ? scenarios[scenario] : null;
  const field = fields[currentField];
  const meta = fieldMeta[field];
  const fieldData = sc ? sc[field] : null;
  const isCorrect = fieldData && selections[field] === fieldData.correct;
  const score = sc ? fields.filter(f => selections[f] === sc[f].correct).length : 0;

  // Scenario selection
  if (!scenario) {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: "1px solid " + LIGHT_BORDER, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 16 }}>{t("c1s4Scenario")}</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["A", "B", "C"].map(s => (
            <button key={s} onClick={() => handleScenarioSelect(s)} style={{ background: "#FAFAF7", border: "1.5px solid " + LIGHT_BORDER, borderRadius: 14, padding: "18px 20px", textAlign: "left", fontSize: 15, color: DARK, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL + "44"; e.currentTarget.style.background = TEAL + "06"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = LIGHT_BORDER; e.currentTarget.style.background = "#FAFAF7"; }}>
              {scenarios[s].title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Summary
  if (showSummary) {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: "1px solid " + LIGHT_BORDER, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{score === 4 ? "\u{1F3C6}" : score >= 3 ? "\u{1F44D}" : "\u{1F4DD}"}</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 6 }}>
            {score === 4 ? (lang === "zh" ? "完美！全部正確！" : "Perfect! All correct!") : (lang === "zh" ? "答對 " + score + " / 4 題" : score + " / 4 correct")}
          </h3>
          <p style={{ fontSize: 14, color: MUTED }}>{sc.title}</p>
        </div>
        <div style={{ background: TEAL + "06", border: "1px solid " + TEAL + "18", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 14 }}>{lang === "zh" ? "正確的 PICO" : "Correct PICO"}</h4>
          {fields.map(f => {
            const m = fieldMeta[f];
            const fd = sc[f];
            const userCorrect = selections[f] === fd.correct;
            return (
              <div key={f} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <div style={{ minWidth: 26, height: 26, borderRadius: 7, background: m.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: m.color, flexShrink: 0 }}>
                  {userCorrect ? "\u2713" : m.letter}
                </div>
                <div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: userCorrect ? "#2A7A5A" : DARK, fontWeight: userCorrect ? 500 : 400, margin: 0 }}>{fd.options[fd.correct]}</p>
                  {!userCorrect && (<p style={{ fontSize: 12, color: CORAL, marginTop: 4, lineHeight: 1.5 }}>{lang === "zh" ? "你選的：" : "You chose: "}{fd.options[selections[f]]}</p>)}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={reset} style={{ background: "transparent", border: "1.5px solid " + TEAL, color: TEAL, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {lang === "zh" ? "換一個情境 \u21BB" : "Try another scenario \u21BB"}
        </button>
      </div>
    );
  }

  // Question screen
  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: "1px solid " + LIGHT_BORDER, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: MUTED }}>{sc.title}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {fields.map((f, i) => {
            const m = fieldMeta[f];
            let bg = LIGHT_BORDER;
            if (i < currentField) bg = selections[f] === sc[f].correct ? "#3DA87A" : CORAL;
            else if (i === currentField) bg = m.color;
            return <div key={f} style={{ width: 32, height: 6, borderRadius: 3, background: bg, transition: "all 0.3s" }} />;
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: meta.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: meta.color }}>{meta.letter}</div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK, margin: 0 }}>{lang === "zh" ? meta.labelZh : meta.labelEn}</h3>
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>{lang === "zh" ? "選擇最恰當的定義" : "Pick the most appropriate definition"}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {fieldData.options.map((opt, idx) => {
          let bg = "#FAFAF7", border = LIGHT_BORDER, col = DARK, fw = 400;
          if (answered) {
            if (idx === fieldData.correct) { bg = "#E6F5F0"; border = "#3DA87A"; col = "#2A7A5A"; fw = 600; }
            else if (idx === selections[field] && idx !== fieldData.correct) { bg = "#FDEEEB"; border = "#D94B2E"; col = "#B83A20"; }
          }
          return (
            <button key={idx} onClick={() => handleOptionSelect(idx)} style={{ background: bg, border: "1.5px solid " + border, borderRadius: 12, padding: "13px 16px", textAlign: "left", fontSize: 14, color: col, cursor: answered ? "default" : "pointer", transition: "all 0.2s", fontWeight: fw, lineHeight: 1.5 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", border: "1.5px solid " + border, fontSize: 12, fontWeight: 600, marginRight: 10, background: answered && idx === fieldData.correct ? "#3DA87A" : "transparent", color: answered && idx === fieldData.correct ? "#FFF" : col }}>{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ background: isCorrect ? "#E6F5F0" : "#FDEEEB", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13.5, lineHeight: 1.65, color: MUTED, border: "1px solid " + (isCorrect ? "#3DA87A33" : "#D94B2E33") }}>
          <strong style={{ color: isCorrect ? "#2A7A5A" : "#B83A20" }}>{isCorrect ? (lang === "zh" ? "\u2705 正確！" : "\u2705 Correct!") : (lang === "zh" ? "\u274C 不太對" : "\u274C Not quite")}</strong>{" "}
          {lang === "zh" ? fieldData.explanationZh : fieldData.explanationEn}
        </div>
      )}
      {answered && (
        <div style={{ textAlign: "right" }}>
          <button onClick={nextField} style={{ background: TEAL, border: "none", color: "#FFF", padding: "11px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {currentField < 3 ? (lang === "zh" ? "下一個：" + fieldMeta[fields[currentField + 1]].letter + " \u2192" : "Next: " + fieldMeta[fields[currentField + 1]].letter + " \u2192") : (lang === "zh" ? "查看結果 \u2192" : "See Results \u2192")}
          </button>
        </div>
      )}
    </div>
  );
}


// ═══ AI PICO WORKSHOP ═══
function AIPicoWorkshop({ t, lang }) {
  const [scenario, setScenario] = useState("A");
  const [inputs, setInputs] = useState({ p: "", i: "", c: "", o: "" });
  const [feedback, setFeedback] = useState({ p: null, i: null, c: null, o: null });
  const [loading, setLoading] = useState({ p: false, i: false, c: false, o: false });
  const [overallFeedback, setOverallFeedback] = useState(null);
  const [overallLoading, setOverallLoading] = useState(false);

  const scenarioContext = {
    A: { en: "SGLT2 inhibitors for heart failure (HFrEF)", zh: "SGLT2 抑制劑治療心衰竭 (HFrEF)" },
    B: { en: "Prolonged β-lactam infusion in critically ill ICU patients", zh: "延長輸注 β-lactam 抗生素治療重症 ICU 患者" },
    C: { en: "Cognitive behavioral therapy (CBT) for major depressive disorder", zh: "認知行為治療 (CBT) 治療重度憂鬱症" },
  };

  const picoLabels = {
    p: { letter: "P", en: "Population", zh: "族群", color: CORAL },
    i: { letter: "I", en: "Intervention", zh: "介入", color: "#7B68C8" },
    c: { letter: "C", en: "Comparison", zh: "對照", color: "#D4A843" },
    o: { letter: "O", en: "Outcome", zh: "結果", color: "#5B9E5F" },
  };

  const handleScenarioChange = (s) => {
    setScenario(s);
    setInputs({ p: "", i: "", c: "", o: "" });
    setFeedback({ p: null, i: null, c: null, o: null });
    setOverallFeedback(null);
  };

  const checkField = async (field) => {
    if (!inputs[field].trim()) return;
    setLoading(prev => ({ ...prev, [field]: true }));
    setFeedback(prev => ({ ...prev, [field]: null }));

    const label = picoLabels[field];
    const scenarioText = scenarioContext[scenario][lang === "zh" ? "zh" : "en"];

    const systemPrompt = lang === "zh"
      ? `你是一位統合分析教學助手。學生正在練習為以下研究主題撰寫 PICO：「${scenarioText}」。請用繁體中文回答。
請評估學生寫的 ${label.letter}（${label.zh}）是否恰當。回覆要簡短（2-3句），包含：
1. 一個表情符號開頭：✅ 好的、⚠️ 需改進、或 💡 建議
2. 具體說明哪裡好或哪裡需要改進
3. 如果需要改進，給一個具體的修改建議
不要重複學生的答案。不要使用 Markdown 格式。`
      : `You are a meta-analysis teaching assistant. The student is practicing PICO for: "${scenarioText}".
Evaluate their ${label.letter} (${label.en}). Keep it brief (2-3 sentences):
1. Start with: ✅ Good, ⚠️ Needs improvement, or 💡 Suggestion
2. Be specific about what's good or needs work
3. If improvement needed, give a concrete suggestion
Don't repeat the student's answer. Don't use Markdown formatting.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: `${label.letter} (${lang === "zh" ? label.zh : label.en}): ${inputs[field]}` }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(item => item.text || "").join("") || (lang === "zh" ? "無法取得回饋，請重試。" : "Could not get feedback. Please try again.");
      setFeedback(prev => ({ ...prev, [field]: text }));
    } catch (err) {
      setFeedback(prev => ({ ...prev, [field]: lang === "zh" ? "連線錯誤，請檢查網路後重試。" : "Connection error. Please check your network and try again." }));
    }
    setLoading(prev => ({ ...prev, [field]: false }));
  };

  const checkOverall = async () => {
    const filled = Object.values(inputs).every(v => v.trim());
    if (!filled) return;
    setOverallLoading(true);
    setOverallFeedback(null);

    const scenarioText = scenarioContext[scenario][lang === "zh" ? "zh" : "en"];

    const systemPrompt = lang === "zh"
      ? `你是一位統合分析教學助手。學生為以下主題撰寫了完整的 PICO：「${scenarioText}」。請用繁體中文回答。
請給出整體評估（3-5句），包含：
1. 整體評分：🏆 優秀、👍 良好、📝 需修改
2. PICO 各元素之間的邏輯連貫性
3. 這個 PICO 是否足夠精確到可以用來搜尋文獻
4. 一個最重要的改進建議
不要使用 Markdown 格式。`
      : `You are a meta-analysis teaching assistant. The student wrote a complete PICO for: "${scenarioText}".
Give an overall assessment (3-5 sentences):
1. Rating: 🏆 Excellent, 👍 Good, or 📝 Needs revision
2. Logical coherence between PICO elements
3. Whether this PICO is precise enough for a literature search
4. One key improvement suggestion
Don't use Markdown formatting.`;

    const picoText = `P: ${inputs.p}\nI: ${inputs.i}\nC: ${inputs.c}\nO: ${inputs.o}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: picoText }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(item => item.text || "").join("") || (lang === "zh" ? "無法取得回饋，請重試。" : "Could not get feedback.");
      setOverallFeedback(text);
    } catch (err) {
      setOverallFeedback(lang === "zh" ? "連線錯誤，請檢查網路後重試。" : "Connection error. Please try again.");
    }
    setOverallLoading(false);
  };

  const allFilled = Object.values(inputs).every(v => v.trim());

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      {/* Scenario selector */}
      <h4 style={{ fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 12 }}>{t("c1aiScenario")}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {["A", "B", "C"].map(s => (
          <button key={s} onClick={() => handleScenarioChange(s)} style={{ background: scenario === s ? `${TEAL}0D` : "#FAFAF7", border: `1.5px solid ${scenario === s ? TEAL + "44" : LIGHT_BORDER}`, borderRadius: 12, padding: "12px 16px", textAlign: "left", fontSize: 14, color: scenario === s ? TEAL : DARK, fontWeight: scenario === s ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
            {t(`c1scenario${s}`)}
          </button>
        ))}
      </div>

      {/* PICO fields with AI check */}
      {["p", "i", "c", "o"].map(field => {
        const label = picoLabels[field];
        return (
          <div key={field} style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 6, background: `${label.color}15`, fontSize: 11, fontWeight: 700, color: label.color }}>{label.letter}</span>
              {t(`c1s4Your${field.toUpperCase()}`)}
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <textarea
                value={inputs[field]}
                onChange={(e) => { setInputs(prev => ({ ...prev, [field]: e.target.value })); setFeedback(prev => ({ ...prev, [field]: null })); }}
                placeholder={t(`c1s4Placeholder${field.toUpperCase()}`)}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${LIGHT_BORDER}`, fontSize: 14, lineHeight: 1.6, color: DARK, background: "#FAFAF7", resize: "vertical", minHeight: 48, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
              />
              <button
                onClick={() => checkField(field)}
                disabled={!inputs[field].trim() || loading[field]}
                style={{
                  background: inputs[field].trim() ? `${label.color}12` : "#F5F5F3",
                  border: `1.5px solid ${inputs[field].trim() ? label.color + "33" : LIGHT_BORDER}`,
                  color: inputs[field].trim() ? label.color : "#CCC",
                  borderRadius: 10, padding: "0 14px", fontSize: 12, fontWeight: 600,
                  cursor: inputs[field].trim() ? "pointer" : "default",
                  transition: "all 0.2s", whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 0, minHeight: 48,
                }}
              >
                {loading[field] ? (lang === "zh" ? "分析中…" : "Checking…") : (lang === "zh" ? "AI 檢查" : "AI Check")}
              </button>
            </div>
            {/* Inline AI feedback */}
            {feedback[field] && (
              <div style={{
                marginTop: 8, padding: "12px 16px", borderRadius: 10,
                background: feedback[field].startsWith("✅") ? "#E6F5F0" : feedback[field].startsWith("⚠️") ? "#FFF8E6" : `${TEAL}06`,
                border: `1px solid ${feedback[field].startsWith("✅") ? "#3DA87A22" : feedback[field].startsWith("⚠️") ? "#D4A84322" : TEAL + "18"}`,
                fontSize: 13.5, lineHeight: 1.65, color: MUTED,
                animation: "fadeInUp 0.3s ease-out",
              }}>
                {feedback[field]}
              </div>
            )}
          </div>
        );
      })}

      {/* Overall check button */}
      <div style={{ borderTop: `1px solid ${LIGHT_BORDER}`, paddingTop: 20, marginTop: 8 }}>
        <button
          onClick={checkOverall}
          disabled={!allFilled || overallLoading}
          style={{
            background: allFilled ? TEAL : "#E8E6E1",
            border: "none", color: allFilled ? "#FFF" : MUTED,
            padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: allFilled ? "pointer" : "default",
            transition: "all 0.2s", width: "100%",
            boxShadow: allFilled ? `0 2px 12px ${TEAL}33` : "none",
          }}
        >
          {overallLoading ? (lang === "zh" ? "正在進行整體評估…" : "Running overall assessment…") : (lang === "zh" ? "AI 整體評估我的 PICO" : "AI Overall Assessment")}
        </button>
      </div>

      {/* Overall feedback */}
      {overallFeedback && (
        <div style={{
          marginTop: 16, padding: "18px 20px", borderRadius: 14,
          background: overallFeedback.includes("🏆") ? `${TEAL}08` : overallFeedback.includes("👍") ? "#F0FAF5" : "#FFFAF0",
          border: `1.5px solid ${overallFeedback.includes("🏆") ? TEAL + "22" : overallFeedback.includes("👍") ? "#3DA87A22" : "#D4A84322"}`,
          fontSize: 14, lineHeight: 1.7, color: DARK,
          animation: "fadeInUp 0.3s ease-out",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEAL, marginBottom: 8 }}>{lang === "zh" ? "整體評估" : "Overall Assessment"}</div>
          {overallFeedback}
        </div>
      )}
    </div>
  );
}

// ═══ MAIN COURSE COMPONENT ═══
export default function Course1PICO({ onNavigate }) {
  const { t, lang, toggleLang } = useI18n();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: LIGHT_BG, color: DARK, minHeight: "100vh", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${TEAL}22; color: ${DARK}; }
        @keyframes eggFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes eggShake { 0% { transform: rotate(0); } 20% { transform: rotate(8deg); } 40% { transform: rotate(-8deg); } 60% { transform: rotate(5deg); } 80% { transform: rotate(-3deg); } 100% { transform: rotate(0); } }
        @keyframes eggFreeze { 0% { transform: scale(1); filter: saturate(1) brightness(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); filter: saturate(0.15) brightness(1.35); } }
        @keyframes dinoAppear { 0% { transform: scale(0) translateY(20px); opacity: 0; } 60% { transform: scale(1.1) translateY(-5px); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes sunFall { 0% { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); } 20% { opacity: 1; transform: translateY(20px) scale(1) rotate(30deg); } 80% { opacity: 0.8; transform: translateY(90px) scale(1.1) rotate(180deg); } 100% { opacity: 0; transform: translateY(120px) scale(0.6) rotate(220deg); } }
        @keyframes snowFall { 0% { opacity: 0; transform: translateY(0) translateX(0) rotate(0deg); } 20% { opacity: 1; } 50% { transform: translateY(60px) translateX(10px) rotate(180deg); } 80% { opacity: 0.7; } 100% { opacity: 0; transform: translateY(130px) translateX(-5px) rotate(360deg); } }
        @keyframes glowPulse { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); } }
        textarea:focus { border-color: ${TEAL}66 !important; box-shadow: 0 0 0 3px ${TEAL}0D; }
        @media (max-width: 640px) {
          .pico-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(248,247,244,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${LIGHT_BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onNavigate && (
            <button onClick={() => onNavigate("hub")} style={{ background: "none", border: "none", color: MUTED, fontSize: 13, cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = TEAL} onMouseLeave={(e) => e.target.style.color = MUTED}>
              ←
            </button>
          )}
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: TEAL, background: `${TEAL}0D`, padding: "3px 8px", borderRadius: 5, border: `1px solid ${TEAL}22` }}>{t("c1Label")}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{t("c1Subtitle")}</span>
        </div>
        <button onClick={toggleLang} style={{ background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, color: TEAL, padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.target.style.background = TEAL; e.target.style.color = "#FFF"; }}
          onMouseLeave={(e) => { e.target.style.background = `${TEAL}0D`; e.target.style.color = TEAL; }}>
          {t("langSwitch")}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 100, paddingBottom: 64, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #C8C6C0 0.8px, transparent 0.8px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${CORAL}0A, transparent 70%)`, pointerEvents: "none" }} />
        <FadeIn>
          <div style={{ padding: "0 24px", maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
              {DINO_COLORS.map((c, i) => <DragonEgg key={i} color={c} size={44} state="idle" delay={i * 0.5} />)}
            </div>
            <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: DARK }}>
              {t("c1Title")}
            </h1>
            <p style={{ fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 32px" }}>{t("c1Desc")}</p>
            <button onClick={() => scrollTo("s1")} style={{ ...btnPrimary, padding: "14px 32px", fontSize: 15, borderRadius: 12, boxShadow: `0 4px 20px ${TEAL}33` }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 28px ${TEAL}44`; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 20px ${TEAL}33`; }}>
              {t("c1StartBtn")}
            </button>
          </div>
        </FadeIn>
      </section>

      {/* S1: Why PICO */}
      <section id="s1" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s1Label")} /><SectionTitle>{t("c1s1Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1s1Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
            <FadeIn delay={0.15}>
              <div style={{ background: "#FDEEEB", border: `1px solid ${CORAL}22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: CORAL, marginBottom: 10 }}>{t("c1s1Bad")}</h4>
                <p style={{ fontSize: 17, fontWeight: 600, color: "#B83A20", marginBottom: 10, fontStyle: "italic" }}>{t("c1s1BadEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("c1s1BadWhy")}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ background: "#E6F5F0", border: `1px solid #3DA87A22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10 }}>{t("c1s1Good")}</h4>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10, lineHeight: 1.5 }}>{t("c1s1GoodEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("c1s1GoodWhy")}</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s2")} style={btnPrimary}>{t("c1s1Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S2: PICO Elements */}
      <section id="s2" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s2Label")} /><SectionTitle>{t("c1s2Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1s2Intro")}</Paragraph></FadeIn>
          <div className="pico-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
            <PicoCard letter="P" color={CORAL} title={t("c1pTitle")} desc={t("c1pDesc")} example={t("c1pExample")} tip={t("c1pTip")} delay={0.1} />
            <PicoCard letter="I" color="#7B68C8" title={t("c1iTitle")} desc={t("c1iDesc")} example={t("c1iExample")} tip={t("c1iTip")} delay={0.15} />
            <PicoCard letter="C" color="#D4A843" title={t("c1cTitle")} desc={t("c1cDesc")} example={t("c1cExample")} tip={t("c1cTip")} delay={0.2} />
            <PicoCard letter="O" color="#5B9E5F" title={t("c1oTitle")} desc={t("c1oDesc")} example={t("c1oExample")} tip={t("c1oTip")} delay={0.25} />
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s3")} style={btnPrimary}>{t("c1s2Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S3: PICOS */}
      <section id="s3" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s3Label")} /><SectionTitle>{t("c1s3Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c1s3Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 16, padding: "28px 24px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${TEAL}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: TEAL }}>S</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK }}>{t("c1sTitle")}</h3>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: MUTED, marginBottom: 16 }}>{t("c1sDesc")}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>{t("c1sOptions")}</p>
              {[{ text: t("c1sRCT"), color: "#2A7A5A", bg: "#E6F5F0" }, { text: t("c1sCohort"), color: "#7B68C8", bg: "#F0EDF8" }, { text: t("c1sCaseControl"), color: "#D4A843", bg: "#FDF8EC" }, { text: t("c1sAny"), color: MUTED, bg: "#F5F5F3" }].map((item, i) => (
                <div key={i} style={{ background: item.bg, borderRadius: 8, padding: "8px 14px", marginBottom: 6, fontSize: 13.5, color: item.color, fontWeight: 500, lineHeight: 1.5 }}>{item.text}</div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: TEAL }}>💡 {t("c1s3Tip")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s4")} style={btnPrimary}>{t("c1s3Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S4: Common Mistakes (moved before Interactive Builder) */}
      <section id="s4" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s5Label")} /><SectionTitle>{t("c1s5Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1s5Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <TrapCard key={n} number={n} title={t(`c1trap${n}Title`)} bad={t(`c1trap${n}Bad`)} good={t(`c1trap${n}Good`)} delay={n * 0.05} />
            ))}
          </div>
          <FadeIn delay={0.35}><div style={{ textAlign: "center", marginTop: 32 }}><button onClick={() => scrollTo("s5")} style={btnPrimary}>{t("c1s4Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S5: Interactive Builder (moved after Common Mistakes) */}
      <section id="s5" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s4Label")} /><SectionTitle>{t("c1s4Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1s4Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><PicoBuilder t={t} lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("game")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>{t("c1s5Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* GAME */}
      <section id="game" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1gameLabel")} /></FadeIn>
          <FadeIn delay={0.1}><DinoEggHatch t={t} lang={lang} /></FadeIn>
        </div>
      </section>

      {/* AI PICO WORKSHOP */}
      <section id="ai-workshop" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1aiLabel")} /><SectionTitle>{t("c1aiTitle")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1aiDesc")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><AIPicoWorkshop t={t} lang={lang} /></FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG }}>
        {onNavigate && (
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("course0")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "← 回到 Course 0" : "← Back to Course 0"}
            </button>
            <button onClick={() => onNavigate("hub")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "課程總覽" : "Course Hub"}
            </button>
            <button onClick={() => onNavigate("course2")} style={{ background: TEAL, border: "none", color: "#FFF", padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: `0 2px 12px ${TEAL}33`, opacity: 0.5, cursor: "default" }}>
              {lang === "zh" ? "Course 2：即將推出" : "Course 2: Coming Soon"}
            </button>
          </div>
        )}
        <p style={{ fontSize: 13, color: "#B0AFAA", lineHeight: 1.8 }}>Meta-Analysis 101 — {t("c1Label")}: {t("c1Subtitle")}</p>
        <div style={{ marginTop: 12, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>統合分析 101</div>
      </footer>
    </div>
  );
}

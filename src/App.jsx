import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";

const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function Section({ id, children, accent = false }) {
  return (
    <section id={id} style={{ padding: "100px 24px", background: accent ? "#F1F0EC" : LIGHT_BG, position: "relative" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ text }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 24, height: 2, background: TEAL, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: TEAL, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 640, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", ...style }}>{children}</p>;
}

const btnPrimary = { background: TEAL, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", transition: "all 0.2s" };
const btnSecondary = { background: "transparent", border: `1.5px solid ${TEAL}`, color: TEAL, padding: "11px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" };

// ═══ STUDY COMBINER ═══
function StudyCombiner() {
  const { t } = useI18n();
  const [phase, setPhase] = useState("scattered");
  const [hoveredStudy, setHoveredStudy] = useState(null);
  const studies = [
    { id: 1, label: "Study A", effect: 0.35, n: 45, color: "#4EAAB3", descKey: "studyADesc" },
    { id: 2, label: "Study B", effect: -0.10, n: 120, color: "#E8734A", descKey: "studyBDesc" },
    { id: 3, label: "Study C", effect: 0.52, n: 30, color: "#7B68C8", descKey: "studyCDesc" },
    { id: 4, label: "Study D", effect: 0.20, n: 200, color: "#D4A843", descKey: "studyDDesc" },
    { id: 5, label: "Study E", effect: 0.41, n: 65, color: "#5B9E5F", descKey: "studyEDesc" },
  ];
  const totalW = studies.reduce((s, st) => s + st.n, 0);
  const pooled = studies.reduce((s, st) => s + st.effect * st.n, 0) / totalW;
  const scatteredPositions = [{ x: 12, y: 18 }, { x: 68, y: 12 }, { x: 28, y: 62 }, { x: 74, y: 58 }, { x: 46, y: 35 }];
  const reset = () => setPhase("scattered");
  const combine = () => { setPhase("combining"); setTimeout(() => setPhase("combined"), 1200); };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 6 }}>
          {phase === "scattered" && t("combinerScattered")}
          {phase === "combining" && t("combinerCombining")}
          {phase === "combined" && t("combinerCombined")}
        </h3>
        <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
          {phase === "scattered" && t("combinerScatteredDesc")}
          {phase === "combining" && t("combinerCombiningDesc")}
          {phase === "combined" && t("combinerCombinedDesc", pooled.toFixed(2))}
        </p>
      </div>
      <div style={{ position: "relative", height: 260, background: "#FAFAF7", borderRadius: 14, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 16px", fontSize: 10, color: "#B0AFAA", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
          <span>{t("combinerNegative")}</span><span>{t("combinerPositive")}</span>
        </div>
        <div style={{ position: "absolute", left: "50%", top: 16, bottom: 28, width: 1, background: "#DDD", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: 6, transform: "translateX(-50%)", fontSize: 9, color: "#BBB", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{t("combinerNoEffect")}</div>
        {studies.map((st, i) => {
          const scattered = scatteredPositions[i];
          const effectX = 50 + st.effect * 60;
          let x, y, size;
          if (phase === "scattered") { x = scattered.x; y = scattered.y; size = 20 + st.n / 8; }
          else if (phase === "combining") { x = effectX; y = 42; size = 16 + st.n / 6; }
          else { x = 50 + pooled * 60; y = 42; size = 16 + st.n / 6; }
          return (
            <div key={st.id} onMouseEnter={() => setHoveredStudy(i)} onMouseLeave={() => setHoveredStudy(null)}
              style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: "50%", background: phase === "combined" ? TEAL : st.color, opacity: phase === "combined" ? 0.7 : 0.85, transform: "translate(-50%, -50%)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)", cursor: "pointer", boxShadow: hoveredStudy === i ? `0 0 0 4px ${st.color}33, 0 4px 16px ${st.color}33` : `0 2px 8px ${st.color}22`, zIndex: hoveredStudy === i ? 10 : 1 }} />
          );
        })}
        {phase === "combined" && (
          <div style={{ position: "absolute", left: `${50 + pooled * 60}%`, top: "42%", transform: "translate(-50%, -50%) rotate(45deg)", width: 28, height: 28, background: TEAL, borderRadius: 4, boxShadow: `0 4px 20px ${TEAL}44`, animation: "popIn 0.5s ease-out" }} />
        )}
        {hoveredStudy !== null && phase === "scattered" && (
          <div style={{ position: "absolute", left: `${scatteredPositions[hoveredStudy].x}%`, top: `${scatteredPositions[hoveredStudy].y - 14}%`, transform: "translateX(-50%)", background: DARK, color: "#FFF", borderRadius: 10, padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", zIndex: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", pointerEvents: "none" }}>
            <strong>{studies[hoveredStudy].label}</strong> (n={studies[hoveredStudy].n})<br />{t(studies[hoveredStudy].descKey)}
          </div>
        )}
        <style>{`@keyframes popIn { from { transform: translate(-50%, -50%) rotate(45deg) scale(0); opacity: 0; } to { transform: translate(-50%, -50%) rotate(45deg) scale(1); opacity: 1; } }`}</style>
      </div>
      {phase === "scattered" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 16, fontSize: 12, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
          {studies.map((st) => (
            <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: st.color }} />
              {st.label} (n={st.n}, effect={st.effect > 0 ? "+" : ""}{st.effect.toFixed(2)})
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {phase === "scattered" && <button onClick={combine} style={btnPrimary}>{t("combinerCombineBtn")}</button>}
        {phase === "combined" && <button onClick={reset} style={btnSecondary}>{t("combinerResetBtn")}</button>}
      </div>
    </div>
  );
}

// ═══ INTERACTIVE FOREST PLOT ═══
function ForestPlotExplainer() {
  const { t } = useI18n();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const studies = [
    { name: "Martinez 2018", effect: -0.32, ci: [-0.61, -0.03], weight: 12 },
    { name: "Johnson 2019", effect: -0.18, ci: [-0.44, 0.08], weight: 20 },
    { name: "Chen 2020", effect: -0.45, ci: [-0.78, -0.12], weight: 8 },
    { name: "Williams 2021", effect: -0.27, ci: [-0.49, -0.05], weight: 28 },
    { name: "Kim 2021", effect: 0.05, ci: [-0.28, 0.38], weight: 7 },
    { name: "Patel 2022", effect: -0.38, ci: [-0.58, -0.18], weight: 25 },
  ];
  const pooled = { effect: -0.27, ci: [-0.40, -0.14] };
  const xMin = -1.0, xMax = 0.6;
  const toX = (val) => ((val - xMin) / (xMax - xMin)) * 100;
  const explanations = {
    square: { titleKey: "forestSquareTitle", textKey: "forestSquareText" },
    line: { titleKey: "forestLineTitle", textKey: "forestLineText" },
    center: { titleKey: "forestCenterTitle", textKey: "forestCenterText" },
    diamond: { titleKey: "forestDiamondTitle", textKey: "forestDiamondText" },
  };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h3 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 6 }}>{t("forestTitle")}</h3>
        <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{t("forestClickHint").replace("👆 ", "")}</p>
      </div>
      <div style={{ minHeight: 72, padding: "12px 16px", marginBottom: 16, background: activeTooltip ? `${TEAL}08` : "transparent", borderRadius: 12, transition: "all 0.3s", border: activeTooltip ? `1px solid ${TEAL}22` : "1px solid transparent" }}>
        {activeTooltip ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEAL, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", marginBottom: 4 }}>{t(explanations[activeTooltip].titleKey)}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{t(explanations[activeTooltip].textKey)}</div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: "#B0AFAA", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", textAlign: "center", paddingTop: 8 }}>
            {t("forestClickHint")}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: 120, marginRight: 8, marginBottom: 6, fontSize: 10, color: "#B0AFAA", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
        <span>{t("forestFavorsTreatment")}</span><span>{t("forestFavorsControl")}</span>
      </div>
      <div style={{ position: "relative" }}>
        {studies.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: 40, padding: "0 4px" }}>
            <div style={{ width: 116, fontSize: 13, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{s.name}</div>
            <div style={{ flex: 1, position: "relative", height: "100%" }}>
              <div onClick={() => setActiveTooltip(activeTooltip === "center" ? null : "center")} style={{ position: "absolute", left: `${toX(0)}%`, top: 0, bottom: 0, width: activeTooltip === "center" ? 3 : 1, background: activeTooltip === "center" ? CORAL : "#DDD", cursor: "pointer", zIndex: 5, padding: "0 6px", backgroundClip: "content-box", transition: "all 0.3s" }} />
              <div onClick={() => setActiveTooltip(activeTooltip === "line" ? null : "line")} style={{ position: "absolute", left: `${toX(s.ci[0])}%`, width: `${toX(s.ci[1]) - toX(s.ci[0])}%`, top: "50%", height: activeTooltip === "line" ? 3 : 2, background: activeTooltip === "line" ? CORAL : TEAL, transform: "translateY(-50%)", cursor: "pointer", transition: "all 0.3s", borderRadius: 1 }} />
              <div onClick={() => setActiveTooltip(activeTooltip === "square" ? null : "square")} style={{ position: "absolute", left: `${toX(s.effect)}%`, top: "50%", width: Math.max(10, s.weight * 0.6), height: Math.max(10, s.weight * 0.6), background: activeTooltip === "square" ? CORAL : TEAL, borderRadius: 3, transform: "translate(-50%, -50%)", cursor: "pointer", transition: "all 0.3s", boxShadow: activeTooltip === "square" ? `0 0 0 3px ${CORAL}33` : "none" }} />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", height: 44, marginTop: 4, borderTop: `1px solid ${LIGHT_BORDER}`, paddingTop: 8 }}>
          <div style={{ width: 116, fontSize: 13, fontWeight: 700, color: TEAL, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{t("forestOverall")}</div>
          <div style={{ flex: 1, position: "relative", height: "100%" }}>
            <div style={{ position: "absolute", left: `${toX(0)}%`, top: 0, bottom: 0, width: 1, background: "#DDD" }} />
            <svg onClick={() => setActiveTooltip(activeTooltip === "diamond" ? null : "diamond")} style={{ position: "absolute", left: `${toX(pooled.ci[0])}%`, top: "50%", width: `${toX(pooled.ci[1]) - toX(pooled.ci[0])}%`, height: 22, transform: "translateY(-50%)", overflow: "visible", cursor: "pointer" }} viewBox="0 0 100 22" preserveAspectRatio="none">
              <polygon points="0,11 50,1 100,11 50,21" fill={activeTooltip === "diamond" ? CORAL : TEAL} style={{ transition: "fill 0.3s" }} />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginLeft: 120, justifyContent: "space-between", marginTop: 10, fontSize: 10, color: "#C0BFB9", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
        {[-1.0, -0.6, -0.2, 0, 0.2, 0.6].map((v) => <span key={v}>{v.toFixed(1)}</span>)}
      </div>
    </div>
  );
}

// ═══ EGG HUNT GAME ═══
const EGG_COLORS = {
  "what-why": "#2ECC71",
  "data": "#3498DB",
  "forest": "#F1C40F",
  "heterogeneity": "#E74C3C",
  "search": "#9B59B6",
  "bias": "#E67E22",
  "interpretation": "#95A5A6",
};

const EGG_CATEGORIES = [
  { id: "what-why", nameKey: "eggCatDiscovery", sheetKey: "eggSheetDiscovery", sheetLink: "#cheatsheet-discovery" },
  { id: "data", nameKey: "eggCatData", sheetKey: "eggSheetData", sheetLink: "#cheatsheet-data" },
  { id: "forest", nameKey: "eggCatForest", sheetKey: "eggSheetForest", sheetLink: "#cheatsheet-forest" },
  { id: "heterogeneity", nameKey: "eggCatVariety", sheetKey: "eggSheetVariety", sheetLink: "#cheatsheet-heterogeneity" },
  { id: "search", nameKey: "eggCatSearch", sheetKey: "eggSheetSearch", sheetLink: "#cheatsheet-search" },
  { id: "bias", nameKey: "eggCatBias", sheetKey: "eggSheetBias", sheetLink: "#cheatsheet-bias" },
  { id: "interpretation", nameKey: "eggCatWisdom", sheetKey: "eggSheetWisdom", sheetLink: "#cheatsheet-interpretation" },
];

function getEggQuestions(t) {
  return [
    { id: "WW-01", category: "what-why", q: t("eggQ_WW01"), opts: [t("eggQ_WW01_A"), t("eggQ_WW01_B"), t("eggQ_WW01_C"), t("eggQ_WW01_D")], correct: 1, explanation: t("eggQ_WW01_Exp") },
    { id: "WW-02", category: "what-why", q: t("eggQ_WW02"), opts: [t("eggQ_WW02_A"), t("eggQ_WW02_B"), t("eggQ_WW02_C"), t("eggQ_WW02_D")], correct: 2, explanation: t("eggQ_WW02_Exp") },
    { id: "WW-03", category: "what-why", q: t("eggQ_WW03"), opts: [t("eggQ_WW03_A"), t("eggQ_WW03_B"), t("eggQ_WW03_C"), t("eggQ_WW03_D")], correct: 1, explanation: t("eggQ_WW03_Exp") },
    { id: "WW-04", category: "what-why", q: t("eggQ_WW04"), opts: [t("eggQ_WW04_A"), t("eggQ_WW04_B"), t("eggQ_WW04_C"), t("eggQ_WW04_D")], correct: 2, explanation: t("eggQ_WW04_Exp") },
    { id: "WW-05", category: "what-why", q: t("eggQ_WW05"), opts: [t("eggQ_WW05_A"), t("eggQ_WW05_B"), t("eggQ_WW05_C"), t("eggQ_WW05_D")], correct: 2, explanation: t("eggQ_WW05_Exp") },
    { id: "DE-01", category: "data", q: t("eggQ_DE01"), opts: [t("eggQ_DE01_A"), t("eggQ_DE01_B"), t("eggQ_DE01_C"), t("eggQ_DE01_D")], correct: 1, explanation: t("eggQ_DE01_Exp") },
    { id: "DE-02", category: "data", q: t("eggQ_DE02"), opts: [t("eggQ_DE02_A"), t("eggQ_DE02_B"), t("eggQ_DE02_C"), t("eggQ_DE02_D")], correct: 1, explanation: t("eggQ_DE02_Exp") },
    { id: "DE-03", category: "data", q: t("eggQ_DE03"), opts: [t("eggQ_DE03_A"), t("eggQ_DE03_B"), t("eggQ_DE03_C"), t("eggQ_DE03_D")], correct: 2, explanation: t("eggQ_DE03_Exp") },
    { id: "DE-04", category: "data", q: t("eggQ_DE04"), opts: [t("eggQ_DE04_A"), t("eggQ_DE04_B"), t("eggQ_DE04_C"), t("eggQ_DE04_D")], correct: 2, explanation: t("eggQ_DE04_Exp") },
    { id: "DE-05", category: "data", q: t("eggQ_DE05"), opts: [t("eggQ_DE05_A"), t("eggQ_DE05_B"), t("eggQ_DE05_C"), t("eggQ_DE05_D")], correct: 2, explanation: t("eggQ_DE05_Exp") },
    { id: "FP-01", category: "forest", q: t("eggQ_FP01"), opts: [t("eggQ_FP01_A"), t("eggQ_FP01_B"), t("eggQ_FP01_C"), t("eggQ_FP01_D")], correct: 1, explanation: t("eggQ_FP01_Exp") },
    { id: "FP-02", category: "forest", q: t("eggQ_FP02"), opts: [t("eggQ_FP02_A"), t("eggQ_FP02_B"), t("eggQ_FP02_C"), t("eggQ_FP02_D")], correct: 1, explanation: t("eggQ_FP02_Exp") },
    { id: "FP-03", category: "forest", q: t("eggQ_FP03"), opts: [t("eggQ_FP03_A"), t("eggQ_FP03_B"), t("eggQ_FP03_C"), t("eggQ_FP03_D")], correct: 2, explanation: t("eggQ_FP03_Exp") },
    { id: "FP-04", category: "forest", q: t("eggQ_FP04"), opts: [t("eggQ_FP04_A"), t("eggQ_FP04_B"), t("eggQ_FP04_C"), t("eggQ_FP04_D")], correct: 1, explanation: t("eggQ_FP04_Exp") },
    { id: "FP-05", category: "forest", q: t("eggQ_FP05"), opts: [t("eggQ_FP05_A"), t("eggQ_FP05_B"), t("eggQ_FP05_C"), t("eggQ_FP05_D")], correct: 1, explanation: t("eggQ_FP05_Exp") },
    { id: "HT-01", category: "heterogeneity", q: t("eggQ_HT01"), opts: [t("eggQ_HT01_A"), t("eggQ_HT01_B"), t("eggQ_HT01_C"), t("eggQ_HT01_D")], correct: 2, explanation: t("eggQ_HT01_Exp") },
    { id: "HT-02", category: "heterogeneity", q: t("eggQ_HT02"), opts: [t("eggQ_HT02_A"), t("eggQ_HT02_B"), t("eggQ_HT02_C"), t("eggQ_HT02_D")], correct: 1, explanation: t("eggQ_HT02_Exp") },
    { id: "HT-03", category: "heterogeneity", q: t("eggQ_HT03"), opts: [t("eggQ_HT03_A"), t("eggQ_HT03_B"), t("eggQ_HT03_C"), t("eggQ_HT03_D")], correct: 1, explanation: t("eggQ_HT03_Exp") },
    { id: "HT-04", category: "heterogeneity", q: t("eggQ_HT04"), opts: [t("eggQ_HT04_A"), t("eggQ_HT04_B"), t("eggQ_HT04_C"), t("eggQ_HT04_D")], correct: 2, explanation: t("eggQ_HT04_Exp") },
    { id: "HT-05", category: "heterogeneity", q: t("eggQ_HT05"), opts: [t("eggQ_HT05_A"), t("eggQ_HT05_B"), t("eggQ_HT05_C"), t("eggQ_HT05_D")], correct: 1, explanation: t("eggQ_HT05_Exp") },
    { id: "SS-01", category: "search", q: t("eggQ_SS01"), opts: [t("eggQ_SS01_A"), t("eggQ_SS01_B"), t("eggQ_SS01_C"), t("eggQ_SS01_D")], correct: 1, explanation: t("eggQ_SS01_Exp") },
    { id: "SS-02", category: "search", q: t("eggQ_SS02"), opts: [t("eggQ_SS02_A"), t("eggQ_SS02_B"), t("eggQ_SS02_C"), t("eggQ_SS02_D")], correct: 1, explanation: t("eggQ_SS02_Exp") },
    { id: "SS-03", category: "search", q: t("eggQ_SS03"), opts: [t("eggQ_SS03_A"), t("eggQ_SS03_B"), t("eggQ_SS03_C"), t("eggQ_SS03_D")], correct: 1, explanation: t("eggQ_SS03_Exp") },
    { id: "SS-04", category: "search", q: t("eggQ_SS04"), opts: [t("eggQ_SS04_A"), t("eggQ_SS04_B"), t("eggQ_SS04_C"), t("eggQ_SS04_D")], correct: 2, explanation: t("eggQ_SS04_Exp") },
    { id: "SS-05", category: "search", q: t("eggQ_SS05"), opts: [t("eggQ_SS05_A"), t("eggQ_SS05_B"), t("eggQ_SS05_C"), t("eggQ_SS05_D")], correct: 1, explanation: t("eggQ_SS05_Exp") },
    { id: "BQ-01", category: "bias", q: t("eggQ_BQ01"), opts: [t("eggQ_BQ01_A"), t("eggQ_BQ01_B"), t("eggQ_BQ01_C"), t("eggQ_BQ01_D")], correct: 1, explanation: t("eggQ_BQ01_Exp") },
    { id: "BQ-02", category: "bias", q: t("eggQ_BQ02"), opts: [t("eggQ_BQ02_A"), t("eggQ_BQ02_B"), t("eggQ_BQ02_C"), t("eggQ_BQ02_D")], correct: 1, explanation: t("eggQ_BQ02_Exp") },
    { id: "BQ-03", category: "bias", q: t("eggQ_BQ03"), opts: [t("eggQ_BQ03_A"), t("eggQ_BQ03_B"), t("eggQ_BQ03_C"), t("eggQ_BQ03_D")], correct: 1, explanation: t("eggQ_BQ03_Exp") },
    { id: "BQ-04", category: "bias", q: t("eggQ_BQ04"), opts: [t("eggQ_BQ04_A"), t("eggQ_BQ04_B"), t("eggQ_BQ04_C"), t("eggQ_BQ04_D")], correct: 1, explanation: t("eggQ_BQ04_Exp") },
    { id: "BQ-05", category: "bias", q: t("eggQ_BQ05"), opts: [t("eggQ_BQ05_A"), t("eggQ_BQ05_B"), t("eggQ_BQ05_C"), t("eggQ_BQ05_D")], correct: 1, explanation: t("eggQ_BQ05_Exp") },
    { id: "IN-01", category: "interpretation", q: t("eggQ_IN01"), opts: [t("eggQ_IN01_A"), t("eggQ_IN01_B"), t("eggQ_IN01_C"), t("eggQ_IN01_D")], correct: 1, explanation: t("eggQ_IN01_Exp") },
    { id: "IN-02", category: "interpretation", q: t("eggQ_IN02"), opts: [t("eggQ_IN02_A"), t("eggQ_IN02_B"), t("eggQ_IN02_C"), t("eggQ_IN02_D")], correct: 1, explanation: t("eggQ_IN02_Exp") },
    { id: "IN-03", category: "interpretation", q: t("eggQ_IN03"), opts: [t("eggQ_IN03_A"), t("eggQ_IN03_B"), t("eggQ_IN03_C"), t("eggQ_IN03_D")], correct: 0, explanation: t("eggQ_IN03_Exp") },
    { id: "IN-04", category: "interpretation", q: t("eggQ_IN04"), opts: [t("eggQ_IN04_A"), t("eggQ_IN04_B"), t("eggQ_IN04_C"), t("eggQ_IN04_D")], correct: 1, explanation: t("eggQ_IN04_Exp") },
    { id: "IN-05", category: "interpretation", q: t("eggQ_IN05"), opts: [t("eggQ_IN05_A"), t("eggQ_IN05_B"), t("eggQ_IN05_C"), t("eggQ_IN05_D")], correct: 1, explanation: t("eggQ_IN05_Exp") },
  ];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function selectQuestions(t) {
  const all = getEggQuestions(t);
  const cats = shuffle(["what-why", "data", "forest", "heterogeneity", "search", "bias", "interpretation"]).slice(0, 5);
  return cats.map(cat => {
    const pool = all.filter(q => q.category === cat);
    return pool[Math.floor(Math.random() * pool.length)];
  });
}

function EggHuntGame() {
  const { t } = useI18n();
  const [phase, setPhase] = useState("welcome"); // welcome | playing | results
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]); // { category, correct, catObj }
  const [cracked, setCracked] = useState(false);

  const startHunt = () => {
    const qs = selectQuestions(t);
    setQuestions(qs);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    setCracked(false);
    setPhase("playing");
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setCracked(true);
    const isCorrect = idx === questions[current].correct;
    setResults(prev => [...prev, { category: questions[current].category, correct: isCorrect }]);
  };

  const nextEgg = () => {
    if (current < 4) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setCracked(false);
    } else {
      setPhase("results");
    }
  };

  const score = results.filter(r => r.correct).length;
  const catObj = (catId) => EGG_CATEGORIES.find(c => c.id === catId);
  const font = "'Noto Sans TC', 'Outfit', sans-serif";
  const serifFont = "'Noto Sans TC', 'Source Serif 4', serif";

  // Welcome screen
  if (phase === "welcome") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 28 }}>
          {[EGG_COLORS["what-why"], EGG_COLORS["data"], EGG_COLORS["forest"], EGG_COLORS["heterogeneity"], EGG_COLORS["search"]].map((color, i) => (
            <div key={i} style={{ width: 40, height: 52, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: `${color}22`, border: `2px dashed ${color}55`, transition: "all 0.3s", animation: `eggBob 2s ease-in-out ${i * 0.3}s infinite` }} />
          ))}
        </div>
        <h3 style={{ fontFamily: serifFont, fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 10 }}>
          {t("eggHuntTitle")}
        </h3>
        <p style={{ fontSize: 15, color: MUTED, fontFamily: font, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
          {t("eggHuntDesc")}
        </p>
        <button onClick={startHunt} style={{ ...btnPrimary, padding: "14px 32px", fontSize: 16 }}>{t("eggHuntStart")}</button>
        <style>{`@keyframes eggBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
      </div>
    );
  }

  // Results screen
  if (phase === "results") {
    const tier = score >= 5 ? "master" : score >= 4 ? "explorer" : score >= 3 ? "apprentice" : "keep";
    const tierEmoji = score >= 5 ? "\uD83C\uDFC6" : score >= 4 ? "\uD83E\uDD48" : score >= 3 ? "\uD83E\uDD49" : "\uD83D\uDD0D";
    const tierLabel = score >= 5 ? t("eggHuntMaster") : score >= 4 ? t("eggHuntExplorer") : score >= 3 ? t("eggHuntApprentice") : t("eggHuntKeepTrying");
    const unlockAll = score >= 4;

    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "40px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{tierEmoji}</div>
          <h3 style={{ fontFamily: serifFont, fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 8 }}>{tierLabel}</h3>
          <p style={{ fontSize: 17, color: TEAL, fontWeight: 600, fontFamily: font }}>{t("eggHuntScore", score)}</p>
        </div>

        {/* Basket */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          {results.map((r, i) => {
            const cat = catObj(r.category);
            const color = EGG_COLORS[r.category];
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 48, height: 62, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  background: r.correct ? color : "#DDD",
                  opacity: r.correct ? 1 : 0.4,
                  margin: "0 auto 6px",
                  boxShadow: r.correct ? `0 4px 12px ${color}33` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                  transition: "all 0.3s",
                }}>
                  {r.correct ? "" : "💔"}
                </div>
                <span style={{ fontSize: 11, color: r.correct ? DARK : MUTED, fontFamily: font, fontWeight: r.correct ? 600 : 400 }}>
                  {t(cat.nameKey)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cheat sheet downloads */}
        {score >= 3 && (
          <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}1A`, borderRadius: 14, padding: "20px 22px", marginBottom: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 12, fontFamily: font }}>
              {t("eggHuntDownload")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {results.map((r, i) => {
                const cat = catObj(r.category);
                const color = EGG_COLORS[r.category];
                const canDownload = unlockAll || r.correct;
                return (
                  <a key={i} href={cat.sheetLink} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    background: canDownload ? CARD_BG : "#F5F5F3", borderRadius: 10,
                    border: `1px solid ${canDownload ? color + "44" : LIGHT_BORDER}`,
                    textDecoration: "none", opacity: canDownload ? 1 : 0.5,
                    pointerEvents: canDownload ? "auto" : "none",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ width: 28, height: 36, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: canDownload ? color : "#DDD", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: canDownload ? DARK : MUTED, fontFamily: font }}>{t(cat.sheetKey)}</div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: font }}>{t(cat.nameKey)}</div>
                    </div>
                    {canDownload && <span style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>↓</span>}
                  </a>
                );
              })}
              {score >= 5 && (
                <a href="#cheatsheet-combined" style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                  background: `${TEAL}0D`, borderRadius: 10, border: `1.5px solid ${TEAL}33`,
                  textDecoration: "none", marginTop: 4, transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: 20 }}>{"\uD83C\uDFC6"}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEAL, fontFamily: font }}>{t("eggHuntAllSheets")}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: TEAL, fontWeight: 600 }}>↓</span>
                </a>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <button onClick={startHunt} style={btnPrimary}>{t("eggHuntPlayAgain")}</button>
        </div>
      </div>
    );
  }

  // Playing phase
  const q = questions[current];
  const cat = catObj(q.category);
  const eggColor = EGG_COLORS[q.category];
  const isCorrect = selected !== null && selected === q.correct;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      {/* Progress eggs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: MUTED, fontFamily: font }}>{t("eggHuntProgress", current + 1)}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const pastResult = results[i];
            let bg = "#E8E6E1";
            if (i < current) bg = pastResult?.correct ? EGG_COLORS[pastResult.category] : "#DDD";
            else if (i === current) bg = eggColor;
            return (
              <div key={i} style={{
                width: 20, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: bg, opacity: i <= current ? 1 : 0.4,
                transition: "all 0.3s",
                boxShadow: i === current ? `0 2px 8px ${eggColor}44` : "none",
              }} />
            );
          })}
        </div>
      </div>

      {/* Egg display */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{
          width: 64, height: 82, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          background: cracked && !isCorrect && answered ? "#DDD" : eggColor,
          margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 16px ${eggColor}33`,
          animation: cracked ? (isCorrect ? "eggCollect 0.6s ease-out" : "eggCrack 0.5s ease-out") : "none",
          position: "relative",
          transition: "background 0.3s",
        }}>
          {cracked && answered && (
            <span style={{ fontSize: 24 }}>{isCorrect ? "✓" : "✗"}</span>
          )}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: eggColor, fontFamily: font, letterSpacing: 1, textTransform: "uppercase" }}>
          {t(cat.nameKey)}
        </span>
      </div>

      {/* Question */}
      <h3 style={{ fontFamily: serifFont, fontSize: 19, fontWeight: 600, color: DARK, marginBottom: 18, lineHeight: 1.45 }}>{q.q}</h3>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {q.opts.map((opt, idx) => {
          let bg = "#FAFAF7", border = LIGHT_BORDER, color = DARK;
          if (answered) {
            if (idx === q.correct) { bg = "#E6F5F0"; border = "#3DA87A"; color = "#2A7A5A"; }
            else if (idx === selected && idx !== q.correct) { bg = "#FDEEEB"; border = "#D94B2E"; color = "#B83A20"; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{
              background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
              padding: "14px 18px", textAlign: "left", fontSize: 15, color,
              fontFamily: font, cursor: answered ? "default" : "pointer",
              transition: "all 0.2s", fontWeight: answered && idx === q.correct ? 600 : 400,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${border}`,
                fontSize: 12, fontWeight: 600, marginRight: 12,
                background: answered && idx === q.correct ? "#3DA87A" : "transparent",
                color: answered && idx === q.correct ? "#FFF" : color,
              }}>{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div style={{
          background: isCorrect ? "#E6F5F0" : "#FDEEEB", borderRadius: 12,
          padding: "14px 18px", marginBottom: 16, fontSize: 14, lineHeight: 1.65,
          color: MUTED, fontFamily: font,
          border: `1px solid ${isCorrect ? "#3DA87A33" : "#D94B2E33"}`,
        }}>
          <strong style={{ color: isCorrect ? "#2A7A5A" : "#B83A20" }}>
            {isCorrect ? t("eggHuntCorrect", t(cat.nameKey)) : t("eggHuntWrong")}
          </strong>{" "}
          {q.explanation}
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div style={{ textAlign: "right" }}>
          <button onClick={nextEgg} style={btnPrimary}>
            {current < 4 ? t("eggHuntNext") : t("eggHuntResults")}
          </button>
        </div>
      )}

      <style>{`
        @keyframes eggCollect {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes eggCrack {
          0% { transform: scale(1); }
          30% { transform: scale(1.1) rotate(5deg); }
          60% { transform: scale(0.95) rotate(-3deg); }
          100% { transform: scale(1) rotate(0); }
        }
      `}</style>
    </div>
  );
}

// ═══ METHOD STEP ═══
function MethodStep({ number, title, analogy, details, isOpen, onClick, thinkOfIt }) {
  return (
    <div onClick={onClick} style={{ background: CARD_BG, border: `1px solid ${isOpen ? `${TEAL}33` : LIGHT_BORDER}`, borderRadius: 16, padding: "22px 24px", cursor: "pointer", transition: "all 0.35s", boxShadow: isOpen ? `0 4px 24px ${TEAL}0D` : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ minWidth: 44, height: 44, borderRadius: 12, background: isOpen ? TEAL : "#F1F0EC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 18, fontWeight: 700, color: isOpen ? "#FFF" : MUTED, transition: "all 0.35s" }}>{number}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: DARK, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", margin: 0 }}>{title}</h3>
          {!isOpen && <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#B0AFAA", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{analogy}</p>}
        </div>
        <span style={{ fontSize: 18, color: isOpen ? TEAL : "#C0BFB9", transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.35s", fontWeight: 300 }}>+</span>
      </div>
      {isOpen && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${LIGHT_BORDER}` }}>
          <div style={{ background: `${TEAL}08`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13.5, color: TEAL, lineHeight: 1.6, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", fontStyle: "italic" }}>{thinkOfIt}{analogy}</div>
          {details.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: TEAL, fontSize: 7, marginTop: 7 }}>●</span>
              <span style={{ fontSize: 14, lineHeight: 1.65, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{d}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══ MAIN APP ═══
export default function MetaAnalysisGuide() {
  const { t, lang, toggleLang } = useI18n();
  const [openStep, setOpenStep] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const navItems = [{ id: "what", label: t("navWhat") }, { id: "why", label: t("navWhy") }, { id: "combiner", label: t("navDemo") }, { id: "how", label: t("navHow") }, { id: "tools", label: t("navPlots") }, { id: "quiz", label: t("navQuiz") }];

  const steps = [
    { title: t("step1Title"), analogy: t("step1Analogy"), details: [t("step1Detail1"), t("step1Detail2"), t("step1Detail3"), t("step1Detail4")] },
    { title: t("step2Title"), analogy: t("step2Analogy"), details: [t("step2Detail1"), t("step2Detail2"), t("step2Detail3"), t("step2Detail4")] },
    { title: t("step3Title"), analogy: t("step3Analogy"), details: [t("step3Detail1"), t("step3Detail2"), t("step3Detail3"), t("step3Detail4")] },
    { title: t("step4Title"), analogy: t("step4Analogy"), details: [t("step4Detail1"), t("step4Detail2"), t("step4Detail3"), t("step4Detail4")] },
    { title: t("step5Title"), analogy: t("step5Analogy"), details: [t("step5Detail1"), t("step5Detail2"), t("step5Detail3"), t("step5Detail4")] },
    { title: t("step6Title"), analogy: t("step6Analogy"), details: [t("step6Detail1"), t("step6Detail2"), t("step6Detail3"), t("step6Detail4")] },
    { title: t("step7Title"), analogy: t("step7Analogy"), details: [t("step7Detail1"), t("step7Detail2"), t("step7Detail3"), t("step7Detail4")] },
    { title: t("step8Title"), analogy: t("step8Analogy"), details: [t("step8Detail1"), t("step8Detail2"), t("step8Detail3"), t("step8Detail4")] },
  ];

  const glossary = [
    { term: t("glossaryEffectSize"), def: t("glossaryEffectSizeDef") },
    { term: t("glossaryCI"), def: t("glossaryCIDef") },
    { term: t("glossaryI2"), def: t("glossaryI2Def") },
    { term: t("glossaryFunnel"), def: t("glossaryFunnelDef") },
    { term: t("glossaryFixedRandom"), def: t("glossaryFixedRandomDef") },
    { term: t("glossaryPRISMA"), def: t("glossaryPRISMADef") },
  ];

  return (
    <div style={{ background: LIGHT_BG, color: DARK, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${TEAL}22; color: ${DARK}; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", background: scrollY > 60 ? "rgba(248,247,244,0.92)" : "transparent", backdropFilter: scrollY > 60 ? "blur(16px)" : "none", borderBottom: scrollY > 60 ? `1px solid ${LIGHT_BORDER}` : "none", transition: "all 0.35s" }}>
        <div onClick={() => scrollTo("hero")} style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 17, fontWeight: 700, color: TEAL, cursor: "pointer", letterSpacing: -0.3 }}>
          {t("navTitle")} <span style={{ fontWeight: 400, color: MUTED }}>{t("navTitleSuffix")}</span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {navItems.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{ background: "none", border: "none", color: MUTED, padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = TEAL)} onMouseLeave={(e) => (e.target.style.color = MUTED)}>
              {n.label}
            </button>
          ))}
          <button onClick={toggleLang} style={{ background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, color: TEAL, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", marginLeft: 8, transition: "all 0.2s", letterSpacing: 0.5 }}
            onMouseEnter={(e) => { e.target.style.background = TEAL; e.target.style.color = "#FFF"; }}
            onMouseLeave={(e) => { e.target.style.background = `${TEAL}0D`; e.target.style.color = TEAL; }}>
            {t("langSwitch")}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3, backgroundImage: "radial-gradient(circle, #C8C6C0 0.8px, transparent 0.8px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "15%", right: "10%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}0A, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "8%", width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${CORAL}08, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", padding: "0 24px", maxWidth: 720, zIndex: 1 }}>
          <FadeIn>
            <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 20, background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, fontSize: 12, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 28 }}>{t("heroBadge")}</div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 20, color: DARK }}>
              {t("heroTitle1")}
              <span style={{ background: `linear-gradient(135deg, ${TEAL}, #3AAFB8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t("heroTitle2")}</span>
              {t("heroTitle3")}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 19px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 36px" }}>
              {t("heroDesc")}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <button onClick={() => scrollTo("what")} style={{ ...btnPrimary, padding: "16px 36px", fontSize: 16, borderRadius: 12, boxShadow: `0 4px 20px ${TEAL}33` }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 28px ${TEAL}44`; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 20px ${TEAL}33`; }}>
              {t("heroBtn")}
            </button>
          </FadeIn>
        </div>
      </section>

      {/* WHAT */}
      <Section id="what">
        <FadeIn><SectionLabel text={t("whatLabel")} /><SectionTitle>{t("whatTitle")}</SectionTitle></FadeIn>
        <FadeIn delay={0.1}>
          <Paragraph style={{ marginBottom: 40 }}>
            {lang === "zh" ? t("whatIntro") : (<>{t("whatIntro").split("mathematically combines all 20 results")[0]}<strong style={{ color: DARK }}>mathematically combines all 20 results</strong>{t("whatIntro").split("mathematically combines all 20 results")[1]}</>)}
          </Paragraph>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 48 }}>
            {[
              { emoji: "🧮", title: t("whatCard1Title"), text: t("whatCard1Text") },
              { emoji: "⚖️", title: t("whatCard2Title"), text: t("whatCard2Text") },
              { emoji: "🔍", title: t("whatCard3Title"), text: t("whatCard3Text") },
            ].map((c, i) => (
              <div key={i} style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 16, padding: "24px 22px", transition: "border-color 0.3s, box-shadow 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${TEAL}44`; e.currentTarget.style.boxShadow = `0 4px 20px ${TEAL}0A`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = LIGHT_BORDER; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{c.emoji}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: DARK }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: MUTED }}>{c.text}</p>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}1A`, borderRadius: 16, padding: "24px 28px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>💡</span>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: TEAL, marginBottom: 6 }}>{t("whatAnalogyTitle")}</h4>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: MUTED }}>
                {t("whatAnalogyText")}
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* WHY */}
      <Section id="why" accent>
        <FadeIn><SectionLabel text={t("whyLabel")} /><SectionTitle>{t("whyTitle")}</SectionTitle>
          <Paragraph style={{ marginBottom: 48 }}>{t("whyIntro")}</Paragraph>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { icon: "🔋", title: t("whyCard1Title"), text: t("whyCard1Text"), color: TEAL },
            { icon: "🤝", title: t("whyCard2Title"), text: t("whyCard2Text"), color: CORAL },
            { icon: "🔎", title: t("whyCard3Title"), text: t("whyCard3Text"), color: "#7B68C8" },
            { icon: "🏛️", title: t("whyCard4Title"), text: t("whyCard4Text"), color: "#D4A843" },
            { icon: "🕵️", title: t("whyCard5Title"), text: t("whyCard5Text"), color: "#5B9E5F" },
            { icon: "🗺️", title: t("whyCard6Title"), text: t("whyCard6Text"), color: "#C45B8A" },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 16, padding: "24px 22px", height: "100%", transition: "all 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${item.color}44`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}11`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = LIGHT_BORDER; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: DARK }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: MUTED }}>{item.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* COMBINER DEMO */}
      <Section id="combiner">
        <FadeIn><SectionLabel text={t("combinerLabel")} /><SectionTitle>{t("combinerTitle")}</SectionTitle>
          <Paragraph style={{ marginBottom: 32 }}>{t("combinerDesc")}</Paragraph>
        </FadeIn>
        <FadeIn delay={0.1}><StudyCombiner /></FadeIn>
      </Section>

      {/* HOW */}
      <Section id="how" accent>
        <FadeIn><SectionLabel text={t("howLabel")} /><SectionTitle>{t("howTitle")}</SectionTitle>
          <Paragraph style={{ marginBottom: 12 }}>{t("howDesc")}</Paragraph>
          <p style={{ fontSize: 12, color: `${TEAL}88`, marginBottom: 32, fontStyle: "italic", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{t("howNote")}</p>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <MethodStep number={i + 1} title={step.title} analogy={step.analogy} details={step.details} isOpen={openStep === i} onClick={() => setOpenStep(openStep === i ? null : i)} thinkOfIt={t("howThinkOfIt")} />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* FOREST PLOT */}
      <Section id="tools">
        <FadeIn><SectionLabel text={t("forestLabel")} /><SectionTitle>{t("forestTitle")}</SectionTitle>
          <Paragraph style={{ marginBottom: 12 }}>{t("forestDesc")}</Paragraph>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 32, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{t("forestNote")}</p>
        </FadeIn>
        <FadeIn delay={0.1}><ForestPlotExplainer /></FadeIn>
        <FadeIn delay={0.15}>
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {glossary.map((item, i) => (
              <div key={i} style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "18px 20px" }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 6, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{item.term}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{item.def}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* EGG HUNT */}
      <Section id="quiz" accent>
        <FadeIn><SectionLabel text={t("eggHuntLabel")} /><SectionTitle>{t("eggHuntTitle")}</SectionTitle>
          <Paragraph style={{ marginBottom: 32 }}>{t("eggHuntDesc")}</Paragraph>
        </FadeIn>
        <FadeIn delay={0.1}><EggHuntGame /></FadeIn>
      </Section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG }}>
        <p style={{ fontSize: 13, color: "#B0AFAA", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
          {t("footerText")}
        </p>
        <div style={{ marginTop: 16, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>{t("footerBrand")}</div>
      </footer>
    </div>
  );
}

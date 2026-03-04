import { useState, useEffect, useRef } from "react";

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
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: TEAL, fontFamily: "'Outfit', sans-serif" }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 640, fontFamily: "'Outfit', sans-serif", ...style }}>{children}</p>;
}

const btnPrimary = { background: TEAL, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s" };
const btnSecondary = { background: "transparent", border: `1.5px solid ${TEAL}`, color: TEAL, padding: "11px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" };

// ═══ STUDY COMBINER ═══
function StudyCombiner() {
  const [phase, setPhase] = useState("scattered");
  const [hoveredStudy, setHoveredStudy] = useState(null);
  const studies = [
    { id: 1, label: "Study A", effect: 0.35, n: 45, color: "#4EAAB3", desc: "Small RCT — found a moderate positive effect" },
    { id: 2, label: "Study B", effect: -0.10, n: 120, color: "#E8734A", desc: "Large trial — found almost no effect" },
    { id: 3, label: "Study C", effect: 0.52, n: 30, color: "#7B68C8", desc: "Small study — found a strong effect" },
    { id: 4, label: "Study D", effect: 0.20, n: 200, color: "#D4A843", desc: "Largest trial — found a small positive effect" },
    { id: 5, label: "Study E", effect: 0.41, n: 65, color: "#5B9E5F", desc: "Medium study — found a moderate effect" },
  ];
  const totalW = studies.reduce((s, st) => s + st.n, 0);
  const pooled = studies.reduce((s, st) => s + st.effect * st.n, 0) / totalW;
  const scatteredPositions = [{ x: 12, y: 18 }, { x: 68, y: 12 }, { x: 28, y: 62 }, { x: 74, y: 58 }, { x: 46, y: 35 }];
  const reset = () => setPhase("scattered");
  const combine = () => { setPhase("combining"); setTimeout(() => setPhase("combined"), 1200); };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 6 }}>
          {phase === "scattered" && "Five Studies, Five Different Answers"}
          {phase === "combining" && "Combining the evidence..."}
          {phase === "combined" && "One Pooled Estimate"}
        </h3>
        <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Outfit', sans-serif" }}>
          {phase === "scattered" && "Each dot is a study. They disagree — which one do you trust?"}
          {phase === "combining" && "Weighting by sample size to find the true signal..."}
          {phase === "combined" && `Pooled effect: ${pooled.toFixed(2)} — larger studies pulled the estimate toward a small positive effect`}
        </p>
      </div>
      <div style={{ position: "relative", height: 260, background: "#FAFAF7", borderRadius: 14, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 16px", fontSize: 10, color: "#B0AFAA", fontFamily: "'Outfit', sans-serif" }}>
          <span>← Negative effect</span><span>Positive effect →</span>
        </div>
        <div style={{ position: "absolute", left: "50%", top: 16, bottom: 28, width: 1, background: "#DDD", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: 6, transform: "translateX(-50%)", fontSize: 9, color: "#BBB", fontFamily: "'Outfit', sans-serif" }}>No Effect</div>
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
          <div style={{ position: "absolute", left: `${scatteredPositions[hoveredStudy].x}%`, top: `${scatteredPositions[hoveredStudy].y - 14}%`, transform: "translateX(-50%)", background: DARK, color: "#FFF", borderRadius: 10, padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap", fontFamily: "'Outfit', sans-serif", zIndex: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", pointerEvents: "none" }}>
            <strong>{studies[hoveredStudy].label}</strong> (n={studies[hoveredStudy].n})<br />{studies[hoveredStudy].desc}
          </div>
        )}
        <style>{`@keyframes popIn { from { transform: translate(-50%, -50%) rotate(45deg) scale(0); opacity: 0; } to { transform: translate(-50%, -50%) rotate(45deg) scale(1); opacity: 1; } }`}</style>
      </div>
      {phase === "scattered" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 16, fontSize: 12, color: MUTED, fontFamily: "'Outfit', sans-serif" }}>
          {studies.map((st) => (
            <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: st.color }} />
              {st.label} (n={st.n}, effect={st.effect > 0 ? "+" : ""}{st.effect.toFixed(2)})
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {phase === "scattered" && <button onClick={combine} style={btnPrimary}>Combine Studies →</button>}
        {phase === "combined" && <button onClick={reset} style={btnSecondary}>↺ Reset</button>}
      </div>
    </div>
  );
}

// ═══ INTERACTIVE FOREST PLOT ═══
function ForestPlotExplainer() {
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
    square: { title: "Study Effect (Square)", text: "Each square shows one study's result. Its size reflects the study's weight — bigger squares mean larger, more precise studies that contribute more to the final answer." },
    line: { title: "Confidence Interval (Line)", text: "The horizontal line shows the range of plausible values. Shorter lines = more precision. If it crosses the center line, the result isn't statistically significant on its own." },
    center: { title: "Line of No Effect", text: "This vertical line represents zero effect — no difference between groups. Studies to the left favor treatment; studies to the right favor control." },
    diamond: { title: "Pooled Estimate (Diamond)", text: "The diamond is the combined result of ALL studies. Its width shows the confidence interval. If the entire diamond sits on one side of the center line, the overall effect is statistically significant." },
  };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 6 }}>Reading a Forest Plot</h3>
        <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Outfit', sans-serif" }}>Click on any element to learn what it means</p>
      </div>
      <div style={{ minHeight: 72, padding: "12px 16px", marginBottom: 16, background: activeTooltip ? `${TEAL}08` : "transparent", borderRadius: 12, transition: "all 0.3s", border: activeTooltip ? `1px solid ${TEAL}22` : "1px solid transparent" }}>
        {activeTooltip ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEAL, fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>{explanations[activeTooltip].title}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, fontFamily: "'Outfit', sans-serif" }}>{explanations[activeTooltip].text}</div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: "#B0AFAA", fontFamily: "'Outfit', sans-serif", textAlign: "center", paddingTop: 8 }}>
            👆 Click on a square, line, the center line, or the diamond below
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: 120, marginRight: 8, marginBottom: 6, fontSize: 10, color: "#B0AFAA", fontFamily: "'Outfit', sans-serif" }}>
        <span>← Favors Treatment</span><span>Favors Control →</span>
      </div>
      <div style={{ position: "relative" }}>
        {studies.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: 40, padding: "0 4px" }}>
            <div style={{ width: 116, fontSize: 13, color: MUTED, fontFamily: "'Outfit', sans-serif" }}>{s.name}</div>
            <div style={{ flex: 1, position: "relative", height: "100%" }}>
              <div onClick={() => setActiveTooltip(activeTooltip === "center" ? null : "center")} style={{ position: "absolute", left: `${toX(0)}%`, top: 0, bottom: 0, width: activeTooltip === "center" ? 3 : 1, background: activeTooltip === "center" ? CORAL : "#DDD", cursor: "pointer", zIndex: 5, padding: "0 6px", backgroundClip: "content-box", transition: "all 0.3s" }} />
              <div onClick={() => setActiveTooltip(activeTooltip === "line" ? null : "line")} style={{ position: "absolute", left: `${toX(s.ci[0])}%`, width: `${toX(s.ci[1]) - toX(s.ci[0])}%`, top: "50%", height: activeTooltip === "line" ? 3 : 2, background: activeTooltip === "line" ? CORAL : TEAL, transform: "translateY(-50%)", cursor: "pointer", transition: "all 0.3s", borderRadius: 1 }} />
              <div onClick={() => setActiveTooltip(activeTooltip === "square" ? null : "square")} style={{ position: "absolute", left: `${toX(s.effect)}%`, top: "50%", width: Math.max(10, s.weight * 0.6), height: Math.max(10, s.weight * 0.6), background: activeTooltip === "square" ? CORAL : TEAL, borderRadius: 3, transform: "translate(-50%, -50%)", cursor: "pointer", transition: "all 0.3s", boxShadow: activeTooltip === "square" ? `0 0 0 3px ${CORAL}33` : "none" }} />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", height: 44, marginTop: 4, borderTop: `1px solid ${LIGHT_BORDER}`, paddingTop: 8 }}>
          <div style={{ width: 116, fontSize: 13, fontWeight: 700, color: TEAL, fontFamily: "'Outfit', sans-serif" }}>Overall</div>
          <div style={{ flex: 1, position: "relative", height: "100%" }}>
            <div style={{ position: "absolute", left: `${toX(0)}%`, top: 0, bottom: 0, width: 1, background: "#DDD" }} />
            <svg onClick={() => setActiveTooltip(activeTooltip === "diamond" ? null : "diamond")} style={{ position: "absolute", left: `${toX(pooled.ci[0])}%`, top: "50%", width: `${toX(pooled.ci[1]) - toX(pooled.ci[0])}%`, height: 22, transform: "translateY(-50%)", overflow: "visible", cursor: "pointer" }} viewBox="0 0 100 22" preserveAspectRatio="none">
              <polygon points="0,11 50,1 100,11 50,21" fill={activeTooltip === "diamond" ? CORAL : TEAL} style={{ transition: "fill 0.3s" }} />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginLeft: 120, justifyContent: "space-between", marginTop: 10, fontSize: 10, color: "#C0BFB9", fontFamily: "'Outfit', sans-serif" }}>
        {[-1.0, -0.6, -0.2, 0, 0.2, 0.6].map((v) => <span key={v}>{v.toFixed(1)}</span>)}
      </div>
    </div>
  );
}

// ═══ QUIZ ═══
function Quiz() {
  const questions = [
    { q: "What is the main purpose of a meta-analysis?", opts: ["To conduct a new experiment", "To statistically combine results from multiple studies", "To replace systematic reviews", "To interview researchers about their findings"], correct: 1, explanation: "Meta-analysis uses statistical techniques to combine findings from multiple independent studies into a single, more precise estimate." },
    { q: "In a forest plot, what does a larger square indicate?", opts: ["A more recent study", "A study with a bigger effect size", "A study with more weight (higher precision)", "A study from a more prestigious journal"], correct: 2, explanation: "The size of each square is proportional to the study's weight. Larger, more precise studies get bigger squares because they contribute more to the pooled result." },
    { q: "What does I² measure in a meta-analysis?", opts: ["The total number of included studies", "The percentage of variation due to heterogeneity", "The quality score of each study", "The publication date of the oldest study"], correct: 1, explanation: "I² quantifies what percentage of the variability between studies is due to genuine differences (heterogeneity) rather than random chance. Values above 50% suggest substantial heterogeneity." },
    { q: "A symmetric funnel plot suggests:", opts: ["High publication bias", "All studies found the same result", "Low risk of publication bias", "The meta-analysis has errors"], correct: 2, explanation: "When studies scatter symmetrically around the pooled effect, it forms an inverted funnel shape — suggesting studies aren't 'missing' due to publication bias." },
    { q: "What does PRISMA stand for?", opts: ["Primary Reporting Items for Science and Medical Analysis", "Preferred Reporting Items for Systematic Reviews and Meta-Analyses", "Protocol for Research in Statistical Meta-Analysis", "Published Results in Synthesized Medical Articles"], correct: 1, explanation: "PRISMA provides a standardized 27-item checklist and flow diagram to help researchers transparently report their systematic review methodology." },
  ];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => { if (answered) return; setSelected(idx); setAnswered(true); if (idx === questions[current].correct) setScore((s) => s + 1); };
  const next = () => { if (current < questions.length - 1) { setCurrent((c) => c + 1); setSelected(null); setAnswered(false); } else { setFinished(true); } };
  const restart = () => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct === 100 ? "🎉" : pct >= 60 ? "👏" : "📚";
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
        <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 8 }}>{pct === 100 ? "Perfect Score!" : pct >= 60 ? "Well Done!" : "Keep Learning!"}</h3>
        <p style={{ fontSize: 18, color: TEAL, fontWeight: 600, fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}>{score} / {questions.length} correct ({pct}%)</p>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: 28, fontFamily: "'Outfit', sans-serif" }}>{pct === 100 ? "You've mastered the basics of meta-analysis!" : "Scroll back up to review the sections, then try again."}</p>
        <button onClick={restart} style={btnPrimary}>Try Again</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: MUTED, fontFamily: "'Outfit', sans-serif" }}>Question {current + 1} of {questions.length}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {questions.map((_, i) => <div key={i} style={{ width: 24, height: 4, borderRadius: 2, background: i <= current ? TEAL : "#E8E6E1", transition: "background 0.3s" }} />)}
        </div>
      </div>
      <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 20, lineHeight: 1.4 }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {q.opts.map((opt, idx) => {
          let bg = "#FAFAF7", border = LIGHT_BORDER, color = DARK;
          if (answered) {
            if (idx === q.correct) { bg = "#E6F5F0"; border = "#3DA87A"; color = "#2A7A5A"; }
            else if (idx === selected && idx !== q.correct) { bg = "#FDEEEB"; border = "#D94B2E"; color = "#B83A20"; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: "14px 18px", textAlign: "left", fontSize: 15, color, fontFamily: "'Outfit', sans-serif", cursor: answered ? "default" : "pointer", transition: "all 0.2s", fontWeight: answered && idx === q.correct ? 600 : 400 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${border}`, fontSize: 12, fontWeight: 600, marginRight: 12, background: answered && idx === q.correct ? "#3DA87A" : "transparent", color: answered && idx === q.correct ? "#FFF" : color }}>{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ background: selected === q.correct ? "#E6F5F0" : "#FDEEEB", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 14, lineHeight: 1.65, color: MUTED, fontFamily: "'Outfit', sans-serif", border: `1px solid ${selected === q.correct ? "#3DA87A33" : "#D94B2E33"}` }}>
          <strong style={{ color: selected === q.correct ? "#2A7A5A" : "#B83A20" }}>{selected === q.correct ? "✓ Correct! " : "✗ Not quite. "}</strong>
          {q.explanation}
        </div>
      )}
      {answered && <div style={{ textAlign: "right" }}><button onClick={next} style={btnPrimary}>{current < questions.length - 1 ? "Next Question →" : "See Results →"}</button></div>}
    </div>
  );
}

// ═══ METHOD STEP ═══
function MethodStep({ number, title, analogy, details, isOpen, onClick }) {
  return (
    <div onClick={onClick} style={{ background: CARD_BG, border: `1px solid ${isOpen ? `${TEAL}33` : LIGHT_BORDER}`, borderRadius: 16, padding: "22px 24px", cursor: "pointer", transition: "all 0.35s", boxShadow: isOpen ? `0 4px 24px ${TEAL}0D` : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ minWidth: 44, height: 44, borderRadius: 12, background: isOpen ? TEAL : "#F1F0EC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Source Serif 4', serif", fontSize: 18, fontWeight: 700, color: isOpen ? "#FFF" : MUTED, transition: "all 0.35s" }}>{number}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: DARK, fontFamily: "'Outfit', sans-serif", margin: 0 }}>{title}</h3>
          {!isOpen && <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#B0AFAA", fontFamily: "'Outfit', sans-serif" }}>{analogy}</p>}
        </div>
        <span style={{ fontSize: 18, color: isOpen ? TEAL : "#C0BFB9", transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.35s", fontWeight: 300 }}>+</span>
      </div>
      {isOpen && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${LIGHT_BORDER}` }}>
          <div style={{ background: `${TEAL}08`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13.5, color: TEAL, lineHeight: 1.6, fontFamily: "'Outfit', sans-serif", fontStyle: "italic" }}>💡 Think of it like: {analogy}</div>
          {details.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: TEAL, fontSize: 7, marginTop: 7 }}>●</span>
              <span style={{ fontSize: 14, lineHeight: 1.65, color: MUTED, fontFamily: "'Outfit', sans-serif" }}>{d}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══ MAIN APP ═══
export default function MetaAnalysisGuide() {
  const [openStep, setOpenStep] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const navItems = [{ id: "what", label: "What" }, { id: "why", label: "Why" }, { id: "combiner", label: "Demo" }, { id: "how", label: "How" }, { id: "tools", label: "Plots" }, { id: "quiz", label: "Quiz" }];

  const steps = [
    { title: "Define Your Research Question", analogy: "Deciding exactly what recipe you want to cook before going grocery shopping.", details: ["Use a structured framework like PICO: Population, Intervention, Comparison, Outcome.", "Your question determines everything — which studies to include, what data to extract, and how to analyze it.", "Make sure enough studies exist on your topic to justify a quantitative synthesis.", "Write a detailed protocol and register it (e.g., on PROSPERO) before you begin."] },
    { title: "Search the Literature Systematically", analogy: "Casting a wide fishing net across multiple oceans to make sure you don't miss any fish.", details: ["Search multiple databases: PubMed, Embase, Cochrane Library, and others relevant to your field.", "Use carefully constructed keyword combinations with Boolean operators (AND, OR, NOT).", "Don't forget the 'gray literature' — dissertations, conference abstracts, preprints — to reduce bias.", "Keep meticulous records of every search. You'll need to report this in a PRISMA flow diagram."] },
    { title: "Screen & Select Studies", analogy: "Sorting through your catch to keep only the fish that match what you're looking for.", details: ["Apply your pre-defined eligibility criteria to every study found.", "At least two reviewers should independently screen titles, abstracts, then full texts.", "Use reference management tools (EndNote, Mendeley) and screening software (Rayyan, Covidence).", "Document exactly why each excluded study was removed — transparency is key."] },
    { title: "Assess Quality & Risk of Bias", analogy: "Checking the freshness and quality of each ingredient before cooking.", details: ["Use validated tools: Cochrane Risk of Bias for RCTs, Newcastle-Ottawa Scale for observational studies.", "Evaluate randomization, blinding, incomplete data, and selective reporting.", "Low-quality studies can distort your overall result — you may need sensitivity analyses excluding them.", "Two independent reviewers should assess quality, with a process to resolve disagreements."] },
    { title: "Extract Data & Calculate Effect Sizes", analogy: "Measuring each ingredient precisely before adding it to the pot.", details: ["Use standardized forms to capture sample sizes, means, standard deviations, and event counts.", "Choose your effect size metric: Odds Ratio for yes/no outcomes, Mean Difference for continuous measures.", "Each study gets encoded as a single number (effect size) plus a measure of precision.", "Double-check extractions — even published meta-analyses have been found to contain errors."] },
    { title: "Pool Results & Analyze", analogy: "Combining all your carefully measured ingredients and seeing what dish emerges.", details: ["Choose: Fixed-effect (assumes one true effect) vs. Random-effects (assumes effects vary between studies).", "Each study is weighted by precision — larger, more precise studies have more influence.", "Assess heterogeneity with I²: below 25% is low, 25–50% moderate, above 50% high.", "If heterogeneity is high, explore why with subgroup analyses or meta-regression."] },
    { title: "Check for Publication Bias", analogy: "Making sure your recipe book isn't missing pages — especially the ones with failed recipes.", details: ["Create a funnel plot: study effects vs. precision. Symmetry suggests no bias.", "Use Egger's test or Begg's test to statistically quantify potential bias.", "The trim-and-fill method can estimate how many studies might be 'missing' and adjust the result.", "Remember: funnel plot asymmetry can also reflect genuine heterogeneity, not just bias."] },
    { title: "Report Your Findings", analogy: "Writing up the recipe so anyone else could recreate your dish exactly.", details: ["Follow the PRISMA 2020 guidelines — a 27-item checklist covering every aspect of your review.", "Include a PRISMA flow diagram showing how many studies were found, screened, and included.", "Present results in forest plots with all key statistics: effect sizes, confidence intervals, I², p-values.", "Discuss limitations openly: quality of included studies, potential biases, and generalizability."] },
  ];

  return (
    <div style={{ background: LIGHT_BG, color: DARK, fontFamily: "'Outfit', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${TEAL}22; color: ${DARK}; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", background: scrollY > 60 ? "rgba(248,247,244,0.92)" : "transparent", backdropFilter: scrollY > 60 ? "blur(16px)" : "none", borderBottom: scrollY > 60 ? `1px solid ${LIGHT_BORDER}` : "none", transition: "all 0.35s" }}>
        <div onClick={() => scrollTo("hero")} style={{ fontFamily: "'Source Serif 4', serif", fontSize: 17, fontWeight: 700, color: TEAL, cursor: "pointer", letterSpacing: -0.3 }}>
          Meta-Analysis <span style={{ fontWeight: 400, color: MUTED }}>101</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{ background: "none", border: "none", color: MUTED, padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = TEAL)} onMouseLeave={(e) => (e.target.style.color = MUTED)}>
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3, backgroundImage: "radial-gradient(circle, #C8C6C0 0.8px, transparent 0.8px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "15%", right: "10%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}0A, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "8%", width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${CORAL}08, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", padding: "0 24px", maxWidth: 720, zIndex: 1 }}>
          <FadeIn>
            <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 20, background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, fontSize: 12, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 28 }}>A Beginner's Guide</div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 20, color: DARK }}>
              What on earth is a{" "}
              <span style={{ background: `linear-gradient(135deg, ${TEAL}, #3AAFB8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Meta-Analysis</span>?
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 19px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 36px" }}>
              Imagine reading <em>every</em> study on a topic, then mathematically combining them to find the real answer. That's meta-analysis — and it's simpler than you think.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <button onClick={() => scrollTo("what")} style={{ ...btnPrimary, padding: "16px 36px", fontSize: 16, borderRadius: 12, boxShadow: `0 4px 20px ${TEAL}33` }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 28px ${TEAL}44`; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 20px ${TEAL}33`; }}>
              Start Learning →
            </button>
          </FadeIn>
        </div>
      </section>

      {/* WHAT */}
      <Section id="what">
        <FadeIn><SectionLabel text="The Basics" /><SectionTitle>So, What Is a Meta-Analysis?</SectionTitle></FadeIn>
        <FadeIn delay={0.1}>
          <Paragraph style={{ marginBottom: 40 }}>
            Picture this: you want to know if a new medication works. You find 20 studies — some say yes, some say no, some say maybe. Instead of just picking the one you like best, a meta-analysis <strong style={{ color: DARK }}>mathematically combines all 20 results</strong> into a single, more reliable answer. It's like asking 20 experts and calculating the group consensus, giving more weight to the experts who are most confident.
          </Paragraph>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 48 }}>
            {[
              { emoji: "🧮", title: "It's Math, Not Opinion", text: "Unlike a regular literature review where an author summarizes in their own words, meta-analysis uses statistical formulas to calculate a precise combined result." },
              { emoji: "⚖️", title: "Not All Studies Are Equal", text: "Larger, more precise studies get more influence. A study with 1,000 patients counts more than one with 20 — just as you'd trust a larger poll more." },
              { emoji: "🔍", title: "Part of a Bigger Process", text: "Meta-analysis lives inside a 'systematic review' — a structured process for finding, evaluating, and combining all relevant studies on a question." },
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
              <h4 style={{ fontSize: 15, fontWeight: 600, color: TEAL, marginBottom: 6 }}>The Restaurant Review Analogy</h4>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: MUTED }}>
                Would you pick a restaurant based on one review? Probably not — you'd read many reviews and form an overall impression. But you'd weigh a review from someone who's visited 5 times over someone who just walked past. That's exactly what meta-analysis does with scientific studies: reads them all, weighs them by quality and size, and gives you the verdict.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* WHY */}
      <Section id="why" accent>
        <FadeIn><SectionLabel text="The Purpose" /><SectionTitle>Why Bother Doing One?</SectionTitle>
          <Paragraph style={{ marginBottom: 48 }}>Single studies are like puzzle pieces — valuable on their own, but you need to see them together to understand the full picture.</Paragraph>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { icon: "🔋", title: "More Statistical Power", text: "Small studies often can't detect real effects. By pooling data, meta-analysis achieves the power of a much larger study — sometimes tens of thousands of participants.", color: TEAL },
            { icon: "🤝", title: "Settle Disagreements", text: "When Study A says 'yes' and Study B says 'no,' meta-analysis provides a fair, mathematical arbitration instead of cherry-picking.", color: CORAL },
            { icon: "🔎", title: "Find Hidden Patterns", text: "Through subgroup analysis, you can discover a treatment works for older patients but not younger ones — something no single study might reveal.", color: "#7B68C8" },
            { icon: "🏛️", title: "Shape Real Decisions", text: "Meta-analyses sit at the top of the evidence pyramid. Governments, hospitals, and guideline panels rely on them for treatment and policy decisions.", color: "#D4A843" },
            { icon: "🕵️", title: "Expose Missing Evidence", text: "Tools like funnel plots can reveal if studies with negative results weren't published — a phenomenon called publication bias.", color: "#5B9E5F" },
            { icon: "🗺️", title: "Map Future Research", text: "By revealing what we know and don't know, meta-analyses highlight gaps and guide where new studies are most needed.", color: "#C45B8A" },
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
        <FadeIn><SectionLabel text="See It In Action" /><SectionTitle>Watch Studies Combine</SectionTitle>
          <Paragraph style={{ marginBottom: 32 }}>This interactive demo shows how meta-analysis works. Five studies each found different results — click "Combine" to see how weighting by sample size produces a single, more trustworthy answer.</Paragraph>
        </FadeIn>
        <FadeIn delay={0.1}><StudyCombiner /></FadeIn>
      </Section>

      {/* HOW */}
      <Section id="how" accent>
        <FadeIn><SectionLabel text="Step by Step" /><SectionTitle>How To Conduct a Meta-Analysis</SectionTitle>
          <Paragraph style={{ marginBottom: 12 }}>It's a structured 8-step process. Click each step to expand the details and see a real-world analogy that makes it click.</Paragraph>
          <p style={{ fontSize: 12, color: `${TEAL}88`, marginBottom: 32, fontStyle: "italic", fontFamily: "'Outfit', sans-serif" }}>Based on PRISMA 2020 guidelines and established methodological frameworks</p>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <MethodStep number={i + 1} title={step.title} analogy={step.analogy} details={step.details} isOpen={openStep === i} onClick={() => setOpenStep(openStep === i ? null : i)} />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* FOREST PLOT */}
      <Section id="tools">
        <FadeIn><SectionLabel text="Key Visualizations" /><SectionTitle>Reading a Forest Plot</SectionTitle>
          <Paragraph style={{ marginBottom: 12 }}>The forest plot is the signature visualization of meta-analysis. Every element has a meaning — click on different parts below to learn what they represent.</Paragraph>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 32, fontFamily: "'Outfit', sans-serif" }}>In this example, studies are testing whether a treatment reduces a negative outcome. Values to the left mean the treatment helps.</p>
        </FadeIn>
        <FadeIn delay={0.1}><ForestPlotExplainer /></FadeIn>
        <FadeIn delay={0.15}>
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {[
              { term: "Effect Size", def: "A number measuring how big the difference is between two groups. Common types: odds ratios, risk ratios, and standardized mean differences." },
              { term: "Confidence Interval", def: "The range where the true effect likely falls. A 95% CI means we're 95% confident the real answer is somewhere in that range." },
              { term: "I² (Heterogeneity)", def: "What percentage of variation between studies is real (not random noise). Under 25% = low, over 75% = very high." },
              { term: "Funnel Plot", def: "A scatter plot checking for publication bias. Studies should scatter symmetrically — if not, some results may be missing." },
              { term: "Fixed vs. Random Effects", def: "Fixed assumes one true effect exists. Random assumes effects vary between studies. Random is more common and conservative." },
              { term: "PRISMA", def: "The 27-item reporting checklist ensuring your meta-analysis is transparent, reproducible, and complete. Updated in 2020." },
            ].map((item, i) => (
              <div key={i} style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "18px 20px" }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{item.term}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: MUTED, fontFamily: "'Outfit', sans-serif" }}>{item.def}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* QUIZ */}
      <Section id="quiz" accent>
        <FadeIn><SectionLabel text="Test Yourself" /><SectionTitle>Quick Knowledge Check</SectionTitle>
          <Paragraph style={{ marginBottom: 32 }}>Five questions to see how much you've picked up. Don't worry — you can always scroll back up and try again!</Paragraph>
        </FadeIn>
        <FadeIn delay={0.1}><Quiz /></FadeIn>
      </Section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG }}>
        <p style={{ fontSize: 13, color: "#B0AFAA", fontFamily: "'Outfit', sans-serif", lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
          Content synthesized from leading methodological guides including PRISMA 2020, Cochrane Handbook, and peer-reviewed meta-analysis tutorials. Built as an educational resource for beginners.
        </p>
        <div style={{ marginTop: 16, fontFamily: "'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>Meta-Analysis 101</div>
      </footer>
    </div>
  );
}

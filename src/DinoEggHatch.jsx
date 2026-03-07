import { useState } from "react";
import CuteDino from "./CuteDino";
import { course1Questions, pickBalanced } from "./questionBank";

// ═══ DESIGN TOKENS ═══
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const DARK = "#1D2B3A";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const DINO_COLORS = ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6", "#E67E22", "#95A5A6"];
const btnPrimary = { background: TEAL, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };

// ═══ SVG DRAGON EGG (also exported for use in Course1 hero) ═══
export function DragonEgg({ color = "#3498DB", size = 80, state = "idle", delay = 0 }) {
  const w = Math.round(size * 0.77);
  const h = size;
  const id = `degg-${Math.random().toString(36).slice(2, 8)}`;
  const lighten = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt].map(v => Math.min(255, Math.round(v)).toString(16).padStart(2, "0")).join(""); };
  const darken = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r * (1 - amt), g * (1 - amt), b * (1 - amt)].map(v => Math.max(0, Math.round(v)).toString(16).padStart(2, "0")).join(""); };

  const animStyle = state === "idle" ? { animation: `eggFloat 3s ease-in-out ${delay}s infinite` } : state === "crack" ? { animation: "eggShake 0.5s ease-in-out" } : state === "frozen" ? { filter: "saturate(0.15) brightness(1.35)", animation: "eggFreeze 0.8s ease-out forwards" } : {};

  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: w + 16, height: h + 16, position: "relative", ...animStyle }}>
      <svg width={w} height={h} viewBox="0 0 62 80" fill="none">
        <defs>
          <radialGradient id={`${id}-bg`} cx="38%" cy="30%" r="65%"><stop offset="0%" stopColor={lighten(color, 0.3)} /><stop offset="60%" stopColor={color} /><stop offset="100%" stopColor={darken(color, 0.2)} /></radialGradient>
          <radialGradient id={`${id}-hi`} cx="35%" cy="25%" r="35%"><stop offset="0%" stopColor="white" stopOpacity="0.5" /><stop offset="100%" stopColor="white" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="31" cy="76" rx="18" ry="3" fill={darken(color, 0.3)} opacity="0.15" />
        <ellipse cx="31" cy="43" rx="27" ry="35" fill={`url(#${id}-bg)`} />
        <path d="M10 38 Q18 33 24 37 Q31 42 38 36 Q45 30 52 36" stroke={lighten(color, 0.4)} strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M10 46 Q18 51 24 47 Q31 42 38 48 Q45 54 52 48" stroke={lighten(color, 0.4)} strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M14 42 Q22 38 31 42 Q40 38 48 42" stroke={lighten(color, 0.35)} strokeWidth="1.5" fill="none" opacity="0.3" />
        <ellipse cx="20" cy="36" rx="3" ry="4" fill={lighten(color, 0.6)} opacity="0.5" transform="rotate(-10 20 36)" />
        <ellipse cx="42" cy="36" rx="3" ry="4" fill={lighten(color, 0.6)} opacity="0.5" transform="rotate(10 42 36)" />
        <circle cx="31" cy="30" r="3" fill={lighten(color, 0.7)} opacity="0.4" />
        <ellipse cx="22" cy="28" rx="10" ry="14" fill={`url(#${id}-hi)`} transform="rotate(-12 22 28)" />
        <circle cx="20" cy="22" r="1.5" fill="white" opacity="0.7" />
        <circle cx="17" cy="26" r="0.8" fill="white" opacity="0.4" />
        {state === "frozen" && (<><ellipse cx="31" cy="43" rx="27" ry="35" fill="none" stroke="#B8E4F0" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 3" /><path d="M18 25 L22 30 L18 35" stroke="#9ED8EA" strokeWidth="1.5" fill="none" opacity="0.5" /><path d="M44 25 L40 30 L44 35" stroke="#9ED8EA" strokeWidth="1.5" fill="none" opacity="0.5" /><text x="31" y="47" textAnchor="middle" fontSize="20" fill="#9ED8EA" opacity="0.7">❄</text></>)}
        {state === "crack" && (<><path d="M24 28 L28 36 L22 42 L28 48" stroke={darken(color, 0.3)} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M38 30 L35 37 L40 43" stroke={darken(color, 0.3)} strokeWidth="1.5" fill="none" strokeLinecap="round" /></>)}
      </svg>
    </div>
  );
}

// ═══ DRAGON EGG HATCHING GAME ═══
export default function DinoEggHatch({ t, lang }) {
  const [phase, setPhase] = useState("welcome"); // welcome | pick | playing | results
  const [chosenEgg, setChosenEgg] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [eggStage, setEggStage] = useState(0); // 0-5 crack stages
  const [iceStage, setIceStage] = useState(0); // 0-3 freeze stages
  const [gameOver, setGameOver] = useState(false);
  const [particles, setParticles] = useState([]); // { id, type: "sun"|"snow", x, delay }

  const spawnParticles = (type) => {
    const newParticles = Array.from({ length: type === "sun" ? 8 : 12 }, (_, i) => ({
      id: Date.now() + i,
      type,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 0.5,
      size: type === "sun" ? 16 + Math.random() * 12 : 12 + Math.random() * 10,
      duration: 1.2 + Math.random() * 0.8,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2500);
  };

  const pickEgg = (index) => {
    setChosenEgg(index);
    // Pick 7 balanced questions from the 70-question pool
    const picked = pickBalanced(course1Questions, 7);
    const localized = picked.map(q => ({
      q: q[lang].q,
      opts: q[lang].opts,
      correct: q.correct,
      exp: q[lang].exp,
    }));
    setQuestions(localized);
    setCurrent(0); setSelected(null); setAnswered(false);
    setCorrectCount(0); setWrongCount(0);
    setEggStage(0); setIceStage(0); setGameOver(false);
    setPhase("playing");
  };

  const handleSelect = (idx) => {
    if (answered || gameOver) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === questions[current].correct;
    if (isCorrect) {
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setEggStage(newCorrect);
      spawnParticles("sun");
      if (newCorrect >= 5) {
        setTimeout(() => setPhase("results"), 1200);
      }
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setIceStage(newWrong);
      spawnParticles("snow");
      if (newWrong >= 3) {
        setGameOver(true);
        setTimeout(() => setPhase("results"), 1200);
      }
    }
  };

  const nextQuestion = () => {
    setParticles([]);
    if (current < 6 && !gameOver) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setPhase("results");
    }
  };

  const reset = () => {
    setPhase("welcome");
    setChosenEgg(null);
    setQuestions([]);
    setCurrent(0); setSelected(null); setAnswered(false);
    setCorrectCount(0); setWrongCount(0);
    setEggStage(0); setIceStage(0); setGameOver(false);
  };

  const hatched = correctCount >= 5;
  const frozen = wrongCount >= 3;
  const eggColor = chosenEgg !== null ? DINO_COLORS[chosenEgg] : TEAL;
  const dinoNames = t("c1dinoNames");

  // ── Welcome: show all 7 eggs ──
  if (phase === "welcome") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 10 }}>{t("c1gameTitle")}</h3>
        <p style={{ fontSize: 15, color: MUTED, marginBottom: 12, maxWidth: 460, margin: "0 auto 12px" }}>{t("c1gameDesc")}</p>
        <p style={{ fontSize: 14, color: TEAL, fontWeight: 600, marginBottom: 28 }}>{lang === "zh" ? "選擇一顆龍蛋開始孵化！" : "Pick a dragon egg to hatch!"}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
          {DINO_COLORS.map((c, i) => (
            <div key={i} onClick={() => pickEgg(i)} style={{ cursor: "pointer", textAlign: "center", transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <DragonEgg color={c} size={64} state="idle" delay={i * 0.3} />
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{Array.isArray(dinoNames) ? dinoNames[i] : `Egg ${i+1}`}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Results ──
  if (phase === "results") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 28px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        {hatched ? (
          <>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 8 }}>{t("c1gameHatched")}</h3>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 8 }}>{t("c1gameHatchedDesc")}</p>
            <p style={{ fontSize: 17, color: TEAL, fontWeight: 600, marginBottom: 28 }}>{t("c1gameScore", correctCount)}</p>
            <div style={{ marginBottom: 32 }}>
              <CuteDino color={eggColor} size={140} name={Array.isArray(dinoNames) ? dinoNames[chosenEgg] : ""} delay={0.2} index={chosenEgg} />
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: "#6BA3C4", marginBottom: 8 }}>{t("c1gameFrozen")}</h3>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 8 }}>{t("c1gameFrozenDesc")}</p>
            <p style={{ fontSize: 17, color: CORAL, fontWeight: 600, marginBottom: 28 }}>{t("c1gameScore", correctCount)}</p>
            <div style={{ marginBottom: 32 }}>
              <DragonEgg color={eggColor} size={100} state="frozen" />
            </div>
          </>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={reset} style={{ ...btnPrimary, background: hatched ? TEAL : CORAL }}>
            {lang === "zh" ? "選另一顆蛋 🥚" : "Pick another egg 🥚"}
          </button>
          {hatched && (
            <button style={{ background: "transparent", border: `1.5px solid ${TEAL}`, color: TEAL, padding: "11px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("c1gameContinue")}</button>
          )}
        </div>
      </div>
    );
  }

  // ── Playing ──
  const q = questions[current];
  const isCorrect = selected !== null && selected === q.correct;
  const eggVisualState = frozen ? "frozen" : eggStage >= 5 ? "hatch" : eggStage > 0 ? "crack" : iceStage > 0 ? "chilled" : "idle";

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{t("c1gameQ", current + 1)}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#3DA87A" }}>☀️ {correctCount}</span>
          <span style={{ fontSize: 12, color: CORAL }}>❄️ {wrongCount}/3</span>
        </div>
      </div>

      {/* Egg with progress visualization */}
      <div style={{ textAlign: "center", marginBottom: 20, position: "relative", minHeight: 180 }}>
        {/* Particle layer */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 10 }}>
          {particles.map(p => (
            <div key={p.id} style={{
              position: "absolute",
              left: `${p.x}%`,
              top: "-10%",
              fontSize: p.size,
              animation: `${p.type === "sun" ? "sunFall" : "snowFall"} ${p.duration}s ease-in ${p.delay}s forwards`,
              opacity: 0,
            }}>
              {p.type === "sun" ? "☀️" : "❄️"}
            </div>
          ))}
        </div>

        {/* Persistent warm glow */}
        {eggStage > 0 && (
          <div style={{
            position: "absolute", left: "50%", top: "42%", transform: "translate(-50%, -50%)",
            width: 80 + eggStage * 20, height: 80 + eggStage * 20, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,179,71,${0.08 + eggStage * 0.06}) 0%, rgba(255,220,100,${0.04 + eggStage * 0.03}) 50%, transparent 70%)`,
            transition: "all 0.8s ease-out",
            pointerEvents: "none",
            boxShadow: `0 0 ${eggStage * 12}px ${eggStage * 4}px rgba(255,179,71,${eggStage * 0.06})`,
          }} />
        )}

        {/* Persistent frost glow */}
        {iceStage > 0 && (
          <div style={{
            position: "absolute", left: "50%", top: "42%", transform: "translate(-50%, -50%)",
            width: 80 + iceStage * 24, height: 80 + iceStage * 24, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(158,216,234,${0.1 + iceStage * 0.08}) 0%, rgba(180,230,250,${0.05 + iceStage * 0.04}) 50%, transparent 70%)`,
            transition: "all 0.8s ease-out",
            pointerEvents: "none",
            boxShadow: `0 0 ${iceStage * 14}px ${iceStage * 5}px rgba(158,216,234,${iceStage * 0.08})`,
          }} />
        )}

        {/* Answer flash glow */}
        {answered && (
          <div style={{
            position: "absolute", left: "50%", top: "42%", transform: "translate(-50%, -50%)",
            width: 140, height: 140, borderRadius: "50%",
            background: isCorrect
              ? "radial-gradient(circle, rgba(255,179,71,0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(158,216,234,0.4) 0%, transparent 70%)",
            animation: "glowPulse 1s ease-out",
            pointerEvents: "none",
          }} />
        )}

        <div style={{ position: "relative", display: "inline-block" }}>
          <DragonEgg color={eggColor} size={90} state={answered ? (isCorrect ? "crack" : (frozen ? "frozen" : "idle")) : "idle"} />
        </div>

        {/* Progress indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12, alignItems: "center" }}>
          {[0,1,2,3,4].map(i => (
            <div key={`sun-${i}`} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i < eggStage ? "linear-gradient(135deg, #FFD700, #FFB347)" : `${LIGHT_BORDER}88`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, transition: "all 0.5s ease-out",
              boxShadow: i < eggStage ? "0 0 8px rgba(255,179,71,0.5)" : "none",
              transform: i < eggStage ? "scale(1)" : "scale(0.85)",
            }}>
              {i < eggStage ? "☀️" : "○"}
            </div>
          ))}
          <div style={{ width: 1, height: 20, background: LIGHT_BORDER, margin: "0 4px" }} />
          {[0,1,2].map(i => (
            <div key={`ice-${i}`} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i < iceStage ? "linear-gradient(135deg, #B8E4F0, #9ED8EA)" : `${LIGHT_BORDER}88`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, transition: "all 0.5s ease-out",
              boxShadow: i < iceStage ? "0 0 8px rgba(158,216,234,0.5)" : "none",
              transform: i < iceStage ? "scale(1)" : "scale(0.85)",
            }}>
              {i < iceStage ? "❄️" : "○"}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>
          {lang === "zh"
            ? `☀️ ${eggStage}/5 孵化   ❄️ ${iceStage}/3 凍結`
            : `☀️ ${eggStage}/5 hatch   ❄️ ${iceStage}/3 freeze`}
        </div>
      </div>

      {/* Question */}
      <h3 style={{ fontSize: 17, fontWeight: 600, color: DARK, marginBottom: 18, lineHeight: 1.5 }}>{q.q}</h3>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {q.opts.map((opt, idx) => {
          let bg = "#FAFAF7", border = LIGHT_BORDER, col = DARK;
          if (answered) {
            if (idx === q.correct) { bg = "#E6F5F0"; border = "#3DA87A"; col = "#2A7A5A"; }
            else if (idx === selected && idx !== q.correct) { bg = "#FDEEEB"; border = "#D94B2E"; col = "#B83A20"; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: "12px 16px", textAlign: "left", fontSize: 14, color: col, cursor: answered ? "default" : "pointer", transition: "all 0.2s", fontWeight: answered && idx === q.correct ? 600 : 400, lineHeight: 1.5 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${border}`, fontSize: 12, fontWeight: 600, marginRight: 10, background: answered && idx === q.correct ? "#3DA87A" : "transparent", color: answered && idx === q.correct ? "#FFF" : col }}>{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div style={{
          background: isCorrect ? "#FFF8E6" : "#EDF6FC", borderRadius: 12,
          padding: "14px 18px", marginBottom: 16, fontSize: 13.5, lineHeight: 1.65, color: MUTED,
          border: `1px solid ${isCorrect ? "#FFB34733" : "#9ED8EA33"}`,
        }}>
          <strong style={{ color: isCorrect ? "#C8860A" : "#4A90B8" }}>
            {isCorrect
              ? (lang === "zh" ? "☀️ 陽光照射！龍蛋裂開了一些！" : "☀️ Sunshine! The egg is cracking!")
              : (lang === "zh" ? "❄️ 一陣寒風！龍蛋感到冰冷……" : "❄️ A cold wind! The egg feels icy…")}
          </strong>{" "}{q.exp}
        </div>
      )}

      {/* Next / Game Over */}
      {answered && !gameOver && (
        <div style={{ textAlign: "right" }}>
          <button onClick={nextQuestion} style={btnPrimary}>
            {current < 6 ? t("c1gameNext") : t("c1gameResults")}
          </button>
        </div>
      )}
      {gameOver && (
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <p style={{ fontSize: 14, color: CORAL, fontWeight: 600, marginBottom: 12 }}>
            {lang === "zh" ? "龍蛋被凍住了……" : "The egg froze…"}
          </p>
          <button onClick={() => setPhase("results")} style={{ ...btnPrimary, background: CORAL }}>
            {t("c1gameResults")}
          </button>
        </div>
      )}
    </div>
  );
}

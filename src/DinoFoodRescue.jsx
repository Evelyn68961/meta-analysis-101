// ═══════════════════════════════════════════════════════════
//  DinoFoodRescue.jsx — "Dino Food Rescue" game for Course 2
//  
//  Each dino's food is trapped in ice! Answer questions to
//  swing the pickaxe and crack the ice cubes open.
//  
//  Mechanics:
//    - Pick 1 of 7 dinos → 7 shuffled questions
//    - Correct = pickaxe swings, ice shatters, food freed!
//    - Wrong = pickaxe bounces off, see explanation, retry
//    - Full effects: pickaxe animation, ice particles, dino reactions
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import CuteDino from "./CuteDino";

// ═══ DESIGN TOKENS ═══
const PURPLE = "#7B68C8";
const DARK = "#1D2B3A";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const CARD_BG = "#FFFFFF";
const CORAL = "#E8734A";
const ICE_BLUE = "#A8D8EA";
const ICE_DARK = "#5B9BD5";
const ICE_LIGHT = "#D6EFF8";
const DINO_COLORS = ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6", "#E67E22", "#95A5A6"];

const btnPrimary = {
  background: PURPLE, border: "none", color: "#FFF",
  padding: "12px 28px", borderRadius: 10, fontSize: 14,
  fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
};

// ═══ SPECIES DATA ═══
// Food matched to species diet:
//   T-Rex (carnivore) → meat, Plesiosaur (marine) → fish,
//   Pterodactyl (aerial hunter) → shrimp, Triceratops (herbivore) → ferns,
//   Stegosaurus (herbivore) → plants, Velociraptor (small carnivore) → eggs,
//   Pachycephalosaurus (omnivore) → mushrooms
const DINO_FOOD = [
  { emoji: "🍖", en: "Meat", zh: "肉排" },
  { emoji: "🐟", en: "Fish", zh: "鮮魚" },
  { emoji: "🦐", en: "Shrimp", zh: "鮮蝦" },
  { emoji: "🌿", en: "Ferns", zh: "蕨葉" },
  { emoji: "🌱", en: "Cycads", zh: "蘇鐵" },
  { emoji: "🥚", en: "Eggs", zh: "蛋" },
  { emoji: "🍄", en: "Mushrooms", zh: "蘑菇" },
];

const DINO_NAMES_EN = ["Rex", "Azure", "Zephyr", "Blaze", "Thistle", "Velo", "Dome"];
const DINO_NAMES_ZH = ["翠牙龍", "蒼瀾龍", "金翼龍", "焰角龍", "紫棘龍", "珀爪龍", "鐵穹龍"];
const SPECIES_EN = ["T-Rex", "Plesiosaur", "Pterodactyl", "Triceratops", "Stegosaurus", "Velociraptor", "Pachycephalosaurus"];
const SPECIES_ZH = ["暴龍", "蛇頸龍", "翼龍", "三角龍", "劍龍", "迅猛龍", "厚頭龍"];

// ═══ ICE CUBE SVG ═══
function IceCube({ size = 80, state = "frozen", food = "🍖", crackPct = 0 }) {
  // state: frozen | cracking | shattered | freed
  const s = size;
  
  if (state === "freed") {
    return (
      <div style={{ width: s, height: s, display: "flex", alignItems: "center", justifyContent: "center", fontSize: s * 0.5, animation: "foodBounce 0.6s ease-out" }}>
        {food}
      </div>
    );
  }

  if (state === "shattered") {
    return (
      <div style={{ width: s, height: s, position: "relative" }}>
        {/* Ice shard particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * 360;
          const dist = 20 + Math.random() * 30;
          const dx = Math.cos(angle * Math.PI / 180) * dist;
          const dy = Math.sin(angle * Math.PI / 180) * dist;
          const sz = 4 + Math.random() * 8;
          return (
            <div key={i} style={{
              position: "absolute", left: "50%", top: "50%",
              width: sz, height: sz,
              background: i % 2 === 0 ? ICE_LIGHT : ICE_BLUE,
              borderRadius: "2px",
              transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${angle}deg)`,
              opacity: 0,
              animation: `iceShardFly 0.7s ease-out ${i * 0.04}s forwards`,
            }} />
          );
        })}
        {/* Food revealed */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: s * 0.5,
          animation: "foodPop 0.5s ease-out 0.2s both",
        }}>
          {food}
        </div>
      </div>
    );
  }

  // frozen or cracking
  return (
    <svg width={s} height={s} viewBox="0 0 80 80" style={{ filter: state === "cracking" ? "none" : `drop-shadow(0 2px 8px ${ICE_BLUE}66)` }}>
      <defs>
        <linearGradient id="iceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={ICE_LIGHT} />
          <stop offset="40%" stopColor={ICE_BLUE} stopOpacity="0.85" />
          <stop offset="100%" stopColor={ICE_DARK} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="iceShine" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Main ice block */}
      <rect x="8" y="8" width="64" height="64" rx="8" fill="url(#iceGrad)" stroke={ICE_DARK} strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Shine highlight */}
      <rect x="12" y="10" width="24" height="12" rx="4" fill="url(#iceShine)" />
      {/* Inner frost lines */}
      <line x1="20" y1="22" x2="30" y2="18" stroke="white" strokeWidth="0.8" opacity="0.5" />
      <line x1="50" y1="58" x2="62" y2="52" stroke="white" strokeWidth="0.8" opacity="0.4" />
      {/* Food visible through ice */}
      <text x="40" y="48" textAnchor="middle" fontSize="28" opacity="0.55">{food}</text>
      {/* Crack lines when cracking */}
      {crackPct > 0 && (
        <g opacity={Math.min(1, crackPct / 50)}>
          <path d="M40 8 L38 22 L44 30 L36 42 L42 52 L38 64 L40 72" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M44 30 L56 34 L62 40" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M36 42 L22 46 L14 50" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )}
      {crackPct > 50 && (
        <g opacity={Math.min(1, (crackPct - 50) / 50)}>
          <path d="M20 12 L26 28 L18 38" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M60 18 L54 32 L62 44" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

// ═══ PICKAXE SVG ═══
function Pickaxe({ swinging = false, bouncing = false }) {
  const animClass = swinging ? "pickaxeSwing" : bouncing ? "pickaxeBounce" : "";
  return (
    <div style={{
      transformOrigin: "20% 20%",
      animation: animClass ? `${animClass} 0.5s ease-in-out forwards` : "none",
      display: "inline-block",
    }}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        {/* Handle */}
        <line x1="16" y1="16" x2="52" y2="52" stroke="#8B6B3D" strokeWidth="4" strokeLinecap="round" />
        {/* Handle wrap */}
        <line x1="40" y1="40" x2="48" y2="48" stroke="#A67C4A" strokeWidth="5" strokeLinecap="round" />
        {/* Head */}
        <path d="M10 22 Q8 14 14 10 L22 14 Q18 18 14 22 Z" fill="#7C8B9C" stroke="#5A6672" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Tip */}
        <path d="M12 12 L8 6" stroke="#5A6672" strokeWidth="2.5" strokeLinecap="round" />
        {/* Shine */}
        <path d="M14 14 L17 11" stroke="white" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ═══ ICE PROGRESS BAR ═══
function IceProgress({ total, freed, current }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
      {[...Array(total)].map((_, i) => (
        <div key={i} style={{
          width: 32, height: 32,
          borderRadius: 6,
          background: i < freed ? "#E6F5F0" : i === current ? `${PURPLE}18` : "#F5F5F3",
          border: `2px solid ${i < freed ? "#3DA87A" : i === current ? PURPLE : LIGHT_BORDER}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
          transition: "all 0.3s",
          transform: i === current ? "scale(1.1)" : "scale(1)",
        }}>
          {i < freed ? "✅" : "🧊"}
        </div>
      ))}
    </div>
  );
}

// ═══ MAIN GAME COMPONENT ═══
export default function DinoFoodRescue({ t, lang }) {
  const [phase, setPhase] = useState("welcome"); // welcome | playing | smashing | results
  const [chosenDino, setChosenDino] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [freedCount, setFreedCount] = useState(0);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [isRetry, setIsRetry] = useState(false);
  const [iceState, setIceState] = useState("frozen"); // frozen | cracking | shattered | freed
  const [crackPct, setCrackPct] = useState(0);
  const [axeState, setAxeState] = useState("idle"); // idle | swinging | bouncing
  const [dinoMood, setDinoMood] = useState("neutral"); // neutral | happy | sad | eating
  const [showExplanation, setShowExplanation] = useState(false);

  // Build question set from i18n keys
  const allQuestions = [];
  for (let i = 1; i <= 7; i++) {
    allQuestions.push({
      q: t(`c2gq${i}`),
      opts: [t(`c2gq${i}a`), t(`c2gq${i}b`), t(`c2gq${i}c`), t(`c2gq${i}d`)],
      correct: t(`c2gq${i}correct`),
      exp: t(`c2gq${i}exp`),
    });
  }

  const startGame = (dinoIdx) => {
    setChosenDino(dinoIdx);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setIsCorrect(false);
    setFreedCount(0);
    setFirstTryCount(0);
    setIsRetry(false);
    setIceState("frozen");
    setCrackPct(0);
    setAxeState("idle");
    setDinoMood("neutral");
    setShowExplanation(false);
    setPhase("playing");
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].correct;
    setIsCorrect(correct);

    if (correct) {
      // Pickaxe swing → crack → shatter → freed
      setAxeState("swinging");
      setDinoMood("happy");
      if (!isRetry) setFirstTryCount(c => c + 1);

      // Animate: crack grows, then shatter
      setCrackPct(0);
      setIceState("cracking");
      let pct = 0;
      const crackInterval = setInterval(() => {
        pct += 15;
        setCrackPct(pct);
        if (pct >= 100) {
          clearInterval(crackInterval);
          setTimeout(() => {
            setIceState("shattered");
            setAxeState("idle");
            setTimeout(() => {
              setIceState("freed");
              setDinoMood("eating");
              setFreedCount(c => c + 1);
            }, 700);
          }, 300);
        }
      }, 80);
    } else {
      // Pickaxe bounce off
      setAxeState("bouncing");
      setDinoMood("sad");
      setShowExplanation(true);
      setTimeout(() => setAxeState("idle"), 600);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setAnswered(false);
    setIsCorrect(false);
    setIsRetry(true);
    setShowExplanation(false);
    setDinoMood("neutral");
    setAxeState("idle");
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setIsCorrect(false);
      setIsRetry(false);
      setIceState("frozen");
      setCrackPct(0);
      setAxeState("idle");
      setDinoMood("neutral");
      setShowExplanation(false);
    } else {
      setPhase("results");
      setDinoMood("eating");
    }
  };

  const reset = () => {
    setPhase("welcome");
    setChosenDino(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setIsCorrect(false);
    setFreedCount(0);
    setFirstTryCount(0);
    setIsRetry(false);
    setIceState("frozen");
    setCrackPct(0);
    setAxeState("idle");
    setDinoMood("neutral");
    setShowExplanation(false);
  };

  const dinoName = chosenDino !== null ? (lang === "zh" ? DINO_NAMES_ZH[chosenDino] : DINO_NAMES_EN[chosenDino]) : "";
  const speciesName = chosenDino !== null ? (lang === "zh" ? SPECIES_ZH[chosenDino] : SPECIES_EN[chosenDino]) : "";
  const dinoColor = chosenDino !== null ? DINO_COLORS[chosenDino] : PURPLE;
  const food = chosenDino !== null ? DINO_FOOD[chosenDino] : DINO_FOOD[0];

  // ═══ WELCOME: Pick a Dino ═══
  if (phase === "welcome") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 28px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <style>{gameAnimations}</style>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧊</div>
        <h3 style={{ fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 8 }}>
          {lang === "zh" ? "恐龍食物救援" : "Dino Food Rescue"}
        </h3>
        <p style={{ fontSize: 15, color: MUTED, maxWidth: 460, margin: "0 auto 8px", lineHeight: 1.6 }}>
          {lang === "zh"
            ? "每隻恐龍的食物被困在冰塊裡！答對文獻搜尋的問題，揮動鶴嘴鋤敲碎冰塊，拯救食物！"
            : "Each dino's food is trapped in ice! Answer literature search questions to swing your pickaxe and crack the ice cubes open!"}
        </p>
        <p style={{ fontSize: 14, color: PURPLE, fontWeight: 600, marginBottom: 28 }}>
          {lang === "zh" ? "選一隻恐龍開始 ↓" : "Pick a dino to start ↓"}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {DINO_COLORS.map((c, i) => (
            <div key={i} onClick={() => startGame(i)} style={{ cursor: "pointer", textAlign: "center", transition: "all 0.2s", padding: "8px 6px", borderRadius: 12 }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.background = `${c}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "transparent"; }}>
              <CuteDino color={c} size={56} index={i} />
              <div style={{ fontSize: 11, fontWeight: 600, color: c, marginTop: 2 }}>
                {lang === "zh" ? DINO_NAMES_ZH[i] : DINO_NAMES_EN[i]}
              </div>
              <div style={{ fontSize: 16, marginTop: 2 }}>{DINO_FOOD[i].emoji}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ RESULTS ═══
  if (phase === "results") {
    const total = questions.length;
    const tier = firstTryCount >= 6 ? "master" : firstTryCount >= 4 ? "good" : "learning";
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 28px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <style>{gameAnimations}</style>
        <div style={{ fontSize: 48, marginBottom: 12, animation: "foodBounce 0.8s ease-out" }}>
          {tier === "master" ? "🏆" : tier === "good" ? "👍" : "📚"}
        </div>
        <h3 style={{ fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 8 }}>
          {tier === "master"
            ? (lang === "zh" ? "搜尋大師！" : "Search Master!")
            : tier === "good"
            ? (lang === "zh" ? "表現不錯！" : "Nice Work!")
            : (lang === "zh" ? "繼續學習！" : "Keep Learning!")}
        </h3>
        <p style={{ fontSize: 15, color: MUTED, marginBottom: 6, lineHeight: 1.6 }}>
          {lang === "zh"
            ? `你一次答對了 ${firstTryCount} / ${total} 題，成功拯救了 ${dinoName} 的所有食物！`
            : `You got ${firstTryCount} / ${total} right on the first try, and rescued all of ${dinoName}'s food!`}
        </p>
        <p style={{ fontSize: 14, color: dinoColor, fontWeight: 600, marginBottom: 24 }}>
          {food.emoji} {lang === "zh" ? `${dinoName}（${speciesName}）吃飽飽了！` : `${dinoName} the ${speciesName} is full and happy!`}
        </p>
        {/* Happy dino with food */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ animation: "dinoHappyBounce 1s ease-in-out infinite" }}>
            <CuteDino color={dinoColor} size={tier === "master" ? 120 : 100} index={chosenDino} />
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 120 }}>
            {[...Array(total)].map((_, i) => (
              <span key={i} style={{ fontSize: 22, animation: `foodPop 0.4s ease-out ${i * 0.1}s both` }}>{food.emoji}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={reset} style={btnPrimary}>
            {lang === "zh" ? "再玩一次" : "Play Again"}
          </button>
        </div>
      </div>
    );
  }

  // ═══ PLAYING ═══
  const q = questions[current];

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 22px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <style>{gameAnimations}</style>

      {/* Progress */}
      <IceProgress total={questions.length} freed={freedCount} current={current} />

      {/* Visual area: Dino + Ice + Pickaxe */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 16, marginBottom: 20, minHeight: 120, position: "relative",
      }}>
        {/* Dino */}
        <div style={{
          animation: dinoMood === "happy" ? "dinoHappyBounce 0.6s ease-in-out" :
                     dinoMood === "sad" ? "dinoSadShake 0.5s ease-in-out" :
                     dinoMood === "eating" ? "dinoHappyBounce 0.8s ease-in-out infinite" : "none",
        }}>
          <CuteDino color={dinoColor} size={70} index={chosenDino} />
          {/* Thought bubble with food */}
          {dinoMood === "neutral" && (
            <div style={{
              position: "relative", top: -78, left: 50,
              background: "white", border: `1.5px solid ${LIGHT_BORDER}`,
              borderRadius: "50%", width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              animation: "thoughtFloat 2s ease-in-out infinite",
            }}>
              {food.emoji}
            </div>
          )}
        </div>

        {/* Pickaxe */}
        <div style={{ position: "relative", top: -10 }}>
          <Pickaxe swinging={axeState === "swinging"} bouncing={axeState === "bouncing"} />
        </div>

        {/* Ice Cube */}
        <div style={{
          animation: axeState === "bouncing" ? "iceShake 0.3s ease-in-out" : "none",
        }}>
          <IceCube size={80} state={iceState} food={food.emoji} crackPct={crackPct} />
        </div>
      </div>

      {/* Question counter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>
          {lang === "zh" ? `第 ${current + 1} / ${questions.length} 題` : `Q ${current + 1} / ${questions.length}`}
          {isRetry && <span style={{ color: CORAL, marginLeft: 8, fontSize: 12 }}>
            {lang === "zh" ? "🔄 再試一次" : "🔄 Retry"}
          </span>}
        </span>
        <span style={{ fontSize: 13, color: "#3DA87A", fontWeight: 600 }}>
          {food.emoji} ×{freedCount}
        </span>
      </div>

      {/* Question */}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 16, lineHeight: 1.55 }}>{q.q}</h3>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {q.opts.map((opt, idx) => {
          let bg = "#FAFAF7", border = LIGHT_BORDER, col = DARK, fw = 400;
          if (answered) {
            if (idx === q.correct) { bg = "#E6F5F0"; border = "#3DA87A"; col = "#2A7A5A"; fw = 600; }
            else if (idx === selected && idx !== q.correct) { bg = "#FDEEEB"; border = "#D94B2E"; col = "#B83A20"; }
          } else if (idx === selected) {
            bg = `${PURPLE}08`; border = PURPLE;
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} disabled={answered}
              style={{
                background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
                padding: "11px 14px", textAlign: "left", fontSize: 14, color: col,
                cursor: answered ? "default" : "pointer", transition: "all 0.2s",
                fontWeight: fw, lineHeight: 1.5, opacity: 1,
              }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 22, height: 22, borderRadius: "50%",
                border: `1.5px solid ${answered && idx === q.correct ? "#3DA87A" : border}`,
                fontSize: 11, fontWeight: 600, marginRight: 10,
                background: answered && idx === q.correct ? "#3DA87A" : "transparent",
                color: answered && idx === q.correct ? "#FFF" : col,
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation (wrong answer) */}
      {showExplanation && !isCorrect && (
        <div style={{
          background: "#FDEEEB", borderRadius: 12, padding: "14px 16px",
          marginBottom: 14, fontSize: 13.5, lineHeight: 1.65, color: MUTED,
          border: "1px solid #D94B2E33",
          animation: "fadeInUp 0.3s ease-out",
        }}>
          <strong style={{ color: "#B83A20" }}>
            {lang === "zh" ? "❌ 鶴嘴鋤彈開了！" : "❌ The pickaxe bounced off!"}
          </strong>{" "}{q.exp}
          <div style={{ marginTop: 12 }}>
            <button onClick={handleRetry} style={{
              ...btnPrimary,
              background: CORAL,
              padding: "9px 22px",
              fontSize: 13,
              boxShadow: `0 2px 12px ${CORAL}33`,
            }}>
              {lang === "zh" ? "🔄 再揮一次" : "🔄 Swing Again"}
            </button>
          </div>
        </div>
      )}

      {/* Correct feedback + Next */}
      {answered && isCorrect && iceState === "freed" && (
        <div style={{
          background: "#E6F5F0", borderRadius: 12, padding: "14px 16px",
          marginBottom: 14, fontSize: 13.5, lineHeight: 1.65, color: MUTED,
          border: "1px solid #3DA87A33",
          animation: "fadeInUp 0.3s ease-out",
        }}>
          <strong style={{ color: "#2A7A5A" }}>
            {lang === "zh" ? `✅ 冰塊碎了！${food.emoji} 被拯救了！` : `✅ Ice shattered! ${food.emoji} rescued!`}
          </strong>{" "}{q.exp}
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <button onClick={nextQuestion} style={btnPrimary}>
              {current < questions.length - 1
                ? (lang === "zh" ? "下一塊冰 →" : "Next Ice →")
                : (lang === "zh" ? "看結果" : "See Results")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ CSS ANIMATIONS ═══
const gameAnimations = `
@keyframes pickaxeSwing {
  0% { transform: rotate(0deg); }
  30% { transform: rotate(-60deg); }
  50% { transform: rotate(-60deg); }
  70% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
}
@keyframes pickaxeBounce {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-45deg); }
  40% { transform: rotate(-45deg); }
  55% { transform: rotate(15deg) translateX(8px); }
  70% { transform: rotate(8deg) translateX(4px); }
  100% { transform: rotate(0deg) translateX(0); }
}
@keyframes iceShardFly {
  0% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(-50%, -50%) translate(var(--dx, 30px), var(--dy, -20px)) rotate(180deg); opacity: 0; }
}
@keyframes iceShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
@keyframes foodPop {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.3) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes foodBounce {
  0% { transform: translateY(0); }
  30% { transform: translateY(-12px); }
  50% { transform: translateY(0); }
  70% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}
@keyframes dinoHappyBounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-3deg); }
  75% { transform: translateY(-4px) rotate(3deg); }
}
@keyframes dinoSadShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}
@keyframes thoughtFloat {
  0%, 100% { transform: translateY(0); opacity: 0.9; }
  50% { transform: translateY(-4px); opacity: 1; }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes iceShardFly {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.3) translateY(-30px); }
}
`;

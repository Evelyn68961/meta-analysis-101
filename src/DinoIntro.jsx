// ═══════════════════════════════════════════════════════════
//  DinoIntro.jsx — Drop this in your project to preview all 7 dinos
//  
//  Usage (pick one):
//    Option A: Add a route to this page (e.g. /dino-preview)
//    Option B: Temporarily replace your App.jsx default export with this
//    Option C: In your main App, temporarily add: <DinoIntro />
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import CuteDino from "./CuteDino";

const COLORS = ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6", "#E67E22", "#95A5A6"];
const NAMES = ["Rex", "Nessie", "Pterry", "Spike", "Stego", "Zippy", "Tank"];
const SPECIES = ["T-Rex", "Plesiosaur", "Pterodactyl", "Triceratops", "Stegosaurus", "Velociraptor", "Ankylosaurus"];

export default function DinoIntro() {
  const [size, setSize] = useState(150);
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "system-ui, sans-serif", padding: 40 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1D2B3A", marginBottom: 8 }}>
          🦕 Dino Preview — Edit CuteDino.jsx & save to see changes
        </h1>
        <p style={{ color: "#6B7A8D", marginBottom: 24 }}>
          Click a dino to see it large. Use the slider to test different sizes.
        </p>

        {/* Size control */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: "#6B7A8D" }}>Size: {size}px</label>
          <input type="range" min="50" max="250" value={size} onChange={e => setSize(Number(e.target.value))} style={{ width: 200 }} />
        </div>

        {/* All 7 dinos in a grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {COLORS.map((c, i) => (
            <div
              key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              style={{
                background: selected === i ? `${c}10` : "#fff",
                border: `2px solid ${selected === i ? c : "#e0e0e0"}`,
                borderRadius: 16,
                padding: "20px 12px 16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <CuteDino color={c} size={size} index={i} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: c }}>{NAMES[i]}</div>
                <div style={{ fontSize: 12, color: "#6B7A8D" }}>{SPECIES[i]}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>index={i}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected dino large view */}
        {selected !== null && (
          <div style={{ background: "#fff", border: "2px solid #e0e0e0", borderRadius: 16, padding: 32, textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, color: COLORS[selected], marginBottom: 16 }}>
              {NAMES[selected]} — {SPECIES[selected]}
            </h2>
            <CuteDino color={COLORS[selected]} size={250} index={selected} />
          </div>
        )}

        {/* Game-size preview row */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e0e0e0", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#0E7C86", marginBottom: 12 }}>
            Game Size (70px)
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
            {COLORS.map((c, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <CuteDino color={c} size={70} index={i} />
                <div style={{ fontSize: 11, color: "#6B7A8D", marginTop: 4 }}>{NAMES[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

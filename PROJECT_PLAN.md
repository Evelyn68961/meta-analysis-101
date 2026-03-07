# Meta-Analysis 101 — Project Plan & Strategy

## Overview
An interactive bilingual (ZH/EN) educational website teaching meta-analysis from beginner to advanced. Built with React, using a shared i18n system and hash-based routing between courses. Each course ends with a unique mini-game (2-3 min) to reinforce learning.

## Teaching Schedule
- **Hour 1:** Courses 0–3 (Planning & Preparation)
- **Hour 2:** Courses 4–5 (Analysis & Interpretation)
- Games are kept short (2-3 min each) for live classroom use

---

## Course Structure

| Course | Topic | Game | Status |
|--------|-------|------|--------|
| 0 | What is Meta-Analysis? | Egg Hunt (7 eggs, 7 categories, cheat sheet rewards) | ✅ Live on `main` |
| 1 | PICO/PICOS Research Question | Dino Egg Hatch (pick 1 of 7 eggs, 7 Qs from 70-question bank, 5 correct = hatch, 3 wrong = freeze, sun/frost particles) | ✅ Built on `dev` |
| 2 | Literature Search & PRISMA | Dino Food Rescue (pick 1 of 7 dinos, 7 Qs from 70-question bank, crack ice with pickaxe, second chance on wrong, species-matched food) | ✅ Built on `dev` |
| 3 | Data Extraction & Risk of Bias | TBD | ❌ Not started |
| 4 | Effect Sizes & Forest Plots | TBD | ❌ Not started |
| 5 | Heterogeneity & Publication Bias | TBD | ❌ Not started |

---

## File Structure (on `dev` branch)

```
src/
├── App.jsx              ← Router + Course Hub page (hash routing: #hub, #course0, #course1, #course2, #dino)
├── Course0.jsx          ← Course 0 (original site, accepts onNavigate prop)
├── Course1.jsx          ← Course 1: PICO (teaching sections + AI workshop; game extracted)
├── Course2.jsx          ← Course 2: Literature Search & PRISMA (teaching sections + AI workshop; game extracted)
├── CuteDino.jsx         ← Shared dinosaur SVG component (7 unique species, used across courses)
├── DinoEggHatch.jsx     ← Course 1 game: dragon egg hatching (standalone component, exports DragonEgg SVG)
├── DinoFoodRescue.jsx   ← Course 2 game: ice-breaking food rescue (standalone component)
├── DinoIntro.jsx        ← Dino preview/debug page (accessible at #dino)
├── questionBank.js      ← Centralized bilingual question bank for all course games (140 Qs: 70 C1 + 70 C2)
├── i18n.js              ← All translations (Course 0 + Hub + Course 1 + Course 2); game questions moved to questionBank.js
└── index.js             ← Entry point (wraps App in I18nProvider)
```

---

## Git Strategy
- **`main` branch:** Public, deployed. Currently only Course 0.
- **`dev` branch:** Development. All courses. Push here freely.
- **To publish:** `main` ← merge `dev` when ready (via GitHub Desktop "Pull Request")
- **Tool:** GitHub Desktop (no command line needed)

---

## Course 1 Details (PICO)

### Sections (in order):
1. **Why PICO?** — Bad vs good question comparison
2. **PICO Elements** — 4 interactive cards (P, I, C, O) in 2×2 grid
3. **PICOS Extension** — The S (Study design) element
4. **Common Mistakes** — 5 PICO traps (bad/good comparison cards)
5. **Interactive PICO Builder** — Multiple-choice: pick best P, I, C, O for 3 scenarios (Cardiology/Infectious Disease/Psychiatry)
6. **Dino Egg Hatch Game** — Pick 1 of 7 eggs → 7 questions drawn from 70-question bank (balanced across 7 categories) → 5 correct = hatch dinosaur with sun particles, 3 wrong = freeze with snowflake particles
7. **AI PICO Workshop** — Pick scenario, write free-text PICO, AI gives inline feedback per field + overall assessment

### Game Mechanics (Dino Egg Hatch):
- Standalone component in `DinoEggHatch.jsx`, imported by `Course1.jsx` (same pattern as Course 2's DinoFoodRescue)
- Also exports `DragonEgg` SVG component (named export) used decoratively in Course1 hero section
- 70-question bank in `questionBank.js` (`course1Questions`), 10 per category × 7 categories:
  - Cat 0: Identifying correct PICO format
  - Cat 1: Population (P) — specificity & scope
  - Cat 2: Intervention (I) — defining the treatment
  - Cat 3: Comparison (C) — choosing comparators
  - Cat 4: Outcome (O) — measurable endpoints
  - Cat 5: PICOS & Study design (S)
  - Cat 6: Common mistakes & pitfalls
- `pickBalanced()` helper draws 7 questions evenly across categories, then shuffles
- Each playthrough gets different questions — high replayability
- 7 eggs with unique colors matching Course 0's palette: `#2ECC71, #3498DB, #F1C40F, #E74C3C, #9B59B6, #E67E22, #95A5A6`
- 7 dinosaur names (zh): 翠牙龍, 蒼瀾龍, 金翼龍, 焰角龍, 紫棘龍, 珀爪龍, 鐵穹龍
- 7 dinosaur names (en): Rex, Azure, Zephyr, Blaze, Thistle, Velo, Dome
- Correct → ☀️ sun particles fall + warm golden glow grows around egg
- Wrong → ❄️ snowflake particles fall + frost blue glow grows around egg
- Progress shown as: 5 sun circles ○○○○○ | 3 ice circles ○○○

### Known Issues:
- **AI Workshop doesn't work** — Anthropic API requires authentication. Needs a backend proxy (e.g., Vercel/Netlify serverless function) to hide API key. Same issue in Course 2's AI section.
- Emoji rendering: some newer Unicode emojis (🫀🦠🧠) don't render on all systems. Use older, safer alternatives.

---

## Course 2 Details (Literature Search & PRISMA)

### Sections:
1. **Why Systematic Search?** — Random vs systematic comparison
2. **Database Overview** — PubMed, Embase, Cochrane, WoS, CINAHL, Grey literature
3. **Boolean Operators** — AND/OR/NOT with interactive Venn diagrams
4. **PRISMA Flow Diagram** — Interactive visualization
5. **Screening Tips** — 4 practical tips
6. **Dino Food Rescue Game** — Pick 1 of 7 dinos → 7 shuffled questions → crack ice cubes with pickaxe to free food
7. **AI Search Strategy Workshop** — Same API issue as Course 1

### Game Mechanics (Dino Food Rescue):
- Standalone component in `DinoFoodRescue.jsx`, imported by `Course2.jsx`
- Pick 1 of 7 dinos → each has species-matched food trapped in ice cubes
- 70-question bank in `questionBank.js` (`course2Questions`), 10 per category × 7 categories:
  - Cat 0: Systematic vs casual search
  - Cat 1: Databases (PubMed, Embase, Cochrane, etc.)
  - Cat 2: Boolean operators & search syntax (AND, OR, NOT, MeSH, truncation)
  - Cat 3: PRISMA flow diagram
  - Cat 4: Screening process
  - Cat 5: Grey literature & search completeness
  - Cat 6: Search strategy pitfalls & best practices
- 7 questions drawn per playthrough via `pickBalanced()` — different each time
- Old i18n keys (`c2gq1`–`c2gq7`) to be replaced with questionBank import (same pattern as Course 1)
- Correct → pickaxe swing animation → ice crack lines grow → ice shatters into particles → food pops out → dino bounces happily
- Wrong → pickaxe bounces off → ice shakes → explanation shown → "Swing Again" retry button (second chance)
- Score tracks first-try correct count; all food is always eventually rescued
- Progress bar: 7 ice cube icons, each replaced by ✅ when freed
- Dino reactions: happy bounce (correct), sad shake (wrong), eating animation (food freed)
- Species-matched food: Rex→🍖, Azure→🐟, Zephyr→🦐, Blaze→🌿, Thistle→🌱, Velo→🥚, Dome→🍄
- Results screen: tiered message (master ≥6, good ≥4, learning <4), dino with all freed food displayed
- Bilingual UI strings handled internally (no new i18n keys needed)

### TODO:
- Wire `DinoFoodRescue.jsx` to use `questionBank.js` (replace `c2gq*` i18n loop with `course2Questions` import + `pickBalanced`)
- Remove old `c2gq*` keys from `i18n.js` after wiring
- Fix AI workshop (backend proxy issue)

---

## Design System

### Colors:
- TEAL: `#0E7C86` (primary, Course 0)
- CORAL: `#E8734A` (accent, Course 1)
- PURPLE: `#7B68C8` (Course 2 accent)
- DARK: `#1D2B3A` (text)
- LIGHT_BG: `#F8F7F4` (background)
- MUTED: `#6B7A8D` (secondary text)
- LIGHT_BORDER: `#E8E6E1`

### Fonts:
- Headings: 'Noto Sans TC', 'Source Serif 4', serif
- Body: 'Noto Sans TC', 'Outfit', sans-serif

### Shared Components:
- `FadeIn` — Intersection observer scroll animation
- `SectionLabel` — Uppercase colored label with line
- `SectionTitle` — Responsive heading
- `Paragraph` — Styled body text
- `CuteDino` — 7 unique dinosaur SVGs (T-Rex, Plesiosaur, Pterodactyl, Triceratops, Stegosaurus, Velociraptor, Pachycephalosaurus)
- `DragonEgg` — SVG egg with states: idle, crack, frozen (lives in `DinoEggHatch.jsx`, exported as named export)

### i18n Pattern:
- All keys prefixed by course: `c1` for Course 1, `c2` for Course 2
- Template literals like `` t(`c1trap${n}Title`) `` need the prefix inside the backtick
- Function values (e.g., gameQ, gameScore) use `t("key", arg)` NOT `t("key")(arg)`
- Hub keys use `hub` prefix
- **Game questions are NOT in i18n.js** — they live in `questionBank.js` with bilingual text embedded per question object

---

## Courses 3-5 (Not Yet Started)

### Course 3: Data Extraction & Risk of Bias
- Teaching: extraction tables, Cochrane RoB tool, Newcastle-Ottawa Scale
- Game: TBD

### Course 4: Effect Sizes & Forest Plots
- Teaching: OR, RR, MD, SMD calculation, weighting, forest plot anatomy
- Game: TBD

### Course 5: Heterogeneity & Publication Bias
- Teaching: I², Q statistic, funnel plots, Egger's test, PRISMA reporting
- Game: TBD

---

## Technical Notes

### Adding a New Course:
1. Create `CourseN.jsx` with teaching sections + AI workshop
2. Create game as standalone component (e.g., `DinoGameN.jsx`) — import by CourseN
3. Add 70 bilingual questions to `questionBank.js` as `courseNQuestions` (10 per category × 7 categories)
4. Add translations to `i18n.js` with `cN` prefix (UI strings only — game questions stay in questionBank)
5. Add route in `App.jsx` switch statement
6. Add course card in `App.jsx` CourseHub courses array
7. Update hub status from "coming" to "available"

### Question Bank Architecture (`questionBank.js`):
- Centralized file for all course game questions — no questions in i18n.js
- Each question: `{ id, category, zh: { q, opts, exp }, en: { q, opts, exp }, correct }`
- `id` format: `"cN-XXX"` (e.g., `"c1-042"`, `"c2-015"`)
- `category` (0–6) maps to 7 thematic groups per course
- Helper functions exported:
  - `pickQuestions(pool, n)` — pure random pick
  - `pickBalanced(pool, n, numCategories)` — even coverage across categories, then shuffle
- Game components localize at runtime: `q[lang].q`, `q[lang].opts`, `q.correct`, `q[lang].exp`
- Currently: 140 questions total (70 Course 1 PICO + 70 Course 2 Literature Search)

### Common Pitfalls:
- Template literal translation keys MUST include prefix: `` t(`c1scenario${s}`) `` not `` t(`scenario${s}`) ``
- Function translation values: use `t("key", arg)` not `t("key")(arg)`
- Test emoji rendering across systems — prefer pre-2020 Unicode
- AI features need backend proxy for API key — currently broken in browser

### Backend TODO (for AI features):
- Need a serverless function (Vercel/Netlify) that:
  1. Receives PICO text from frontend
  2. Calls Anthropic API with hidden API key
  3. Returns AI feedback to frontend
- Affects: Course 1 AI Workshop, Course 2 AI Workshop

# Notes Drawer & Workshop Persistence — Plan & Implementation

**Status: shipped.** This file is both the original plan and a post-mortem of what actually happened during deployment.

Two related features added to the courses:

1. **Per-course collapsible note-taking side tab** with autosave + email/download export.
2. **Real-time persistence for workshops** so users who pause mid-workshop don't lose their inputs, AI feedback, or analysis state.

---

## Feature 1 — Notes Drawer

### Goal
Logged-in users can take free-form notes per course, kept in sync across devices, and exportable to their email or as a downloadable file.

### UX

**Entry point.** A vertical 40px tab pinned to the right edge of every Course page (Course0–5), always visible and fixed to the viewport (does not move with scroll).

**Drawer.** Click the tab → drawer slides out from the right.
- Desktop: ~360px wide, page content stays put underneath.
- Mobile (< 640px): ~92vw with a semi-transparent backdrop.
- Drawer header: course title + close (×) button.
- Body: a single large `<textarea>` filling the drawer.
- Status line under textarea: `Saving…` → `Saved · just now` → `Saved · 2 min ago`.
- Action bar at bottom: `Download ▼` (.txt / .docx) and `Email me`.

**No save button.** All saves are automatic. ⌘/Ctrl+S triggers an immediate flush as a power-user shortcut.

### Layout safety — drawer must NOT disturb the page underneath

| Rule | Reason |
|---|---|
| Drawer + tab use `position: fixed` | Taken out of document flow — page never reflows when drawer toggles |
| Animate via `transform: translateX(...)`, never `width` | Compositor-only, no layout/reflow per frame |
| Mount the drawer via `ReactDOM.createPortal(..., document.body)` | Avoids inheriting `transform` from `FadeIn` ancestors in Course pages, which would break `position: fixed` |
| No `padding-right` on `<body>` when open | Would reflow page content |
| No `body { overflow: hidden }` on desktop | Scrollbar disappearing causes page-width jump |
| Mobile scroll-lock must compensate for scrollbar width via `padding-right` | Prevents 15px content jump when drawer opens |
| Tab is always `position: fixed`, never `absolute` | Prevents tab moving with page scroll |

### Storage

**Supabase table `course_notes`**
```sql
create table course_notes (
  user_id uuid references auth.users(id) on delete cascade,
  course_id int not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table course_notes enable row level security;

create policy "users read own notes" on course_notes
  for select using (auth.uid() = user_id);
create policy "users write own notes" on course_notes
  for insert with check (auth.uid() = user_id);
create policy "users update own notes" on course_notes
  for update using (auth.uid() = user_id);
```

One note per `(user_id, course_id)` pair. Simpler UX, simpler schema, matches how students actually take running notes per topic. Schema can extend with a `note_id` later if multi-note is ever needed.

### Autosave behavior

- **Debounce 800ms** after last keystroke, then upsert to Supabase.
- **Flush on drawer collapse** — write any pending debounced change immediately.
- **Flush on `beforeunload`** via `navigator.sendBeacon` so a tab close doesn't lose the last keystrokes.
- **Failure fallback**: write to `localStorage` keyed by `user.id + course_id`. Show a "⚠ saved locally — will sync when reconnected" badge. On next successful Supabase write, clear the local copy. Last-write-wins on reconcile (fine for personal notes).

### Not-logged-in users
- Drawer still works, writing only to `localStorage`.
- Banner: "Sign in to sync these notes across devices."
- On login, one-shot prompt: "Import N chars of unsynced notes from this device?"

### Export

- **Download `.txt`** — `Blob` + `URL.createObjectURL`. Client-side.
- **Download `.docx`** — reuse the existing `docx` dependency (pattern in [generateReport.js](../src/generateReport.js)). Client-side.
- **Email** — POST to `/api/send-notes` (Vercel serverless function); backend dispatches the email via Gmail SMTP. See "Email transition: mailto → Gmail SMTP" under post-shipment hardening for the v1-to-v2 history.
- Filenames timestamped: `meta-analysis-course1-notes-2026-05-02.docx`.

### Reading notes later

Three access points:

1. **Drawer on the same course page** — rehydrated from Supabase on mount. Primary read path.
2. **Profile page** — new "My Notes" section listing each course with notes: preview (~150 chars), char count, last-edited timestamp, and `[Open] [Download] [Email]` actions per row. Clicking `Open` navigates to the course with the drawer pre-opened.
3. **Email / downloaded file** — the user's permanent personal artifact.

### Lifecycle table

| Stage | Where it lives | How it gets there |
|---|---|---|
| Drafting | React state | onChange |
| Persisted | Supabase `course_notes` | Debounced autosave (800ms) |
| Cross-device | Supabase | Auto-pulled on drawer mount when logged in |
| Offline backup | `localStorage` | Mirror of every save |
| Personal archive | User's email / Downloads | One-click export |

---

## Feature 2 — Workshop Real-Time Persistence

### Problem
Current workshops save only on completion:
- `AIPicoWorkshop` ([Course1.jsx:328](../src/Course1.jsx#L328)) keeps everything in local React state — refresh / pause loses all PICO inputs and AI feedback.
- WebRRunner advanced analysis fires `onAdvComplete` only after a successful run ([WebRRunner.jsx:1264](../src/WebRRunner.jsx#L1264)). There's no real "finish workshop" event, so progress between runs is lost.

### Goal
Every meaningful field (text input, scenario selection, AI feedback, completed-analysis history) is persisted as it happens. Pausing mid-workshop and returning later restores the full state.

### Storage

**Supabase table `workshop_state`** — generic key/value, one row per field:
```sql
create table workshop_state (
  user_id uuid references auth.users(id) on delete cascade,
  workshop_key text not null,    -- e.g. 'course1_pico', 'webr_advanced'
  field_key text not null,       -- e.g. 'inputs.p', 'advHistory'
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, workshop_key, field_key)
);

alter table workshop_state enable row level security;
-- same per-user RLS policies as course_notes
```

JSON value lets us store strings, arrays (`advHistory`), and small objects without schema changes.

### What gets saved per workshop

**`AIPicoWorkshop` (workshop_key: `course1_pico`)**
- `scenario` (A/B/C selection)
- `inputs.p`, `inputs.i`, `inputs.c`, `inputs.o`
- `feedback.p`, `feedback.i`, `feedback.c`, `feedback.o` — cache AI responses across sessions so users don't re-burn API calls
- `overallFeedback`

**WebRRunner advanced analysis (workshop_key: `webr_advanced`)**
- `advSelectedType`
- `advSelectedMod`
- `advRCode`
- `advOutput`
- `advHistory[]` — appended after each successful run, **not** at end of workshop

### Save behavior
- Debounce 600–1000ms per field.
- On mount, hydrate state from `workshop_state` before first render.
- Flush on `beforeunload`.
- Explicit "Reset workshop" button — never auto-clear. Users will lose work to a refresh and blame the app otherwise.

### Tradeoff (worth flagging)
Per-keystroke debounce = a Supabase write per field per pause. Fine for class-sized usage (hundreds of concurrent students). If this product ever runs at 10K concurrent, add a buffering layer (Redis / edge worker). Not a current concern.

---

## Implementation order

Workshop persistence first — it's a regression fix for an existing broken behavior. Notes drawer second — net-new feature.

1. **Supabase migration** — create `course_notes` and `workshop_state` tables + RLS policies. (User runs the SQL.)
2. **Workshop persistence**
   - Small `useWorkshopField(workshopKey, fieldKey, defaultValue)` hook that wraps `useState` + autosave + hydration.
   - Migrate `AIPicoWorkshop` field-by-field.
   - Migrate WebRRunner advanced state.
   - Add "Reset workshop" button to each.
3. **Notes drawer**
   - `<CourseNotes user={user} courseId={n} />` component, portal-mounted.
   - Autosave hook + `localStorage` fallback + offline-merge prompt on login.
   - Wire into Course0–5.
4. **Export**
   - `.txt` download, `.docx` download (reuse `docx` dep), `mailto:` email.
5. **Profile page "My Notes" section** — list view + per-row actions.

### Files expected to change
- `src/supabaseClient.js` — add note/workshop helpers.
- `src/CourseNotes.jsx` (new) — drawer component.
- `src/useWorkshopField.js` (new) — autosave hook for workshop state.
- `src/Course0.jsx` … `src/Course5.jsx` — mount `<CourseNotes>`.
- `src/Course1.jsx` — migrate `AIPicoWorkshop` to `useWorkshopField`.
- `src/WebRRunner.jsx` — migrate advanced-analysis state to `useWorkshopField`.
- `src/ProfilePage.jsx` — add "My Notes" section.
- `src/i18n.js` — translation keys for drawer UI / email subject.

### Open questions to resolve before coding
- Confirm the right edge of each course page (Course0–5) is genuinely empty in the rightmost 360px when drawer is open — verify per course before committing.
- Confirm `mailto:` is acceptable for v1, or whether we should plan the serverless email endpoint up front. *(Resolved: shipped `mailto:` in v1; replaced with Gmail SMTP in a follow-up — see "Email transition" below.)*
- Confirm note scope: one note per course (recommended) vs. allow multiple named notes per course.

---

## Post-deployment notes (what actually happened)

### Files that shipped
- `public/service-worker.js` — strategy rewrite (see "Bug 2" below)
- `plan & discussion/SQL_MIGRATION_NOTES_AND_WORKSHOP.sql` — Supabase migration
- `src/App.jsx` — `redirectTo` added to `signInWithOAuth` (see "Bug 3" below)
- `src/CourseNotes.jsx` (new) — drawer
- `src/Course0.jsx`…`src/Course5.jsx` — mount points
- `src/Course1.jsx` — `AIPicoWorkshop` migrated; status indicator + reset button
- `src/Final.jsx` — pass `user` through to `WebRRunner`
- `src/ProfilePage.jsx` — My Notes section + per-row actions
- `src/WebRRunner.jsx` — advanced-analysis state migrated; status indicator + reset button
- `src/notesExport.js` (new) — `.txt`/`.docx`/`mailto:` helpers
- `src/useWorkshopField.js` (new) — autosave hook

### Implementation notes vs. the original plan
- **i18n**: did *not* add dedicated translation keys. Used inline `lang === "zh" ? ... : ...` ternaries to match the existing pattern in `AIPicoWorkshop`/`AIPicoFreestyle`. If translation tables are added later, the inline strings are easy to grep and replace.
- **Tab vertical position**: started at `top: 40%` (vertical-center) and was moved to `top: 140` (just under SiteNav) after a deploy-time collision with the Vercel preview toolbar. See "Bug 1".
- **z-index**: bumped to ~max int32 (`2147483000`) on the tab/drawer/backdrop so future third-party overlays (Vercel preview toolbar, Intercom, etc.) don't cover them.

### Bugs hit during deployment & how they were resolved

**Bug 1 — Vercel preview toolbar covered the tab.**
- *Symptom*: tab visible on localhost, missing on `*-git-dev-*.vercel.app` previews.
- *Cause*: my original `top: 40%` placed the tab in the same right-edge zone as Vercel's preview-only floating toolbar (which uses a very high z-index).
- *Fix*: moved tab to `top: 140` and bumped z-index to ~int32-max.
- *Lesson*: when you have full control of the right edge in dev, remember production previews can inject their own widgets there. Prefer `top: <px>` near the nav over `top: <%>` mid-viewport.

**Bug 2 — Service worker served stale `index.html` indefinitely.**
- *Symptom*: notes code was on `main`, build succeeded, bundle was on the CDN, but returning visitors didn't see the tab even after hard refresh on the production URL.
- *Cause*: [public/service-worker.js](../public/service-worker.js) used a cache-first strategy for *every* request, including HTML. Once cached, the old `index.html` (referencing the old hashed JS bundle) was served forever; the new bundle was on the CDN but never linked to.
- *Fix*: rewrote the SW to be **network-first for HTML**, **cache-first for hashed assets**, and bumped `CACHE_NAME` from `ma101-v1` to `ma101-v2` so existing clients flush stale caches on activate. CRA's content-hashed filenames (`main.0898092c.js`) are safe to cache forever; only `index.html` needs to be fresh.
- *Lesson*: when a deploy "doesn't work" but localhost does, **service worker caching is hypothesis #1**, not the last guess. Test in incognito first to rule it out.

**Bug 3 — Google login bounced users to the wrong domain.**
- *Symptom*: user starts on production URL, logs in with Google, lands on a `-git-dev-` preview URL where the notes feature doesn't exist (because that branch's bundle predates the feature).
- *Cause*: `supabase.auth.signInWithOAuth({ provider: "google" })` had no `redirectTo` option, so Supabase fell back to the dashboard's "Site URL" — which had been set to a preview URL during earlier testing and never updated.
- *Fix (two parts)*:
  1. Dashboard: set Site URL to production (`https://meta-analysis-101.vercel.app`); added `localhost:3000/**`, `meta-analysis-101.vercel.app/**`, and `meta-analysis-101-*.vercel.app/**` to the redirect URL allowlist.
  2. Code: pass `redirectTo: window.location.origin + window.location.pathname + window.location.hash` so login returns to the exact URL the user was on, regardless of dashboard config. This makes localhost/preview/production each work correctly without dashboard juggling.
- *Lesson*: a single global "Site URL" can't serve multi-environment workflows. Pass `redirectTo` per call; let the dashboard be a fallback only. When users describe "the deployed site doesn't work", confirm whether they mean *the URL they typed* or *the URL they ended up on after auth/redirect chains*.

### Verification checklist (run after each future deploy)
1. Production URL → notes tab visible at top-right under nav.
2. Click tab → drawer slides in, no layout shift on the page.
3. Type → status flips through `Saving…` → `Saved · just now`.
4. Refresh → content rehydrates.
5. Open Course1 AI PICO Workshop → fill a few fields → refresh → state persists.
6. Open Final → WebR advanced panel → run an analysis → refresh → `advHistory` and selections persist.
7. Profile page → My Notes section lists every course you've taken notes on.
8. Log out, log in again from production URL → land back on production URL.
9. Same flow from `localhost:3000` → land back on `localhost:3000`.

---

## Subsequent hardening (post-shipment fixes)

After shipping the original feature, an audit of the workshop pages surfaced several issues that the v1 implementation didn't cover. These were addressed in follow-up commits.

### Coverage gap — `AIBooleanChecker` (Course 2) was never wired

**Problem.** The original plan called out `AIPicoWorkshop` (Course 1) and the WebR advanced-analysis panel (Final Workshop), but Course 2's `AIBooleanChecker` shipped in regular `useState` with no `user` prop and no persistence. Students lost their typed Boolean queries on every reload.

**Fix.** Threaded `user` through `App` → `Course2` → `AIBooleanChecker`; replaced the `query` `useState` with `useWorkshopField(user, "course2_ai_boolean", "query", "")`; added the same Saving/Autosaved/Save-failed status indicator the other workshops show. AI feedback itself stays in regular `useState` because it's a transient response — re-running the check with the same query just returns a fresh answer; persisting it would risk showing students stale AI replies for queries they've since edited.

### `useWorkshopField` correctness fixes

The original hook had three race / leak bugs that surfaced under realistic usage:

1. **Cross-user data leak.** When `user` changed (login → different user, or shared device), the previous user's value remained visible until hydration completed. A keystroke before hydration finished would save it under the new user's row.
   - *Fix*: detect `user.id` change, reset value to `defaultValue`, set `hydrated=false` before the new fetch.
2. **`setStatus` after unmount.** The unmount flush effect called `writeNow()` which calls `setStatus("saving"/"saved"/"error")` without checking mounted state — produced the React "set state on unmounted component" warning and lost the final status.
   - *Fix*: added a `mountedRef` and `safeSetStatus()` guard. Also moved the unmount flush to a true unmount effect (`useEffect(() => () => {...}, [])` with a ref-held `writeNow`) so it fires once on teardown instead of every time `user`/`workshopKey`/`fieldKey` changes.
3. **Default value overwrites persisted value mid-load.** Before hydration completes, any controlled-input re-render that called `setAndSave` with the default value would mark the field dirty and trigger a debounced write of the default, clobbering whatever was about to load from Supabase.
   - *Fix*: `setAndSave` now skips the dirty-mark + debounce until `hydrated === true`.

### `localStorage` fallback (the docstring's promise, now real)

The original v1 docstring claimed "with localStorage fallback" but the code had zero localStorage usage. The fallback was added in a follow-up:

- Keys are namespaced per user: `workshop:${userId}:${workshopKey}:${fieldKey}`, with `"anon"` as the namespace for signed-out users.
- `useState` initializer reads `localStorage` synchronously, so reloads come up showing the user's draft instantly instead of flashing the default value for ~200ms while Supabase loads.
- Every `writeNow` writes `localStorage` first (instant, basically can't fail), then attempts the Supabase upsert. On Supabase failure the status flips to `"error"` but the data is still safe in `localStorage` and survives reload.
- When Supabase loads, the cloud value mirrors back to `localStorage` to keep them in sync.
- `resetWorkshop` now wipes the matching `localStorage` namespace too.
- New `clearWorkshopFieldLocal(user, workshopKey, fieldKey)` helper for single-field local cleanup.

### Fetch handler hardening (workshop + exam pages)

All AI fetch sites — Course 1 AIPicoWorkshop (`checkField`, `checkOverall`), Course 1 AIPicoFreestyle (`checkTopic`, `checkField`, `checkOverall`), Course 2 AIBooleanChecker (`checkQuery`), Midterm Step 1 (PICO check), Midterm Step 2 (search check), Final Step 4 (interpretation check), Final FullReviewSection (full project review) — got the same hardening:

- **`response.ok` check** before parsing JSON, so 4xx / 5xx errors surface a real "AI service temporarily unavailable" message instead of falling through to the generic "Could not get feedback" empty-result fallback.
- **`AbortController` per fetch** — re-clicking the same button aborts the prior in-flight request (per-field for PICO check buttons, single ref for topic/overall/Boolean/Midterm/Final checks). Stale responses can no longer overwrite a newer one. Unmount cleanup aborts everything in flight to avoid setState on unmounted components. `AbortError` is silently swallowed.
- **`setLoading(false)` in `finally`** — spinner can't get stuck if anything in the catch path throws.
- **Active-controller guard before `setLoading(false)`** in the `finally` — so a superseded request doesn't reset the loading flag the newer one just turned on.
- **`console.error` in catch** — the swallowed errors are now diagnosable.
- **Stop persisting connection-error strings.** Both Final Step 4 and Midterm Step 1/2 used to write `"連線錯誤"` into `_interpretFeedback` / `_picoFeedback` / `_searchFeedback` on fetch failure. Those error strings then survived reloads and looked like a fake AI reply. Now only successful AI replies are persisted; errors are shown in transient UI state only.

### Other persistence-adjacent corrections

- **Final.jsx — stale `effectType` reconciliation.** Saved analysis from an earlier binary-outcome project (`effectType: "OR"`) was being applied silently to a continuous-outcome project, emitting wrong `measure=` in the R code template. The state initializer now validates the saved `effectType` against the current project's `isBinary(inc)` and resets to the appropriate default (`OR` / `MD`) on mismatch.
- **Midterm.jsx — `canGoNext` step-2 gate.** Required `studies.length > 0`; now requires `studies.filter(s => s.included).length > 0` so a user can't advance to RoB / extraction with every study marked Excluded.
- **Midterm.jsx — `loadDemo` sets `_picoPass: true`.** The demo is curated valid PICO; forcing the user to re-run the AI check before they could navigate the demo workflow was friction with no purpose.
- **`generateReport.js` — null-guarded `analysis`** (`const a = analysis || {}`); rewrote `labelValue` to allow numeric `0` instead of dropping it via `if (!value)`; renamed the download-link variable to avoid shadowing.

### RoB 2 framework — schema migration

Originally the Midterm RoB section was labeled "RoB 2" but used the legacy Cochrane RoB 1 domain set (randomization, blinding, attrition, reporting, other). Refactored to actual RoB 2:

- New domain keys: `randomization`, `deviations`, `missing`, `measurement`, `selection` — matching the official five RoB 2 domains.
- `migrateStudyRob()` helper runs on every sessionStorage hydration. If it sees legacy keys (`blinding`/`attrition`/`other`), it preserves the `randomization` rating (the only domain that means the same thing in both frameworks) and resets the other four to `""` so users re-rate against the new domain definitions instead of inheriting a misleading mapping.
- A `_robMigrated: true` flag is set on the project when `migrateStudyRob` actually fires for at least one study. `Step5RoB` shows a one-time, dismissible banner explaining what happened. Clicking "Got it" sets `_robMigrated: false`, which persists in sessionStorage so the banner stays hidden across reloads after dismissal.
- `generateReport.js` `robDomainLabel` and `domainKeys` updated to match the new keys.
- `Course3.jsx` `RateThisStudy` quiz labels (which already implemented RoB 2 conceptually) had two domain labels polished to match the official wording: "Deviations from Intervention" → "Deviations from Intended Interventions"; "Selective Reporting" → "Selection of Reported Result".

### Updated verification checklist additions
10. Course 2 AI Boolean Query Workshop → type a query → refresh → query persists; status badge shows Saving / Autosaved.
11. Sign out → start typing in any workshop → refresh → draft survives via the `anon` localStorage namespace.
12. Sign in as user A, type in a workshop, sign out, sign in as user B → workshop field is empty (not user A's draft).
13. Disconnect network → type in a workshop → status flips to `Save failed` but the draft is in localStorage; reconnect, edit one character → status goes through `Saving…` → `Autosaved`.
14. Open the Final exam after switching the Midterm project from a binary outcome to a continuous outcome → effect-type radio defaults to `MD`, not the stale `OR`.
15. Load a Midterm project saved before the RoB 2 refactor → Step 5 shows the dismissible "RoB 2 upgrade" banner; only the Randomization column has values; banner stays dismissed across reloads.

### Email transition: `mailto:` → Gmail SMTP

**Why we replaced it.** The v1 `mailto:` link satisfied the literal spec ("share to email") but did not actually deliver mail — it just handed off a pre-filled draft to the user's default mail client. Many students didn't realize a separate send step was still required and assumed the email had gone out. The button label "Email me" actively misled — nothing was emailed *to* anyone until the user took action in another app.

**What replaced it.** A real send via a new Vercel serverless function:

- New `api/send-notes.js` (~95 lines) — POST endpoint. Validates email format, content length (50KB cap), and HTML-escapes user content before embedding it in the HTML body. Reads `GMAIL_USER` and `GMAIL_APP_PASSWORD` from `process.env`, hands the request to `nodemailer.createTransport({ service: "gmail", ... })`, awaits `transporter.sendMail({...})`, returns the provider message ID on success or a structured error on failure.
- `src/notesExport.js` — `emailNotes()` rewritten as an async function. Takes `{ content, courseTitle, lang, to }`, POSTs JSON to `/api/send-notes`, throws on non-2xx so callers can render the error.
- `src/CourseNotes.jsx` — new `emailTo` state auto-filled from the signed-in user's email (still editable, for sending to a colleague / personal account). New `emailState` machine: `idle → sending → sent → error`, with a color-coded feedback banner above the action row. Pending autosave is `flush()`ed before the send so the email matches what's persisted.

**Why Gmail SMTP and not Resend / SendGrid / Mailgun.** The transactional email providers all require a verified sending domain (DNS records) before they'll deliver to arbitrary recipients — without verification they restrict the `to:` field to the account owner's email, which defeats the purpose for a multi-user app. Domain verification takes ~20 minutes and depends on DNS propagation. Gmail SMTP with an App Password:

- Needs no DNS setup. 2-Step Verification + a generated 16-character App Password is the entire credential setup (~3 minutes).
- Free, 500 sends/day on a personal account (2000/day on Google Workspace). Plenty for workshop scale.
- The App Password is SMTP-scoped — it cannot log into the Google account UI, cannot read mail, can be revoked individually without changing the main account password.
- Trade-off accepted: all sends carry the personal Gmail address as the `From:`. For a workshop-branded site that's fine; if a future deployment needs `noreply@<custom-domain>`, the `transporter.sendMail({...})` call is the only line that changes — swap to Resend's REST API and add a `RESEND_API_KEY` env var.

**Security boundary.** The credential never touches the browser bundle:

- `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set on Vercel under Environment Variables (with the "Sensitive" flag on the password — even the dashboard won't redisplay it). They're injected into `process.env` at function runtime only, never exposed to the React build.
- The recipient address is supplied by the client and *trusted*. Earlier the design contemplated a Supabase-token-verified recipient ("never trust the client to specify the recipient — that's an open relay"); that protection was dropped because (a) the UX requirement is "let the user type any email", (b) the realistic attacker is a logged-in user who can already use the form by hand, and (c) Gmail's 500/day cap and per-IP rate limits cap the blast radius. If sending volume or abuse risk grows, the right escalation is rate-limiting per session/IP at the function level, not server-side recipient enforcement.

**Tested deliverability.** Gmail → Gmail goes straight to the inbox. Gmail → external providers (Outlook, ProtonMail) sometimes lands in spam on the first email per recipient, especially for never-before-seen pairs; subsequent emails after a single "Not spam" mark deliver normally. Acceptable for workshop use; would not be acceptable for cold outreach.

**Files touched.**
- `api/send-notes.js` (new)
- `src/notesExport.js` (rewritten `emailNotes`)
- `src/CourseNotes.jsx` (recipient field, send-state machine, two-row action layout)
- `package.json` / `package-lock.json` (added `nodemailer`)

**Verification (additional checks).**
16. With `GMAIL_USER` + `GMAIL_APP_PASSWORD` set on Vercel, sign in → open notes drawer → email field is auto-filled with the account email → type a note → click Send → "Sent to your inbox" banner appears within ~2s → email actually arrives.
17. Edit the recipient field to a different address → Send → email arrives at the new address.
18. Disable JS-side validation, send `{to: "not-an-email"}` directly → endpoint returns 400 with `"Invalid recipient email"`.
19. Unset `GMAIL_APP_PASSWORD` in env → Send → endpoint returns 500 `"Gmail credentials not configured on server"`, banner shows the message in the user's language.

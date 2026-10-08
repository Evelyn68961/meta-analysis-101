import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { supabase } from "./supabaseClient";
import { downloadNotesTxt, downloadNotesDocx, emailNotes } from "./notesExport";

const TEAL = "#0E7C86";
const DARK = "#1D2B3A";
const MUTED = "#6B7A8D";
const CARD_BG = "#FFFFFF";
const LIGHT_BORDER = "#E8E6E1";
const FONT = "'Noto Sans TC', 'Outfit', sans-serif";

const DEBOUNCE_MS = 800;

const lsKey = (userId, courseId) => `course_notes::${userId || "guest"}::${courseId}`;

function timeAgo(ts, lang) {
  if (!ts) return "";
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (seconds < 5)  return lang === "zh" ? "剛剛" : "just now";
  if (seconds < 60) return lang === "zh" ? `${seconds} 秒前` : `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60)    return lang === "zh" ? `${mins} 分鐘前` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)     return lang === "zh" ? `${hrs} 小時前` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return lang === "zh" ? `${days} 天前` : `${days}d ago`;
}

/**
 * CourseNotes — collapsible side drawer for per-course notes.
 *
 * Usage:
 *   <CourseNotes user={user} courseId={1} courseTitle="PICO Framework" lang={lang} />
 *
 * Pinned to right edge of viewport via createPortal — does not affect
 * the underlying course layout.
 */
export default function CourseNotes({ user, courseId, courseTitle, lang = "en" }) {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`course_notes_open::${courseId}`) === "1";
  });
  const [content, setContent] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | localOnly | error
  const [savedAt, setSavedAt] = useState(null);
  const [, force] = useState(0);
  const [emailState, setEmailState] = useState("idle"); // idle | sending | sent | error
  const [emailError, setEmailError] = useState("");
  const [emailTo, setEmailTo] = useState("");

  const contentRef = useRef("");
  const dirtyRef = useRef(false);
  const timerRef = useRef(null);

  contentRef.current = content;

  // Auto-fill recipient with the signed-in user's email (only if the user
  // hasn't already typed something).
  useEffect(() => {
    if (user?.email) {
      setEmailTo((prev) => (prev ? prev : user.email));
    }
  }, [user]);

  const persistLocal = useCallback((text) => {
    try {
      localStorage.setItem(lsKey(user?.id, courseId), JSON.stringify({ content: text, updated_at: new Date().toISOString() }));
    } catch {}
  }, [user, courseId]);

  const flush = useCallback(async () => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    persistLocal(contentRef.current);
    if (!user) {
      setStatus("localOnly");
      setSavedAt(new Date().toISOString());
      return;
    }
    setStatus("saving");
    try {
      const { error } = await supabase
        .from("course_notes")
        .upsert(
          { user_id: user.id, course_id: courseId, content: contentRef.current },
          { onConflict: "user_id,course_id" }
        );
      if (error) {
        setStatus("error");
      } else {
        setStatus("saved");
        setSavedAt(new Date().toISOString());
      }
    } catch {
      setStatus("error");
    }
  }, [user, courseId, persistLocal]);

  // Hydrate on mount / user change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let initial = "";
      try {
        const raw = localStorage.getItem(lsKey(user?.id, courseId));
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.content) initial = parsed.content;
        }
      } catch {}
      if (user) {
        try {
          const { data } = await supabase
            .from("course_notes")
            .select("content, updated_at")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .maybeSingle();
          if (data?.content !== undefined) {
            initial = data.content || "";
            if (data.updated_at) setSavedAt(data.updated_at);
          }
        } catch {}
      }
      if (!cancelled) {
        setContent(initial);
        setHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, [user, courseId]);

  // beforeunload flush
  useEffect(() => {
    const handler = () => { flush(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [flush]);

  // ⌘/Ctrl+S manual save
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && open) {
        e.preventDefault();
        if (timerRef.current) clearTimeout(timerRef.current);
        flush();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flush, open]);

  // Tick the "saved · 2 min ago" label
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Mobile body-scroll lock with scrollbar compensation
  useEffect(() => {
    if (!open) return;
    if (window.innerWidth >= 640) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [open]);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      try { localStorage.setItem(`course_notes_open::${courseId}`, next ? "1" : "0"); } catch {}
      if (prev) {
        if (timerRef.current) clearTimeout(timerRef.current);
        flush();
      }
      return next;
    });
  };

  const onChange = (e) => {
    const next = e.target.value;
    setContent(next);
    dirtyRef.current = true;
    setStatus("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { flush(); }, DEBOUNCE_MS);
  };

  const handleEmail = useCallback(async () => {
    if (!content.trim() || emailState === "sending") return;
    setEmailState("sending");
    setEmailError("");
    try {
      // Flush any pending edits first so the email matches what's saved.
      if (timerRef.current) clearTimeout(timerRef.current);
      await flush();
      await emailNotes({ content, courseTitle, lang, to: emailTo });
      setEmailState("sent");
      setTimeout(() => setEmailState((s) => (s === "sent" ? "idle" : s)), 4000);
    } catch (err) {
      setEmailState("error");
      setEmailError(err?.message || (lang === "zh" ? "寄送失敗" : "Send failed"));
    }
  }, [content, courseTitle, lang, flush, emailState, emailTo]);

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo.trim());

  const statusLabel =
    !hydrated                  ? (lang === "zh" ? "載入中…" : "Loading…")
    : status === "saving"       ? (lang === "zh" ? "儲存中…" : "Saving…")
    : status === "error"        ? (lang === "zh" ? "⚠ 儲存失敗" : "⚠ Save failed")
    : status === "localOnly"    ? (lang === "zh" ? "✓ 已儲存於此裝置（登入即可同步）" : "✓ Saved on this device (sign in to sync)")
    : savedAt                   ? (lang === "zh" ? `已儲存 · ${timeAgo(savedAt, lang)}` : `Saved · ${timeAgo(savedAt, lang)}`)
    : "";

  const drawerWidth = "min(360px, 92vw)";

  // ── Tab (collapsed handle) ──
  const tab = (
    <button
      onClick={toggle}
      aria-label={lang === "zh" ? "開啟筆記" : "Open notes"}
      style={{
        position: "fixed",
        right: open ? drawerWidth : 0,
        top: 140,
        transition: "right 0.28s ease",
        width: 40,
        minHeight: 120,
        background: TEAL,
        color: "#FFF",
        border: "none",
        borderRadius: "10px 0 0 10px",
        cursor: "pointer",
        zIndex: 2147483000,
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 1,
        writingMode: "vertical-rl",
        padding: "16px 0",
        boxShadow: "-2px 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      📝 {lang === "zh" ? "筆記" : "Notes"}
    </button>
  );

  // ── Drawer body ──
  const drawer = (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => open && toggle()}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20,30,45,0.35)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.28s ease",
          zIndex: 2147482900,
          display: "block",
        }}
        className="course-notes-backdrop"
      />
      <aside
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: drawerWidth,
          background: CARD_BG,
          borderLeft: `1px solid ${LIGHT_BORDER}`,
          boxShadow: open ? "-8px 0 28px rgba(0,0,0,0.08)" : "none",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s ease",
          zIndex: 2147482950,
          display: "flex",
          flexDirection: "column",
          fontFamily: FONT,
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${LIGHT_BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: TEAL }}>
              {lang === "zh" ? "我的筆記" : "My Notes"}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginTop: 2 }}>{courseTitle}</div>
          </div>
          <button
            onClick={toggle}
            aria-label={lang === "zh" ? "關閉" : "Close"}
            style={{ background: "none", border: "none", fontSize: 22, color: MUTED, cursor: "pointer", lineHeight: 1, padding: 4 }}
          >×</button>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={onChange}
          placeholder={lang === "zh"
            ? "在這裡寫下你的筆記…\n\n會自動儲存。"
            : "Type your notes here…\n\nAutosaves as you type."}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            resize: "none",
            padding: "16px 20px",
            fontFamily: FONT,
            fontSize: 14,
            lineHeight: 1.65,
            color: DARK,
            background: "#FAFAF7",
            boxSizing: "border-box",
          }}
        />

        {/* Status */}
        <div style={{ padding: "8px 20px", borderTop: `1px solid ${LIGHT_BORDER}`, fontSize: 11, color: MUTED, minHeight: 30, display: "flex", alignItems: "center" }}>
          {statusLabel}
        </div>

        {/* Email feedback line */}
        {emailState !== "idle" && (
          <div style={{
            padding: "6px 20px",
            fontSize: 11,
            color: emailState === "error" ? "#B23A48" : emailState === "sent" ? TEAL : MUTED,
            background: emailState === "error" ? "#FDECEE" : emailState === "sent" ? "#E8F4F5" : "transparent",
          }}>
            {emailState === "sending" && (lang === "zh" ? "寄送中…" : "Sending…")}
            {emailState === "sent" && (lang === "zh" ? "✓ 已寄出到您的信箱" : "✓ Sent to your inbox")}
            {emailState === "error" && `⚠ ${emailError}`}
          </div>
        )}

        {/* Email input — full width on its own row */}
        <div style={{ padding: "12px 16px 0", borderTop: `1px solid ${LIGHT_BORDER}` }}>
          <input
            type="email"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            placeholder={lang === "zh" ? "your@email.com" : "your@email.com"}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 11px",
              borderRadius: 8,
              border: `1px solid ${LIGHT_BORDER}`,
              fontSize: 13,
              fontFamily: FONT,
              color: DARK,
              outline: "none",
              background: "#FFF",
            }}
          />
        </div>

        {/* Action row — downloads on left, Send fills the rest */}
        <div style={{ padding: "10px 16px 16px", display: "flex", gap: 8 }}>
          <button
            onClick={() => downloadNotesTxt({ content, courseTitle })}
            disabled={!content.trim()}
            style={btnSecondary(!!content.trim())}
          >.txt</button>
          <button
            onClick={() => downloadNotesDocx({ content, courseTitle })}
            disabled={!content.trim()}
            style={btnSecondary(!!content.trim())}
          >.docx</button>
          <button
            onClick={handleEmail}
            disabled={!content.trim() || !emailLooksValid || emailState === "sending"}
            style={btnPrimary(!!content.trim() && emailLooksValid && emailState !== "sending")}
          >
            {emailState === "sending"
              ? (lang === "zh" ? "寄送中…" : "Sending…")
              : <>📧 {lang === "zh" ? "寄送" : "Send"}</>}
          </button>
        </div>
      </aside>
    </>
  );

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <style>{`
        @media (min-width: 640px) {
          .course-notes-backdrop { display: none !important; }
        }
      `}</style>
      {tab}
      {drawer}
    </>,
    document.body
  );
}

function btnPrimary(enabled) {
  return {
    flex: 1,
    minWidth: 110,
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: enabled ? TEAL : "#E8E6E1",
    color: enabled ? "#FFF" : MUTED,
    fontSize: 13,
    fontWeight: 600,
    cursor: enabled ? "pointer" : "default",
    fontFamily: FONT,
  };
}

function btnSecondary(enabled) {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: `1.5px solid ${enabled ? TEAL + "55" : LIGHT_BORDER}`,
    background: "transparent",
    color: enabled ? TEAL : MUTED,
    fontSize: 13,
    fontWeight: 600,
    cursor: enabled ? "pointer" : "default",
    fontFamily: FONT,
  };
}

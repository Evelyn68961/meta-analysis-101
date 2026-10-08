// api/send-notes.js
// Sends course notes via Gmail SMTP (Nodemailer).
//
// Required Vercel env vars:
//   GMAIL_USER          — your Gmail address (sender)
//   GMAIL_APP_PASSWORD  — 16-char App Password from
//                         https://myaccount.google.com/apppasswords
//                         (requires 2-Step Verification on the Google account)
// Optional:
//   MAIL_FROM_NAME      — display name in the From: header
//                         (defaults to "Meta-Analysis 101")
//
// Gmail SMTP free-account limit: ~500 messages/day. Plenty for workshop use.

import nodemailer from "nodemailer";

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  }[c]));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CONTENT_LEN = 50000;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); }
    catch { return res.status(400).json({ error: "Invalid JSON body" }); }
  }

  const { content, courseTitle, lang, to } = body || {};
  if (!content || !String(content).trim()) {
    return res.status(400).json({ error: "Empty note content" });
  }
  if (String(content).length > MAX_CONTENT_LEN) {
    return res.status(400).json({ error: "Note too long" });
  }
  if (!courseTitle) {
    return res.status(400).json({ error: "Missing courseTitle" });
  }
  if (!to || !EMAIL_RE.test(String(to).trim())) {
    return res.status(400).json({ error: "Invalid recipient email" });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    return res.status(500).json({ error: "Gmail credentials not configured on server" });
  }
  const fromName = process.env.MAIL_FROM_NAME || "Meta-Analysis 101";

  const stamp = new Date().toISOString().slice(0, 10);
  const isZh = lang === "zh";
  const subject = isZh ? `我的筆記 — ${courseTitle}` : `My notes — ${courseTitle}`;

  const text = `${courseTitle}\n${stamp}\n${"-".repeat(40)}\n\n${content}`;

  const html = `<!doctype html>
<html><body style="margin:0;background:#FAFAF7;">
  <div style="font-family:'Noto Sans TC',-apple-system,BlinkMacSystemFont,sans-serif;color:#1D2B3A;max-width:640px;margin:0 auto;padding:28px 24px;background:#FFFFFF;">
    <div style="font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#0E7C86;">
      ${isZh ? "我的筆記" : "My Notes"}
    </div>
    <h1 style="color:#1D2B3A;font-size:22px;margin:4px 0 4px;font-weight:700;">${escapeHtml(courseTitle)}</h1>
    <div style="color:#6B7A8D;font-size:12px;margin-bottom:20px;">${stamp}</div>
    <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.65;margin:0;color:#1D2B3A;">${escapeHtml(content)}</pre>
  </div>
</body></html>`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });
    const info = await transporter.sendMail({
      from: `${fromName} <${gmailUser}>`,
      to: String(to).trim(),
      subject,
      text,
      html,
    });
    return res.status(200).json({ ok: true, to, id: info.messageId });
  } catch (err) {
    return res.status(500).json({ error: "Send failed", details: err.message });
  }
}

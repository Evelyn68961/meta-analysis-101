import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
} from "docx";

const FONT = "Noto Sans TC";

function todayStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function safeFilename(courseTitle) {
  return String(courseTitle || "course")
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "course";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadNotesTxt({ content, courseTitle }) {
  const stamp = todayStamp();
  const header = `${courseTitle}\n${stamp}\n${"-".repeat(40)}\n\n`;
  const blob = new Blob([header + (content || "")], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `meta-analysis-${safeFilename(courseTitle)}-notes-${stamp}.txt`);
}

export async function downloadNotesDocx({ content, courseTitle }) {
  const stamp = todayStamp();
  const lines = String(content || "").split(/\r?\n/);

  const para = (text, opts = {}) =>
    new Paragraph({
      ...(opts.heading ? { heading: opts.heading } : {}),
      spacing: { after: opts.after ?? 80 },
      children: [new TextRun({ text, font: FONT, size: opts.size || 22, bold: opts.bold, color: opts.color })],
    });

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT } } } },
    sections: [{
      properties: {},
      children: [
        para(courseTitle, { heading: HeadingLevel.HEADING_1, bold: true, size: 32 }),
        para(stamp, { size: 18, color: "888888", after: 200 }),
        ...lines.map((line) => para(line || " ", { size: 22 })),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `meta-analysis-${safeFilename(courseTitle)}-notes-${stamp}.docx`);
}

/**
 * Send the note to a user-specified email via /api/send-notes (Gmail SMTP).
 * Throws on failure — callers should wrap in try/catch and surface a status.
 */
export async function emailNotes({ content, courseTitle, lang = "en", to }) {
  const recipient = String(to || "").trim();
  if (!recipient) {
    throw new Error(lang === "zh" ? "請輸入電子郵件" : "Please enter an email address");
  }
  const res = await fetch("/api/send-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, courseTitle, lang, to: recipient }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || (lang === "zh" ? "寄送失敗" : "Send failed"));
  }
  return data;
}

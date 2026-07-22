export const COLORS = {
  paper: "#EEF0E6",
  page: "#FBFAF5",
  ink: "#20263A",
  inkMuted: "#5B6275",
  inkFaint: "#8A90A0",
  rule: "#9FB8CE",
  ruleFaint: "#C7D6E2",
  margin: "#B3372C",
  correct: "#3C7A52",
  correctBg: "#E7F1E9",
  gold: "#B8862F",
  goldBg: "#F4E9D3",
  errorBg: "#F7E7E4",
  border: "#DCD9CA",
};

export const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500;1,9..144,600&family=Source+Sans+3:wght@400;500;600;700&family=Caveat:wght@500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.fvt-root * { box-sizing: border-box; }
.fvt-root { font-family: 'Source Sans 3', sans-serif; }
.fvt-display { font-family: 'Fraunces', serif; }
.fvt-hand { font-family: 'Caveat', cursive; }
.fvt-devanagari { font-family: 'Noto Sans Devanagari', sans-serif; }
.fvt-mono { font-family: 'JetBrains Mono', monospace; }

.fvt-root button:focus-visible,
.fvt-root input:focus-visible,
.fvt-root select:focus-visible,
.fvt-root textarea:focus-visible {
  outline: 2px solid ${COLORS.margin};
  outline-offset: 2px;
}

@keyframes fvt-fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fvt-stamp {
  0% { opacity: 0; transform: scale(1.4) rotate(-6deg); }
  60% { opacity: 1; transform: scale(0.95) rotate(-6deg); }
  100% { opacity: 1; transform: scale(1) rotate(-6deg); }
}
.fvt-animate-in { animation: fvt-fade-up 0.35s ease both; }
.fvt-stamp { animation: fvt-stamp 0.28s ease both; }

@media (prefers-reduced-motion: reduce) {
  .fvt-animate-in, .fvt-stamp { animation: none !important; }
}

.fvt-seyes {
  background-color: ${COLORS.page};
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 27px, ${COLORS.ruleFaint} 27px, ${COLORS.ruleFaint} 28px),
    repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(199,214,226,0.45) 27px, rgba(199,214,226,0.45) 28px);
}

.fvt-answer-line {
  border: none;
  border-bottom: 2px solid ${COLORS.ink};
  background: transparent;
  padding: 2px 4px 6px 4px;
}
.fvt-answer-line:focus { border-bottom-color: ${COLORS.margin}; }

.fvt-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.fvt-scrollbar::-webkit-scrollbar-thumb { background: ${COLORS.ruleFaint}; border-radius: 4px; }
`;

export const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  fontSize: 17,
  background: "#fff",
  color: COLORS.ink,
};

export const primaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: COLORS.ink,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "10px 18px",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

export const secondaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "none",
  color: COLORS.inkMuted,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  padding: "10px 18px",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

export const iconBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  width: 30,
  height: 30,
  color: COLORS.inkMuted,
  cursor: "pointer",
};

export function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 13, color: COLORS.inkMuted, marginBottom: 5, fontWeight: 600 }}>{label}</div>
      {children}
    </label>
  );
}

export function EmptyNote({ text }) {
  return (
    <div
      style={{
        border: `1px dashed ${COLORS.border}`,
        borderRadius: 10,
        padding: "22px 18px",
        textAlign: "center",
        color: COLORS.inkMuted,
        fontSize: 15,
      }}
    >
      {text}
    </div>
  );
}

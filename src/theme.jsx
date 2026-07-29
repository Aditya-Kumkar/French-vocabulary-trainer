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
    radial-gradient(ellipse at 50% 35%, transparent 55%, rgba(32,38,58,0.05) 100%),
    repeating-linear-gradient(0deg, transparent, transparent 31px, ${COLORS.ruleFaint} 31px, ${COLORS.ruleFaint} 32px);
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

.fvt-spiral { display: block; }
@media (max-width: 900px) {
  .fvt-spiral { display: none; }
}

.fvt-app-decor { display: block; }
@media (max-width: 1150px) {
  .fvt-app-decor { display: none; }
}
`;

export const cardShadow = "0 14px 28px rgba(32,38,58,0.20), 0 3px 8px rgba(32,38,58,0.14)";

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

export function Mascot({ size = 48, style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block", filter: "drop-shadow(1px 4px 5px rgba(32,38,58,0.25))", ...style }}>
      <defs>
        <linearGradient id="mascotBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFC276" />
          <stop offset="55%" stopColor="#D9A24B" />
          <stop offset="100%" stopColor="#A87524" />
        </linearGradient>
        <linearGradient id="mascotHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2CA84" />
          <stop offset="100%" stopColor="#D9A24B" />
        </linearGradient>
        <linearGradient id="mascotComb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D14A3E" />
          <stop offset="100%" stopColor="#7A2119" />
        </linearGradient>
        <linearGradient id="tailA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5FA588" />
          <stop offset="100%" stopColor="#2C4A3E" />
        </linearGradient>
        <linearGradient id="tailB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A8068" />
          <stop offset="100%" stopColor="#1F362D" />
        </linearGradient>
        <linearGradient id="tailC" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6FB89A" />
          <stop offset="100%" stopColor="#345A48" />
        </linearGradient>
      </defs>
      <ellipse cx="52" cy="94" rx="20" ry="4" fill={COLORS.ink} opacity="0.12" />
      <g strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M30 58 C14 50 10 32 18 18" stroke="url(#tailA)" />
        <path d="M34 64 C20 60 14 44 20 30" stroke="url(#tailB)" />
        <path d="M40 68 C28 68 20 56 22 42" stroke="url(#tailC)" />
      </g>
      <ellipse cx="56" cy="60" rx="26" ry="22" fill="url(#mascotBody)" stroke={COLORS.ink} strokeWidth="2.5" />
      <path d="M40 52 C48 58 48 68 42 76" stroke="#A87524" strokeWidth="1" opacity="0.5" fill="none" />
      <circle cx="66" cy="32" r="15" fill="url(#mascotHead)" stroke={COLORS.ink} strokeWidth="2.5" />
      <path
        d="M56 20 L59 10 L63 18 L66 8 L69 18 L73 12 L75 22"
        fill="url(#mascotComb)"
        stroke="#5C1712"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M72 40 C75 44 74 49 70 51" fill="none" stroke="url(#mascotComb)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M80 30 L90 33 L80 37 Z" fill={COLORS.gold} stroke="#8A6412" strokeWidth="1" />
      <circle cx="70" cy="29" r="1.8" fill={COLORS.ink} />
      <ellipse cx="58" cy="20" rx="12" ry="6" fill="url(#mascotComb)" opacity="0.95" stroke="#5C1712" strokeWidth="1.3" />
      <circle cx="58" cy="14" r="2" fill="#5C1712" />
      <path d="M46 80 L44 92 M62 82 L64 93" stroke={COLORS.gold} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function SegmentedControl({ options, value, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: COLORS.paper,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 999,
        padding: 3,
        gap: 2,
        marginBottom: 18,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 16px",
              borderRadius: 999,
              border: "none",
              background: active ? COLORS.ink : "transparent",
              color: active ? "#fff" : COLORS.inkMuted,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
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

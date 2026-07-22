import { useState } from "react";
import { Feather } from "lucide-react";
import { supabase } from "../supabaseClient";
import { COLORS, inputStyle, primaryBtnStyle, secondaryBtnStyle, Field } from "../theme";

const AUTH_DECOR_CSS = `
.fvt-decor { display: block; }
@media (max-width: 900px) {
  .fvt-decor { display: none; }
}
`;

const SAMPLE_CARDS = [
  { en: "hello", fr: "bonjour", hindi: "बों-ज़ूर", style: { left: "5%", top: "20%", rotate: "-7deg" } },
  { en: "thank you", fr: "merci", hindi: "मैर-सी", style: { left: "8%", top: "68%", rotate: "5deg" } },
  { en: "water", fr: "l'eau", hindi: "लो", style: { right: "6%", top: "26%", rotate: "6deg" } },
  { en: "friend", fr: "ami", hindi: "आमी", style: { right: "9%", top: "70%", rotate: "-5deg" } },
];

export default function Auth() {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !password) {
      setError("Enter both an email and a password.");
      return;
    }
    if (mode === "signup" && !displayName.trim()) {
      setError("Enter a name your classmates will recognize.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() } },
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setInfo("Account created. Check your email to confirm it, then log in below.");
          switchMode("login");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fvt-seyes" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "hidden" }}>
      <style>{AUTH_DECOR_CSS}</style>

      {SAMPLE_CARDS.map((c, i) => (
        <Flashcard key={i} {...c} />
      ))}

      <div className="fvt-animate-in" style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, justifyContent: "center" }}>
          <Feather size={26} color={COLORS.margin} style={{ transform: "rotate(-25deg)" }} />
          <h1 className="fvt-display" style={{ fontSize: 26, fontStyle: "italic", fontWeight: 600, margin: 0 }}>
            Cahier de vocabulaire
          </h1>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: COLORS.inkMuted, fontStyle: "italic", marginTop: 0, marginBottom: 22 }}>
          your French vocabulary notebook
        </p>

        <div
          style={{
            position: "relative",
            background: COLORS.page,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: 22,
            boxShadow: "0 3px 10px rgba(32,38,58,0.08)",
          }}
        >
          <Tape />
          <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: `1px solid ${COLORS.border}` }}>
            <TabButton label="Log in" active={mode === "login"} onClick={() => switchMode("login")} />
            <TabButton label="Create account" active={mode === "signup"} onClick={() => switchMode("signup")} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <Field label="Display name (what classmates will see)">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Aditya"
                  autoComplete="nickname"
                />
              </Field>
            )}
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </Field>

            {error && <div style={{ color: COLORS.margin, fontSize: 13 }}>{error}</div>}
            {info && <div style={{ color: COLORS.correct, fontSize: 13 }}>{info}</div>}

            <button type="submit" disabled={loading} style={{ ...primaryBtnStyle, justifyContent: "center", marginTop: 4 }}>
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: COLORS.inkFaint, marginTop: 14 }}>
          Each account keeps its own private word list.
        </p>
      </div>
    </div>
  );
}

function Flashcard({ en, fr, hindi, style }) {
  return (
    <div
      className="fvt-decor"
      style={{
        position: "absolute",
        ...style,
        transform: `rotate(${style.rotate})`,
        zIndex: 1,
        background: COLORS.page,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        padding: "10px 14px",
        boxShadow: "0 4px 10px rgba(32,38,58,0.10)",
        width: 132,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -9,
          left: "50%",
          transform: "translateX(-50%) rotate(-2deg)",
          width: 46,
          height: 16,
          background: "rgba(184,134,47,0.45)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
        }}
      />
      <div style={{ fontSize: 11, color: COLORS.inkFaint, textTransform: "uppercase", letterSpacing: "0.06em" }} className="fvt-mono">
        {en}
      </div>
      <div className="fvt-display" style={{ fontSize: 17, fontWeight: 600, color: COLORS.margin, fontStyle: "italic", margin: "2px 0" }}>
        {fr}
      </div>
      <div className="fvt-devanagari" style={{ fontSize: 13, color: COLORS.inkMuted }}>
        {hindi}
      </div>
    </div>
  );
}

function Tape() {
  return (
    <div
      style={{
        position: "absolute",
        top: -14,
        left: "50%",
        transform: "translateX(-50%) rotate(-3deg)",
        width: 90,
        height: 26,
        background: "repeating-linear-gradient(45deg, rgba(184,134,47,0.55) 0 6px, rgba(184,134,47,0.35) 6px 12px)",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }}
    />
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px",
        fontSize: 14,
        fontWeight: 600,
        background: "none",
        border: "none",
        borderBottom: active ? `2px solid ${COLORS.margin}` : "2px solid transparent",
        color: active ? COLORS.ink : COLORS.inkMuted,
        cursor: "pointer",
        marginBottom: -1,
      }}
    >
      {label}
    </button>
  );
}

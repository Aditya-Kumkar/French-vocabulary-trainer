import { useState } from "react";
import { Feather } from "lucide-react";
import { supabase } from "../supabaseClient";
import { COLORS, inputStyle, primaryBtnStyle, secondaryBtnStyle, Field } from "../theme";

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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fvt-animate-in" style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, justifyContent: "center" }}>
          <Feather size={26} color={COLORS.margin} style={{ transform: "rotate(-25deg)" }} />
          <h1 className="fvt-display" style={{ fontSize: 26, fontStyle: "italic", fontWeight: 600, margin: 0 }}>
            Cahier de vocabulaire
          </h1>
        </div>

        <div
          style={{
            background: COLORS.page,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: 22,
          }}
        >
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

import { useState, useRef } from "react";
import { Check, X, RotateCcw, ChevronRight, Flame } from "lucide-react";
import { COLORS, inputStyle, primaryBtnStyle, secondaryBtnStyle, iconBtnStyle, Field, EmptyNote } from "../theme";

function stripDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeAnswer(str, { ignoreAccents } = {}) {
  let s = (str || "")
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ");
  if (ignoreAccents) s = stripDiacritics(s);
  return s;
}

const ACCENT_KEYS = ["é", "è", "ê", "ë", "à", "â", "ù", "û", "ü", "î", "ï", "ô", "ç", "œ"];

function buildQueue(words, settings) {
  let pool = words;
  if (settings.weakOnly) {
    pool = words.filter((w) => w.incorrect_count > w.correct_count || w.correct_count + w.incorrect_count === 0);
    if (pool.length === 0) pool = words;
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.map((w) => {
    const direction = settings.direction === "mixed" ? (Math.random() < 0.5 ? "en2fr" : "fr2en") : settings.direction;
    const answerIsFrench = direction === "en2fr";
    return {
      wordId: w.id,
      hindi: w.hindi,
      promptText: answerIsFrench ? w.english : w.french,
      promptLabel: answerIsFrench ? "English" : "French",
      answerLabel: answerIsFrench ? "French" : "English",
      correctAnswer: answerIsFrench ? w.french : w.english,
      answerIsFrench,
    };
  });
}

export default function PracticeView({ words, settings, setSettings, onRecordAttempt }) {
  const [session, setSession] = useState(null); // { queue, index, score, mistakes }
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef(null);

  const startSession = () => {
    const queue = buildQueue(words, settings);
    setSession({ queue, index: 0, score: 0, mistakes: [] });
    setAnswer("");
    setAnswered(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const currentQ = session && session.index < session.queue.length ? session.queue[session.index] : null;

  const submit = () => {
    if (!currentQ || answered) return;
    const opts = { ignoreAccents: currentQ.answerIsFrench && settings.ignoreAccents };
    const correct = normalizeAnswer(answer, opts) === normalizeAnswer(currentQ.correctAnswer, opts);
    setIsCorrect(correct);
    setAnswered(true);
    setSession((s) => ({
      ...s,
      score: s.score + (correct ? 1 : 0),
      mistakes: correct ? s.mistakes : [...s.mistakes, { ...currentQ, userAnswer: answer }],
    }));
    onRecordAttempt(currentQ.wordId, correct);
  };

  const next = () => {
    setSession((s) => ({ ...s, index: s.index + 1 }));
    setAnswer("");
    setAnswered(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const insertAccent = (ch) => {
    const el = inputRef.current;
    if (!el) {
      setAnswer((a) => a + ch);
      return;
    }
    const start = el.selectionStart ?? answer.length;
    const end = el.selectionEnd ?? answer.length;
    const updated = answer.slice(0, start) + ch + answer.slice(end);
    setAnswer(updated);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + 1;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (!answered) submit();
    else next();
  };

  if (words.length === 0) {
    return (
      <div className="fvt-animate-in">
        <EmptyNote text="You'll need a few words in your notebook before you can practice — add some in the My Words tab." />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fvt-animate-in">
        <SettingsPanel settings={settings} setSettings={setSettings} onStart={startSession} wordCount={words.length} />
      </div>
    );
  }

  if (session.index >= session.queue.length) {
    return <SessionSummary session={session} onRestart={startSession} onChangeSettings={() => setSession(null)} />;
  }

  return (
    <div className="fvt-animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: 13, color: COLORS.inkMuted }}>
        <span className="fvt-mono">
          Question {session.index + 1} of {session.queue.length}
        </span>
        <span className="fvt-mono" style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Flame size={14} color={COLORS.gold} /> {session.score} correct
        </span>
      </div>

      <div
        className="fvt-seyes"
        style={{
          position: "relative",
          borderRadius: 10,
          border: `1px solid ${COLORS.border}`,
          padding: "28px 24px 24px 40px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(32,38,58,0.06)",
        }}
      >
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 26, width: 0, borderLeft: `1.5px solid ${COLORS.margin}`, opacity: 0.55 }} />

        <div className="fvt-devanagari" style={{ fontSize: 22, color: COLORS.inkMuted, marginBottom: 6 }}>
          {currentQ.hindi}
        </div>
        <div className="fvt-mono" style={{ fontSize: 12, color: COLORS.inkFaint, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          pronunciation
        </div>

        <div className="fvt-mono" style={{ marginBottom: 6, fontSize: 12, color: COLORS.inkFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {currentQ.promptLabel}
        </div>
        <div className="fvt-display" style={{ fontSize: 26, fontWeight: 600, marginBottom: 22 }}>
          {currentQ.promptText}
        </div>

        <div className="fvt-mono" style={{ marginBottom: 6, fontSize: 12, color: COLORS.inkFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Write the {currentQ.answerLabel} word
        </div>
        <input
          ref={inputRef}
          value={answer}
          disabled={answered}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          className="fvt-answer-line"
          style={{ fontSize: 22, width: "100%", fontFamily: "'Fraunces', serif" }}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {currentQ.answerIsFrench && !answered && (
          <div className="fvt-scrollbar" style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {ACCENT_KEYS.map((ch) => (
              <button
                key={ch}
                onClick={() => insertAccent(ch)}
                style={{ ...iconBtnStyle, width: 30, height: 30, fontFamily: "'Fraunces', serif", fontSize: 15 }}
                tabIndex={-1}
              >
                {ch}
              </button>
            ))}
          </div>
        )}

        {answered && (
          <div className="fvt-stamp" style={{ marginTop: 18, display: "flex", alignItems: "flex-start", gap: 10 }}>
            {isCorrect ? <Check size={20} color={COLORS.correct} /> : <X size={20} color={COLORS.margin} />}
            <div>
              <div className="fvt-hand" style={{ fontSize: 24, color: isCorrect ? COLORS.correct : COLORS.margin, lineHeight: 1.1 }}>
                {isCorrect ? "Bravo !" : "Pas tout à fait"}
              </div>
              {!isCorrect && (
                <div style={{ fontSize: 15, color: COLORS.ink, marginTop: 2 }}>
                  Correct answer: <span style={{ fontWeight: 700 }}>{currentQ.correctAnswer}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end" }}>
          {!answered ? (
            <button onClick={submit} style={primaryBtnStyle} disabled={!answer.trim()}>
              Check <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={next} style={primaryBtnStyle}>
              {session.index + 1 < session.queue.length ? "Next word" : "See results"} <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ settings, setSettings, onStart, wordCount }) {
  return (
    <div style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
      <h2 className="fvt-display" style={{ fontSize: 19, fontWeight: 600, marginTop: 0 }}>
        Ready to review?
      </h2>
      <p style={{ fontSize: 14, color: COLORS.inkMuted, marginTop: -6 }}>
        {wordCount} word{wordCount !== 1 ? "s" : ""} in your notebook. The Hindi pronunciation is always shown — you'll write the English or French.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        <Field label="Direction">
          <select value={settings.direction} onChange={(e) => setSettings({ ...settings, direction: e.target.value })} style={inputStyle}>
            <option value="mixed">Mixed — English and French randomly</option>
            <option value="en2fr">See English, write French</option>
            <option value="fr2en">See French, write English</option>
          </select>
        </Field>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={settings.ignoreAccents}
            onChange={(e) => setSettings({ ...settings, ignoreAccents: e.target.checked })}
          />
          Ignore accents when checking French answers (é ≈ e)
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={settings.weakOnly} onChange={(e) => setSettings({ ...settings, weakOnly: e.target.checked })} />
          Focus on new &amp; struggling words only
        </label>
      </div>

      <button onClick={onStart} style={{ ...primaryBtnStyle, marginTop: 20, padding: "11px 20px", fontSize: 15 }}>
        Start practice <ChevronRight size={16} />
      </button>
    </div>
  );
}

function SessionSummary({ session, onRestart, onChangeSettings }) {
  const total = session.queue.length;
  const pct = total > 0 ? Math.round((session.score / total) * 100) : 0;
  return (
    <div className="fvt-animate-in" style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 22 }}>
      <div className="fvt-mono" style={{ fontSize: 12, color: COLORS.inkFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Session complete
      </div>
      <div className="fvt-display" style={{ fontSize: 32, fontWeight: 600, margin: "6px 0 4px" }}>
        {session.score} / {total} <span style={{ fontSize: 18, color: COLORS.inkMuted, fontWeight: 400 }}>({pct}%)</span>
      </div>

      {session.mistakes.length === 0 ? (
        <p style={{ color: COLORS.correct, fontWeight: 600 }}>Every word correct — well done.</p>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.inkMuted, marginBottom: 8 }}>Words to revisit</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {session.mistakes.map((m, i) => (
              <div key={i} style={{ background: COLORS.errorBg, borderRadius: 6, padding: "8px 10px", fontSize: 14 }}>
                <span className="fvt-devanagari" style={{ color: COLORS.inkMuted, marginRight: 8 }}>
                  {m.hindi}
                </span>
                <span style={{ color: COLORS.inkFaint }}>you wrote </span>
                <span style={{ textDecoration: "line-through", color: COLORS.margin }}>{m.userAnswer || "(blank)"}</span>
                <span style={{ color: COLORS.inkFaint }}> → </span>
                <span style={{ fontWeight: 700 }}>{m.correctAnswer}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <button onClick={onRestart} style={primaryBtnStyle}>
          <RotateCcw size={15} /> Practice again
        </button>
        <button onClick={onChangeSettings} style={secondaryBtnStyle}>
          Change settings
        </button>
      </div>
    </div>
  );
}

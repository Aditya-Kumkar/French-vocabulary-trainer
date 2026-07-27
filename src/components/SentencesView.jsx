import { useState, useRef } from "react";
import { Plus, Trash2, Pencil, Check, ListPlus, ChevronRight, X, RotateCcw, Flame, Sparkles, PenLine } from "lucide-react";
import { COLORS, inputStyle, primaryBtnStyle, secondaryBtnStyle, iconBtnStyle, cardShadow, Mascot, Field, EmptyNote } from "../theme";

const BLANK_MARKER = "___";

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

function splitSentence(sentence) {
  const idx = sentence.indexOf(BLANK_MARKER);
  if (idx === -1) return [sentence, ""];
  return [sentence.slice(0, idx), sentence.slice(idx + BLANK_MARKER.length)];
}

const ACCENT_KEYS = ["é", "è", "ê", "ë", "à", "â", "ù", "û", "ü", "î", "ï", "ô", "ç", "œ"];

export default function SentencesView({ sentences, onAdd, onBulkAdd, onEdit, onDelete, onRecordAttempt }) {
  const [subTab, setSubTab] = useState("practice");

  return (
    <div className="fvt-animate-in">
      <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: `1px solid ${COLORS.border}` }}>
        <SubTabButton label="Practice" active={subTab === "practice"} onClick={() => setSubTab("practice")} />
        <SubTabButton label="Manage Sentences" active={subTab === "manage"} onClick={() => setSubTab("manage")} />
      </div>
      {subTab === "practice" ? (
        <SentencePractice sentences={sentences} onRecordAttempt={onRecordAttempt} />
      ) : (
        <SentenceManager sentences={sentences} onAdd={onAdd} onBulkAdd={onBulkAdd} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
}

function SubTabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        fontSize: 15,
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

// ---------- Manage ----------
function SentenceManager({ sentences, onAdd, onBulkAdd, onEdit, onDelete }) {
  const [mode, setMode] = useState("single");
  const [frenchSentence, setFrenchSentence] = useState("");
  const [englishTranslation, setEnglishTranslation] = useState("");
  const [answer, setAnswer] = useState("");
  const [hindi, setHindi] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setFrenchSentence("");
    setEnglishTranslation("");
    setAnswer("");
    setHindi("");
    setEditingId(null);
    setError("");
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setFrenchSentence(s.french_sentence);
    setEnglishTranslation(s.english_translation);
    setAnswer(s.answer);
    setHindi(s.hindi);
    setMode("single");
    setError("");
  };

  const submitSingle = async () => {
    if (!frenchSentence.trim() || !englishTranslation.trim() || !answer.trim() || !hindi.trim()) {
      setError("Fill in all four fields.");
      return;
    }
    if (!frenchSentence.includes(BLANK_MARKER)) {
      setError(`The French sentence needs a blank marker: ${BLANK_MARKER}`);
      return;
    }
    setBusy(true);
    try {
      const fields = {
        french_sentence: frenchSentence.trim(),
        english_translation: englishTranslation.trim(),
        answer: answer.trim(),
        hindi: hindi.trim(),
      };
      if (editingId) await onEdit(editingId, fields);
      else await onAdd(fields);
      resetForm();
    } catch (err) {
      setError(err.message || "Couldn't save that sentence — try again.");
    } finally {
      setBusy(false);
    }
  };

  const submitBulk = async () => {
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    const parsed = [];
    for (const line of lines) {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length !== 4 || parts.some((p) => !p)) {
        setError(`This line isn't in "sentence with ${BLANK_MARKER} | english | answer | hindi" format: "${line}"`);
        return;
      }
      if (!parts[0].includes(BLANK_MARKER)) {
        setError(`This line's French sentence is missing the blank marker ${BLANK_MARKER}: "${line}"`);
        return;
      }
      parsed.push({ french_sentence: parts[0], english_translation: parts[1], answer: parts[2], hindi: parts[3] });
    }
    if (parsed.length === 0) {
      setError("Add at least one line first.");
      return;
    }
    setBusy(true);
    try {
      await onBulkAdd(parsed);
      setBulkText("");
      setError("");
    } catch (err) {
      setError(err.message || "Couldn't save those sentences — try again.");
    } finally {
      setBusy(false);
    }
  };

  const deleteSentence = async (id) => {
    setConfirmDeleteId(null);
    await onDelete(id);
  };

  return (
    <div>
      <div style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18, marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 className="fvt-display" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            {editingId ? "Edit sentence" : "Add sentences"}
          </h2>
          {!editingId && (
            <button
              onClick={() => {
                setMode(mode === "single" ? "bulk" : "single");
                setError("");
              }}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: COLORS.inkMuted, background: "none", border: "none", cursor: "pointer" }}
            >
              <ListPlus size={15} /> {mode === "single" ? "Add several at once" : "Add one at a time"}
            </button>
          )}
        </div>

        {mode === "single" || editingId ? (
          <div>
            <Field label={`French sentence (mark the blank with ${BLANK_MARKER})`}>
              <input
                value={frenchSentence}
                onChange={(e) => setFrenchSentence(e.target.value)}
                style={{ ...inputStyle, marginBottom: 10 }}
                placeholder={`e.g. Je ${BLANK_MARKER} au marché tous les matins.`}
              />
            </Field>
            <Field label="English translation">
              <input
                value={englishTranslation}
                onChange={(e) => setEnglishTranslation(e.target.value)}
                style={{ ...inputStyle, marginBottom: 10 }}
                placeholder="e.g. I go to the market every morning."
              />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <Field label="Missing word/phrase">
                <input value={answer} onChange={(e) => setAnswer(e.target.value)} style={inputStyle} placeholder="e.g. vais" />
              </Field>
              <Field label="Hindi pronunciation (of the answer)">
                <input
                  value={hindi}
                  onChange={(e) => setHindi(e.target.value)}
                  style={{ ...inputStyle, fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                  placeholder="e.g. वे"
                />
              </Field>
            </div>
            {error && <div style={{ color: COLORS.margin, fontSize: 14, marginTop: 8 }}>{error}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={submitSingle} disabled={busy} style={primaryBtnStyle}>
                {editingId ? <Check size={15} /> : <Plus size={15} />} {editingId ? "Save changes" : "Add sentence"}
              </button>
              {editingId && (
                <button onClick={resetForm} style={secondaryBtnStyle}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 14, color: COLORS.inkMuted, marginTop: 0 }}>
              One sentence per line: <span className="fvt-mono">french with {BLANK_MARKER} | english | answer | hindi</span>
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={6}
              style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}
              placeholder={`Je ${BLANK_MARKER} au marché. | I go to the market. | vais | वे`}
            />
            {error && <div style={{ color: COLORS.margin, fontSize: 14, marginTop: 8 }}>{error}</div>}
            <button onClick={submitBulk} disabled={busy} style={{ ...primaryBtnStyle, marginTop: 12 }}>
              <Plus size={15} /> Add these sentences
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <h2 className="fvt-display" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
          Your sentences
        </h2>
        <span className="fvt-mono" style={{ fontSize: 13, color: COLORS.inkFaint }}>
          {sentences.length} total
        </span>
      </div>

      {sentences.length === 0 ? (
        <EmptyNote text="No sentences yet. Add your first one above — it'll show up here ready to practice." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sentences.map((s) => {
            const [before, after] = splitSentence(s.french_sentence);
            const attempts = s.correct_count + s.incorrect_count;
            const accuracy = attempts > 0 ? Math.round((s.correct_count / attempts) * 100) : null;
            return (
              <div key={s.id} style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div>
                      {before}
                      <span style={{ color: COLORS.margin, fontWeight: 700, fontStyle: "italic" }}>{s.answer}</span>
                      {after}
                    </div>
                    <div style={{ fontSize: 14, color: COLORS.inkMuted, marginTop: 2 }}>{s.english_translation}</div>
                    <div className="fvt-devanagari" style={{ fontSize: 14, color: COLORS.inkFaint, marginTop: 2 }}>
                      {s.hindi}
                    </div>
                    {accuracy !== null && (
                      <div className="fvt-mono" style={{ fontSize: 12, color: COLORS.inkFaint, marginTop: 4 }}>
                        {accuracy}% accuracy · {attempts} attempt{attempts !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                  {confirmDeleteId === s.id ? (
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 13, color: COLORS.inkMuted }}>Delete?</span>
                      <button onClick={() => deleteSentence(s.id)} style={{ ...iconBtnStyle, color: COLORS.margin }}>
                        Yes
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} style={iconBtnStyle}>
                        No
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => startEdit(s)} style={iconBtnStyle} aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setConfirmDeleteId(s.id)} style={iconBtnStyle} aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- Practice ----------
function buildSentenceQueue(sentences) {
  const shuffled = [...sentences].sort(() => Math.random() - 0.5);
  const queue = [];
  shuffled.forEach((s) => {
    const isNew = s.correct_count + s.incorrect_count === 0;
    if (isNew) queue.push({ type: "intro", ...s });
    queue.push({ type: "quiz", ...s });
  });
  return queue;
}

function SentencePractice({ sentences, onRecordAttempt }) {
  const [session, setSession] = useState(null);
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [ignoreAccents, setIgnoreAccents] = useState(true);
  const inputRef = useRef(null);

  const startSession = () => {
    const queue = buildSentenceQueue(sentences);
    setSession({ queue, index: 0, score: 0, mistakes: [] });
    setAnswer("");
    setAnswered(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const currentQ = session && session.index < session.queue.length ? session.queue[session.index] : null;

  const submit = () => {
    if (!currentQ || currentQ.type !== "quiz" || answered) return;
    const opts = { ignoreAccents };
    const correct = normalizeAnswer(answer, opts) === normalizeAnswer(currentQ.answer, opts);
    setIsCorrect(correct);
    setAnswered(true);
    setSession((s) => ({
      ...s,
      score: s.score + (correct ? 1 : 0),
      mistakes: correct ? s.mistakes : [...s.mistakes, { ...currentQ, userAnswer: answer }],
    }));
    onRecordAttempt(currentQ.id, correct);
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

  if (sentences.length === 0) {
    return <EmptyNote text="You'll need a few sentences before you can practice — add some in the Manage Sentences tab." />;
  }

  if (!session) {
    return (
      <div style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
        <h2 className="fvt-display" style={{ fontSize: 21, fontWeight: 600, marginTop: 0 }}>
          Ready to fill in the blanks?
        </h2>
        <p style={{ fontSize: 16, color: COLORS.inkMuted, marginTop: -6 }}>
          {sentences.length} sentence{sentences.length !== 1 ? "s" : ""} in your notebook. You'll see the English translation and the Hindi
          pronunciation of the missing word — you write the French.
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, cursor: "pointer", marginTop: 12 }}>
          <input type="checkbox" checked={ignoreAccents} onChange={(e) => setIgnoreAccents(e.target.checked)} />
          Ignore accents when checking answers (é ≈ e)
        </label>
        <button onClick={startSession} style={{ ...primaryBtnStyle, marginTop: 20, padding: "12px 22px", fontSize: 17 }}>
          Start practice <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  if (session.index >= session.queue.length) {
    return <SentenceSummary session={session} onRestart={startSession} onChangeSettings={() => setSession(null)} />;
  }

  const totalQuizSteps = session.queue.filter((q) => q.type === "quiz").length;
  const quizPositionSoFar = session.queue.slice(0, session.index + 1).filter((q) => q.type === "quiz").length;
  const [before, after] = currentQ.type === "quiz" ? splitSentence(currentQ.french_sentence) : [null, null];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: 14, color: COLORS.inkMuted }}>
        <span className="fvt-mono">
          {currentQ.type === "intro" ? "New sentence" : `Sentence ${quizPositionSoFar} of ${totalQuizSteps}`}
        </span>
        <span className="fvt-mono" style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Flame size={14} color={COLORS.gold} /> {session.score} correct
        </span>
      </div>

      {currentQ.type === "intro" ? (
        <SentenceIntroCard item={currentQ} onContinue={next} />
      ) : (
        <div style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "24px 24px 24px 28px", boxShadow: cardShadow }}>
          <div className="fvt-mono" style={{ fontSize: 13, color: COLORS.inkFaint, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            English
          </div>
          <div style={{ fontSize: 18, marginBottom: 20 }}>{currentQ.english_translation}</div>

          <div className="fvt-mono" style={{ fontSize: 13, color: COLORS.inkFaint, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Complete the sentence
          </div>
          <div className="fvt-display" style={{ fontSize: 22, lineHeight: 1.6, marginBottom: 18 }}>
            {before}
            <span style={{ display: "inline-block", minWidth: 70, borderBottom: `2px dashed ${COLORS.margin}`, color: "transparent" }}>___</span>
            {after}
          </div>

          <div className="fvt-devanagari" style={{ fontSize: 22, color: COLORS.inkMuted, marginBottom: 4 }}>
            {currentQ.hindi}
          </div>
          <div className="fvt-mono" style={{ fontSize: 12, color: COLORS.inkFaint, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            pronunciation of the missing word
          </div>

          <div className="fvt-mono" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 13, color: COLORS.inkFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <PenLine size={13} color={COLORS.margin} />
            Write the missing word
          </div>
          <input
            ref={inputRef}
            value={answer}
            disabled={answered}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            className="fvt-answer-line"
            style={{ fontSize: 24, width: "100%", fontFamily: "'Fraunces', serif" }}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {!answered && (
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
                <div className="fvt-hand" style={{ fontSize: 28, color: isCorrect ? COLORS.correct : COLORS.margin, lineHeight: 1.1 }}>
                  {isCorrect ? "Bravo !" : "Pas tout à fait"}
                </div>
                {!isCorrect && (
                  <div style={{ fontSize: 17, color: COLORS.ink, marginTop: 2 }}>
                    Correct answer: <span style={{ fontWeight: 700 }}>{currentQ.answer}</span>
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
                {session.index + 1 < session.queue.length ? "Next sentence" : "See results"} <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SentenceIntroCard({ item, onContinue }) {
  const [before, after] = splitSentence(item.french_sentence);
  return (
    <div className="fvt-animate-in" style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "24px 24px 24px 28px", boxShadow: cardShadow }}>
      <div className="fvt-mono" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORS.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
        <Sparkles size={14} /> First time seeing this sentence — take a moment to learn it
      </div>

      <div className="fvt-mono" style={{ fontSize: 12, color: COLORS.inkFaint, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        English
      </div>
      <div style={{ fontSize: 18, marginBottom: 18 }}>{item.english_translation}</div>

      <div className="fvt-mono" style={{ fontSize: 12, color: COLORS.inkFaint, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        French
      </div>
      <div className="fvt-display" style={{ fontSize: 22, lineHeight: 1.6, marginBottom: 18 }}>
        {before}
        <span style={{ color: COLORS.margin, fontWeight: 700 }}>{item.answer}</span>
        {after}
      </div>

      <div className="fvt-devanagari" style={{ fontSize: 22, color: COLORS.inkMuted, marginBottom: 4 }}>
        {item.hindi}
      </div>
      <div className="fvt-mono" style={{ fontSize: 12, color: COLORS.inkFaint, marginBottom: 22, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        pronunciation of "{item.answer}"
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onContinue} style={primaryBtnStyle}>
          Got it — quiz me <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function SentenceSummary({ session, onRestart, onChangeSettings }) {
  const total = session.queue.filter((q) => q.type === "quiz").length;
  const pct = total > 0 ? Math.round((session.score / total) * 100) : 0;
  return (
    <div className="fvt-animate-in" style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <div style={{ position: "relative", width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.goldBg} 0%, transparent 70%)`,
            }}
          />
          <Mascot size={80} style={{ position: "relative" }} />
        </div>
      </div>
      <div className="fvt-mono" style={{ fontSize: 13, color: COLORS.inkFaint, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>
        Session complete
      </div>
      <div className="fvt-display" style={{ fontSize: 36, fontWeight: 600, margin: "6px 0 4px", textAlign: "center" }}>
        {session.score} / {total} <span style={{ fontSize: 20, color: COLORS.inkMuted, fontWeight: 400 }}>({pct}%)</span>
      </div>

      {session.mistakes.length === 0 ? (
        <p style={{ color: COLORS.correct, fontWeight: 600, textAlign: "center" }}>Every sentence correct — well done.</p>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.inkMuted, marginBottom: 8 }}>Sentences to revisit</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {session.mistakes.map((m, i) => {
              const [before, after] = splitSentence(m.french_sentence);
              return (
                <div key={i} style={{ background: COLORS.errorBg, borderRadius: 6, padding: "9px 12px", fontSize: 15 }}>
                  <div>
                    {before}
                    <span style={{ fontWeight: 700 }}>{m.answer}</span>
                    {after}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.inkFaint, marginTop: 2 }}>
                    you wrote <span style={{ textDecoration: "line-through", color: COLORS.margin }}>{m.userAnswer || "(blank)"}</span>
                  </div>
                </div>
              );
            })}
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

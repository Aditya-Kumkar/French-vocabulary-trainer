import { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, RotateCcw, Lightbulb, XCircle } from "lucide-react";
import { COLORS, cardShadow } from "../theme";
import { SENTENCE_EXERCISES, checkSentenceOrder } from "../sentenceExercises.js";

export default function SentenceBuilder({ onRecordAttempt = () => {} }) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [checked, setChecked] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const exercise = SENTENCE_EXERCISES[exerciseIndex];
  const correct = checked && checkSentenceOrder(selectedWords, exercise);

  const resetExercise = (index = exerciseIndex) => {
    setExerciseIndex(index);
    setSelectedWords([]);
    setChecked(false);
    setHintShown(false);
  };

  const chooseWord = (word, index) => {
    if (checked) return;
    setSelectedWords((current) => [...current, { word, index }]);
  };

  const removeWord = (selectedIndex) => {
    if (checked) return;
    setSelectedWords((current) => current.filter((_, index) => index !== selectedIndex));
  };

  const check = () => {
    if (checked || selectedWords.length !== exercise.words.length) return;
    const isCorrect = checkSentenceOrder(selectedWords.map((item) => item.word), exercise);
    setChecked(true);
    setResults((current) => [...current, isCorrect]);
    onRecordAttempt(isCorrect);
  };

  const next = () => {
    if (exerciseIndex === SENTENCE_EXERCISES.length - 1) setFinished(true);
    else resetExercise(exerciseIndex + 1);
  };

  const restart = () => {
    setResults([]);
    setFinished(false);
    resetExercise(0);
  };

  if (finished) {
    const score = results.filter(Boolean).length;
    return (
      <section className="fvt-animate-in" style={cardStyle}>
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <CheckCircle2 size={42} color={COLORS.correct} />
          <h2 className="fvt-display" style={{ fontSize: 28, margin: "12px 0 6px" }}>C’est une phrase !</h2>
          <p style={{ color: COLORS.inkMuted, marginTop: 0 }}>You built {score} of {SENTENCE_EXERCISES.length} sentences correctly on the first try.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <button onClick={restart} style={primaryButton}><RotateCcw size={15} /> Practise again</button>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          {SENTENCE_EXERCISES.map((item, index) => (
            <div key={item.id} style={{ borderTop: `1px solid ${COLORS.border}`, padding: "10px 0", display: "flex", gap: 10, alignItems: "center" }}>
              {results[index] ? <CheckCircle2 size={17} color={COLORS.correct} /> : <XCircle size={17} color={COLORS.margin} />}
              <div><strong>{item.answer.join(" ")}</strong><div style={{ fontSize: 13, color: COLORS.inkMuted }}>{item.translation}</div></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const usedIndexes = new Set(selectedWords.map((item) => item.index));
  const sentenceText = selectedWords.map((item) => item.word).join(" ");

  return (
    <div className="fvt-animate-in" style={{ display: "grid", gap: 16 }}>
      <div>
        <div className="fvt-mono" style={{ color: COLORS.margin, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>Grammaire · A1</div>
        <h2 className="fvt-display" style={{ fontSize: 28, margin: "5px 0" }}>Build a French sentence</h2>
        <p style={{ color: COLORS.inkMuted, lineHeight: 1.6, margin: 0 }}>Tap the word tiles in the right order. Check your sentence to learn why the word order works.</p>
      </div>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <span className="fvt-mono" style={{ fontSize: 11, color: COLORS.margin }}>{exercise.level} · {exerciseIndex + 1} OF {SENTENCE_EXERCISES.length}</span>
          <span style={{ fontSize: 13, color: COLORS.inkMuted }}>{results.filter(Boolean).length} correct so far</span>
        </div>
        <h3 className="fvt-display" style={{ fontSize: 23, margin: "0 0 8px" }}>{exercise.title}</h3>
        <p style={{ fontSize: 16, lineHeight: 1.55, margin: "0 0 16px" }}>{exercise.prompt}</p>
        <div style={{ background: COLORS.page, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 14, minHeight: 68, display: "flex", flexWrap: "wrap", alignContent: "center", gap: 8 }}>
          {selectedWords.length === 0 && <span style={{ color: COLORS.inkFaint, fontSize: 14 }}>Your sentence will appear here…</span>}
          {selectedWords.map((item, index) => (
            <button key={`${item.index}-${index}`} onClick={() => removeWord(index)} disabled={checked} aria-label={`Remove ${item.word}`} style={tileStyle(checked, false)}>{item.word}</button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, margin: "12px 0 8px" }}>
          <span className="fvt-mono" style={{ fontSize: 11, color: COLORS.inkMuted }}>WORD BANK</span>
          <button onClick={() => resetExercise()} disabled={checked} style={textButton}><RotateCcw size={13} /> Clear</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {exercise.words.map((word, index) => (
            <button key={`${word}-${index}`} disabled={usedIndexes.has(index) || checked} onClick={() => chooseWord(word, index)} style={tileStyle(checked, usedIndexes.has(index))}>{word}</button>
          ))}
        </div>
        {hintShown && <p style={{ background: COLORS.page, borderRadius: 8, padding: 12, fontSize: 14, lineHeight: 1.5, marginBottom: 0 }}><Lightbulb size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />{exercise.hint}</p>}
        {checked && (
          <div role="status" style={{ marginTop: 16, padding: 14, borderRadius: 8, background: COLORS.page, border: `1px solid ${correct ? COLORS.correct : COLORS.border}`, lineHeight: 1.55 }}>
            <strong style={{ display: "flex", alignItems: "center", gap: 7 }}>{correct ? <CheckCircle2 size={17} color={COLORS.correct} /> : <XCircle size={17} color={COLORS.margin} />}{correct ? "Correct ! Bien joué." : "Not quite — study the correct order below."}</strong>
            {!correct && <p style={{ margin: "8px 0 4px", fontWeight: 650 }}>{exercise.answer.join(" ")}</p>}
            <p style={{ margin: "8px 0 4px", color: COLORS.inkMuted }}>{exercise.explanation}</p>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.inkMuted }}>English: {exercise.translation}</p>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
          <button onClick={() => setHintShown(true)} disabled={hintShown || checked} style={secondaryButton}><Lightbulb size={15} /> Hint</button>
          {!checked ? (
            <button onClick={check} disabled={selectedWords.length !== exercise.words.length} style={{ ...primaryButton, opacity: selectedWords.length === exercise.words.length ? 1 : 0.5 }}>Check sentence <ChevronRight size={15} /></button>
          ) : (
            <button onClick={next} style={primaryButton}>{exerciseIndex === SENTENCE_EXERCISES.length - 1 ? "See results" : "Next sentence"} <ChevronRight size={15} /></button>
          )}
        </div>
      </section>
      <section style={{ ...cardStyle, padding: 16 }}>
        <h3 className="fvt-display" style={{ fontSize: 20, margin: "0 0 8px" }}>Grammar note</h3>
        <p style={{ color: COLORS.inkMuted, lineHeight: 1.7, margin: 0 }}>{exercise.rule}</p>
      </section>
    </div>
  );
}

const cardStyle = { background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, boxShadow: cardShadow };
const primaryButton = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: "none", borderRadius: 7, padding: "11px 15px", background: COLORS.margin, color: "#fff", fontWeight: 650, fontSize: 14, cursor: "pointer" };
const secondaryButton = { display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "9px 12px", background: "transparent", color: COLORS.ink, fontSize: 14, cursor: "pointer" };
const textButton = { display: "inline-flex", alignItems: "center", gap: 5, border: "none", background: "transparent", color: COLORS.inkMuted, fontSize: 13, cursor: "pointer", padding: 4 };
function tileStyle(disabled, used) {
  return { border: `1px solid ${used ? COLORS.border : COLORS.margin}`, borderRadius: 8, padding: "10px 13px", minHeight: 42, background: used ? COLORS.page : COLORS.paper, color: used ? COLORS.inkFaint : COLORS.ink, fontSize: 15, cursor: disabled || used ? "default" : "pointer", opacity: used ? 0.4 : 1 };
}

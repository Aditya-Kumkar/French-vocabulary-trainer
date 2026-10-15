import { useEffect, useMemo, useState } from "react";
import { Clock3, CheckCircle2, XCircle, RotateCcw, ClipboardCheck } from "lucide-react";
import { COLORS, inputStyle, primaryBtnStyle, secondaryBtnStyle, cardShadow, EmptyNote } from "../theme";
import { buildExamQuestions, formatTimeRemaining, gradeExamAnswer } from "../exam.js";

const QUESTION_COUNTS = [10, 20, 30];

export default function ExamMode({ words, sentences, onRecordAttempt, onRecordSentenceAttempt }) {
  const [questionCount, setQuestionCount] = useState(10);
  const [exam, setExam] = useState(null);
  const [response, setResponse] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const availableCount = useMemo(
    () => words.filter((word) => word?.id != null && word.french && word.english).length
      + sentences.filter((sentence) => sentence?.id != null && sentence.french_sentence?.includes("___") && sentence.answer).length,
    [words, sentences]
  );

  useEffect(() => {
    if (!exam || finished || remaining <= 0) return undefined;
    const timer = window.setInterval(() => setRemaining((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [exam, finished, remaining > 0]);

  useEffect(() => {
    if (exam && !finished && remaining === 0) finishExam();
    // finishExam is intentionally triggered only when the active timer reaches zero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, exam, finished]);

  const finishExam = () => {
    setFinished(true);
  };

  const startExam = () => {
    const questions = buildExamQuestions(words, sentences, questionCount);
    if (!questions.length) return;
    setExam(questions);
    setAnswers([]);
    setResponse("");
    setRemaining(questions.length * 60);
    setFinished(false);
  };

  const currentIndex = answers.length;
  const currentQuestion = exam?.[currentIndex] || null;
  const score = answers.filter((answer) => answer.correct).length;
  const answeredCount = answers.length;
  const completed = finished || (exam && currentIndex >= exam.length);
  const mistakes = answers.filter((answer) => !answer.correct);

  const submitAnswer = () => {
    if (!currentQuestion || !response.trim()) return;
    const correct = gradeExamAnswer(response, currentQuestion.answer);
    const result = { ...currentQuestion, response: response.trim(), correct };
    setAnswers((previous) => [...previous, result]);
    if (currentQuestion.kind === "word") {
      onRecordAttempt?.(currentQuestion.sourceId, currentQuestion.source, correct);
    } else {
      onRecordSentenceAttempt?.(currentQuestion.sourceId, correct);
    }
    setResponse("");
    if (currentIndex + 1 >= exam.length) setFinished(true);
  };

  const restart = () => {
    setExam(null);
    setAnswers([]);
    setResponse("");
    setRemaining(0);
    setFinished(false);
  };

  if (!availableCount) {
    return <EmptyNote text="Add vocabulary or sentence exercises to your notebook before starting an exam." />;
  }

  if (!exam) {
    return (
      <div className="fvt-animate-in" style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 22, boxShadow: cardShadow }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <ClipboardCheck size={24} color={COLORS.margin} />
          <h2 className="fvt-display" style={{ margin: 0, fontSize: 26, fontWeight: 600 }}>Exam practice</h2>
        </div>
        <p style={{ color: COLORS.inkMuted, lineHeight: 1.6, marginTop: 0 }}>
          A timed mock exam using your saved vocabulary and sentence exercises. Answers are checked as you go, and your attempts update your learning progress.
        </p>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Choose exam length</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 16 }}>
          {QUESTION_COUNTS.map((count) => {
            const disabled = false;
            const active = questionCount === count;
            return (
              <button key={count} type="button" disabled={disabled} onClick={() => setQuestionCount(count)}
                style={{ padding: "12px 8px", borderRadius: 8, border: `1px solid ${active ? COLORS.margin : COLORS.border}`, background: active ? COLORS.page : "transparent", color: disabled ? COLORS.inkFaint : COLORS.ink, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1 }}>
                <div style={{ fontSize: 20 }}>{count}</div>
                <div style={{ fontSize: 12, fontWeight: 400 }}>up to questions</div>
              </button>
            );
          })}
        </div>
        <div style={{ color: COLORS.inkMuted, fontSize: 13, marginBottom: 18 }}>
          {availableCount} eligible questions available · exam uses up to the selected count · 1 minute per question
        </div>
        <button type="button" onClick={startExam} style={{ ...primaryBtnStyle, width: "100%", justifyContent: "center" }}>
          Start mock exam
        </button>
      </div>
    );
  }

  if (completed) {
    const percentage = exam.length ? Math.round((score / exam.length) * 100) : 0;
    return (
      <div className="fvt-animate-in" style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 22, boxShadow: cardShadow }}>
        <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
          <CheckCircle2 size={34} color={COLORS.margin} />
          <h2 className="fvt-display" style={{ fontSize: 28, margin: "10px 0 4px" }}>Exam complete</h2>
          <div style={{ color: COLORS.inkMuted }}>Your results from this session</div>
          <div className="fvt-display" style={{ fontSize: 48, fontWeight: 700, marginTop: 12 }}>{percentage}%</div>
          <div style={{ fontSize: 15, color: COLORS.inkMuted }}>{score} correct out of {exam.length}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 20 }}>
          {[
            ["Correct", score],
            ["Incorrect", mistakes.length],
            ["Unanswered", exam.length - answeredCount],
          ].map(([label, value]) => (
            <div key={label} style={{ padding: 12, border: `1px solid ${COLORS.border}`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
              <div style={{ color: COLORS.inkMuted, fontSize: 12 }}>{label}</div>
            </div>
          ))}
        </div>
        {answers.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 className="fvt-display" style={{ fontSize: 20 }}>Answer review</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {answers.map((answer, index) => (
                <div key={answer.id} style={{ padding: 12, border: `1px solid ${COLORS.border}`, borderRadius: 8 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 600, marginBottom: 5 }}>
                    {answer.correct ? <CheckCircle2 size={16} color={COLORS.success || "#3D7955"} /> : <XCircle size={16} color={COLORS.margin} />}
                    <span>Question {index + 1}</span>
                  </div>
                  <div style={{ marginBottom: 4 }}>{answer.prompt}</div>
                  <div style={{ color: COLORS.inkMuted, fontSize: 14 }}>Your answer: {answer.response || "—"}</div>
                  {!answer.correct && <div style={{ color: COLORS.ink, fontSize: 14, marginTop: 3 }}>Expected: <strong>{answer.answer}</strong></div>}
                  {answer.kind === "sentence" && answer.explanation && <div style={{ color: COLORS.inkMuted, fontSize: 13, marginTop: 3 }}>{answer.explanation}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        <button type="button" onClick={restart} style={{ ...secondaryBtnStyle, width: "100%", justifyContent: "center" }}>
          <RotateCcw size={16} /> Back to exam setup
        </button>
      </div>
    );
  }

  return (
    <div className="fvt-animate-in" style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 22, boxShadow: cardShadow }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span className="fvt-mono" style={{ color: COLORS.inkMuted, fontSize: 13 }}>QUESTION {currentIndex + 1} / {exam.length}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontVariantNumeric: "tabular-nums", fontWeight: 700, color: remaining < 60 ? COLORS.margin : COLORS.ink }}>
          <Clock3 size={16} /> {formatTimeRemaining(remaining)}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: COLORS.border, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ width: `${(currentIndex / exam.length) * 100}%`, height: "100%", background: COLORS.margin, transition: "width 160ms ease" }} />
      </div>
      <div className="fvt-mono" style={{ fontSize: 12, color: COLORS.margin, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{currentQuestion.promptLabel}</div>
      <h2 className="fvt-display" style={{ fontSize: 28, lineHeight: 1.3, margin: "0 0 22px", overflowWrap: "anywhere" }}>{currentQuestion.prompt}</h2>
      <form onSubmit={(event) => { event.preventDefault(); submitAnswer(); }}>
        <label htmlFor="exam-answer" style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your answer</label>
        <input id="exam-answer" autoComplete="off" autoFocus value={response} onChange={(event) => setResponse(event.target.value)} style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 14 }} placeholder="Type your answer in French" />
        <button type="submit" disabled={!response.trim()} style={{ ...primaryBtnStyle, width: "100%", justifyContent: "center", opacity: response.trim() ? 1 : 0.55 }}>
          Submit answer
        </button>
      </form>
      <button type="button" onClick={finishExam} style={{ ...secondaryBtnStyle, width: "100%", justifyContent: "center", marginTop: 10 }}>
        Finish exam early
      </button>
    </div>
  );
}

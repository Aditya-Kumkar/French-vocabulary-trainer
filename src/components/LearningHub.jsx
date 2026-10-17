import { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";
import { COLORS, cardShadow, EmptyNote } from "../theme";
import { LEARNING_TOPICS } from "../learningTopics.js";

export default function LearningHub({ onRecordAttempt = () => {} }) {
  const [topicId, setTopicId] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const topic = LEARNING_TOPICS.find((item) => item.id === topicId);
  const question = topic?.questions[questionIndex];

  const openTopic = (id) => {
    setTopicId(id);
    setQuestionIndex(0);
    setSelected("");
    setShowAnswer(false);
    setScore(0);
    setFinished(false);
  };
  const checkAnswer = () => {
    if (!question || !selected || showAnswer) return;
    const correct = selected === question.answer;
    if (correct) setScore((value) => value + 1);
    setShowAnswer(true);
    onRecordAttempt(correct);
  };
  const nextQuestion = () => {
    if (questionIndex + 1 >= topic.questions.length) setFinished(true);
    else {
      setQuestionIndex((value) => value + 1);
      setSelected("");
      setShowAnswer(false);
    }
  };

  if (!topic) {
    return (
      <div className="fvt-animate-in" style={{ display: "grid", gap: 16 }}>
        <div>
          <div className="fvt-mono" style={{ color: COLORS.margin, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>START HERE · BEGINNER</div>
          <h2 className="fvt-display" style={{ fontSize: 28, margin: "5px 0" }}>Start with the basics</h2>
          <p style={{ color: COLORS.inkMuted, lineHeight: 1.6, margin: 0 }}>No prior French needed. Learn one small idea, review the examples, then practise with a topic-specific question set.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 12 }}>
          {LEARNING_TOPICS.map((item) => (
            <button key={item.id} onClick={() => openTopic(item.id)} style={{ textAlign: "left", padding: 16, borderRadius: 12, border: `1px solid ${COLORS.border}`, background: COLORS.paper, color: COLORS.ink, cursor: "pointer", boxShadow: cardShadow, minHeight: 132 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                <span style={{ fontSize: 26 }} aria-hidden="true">{item.icon}</span>
                <span className="fvt-mono" style={{ color: COLORS.margin, fontSize: 11 }}>{item.level}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, marginTop: 10 }}>{item.title}</div>
              <div style={{ color: COLORS.inkMuted, fontSize: 13, marginTop: 4 }}>{item.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="fvt-animate-in" style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 22, boxShadow: cardShadow }}>
        <button onClick={() => setTopicId(null)} style={secondaryButton}><ArrowLeft size={15} /> All topics</button>
        <div style={{ textAlign: "center", padding: "24px 0 12px" }}>
          <CheckCircle2 size={42} color={COLORS.correct} />
          <h2 className="fvt-display" style={{ fontSize: 28, margin: "12px 0 6px" }}>Lesson complete!</h2>
          <p style={{ color: COLORS.inkMuted }}>{topic.title}: you scored <strong>{score}/{topic.questions.length}</strong>.</p>
          <button onClick={() => openTopic(topic.id)} style={primaryButton}><RotateCcw size={15} /> Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fvt-animate-in" style={{ display: "grid", gap: 16 }}>
      <button onClick={() => setTopicId(null)} style={secondaryButton}><ArrowLeft size={15} /> All topics</button>
      <section style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, boxShadow: cardShadow }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 32 }} aria-hidden="true">{topic.icon}</span>
          <div>
            <div className="fvt-mono" style={{ fontSize: 11, color: COLORS.margin, letterSpacing: "0.1em" }}>LESSON · {topic.level}</div>
            <h2 className="fvt-display" style={{ fontSize: 26, margin: "3px 0" }}>{topic.title}</h2>
          </div>
        </div>
        <p style={{ lineHeight: 1.75, margin: "16px 0", color: COLORS.ink }}>{renderLesson(topic.lesson)}</p>
        <h3 style={{ fontSize: 15, margin: "18px 0 10px" }}>Examples</h3>
        <div style={{ display: "grid", gap: 0 }}>
          {topic.examples.map(([french, english]) => (
            <div key={french} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12, padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
              <strong style={{ fontSize: 14 }}>{french}</strong><span style={{ color: COLORS.inkMuted, fontSize: 14 }}>{english}</span>
            </div>
          ))}
        </div>
      </section>
      <section style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, boxShadow: cardShadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <div>
            <h3 className="fvt-display" style={{ fontSize: 22, margin: 0 }}>Practice set</h3>
            <p style={{ color: COLORS.inkMuted, fontSize: 13, margin: "4px 0 0" }}>{topic.id === "articles" ? "Fill in the blank with the correct definite or indefinite article." : "Choose the correct answer for each question."}</p>
          </div>
          <span className="fvt-mono" style={{ color: COLORS.inkMuted, fontSize: 12, whiteSpace: "nowrap" }}>QUESTION {questionIndex + 1}/{topic.questions.length}</span>
        </div>
        <p style={{ fontSize: 18, fontWeight: 650, lineHeight: 1.5 }}>{question.prompt}</p>
        <div style={{ display: "grid", gap: 8 }}>
          {question.options.map((option) => {
            const isChosen = selected === option;
            const isRight = showAnswer && option === question.answer;
            return <button key={option} disabled={showAnswer} onClick={() => setSelected(option)} style={{ textAlign: "left", padding: "12px 14px", minHeight: 46, borderRadius: 8, border: `1px solid ${isRight ? COLORS.correct : isChosen ? COLORS.margin : COLORS.border}`, background: isRight ? "#E8F3E9" : isChosen ? COLORS.page : "transparent", color: COLORS.ink, cursor: showAnswer ? "default" : "pointer", fontSize: 15, fontWeight: isChosen || isRight ? 650 : 450 }}>{option}</button>;
          })}
        </div>
        {showAnswer && <div role="status" style={{ marginTop: 14, padding: 12, borderRadius: 8, background: COLORS.page, lineHeight: 1.55 }}><strong>{selected === question.answer ? "Correct! Well done." : `Correct answer: ${question.answer}`}</strong><div style={{ fontSize: 14, marginTop: 4, color: COLORS.inkMuted }}>{question.explain}</div></div>}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          {!showAnswer ? <button disabled={!selected} onClick={checkAnswer} style={{ ...primaryButton, opacity: selected ? 1 : 0.5 }}>Check answer <ChevronRight size={15} /></button> : <button onClick={nextQuestion} style={primaryButton}>{questionIndex + 1 === topic.questions.length ? "See result" : "Next question"} <ChevronRight size={15} /></button>}
        </div>
      </section>
    </div>
  );
}

function renderLesson(text) {
  return text.split(/(\\*\\*[^*]+\\*\\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part
  );
}

const primaryButton = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: "none", borderRadius: 7, padding: "11px 15px", background: COLORS.margin, color: "#fff", fontWeight: 650, fontSize: 14, cursor: "pointer" };
const secondaryButton = { display: "inline-flex", alignItems: "center", gap: 7, justifySelf: "start", border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "9px 12px", background: "transparent", color: COLORS.ink, fontSize: 14, cursor: "pointer" };

import { useState, useRef, useEffect } from "react";
import PracticeView from "./PracticeView.jsx";
import SentencesView from "./SentencesView.jsx";
import SentenceBuilder from "./SentenceBuilder.jsx";
import SentenceLab from "./SentenceLab.jsx";
import ExamMode from "./ExamMode.jsx";

const SECTIONS = [
  { value: "vocabulary", label: "Vocabulary" },
  { value: "sentences", label: "Sentences" },
  { value: "builder", label: "Build a sentence" },
  { value: "create", label: "English → French" },
  { value: "exam", label: "Exam practice" },
];

export default function PracticeWorkspace(props) {
  const [section, setSection] = useState(() => {
    try {
      const saved = sessionStorage.getItem("fvt-practice-section");
      return SECTIONS.some((item) => item.value === saved) ? saved : "vocabulary";
    } catch {
      return "vocabulary";
    }
  });
  const [focusMode, setFocusMode] = useState(false);
  const focusAnchor = useRef(null);

  useEffect(() => {
    if (focusMode) focusAnchor.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusMode, section]);

  const { words, sentences, settings, setSettings, onRecordAttempt, onRecordSentenceAttempt } = props;

  const selectedSection = SECTIONS.find((item) => item.value === section);
  const activityContent = (
    <>
      {section === "vocabulary" && <PracticeView words={words} settings={settings} setSettings={setSettings} onRecordAttempt={onRecordAttempt} onSessionStart={() => setFocusMode(true)} />}
      {section === "sentences" && <SentencesView sentences={sentences} onAdd={props.onSentenceAdd} onBulkAdd={props.onSentenceBulkAdd} onEdit={props.onSentenceEdit} onDelete={props.onSentenceDelete} onRecordAttempt={onRecordSentenceAttempt} />}
      {section === "builder" && <SentenceBuilder onRecordAttempt={(correct) => props.trackActivity(correct)} />}
      {section === "create" && <SentenceLab onRecordAttempt={(correct) => props.trackActivity(correct)} />}
      {section === "exam" && <ExamMode words={words} sentences={sentences} onRecordAttempt={onRecordAttempt} onRecordSentenceAttempt={onRecordSentenceAttempt} />}
    </>
  );

  return (
    <div
      ref={focusAnchor}
      className={`fvt-animate-in fvt-practice-workspace${focusMode ? " is-focused fvt-focus-overlay" : ""}`}
      style={{ display: "grid", gap: 18 }}
    >
      {!focusMode && (
        <>
          <div>
            <h2 className="fvt-display" style={{ fontSize: 28, margin: "0 0 5px" }}>Practice</h2>
            <p style={{ color: "var(--fvt-muted, #656b78)", lineHeight: 1.5, margin: 0 }}>Choose one activity. Short sessions are enough.</p>
          </div>
          <nav className="fvt-activity-picker" aria-label="Choose a practice activity">
            {SECTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={section === item.value ? "is-active" : ""}
                aria-pressed={section === item.value}
                onClick={() => { setSection(item.value); setFocusMode(item.value !== "vocabulary"); }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </>
      )}

      {focusMode && (
        <div className="fvt-focus-bar">
          <div>
            <span className="fvt-focus-kicker">FOCUS SESSION</span>
            <strong>{selectedSection?.label}</strong>
          </div>
          <button type="button" onClick={() => setFocusMode(false)}>Exit focus</button>
        </div>
      )}

      <div className={focusMode ? "fvt-focus-content" : "fvt-workspace-content"}>
        {activityContent}
      </div>
    </div>
  );
}

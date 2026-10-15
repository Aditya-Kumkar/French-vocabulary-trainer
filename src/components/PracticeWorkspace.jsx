import { useState } from "react";
import PracticeView from "./PracticeView.jsx";
import SentencesView from "./SentencesView.jsx";
import SentenceBuilder from "./SentenceBuilder.jsx";
import SentenceLab from "./SentenceLab.jsx";
import ExamMode from "./ExamMode.jsx";
import ClassDashboard from "./ClassDashboard.jsx";

const SECTIONS = [
  { value: "vocabulary", label: "Vocabulary" },
  { value: "sentences", label: "Sentences" },
  { value: "builder", label: "Build a sentence" },
  { value: "create", label: "English → French" },
  { value: "exam", label: "Exam practice" },
];

export default function PracticeWorkspace(props) {
  const [section, setSection] = useState("vocabulary");
  const { words, classWords, sentences, settings, setSettings, onRecordAttempt, onRecordSentenceAttempt, isAdmin } = props;
  const allWords = [...words.map((word) => ({ ...word, source: "personal" })), ...classWords];

  return (
    <div className="fvt-animate-in" style={{ display: "grid", gap: 18 }}>
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
            onClick={() => setSection(item.value)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {section === "vocabulary" && <PracticeView words={allWords} settings={settings} setSettings={setSettings} onRecordAttempt={onRecordAttempt} />}
      {section === "sentences" && <SentencesView sentences={sentences} onAdd={props.onSentenceAdd} onBulkAdd={props.onSentenceBulkAdd} onEdit={props.onSentenceEdit} onDelete={props.onSentenceDelete} onRecordAttempt={onRecordSentenceAttempt} />}
      {section === "builder" && <SentenceBuilder onRecordAttempt={(correct) => props.trackActivity(correct)} />}
      {section === "create" && <SentenceLab onRecordAttempt={(correct) => props.trackActivity(correct)} />}
      {section === "exam" && <ExamMode words={allWords} sentences={sentences} onRecordAttempt={onRecordAttempt} onRecordSentenceAttempt={onRecordSentenceAttempt} />}
      {isAdmin && <details style={{ borderTop: "1px solid #e4e0d5", paddingTop: 12 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Class management</summary>
        <div style={{ marginTop: 12 }}>
          <ClassDashboard classWords={classWords} onAdd={props.onClassAdd} onBulkAdd={props.onClassBulkAdd} onEdit={props.onClassEdit} onDelete={props.onClassDelete} />
        </div>
      </details>}
    </div>
  );
}

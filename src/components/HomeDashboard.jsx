import { ArrowRight, BookOpen, Brain, Target } from "lucide-react";
import { COLORS } from "../theme";
import { localDateKey, readDailyGoal } from "../activity.js";

export default function HomeDashboard({ displayName, words = [], sentences = [], activity = {}, onNavigate }) {
  const goal = readDailyGoal();
  const today = activity?.[localDateKey()] || {};
  const attempts = Math.max(0, Number(today.attempts) || 0);
  const percent = Math.min(100, Math.round((attempts / goal) * 100));
  const firstName = displayName?.trim().split(/\s+/)[0];

  return <div className="fvt-animate-in" style={{ display: "grid", gap: 18 }}>
    <section style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "clamp(18px, 4vw, 28px)" }}>
      <div className="fvt-mono" style={{ color: COLORS.margin, fontSize: 12, letterSpacing: ".12em" }}>TON ESPACE FRANÇAIS</div>
      <h2 className="fvt-display" style={{ fontSize: "clamp(30px, 6vw, 42px)", lineHeight: 1.12, margin: "8px 0" }}>Bonjour{firstName ? `, ${firstName}` : ""} !</h2>
      <p style={{ color: COLORS.inkMuted, lineHeight: 1.6, margin: "0 0 20px", maxWidth: 460 }}>A little French every day goes a long way. Let's keep today's session simple.</p>
      <button onClick={() => onNavigate("practice")} style={{ display: "inline-flex", alignItems: "center", gap: 9, minHeight: 46, border: 0, borderRadius: 8, padding: "12px 18px", background: COLORS.margin, color: "#fff", font: "inherit", fontWeight: 650, cursor: "pointer" }}>Continue learning <ArrowRight size={17} /></button>
    </section>
    <section style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 18, background: COLORS.paper }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}><strong>Today's goal</strong><span style={{ color: COLORS.inkMuted, fontSize: 13 }}>{Math.min(attempts, goal)} of {goal} questions</span></div>
      <div role="progressbar" aria-label="Today's learning goal" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(attempts, goal)} style={{ height: 8, marginTop: 10, background: COLORS.border, borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${percent}%`, height: "100%", background: COLORS.correct, borderRadius: 99 }} /></div>
      <p style={{ color: COLORS.inkMuted, fontSize: 13, margin: "9px 0 0" }}>{attempts >= goal ? "Goal complete — bravo !" : `${goal - attempts} more questions to reach your goal.`}</p>
    </section>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 10 }}>
      <button onClick={() => onNavigate("learn")} style={shortcut}><BookOpen size={19} /><span style={shortcutText}><strong>Learn</strong><small>Lessons and examples</small></span><ArrowRight size={16} /></button>
      <button onClick={() => onNavigate("practice")} style={shortcut}><Brain size={19} /><span style={shortcutText}><strong>Practice</strong><small>{words.length} vocabulary items · {sentences.length} sentences</small></span><ArrowRight size={16} /></button>
      <button onClick={() => onNavigate("progress")} style={shortcut}><Target size={19} /><span style={shortcutText}><strong>Progress</strong><small>See how far you've come</small></span><ArrowRight size={16} /></button>
    </div>
  </div>;
}

const shortcutText = { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, minWidth: 0, flex: 1, lineHeight: 1.35 };
const shortcut = { display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: 15, minHeight: 74, border: "1px solid #e4e0d5", borderRadius: 10, background: "#fffdf8", color: "#292d3d", font: "inherit", cursor: "pointer" };

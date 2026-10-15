import { BarChart3, Target, BookOpenCheck, Brain, TrendingUp, CircleHelp } from "lucide-react";
import { COLORS, cardShadow, EmptyNote } from "../theme";
import { summarizeProgress } from "../progress.js";
import { useState } from "react";
import { getRecentActivity, localDateKey, readDailyGoal, saveDailyGoal } from "../activity.js";

function Metric({ icon: Icon, label, value, note }) {
  return (
    <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.inkMuted, fontSize: 13, marginBottom: 10 }}>
        <Icon size={16} color={COLORS.margin} /> {label}
      </div>
      <div className="fvt-display" style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 700 }}>{value}</div>
      {note && <div style={{ color: COLORS.inkMuted, fontSize: 12, marginTop: 6 }}>{note}</div>}
    </div>
  );
}

function DailyGoalPanel({ activity }) {
  const [goal, setGoal] = useState(() => readDailyGoal());
  const todayKey = localDateKey();
  const today = activity?.[todayKey] || {};
  const attempts = Math.max(0, Number(today.attempts) || 0);
  const recent = getRecentActivity(activity, 7);
  const percent = Math.min(100, Math.round((attempts / goal) * 100));
  const changeGoal = (value) => setGoal(saveDailyGoal(value));

  return (
    <section style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 18, boxShadow: cardShadow }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3 className="fvt-display" style={{ fontSize: 22, margin: "0 0 4px" }}>Daily learning goal</h3>
          <p style={{ color: COLORS.inkMuted, margin: 0, fontSize: 14 }}>Practise a little every day. Activity is saved on this device.</p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          Daily target
          <select aria-label="Daily question target" value={goal} onChange={(event) => changeGoal(event.target.value)} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 10px", background: COLORS.page, color: COLORS.ink, fontSize: 16 }}>
            {[5, 10, 15, 20, 30, 40, 50, 75, 100].map((value) => <option key={value} value={value}>{value} questions</option>)}
          </select>
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginTop: 18, marginBottom: 8 }}>
        <strong>{attempts} / {goal} questions</strong>
        <span style={{ color: attempts >= goal ? COLORS.correct : COLORS.inkMuted, fontSize: 13, fontWeight: 600 }}>{attempts >= goal ? "Goal complete — bravo !" : `${goal - attempts} to go`}</span>
      </div>
      <div role="progressbar" aria-label="Daily learning goal" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(attempts, goal)} style={{ height: 10, borderRadius: 99, background: COLORS.border, overflow: "hidden" }}>
        <div style={{ width: `${percent}%`, height: "100%", background: attempts >= goal ? COLORS.correct : COLORS.margin, borderRadius: 99, transition: "width 180ms ease" }} />
      </div>
      <div style={{ marginTop: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Last 7 days</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8 }}>
          {recent.map((day) => {
            const maxAttempts = Math.max(goal, ...recent.map((item) => item.attempts));
            const height = day.attempts > 0 ? Math.max(8, Math.round((day.attempts / maxAttempts) * 54)) : 4;
            return <div key={day.date} style={{ minWidth: 0, textAlign: "center" }}>
              <div title={`${day.date}: ${day.attempts} attempts`} style={{ height: 58, display: "flex", alignItems: "flex-end", justifyContent: "center", borderRadius: 6, background: COLORS.page, padding: 3 }}>
                <div style={{ width: "100%", height, borderRadius: 4, background: day.date === todayKey ? COLORS.margin : COLORS.gold, opacity: day.attempts ? 1 : 0.35 }} />
              </div>
              <div style={{ fontSize: 11, color: COLORS.inkMuted, marginTop: 5 }}>{day.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{day.attempts}</div>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}

export default function ProgressDashboard({ words, sentences, activity = {} }) {
  const summary = summarizeProgress(words, sentences);
  const hasContent = summary.totalItems > 0;

  if (!hasContent) {
    return <div className="fvt-animate-in" style={{ display: "grid", gap: 16 }}><DailyGoalPanel activity={activity} /><EmptyNote text="Your vocabulary progress will appear here once you add vocabulary or sentence exercises to your notebook." /></div>;
  }

  return (
    <div className="fvt-animate-in" style={{ display: "grid", gap: 16 }}>
      <DailyGoalPanel activity={activity} />
      <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, boxShadow: cardShadow }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
          <BarChart3 size={23} color={COLORS.margin} />
          <h2 className="fvt-display" style={{ fontSize: 26, margin: 0 }}>Your learning progress</h2>
        </div>
        <p style={{ margin: 0, color: COLORS.inkMuted, lineHeight: 1.6 }}>
          A snapshot of your saved practice results. Accuracy is calculated from recorded answers, not time spent in the app.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: 10 }}>
        <Metric icon={Target} label="Accuracy" value={summary.accuracy == null ? "—" : `${summary.accuracy}%`} note={summary.totalAttempts ? `${summary.totalCorrect} correct of ${summary.totalAttempts} attempts` : "No attempts recorded yet"} />
        <Metric icon={BookOpenCheck} label="Items practised" value={summary.practiced} note={`of ${summary.totalItems} saved items`} />
        <Metric icon={Brain} label="Mastered" value={summary.mastered} note="3+ correct with at least 80% accuracy" />
        <Metric icon={TrendingUp} label="Total attempts" value={summary.totalAttempts} note={`${summary.totalIncorrect} incorrect answers`} />
      </div>

      <section style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 18 }}>
        <h3 className="fvt-display" style={{ fontSize: 21, margin: "0 0 14px" }}>Progress by section</h3>
        <div style={{ display: "grid", gap: 16 }}>
          {summary.categories.map((category) => (
            <div key={category.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 7 }}>
                <strong style={{ fontSize: 14 }}>{category.name}</strong>
                <span style={{ color: COLORS.inkMuted, fontSize: 13, whiteSpace: "nowrap" }}>
                  {category.accuracy == null ? "Not practised" : `${category.accuracy}% accuracy`} · {category.count} items
                </span>
              </div>
              <div role="progressbar" aria-label={category.name + " accuracy"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={category.accuracy ?? 0} style={{ height: 8, borderRadius: 99, background: COLORS.border, overflow: "hidden" }}>
                <div style={{ width: `${category.accuracy ?? 0}%`, height: "100%", background: COLORS.margin, borderRadius: 99, transition: "width 180ms ease" }} />
              </div>
              <div style={{ color: COLORS.inkMuted, fontSize: 12, marginTop: 5 }}>{category.attempts} recorded attempts</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <CircleHelp size={18} color={COLORS.margin} />
          <h3 className="fvt-display" style={{ fontSize: 21, margin: 0 }}>Words to revisit</h3>
        </div>
        <p style={{ color: COLORS.inkMuted, fontSize: 13, marginTop: 0, lineHeight: 1.5 }}>Items with at least one recorded attempt where incorrect answers equal or exceed correct answers.</p>
        {summary.needsPractice.length === 0 ? (
          <div style={{ padding: 12, borderRadius: 8, background: COLORS.page, color: COLORS.inkMuted, fontSize: 14 }}>No items in this focus list yet. Keep practising to build a useful picture.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {summary.needsPractice.map((item) => (
              <div key={item.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, overflowWrap: "anywhere" }}>{item.label}</div>
                  {item.detail && <div style={{ color: COLORS.inkMuted, fontSize: 13, overflowWrap: "anywhere" }}>{item.detail}</div>}
                  <div style={{ color: COLORS.inkMuted, fontSize: 12, marginTop: 3 }}>{item.kind}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, fontSize: 12, color: COLORS.inkMuted }}>
                  <div style={{ color: COLORS.ink, fontWeight: 700 }}>{item.correct} ✓</div>
                  <div>{item.incorrect} ✕</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

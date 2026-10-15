import { BarChart3, Target, BookOpenCheck, Brain, TrendingUp, CircleHelp } from "lucide-react";
import { COLORS, cardShadow, EmptyNote } from "../theme";
import { summarizeProgress } from "../progress.js";

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

export default function ProgressDashboard({ words, sentences }) {
  const summary = summarizeProgress(words, sentences);
  const hasContent = summary.totalItems > 0;

  if (!hasContent) {
    return <EmptyNote text="Your progress will appear here once you add vocabulary or sentence exercises to your notebook." />;
  }

  return (
    <div className="fvt-animate-in" style={{ display: "grid", gap: 16 }}>
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

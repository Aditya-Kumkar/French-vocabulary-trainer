import { useState, useEffect } from "react";
import { RotateCcw, ChevronRight } from "lucide-react";
import { COLORS, primaryBtnStyle, cardShadow, Mascot, EmptyNote } from "../theme";

const ROUND_SIZE = 6;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickRound(words) {
  const pool = shuffle(words).slice(0, Math.min(ROUND_SIZE, words.length));
  return {
    pairs: pool,
    left: shuffle(pool),
    right: shuffle(pool),
  };
}

export default function MatchGame({ words }) {
  const [round, setRound] = useState(null);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongFlash, setWrongFlash] = useState(null); // { left, right }
  const [mistakes, setMistakes] = useState(0);

  const startRound = () => {
    setRound(pickRound(words));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds(new Set());
    setWrongFlash(null);
    setMistakes(0);
  };

  useEffect(() => {
    if (!wrongFlash) return;
    const t = setTimeout(() => {
      setWrongFlash(null);
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 650);
    return () => clearTimeout(t);
  }, [wrongFlash]);

  const evaluate = (leftId, rightId) => {
    if (leftId === rightId) {
      setMatchedIds((prev) => new Set(prev).add(leftId));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setMistakes((m) => m + 1);
      setWrongFlash({ left: leftId, right: rightId });
    }
  };

  const tapLeft = (id) => {
    if (matchedIds.has(id) || wrongFlash) return;
    if (id === selectedLeft) {
      setSelectedLeft(null);
      return;
    }
    if (selectedRight !== null) evaluate(id, selectedRight);
    else setSelectedLeft(id);
  };

  const tapRight = (id) => {
    if (matchedIds.has(id) || wrongFlash) return;
    if (id === selectedRight) {
      setSelectedRight(null);
      return;
    }
    if (selectedLeft !== null) evaluate(selectedLeft, id);
    else setSelectedRight(id);
  };

  if (!words || words.length < 2) {
    return <EmptyNote text="You'll need at least a couple of words before you can play Match — add some in My Words." />;
  }

  if (!round) {
    return (
      <div style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
        <h2 className="fvt-display" style={{ fontSize: 21, fontWeight: 600, marginTop: 0 }}>
          Match the columns
        </h2>
        <p style={{ fontSize: 16, color: COLORS.inkMuted, marginTop: -6 }}>
          Tap an English word, then tap its French match. Each round picks {Math.min(ROUND_SIZE, words.length)} random words.
        </p>
        <button onClick={startRound} style={{ ...primaryBtnStyle, marginTop: 16, padding: "12px 22px", fontSize: 17 }}>
          Start round <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  const isComplete = matchedIds.size === round.pairs.length;

  if (isComplete) {
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
          Round complete
        </div>
        <div className="fvt-display" style={{ fontSize: 30, fontWeight: 600, margin: "6px 0 16px", textAlign: "center" }}>
          {round.pairs.length} matched{mistakes > 0 ? ` · ${mistakes} slip${mistakes !== 1 ? "s" : ""}` : ""}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button onClick={startRound} style={primaryBtnStyle}>
            <RotateCcw size={15} /> Play again
          </button>
        </div>
      </div>
    );
  }

  const chipStyle = (id, isLeft) => {
    const matched = matchedIds.has(id);
    const selected = isLeft ? selectedLeft === id : selectedRight === id;
    const wrong = wrongFlash && (isLeft ? wrongFlash.left === id : wrongFlash.right === id);
    return {
      padding: "12px 14px",
      borderRadius: 8,
      border: `1.5px solid ${wrong ? COLORS.margin : selected ? COLORS.gold : matched ? COLORS.correct : COLORS.border}`,
      background: wrong ? COLORS.errorBg : matched ? COLORS.correctBg : selected ? COLORS.goldBg : COLORS.page,
      boxShadow: matched ? "none" : cardShadow,
      cursor: matched ? "default" : "pointer",
      opacity: matched ? 0.55 : 1,
      fontSize: 16,
      textAlign: "center",
      transition: "all 0.15s ease",
      userSelect: "none",
    };
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: 14, color: COLORS.inkMuted }}>
        <span className="fvt-mono">
          {matchedIds.size} of {round.pairs.length} matched
        </span>
        {mistakes > 0 && <span className="fvt-mono">{mistakes} slip{mistakes !== 1 ? "s" : ""}</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {round.left.map((w) => (
            <div key={w.id} onClick={() => tapLeft(w.id)} style={chipStyle(w.id, true)}>
              {w.english}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {round.right.map((w) => (
            <div
              key={w.id}
              onClick={() => tapRight(w.id)}
              style={{ ...chipStyle(w.id, false), fontStyle: "italic", color: matchedIds.has(w.id) ? COLORS.correct : COLORS.margin }}
            >
              {w.french}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

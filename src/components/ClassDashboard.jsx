import { useState } from "react";
import { Plus, Trash2, Pencil, Check, ListPlus, Users } from "lucide-react";
import { COLORS, inputStyle, primaryBtnStyle, secondaryBtnStyle, iconBtnStyle, Field, EmptyNote } from "../theme";

export default function ClassDashboard({ classWords, onAdd, onBulkAdd, onEdit, onDelete }) {
  const [mode, setMode] = useState("single");
  const [english, setEnglish] = useState("");
  const [french, setFrench] = useState("");
  const [hindi, setHindi] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setEnglish("");
    setFrench("");
    setHindi("");
    setEditingId(null);
    setError("");
  };

  const startEdit = (w) => {
    setEditingId(w.id);
    setEnglish(w.english);
    setFrench(w.french);
    setHindi(w.hindi);
    setMode("single");
    setError("");
  };

  const submitSingle = async () => {
    if (!english.trim() || !french.trim() || !hindi.trim()) {
      setError("Fill in all three fields — English, French, and the Hindi pronunciation.");
      return;
    }
    setBusy(true);
    try {
      if (editingId) {
        await onEdit(editingId, { english: english.trim(), french: french.trim(), hindi: hindi.trim() });
      } else {
        await onAdd({ english: english.trim(), french: french.trim(), hindi: hindi.trim() });
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Couldn't save that word — try again.");
    } finally {
      setBusy(false);
    }
  };

  const submitBulk = async () => {
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    const parsed = [];
    for (const line of lines) {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length !== 3 || parts.some((p) => !p)) {
        setError(`This line isn't in "english | french | hindi" format: "${line}"`);
        return;
      }
      parsed.push({ english: parts[0], french: parts[1], hindi: parts[2] });
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
      setError(err.message || "Couldn't save those words — try again.");
    } finally {
      setBusy(false);
    }
  };

  const deleteWord = async (id) => {
    setConfirmDeleteId(null);
    await onDelete(id);
  };

  return (
    <div className="fvt-animate-in">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: COLORS.goldBg,
          border: `1px solid ${COLORS.gold}`,
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 18,
          fontSize: 14,
          color: COLORS.ink,
        }}
      >
        <Users size={16} color={COLORS.gold} />
        Words added here go out to <strong>everyone's</strong> practice list — not just yours.
      </div>

      <div style={{ background: COLORS.page, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18, marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 className="fvt-display" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            {editingId ? "Edit class word" : "Add class words"}
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <Field label="English">
                <input value={english} onChange={(e) => setEnglish(e.target.value)} style={inputStyle} placeholder="e.g. friend" />
              </Field>
              <Field label="French">
                <input value={french} onChange={(e) => setFrench(e.target.value)} style={inputStyle} placeholder="e.g. ami" />
              </Field>
            </div>
            <Field label="Hindi pronunciation">
              <input
                value={hindi}
                onChange={(e) => setHindi(e.target.value)}
                style={{ ...inputStyle, fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                placeholder="e.g. आमी"
              />
            </Field>
            {error && <div style={{ color: COLORS.margin, fontSize: 14, marginTop: 8 }}>{error}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={submitSingle} disabled={busy} style={primaryBtnStyle}>
                {editingId ? <Check size={15} /> : <Plus size={15} />} {editingId ? "Save changes" : "Add to class list"}
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
              One word per line, in the format <span className="fvt-mono">english | french | hindi</span> — paste this week's whole list at once.
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={6}
              style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}
              placeholder={"friend | ami | आमी\nhouse | maison | मेज़ों"}
            />
            {error && <div style={{ color: COLORS.margin, fontSize: 14, marginTop: 8 }}>{error}</div>}
            <button onClick={submitBulk} disabled={busy} style={{ ...primaryBtnStyle, marginTop: 12 }}>
              <Plus size={15} /> Add these to the class list
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <h2 className="fvt-display" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
          Class word list
        </h2>
        <span className="fvt-mono" style={{ fontSize: 13, color: COLORS.inkFaint }}>
          {classWords.length} total
        </span>
      </div>

      {classWords.length === 0 ? (
        <EmptyNote text="No class words yet. Add the first batch above — everyone will see them right away." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {classWords.map((w) => (
            <div
              key={w.id}
              style={{
                background: COLORS.page,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600 }}>{w.english}</span>
                  <span style={{ color: COLORS.inkFaint }}>—</span>
                  <span style={{ fontStyle: "italic", color: COLORS.margin }}>{w.french}</span>
                  <span className="fvt-devanagari" style={{ color: COLORS.inkMuted, fontSize: 16 }}>
                    {w.hindi}
                  </span>
                </div>
              </div>
              {confirmDeleteId === w.id ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 13, color: COLORS.inkMuted }}>Remove for everyone?</span>
                  <button onClick={() => deleteWord(w.id)} style={{ ...iconBtnStyle, color: COLORS.margin }}>
                    Yes
                  </button>
                  <button onClick={() => setConfirmDeleteId(null)} style={iconBtnStyle}>
                    No
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => startEdit(w)} style={iconBtnStyle} aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setConfirmDeleteId(w.id)} style={iconBtnStyle} aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

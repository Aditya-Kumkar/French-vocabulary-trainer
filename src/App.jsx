import { useState, useEffect, useCallback } from "react";
import { Feather, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient";
import { COLORS, FONTS_CSS } from "./theme";
import Auth from "./components/Auth.jsx";
import WordsView from "./components/WordsView.jsx";
import PracticeView from "./components/PracticeView.jsx";

const DEFAULT_SETTINGS = { direction: "mixed", ignoreAccents: true, weakOnly: false };
const SETTINGS_KEY = "fvt-settings";

const DECOR_POSITIONS = [
  { left: "7%", top: "14%", rotate: "-6deg" },
  { left: "10%", top: "46%", rotate: "5deg" },
  { left: "6%", top: "78%", rotate: "-4deg" },
  { right: "6%", top: "20%", rotate: "6deg" },
  { right: "9%", top: "52%", rotate: "-5deg" },
  { right: "5%", top: "84%", rotate: "4deg" },
];

function SideDecor({ words }) {
  if (!words || words.length < 3) return null;
  const picks = words.slice(0, DECOR_POSITIONS.length);
  return (
    <>
      {picks.map((w, i) => {
        const pos = DECOR_POSITIONS[i];
        return (
          <div
            key={w.id}
            className="fvt-app-decor"
            style={{
              position: "fixed",
              ...pos,
              transform: `rotate(${pos.rotate})`,
              zIndex: 0,
              background: COLORS.page,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              padding: "10px 14px",
              boxShadow: "0 4px 10px rgba(32,38,58,0.10)",
              width: 148,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -9,
                left: "50%",
                transform: "translateX(-50%) rotate(-2deg)",
                width: 44,
                height: 15,
                background: "rgba(184,134,47,0.45)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
              }}
            />
            <div className="fvt-mono" style={{ fontSize: 11, color: COLORS.inkFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {w.english}
            </div>
            <div className="fvt-display" style={{ fontSize: 18, fontWeight: 600, color: COLORS.margin, fontStyle: "italic", margin: "2px 0" }}>
              {w.french}
            </div>
            <div className="fvt-devanagari" style={{ fontSize: 14, color: COLORS.inkMuted }}>
              {w.hindi}
            </div>
          </div>
        );
      })}
    </>
  );
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
@@ -145,85 +206,100 @@
  return (
    <div className="fvt-root fvt-seyes" style={{ position: "relative", minHeight: "100vh", color: COLORS.ink }}>
      <style>{FONTS_CSS}</style>
      <div className="fvt-page-rule" style={{ position: "fixed", top: 0, bottom: 0, left: 55, width: 0, borderLeft: `1.5px solid ${COLORS.margin}`, opacity: 0.35, zIndex: 0 }} />
      <div
        className="fvt-spiral"
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          width: 60,
          zIndex: 0,
          backgroundImage: `radial-gradient(circle at 21px 17px, ${COLORS.paper} 0 5px, ${COLORS.inkFaint}77 5px 6.5px, transparent 7px), linear-gradient(to right, rgba(32,38,58,0.07), transparent 75%)`,
          backgroundRepeat: "repeat-y, no-repeat",
          backgroundSize: "42px 34px, 100% 100%",
          backgroundPosition: "left top, left top",
        }}
      />
      <SideDecor words={words} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 64px", position: "relative", zIndex: 1 }}>
        <Header tab={tab} setTab={setTab} saveError={saveError} displayName={profile?.display_name} onSignOut={handleSignOut} />
        {wordsLoading ? (
          <div style={{ color: COLORS.inkMuted, fontSize: 16, padding: "20px 0" }}>Loading your words…</div>
        ) : tab === "practice" ? (
          <PracticeView words={words} settings={settings} setSettings={setSettings} onRecordAttempt={handleRecordAttempt} />
        ) : (
          <WordsView words={words} onAdd={handleAdd} onBulkAdd={handleBulkAdd} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

function Header({ tab, setTab, saveError, displayName, onSignOut }) {
  return (
    <div className="fvt-animate-in" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="fvt-mono" style={{ fontSize: 12, letterSpacing: "0.16em", color: COLORS.margin, textTransform: "uppercase", marginBottom: 4 }}>
            Cahier de vocabulaire
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Feather size={26} color={COLORS.margin} style={{ transform: "rotate(-25deg)" }} />
            <h1 className="fvt-display" style={{ fontSize: 32, fontStyle: "italic", fontWeight: 600, margin: 0 }}>
              French Vocabulary Trainer
            </h1>
          </div>
        </div>
        <button
          onClick={onSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: COLORS.inkMuted,
            background: "none",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: "6px 10px",
            cursor: "pointer",
            marginTop: 2,
          }}
        >
          <LogOut size={14} /> {displayName || "Sign out"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${COLORS.border}` }}>
        <TabButton label="Practice" active={tab === "practice"} onClick={() => setTab("practice")} />
        <TabButton label="My Words" active={tab === "words"} onClick={() => setTab("words")} />
      </div>
      {saveError && (
        <div style={{ marginTop: 10, fontSize: 14, color: COLORS.margin }}>
          Couldn't save your last change — check your connection and try again.
        </div>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        fontSize: 16,
        fontWeight: 600,
        background: "none",
        border: "none",
        borderBottom: active ? `2px solid ${COLORS.margin}` : "2px solid transparent",
        color: active ? COLORS.ink : COLORS.inkMuted,
        cursor: "pointer",
        marginBottom: -1,
      }}
    >
      {label}
    </button>
  );
}

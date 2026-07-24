import { useState, useEffect, useCallback } from "react";
import { Feather, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient";
import { COLORS, FONTS_CSS, cardShadow } from "./theme";
import Auth from "./components/Auth.jsx";
import WordsView from "./components/WordsView.jsx";
import PracticeView from "./components/PracticeView.jsx";

const DEFAULT_SETTINGS = { direction: "mixed", ignoreAccents: true, weakOnly: false };
const SETTINGS_KEY = "fvt-settings";

const DECOR_POSITIONS = [
  { left: "7%", top: "14%", rotate: "-6deg" },
  { left: "6%", top: "78%", rotate: "-4deg" },
  { right: "6%", top: "20%", rotate: "6deg" },
  { right: "5%", top: "84%", rotate: "4deg" },
];

function SideDecor({ words }) {
  if (!words || words.length < 2) return null;
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
              boxShadow: cardShadow,
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

function EiffelTowerDoodle({ style }) {
  return (
    <svg
      className="fvt-app-decor"
      viewBox="0 0 64 96"
      width="52"
      height="78"
      style={{ position: "fixed", zIndex: 0, opacity: 0.5, ...style }}
    >
      <g fill="none" stroke={COLORS.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 6 L26 34 L10 90 M32 6 L38 34 L54 90" />
        <path d="M20 34 H44" />
        <path d="M14 60 H50" />
        <path d="M10 90 H24 M40 90 H54" />
        <path d="M28 18 H36" />
      </g>
    </svg>
  );
}

function CroissantDoodle({ style }) {
  return (
    <svg
      className="fvt-app-decor"
      viewBox="0 0 80 50"
      width="66"
      height="42"
      style={{ position: "fixed", zIndex: 0, opacity: 0.6, ...style }}
    >
      <path
        d="M8 30 C10 10 35 4 50 10 C40 14 30 22 28 34 C42 28 58 22 68 26 C60 36 40 46 22 44 C12 42 6 38 8 30 Z"
        fill={COLORS.gold}
        stroke={COLORS.ink}
        strokeWidth="1.4"
        opacity="0.85"
      />
      <path d="M20 20 L26 26 M32 16 L38 22 M44 14 L50 20" stroke={COLORS.ink} strokeWidth="1.1" opacity="0.5" />
    </svg>
  );
}

function BeretDoodle({ style }) {
  return (
    <svg
      className="fvt-app-decor"
      viewBox="0 0 70 50"
      width="58"
      height="41"
      style={{ position: "fixed", zIndex: 0, opacity: 0.6, ...style }}
    >
      <ellipse cx="35" cy="30" rx="28" ry="14" fill={COLORS.margin} opacity="0.8" stroke={COLORS.ink} strokeWidth="1.4" />
      <ellipse cx="35" cy="26" rx="20" ry="9" fill="none" stroke={COLORS.ink} strokeWidth="1" opacity="0.35" />
      <circle cx="35" cy="12" r="3" fill={COLORS.ink} />
    </svg>
  );
}

function CultureDoodles() {
  return (
    <>
      <EiffelTowerDoodle style={{ left: "8%", top: "44%" }} />
      <CroissantDoodle style={{ right: "6%", top: "50%" }} />
      <BeretDoodle style={{ left: "4%", top: "94%" }} />
    </>
  );
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [profile, setProfile] = useState(null);
  const [words, setWords] = useState([]);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [tab, setTab] = useState("practice");
  const [settings, setSettingsState] = useState(loadSettings);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchWords = useCallback(async () => {
    setWordsLoading(true);
    const { data, error } = await supabase.from("words").select("*").order("created_at", { ascending: true });
    if (!error) setWords(data || []);
    setWordsLoading(false);
  }, []);

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase.from("profiles").select("display_name").eq("id", userId).single();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchWords();
      fetchProfile(session.user.id);
    } else {
      setWords([]);
      setProfile(null);
    }
  }, [session, fetchWords, fetchProfile]);

  const setSettings = (next) => {
    setSettingsState(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // non-fatal — settings just won't persist across visits
    }
  };

  const handleAdd = async (fields) => {
    const userId = session.user.id;
    const { data, error } = await supabase
      .from("words")
      .insert({ ...fields, user_id: userId, correct_count: 0, incorrect_count: 0 })
      .select()
      .single();
    if (error) throw error;
    setWords((prev) => [...prev, data]);
  };

  const handleBulkAdd = async (list) => {
    const userId = session.user.id;
    const rows = list.map((w) => ({ ...w, user_id: userId, correct_count: 0, incorrect_count: 0 }));
    const { data, error } = await supabase.from("words").insert(rows).select();
    if (error) throw error;
    setWords((prev) => [...prev, ...(data || [])]);
  };

  const handleEdit = async (id, fields) => {
    const { data, error } = await supabase.from("words").update(fields).eq("id", id).select().single();
    if (error) throw error;
    setWords((prev) => prev.map((w) => (w.id === id ? data : w)));
  };

  const handleDelete = async (id) => {
    const prev = words;
    setWords((p) => p.filter((w) => w.id !== id));
    const { error } = await supabase.from("words").delete().eq("id", id);
    if (error) setWords(prev); // revert on failure
  };

  const handleRecordAttempt = (wordId, correct) => {
    setWords((prev) =>
      prev.map((w) =>
        w.id === wordId
          ? {
              ...w,
              correct_count: w.correct_count + (correct ? 1 : 0),
              incorrect_count: w.incorrect_count + (correct ? 0 : 1),
            }
          : w
      )
    );
    const word = words.find((w) => w.id === wordId);
    if (!word) return;
    supabase
      .from("words")
      .update({
        correct_count: word.correct_count + (correct ? 1 : 0),
        incorrect_count: word.incorrect_count + (correct ? 0 : 1),
      })
      .eq("id", wordId)
      .then(({ error }) => setSaveError(!!error));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (session === undefined) {
    return (
      <div className="fvt-seyes" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.inkMuted }}>
        <style>{FONTS_CSS}</style>
        Opening your cahier…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fvt-root" style={{ minHeight: "100vh", color: COLORS.ink }}>
        <style>{FONTS_CSS}</style>
        <Auth />
      </div>
    );
  }

  return (
    <div className="fvt-root fvt-seyes" style={{ position: "relative", minHeight: "100vh", color: COLORS.ink }}>
      <style>{FONTS_CSS}</style>
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
      <CultureDoodles />
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

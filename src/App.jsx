import { useState, useEffect, useCallback } from "react";
import { Feather, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient";
import { COLORS, FONTS_CSS } from "./theme";
import Auth from "./components/Auth.jsx";
import WordsView from "./components/WordsView.jsx";
import PracticeView from "./components/PracticeView.jsx";

const DEFAULT_SETTINGS = { direction: "mixed", ignoreAccents: true, weakOnly: false };
const SETTINGS_KEY = "fvt-settings";

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
      <div style={{ background: COLORS.paper, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.inkMuted }}>
        <style>{FONTS_CSS}</style>
        Opening your cahier…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fvt-root" style={{ background: COLORS.paper, minHeight: "100vh", color: COLORS.ink }}>
        <style>{FONTS_CSS}</style>
        <Auth />
      </div>
    );
  }

  return (
    <div className="fvt-root" style={{ background: COLORS.paper, minHeight: "100vh", color: COLORS.ink }}>
      <style>{FONTS_CSS}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 64px" }}>
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

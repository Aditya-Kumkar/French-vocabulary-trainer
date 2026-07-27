import { useState, useEffect, useCallback } from "react";
import { Feather, LogOut, Users, BookOpen } from "lucide-react";
import { supabase } from "./supabaseClient";
import { COLORS, FONTS_CSS, cardShadow, Mascot } from "./theme";
import Auth from "./components/Auth.jsx";
import WordsView from "./components/WordsView.jsx";
import PracticeView from "./components/PracticeView.jsx";
import ClassDashboard from "./components/ClassDashboard.jsx";
import SentencesView from "./components/SentencesView.jsx";

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

function DoodleShadow({ cx, cy, rx, ry, id }) {
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="#000000" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} />
    </>
  );
}

function PineSprigDoodle({ style }) {
  const greenLight = "#6B8A62";
  const green = "#4C6A4A";
  const greenDark = "#2F4527";
  const brownLight = "#A47C54";
  const brown = "#8A6142";
  const brownDark = "#5F4128";
  return (
    <svg
      className="fvt-app-decor"
      viewBox="0 0 110 110"
      width="98"
      height="98"
      style={{ position: "fixed", zIndex: 0, filter: "drop-shadow(2px 6px 6px rgba(32,38,58,0.22))", ...style }}
    >
      <defs>
        <linearGradient id="pineNeedle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={greenLight} />
          <stop offset="100%" stopColor={greenDark} />
        </linearGradient>
        <radialGradient id="pineCone" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={brownLight} />
          <stop offset="70%" stopColor={brown} />
          <stop offset="100%" stopColor={brownDark} />
        </radialGradient>
      </defs>
      <DoodleShadow id="pineShadow" cx="55" cy="98" rx="42" ry="8" />
      <path d="M24 96 C26 68 36 44 56 24" stroke={green} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {[...Array(8)].map((_, i) => {
        const t = i / 7;
        const x = 24 + 32 * t;
        const y = 96 - 70 * t;
        const len = 20 - t * 6;
        return (
          <g key={i} stroke="url(#pineNeedle)" strokeWidth="2.4" strokeLinecap="round">
            <path d={`M${x} ${y} l ${-len} ${-len * 0.35}`} />
            <path d={`M${x} ${y} l ${len * 0.85} ${-len * 0.5}`} />
            <path d={`M${x} ${y} l ${-len * 0.5} ${len * 0.3}`} opacity="0.85" />
          </g>
        );
      })}
      <ellipse cx="30" cy="82" rx="9.5" ry="13" fill="url(#pineCone)" stroke={brownDark} strokeWidth="1" transform="rotate(-18 30 82)" />
      <ellipse cx="18" cy="64" rx="7.5" ry="10.5" fill="url(#pineCone)" stroke={brownDark} strokeWidth="1" transform="rotate(-25 18 64)" />
      <g stroke={brownDark} strokeWidth="0.6" opacity="0.5">
        <path d="M25 74 h10 M25 78 h10 M25 82 h10 M25 86 h10" />
      </g>
      <circle cx="56" cy="24" r="3.2" fill={greenLight} />
    </svg>
  );
}

function MapEiffelDoodle({ style }) {
  return (
    <svg
      className="fvt-app-decor"
      viewBox="0 0 110 110"
      width="94"
      height="94"
      style={{ position: "fixed", zIndex: 0, filter: "drop-shadow(2px 8px 8px rgba(32,38,58,0.25))", ...style, transform: "rotate(-5deg)" }}
    >
      <defs>
        <linearGradient id="mapPaperBack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F1E6C8" />
          <stop offset="100%" stopColor="#DCC9A0" />
        </linearGradient>
        <linearGradient id="mapPaperFront" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E7D6AC" />
          <stop offset="100%" stopColor="#CEB689" />
        </linearGradient>
        <linearGradient id="towerMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8A6A3C" />
          <stop offset="45%" stopColor="#C79A56" />
          <stop offset="100%" stopColor="#6E4F26" />
        </linearGradient>
      </defs>
      <DoodleShadow id="mapShadow" cx="45" cy="94" rx="38" ry="8" />
      <rect x="10" y="12" width="68" height="78" rx="3" fill="url(#mapPaperBack)" stroke="#8A7350" strokeWidth="1.4" transform="rotate(6 44 51)" />
      <rect x="20" y="18" width="68" height="78" rx="3" fill="url(#mapPaperFront)" stroke="#8A7350" strokeWidth="1.4" transform="rotate(-4 54 57)" />
      <g stroke={COLORS.margin} strokeWidth="1" opacity="0.55" transform="rotate(-4 54 57)">
        <path d="M28 34 Q50 22 74 38" fill="none" />
        <path d="M24 56 Q56 48 80 64" fill="none" />
        <path d="M30 74 Q52 68 70 80" fill="none" />
        <circle cx="46" cy="44" r="1.7" fill={COLORS.margin} stroke="none" />
        <circle cx="64" cy="58" r="1.7" fill={COLORS.margin} stroke="none" />
      </g>
      <text x="30" y="30" fontSize="6" fill="#7A5F38" fontFamily="serif" opacity="0.7" transform="rotate(-4 54 57)">
        FRANCE
      </text>
      <g stroke="url(#towerMetal)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M56 86 L49 60 L38 22 M56 86 L63 60 L74 22" />
        <path d="M45 60 H67" />
        <path d="M41 72 H71" />
        <path d="M38 22 H74" />
        <path d="M52 12 H60" />
        <path d="M44 46 L68 46" opacity="0.7" />
      </g>
    </svg>
  );
}

function BeretPinDoodle({ style }) {
  return (
    <svg
      className="fvt-app-decor"
      viewBox="0 0 100 78"
      width="88"
      height="68"
      style={{ position: "fixed", zIndex: 0, filter: "drop-shadow(2px 6px 6px rgba(32,38,58,0.22))", ...style }}
    >
      <defs>
        <radialGradient id="beretWool" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#D14A3E" />
          <stop offset="55%" stopColor={COLORS.margin} />
          <stop offset="100%" stopColor="#7A2119" />
        </radialGradient>
        <radialGradient id="pinShine" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FBEFC4" />
          <stop offset="55%" stopColor={COLORS.gold} />
          <stop offset="100%" stopColor="#8A6412" />
        </radialGradient>
      </defs>
      <DoodleShadow id="beretShadow" cx="50" cy="66" rx="38" ry="8" />
      <ellipse cx="50" cy="42" rx="40" ry="21" fill="url(#beretWool)" stroke="#5C1712" strokeWidth="1.6" />
      <ellipse cx="50" cy="35" rx="29" ry="13" fill="none" stroke="#5C1712" strokeWidth="1" opacity="0.4" />
      <circle cx="50" cy="16" r="3.3" fill="#5C1712" />
      <g transform="translate(64 48)">
        <circle r="7.5" fill="url(#pinShine)" stroke="#6E4E0E" strokeWidth="1" />
        <path d="M-3.5 0 L0 -3.5 L3.5 0 L0 3.5 Z" fill="#FBF3DD" />
      </g>
    </svg>
  );
}

function CroissantBasketDoodle({ style }) {
  return (
    <svg
      className="fvt-app-decor"
      viewBox="0 0 112 86"
      width="98"
      height="76"
      style={{ position: "fixed", zIndex: 0, filter: "drop-shadow(2px 6px 6px rgba(32,38,58,0.22))", ...style }}
    >
      <defs>
        <linearGradient id="basketWeave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C49A66" />
          <stop offset="100%" stopColor="#8C6A3E" />
        </linearGradient>
        <linearGradient id="croissantGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFC276" />
          <stop offset="60%" stopColor="#D9A24B" />
          <stop offset="100%" stopColor="#A87524" />
        </linearGradient>
        <linearGradient id="baguetteGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F0DDA9" />
          <stop offset="100%" stopColor="#D2AE71" />
        </linearGradient>
      </defs>
      <DoodleShadow id="basketShadow" cx="56" cy="80" rx="46" ry="9" />
      <path d="M12 44 h88 l-9 33 a7 7 0 0 1 -7 5.5 h-56 a7 7 0 0 1 -7 -5.5 Z" fill="url(#basketWeave)" stroke="#6B4E29" strokeWidth="1.6" />
      <g stroke="#6B4E29" strokeWidth="1" opacity="0.55">
        <path d="M18 50 h76 M16 58 h80 M20 66 h72 M24 74 h64" />
        <path d="M24 44 L18 79 M40 44 L36 80 M56 44 L56 80 M72 44 L76 80 M88 44 L94 79" opacity="0.35" />
      </g>
      <path d="M8 44 Q56 30 104 44" fill="none" stroke="#6B4E29" strokeWidth="2" />
      <path
        d="M24 46 C26 26 46 16 60 21 C50 26 40 33 38 44 C52 34 68 32 78 39 C68 44 56 50 50 46 C42 50 30 50 24 46 Z"
        fill="url(#croissantGold)"
        stroke="#8A5E1E"
        strokeWidth="1.3"
      />
      <g stroke="#8A5E1E" strokeWidth="0.7" opacity="0.6">
        <path d="M32 32 q6 4 4 10 M46 26 q6 3 5 9 M60 30 q5 3 4 8" />
      </g>
      <rect x="64" y="12" width="11" height="40" rx="4.5" fill="url(#baguetteGold)" stroke="#8A5E1E" strokeWidth="1.3" transform="rotate(12 69 32)" />
      <g stroke="#8A5E1E" strokeWidth="0.8" opacity="0.6" transform="rotate(12 69 32)">
        <path d="M66 18 l5 7 M66 27 l5 7 M66 36 l5 7" />
      </g>
    </svg>
  );
}

function GrapevineDoodle({ style }) {
  const grapeLight = "#9B7CAC";
  const grape = "#7B5C8C";
  const grapeDark = "#4C3758";
  const leaf = "#6B8A56";
  const leafDark = "#3F5230";
  return (
    <svg
      className="fvt-app-decor"
      viewBox="0 0 92 104"
      width="80"
      height="90"
      style={{ position: "fixed", zIndex: 0, filter: "drop-shadow(2px 6px 6px rgba(32,38,58,0.2))", ...style }}
    >
      <defs>
        <radialGradient id="grapeShine" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor={grapeLight} />
          <stop offset="65%" stopColor={grape} />
          <stop offset="100%" stopColor={grapeDark} />
        </radialGradient>
        <linearGradient id="vineLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={leaf} />
          <stop offset="100%" stopColor={leafDark} />
        </linearGradient>
      </defs>
      <DoodleShadow id="vineShadow" cx="42" cy="98" rx="34" ry="8" />
      <path d="M46 4 C48 22 44 34 39 46" stroke="#6B5334" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M44 18 C38 14 32 16 30 22" stroke="#6B5334" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path
        d="M39 22 C24 18 14 27 16 38 C27 33 34 28 39 22 Z"
        fill="url(#vineLeaf)"
        stroke={leafDark}
        strokeWidth="1.2"
      />
      <path d="M39 22 C32 26 24 30 18 34" stroke={leafDark} strokeWidth="0.7" fill="none" opacity="0.6" />
      {[
        [34, 52],
        [48, 52],
        [27, 63],
        [41, 63],
        [55, 63],
        [34, 74],
        [48, 74],
        [27, 85],
        [41, 85],
        [42, 94],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="7.8" fill="url(#grapeShine)" stroke={grapeDark} strokeWidth="0.8" />
      ))}
    </svg>
  );
}

function CultureDoodles() {
  return (
    <>
      <PineSprigDoodle style={{ left: "2%", top: "4%" }} />
      <MapEiffelDoodle style={{ right: "3%", top: "4%" }} />
      <BeretPinDoodle style={{ left: "1%", top: "66%" }} />
      <CroissantBasketDoodle style={{ left: "2%", top: "86%" }} />
      <GrapevineDoodle style={{ right: "4%", top: "66%" }} />
    </>
  );
}

function CornerMascot() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 14,
        right: 14,
        zIndex: 5,
        background: COLORS.page,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "50%",
        padding: 6,
        boxShadow: cardShadow,
      }}
      aria-hidden="true"
    >
      <Mascot size={38} />
    </div>
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
  const [classWords, setClassWords] = useState([]);
  const [sentences, setSentences] = useState([]);
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

  const fetchClassWords = useCallback(async () => {
    const { data: cw, error: cwErr } = await supabase.from("class_words").select("*").order("created_at", { ascending: true });
    if (cwErr) return;
    const { data: progress } = await supabase.from("class_word_progress").select("*");
    const progressMap = new Map((progress || []).map((p) => [p.class_word_id, p]));
    const merged = (cw || []).map((w) => {
      const p = progressMap.get(w.id);
      return {
        ...w,
        correct_count: p?.correct_count || 0,
        incorrect_count: p?.incorrect_count || 0,
        source: "class",
      };
    });
    setClassWords(merged);
  }, []);

  const fetchSentences = useCallback(async () => {
    const { data, error } = await supabase.from("sentences").select("*").order("created_at", { ascending: true });
    if (!error) setSentences(data || []);
  }, []);

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase.from("profiles").select("display_name, is_admin").eq("id", userId).single();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchWords();
      fetchClassWords();
      fetchSentences();
      fetchProfile(session.user.id);
    } else {
      setWords([]);
      setClassWords([]);
      setSentences([]);
      setProfile(null);
    }
  }, [session, fetchWords, fetchClassWords, fetchSentences, fetchProfile]);

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

  const handleRecordAttempt = (wordId, source, correct) => {
    if (source === "class") {
      setClassWords((prev) =>
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
      const word = classWords.find((w) => w.id === wordId);
      if (!word) return;
      supabase
        .from("class_word_progress")
        .upsert(
          {
            user_id: session.user.id,
            class_word_id: wordId,
            correct_count: word.correct_count + (correct ? 1 : 0),
            incorrect_count: word.incorrect_count + (correct ? 0 : 1),
          },
          { onConflict: "user_id,class_word_id" }
        )
        .then(({ error }) => setSaveError(!!error));
      return;
    }
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

  const handleClassAdd = async (fields) => {
    const { data, error } = await supabase.from("class_words").insert(fields).select().single();
    if (error) throw error;
    setClassWords((prev) => [...prev, { ...data, correct_count: 0, incorrect_count: 0, source: "class" }]);
  };

  const handleClassBulkAdd = async (list) => {
    const { data, error } = await supabase.from("class_words").insert(list).select();
    if (error) throw error;
    setClassWords((prev) => [...prev, ...(data || []).map((d) => ({ ...d, correct_count: 0, incorrect_count: 0, source: "class" }))]);
  };

  const handleClassEdit = async (id, fields) => {
    const { data, error } = await supabase.from("class_words").update(fields).eq("id", id).select().single();
    if (error) throw error;
    setClassWords((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
  };

  const handleClassDelete = async (id) => {
    const prev = classWords;
    setClassWords((p) => p.filter((w) => w.id !== id));
    const { error } = await supabase.from("class_words").delete().eq("id", id);
    if (error) setClassWords(prev);
  };

  const handleSentenceAdd = async (fields) => {
    const userId = session.user.id;
    const { data, error } = await supabase
      .from("sentences")
      .insert({ ...fields, user_id: userId, correct_count: 0, incorrect_count: 0 })
      .select()
      .single();
    if (error) throw error;
    setSentences((prev) => [...prev, data]);
  };

  const handleSentenceBulkAdd = async (list) => {
    const userId = session.user.id;
    const rows = list.map((s) => ({ ...s, user_id: userId, correct_count: 0, incorrect_count: 0 }));
    const { data, error } = await supabase.from("sentences").insert(rows).select();
    if (error) throw error;
    setSentences((prev) => [...prev, ...(data || [])]);
  };

  const handleSentenceEdit = async (id, fields) => {
    const { data, error } = await supabase.from("sentences").update(fields).eq("id", id).select().single();
    if (error) throw error;
    setSentences((prev) => prev.map((s) => (s.id === id ? data : s)));
  };

  const handleSentenceDelete = async (id) => {
    const prev = sentences;
    setSentences((p) => p.filter((s) => s.id !== id));
    const { error } = await supabase.from("sentences").delete().eq("id", id);
    if (error) setSentences(prev);
  };

  const handleSentenceRecordAttempt = (sentenceId, correct) => {
    setSentences((prev) =>
      prev.map((s) =>
        s.id === sentenceId
          ? {
              ...s,
              correct_count: s.correct_count + (correct ? 1 : 0),
              incorrect_count: s.incorrect_count + (correct ? 0 : 1),
            }
          : s
      )
    );
    const sentence = sentences.find((s) => s.id === sentenceId);
    if (!sentence) return;
    supabase
      .from("sentences")
      .update({
        correct_count: sentence.correct_count + (correct ? 1 : 0),
        incorrect_count: sentence.incorrect_count + (correct ? 0 : 1),
      })
      .eq("id", sentenceId)
      .then(({ error }) => setSaveError(!!error));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (session === undefined) {
    return (
      <div className="fvt-seyes" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.inkMuted }}>
        <style>{FONTS_CSS}</style>
        <CornerMascot />
        Opening your cahier…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fvt-root" style={{ minHeight: "100vh", color: COLORS.ink }}>
        <style>{FONTS_CSS}</style>
        <CornerMascot />
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
      <CornerMascot />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 64px", position: "relative", zIndex: 1 }}>
        <Header tab={tab} setTab={setTab} saveError={saveError} displayName={profile?.display_name} onSignOut={handleSignOut} isAdmin={!!profile?.is_admin} />
        {wordsLoading ? (
          <div style={{ color: COLORS.inkMuted, fontSize: 16, padding: "20px 0" }}>Loading your words…</div>
        ) : tab === "practice" ? (
          <PracticeView
            words={[...words.map((w) => ({ ...w, source: "personal" })), ...classWords]}
            settings={settings}
            setSettings={setSettings}
            onRecordAttempt={handleRecordAttempt}
          />
        ) : tab === "class" ? (
          <ClassDashboard
            classWords={classWords}
            onAdd={handleClassAdd}
            onBulkAdd={handleClassBulkAdd}
            onEdit={handleClassEdit}
            onDelete={handleClassDelete}
          />
        ) : tab === "sentences" ? (
          <SentencesView
            sentences={sentences}
            onAdd={handleSentenceAdd}
            onBulkAdd={handleSentenceBulkAdd}
            onEdit={handleSentenceEdit}
            onDelete={handleSentenceDelete}
            onRecordAttempt={handleSentenceRecordAttempt}
          />
        ) : (
          <WordsView words={words} classWords={classWords} onAdd={handleAdd} onBulkAdd={handleBulkAdd} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

function Header({ tab, setTab, saveError, displayName, onSignOut, isAdmin }) {
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
        <TabButton
          label={
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <BookOpen size={14} /> Sentences
            </span>
          }
          active={tab === "sentences"}
          onClick={() => setTab("sentences")}
        />
        {isAdmin && (
          <TabButton
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Users size={14} /> Class Dashboard
              </span>
            }
            active={tab === "class"}
            onClick={() => setTab("class")}
          />
        )}
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

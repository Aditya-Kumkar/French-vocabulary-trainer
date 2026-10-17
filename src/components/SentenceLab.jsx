import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Languages, RotateCcw, XCircle } from "lucide-react";
import { COLORS, cardShadow } from "../theme";
import { VERIFIED_SENTENCES, findVerifiedSentence } from "../sentenceBank.js";
import { generateExercises, isAnswerCorrect } from "../sentenceGenerator.js";
import { supabase } from "../supabaseClient.js";

const HISTORY_KEY = "fvt-sentence-lab-history";
const MODES = [
  { id: "mcq", label: "Choose the translation" },
  { id: "blank", label: "Fill the blank" },
  { id: "translation", label: "Translate it" },
  { id: "builder", label: "Build the sentence" },
];

function readHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}"); } catch { return {}; }
}

export default function SentenceLab({ onRecordAttempt = () => {} }) {
  const [english, setEnglish] = useState("");
  const [sentence, setSentence] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [builtWords, setBuiltWords] = useState([]);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(readHistory);
  const [completed, setCompleted] = useState(false);
  const [communitySentences, setCommunitySentences] = useState([]);
  const [communityEnglish, setCommunityEnglish] = useState("");
  const [communityFrench, setCommunityFrench] = useState("");
  const [communityStatus, setCommunityStatus] = useState("");
  const [communityLoading, setCommunityLoading] = useState(false);
  const exercise = exercises[index];

  useEffect(() => {
    let active = true;
    supabase.from("community_sentences").select("id, english, french, created_at").order("created_at", { ascending: false }).limit(200)
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) {
          setCommunityStatus("Shared contributions are not available yet. The database migration may need to be applied.");
          return;
        }
        setCommunitySentences((data || []).map((item) => ({
          id: "community-" + item.id, level: "A1", english: item.english, french: item.french,
          focus: "community", explanation: "Shared by the French learning community."
        })));
      });
    return () => { active = false; };
  }, []);

  const submitCommunitySentence = async (event) => {
    event.preventDefault();
    setCommunityStatus("");
    const en = communityEnglish.trim();
    const fr = communityFrench.trim();
    if (!en || !fr) { setCommunityStatus("Add both the English sentence and its French translation."); return; }
    if (en.length > 240 || fr.length > 240) { setCommunityStatus("Keep each sentence under 240 characters."); return; }
    setCommunityLoading(true);
    try {
      const { data, error: saveError } = await supabase.from("community_sentences")
        .insert({ english: en, french: fr }).select("id, english, french, created_at").single();
      if (saveError) throw saveError;
      const pair = { id: "community-" + data.id, level: "A1", english: data.english, french: data.french, focus: "community", explanation: "Shared by the French learning community." };
      setCommunitySentences((current) => [pair, ...current.filter((item) => item.id !== pair.id)]);
      setCommunityEnglish("");
      setCommunityFrench("");
      setCommunityStatus("Added to the shared bank — everyone using the app can now see it.");
    } catch (err) {
      setCommunityStatus(err.message || "Could not share this sentence. Please try again.");
    } finally {
      setCommunityLoading(false);
    }
  };

  const orderedTiles = useMemo(() => {
    if (exercise?.kind !== "builder") return [];
    return exercise.words.map((word, tileIndex) => ({ word, tileIndex }));
  }, [exercise]);

  const resetPractice = (pair) => {
    setSentence(pair);
    const prior = history[pair.id]?.modes || {};
    const generated = generateExercises(pair);
    generated.sort((a, b) => {
      const score = (item) => {
        const stats = prior[item.kind];
        if (!stats || (stats.correct + stats.incorrect) === 0) return -1;
        return stats.correct / (stats.correct + stats.incorrect);
      };
      return score(a) - score(b);
    });
    setExercises(generated);
    setIndex(0);
    setResponse("");
    setBuiltWords([]);
    setChecked(false);
    setCompleted(false);
    setError("");
  };

  const chooseVerified = (pair) => {
    setEnglish(pair.english);
    resetPractice(pair);
  };

  const makeSentence = () => {
    const value = english.trim();
    if (!value) { setError("Write a short English sentence first."); return; }
    if (value.length > 240) { setError("Keep the sentence under 240 characters."); return; }
    const verified = findVerifiedSentence(value);
    if (verified) { resetPractice(verified); return; }
    setError("That sentence is not in our verified beginner bank yet. Choose an example below so you can practise with a checked translation.");
  };

  const check = () => {
    if (!exercise || checked) return;
    const answer = exercise.kind === "builder" ? builtWords : response;
    if (exercise.kind !== "builder" && !String(response).trim()) return;
    if (exercise.kind === "builder" && builtWords.length !== exercise.words.length) return;
    const correct = isAnswerCorrect(answer, exercise);
    setChecked(true);
    onRecordAttempt(correct);
    const nextHistory = { ...history };
    const previous = nextHistory[sentence.id] || { correct: 0, incorrect: 0, modes: {} };
    const modes = { ...previous.modes, [exercise.kind]: { ...(previous.modes?.[exercise.kind] || {}), correct: (previous.modes?.[exercise.kind]?.correct || 0) + (correct ? 1 : 0), incorrect: (previous.modes?.[exercise.kind]?.incorrect || 0) + (correct ? 0 : 1) } };
    nextHistory[sentence.id] = { correct: previous.correct + (correct ? 1 : 0), incorrect: previous.incorrect + (correct ? 0 : 1), modes };
    setHistory(nextHistory);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory)); } catch { /* Practice still works without storage. */ }
  };

  const next = () => {
    if (index + 1 >= exercises.length) { setCompleted(true); return; }
    setIndex((value) => value + 1);
    setResponse("");
    setBuiltWords([]);
    setChecked(false);
  };

  const restart = () => { if (sentence) resetPractice(sentence); };
  const addTile = (tile) => {
    if (checked || builtWords.includes(tile.tileIndex)) return;
    setBuiltWords((current) => [...current, tile.tileIndex]);
  };
  const removeTile = (tileIndex) => {
    if (!checked) setBuiltWords((current) => current.filter((value) => value !== tileIndex));
  };
  const builtAnswer = builtWords.map((tileIndex) => exercise?.words?.[tileIndex] ?? "").join(" ");
  const isCorrect = checked && isAnswerCorrect(exercise.kind === "builder" ? builtAnswer : response, exercise);

  return (
    <div className="fvt-animate-in" style={{ display: "grid", gap: 16 }}>
      <div>
        <div className="fvt-mono" style={{ color: COLORS.margin, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>ENGLISH FIRST · A1</div>
        <h2 className="fvt-display" style={{ fontSize: 28, margin: "5px 0" }}>Sentence practice lab</h2>
        <p style={{ color: COLORS.inkMuted, lineHeight: 1.6, margin: 0 }}>Practise with checked English–French sentence pairs, then try four short exercises. We only use translations reviewed for this beginner bank.</p>
      </div>

      <section style={cardStyle}>
        <label htmlFor="sentence-english" style={{ display: "block", fontWeight: 650, marginBottom: 8 }}>Your English sentence</label>
        <textarea id="sentence-english" value={english} onChange={(event) => setEnglish(event.target.value)} maxLength={240} rows={2} placeholder="e.g. I am going to school." style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12, font: "inherit", background: COLORS.page, color: COLORS.ink, resize: "vertical" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <span style={{ color: COLORS.inkMuted, fontSize: 12 }}>{english.length}/240 characters · Checked sentences only</span>
          <button onClick={makeSentence} disabled={!english.trim()} style={primaryButton}>Create practice <ArrowRight size={15} /></button>
        </div>
        {error && <p role="alert" style={{ color: COLORS.margin, fontSize: 14, lineHeight: 1.5, marginBottom: 0 }}>{error}</p>}
      </section>

      {!sentence && <section style={cardStyle}>
        <h3 className="fvt-display" style={{ fontSize: 21, margin: "0 0 6px" }}>Try a verified sentence</h3>
        <p style={{ color: COLORS.inkMuted, marginTop: 0, lineHeight: 1.5 }}>Choose a checked beginner sentence to generate four practice activities.</p>
        <div style={{ display: "grid", gap: 8 }}>
          {[...communitySentences, ...VERIFIED_SENTENCES].slice(0, 30).map((item) => <button key={item.id} onClick={() => chooseVerified(item)} style={sentenceButton}><span><strong>{item.english}</strong><span style={{ display: "block", color: COLORS.inkMuted, fontSize: 13, marginTop: 3 }}>{item.french}</span>{item.focus === "community" && <span style={{ display: "block", color: COLORS.correct, fontSize: 11, marginTop: 4 }}>COMMUNITY SHARED</span>}</span><ArrowRight size={16} /></button>)}
        </div>
      </section>}

      <section style={cardStyle}>
        <h3 className="fvt-display" style={{ fontSize: 21, margin: "0 0 6px" }}>Add to the shared sentence bank</h3>
        <p style={{ color: COLORS.inkMuted, lineHeight: 1.5, marginTop: 0 }}>Contribute an English–French pair. Once saved, it becomes visible to everyone using this app.</p>
        <form onSubmit={submitCommunitySentence} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 5, fontWeight: 600, fontSize: 14 }}>English sentence
            <textarea value={communityEnglish} onChange={(event) => setCommunityEnglish(event.target.value)} maxLength={240} rows={2} placeholder="e.g. My sister likes music." style={communityInputStyle} />
          </label>
          <label style={{ display: "grid", gap: 5, fontWeight: 600, fontSize: 14 }}>French translation
            <textarea value={communityFrench} onChange={(event) => setCommunityFrench(event.target.value)} maxLength={240} rows={2} placeholder="e.g. Ma sœur aime la musique." style={communityInputStyle} />
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={communityLoading || !communityEnglish.trim() || !communityFrench.trim()} style={{ ...primaryButton, opacity: communityLoading || !communityEnglish.trim() || !communityFrench.trim() ? 0.55 : 1 }}>{communityLoading ? "Sharing…" : "Share with everyone"} <ArrowRight size={15} /></button>
          </div>
          {communityStatus && <p role="status" style={{ color: communityStatus.startsWith("Added") ? COLORS.correct : COLORS.margin, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{communityStatus}</p>}
        </form>
      </section>

      {sentence && !completed && exercise && <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
          <span className="fvt-mono" style={{ fontSize: 11, color: COLORS.margin }}>PRACTICE {index + 1} OF {exercises.length}</span>
          <span style={{ fontSize: 12, color: COLORS.inkMuted }}>{MODES.find((item) => item.id === exercise.kind)?.label}</span>
        </div>
        <div style={{ height: 4, borderRadius: 8, background: COLORS.border, overflow: "hidden", marginBottom: 18 }}><div style={{ height: "100%", width: `${((index + 1) / exercises.length) * 100}%`, background: COLORS.margin }} /></div>
        <h3 className="fvt-display" style={{ fontSize: 23, margin: "0 0 8px" }}>{exercise.instruction}</h3>
        <p style={{ fontSize: 18, lineHeight: 1.6, margin: "0 0 16px" }}>{exercise.prompt}</p>

        {exercise.kind === "mcq" && <div style={{ display: "grid", gap: 8 }}>{exercise.options.map((option) => <button key={option} disabled={checked} onClick={() => setResponse(option)} style={optionButton(response === option, checked && option === exercise.answer)}>{option}</button>)}</div>}
        {(exercise.kind === "blank" || exercise.kind === "translation") && <input value={response} onChange={(event) => setResponse(event.target.value)} disabled={checked} onKeyDown={(event) => { if (event.key === "Enter" && !checked) check(); }} placeholder={exercise.kind === "blank" ? "Type the missing word…" : "Write the French translation…"} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12, font: "inherit", background: COLORS.page, color: COLORS.ink }} />}
        {exercise.kind === "builder" && <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, minHeight: 52, alignContent: "center", padding: 10, borderRadius: 8, background: COLORS.page, border: `1px dashed ${COLORS.border}` }}>
            {builtWords.length === 0 && <span style={{ color: COLORS.inkMuted, fontSize: 13 }}>Tap words below in the correct order.</span>}
            {builtWords.map((tileIndex) => <button key={tileIndex} disabled={checked} onClick={() => removeTile(tileIndex)} style={tileButton}>{exercise.words[tileIndex]} ×</button>)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{orderedTiles.map((tile) => <button key={tile.tileIndex} disabled={checked || builtWords.includes(tile.tileIndex)} onClick={() => addTile(tile)} style={{ ...tileButton, opacity: builtWords.includes(tile.tileIndex) ? 0.4 : 1 }}>{tile.word}</button>)}</div>
        </div>}

        {checked && <div role="status" style={{ marginTop: 16, padding: 14, borderRadius: 8, border: `1px solid ${isCorrect ? COLORS.correct : COLORS.border}`, background: COLORS.page, lineHeight: 1.55 }}>
          <strong style={{ display: "flex", alignItems: "center", gap: 7 }}>{isCorrect ? <CheckCircle2 size={17} color={COLORS.correct} /> : <XCircle size={17} color={COLORS.margin} />}{isCorrect ? "Correct ! Bien joué." : "Not quite — let’s learn from it."}</strong>
          <p style={{ margin: "8px 0 4px", fontWeight: 650 }}>{sentence.french}</p>
          <p style={{ margin: 0, color: COLORS.inkMuted, fontSize: 14 }}>{exercise.explanation}</p>
        </div>}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          {!checked ? <button onClick={check} disabled={(exercise.kind === "builder" ? builtWords.length !== exercise.words.length : !response.trim())} style={{ ...primaryButton, opacity: (exercise.kind === "builder" ? builtWords.length !== exercise.words.length : !response.trim()) ? 0.5 : 1 }}>Check answer <ArrowRight size={15} /></button> : <button onClick={next} style={primaryButton}>{index + 1 === exercises.length ? "Finish session" : "Next question"} <ArrowRight size={15} /></button>}
        </div>
      </section>}

      {completed && sentence && <section style={{ ...cardStyle, textAlign: "center" }}>
        <CheckCircle2 size={40} color={COLORS.correct} />
        <h3 className="fvt-display" style={{ fontSize: 26, margin: "10px 0 6px" }}>Small steps, real progress.</h3>
        <p style={{ color: COLORS.inkMuted, lineHeight: 1.6 }}>You practised one sentence in four ways. Try another sentence, or repeat this one to strengthen recall.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <button onClick={restart} style={secondaryButton}><RotateCcw size={15} /> Repeat sentence</button>
          <button onClick={() => { setSentence(null); setExercises([]); setCompleted(false); setEnglish(""); }} style={primaryButton}>Choose another</button>
        </div>
      </section>}

      {sentence && <p style={{ color: COLORS.inkMuted, fontSize: 13, textAlign: "center" }}>Sentence source: {sentence.source === "ai-assisted" ? "AI-assisted translation — check it with your teacher" : "verified beginner sentence bank"}</p>}
    </div>
  );
}

const communityInputStyle = { width: "100%", boxSizing: "border-box", border: "1px solid #dcd9ca", borderRadius: 8, padding: 12, font: "inherit", background: "#fffdf8", color: "#20263a", resize: "vertical" };

const cardStyle = { background: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 18, boxShadow: cardShadow, display: "grid", gap: 10 };
const primaryButton = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: "none", borderRadius: 7, padding: "11px 14px", background: COLORS.margin, color: "#fff", fontWeight: 650, fontSize: 14, cursor: "pointer" };
const secondaryButton = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "10px 14px", background: "transparent", color: COLORS.ink, fontWeight: 600, cursor: "pointer" };
const sentenceButton = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", textAlign: "left", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12, background: COLORS.page, color: COLORS.ink, cursor: "pointer" };
const optionButton = (selected, correct) => ({ textAlign: "left", border: `1px solid ${correct ? COLORS.correct : selected ? COLORS.margin : COLORS.border}`, borderRadius: 8, padding: 12, background: selected ? COLORS.page : COLORS.paper, color: COLORS.ink, cursor: "pointer", font: "inherit" });
const tileButton = { border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 11px", background: COLORS.paper, color: COLORS.ink, cursor: "pointer", font: "inherit" };

import { normalizeSentenceText } from "./sentenceBank.js";

const MODES = ["mcq", "blank", "translation", "builder"];

function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function tokenizeFrench(sentence) {
  return String(sentence).match(/[^\s]+/g) ?? [];
}

export function generateExercises(sentence, { random = Math.random } = {}) {
  if (!sentence?.english?.trim() || !sentence?.french?.trim()) {
    throw new TypeError("A sentence needs both English and French text.");
  }
  const tokens = tokenizeFrench(sentence.french);
  if (tokens.length < 2) throw new TypeError("The French sentence needs at least two words.");
  const distractors = [
    ...new Set([
      "Je suis étudiant.", "J'ai vingt ans.", "Je parle français.",
      "Je vais à l'école.", "C'est ma sœur.", "J'aime la musique.",
      "Où allez-vous ?", "Ce sont mes amis.", "Je ne parle pas français."
    ].filter((item) => normalizeSentenceText(item) !== normalizeSentenceText(sentence.french)))
  ];
  const choices = shuffle([sentence.french, ...shuffle(distractors, random).slice(0, 3)], random);
  const blankIndex = Math.max(0, Math.min(tokens.length - 1, Math.floor(random() * tokens.length)));
  const blankAnswer = tokens[blankIndex];
  const blankPrompt = [...tokens];
  blankPrompt[blankIndex] = "_____";
  return [
    {
      id: `${sentence.id ?? "custom"}:mcq`, kind: "mcq", prompt: sentence.english,
      instruction: "Choose the French sentence that means this.", options: choices,
      answer: sentence.french, explanation: sentence.explanation || "Compare the French sentence with its English meaning."
    },
    {
      id: `${sentence.id ?? "custom"}:blank`, kind: "blank", prompt: blankPrompt.join(" "),
      instruction: "Fill the missing word or short phrase.", answer: blankAnswer,
      acceptedAnswers: [blankAnswer], english: sentence.english,
      explanation: sentence.explanation || `The complete sentence is: ${sentence.french}`
    },
    {
      id: `${sentence.id ?? "custom"}:translation`, kind: "translation", prompt: sentence.english,
      instruction: "Translate this sentence into French.", answer: sentence.french,
      acceptedAnswers: [sentence.french], explanation: sentence.explanation || "Check the model translation and notice its word order."
    },
    {
      id: `${sentence.id ?? "custom"}:builder`, kind: "builder", prompt: sentence.english,
      instruction: "Arrange the word tiles to build the French sentence.", words: shuffle(tokens, random),
      answer: tokens, answerText: sentence.french,
      explanation: sentence.explanation || "Check the complete sentence and its word order."
    }
  ];
}

export function buildAdaptiveSession(sentencePairs, { count = 4, performance = {}, random = Math.random } = {}) {
  const pool = (sentencePairs ?? []).filter((item) => item?.english?.trim() && item?.french?.trim());
  if (!pool.length) return [];
  const ranked = pool.map((item) => ({
    item,
    priority: Number(performance[item.id]?.incorrect ?? 0) * 3 - Number(performance[item.id]?.correct ?? 0)
  }));
  ranked.sort((a, b) => b.priority - a.priority);
  const top = ranked.slice(0, Math.min(ranked.length, Math.max(1, Number(count) || 4)));
  const chosen = shuffle(top, random).map(({ item }) => item);
  const session = chosen.flatMap((item) => generateExercises(item, { random }));
  return shuffle(session, random).slice(0, Math.max(1, Math.min(8, Number(count) || 4)));
}

export function isAnswerCorrect(response, exercise) {
  const normalize = (value) => normalizeSentenceText(value).replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
  if (exercise.kind === "builder") {
    const words = Array.isArray(response) ? response.join(" ") : String(response ?? "");
    return normalize(words) === normalize(exercise.answer.join(" "));
  }
  if (exercise.kind === "mcq") return normalize(response) === normalize(exercise.answer);
  return normalize(response) !== "" && (exercise.acceptedAnswers ?? [exercise.answer]).some((answer) => normalize(response) === normalize(answer));
}

export function createExerciseSession(sentencePairs, { count = 5, performance = {}, random = Math.random } = {}) {
  const valid = (sentencePairs ?? []).filter((item) => item?.english?.trim() && item?.french?.trim());
  if (!valid.length) return [];
  const ranked = valid.map((item) => ({ item, score: (performance[item.id]?.incorrect ?? 0) * 2 - (performance[item.id]?.correct ?? 0) }));
  ranked.sort((a, b) => b.score - a.score);
  const picked = shuffle(ranked.slice(0, Math.min(ranked.length, Math.max(1, count))).map(({ item }) => item), random);
  const modes = shuffle(MODES, random);
  return picked.map((sentence, index) => {
    const exercises = generateExercises(sentence, { random });
    return exercises.find((exercise) => exercise.kind === modes[index % modes.length]) ?? exercises[0];
  }).slice(0, Math.max(1, Math.min(8, count)));
}

export function normalizeExamAnswer(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function buildExamQuestions(words = [], sentences = [], count = 10, random = Math.random) {
  const pool = [
    ...words
      .filter((word) => word?.id != null && word.french && word.english)
      .map((word) => ({
        id: `word:${word.source || "personal"}:${word.id}`,
        kind: "word",
        sourceId: word.id,
        source: word.source || "personal",
        prompt: word.english,
        promptLabel: "Translate into French",
        answer: word.french,
        explanation: `${word.french} — ${word.english}`,
      })),
    ...sentences
      .filter((sentence) => sentence?.id != null && sentence.french_sentence?.includes("___") && sentence.answer)
      .map((sentence) => ({
        id: `sentence:${sentence.id}`,
        kind: "sentence",
        sourceId: sentence.id,
        prompt: sentence.french_sentence,
        promptLabel: "Complete the French sentence",
        answer: sentence.answer,
        explanation: sentence.english_translation || sentence.french_sentence.replace("___", sentence.answer),
      })),
  ];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.max(0, Math.min(Number(count) || 0, pool.length)));
}

export function gradeExamAnswer(response, expected) {
  const normalizedResponse = normalizeExamAnswer(response);
  const acceptedAnswers = String(expected ?? "").split("|").map(normalizeExamAnswer).filter(Boolean);
  return normalizedResponse.length > 0 && acceptedAnswers.includes(normalizedResponse);
}

export function formatTimeRemaining(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(safeSeconds / 60).toString().padStart(2, "0")}:${(safeSeconds % 60).toString().padStart(2, "0")}`;
}

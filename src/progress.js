function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function summarizeProgress(words = [], sentences = []) {
  const items = [
    ...words.map((item) => ({
      id: `word:${item.source || "personal"}:${item.id}`,
      label: item.french || item.english || "Untitled word",
      detail: item.english || "",
      kind: item.source === "class" ? "Class vocabulary" : "My vocabulary",
      correct: number(item.correct_count),
      incorrect: number(item.incorrect_count),
    })),
    ...sentences.map((item) => ({
      id: `sentence:${item.id}`,
      label: item.answer || item.french_sentence || "Untitled sentence",
      detail: item.english_translation || "",
      kind: "Sentences",
      correct: number(item.correct_count),
      incorrect: number(item.incorrect_count),
    })),
  ];
  const totalCorrect = items.reduce((sum, item) => sum + item.correct, 0);
  const totalIncorrect = items.reduce((sum, item) => sum + item.incorrect, 0);
  const totalAttempts = totalCorrect + totalIncorrect;
  const practiced = items.filter((item) => totalAttemptsFor(item) > 0).length;
  const mastered = items.filter((item) => item.correct >= 3 && item.correct / Math.max(1, totalAttemptsFor(item)) >= 0.8).length;
  const needsPractice = items
    .filter((item) => totalAttemptsFor(item) > 0 && item.incorrect >= item.correct)
    .sort((a, b) => (b.incorrect - b.correct) - (a.incorrect - a.correct) || b.incorrect - a.incorrect)
    .slice(0, 5);
  const categories = ["My vocabulary", "Class vocabulary", "Sentences"].map((name) => {
    const group = items.filter((item) => item.kind === name);
    const correct = group.reduce((sum, item) => sum + item.correct, 0);
    const incorrect = group.reduce((sum, item) => sum + item.incorrect, 0);
    return { name, count: group.length, attempts: correct + incorrect, accuracy: correct + incorrect ? Math.round((correct / (correct + incorrect)) * 100) : null };
  });
  return {
    totalItems: items.length,
    totalAttempts,
    totalCorrect,
    totalIncorrect,
    accuracy: totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : null,
    practiced,
    mastered,
    needsPractice,
    categories,
  };
}

function totalAttemptsFor(item) {
  return item.correct + item.incorrect;
}

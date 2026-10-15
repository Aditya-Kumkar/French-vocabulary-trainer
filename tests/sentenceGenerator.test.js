import test from "node:test";
import assert from "node:assert/strict";
import { VERIFIED_SENTENCES, findVerifiedSentence } from "../src/sentenceBank.js";
import { generateExercises, createExerciseSession, isAnswerCorrect } from "../src/sentenceGenerator.js";

const fixedRandom = () => 0.42;

test("verified sentence bank has unique IDs and bilingual content", () => {
  assert.ok(VERIFIED_SENTENCES.length >= 12);
  assert.equal(new Set(VERIFIED_SENTENCES.map((item) => item.id)).size, VERIFIED_SENTENCES.length);
  for (const item of VERIFIED_SENTENCES) {
    assert.ok(item.english.trim());
    assert.ok(item.french.trim());
    assert.ok(item.explanation.trim());
  }
});

test("verified lookup matches case and terminal punctuation safely", () => {
  assert.equal(findVerifiedSentence("  MY NAME IS ADITYA  ")?.id, "greeting-name");
  assert.equal(findVerifiedSentence("not in bank"), null);
});

test("each bilingual pair generates all four requested exercise formats", () => {
  const exercises = generateExercises(VERIFIED_SENTENCES[0], { random: fixedRandom });
  assert.deepEqual(exercises.map((item) => item.kind), ["mcq", "blank", "translation", "builder"]);
  assert.ok(exercises.every((item) => item.explanation.length > 0));
  assert.equal(exercises[0].options.length, 4);
  assert.ok(exercises[1].prompt.includes("_____"));
  assert.equal(exercises[2].answer, VERIFIED_SENTENCES[0].french);
  assert.equal(exercises[3].answerText, VERIFIED_SENTENCES[0].french);
});

test("answer checker validates MCQ, blank, translation and builder answers", () => {
  const exercises = generateExercises(VERIFIED_SENTENCES[0], { random: fixedRandom });
  assert.equal(isAnswerCorrect(exercises[0].answer, exercises[0]), true);
  assert.equal(isAnswerCorrect("wrong", exercises[0]), false);
  assert.equal(isAnswerCorrect(exercises[1].answer, exercises[1]), true);
  assert.equal(isAnswerCorrect(exercises[2].answer, exercises[2]), true);
  assert.equal(isAnswerCorrect(exercises[3].answer, exercises[3]), true);
  assert.equal(isAnswerCorrect(["wrong"], exercises[3]), false);
});

test("short adaptive sessions are capped and prioritize weaker sentences", () => {
  const session = createExerciseSession(VERIFIED_SENTENCES, { count: 5, performance: { "greeting-name": { incorrect: 4 } }, random: fixedRandom });
  assert.equal(session.length, 5);
  assert.ok(session.some((item) => item.id.startsWith("greeting-name:")));
  assert.ok(session.every((item) => ["mcq", "blank", "translation", "builder"].includes(item.kind)));
  assert.deepEqual(createExerciseSession([], { count: 5 }), []);
});

test("generator rejects missing bilingual text", () => {
  assert.throws(() => generateExercises({ english: "Hello", french: "" }), /both English and French/);
});

test("typed French answers accept omitted accents while showing the canonical spelling", () => {
  const exercises = generateExercises(VERIFIED_SENTENCES.find((item) => item.id === "go-school"), { random: fixedRandom });
  const blank = exercises.find((item) => item.kind === "blank");
  const translation = exercises.find((item) => item.kind === "translation");
  assert.equal(isAnswerCorrect("ecole", { ...blank, answer: "école", acceptedAnswers: ["école"] }), true);
  assert.equal(isAnswerCorrect("Je vais a l'ecole", translation), true);
  assert.equal(isAnswerCorrect("Je vais à l'école.", translation), true);
});

test("answer normalization handles common French ligatures", () => {
  const translation = { kind: "translation", answer: "C'est ma sœur.", acceptedAnswers: ["C'est ma sœur."] };
  assert.equal(isAnswerCorrect("C'est ma soeur", translation), true);
});

import test from "node:test";
import assert from "node:assert/strict";
import { buildExamQuestions, formatTimeRemaining, gradeExamAnswer, normalizeExamAnswer } from "../src/exam.js";

test("exam builder combines valid vocabulary and sentence questions", () => {
  const questions = buildExamQuestions(
    [{ id: 1, english: "apple", french: "pomme", source: "personal" }],
    [{ id: 2, french_sentence: "Je ___ au marché.", answer: "vais", english_translation: "I go to the market." }],
    10,
    () => 0.5
  );
  assert.equal(questions.length, 2);
  assert.deepEqual(new Set(questions.map((question) => question.kind)), new Set(["word", "sentence"]));
});

test("exam builder ignores invalid entries and respects the requested count", () => {
  const words = [
    { id: 1, english: "apple", french: "pomme" },
    { id: 2, english: "", french: "aller" },
    { english: "hello", french: "bonjour" },
  ];
  assert.equal(buildExamQuestions(words, [], 1, () => 0).length, 1);
  assert.equal(buildExamQuestions(words, [], 0, () => 0).length, 0);
});

test("grading ignores case, whitespace, and French diacritics", () => {
  assert.equal(gradeExamAnswer("  ÉTUDIANT ", "étudiant"), true);
  assert.equal(gradeExamAnswer("j'aime", "J’aime"), true);
  assert.equal(gradeExamAnswer("", "bonjour"), false);
  assert.equal(gradeExamAnswer("bonjour!", "bonjour"), false);
});

test("grading supports explicit alternate answers separated by a pipe", () => {
  assert.equal(gradeExamAnswer("vais", "va | vais"), true);
  assert.equal(gradeExamAnswer("va", "va | vais"), true);
});

test("time display is stable and clamps negative values", () => {
  assert.equal(formatTimeRemaining(0), "00:00");
  assert.equal(formatTimeRemaining(125), "02:05");
  assert.equal(formatTimeRemaining(-5), "00:00");
});

test("answer normalization is safe for nullish input", () => {
  assert.equal(normalizeExamAnswer(null), "");
});

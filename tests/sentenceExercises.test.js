import test from "node:test";
import assert from "node:assert/strict";
import { SENTENCE_EXERCISES, normalizeSentence, checkSentenceOrder } from "../src/sentenceExercises.js";

test("sentence curriculum covers core beginner sentence patterns", () => {
  const ids = SENTENCE_EXERCISES.map((exercise) => exercise.id);
  for (const id of ["introductions", "etre", "avoir", "negation", "questions", "adjectives"]) {
    assert.ok(ids.includes(id), `Missing sentence pattern: ${id}`);
  }
});

test("every exercise has a valid word bank, solution, translation and explanation", () => {
  for (const exercise of SENTENCE_EXERCISES) {
    assert.equal(exercise.words.length, exercise.answer.length, exercise.id);
    assert.deepEqual([...exercise.words].sort(), [...exercise.answer].sort(), exercise.id);
    assert.ok(exercise.translation.length > 0, exercise.id);
    assert.ok(exercise.explanation.length > 10, exercise.id);
    assert.ok(exercise.rule.length > 20, exercise.id);
  }
});

test("sentence checker accepts correct order and rejects incorrect order", () => {
  const exercise = SENTENCE_EXERCISES.find((item) => item.id === "negation");
  assert.equal(checkSentenceOrder(exercise.answer, exercise), true);
  assert.equal(checkSentenceOrder(["Je", "parle", "ne", "pas", "français."], exercise), false);
});

test("sentence normalization handles curly apostrophes, spaces and case", () => {
  assert.equal(normalizeSentence("J’ai   vingt ans ."), "j'ai vingt ans.");
});

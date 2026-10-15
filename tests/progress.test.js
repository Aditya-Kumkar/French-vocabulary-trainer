import test from "node:test";
import assert from "node:assert/strict";
import { summarizeProgress } from "../src/progress.js";

test("summarizes attempts and overall accuracy", () => {
  const summary = summarizeProgress([
    { id: 1, english: "apple", french: "pomme", correct_count: 3, incorrect_count: 1 },
    { id: 2, english: "bread", french: "pain", correct_count: 1, incorrect_count: 3 },
  ], [{ id: 3, answer: "vais", correct_count: 2, incorrect_count: 0 }]);
  assert.equal(summary.totalItems, 3);
  assert.equal(summary.totalAttempts, 10);
  assert.equal(summary.totalCorrect, 6);
  assert.equal(summary.totalIncorrect, 4);
  assert.equal(summary.accuracy, 60);
  assert.equal(summary.practiced, 3);
});

test("finds mastered items and orders a small focus list", () => {
  const summary = summarizeProgress([
    { id: 1, english: "apple", french: "pomme", correct_count: 8, incorrect_count: 1 },
    { id: 2, english: "bread", french: "pain", correct_count: 1, incorrect_count: 4 },
    { id: 3, english: "water", french: "eau", correct_count: 0, incorrect_count: 0 },
  ], []);
  assert.equal(summary.mastered, 1);
  assert.equal(summary.needsPractice.length, 1);
  assert.equal(summary.needsPractice[0].label, "pain");
});

test("handles empty data without inventing accuracy", () => {
  const summary = summarizeProgress([], []);
  assert.equal(summary.totalItems, 0);
  assert.equal(summary.totalAttempts, 0);
  assert.equal(summary.accuracy, null);
  assert.equal(summary.categories.every((category) => category.accuracy === null), true);
});

test("separates personal, class, and sentence categories", () => {
  const summary = summarizeProgress([
    { id: 1, english: "hello", french: "bonjour", source: "personal", correct_count: 1 },
    { id: 1, english: "thanks", french: "merci", source: "class", correct_count: 1 },
  ], [{ id: 1, answer: "suis", correct_count: 1 }]);
  assert.deepEqual(summary.categories.map((category) => category.count), [1, 1, 1]);
});

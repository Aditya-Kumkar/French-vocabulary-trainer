import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getDueWords, nextReview, readReviewSchedule, reviewKey, REVIEW_STORAGE_KEY, saveReviewResult } from "../src/revision.js";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 0, 1);

describe("spaced repetition schedule", () => {
  it("treats new words as due and excludes future reviews", () => {
    const words = [{ id: 1 }, { id: 2, source: "class" }];
    const schedule = { "personal:2": { dueAt: NOW + DAY } };
    assert.deepEqual(getDueWords(words, schedule, NOW), [words[0], words[1]]);
    assert.deepEqual(getDueWords(words, { "personal:1": { dueAt: NOW + DAY }, "class:2": { dueAt: NOW + DAY } }, NOW), []);
  });

  it("schedules correct answers for one day, then three days, then a longer interval", () => {
    const first = nextReview(null, true, NOW);
    assert.equal(first.intervalDays, 1);
    assert.equal(first.dueAt, NOW + DAY);
    const second = nextReview(first, true, NOW + DAY);
    assert.equal(second.intervalDays, 3);
    const third = nextReview(second, true, NOW + 4 * DAY);
    assert.ok(third.intervalDays > second.intervalDays);
  });

  it("brings an incorrect answer back in ten minutes and resets repetitions", () => {
    const result = nextReview({ repetitions: 4, intervalDays: 12, ease: 2.4 }, false, NOW);
    assert.equal(result.repetitions, 0);
    assert.equal(result.intervalDays, 0);
    assert.equal(result.dueAt, NOW + 10 * 60 * 1000);
  });

  it("uses source plus word ID to keep personal and class words separate", () => {
    assert.equal(reviewKey({ id: 7 }), "personal:7");
    assert.equal(reviewKey({ id: 7, source: "class" }), "class:7");
  });

  it("persists results and safely handles malformed storage", () => {
    const data = new Map();
    const storage = {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, value),
    };
    saveReviewResult({ id: 9 }, true, storage, NOW);
    assert.equal(JSON.parse(data.get(REVIEW_STORAGE_KEY))["personal:9"].dueAt, NOW + DAY);
    assert.deepEqual(readReviewSchedule({ getItem: () => "not json" }), {});
  });
});

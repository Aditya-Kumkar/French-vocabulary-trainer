import test from "node:test";
import assert from "node:assert/strict";
import { LEARNING_TOPICS } from "../src/learningTopics.js";

test("curriculum includes all requested French beginner topics", () => {
  const ids = LEARNING_TOPICS.map((topic) => topic.id);
  for (const id of ["articles", "possessives", "demonstratives", "numbers", "colours", "body", "weekdays", "months"]) {
    assert.ok(ids.includes(id), `Missing topic: ${id}`);
  }
});

test("every topic has a lesson, examples, and valid quiz questions", () => {
  for (const topic of LEARNING_TOPICS) {
    assert.ok(topic.lesson.length > 30, topic.id);
    assert.ok(topic.examples.length >= 3, topic.id);
    assert.ok(topic.questions.length >= 3, `${topic.id}: expected at least three questions`);
    if (topic.id === "articles") assert.ok(topic.questions.length >= 15, "articles: expected an expanded bulk practice set");
    for (const question of topic.questions) {
      assert.ok(question.options.includes(question.answer), `${topic.id}: answer must be one of the options`);
      assert.ok(question.explain.length > 0, `${topic.id}: missing explanation`);
    }
  }
});

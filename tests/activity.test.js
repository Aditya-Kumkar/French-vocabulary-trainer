import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_DAILY_GOAL,
  getRecentActivity,
  localDateKey,
  readDailyGoal,
  recordActivityAttempt,
  saveDailyGoal,
} from "../src/activity.js";

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem(key) { return Object.hasOwn(data, key) ? data[key] : null; },
    setItem(key, value) { data[key] = String(value); },
    data,
  };
}

test("localDateKey uses local calendar date with zero-padded fields", () => {
  assert.equal(localDateKey(new Date(2026, 0, 4, 12)), "2026-01-04");
});

test("recordActivityAttempt increments attempts and the correct outcome", () => {
  const first = recordActivityAttempt({}, true, "2026-10-15");
  const second = recordActivityAttempt(first, false, "2026-10-15");
  assert.deepEqual(second["2026-10-15"], { attempts: 2, correct: 1, incorrect: 1 });
  assert.deepEqual(first, { "2026-10-15": { attempts: 1, correct: 1, incorrect: 0 } });
});

test("daily goal defaults safely and clamps saved values", () => {
  const storage = fakeStorage();
  assert.equal(readDailyGoal(storage), DEFAULT_DAILY_GOAL);
  assert.equal(saveDailyGoal(0, storage), 1);
  assert.equal(readDailyGoal(storage), 1);
  assert.equal(saveDailyGoal(250, storage), 100);
  assert.equal(readDailyGoal(storage), 100);
});

test("recent activity returns seven calendar days and zero-fills missing days", () => {
  const days = getRecentActivity({ "2026-10-15": { attempts: 4, correct: 3, incorrect: 1 } }, 7, new Date(2026, 9, 15, 12));
  assert.equal(days.length, 7);
  assert.equal(days[6].date, "2026-10-15");
  assert.equal(days[6].attempts, 4);
  assert.equal(days[0].attempts, 0);
});

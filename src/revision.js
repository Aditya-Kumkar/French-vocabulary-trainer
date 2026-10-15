export const REVIEW_STORAGE_KEY = "fvt-spaced-repetition-v1";

export function getDueWords(words, schedule = {}, now = Date.now()) {
  return words.filter((word) => {
    const key = reviewKey(word);
    const review = schedule[key];
    return !review || !Number.isFinite(review.dueAt) || review.dueAt <= now;
  });
}

export function reviewKey(word) {
  return `${word.source || "personal"}:${word.id}`;
}

// A lightweight SM-2-inspired schedule. Incorrect answers return soon; correct
// answers earn progressively longer intervals. Times are injected for testability.
export function nextReview(review, correct, now = Date.now()) {
  const previous = review || { repetitions: 0, intervalDays: 0, ease: 2.5 };
  const ease = correct
    ? Math.max(1.3, previous.ease + 0.1)
    : Math.max(1.3, previous.ease - 0.2);

  if (!correct) {
    return {
      repetitions: 0,
      intervalDays: 0,
      ease,
      dueAt: now + 10 * 60 * 1000,
      lastReviewedAt: now,
    };
  }

  const repetitions = previous.repetitions + 1;
  const intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.max(1, previous.intervalDays * ease);
  return {
    repetitions,
    intervalDays,
    ease,
    dueAt: now + intervalDays * 24 * 60 * 60 * 1000,
    lastReviewedAt: now,
  };
}

export function readReviewSchedule(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(REVIEW_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveReviewResult(word, correct, storage = globalThis.localStorage, now = Date.now()) {
  try {
    const schedule = readReviewSchedule(storage);
    const key = reviewKey(word);
    schedule[key] = nextReview(schedule[key], correct, now);
    storage?.setItem(REVIEW_STORAGE_KEY, JSON.stringify(schedule));
    return schedule[key];
  } catch {
    // Scheduling is a convenience; a storage failure must not block practice.
    return null;
  }
}

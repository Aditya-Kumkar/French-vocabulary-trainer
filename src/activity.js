export const ACTIVITY_STORAGE_KEY = "fvt-daily-activity";
export const DAILY_GOAL_STORAGE_KEY = "fvt-daily-goal";
export const DEFAULT_DAILY_GOAL = 10;

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readActivity(storage) {
  try {
    const raw = (storage ?? globalThis.localStorage).getItem(ACTIVITY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function recordActivityAttempt(activity, correct, dateKey = localDateKey()) {
  const previous = activity?.[dateKey] || {};
  return {
    ...activity,
    [dateKey]: {
      attempts: Math.max(0, Number(previous.attempts) || 0) + 1,
      correct: Math.max(0, Number(previous.correct) || 0) + (correct ? 1 : 0),
      incorrect: Math.max(0, Number(previous.incorrect) || 0) + (correct ? 0 : 1),
    },
  };
}

export function saveActivity(activity, storage) {
  try {
    (storage ?? globalThis.localStorage).setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
    return true;
  } catch {
    return false;
  }
}

export function readDailyGoal(storage) {
  try {
    const raw = (storage ?? globalThis.localStorage).getItem(DAILY_GOAL_STORAGE_KEY);
    if (raw == null) return DEFAULT_DAILY_GOAL;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.min(100, Math.max(1, Math.round(value))) : DEFAULT_DAILY_GOAL;
  } catch {
    return DEFAULT_DAILY_GOAL;
  }
}

export function saveDailyGoal(goal, storage) {
  const numericGoal = Number(goal);
  const safeGoal = Number.isFinite(numericGoal)
    ? Math.min(100, Math.max(1, Math.round(numericGoal)))
    : DEFAULT_DAILY_GOAL;
  try {
    (storage ?? globalThis.localStorage).setItem(DAILY_GOAL_STORAGE_KEY, String(safeGoal));
  } catch {
    // Keep the chosen goal usable for the current render if storage is unavailable.
  }
  return safeGoal;
}

export function getRecentActivity(activity, days = 7, now = new Date()) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - index - 1));
    const key = localDateKey(date);
    const record = activity?.[key] || {};
    return {
      date: key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      attempts: Math.max(0, Number(record.attempts) || 0),
      correct: Math.max(0, Number(record.correct) || 0),
      incorrect: Math.max(0, Number(record.incorrect) || 0),
    };
  });
}

 export type ScoreWeights = {
  wDue?: number;       // weight for "is due"
  wWeak?: number;      // weight for weakness (1 - emaAccuracy)
  wRecency?: number;   // weight for recency since last seen
  wCoverage?: number;  // weight for topic coverage deficit
  D?: number;          // days to normalise recency (e.g., 30)
  epsilon?: number;    // max random noise added to break ties
};

export type QuestionCandidate = {
  nextDueAt: Date | string | number;   // when it's due again
  lastSeenAt?: Date | string | number; // when it was last shown (optional)
  emaAccuracy: number;                  // 0..1 (higher = better)
  topicDeficitNorm: number;            // 0..1 (higher = needs more coverage)
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/**
 * Compute a priority score for a question.
 * Higher score = should show sooner.
 */
export function computeQuestionScore(
  q: QuestionCandidate,
  now: Date = new Date(),
  weights: ScoreWeights = {}
): number {
  const {
    wDue = 3,
    wWeak = 2,
    wRecency = 1,
    wCoverage = 1,
    D = 30,          // normalise recency over 30 days
    epsilon = 0.05,  // small tie-breaker noise
  } = weights;

  const nowMs = now.valueOf();

  const nextDueMs =
    typeof q.nextDueAt === "number"
      ? q.nextDueAt
      : new Date(q.nextDueAt).valueOf();

  const lastSeenMs =
    q.lastSeenAt == null
      ? undefined
      : typeof q.lastSeenAt === "number"
      ? q.lastSeenAt
      : new Date(q.lastSeenAt).valueOf();

  // is_due: 1 if past due (or due now), else 0
  const isDue = nextDueMs <= nowMs ? 1 : 0;

  // weakness term: 1 - emaAccuracy (bounded 0..1)
  const weak = clamp01(1 - q.emaAccuracy);

  // recency: days since last seen / D (0..1). If never seen, treat as max.
  const daysSince =
    lastSeenMs == null ? D : Math.max(0, (nowMs - lastSeenMs) / (1000 * 60 * 60 * 24));
  const recency = clamp01(daysSince / D);

  // coverage deficit already provided 0..1
  const coverage = clamp01(q.topicDeficitNorm);

  // tiny random noise so ties don’t cause loops
  const noise = Math.random() * epsilon;

  const score = wDue * isDue + wWeak * weak + wRecency * recency + wCoverage * coverage + noise;
  return score;
}

// sm2.ts

export type Sm2State = {
  easeFactor: number;   // EF, usually starts at 2.5; min 1.3
  repetitions: number;  // consecutive correct answers
  intervalDays: number; // previous interval (days), 0 if new
};

export type Sm2Update = Sm2State & {
  nextDueAt: Date;      // when it should be shown next
};

/**
 * Update SM-2 state given a 0..5 grade.
 * grade >= 3 = correct; grade < 3 = wrong
 * EF floor = 1.3
 * intervals: 1d (1st correct), 6d (2nd), else round(prev * EF)
 */
export function updateSm2(
  prev: Sm2State,
  grade: number,
  now: Date = new Date()
): Sm2Update {
  // clamp grade to 0..5
  const g = Math.max(0, Math.min(5, Math.trunc(grade)));

  // update EF (SuperMemo formula)
  // EF' = max(1.3, EF + 0.1 - (5 - g) * (0.08 + (5 - g) * 0.02))
  const delta = 0.1 - (5 - g) * (0.08 + (5 - g) * 0.02);
  let EF = Math.max(1.3, (prev.easeFactor ?? 2.5) + delta);

  let reps = prev.repetitions ?? 0;
  let interval = prev.intervalDays ?? 0;

  if (g >= 3) {
    // correct
    reps += 1;
    if (reps === 1) {
      interval = 1;
    } else if (reps === 2) {
      interval = 6;
    } else {
      interval = Math.max(1, Math.round(interval * EF));
    }
  } else {
    // wrong → reset reps, interval = 0 (review again today)
    reps = 0;
    interval = 0;
    // (EF already adjusted by formula; don’t drop below 1.3)
  }

  const nextDueAt = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    easeFactor: EF,
    repetitions: reps,
    intervalDays: interval,
    nextDueAt,
  };
}

// progress.ts

export type ProgressState = {
  answered: number;     // total attempts
  correct: number;      // total correct
  avgTimeMs?: number;   // rolling average time; optional
  mastery: number;      // 0..100 for UI bar
  lastSeenAt?: Date;
};

/** Update rolling average time (plain mean). */
function updateAvgTime(prev: number | undefined, nPrev: number, newTime?: number): number | undefined {
  if (newTime == null) return prev;
  if (!prev || nPrev <= 0) return newTime;
  return Math.round((prev * nPrev + newTime) / (nPrev + 1));
}

/** Clamp helper. */
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/**
 * Tapered step update:
 * - Small steps that shrink as attempts grow.
 * - Correct: +stepUp, Wrong: -stepDown (both capped).
 */
export function updateProgressTapered(
  prev: ProgressState,
  wasCorrect: boolean,
  timeMs?: number,
  now: Date = new Date()
): ProgressState {
  const answered = prev.answered + 1;
  const correct = prev.correct + (wasCorrect ? 1 : 0);

  // Steps shrink as attempts increase (so bars don’t yo-yo)
  // Correct bump: max 8%, min 2%
  const stepUp = clamp(20 / (1 + prev.answered / 5), 2, 8);
  // Wrong penalty: max 6%, min 2%
  const stepDown = clamp(12 / (1 + prev.answered / 5), 2, 6);

  let mastery = prev.mastery ?? 0;
  mastery = wasCorrect ? mastery + stepUp : mastery - stepDown;
  mastery = clamp(mastery, 0, 100);

  const avgTimeMs = updateAvgTime(prev.avgTimeMs, prev.answered, timeMs);

  return {
    answered,
    correct,
    avgTimeMs,
    mastery,
    lastSeenAt: now,
  };
}

/**
 * Beta-style mastery (evidence-based):
 * mastery = 100 * ( (1 + correct) / (2 + answered) )
 * Use this if you prefer a probabilistic feel over manual steps.
 */
export function computeMasteryBeta(answered: number, correct: number): number {
  const alpha = 1 + correct;
  const beta = 1 + (answered - correct);
  return Math.round(100 * (alpha / (alpha + beta)));
}

/** Same as tapered update, but overwrite mastery using Beta after incrementing counts. */
export function updateProgressBeta(
  prev: ProgressState,
  wasCorrect: boolean,
  timeMs?: number,
  now: Date = new Date()
): ProgressState {
  const answered = prev.answered + 1;
  const correct = prev.correct + (wasCorrect ? 1 : 0);
  const avgTimeMs = updateAvgTime(prev.avgTimeMs, prev.answered, timeMs);
  const mastery = computeMasteryBeta(answered, correct);
  return { answered, correct, avgTimeMs, mastery, lastSeenAt: now };
}

/** Stage mapping for UI labels. Tune thresholds as you like. */
export function stageFromMastery(state: ProgressState): "unseen" | "in_progress" | "mastered" {
  if ((state.answered ?? 0) === 0) return "unseen";
  return state.mastery >= 80 ? "mastered" : "in_progress";
}

/** Roll up many subtopics into a topic: weighted by answered (so empty subs don’t dominate). */
export function rollupTopicProgress(subs: ProgressState[]): ProgressState {
  const totalAnswered = subs.reduce((s, x) => s + (x.answered || 0), 0);
  const totalCorrect = subs.reduce((s, x) => s + (x.correct || 0), 0);

  // Weighted mastery
  const weightedMastery =
    totalAnswered === 0
      ? 0
      : Math.round(
          subs.reduce((s, x) => s + (x.mastery || 0) * (x.answered || 0), 0) / totalAnswered
        );

  return {
    answered: totalAnswered,
    correct: totalCorrect,
    avgTimeMs: undefined, // optional to compute
    mastery: weightedMastery,
    lastSeenAt: undefined,
  };
}

/** Roll up topics into a course (same idea). */
export const rollupCourseProgress = rollupTopicProgress;


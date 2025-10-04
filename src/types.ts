export interface AppInfo {
  version: number;
  firstVisit: string;
  lastOpen: string;
  lastLessonId?: string;
}

export interface Settings {
  keyboardHint: boolean;
  sound: boolean;
  targetAccuracy: number;
  targetWpm: number;
  backspacePenalty: boolean;
}

export interface ProgressBest {
  wpm: number;
  acc: number;
  stars: number;
  at: string;
}

export interface Progress {
  unlocked: string[];
  best: Record<string, ProgressBest>;
  lastAttempt?: {
    lessonId: string;
    attemptId: string;
    at: string;
  };
}

export interface AttemptErrorMap {
  [char: string]: number;
}

export interface Attempt {
  id: string;
  lessonId: string;
  at: string;
  durationMs: number;
  correct: number;
  totalKeystrokes: number;
  textLength: number;
  wpm: number;
  acc: number;
  stars: number;
  errors: AttemptErrorMap;
  rawInput: string;
  maxCombo?: number;
  mistakes?: number;
  playerHealthRemaining?: number;
  monsterHealthRemaining?: number;
  outcome?: 'victory' | 'defeat' | 'timeout' | 'completed';
}

export interface AttemptsByLesson {
  [lessonId: string]: Attempt[];
}

export interface UnlockRule {
  dependsOn?: string;
  minAcc?: number;
  minWpm?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string[];
  targetAccuracy?: number;
  targetWpm?: number;
  unlockRule?: UnlockRule;
}

export interface LessonMap {
  [id: string]: Lesson;
}

export interface AppState {
  app: AppInfo;
  settings: Settings;
  progress: Progress;
  attempts: AttemptsByLesson;
  lessons: LessonMap;
}

export type AppDataKey = keyof AppState;

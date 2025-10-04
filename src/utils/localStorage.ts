import { AppInfo, AppState, Attempt, AttemptsByLesson, LessonMap, Progress, Settings } from '../types';
import { lessonMap } from '../data/lessons';

const APP_KEY = 'tc.app';
const SETTINGS_KEY = 'tc.settings';
const PROGRESS_KEY = 'tc.progress';
const ATTEMPTS_KEY = 'tc.attempts';
const LESSON_KEY = 'tc.lessons';

const APP_VERSION = 1;

const nowIso = () => new Date().toISOString();

const defaultApp = (): AppInfo => ({
  version: APP_VERSION,
  firstVisit: nowIso(),
  lastOpen: nowIso()
});

const defaultSettings = (): Settings => ({
  keyboardHint: true,
  sound: true,
  targetAccuracy: 0.9,
  targetWpm: 20,
  backspacePenalty: false
});

const defaultProgress = (): Progress => ({
  unlocked: ['l01'],
  best: {}
});

const defaultAttempts = (): AttemptsByLesson => ({
  l01: [],
  l02: [],
  l03: [],
  l04: [],
  l05: [],
  l06: []
});

const setLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorage = <T>(key: string): T | undefined => {
  const raw = localStorage.getItem(key);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('Failed to parse localStorage key', key, error);
    return undefined;
  }
};

export const loadAppState = (): AppState => {
  const app = getLocalStorage<AppInfo>(APP_KEY) ?? defaultApp();
  if (app.version !== APP_VERSION) {
    app.version = APP_VERSION;
  }

  const settings = getLocalStorage<Settings>(SETTINGS_KEY) ?? defaultSettings();
  const progress = getLocalStorage<Progress>(PROGRESS_KEY) ?? defaultProgress();
  const attempts = getLocalStorage<AttemptsByLesson>(ATTEMPTS_KEY) ?? defaultAttempts();
  const storedLessons = getLocalStorage<LessonMap>(LESSON_KEY) ?? lessonMap;

  setLocalStorage(APP_KEY, app);
  setLocalStorage(SETTINGS_KEY, settings);
  setLocalStorage(PROGRESS_KEY, progress);
  setLocalStorage(ATTEMPTS_KEY, attempts);
  setLocalStorage(LESSON_KEY, storedLessons);

  return {
    app,
    settings,
    progress,
    attempts,
    lessons: storedLessons
  };
};

export const persistApp = (app: AppInfo) => setLocalStorage(APP_KEY, app);
export const persistSettings = (settings: Settings) => setLocalStorage(SETTINGS_KEY, settings);
export const persistProgress = (progress: Progress) => setLocalStorage(PROGRESS_KEY, progress);
export const persistAttempts = (attempts: AttemptsByLesson) => setLocalStorage(ATTEMPTS_KEY, attempts);
export const persistLessons = (lessons: LessonMap) => setLocalStorage(LESSON_KEY, lessons);

export const exportAllData = (): string => {
  const payload = {
    [APP_KEY]: getLocalStorage<AppInfo>(APP_KEY) ?? defaultApp(),
    [SETTINGS_KEY]: getLocalStorage<Settings>(SETTINGS_KEY) ?? defaultSettings(),
    [PROGRESS_KEY]: getLocalStorage<Progress>(PROGRESS_KEY) ?? defaultProgress(),
    [ATTEMPTS_KEY]: getLocalStorage<AttemptsByLesson>(ATTEMPTS_KEY) ?? defaultAttempts(),
    [LESSON_KEY]: getLocalStorage<LessonMap>(LESSON_KEY) ?? lessonMap
  };
  return JSON.stringify(payload, null, 2);
};

export const importAllData = (json: string): AppState => {
  const parsed = JSON.parse(json);
  const app = parsed[APP_KEY] as AppInfo | undefined;
  const settings = parsed[SETTINGS_KEY] as Settings | undefined;
  const progress = parsed[PROGRESS_KEY] as Progress | undefined;
  const attempts = parsed[ATTEMPTS_KEY] as AttemptsByLesson | undefined;
  const lessons = parsed[LESSON_KEY] as LessonMap | undefined;
  if (!app || !settings || !progress || !attempts || !lessons) {
    throw new Error('导入的数据缺少必要字段');
  }
  setLocalStorage(APP_KEY, app);
  setLocalStorage(SETTINGS_KEY, settings);
  setLocalStorage(PROGRESS_KEY, progress);
  setLocalStorage(ATTEMPTS_KEY, attempts);
  setLocalStorage(LESSON_KEY, lessons);
  return {
    app,
    settings,
    progress,
    attempts,
    lessons
  };
};

export const resetAllData = (): AppState => {
  const fresh: AppState = {
    app: defaultApp(),
    settings: defaultSettings(),
    progress: defaultProgress(),
    attempts: defaultAttempts(),
    lessons: lessonMap
  };
  persistApp(fresh.app);
  persistSettings(fresh.settings);
  persistProgress(fresh.progress);
  persistAttempts(fresh.attempts);
  persistLessons(fresh.lessons);
  return fresh;
};

export const updateLastOpen = (app: AppInfo) => {
  const updated = { ...app, lastOpen: nowIso() };
  persistApp(updated);
  return updated;
};

export const recordLastLesson = (app: AppInfo, lessonId: string) => {
  const updated = { ...app, lastLessonId: lessonId, lastOpen: nowIso() };
  persistApp(updated);
  return updated;
};

export const STORAGE_KEYS = {
  APP_KEY,
  SETTINGS_KEY,
  PROGRESS_KEY,
  ATTEMPTS_KEY,
  LESSON_KEY
} as const;

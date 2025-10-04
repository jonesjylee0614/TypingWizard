import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AppInfo, AppState, Attempt, Lesson, LessonMap, Progress, Settings } from '../types';
import {
  loadAppState,
  persistAttempts,
  persistLessons,
  persistProgress,
  persistSettings,
  recordLastLesson,
  resetAllData,
  updateLastOpen
} from '../utils/localStorage';
import { lessonList } from '../data/lessons';

const MAX_ATTEMPTS_PER_LESSON = 50;

export interface AppDataContextValue extends AppState {
  refresh: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  recordAttempt: (lesson: Lesson, attempt: Omit<Attempt, 'id' | 'at' | 'lessonId' | 'stars'>) => Attempt;
  updateLessons: (lessons: LessonMap) => void;
  unlockLesson: (lessonId: string) => void;
  importState: (state: AppState) => void;
  resetState: () => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const generateAttemptId = () => `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const calculateStars = (acc: number, wpm: number, lesson: Lesson, settings: Settings) => {
  const targetAcc = lesson.targetAccuracy ?? settings.targetAccuracy;
  const targetWpm = lesson.targetWpm ?? settings.targetWpm;
  if (acc >= 0.95 && wpm >= Math.max(30, targetWpm + 5)) return 3;
  if (acc >= Math.max(0.9, targetAcc) && wpm >= targetWpm) return 2;
  return 1;
};

const checkUnlock = (lesson: Lesson, attempts: Record<string, Attempt[]>) => {
  const rule = lesson.unlockRule;
  if (!rule || !rule.dependsOn) return true;
  const prerequisiteAttempts = attempts[rule.dependsOn];
  if (!prerequisiteAttempts || prerequisiteAttempts.length === 0) return false;
  return prerequisiteAttempts.some((attempt) => {
    const meetAcc = rule.minAcc ? attempt.acc >= rule.minAcc : true;
    const meetWpm = rule.minWpm ? attempt.wpm >= rule.minWpm : true;
    return meetAcc && meetWpm;
  });
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => loadAppState());

  const refresh = useCallback(() => {
    setState(loadAppState());
  }, []);

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      return next;
    });
  }, []);

  const updateSettings = useCallback((settingsPatch: Partial<Settings>) => {
    updateState((prev) => {
      const settings = { ...prev.settings, ...settingsPatch };
      persistSettings(settings);
      return { ...prev, settings };
    });
  }, [updateState]);

  const unlockLesson = useCallback((lessonId: string) => {
    updateState((prev) => {
      if (prev.progress.unlocked.includes(lessonId)) return prev;
      const progress: Progress = {
        ...prev.progress,
        unlocked: [...prev.progress.unlocked, lessonId]
      };
      persistProgress(progress);
      return { ...prev, progress };
    });
  }, [updateState]);

  const updateLessons = useCallback((lessons: LessonMap) => {
    updateState((prev) => {
      persistLessons(lessons);
      return { ...prev, lessons };
    });
  }, [updateState]);

  const importState = useCallback((incoming: AppState) => {
    setState(incoming);
  }, []);

  const resetStateHandler = useCallback(() => {
    setState(resetAllData());
  }, []);

  const recordAttempt = useCallback<
    AppDataContextValue['recordAttempt']
  >(
    (lesson, attemptData) => {
      const attempt: Attempt = {
        ...attemptData,
        lessonId: lesson.id,
        id: generateAttemptId(),
        at: new Date().toISOString(),
        stars: calculateStars(attemptData.acc, attemptData.wpm, lesson, state.settings)
      };

      updateState((prev) => {
        const attempts = { ...prev.attempts };
        const list = [...(attempts[lesson.id] ?? []), attempt];
        if (list.length > MAX_ATTEMPTS_PER_LESSON) {
          list.splice(0, list.length - MAX_ATTEMPTS_PER_LESSON);
        }
        attempts[lesson.id] = list;
        persistAttempts(attempts);

        const currentBest = prev.progress.best[lesson.id];
        const isBetter =
          !currentBest ||
          attempt.stars > currentBest.stars ||
          (attempt.stars === currentBest.stars && attempt.wpm > currentBest.wpm);
        const progress: Progress = {
          ...prev.progress,
          best: {
            ...prev.progress.best,
            [lesson.id]: isBetter
              ? {
                  wpm: attempt.wpm,
                  acc: attempt.acc,
                  stars: attempt.stars,
                  at: attempt.at
                }
              : prev.progress.best[lesson.id]
          },
          lastAttempt: {
            lessonId: lesson.id,
            attemptId: attempt.id,
            at: attempt.at
          }
        };

        const lessonIndex = lessonList.findIndex((item) => item.id === lesson.id);
        if (lessonIndex >= 0 && lessonIndex + 1 < lessonList.length) {
          const nextLesson = lessonList[lessonIndex + 1];
          if (!progress.unlocked.includes(nextLesson.id)) {
            const unlocked = checkUnlock(nextLesson, attempts);
            if (unlocked) {
              progress.unlocked = [...progress.unlocked, nextLesson.id];
            }
          }
        }
        persistProgress(progress);

        const app: AppInfo = recordLastLesson(prev.app, lesson.id);

        return {
          ...prev,
          attempts,
          progress,
          app
        };
      });

      return attempt;
    },
    [state.settings, updateState]
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      ...state,
      refresh,
      updateSettings,
      recordAttempt,
      updateLessons,
      unlockLesson,
      importState,
      resetState: resetStateHandler
    }),
    [state, refresh, updateSettings, recordAttempt, updateLessons, unlockLesson, importState, resetStateHandler]
  );

  React.useEffect(() => {
    setState((prev) => {
      const app = updateLastOpen(prev.app);
      return { ...prev, app };
    });
  }, []);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
};

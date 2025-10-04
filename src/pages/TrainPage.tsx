import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { AttemptErrorMap } from '../types';

interface TypedEntry {
  char: string;
  correct: boolean;
}

const keyRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

const formatDuration = (ms: number) => {
  if (ms <= 0) return '0s';
  const seconds = Math.round(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}分${secs.toString().padStart(2, '0')}秒`;
};

const TrainPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons, progress, settings, recordAttempt } = useAppData();
  const lesson = lessonId ? lessons[lessonId] : undefined;
  const unlocked = lessonId ? progress.unlocked.includes(lessonId) : false;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [entries, setEntries] = useState<TypedEntry[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errorMap, setErrorMap] = useState<AttemptErrorMap>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!startedAt || finished) return;
    const id = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 250);
    return () => window.clearInterval(id);
  }, [startedAt, finished]);

  const targetText = useMemo(() => {
    if (!lesson) return '';
    return lesson.content.join('\n');
  }, [lesson]);

  const progressRatio = entries.length / (targetText.length || 1);
  const correctCount = useMemo(() => entries.filter((entry) => entry.correct).length, [entries]);
  useEffect(() => {
    if (!finished && endedAt !== null) {
      setEndedAt(null);
    }
  }, [entries.length, finished, endedAt]);
  const durationMs = useMemo(() => {
    if (!startedAt) return 0;
    const end = endedAt ?? Date.now();
    return end - startedAt;
  }, [startedAt, tick, finished, endedAt]);
  const minutes = durationMs / 60000;
  const wpm = startedAt && minutes > 0 ? Math.round((correctCount / 5) / minutes) : 0;
  const accuracy = totalKeystrokes > 0 ? Math.min(1, Math.max(0, correctCount / totalKeystrokes)) : 1;

  useEffect(() => {
    if (!lesson) return;
    if (!unlocked) {
      alert('该关尚未解锁，请返回课程列表');
      navigate('/lessons');
    }
  }, [lesson, unlocked, navigate]);

  if (!lesson) {
    return (
      <div className="card" style={{ marginTop: 32 }}>
        <h1>未找到课程</h1>
        <Link to="/lessons">
          <button className="primary" style={{ marginTop: 16 }}>返回课程</button>
        </Link>
      </div>
    );
  }

  const expectedChar = targetText[entries.length] ?? '';

  const handleCharInput = (char: string) => {
    if (!startedAt) {
      setStartedAt(Date.now());
    }
    if (entries.length >= targetText.length) return;
    const expected = targetText[entries.length];
    const isCorrect = char === expected;
    setEntries((prev) => [...prev, { char, correct: isCorrect }]);
    setTotalKeystrokes((prev) => prev + 1);
    if (!isCorrect) {
      setErrorMap((prev) => {
        const next = { ...prev };
        next[expected] = (next[expected] ?? 0) + 1;
        return next;
      });
    }
  };

  const handleBackspace = () => {
    if (entries.length === 0) return;
    const index = entries.length - 1;
    const entry = entries[index];
    const expected = targetText[index];
    setEntries((prev) => prev.slice(0, -1));
    setTotalKeystrokes((prev) => prev + 1);
    if (!entry.correct) {
      setErrorMap((prev) => {
        const next = { ...prev };
        const value = (next[expected] ?? 1) - 1;
        if (value <= 0) {
          delete next[expected];
        } else {
          next[expected] = value;
        }
        return next;
      });
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { key } = event;
    if (key === 'Tab' || key === 'Escape') {
      event.preventDefault();
      return;
    }
    if (key === 'Backspace') {
      event.preventDefault();
      handleBackspace();
      return;
    }
    if (key === 'Enter') {
      event.preventDefault();
      handleCharInput('\n');
      return;
    }
    if (key.length === 1) {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      handleCharInput(key);
    }
  };

  const handleFinish = () => {
    if (finished) return;
    if (!startedAt) {
      alert('请至少输入一个字符再结束。');
      return;
    }
    const duration = Date.now() - startedAt;
    const attempt = recordAttempt(lesson, {
      durationMs: duration,
      correct: correctCount,
      totalKeystrokes,
      textLength: targetText.length,
      wpm,
      acc: accuracy,
      errors: errorMap,
      rawInput: entries.map((entry) => entry.char).join('')
    });
    setFinished(true);
    setEndedAt(Date.now());
    navigate(`/result/${lesson.id}/${attempt.id}`);
  };

  const handleExit = () => {
    const confirmExit = window.confirm('确认退出本次练习吗？未保存的数据将丢失。');
    if (confirmExit) {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const showKeyboard = settings.keyboardHint;

  return (
    <div style={{ marginTop: 24 }}>
      <div className="hud">
        <div className="hud-item">
          <span>进度</span>
          <strong>{Math.floor(progressRatio * 100)}%</strong>
          <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: `${Math.floor(progressRatio * 100)}%` }} />
          </div>
        </div>
        <div className="hud-item">
          <span>WPM</span>
          <strong>{wpm}</strong>
        </div>
        <div className="hud-item">
          <span>准确率</span>
          <strong>{(accuracy * 100).toFixed(1)}%</strong>
        </div>
        <div className="hud-item">
          <span>用时</span>
          <strong>{formatDuration(durationMs)}</strong>
        </div>
        <div>
          <button className="secondary" onClick={handleExit}>退出</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="typing-container" onClick={() => textareaRef.current?.focus()}>
          <div className="typing-text">
            {targetText.split('').map((char, index) => {
              const typed = entries[index];
              const isCurrent = index === entries.length;
              const classNames = ['typing-char'];
              if (typed) {
                classNames.push(typed.correct ? 'correct' : 'incorrect');
              }
              if (isCurrent) {
                classNames.push('current');
              }
              const displayChar = char === '\n' ? '↵' : char === ' ' ? '·' : char;
              return (
                <span key={index} className={classNames.join(' ')}>
                  {displayChar}
                </span>
              );
            })}
          </div>
          <textarea
            ref={textareaRef}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            value={entries.map((entry) => entry.char).join('')}
            onKeyDown={handleKeyDown}
            aria-label="打字练习输入捕获"
            readOnly
          />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button className="primary" onClick={handleFinish} disabled={entries.length === 0}>
            结束本次
          </button>
          {entries.length >= targetText.length && (
            <button className="secondary" onClick={handleFinish}>
              完成并查看结果
            </button>
          )}
        </div>
        <div style={{ marginTop: 16, color: '#64748b', fontSize: 14 }}>
          输入框已隐藏，直接在键盘上敲击即可。禁止粘贴，建议切换为英文输入法。
        </div>
      </div>

      {showKeyboard && (
        <div className="virtual-keyboard">
          {keyRows.map((row, rowIndex) => (
            <div key={rowIndex} className="virtual-keyboard-row">
              {row.map((key) => {
                const isTarget = expectedChar.toLowerCase() === key;
                const isActive = entries.length > 0 && entries[entries.length - 1].char.toLowerCase() === key;
                const classNames = ['virtual-key'];
                if (isActive) classNames.push('active');
                if (isTarget) classNames.push('target');
                return (
                  <span key={key} className={classNames.join(' ')}>
                    {key}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {Object.keys(errorMap).length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3>错误统计</h3>
          <div className="chip-row" style={{ marginTop: 12 }}>
            {Object.entries(errorMap)
              .sort((a, b) => b[1] - a[1])
              .map(([char, count]) => (
                <span key={char} className="badge">
                  {char === ' ' ? '空格' : char === '\n' ? '回车' : char} · {count}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainPage;

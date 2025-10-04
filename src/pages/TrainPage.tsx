import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { AttemptErrorMap } from '../types';
import { generateLessonContent } from '../data/lessons';

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

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const COUNTDOWN_TIME = 180; // 3分钟 = 180秒

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
  const [remainingTime, setRemainingTime] = useState(COUNTDOWN_TIME);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [contentKey, setContentKey] = useState(Date.now()); // 用于强制重新生成内容
  const [monsterHit, setMonsterHit] = useState(false);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [comboAnimation, setComboAnimation] = useState(false);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // 倒计时定时器
  useEffect(() => {
    if (!startedAt || finished) return;
    const id = window.setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [startedAt, finished]);
  
  // 时间到自动结束
  useEffect(() => {
    if (remainingTime === 0 && startedAt && !finished) {
      handleFinish();
    }
  }, [remainingTime, startedAt, finished]);

  useEffect(() => {
    if (!startedAt || finished) return;
    const id = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 250);
    return () => window.clearInterval(id);
  }, [startedAt, finished]);

  // 动态生成课程内容
  const targetText = useMemo(() => {
    if (!lesson) return '';
    const dynamicContent = generateLessonContent(lesson.id);
    return dynamicContent.join('\n');
  }, [lesson, contentKey]);

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
    
    if (isCorrect) {
      // 触发怪物受伤动画
      setMonsterHit(true);
      setTimeout(() => setMonsterHit(false), 300);
      
      // 连击系统
      setCombo((prev) => {
        const newCombo = prev + 1;
        if (newCombo > maxCombo) {
          setMaxCombo(newCombo);
        }
        
        // 触发连击动画
        setComboAnimation(true);
        setTimeout(() => setComboAnimation(false), 500);
        
        // 成就检查
        if (newCombo === 10) {
          setShowAchievement('🔥 连击达人！10连击！');
          setTimeout(() => setShowAchievement(null), 3000);
        } else if (newCombo === 25) {
          setShowAchievement('⚡ 疾风之指！25连击！');
          setTimeout(() => setShowAchievement(null), 3000);
        } else if (newCombo === 50) {
          setShowAchievement('🌟 打字大师！50连击！');
          setTimeout(() => setShowAchievement(null), 3000);
        } else if (newCombo === 100) {
          setShowAchievement('👑 传奇键盘侠！100连击！');
          setTimeout(() => setShowAchievement(null), 3000);
        }
        
        return newCombo;
      });
    } else {
      // 错误则重置连击
      setCombo(0);
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
  
  // 怪物血量（根据进度反向计算）
  const monsterHealth = Math.max(0, 100 - Math.floor(progressRatio * 100));
  const monsterHealthColor = monsterHealth > 60 ? '#ef4444' : monsterHealth > 30 ? '#f97316' : '#facc15';
  
  // 时间警告颜色
  const timeColor = remainingTime < 30 ? '#ef4444' : remainingTime < 60 ? '#f97316' : '#22c55e';

  return (
    <div style={{ marginTop: 24, position: 'relative' }}>
      {/* 成就弹出 */}
      {showAchievement && (
        <div className="achievement-popup" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: '#78350f',
          padding: '24px 48px',
          borderRadius: '16px',
          fontSize: '32px',
          fontWeight: 'bold',
          zIndex: 1000,
          boxShadow: '0 20px 60px rgba(251, 191, 36, 0.6)',
          border: '4px solid #fff'
        }}>
          {showAchievement}
        </div>
      )}
      
      {/* 怪物血条区域 */}
      <div className={`card ${monsterHit ? 'monster-hit' : ''}`} style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: '#fff',
        padding: '20px',
        marginBottom: '16px',
        border: '3px solid #f97316',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '48px', transition: 'transform 0.3s ease' }}>
              {monsterHealth > 50 ? '👾' : monsterHealth > 20 ? '😵' : '💀'}
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>打字怪兽</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>击败它完成关卡！</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: monsterHealthColor }}>
              {monsterHealth}%
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>怪物血量</div>
          </div>
        </div>
        <div style={{ 
          width: '100%', 
          height: '24px', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          <div style={{ 
            width: `${monsterHealth}%`, 
            height: '100%', 
            background: `linear-gradient(90deg, ${monsterHealthColor} 0%, #fbbf24 100%)`,
            transition: 'width 0.3s ease',
            boxShadow: `0 0 10px ${monsterHealthColor}`
          }} />
        </div>
      </div>

      {/* 统计信息区域 */}
      <div className="hud" style={{ 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
        border: '3px solid #f97316',
        padding: '16px',
        borderRadius: '16px'
      }}>
        <div className="hud-item">
          <span style={{ color: '#92400e', fontWeight: 'bold' }}>⏱️ 剩余时间</span>
          <strong style={{ color: timeColor, fontSize: '28px' }}>{formatTime(remainingTime)}</strong>
        </div>
        <div className={`hud-item ${comboAnimation ? 'combo-animation' : ''}`}>
          <span style={{ color: '#92400e', fontWeight: 'bold' }}>⚡ 连击</span>
          <strong style={{ 
            color: combo >= 50 ? '#dc2626' : combo >= 25 ? '#f97316' : combo >= 10 ? '#f59e0b' : '#f97316', 
            fontSize: combo >= 50 ? '36px' : combo >= 25 ? '32px' : '28px',
            transition: 'all 0.3s ease'
          }}>
            {combo}
            {combo >= 10 && <span style={{ fontSize: '20px', marginLeft: '4px' }}>🔥</span>}
          </strong>
          {maxCombo > 0 && <div style={{ fontSize: '12px', color: '#92400e' }}>最高: {maxCombo}</div>}
        </div>
        <div className="hud-item">
          <span style={{ color: '#92400e', fontWeight: 'bold' }}>🚀 速度</span>
          <strong style={{ color: '#7c3aed', fontSize: '28px' }}>{wpm} WPM</strong>
        </div>
        <div className="hud-item">
          <span style={{ color: '#92400e', fontWeight: 'bold' }}>🎯 准确率</span>
          <strong style={{ color: '#059669', fontSize: '28px' }}>{(accuracy * 100).toFixed(1)}%</strong>
        </div>
        <div className="hud-item">
          <span style={{ color: '#92400e', fontWeight: 'bold' }}>📊 进度</span>
          <strong style={{ color: '#2563eb', fontSize: '28px' }}>{Math.floor(progressRatio * 100)}%</strong>
        </div>
        <div>
          <button className="secondary" onClick={handleExit} style={{ 
            background: '#dc2626', 
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px 20px'
          }}>❌ 退出</button>
        </div>
      </div>

      <div className="card" style={{ 
        marginTop: 24,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '3px solid #f97316',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.3)'
      }}>
        <div className="typing-container" onClick={() => textareaRef.current?.focus()} style={{
          background: 'transparent',
          fontSize: '28px',
          lineHeight: '1.6',
          padding: '32px'
        }}>
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
              const displayChar = char === '\n' ? '↵' : char;
              return (
                <span key={index} className={classNames.join(' ')} style={char === ' ' ? { 
                  textDecoration: typed ? 'none' : 'underline',
                  textDecorationColor: isCurrent ? '#f97316' : '#475569',
                  textDecorationStyle: 'solid',
                  textUnderlineOffset: '4px'
                } : {}}>
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
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button 
            className="primary" 
            onClick={handleFinish} 
            disabled={entries.length === 0}
            style={{ 
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              fontSize: '18px',
              padding: '14px 28px',
              fontWeight: 'bold',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)'
            }}
          >
            ⏹️ 结束本次
          </button>
          {entries.length >= targetText.length && (
            <>
              <button 
                className="secondary" 
                onClick={handleFinish}
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#fff',
                  fontSize: '18px',
                  padding: '14px 28px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)',
                  animation: 'combo-pulse 1s ease-in-out infinite'
                }}
              >
                ✅ 完成并查看结果
              </button>
              {monsterHealth === 0 && (
                <div style={{ 
                  marginLeft: '12px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#22c55e',
                  animation: 'combo-pulse 0.5s ease-in-out'
                }}>
                  🎉 怪物被击败了！
                </div>
              )}
            </>
          )}
        </div>
        <div style={{ marginTop: 16, color: '#94a3b8', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>
          💡 直接在键盘上敲击即可 · 建议切换为英文输入法
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

import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { lessonList } from '../data/lessons';

const ResultPage = () => {
  const { lessonId, attemptId } = useParams();
  const navigate = useNavigate();
  const { lessons, attempts, progress } = useAppData();
  const lesson = lessonId ? lessons[lessonId] : undefined;
  const attempt = lessonId ? attempts[lessonId]?.find((item) => item.id === attemptId) : undefined;

  const recent = useMemo(() => {
    if (!lessonId) return [];
    return (attempts[lessonId] ?? []).slice(-3).reverse();
  }, [attempts, lessonId]);

  if (!lesson || !attempt) {
    return (
      <div className="card" style={{ marginTop: 32 }}>
        <h1>未找到成绩</h1>
        <Link to="/lessons">
          <button className="primary" style={{ marginTop: 16 }}>返回课程</button>
        </Link>
      </div>
    );
  }

  const best = progress.best[lesson.id];
  const durationSeconds = Math.round(attempt.durationMs / 1000);
  const accuracyPercent = (attempt.acc * 100).toFixed(1);
  const monsterHealthRemaining = attempt.monsterHealthRemaining ?? Math.max(
    0,
    Math.round(100 - ((attempt.correct / (attempt.textLength || 1)) * 100))
  );
  const playerHealthRemaining = attempt.playerHealthRemaining;
  const clampedPlayerHealth = playerHealthRemaining !== undefined
    ? Math.max(0, Math.min(100, playerHealthRemaining))
    : undefined;
  const mistakes = attempt.mistakes ?? Math.max(0, attempt.totalKeystrokes - attempt.correct);
  const maxCombo = attempt.maxCombo;
  const outcome = attempt.outcome ?? (monsterHealthRemaining <= 0 ? 'victory' : 'completed');

  const outcomeMeta = (() => {
    switch (outcome) {
      case 'victory':
        return {
          title: '胜利！',
          description: '你成功击败了打字怪兽，保持手感继续冲刺。',
          gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          accent: '#bbf7d0',
          emoji: '🏆',
          badge: '胜利'
        };
      case 'defeat':
        return {
          title: '战斗失败',
          description: '怪物抢先一步，调整节奏再来挑战！',
          gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          accent: '#fecaca',
          emoji: '💥',
          badge: '失败'
        };
      case 'timeout':
        return {
          title: '时间耗尽',
          description: '倒计时归零，试试更精准的节奏或更快的手速。',
          gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          accent: '#fed7aa',
          emoji: '⏰',
          badge: '超时'
        };
      default:
        return {
          title: '练习完成',
          description: '继续巩固肌肉记忆，向完美连击迈进。',
          gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
          accent: '#c7d2fe',
          emoji: '✨',
          badge: '完成'
        };
    }
  })();

  const statusChips: { label: string; value: string | number; description: string }[] = [
    {
      label: '速度 WPM',
      value: attempt.wpm,
      description: '每分钟词数'
    },
    {
      label: '准确率',
      value: `${accuracyPercent}%`,
      description: `${attempt.correct}/${attempt.totalKeystrokes} 击`
    },
    {
      label: '用时',
      value: `${durationSeconds}s`,
      description: '倒计时内的有效练习'
    },
    {
      label: '星级',
      value: attempt.stars > 0 ? '★'.repeat(attempt.stars) : '—',
      description: `${attempt.stars} 星评价`
    }
  ];

  return (
    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: outcomeMeta.gradient, color: '#fff', padding: '32px 32px 28px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 40 }}>{outcomeMeta.emoji}</span>
                <span style={{
                  background: 'rgba(15, 23, 42, 0.25)',
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: 'uppercase'
                }}>{outcomeMeta.badge}</span>
              </div>
              <h1 style={{ fontSize: 32, margin: 0, fontWeight: 800 }}>{outcomeMeta.title} · {lesson.title}</h1>
              <p style={{ marginTop: 12, fontSize: 16, opacity: 0.95 }}>{outcomeMeta.description}</p>
              <p style={{ marginTop: 12, fontSize: 14, color: outcomeMeta.accent }}>完成时间：{new Date(attempt.at).toLocaleString()}</p>
            </div>
            <div style={{
              display: 'grid',
              gap: '12px',
              flex: '1 1 260px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))'
            }}>
              {statusChips.map((chip) => (
                <div
                  key={chip.label}
                  style={{
                    background: 'rgba(15, 23, 42, 0.25)',
                    borderRadius: 16,
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <span style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.75 }}>{chip.label}</span>
                  <span style={{ fontSize: 28, fontWeight: 700 }}>{chip.value}</span>
                  <span style={{ fontSize: 12, opacity: 0.75 }}>{chip.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section>
            <h2 style={{ marginBottom: 12 }}>战况回顾</h2>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              <div style={{
                padding: 16,
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.25)',
                background: '#f1f5f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>怪物血量</span>
                  <span style={{ fontWeight: 700, color: monsterHealthRemaining > 30 ? '#ef4444' : monsterHealthRemaining > 0 ? '#f97316' : '#16a34a' }}>{monsterHealthRemaining}%</span>
                </div>
                <div style={{
                  height: 12,
                  borderRadius: 999,
                  overflow: 'hidden',
                  background: '#e2e8f0'
                }}>
                  <div style={{
                    width: `${monsterHealthRemaining}%`,
                    height: '100%',
                    background: monsterHealthRemaining === 0 ? 'linear-gradient(90deg, #22c55e 0%, #15803d 100%)' : 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ marginTop: 8, fontSize: 12, color: '#475569' }}>正确击中 {attempt.correct} / {attempt.textLength}</p>
              </div>
              <div style={{
                padding: 16,
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.25)',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>玩家血量</span>
                  <span style={{ fontWeight: 700, color: clampedPlayerHealth === undefined ? '#0f172a' : clampedPlayerHealth > 60 ? '#16a34a' : clampedPlayerHealth > 30 ? '#f59e0b' : '#ef4444' }}>{clampedPlayerHealth !== undefined ? `${clampedPlayerHealth}%` : '—'}</span>
                </div>
                <div style={{
                  height: 12,
                  borderRadius: 999,
                  overflow: 'hidden',
                  background: '#e2e8f0'
                }}>
                  <div style={{
                    width: clampedPlayerHealth !== undefined ? `${clampedPlayerHealth}%` : '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #22c55e 0%, #0ea5e9 100%)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ marginTop: 8, fontSize: 12, color: '#475569' }}>受到攻击 {mistakes} 次</p>
              </div>
              <div style={{
                padding: 16,
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.25)',
                background: '#fff7ed'
              }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>连击与亮点</div>
                <p style={{ margin: 0, fontSize: 14 }}>最高连击：{maxCombo ?? '—'}</p>
                <p style={{ margin: '8px 0 0', fontSize: 12, color: '#b45309' }}>保持稳定节奏以触发更多成就。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ marginBottom: 12 }}>击键统计</h2>
            <div className="chip-row" style={{ marginTop: 12 }}>
              <span className="badge">总击键 {attempt.totalKeystrokes}</span>
              <span className="badge">正确字符 {attempt.correct}</span>
              <span className="badge">目标字符 {attempt.textLength}</span>
              <span className="badge">失误次数 {mistakes}</span>
            </div>
            {Object.keys(attempt.errors).length > 0 ? (
              <div className="card" style={{ marginTop: 16, borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
                <h3>错误分布</h3>
                <div className="chip-row" style={{ marginTop: 12 }}>
                  {Object.entries(attempt.errors)
                    .sort((a, b) => b[1] - a[1])
                    .map(([char, count]) => (
                      <span key={char} className="badge">
                        {char === ' ' ? '空格' : char === '\n' ? '回车' : char} · {count}
                      </span>
                    ))}
                </div>
              </div>
            ) : (
              <p style={{ color: '#475569', marginTop: 16 }}>恭喜，没有错误击键！</p>
            )}
          </section>
        </div>
      </div>

      {best && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 12 }}>与最佳成绩对比</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
              <h4>历史最佳</h4>
              <p>星级 {best.stars} ★</p>
              <p>WPM {best.wpm}</p>
              <p>准确率 {(best.acc * 100).toFixed(1)}%</p>
            </div>
            <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
              <h4>本次</h4>
              <p>星级 {attempt.stars} ★</p>
              <p>WPM {attempt.wpm}</p>
              <p>准确率 {accuracyPercent}%</p>
            </div>
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 12 }}>最近三次记录</h2>
          <table className="table">
            <thead>
              <tr>
                <th>时间</th>
                <th>WPM</th>
                <th>准确率</th>
                <th>用时</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.at).toLocaleString()}</td>
                  <td>{item.wpm}</td>
                  <td>{(item.acc * 100).toFixed(1)}%</td>
                  <td>{Math.round(item.durationMs / 1000)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <button className="primary" onClick={() => navigate(`/train/${lesson.id}`)}>
          重练本关
        </button>
        <Link to="/lessons">
          <button className="secondary">返回课程</button>
        </Link>
        <button
          className="secondary"
          onClick={() => {
            const order = lessonList.map((item) => item.id);
            const index = order.findIndex((id) => id === lesson.id);
            if (index >= 0 && index + 1 < order.length) {
              const nextId = order[index + 1];
              if (progress.unlocked.includes(nextId)) {
                navigate(`/lesson/${nextId}`);
              } else {
                alert('下一关尚未解锁，继续努力！');
              }
            } else {
              alert('已是最后一关，恭喜完成全部课程！');
            }
          }}
        >
          下一关
        </button>
      </div>
    </div>
  );
};

export default ResultPage;

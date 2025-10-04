import { useMemo, useState } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { useAppData } from '../context/AppDataContext';
import { Attempt } from '../types';
import { lessonList } from '../data/lessons';

const formatDate = (iso: string) => new Date(iso).toLocaleString();

const StatsPage = () => {
  const { attempts, lessons, progress } = useAppData();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const allAttempts = useMemo(() => Object.values(attempts).flat().sort((a, b) => parseISO(b.at).getTime() - parseISO(a.at).getTime()), [attempts]);

  const totalDuration = allAttempts.reduce((sum, item) => sum + item.durationMs, 0);
  const avgWpm = allAttempts.length > 0 ? Math.round(allAttempts.reduce((sum, item) => sum + item.wpm, 0) / allAttempts.length) : 0;
  const avgAcc = allAttempts.length > 0 ? allAttempts.reduce((sum, item) => sum + item.acc, 0) / allAttempts.length : 0;

  const streak = useMemo(() => {
    if (allAttempts.length === 0) return 0;
    const dates = Array.from(
      new Set(
        allAttempts
          .map((item) => parseISO(item.at))
          .map((date) => date.toISOString().slice(0, 10))
      )
    ).sort((a, b) => (a < b ? 1 : -1));
    let streakCount = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = differenceInCalendarDays(new Date(dates[i - 1]), new Date(dates[i]));
      if (diff === 1) {
        streakCount += 1;
      } else {
        break;
      }
    }
    return streakCount;
  }, [allAttempts]);

  const trendData = useMemo(() => allAttempts.slice(0, 12).reverse(), [allAttempts]);

  const lessonStats = useMemo(() => {
    return lessonList.map((baseLesson) => {
      const lessonId = baseLesson.id;
      const lesson = lessons[lessonId] ?? baseLesson;
      const list = attempts[lessonId] ?? [];
      const recent = list[list.length - 1];
      const best = progress.best[lessonId];
      return { lesson, recent, best };
    });
  }, [attempts, lessons, progress.best]);

  const selectedAttempts: Attempt[] = selectedLesson ? attempts[selectedLesson] ?? [] : [];

  return (
    <div style={{ marginTop: 24 }}>
      <div className="card">
        <h1>历史统计</h1>
        <p className="subtitle">查看累计表现与关卡成绩。</p>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 16 }}>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>总练习时长</h3>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{Math.round(totalDuration / 60000)} 分钟</div>
          </div>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>总尝试次数</h3>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{allAttempts.length}</div>
          </div>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>平均 WPM</h3>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{avgWpm}</div>
          </div>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>平均准确率</h3>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{(avgAcc * 100).toFixed(1)}%</div>
          </div>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>连续练习天数</h3>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{streak}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>最近趋势</h2>
        {trendData.length === 0 ? (
          <p style={{ color: '#475569' }}>暂无记录，快去完成第一次练习吧。</p>
        ) : (
          <svg width="100%" height="160">
            {trendData.map((item, index) => {
              const x = (index / Math.max(1, trendData.length - 1)) * 100;
              const y = 140 - item.wpm;
              return (
                <g key={item.id}>
                  <circle cx={`${x}%`} cy={Math.max(20, y)} r={4} fill="#2563eb" />
                  {index > 0 && (
                    <line
                      x1={`${((index - 1) / Math.max(1, trendData.length - 1)) * 100}%`}
                      y1={Math.max(20, 140 - trendData[index - 1].wpm)}
                      x2={`${x}%`}
                      y2={Math.max(20, y)}
                      stroke="#93c5fd"
                      strokeWidth={2}
                    />
                  )}
                  <text x={`${x}%`} y={Math.max(20, y) - 8} textAnchor="middle" fill="#1e293b" fontSize={12}>
                    {item.wpm}
                  </text>
                </g>
              );
            })}
            <text x="10" y="150" fill="#475569" fontSize={12}>
              最近 {trendData.length} 次 WPM
            </text>
          </svg>
        )}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>课程表现</h2>
        <table className="table">
          <thead>
            <tr>
              <th>课程</th>
              <th>最佳星级</th>
              <th>最佳 WPM</th>
              <th>最佳准确率</th>
              <th>最近一次</th>
            </tr>
          </thead>
          <tbody>
            {lessonStats.map(({ lesson, best, recent }) => (
              <tr
                key={lesson.id}
                onClick={() => setSelectedLesson((prev) => (prev === lesson.id ? null : lesson.id))}
                style={{ cursor: 'pointer' }}
              >
                <td>{lesson.title}</td>
                <td>{best ? `${best.stars} ★` : '-'}</td>
                <td>{best ? best.wpm : '-'}</td>
                <td>{best ? `${(best.acc * 100).toFixed(1)}%` : '-'}</td>
                <td>{recent ? `${recent.wpm} WPM · ${(recent.acc * 100).toFixed(1)}%` : '未练习'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedLesson && (
          <div className="card" style={{ marginTop: 16, borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>关卡历史 · {lessons[selectedLesson]?.title}</h3>
            {selectedAttempts.length === 0 ? (
              <p style={{ color: '#475569' }}>暂无历史记录。</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>WPM</th>
                    <th>准确率</th>
                    <th>用时</th>
                    <th>星级</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAttempts
                    .slice()
                    .reverse()
                    .map((item) => (
                      <tr key={item.id}>
                        <td>{formatDate(item.at)}</td>
                        <td>{item.wpm}</td>
                        <td>{(item.acc * 100).toFixed(1)}%</td>
                        <td>{Math.round(item.durationMs / 1000)}s</td>
                        <td>{'★'.repeat(item.stars)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;

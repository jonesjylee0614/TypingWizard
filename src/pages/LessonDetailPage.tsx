import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const LessonDetailPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons, progress, attempts } = useAppData();
  const lesson = lessonId ? lessons[lessonId] : undefined;
  const unlocked = lessonId ? progress.unlocked.includes(lessonId) : false;

  const latestAttempts = useMemo(() => {
    if (!lessonId) return [];
    return (attempts[lessonId] ?? []).slice(-3).reverse();
  }, [lessonId, attempts]);

  if (!lesson) {
    return (
      <div className="card" style={{ marginTop: 32 }}>
        <h1>未找到课程</h1>
        <p>请返回课程列表重新选择。</p>
        <Link to="/lessons">
          <button className="primary" style={{ marginTop: 16 }}>返回课程列表</button>
        </Link>
      </div>
    );
  }

  const best = progress.best[lesson.id];

  const handleStart = () => {
    if (!unlocked) {
      alert('请先完成前置关卡并达到目标要求。');
      return;
    }
    navigate(`/train/${lesson.id}`);
  };

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h1>{lesson.title}</h1>
      <p className="subtitle">{lesson.description}</p>

      {!unlocked && (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: 'rgba(234, 179, 8, 0.18)',
            color: '#92400e',
            marginTop: 16
          }}
        >
          建议先完成上一关并达到目标准确率。
        </div>
      )}

      <section style={{ marginTop: 24 }}>
        <h2>关卡目标</h2>
        <div className="chip-row" style={{ marginTop: 12 }}>
          <span className="tag">目标 WPM：{lesson.targetWpm ?? 20}</span>
          <span className="tag">目标准确率：{((lesson.targetAccuracy ?? 0.9) * 100).toFixed(0)}%</span>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>练习示例</h2>
        <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px dashed rgba(148,163,184,0.6)' }}>
          {lesson.content.map((line, index) => (
            <pre key={index} style={{ fontFamily: 'JetBrains Mono, monospace', margin: 0, padding: '6px 0' }}>
              {line}
            </pre>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>历史表现</h2>
        {best ? (
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <div className="chip-row">
              <span className="badge">最佳 WPM {best.wpm}</span>
              <span className="badge">最佳准确率 {(best.acc * 100).toFixed(1)}%</span>
              <span className="badge">星级 {best.stars} ★</span>
              <span className="badge">最近更新 {new Date(best.at).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <p style={{ color: '#475569' }}>暂无历史成绩，快来开启第一次练习吧。</p>
        )}

        {latestAttempts.length > 0 && (
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>时间</th>
                <th>WPM</th>
                <th>准确率</th>
                <th>用时</th>
              </tr>
            </thead>
            <tbody>
              {latestAttempts.map((att) => (
                <tr key={att.id}>
                  <td>{new Date(att.at).toLocaleString()}</td>
                  <td>{att.wpm}</td>
                  <td>{(att.acc * 100).toFixed(1)}%</td>
                  <td>{Math.round(att.durationMs / 1000)} s</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
        <button className="primary" onClick={handleStart}>
          开始本关
        </button>
        <Link to="/lessons">
          <button className="secondary">返回课程列表</button>
        </Link>
      </div>
    </div>
  );
};

export default LessonDetailPage;

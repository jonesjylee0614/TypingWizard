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

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h1>练习结果 · {lesson.title}</h1>
      <p className="subtitle">完成时间：{new Date(attempt.at).toLocaleString()}</p>

      <section style={{ marginTop: 16 }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>WPM</h3>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{attempt.wpm}</div>
          </div>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>准确率</h3>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{(attempt.acc * 100).toFixed(1)}%</div>
          </div>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>用时</h3>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{Math.round(attempt.durationMs / 1000)}s</div>
          </div>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <h3>星级</h3>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{'★'.repeat(attempt.stars)}</div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>击键统计</h2>
        <div className="chip-row" style={{ marginTop: 12 }}>
          <span className="badge">总击键 {attempt.totalKeystrokes}</span>
          <span className="badge">正确字符 {attempt.correct}</span>
          <span className="badge">目标字符 {attempt.textLength}</span>
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
          <p style={{ color: '#475569' }}>恭喜，没有错误击键！</p>
        )}
      </section>

      {best && (
        <section style={{ marginTop: 24 }}>
          <h2>与最佳成绩对比</h2>
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
              <p>准确率 {(attempt.acc * 100).toFixed(1)}%</p>
            </div>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2>最近三次记录</h2>
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
        </section>
      )}

      <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
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

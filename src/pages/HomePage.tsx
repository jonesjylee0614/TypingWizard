import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const HomePage = () => {
  const { app, progress, attempts, lessons } = useAppData();
  const navigate = useNavigate();
  const isFirstVisit = !app.lastLessonId;

  const lastAttemptSummary = useMemo(() => {
    if (!progress.lastAttempt) return null;
    const { lessonId, attemptId } = progress.lastAttempt;
    const list = attempts[lessonId];
    const attempt = list?.find((item) => item.id === attemptId);
    if (!attempt) return null;
    return {
      lesson: lessons[lessonId],
      attempt
    };
  }, [progress.lastAttempt, attempts, lessons]);

  const handleContinue = () => {
    if (progress.lastAttempt) {
      navigate(`/train/${progress.lastAttempt.lessonId}`);
    } else {
      navigate('/lessons');
    }
  };

  return (
    <div className="card" style={{ marginTop: 32 }}>
      <h1>{isFirstVisit ? '欢迎来到 TypingWizard' : '欢迎回来'}</h1>
      <p className="subtitle">
        {isFirstVisit
          ? '按照课程逐步练习，系统会记录你的每一次打字成绩。'
          : '继续上一关的练习，或浏览课程、历史统计。'}
      </p>

      <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
        <button className="primary" onClick={handleContinue}>
          {isFirstVisit ? '开始练习' : '继续练习'}
        </button>
        <Link to="/lessons">
          <button className="secondary">查看全部课程</button>
        </Link>
        <Link to="/stats">
          <button className="secondary">历史统计</button>
        </Link>
      </div>

      {lastAttemptSummary && (
        <div style={{ marginTop: 32 }}>
          <h2>上次成绩</h2>
          <div className="card" style={{ borderRadius: 12, boxShadow: 'none', border: '1px solid rgba(148,163,184,0.3)' }}>
            <div className="flex space-between">
              <div>
                <div style={{ fontWeight: 600 }}>{lastAttemptSummary.lesson.title}</div>
                <div style={{ color: '#475569', fontSize: 14 }}>
                  {new Date(lastAttemptSummary.attempt.at).toLocaleString()}
                </div>
              </div>
              <div className="chip-row">
                <span className="badge">WPM {lastAttemptSummary.attempt.wpm}</span>
                <span className="badge">准确率 {(lastAttemptSummary.attempt.acc * 100).toFixed(1)}%</span>
                <span className="badge">{lastAttemptSummary.attempt.stars} ★</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <section style={{ marginTop: 40 }}>
        <h2>练习流程</h2>
        <ol style={{ color: '#475569', lineHeight: 1.8 }}>
          <li>从课程列表中选择一关，了解目标与要求。</li>
          <li>进入练习页，根据提示敲击键盘，实时查看进度与准确率。</li>
          <li>练习完成后查看成绩，系统自动保存并解锁下一关。</li>
          <li>在统计页复习历史成绩，调整设置以符合你的习惯。</li>
        </ol>
      </section>
    </div>
  );
};

export default HomePage;

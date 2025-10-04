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
    <div className="card" style={{ 
      marginTop: 32,
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      border: '3px solid #f97316'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>⌨️🎮</div>
        <h1 style={{ fontSize: '36px', color: '#ea580c', marginBottom: '8px' }}>
          {isFirstVisit ? '🎉 欢迎来到 TypingWizard' : '👋 欢迎回来！'}
        </h1>
        <p style={{ fontSize: '18px', color: '#92400e', fontWeight: 500 }}>
          {isFirstVisit
            ? '🚀 开始你的打字冒险之旅，击败50个关卡的怪物！'
            : '💪 继续你的打字冒险，成为打字大师！'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="primary" onClick={handleContinue} style={{
          fontSize: '20px',
          padding: '16px 32px',
          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)'
        }}>
          {isFirstVisit ? '🎯 开始练习' : '▶️ 继续练习'}
        </button>
        <Link to="/lessons">
          <button className="secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            📚 查看全部课程
          </button>
        </Link>
        <Link to="/stats">
          <button className="secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            📊 历史统计
          </button>
        </Link>
      </div>

      {lastAttemptSummary && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ color: '#ea580c', fontSize: '24px' }}>🏆 上次成绩</h2>
          <div className="card" style={{ 
            borderRadius: 12, 
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)', 
            border: '2px solid #fdba74',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
          }}>
            <div className="flex space-between">
              <div>
                <div style={{ fontWeight: 700, color: '#92400e', fontSize: '18px' }}>
                  {lastAttemptSummary.lesson.title}
                </div>
                <div style={{ color: '#78350f', fontSize: 14, fontWeight: 500 }}>
                  📅 {new Date(lastAttemptSummary.attempt.at).toLocaleString()}
                </div>
              </div>
              <div className="chip-row">
                <span className="badge" style={{ fontSize: '14px' }}>
                  🚀 {lastAttemptSummary.attempt.wpm} WPM
                </span>
                <span className="badge" style={{ fontSize: '14px' }}>
                  🎯 {(lastAttemptSummary.attempt.acc * 100).toFixed(1)}%
                </span>
                <span className="badge" style={{ fontSize: '14px' }}>
                  ⭐ {lastAttemptSummary.attempt.stars} 星
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <section style={{ marginTop: 40 }}>
        <h2 style={{ color: '#ea580c', fontSize: '24px', marginBottom: '16px' }}>
          🎯 游戏玩法
        </h2>
        <div style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #fdba74'
        }}>
          <ol style={{ color: '#92400e', lineHeight: 2, fontSize: '16px', fontWeight: 500, marginLeft: '20px' }}>
            <li>📚 选择关卡，每个关卡都有一个怪物等着你！</li>
            <li>⌨️ 快速准确地打字，击败怪物！</li>
            <li>🔥 保持连击，解锁酷炫成就！</li>
            <li>⏱️ 在3分钟内完成，挑战你的极限！</li>
            <li>🌟 收集星星，解锁更多关卡！</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

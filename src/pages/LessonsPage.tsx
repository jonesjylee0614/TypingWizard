import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { Lesson } from '../types';
import { lessonList } from '../data/lessons';

const filters = [
  { value: 'all', label: '全部' },
  { value: 'unlocked', label: '已解锁' },
  { value: 'locked', label: '未解锁' },
  { value: 'completed', label: '已完成' }
] as const;

type FilterValue = (typeof filters)[number]['value'];

const LessonsPage = () => {
  const { lessons, progress, attempts } = useAppData();
  const [filter, setFilter] = useState<FilterValue>('all');
  const orderedLessons = useMemo(() => lessonList.map((lesson) => lessons[lesson.id] ?? lesson), [lessons]);

  const filtered = orderedLessons.filter((lesson) => {
    const unlocked = progress.unlocked.includes(lesson.id);
    const completed = (attempts[lesson.id] ?? []).length > 0;
    if (filter === 'all') return true;
    if (filter === 'unlocked') return unlocked;
    if (filter === 'locked') return !unlocked;
    if (filter === 'completed') return completed;
    return true;
  });

  const renderLessonCard = (lesson: Lesson) => {
    const unlocked = progress.unlocked.includes(lesson.id);
    const best = progress.best[lesson.id];
    const attemptCount = attempts[lesson.id]?.length ?? 0;
    
    // 根据关卡数选择怪物图标
    const lessonNumber = parseInt(lesson.id.substring(1));
    let monsterIcon = '👾';
    if (lessonNumber <= 10) monsterIcon = '👾';
    else if (lessonNumber <= 20) monsterIcon = '👻';
    else if (lessonNumber <= 30) monsterIcon = '🤖';
    else if (lessonNumber <= 40) monsterIcon = '👹';
    else monsterIcon = '🐉';

    return (
      <div key={lesson.id} className="card" style={{ 
        borderRadius: 18,
        background: unlocked 
          ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' 
          : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        border: unlocked ? '3px solid #fdba74' : '2px solid #cbd5e1',
        opacity: unlocked ? 1 : 0.7,
        transition: 'all 0.3s ease'
      }}>
        <div className="flex space-between">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 8 }}>
              <div style={{ fontSize: '36px' }}>{monsterIcon}</div>
              <h3 style={{ color: '#ea580c', marginBottom: 0 }}>{lesson.title}</h3>
            </div>
            <p style={{ color: unlocked ? '#92400e' : '#64748b', fontWeight: 500 }}>
              {lesson.description}
            </p>
            <div className="chip-row" style={{ marginTop: 12 }}>
              <span className="tag" style={{ 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#92400e',
                border: '1px solid #f59e0b'
              }}>
                🎯 准确率 {(lesson.targetAccuracy ?? 0.9) * 100}%
              </span>
              <span className="tag" style={{ 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#92400e',
                border: '1px solid #f59e0b'
              }}>
                🚀 速度 {lesson.targetWpm ?? 20} WPM
              </span>
              {attemptCount > 0 && (
                <span className="tag" style={{ 
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  color: '#1e40af',
                  border: '1px solid #3b82f6'
                }}>
                  📝 {attemptCount} 次尝试
                </span>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontWeight: 700, 
              fontSize: '18px',
              color: unlocked ? '#15803d' : '#dc2626',
              background: unlocked ? '#dcfce7' : '#fee2e2',
              padding: '8px 16px',
              borderRadius: '999px',
              border: unlocked ? '2px solid #22c55e' : '2px solid #ef4444'
            }}>
              {unlocked ? '✅ 已解锁' : '🔒 未解锁'}
            </div>
            {best && (
              <div style={{ 
                marginTop: 12, 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid #f59e0b'
              }}>
                <div style={{ fontWeight: 700, color: '#92400e', fontSize: '16px' }}>
                  ⭐ {best.stars} 星
                </div>
                <div style={{ color: '#78350f', fontSize: '14px', marginTop: '4px' }}>
                  🚀 {best.wpm} WPM
                </div>
                <div style={{ color: '#78350f', fontSize: '14px' }}>
                  🎯 {(best.acc * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
        {unlocked ? (
          <Link to={`/lesson/${lesson.id}`}>
            <button className="primary" style={{ 
              marginTop: 20,
              width: '100%',
              fontSize: '18px',
              padding: '14px'
            }}>
              ⚔️ 挑战关卡
            </button>
          </Link>
        ) : (
          <div style={{ 
            marginTop: 20, 
            color: '#dc2626',
            fontWeight: 600,
            textAlign: 'center',
            padding: '12px',
            background: '#fee2e2',
            borderRadius: '8px',
            border: '2px solid #fca5a5'
          }}>
            🔒 完成前置关卡后自动解锁
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div className="card" style={{ 
        marginBottom: 24,
        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        border: '3px solid #f97316'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🗺️⚔️</div>
          <h1 style={{ color: '#ea580c', fontSize: '32px', marginBottom: '8px' }}>冒险地图 - 50个关卡</h1>
          <p style={{ color: '#92400e', fontSize: '18px', fontWeight: 500 }}>
            击败每个关卡的怪物，成为打字大师！
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {filters.map((item) => (
            <button
              key={item.value}
              className={filter === item.value ? 'primary' : 'secondary'}
              onClick={() => setFilter(item.value)}
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              {item.value === 'all' && '🌍 '}
              {item.value === 'unlocked' && '✅ '}
              {item.value === 'locked' && '🔒 '}
              {item.value === 'completed' && '✨ '}
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid" style={{ 
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {filtered.map((lesson) => renderLessonCard(lesson))}
      </div>
    </div>
  );
};

export default LessonsPage;

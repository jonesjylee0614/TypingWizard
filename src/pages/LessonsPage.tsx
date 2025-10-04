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

    return (
      <div key={lesson.id} className="card" style={{ borderRadius: 18 }}>
        <div className="flex space-between">
          <div>
            <h3 style={{ marginBottom: 8 }}>{lesson.title}</h3>
            <p style={{ color: '#475569', maxWidth: 480 }}>{lesson.description}</p>
            <div className="chip-row" style={{ marginTop: 12 }}>
              <span className="tag">目标准确率 {(lesson.targetAccuracy ?? 0.9) * 100}%</span>
              <span className="tag">目标 WPM {lesson.targetWpm ?? 20}</span>
              {attemptCount > 0 && <span className="tag">共 {attemptCount} 次尝试</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, color: unlocked ? '#15803d' : '#dc2626' }}>
              {unlocked ? '已解锁' : '未解锁'}
            </div>
            {best && (
              <div style={{ marginTop: 12, color: '#0f172a' }}>
                <div>最佳：{best.stars} ★</div>
                <div>WPM {best.wpm}</div>
                <div>准确率 {(best.acc * 100).toFixed(1)}%</div>
              </div>
            )}
          </div>
        </div>
        {unlocked ? (
          <Link to={`/lesson/${lesson.id}`}>
            <button className="primary" style={{ marginTop: 20 }}>进入关卡</button>
          </Link>
        ) : (
          <div style={{ marginTop: 20, color: '#b91c1c' }}>完成前置关卡后自动解锁</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div className="card" style={{ marginBottom: 24 }}>
        <h1>课程列表</h1>
        <p className="subtitle">完成上一关并达成目标即可解锁下一关。</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {filters.map((item) => (
            <button
              key={item.value}
              className={filter === item.value ? 'primary' : 'secondary'}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {filtered.map((lesson) => renderLessonCard(lesson))}
      </div>
    </div>
  );
};

export default LessonsPage;

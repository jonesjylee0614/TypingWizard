import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import TrainPage from './pages/TrainPage';
import ResultPage from './pages/ResultPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import { useAppData } from './context/AppDataContext';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/lessons', label: '课程' },
  { to: '/stats', label: '统计' },
  { to: '/settings', label: '设置' },
  { to: '/about', label: '关于' }
];

const App = () => {
  const { app } = useAppData();
  return (
    <div>
      <header style={{ background: '#0f172a', color: '#fff', padding: '12px 24px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>TypingWizard 学生端</strong>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>离线练习 · 版本 {app.version}</div>
          </div>
          <nav style={{ display: 'flex', gap: 16 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  color: isActive ? '#facc15' : '#fff',
                  fontWeight: isActive ? 700 : 500
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container" style={{ paddingBottom: 80 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lesson/:lessonId" element={<LessonDetailPage />} />
          <Route path="/train/:lessonId" element={<TrainPage />} />
          <Route path="/result/:lessonId/:attemptId" element={<ResultPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: 12 }}>
        © {new Date().getFullYear()} TypingWizard · 所有数据仅存储在浏览器本地
      </footer>
    </div>
  );
};

export default App;

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
      <header style={{ 
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', 
        color: '#fff', 
        padding: '16px 24px',
        boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⌨️ TypingWizard
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>🎮 快乐打字 · 版本 {app.version}</div>
          </div>
          <nav style={{ display: 'flex', gap: 16 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  color: '#fff',
                  fontWeight: isActive ? 700 : 500,
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '16px'
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

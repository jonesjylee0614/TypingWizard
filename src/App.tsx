import { useEffect, useState } from 'react';
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
  const getIsMobile = () => (typeof window !== 'undefined' ? window.innerWidth < 900 : false);
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const evaluateViewport = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    evaluateViewport();
    window.addEventListener('resize', evaluateViewport);

    return () => {
      window.removeEventListener('resize', evaluateViewport);
    };
  }, []);

  return (
    <div className="app-shell">
      <header className={`app-header${isMenuOpen ? ' menu-open' : ''}`}>
        <div className="app-header-inner">
          <div className="app-logo" title={`TypingWizard · 版本 ${app.version}`}>
            ⌨️ TypingWizard
          </div>
          {isMobile ? (
            <button
              type="button"
              className="app-menu-toggle"
              aria-label="切换导航菜单"
              aria-expanded={isMenuOpen}
              aria-controls="app-nav-menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          ) : (
            <nav className="app-nav app-nav-desktop">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
        {isMobile && (
          <nav
            id="app-nav-menu"
            className={`app-nav app-nav-mobile${isMenuOpen ? ' open' : ''}`}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main className="container app-main">
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
      <footer className="app-footer">
        © {new Date().getFullYear()} TypingWizard · 所有数据仅存储在浏览器本地
      </footer>
    </div>
  );
};

export default App;

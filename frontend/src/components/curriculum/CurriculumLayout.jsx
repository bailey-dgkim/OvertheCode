import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const navClassName = ({ isActive }) => (
  'cv2-nav__link' + (isActive ? ' cv2-nav__link--active' : '')
);

function CurriculumLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="cv2-shell">
      <a className="cv2-skip-link" href="#cv2-main">
        본문으로 바로가기
      </a>

      <header className="cv2-header">
        <div className="cv2-header__inner">
          <Link className="cv2-brand" to="/" aria-label="Over the Code 첫 화면">
            <span className="cv2-brand__mark" aria-hidden="true">O</span>
            <span>Over the Code</span>
          </Link>

          <nav className="cv2-nav" aria-label="주요 메뉴">
            <NavLink className={navClassName} to="/curriculum">
              커리큘럼
            </NavLink>
            <NavLink className={navClassName} to="/diagnosis">
              진단
            </NavLink>
            <NavLink className={navClassName} to="/concepts">
              개념 사전
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="cv2-main" id="cv2-main">
        <Outlet />
      </main>

      <footer className="cv2-footer">
        <div className="cv2-container cv2-footer__inner">
          <span>Over the Code</span>
          <span>코드를 넘어, 시스템을 이해하고 책임지는 법</span>
        </div>
      </footer>
    </div>
  );
}

export default CurriculumLayout;

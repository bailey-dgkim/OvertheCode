import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import './styles/tokens.css';
import './styles/learning.css';
import './styles/landing.css';
import './styles/curriculum.css';
import './styles/chapter-player.css';

import LandingScreen from './components/landing/LandingScreen';
import CurriculumLayout from './components/curriculum/CurriculumLayout';
import CurriculumHome from './components/curriculum/CurriculumHome';
import PartDetail from './components/curriculum/PartDetail';
import ChapterEntry from './components/curriculum/ChapterEntry';
import ChapterPlayer from './components/learning/ChapterPlayer';
import PlaceholderScreen from './components/curriculum/PlaceholderScreen';
import NotFoundScreen from './components/curriculum/NotFoundScreen';

function LandingRoute() {
  const navigate = useNavigate();
  return <LandingScreen onStart={() => navigate('/curriculum')} />;
}

function App() {
  return (
    <div className="oc-app">
      <Routes>
        <Route path="/" element={<LandingRoute />} />

        <Route element={<CurriculumLayout />}>
          <Route path="curriculum" element={<CurriculumHome />} />
          <Route path="parts/:partId" element={<PartDetail />} />
          <Route path="chapters/:chapterId" element={<ChapterEntry />} />
          <Route path="chapters/:chapterId/learn" element={<ChapterPlayer />} />
          <Route
            path="diagnosis"
            element={(
              <PlaceholderScreen
                eyebrow="Engineering Diagnosis"
                title="엔지니어링 진단"
                description="커리큘럼의 학습 경험이 완성된 뒤, 같은 JSON 구조로 진단을 연결합니다."
              />
            )}
          />
          <Route
            path="concepts"
            element={(
              <PlaceholderScreen
                eyebrow="Concepts"
                title="개념 사전"
                description="Chapter에서 만난 개념을 시스템 맵과 함께 복습할 수 있도록 준비하고 있습니다."
              />
            )}
          />
          <Route
            path="final"
            element={(
              <PlaceholderScreen
                eyebrow="Final Project"
                title="AI가 만든 서비스를 엔지니어링하기"
                description="다섯 Part의 학습을 하나의 시스템에 적용하는 종합 프로젝트입니다."
              />
            )}
          />
          <Route path="*" element={<NotFoundScreen />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

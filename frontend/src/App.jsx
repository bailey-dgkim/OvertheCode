import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import './styles/tokens.css';
import './styles/learning.css';
import './styles/curriculum.css';
import './styles/chapter-player.css';
import './styles/chapter-conversation.css';
import './styles/foundation-lesson.css';
import './styles/state-lesson.css';
import './styles/input-lesson.css';
import './styles/api-lesson.css';
import './styles/certification-quiz.css';
import './styles/dark-theme.css';
import './styles/landing.css';

import LandingScreen from './components/landing/LandingScreen';
import DiagnosisScreen from './components/landing/DiagnosisScreen';
import CurriculumLayout from './components/curriculum/CurriculumLayout';
import CurriculumHome from './components/curriculum/CurriculumHome';
import PartDetail from './components/curriculum/PartDetail';
import ChapterPlayer from './components/learning/ChapterPlayer';
import PlaceholderScreen from './components/curriculum/PlaceholderScreen';
import NotFoundScreen from './components/curriculum/NotFoundScreen';
import FrontendCertificationQuiz from './components/curriculum/FrontendCertificationQuiz';

function LandingRoute() {
  const navigate = useNavigate();
  return <LandingScreen onDiagnosis={() => navigate('/diagnosis')} />;
}

function App() {
  return (
    <div className="oc-app">
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="diagnosis" element={<DiagnosisScreen />} />

        <Route element={<CurriculumLayout />}>
          <Route path="curriculum" element={<CurriculumHome />} />
          <Route path="parts/:partId" element={<PartDetail />} />
          <Route path="parts/frontend/quiz" element={<FrontendCertificationQuiz />} />
          <Route path="chapters/:chapterId" element={<ChapterPlayer />} />
          <Route path="chapters/:chapterId/learn" element={<ChapterPlayer />} />
          <Route
            path="concepts"
            element={(
              <PlaceholderScreen
                eyebrow="Concepts"
                title="개념 사전"
                description="Chapter에서 만난 핵심 개념을 한곳에서 복습할 수 있도록 준비하고 있습니다."
              />
            )}
          />
          <Route
            path="final"
            element={(
              <PlaceholderScreen
                eyebrow="Final Project"
                title="AI가 만든 서비스를 엔지니어링하기"
                description="여덟 Part의 학습을 하나의 시스템에 적용하는 종합 프로젝트입니다."
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

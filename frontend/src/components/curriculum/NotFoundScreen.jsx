import { Link } from 'react-router-dom';

function NotFoundScreen({
  title = '페이지를 찾을 수 없습니다',
  description = '주소가 바뀌었거나 아직 준비되지 않은 화면입니다.',
}) {
  return (
    <section className="cv2-container cv2-status-page" aria-labelledby="not-found-title">
      <p className="cv2-eyebrow">Not Found</p>
      <h1 id="not-found-title">{title}</h1>
      <p>{description}</p>
      <Link className="cv2-button cv2-button--primary" to="/curriculum">
        커리큘럼 홈으로
      </Link>
    </section>
  );
}

export default NotFoundScreen;

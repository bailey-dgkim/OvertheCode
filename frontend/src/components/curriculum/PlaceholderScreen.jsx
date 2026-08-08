import { Link } from 'react-router-dom';

function PlaceholderScreen({ eyebrow, title, description }) {
  return (
    <section className="cv2-container cv2-status-page" aria-labelledby="placeholder-title">
      <span className="cv2-status-badge">준비 중</span>
      <p className="cv2-eyebrow">{eyebrow}</p>
      <h1 id="placeholder-title">{title}</h1>
      <p>{description}</p>
      <Link className="cv2-button cv2-button--primary" to="/curriculum">
        커리큘럼 홈으로
      </Link>
    </section>
  );
}

export default PlaceholderScreen;

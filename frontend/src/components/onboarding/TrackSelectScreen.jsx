import Badge from '../common/Badge';
import { learningTracks, TRACK_COMING_SOON_MESSAGE } from '../../data/learningTracks';

function TrackCard({ track, onSelect }) {
  const available = track.status === 'available';

  return (
    <button
      type="button"
      className={`oc-card oc-track oc-track--${available ? 'available' : 'disabled'}`}
      onClick={() => onSelect(track)}
      aria-disabled={!available}
      aria-label={`${track.title} 트랙 · ${track.statusLabel}`}
    >
      <div className="oc-track__head">
        <h2 className="oc-track__title">{track.title}</h2>
        <Badge variant={available ? 'success' : 'neutral'}>{track.statusLabel}</Badge>
      </div>

      <p className="oc-track__desc">{track.description}</p>

      <div className="oc-track__examples">
        {track.examples.map((example) => (
          <Badge key={example} variant="neutral">
            {example}
          </Badge>
        ))}
      </div>
    </button>
  );
}

function TrackSelectScreen({ onSelectTrack, onComingSoon, onBack }) {
  const handleSelect = (track) => {
    if (track.status !== 'available') {
      onComingSoon(TRACK_COMING_SOON_MESSAGE);
      return;
    }
    onSelectTrack(track.id);
  };

  return (
    <main className="oc-screen">
      <div className="oc-container">
        <button type="button" className="oc-btn oc-btn--ghost" onClick={onBack}>
          ← 처음으로
        </button>
        <p className="oc-eyebrow">Step 1</p>
        <h1>학습 트랙을 선택하세요</h1>
        <p className="oc-muted" style={{ marginTop: 8 }}>
          기능을 새로 만드는 과정과, 운영 중 발생한 문제를 해결하는 과정 중에서 선택합니다.
        </p>

        <div className="oc-track-grid">
          {learningTracks.map((track) => (
            <TrackCard key={track.id} track={track} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default TrackSelectScreen;

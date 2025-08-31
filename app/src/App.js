import { useEffect, useState } from 'react';
import TrackCard from './TrackCard';
import ModalWindow from './modalWindow';
import Recenzia from './recenzia';
import './App.css';

const tg = window.Telegram.WebApp;

function App() {
  useEffect(() => {
    tg.ready();
  }, []);


  const [tracks, setTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [trackUrl, setTrackUrl] = useState("");
  const [reviewTrack, setReviewTrack] = useState(null);
  const [reviews, setReviews] = useState({});

  const openModal = () => {
    setShowModal(true);
    setTrackUrl("");
  };

  const closeModal = () => {
    setShowModal(false);
    setTrackUrl("");
  };

  async function fetchTrackMeta(url) {
    try {
      const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const getMeta = (property) => doc.querySelector(`meta[property='${property}']`)?.content || '';
      return {
        title: getMeta('og:title'),
        description: getMeta('og:description'),
        image: getMeta('og:image'),
        url,
      };
    } catch (e) {
      return { title: '', description: '', image: '', url };
    }
  }

  const handleCreateTrack = async () => {
    if (trackUrl.trim() !== "") {
      const meta = await fetchTrackMeta(trackUrl);
      const id = Date.now();
      setTracks(prev => [...prev, { id, ...meta }]);
      closeModal();
    }
  };

  const onClose = () => {
    tg.close();
  }

  return (
    <div className="App">
      <h1>{tg.initData.user}</h1>
      <button onClick={onClose}>Close</button>


      <ModalWindow show={showModal} title="Введите URL трека" onClose={closeModal}>
        <input
          type="text"
          value={trackUrl}
          onChange={e => setTrackUrl(e.target.value)}
          placeholder="https://..."
          autoFocus
        />
        <div className="modal-actions">
          <button onClick={handleCreateTrack} className="btn create-btn">Создать</button>
        </div>
      </ModalWindow>

      <div className="tracks-grid">
        {tracks.map(track => (
          <TrackCard key={track.id} {...track} onOpen={() => setReviewTrack(track)} />
        ))}
      </div>

      {reviewTrack && (
        <Recenzia
          track={reviewTrack}
          reviews={reviews}
          setReviews={setReviews}
          onClose={() => setReviewTrack(null)}
        />
      )}
      <footer className="footer-bar">
  <button className="btn add-btn" onClick={openModal} aria-label="Добавить трек">+</button>
      </footer>
    </div>
  );
}

export default App;

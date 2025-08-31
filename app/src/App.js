import { useEffect, useState } from 'react';
import TrackCard from './TrackCard';
import './App.css';

const tg = window.Telegram.WebApp;

function App() {
  useEffect(() => {
    tg.ready();
  }, []);


  const [tracks, setTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [trackUrl, setTrackUrl] = useState("");

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
      setTracks([...tracks, { id: Date.now(), ...meta }]);
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
      <button onClick={openModal} style={{ marginTop: 16 }}>Добавить трек</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window">
            <h3>Введите URL трека</h3>
            <input
              type="text"
              value={trackUrl}
              onChange={e => setTrackUrl(e.target.value)}
              placeholder="https://..."
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={handleCreateTrack} className="create-btn">Создать</button>
              <button onClick={closeModal} className="cancel-btn">Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className="tracks-grid">
        {tracks.map(track => (
          <TrackCard key={track.id} {...track} />
        ))}
      </div>
    </div>
  );
}

export default App;

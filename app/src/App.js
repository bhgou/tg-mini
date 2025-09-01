import { useEffect, useState } from 'react';
import TrackCard from './TrackCard';
import ModalWindow from './modalWindow';
import Recenzia from './recenzia';
import API_CFG from './api.cfg';
import './App.css';

const tg = window.Telegram?.WebApp;

function App() {
  const [tracks, setTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [trackUrl, setTrackUrl] = useState("");
  const [reviewTrack, setReviewTrack] = useState(null);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    tg?.ready();
    fetchTracksFromApi();
  }, []);

  async function fetchTracksFromApi() {
    try {
      const response = await fetch(API_CFG.BASE + API_CFG.TRACKS);
      if (!response.ok) throw new Error('Ошибка загрузки треков');
      const apiTracks = await response.json();
      setTracks(apiTracks);
    } catch (e) {
      setTracks([]);
    }
  }

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
      const response = await fetch(url);
      const html = await response.text();
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      function getMeta(name) {
        const tag = doc.querySelector(`meta[property='${name}']`);
        return tag ? tag.content : '';
      }
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
      // Получаем все треки и вычисляем максимальный id
      let id = 1;
      if (Array.isArray(tracks) && tracks.length > 0) {
        id = Math.max(...tracks.map(t => t.id || 0)) + 1;
      }
      setTracks(prev => [...prev, { id, ...meta }]);
      closeModal();
      // Отправляем массив, как ожидает backend
      await fetch(API_CFG.BASE + API_CFG.ADD_TRACK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ id, url: trackUrl }])
      });
    }
  };

  const onClose = () => {
    tg.close();
  }

  async function fetchTracksFromApi() {
    try {
      const res = await fetch('http://localhost:5230/api/list/tracks');
      if (!res.ok) throw new Error('Ошибка загрузки треков');
      const apiTracks = await res.json();
      setTracks(apiTracks);
    } catch (e) {
      // Можно добавить обработку ошибки
      setTracks([]);
    }
  }

  return (
    <div className="App">
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

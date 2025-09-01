import { useEffect } from 'react';
import API_CFG from './api.cfg';
import React, { useState } from 'react';

const tg = window.Telegram?.WebApp;

function Recenzia({ track, reviews, setReviews, onClose }) {
  useEffect(() => {
    if (!track) return;
    async function fetchRecenzii() {
  const res = await fetch(API_CFG.BASE + API_CFG.RECENZII);
      const all = await res.json();
      // Фильтруем только рецензии для текущего трека
      const filtered = all.filter(r => r.id === track.id);
      setReviews(prev => ({ ...prev, [track.id]: filtered }));
    }
    fetchRecenzii();
  }, [track, setReviews]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [score, setScore] = useState(5);
  const [genre, setGenre] = useState(5);
  const [charisma, setCharisma] = useState(5);
  const [style, setStyle] = useState(5);
  const [vibe, setVibe] = useState(5);

  const user = tg?.initDataUnsafe?.user || {};

  if (!track) return null;

  // Добавить рецензию в API
  async function addRecenziaToApi(recenziaObj) {
  await fetch(API_CFG.BASE + API_CFG.ADD_RECENZIA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([recenziaObj])
    });
  }

  return (
    <div className="recenzia-fullscreen">
      <button className="recenzia-close" onClick={() => { onClose(); setShowAddReview(false); setNewReview(""); }}>&times;</button>
      {!showAddReview && (
        <div className="recenzia-list-block">
          <b style={{marginTop: 16, display: 'block'}}>Рецензии:</b>
          <button className="btn create-btn recenzia-add-btn" onClick={() => setShowAddReview(true)}>
            + Создать рецензию
          </button>
          <ul className="recenzia-list">
            {(reviews[track.id]?.length > 0)
              ? reviews[track.id].map((r, i) => (
                  <li key={i} className="recenzia-list-item">
                    <div className="recenzia-list-header">
                      <img className="recenzia-avatar" src={r.user?.photo_url || 'https://ui-avatars.com/api/?name=' + (r.user?.username || 'U')} alt="avatar" />
                      <div>
                        <div className="recenzia-username">{r.user?.username || r.user?.first_name || 'User'}</div>
                        <div className="recenzia-date">{r.date}</div>
                      </div>
                      <div className="recenzia-score-value">{r.score}/10</div>
                    </div>
                    <div className="recenzia-list-text">{r.text}</div>
                    <div className="recenzia-list-sliders">
                      <span>Индивидуальность жанра: <b>{r.genre}</b></span>
                      <span>Харизма: <b>{r.charisma}</b></span>
                      <span>Реализация стиля: <b>{r.style}</b></span>
                      <span>Вайб трека: <b>{r.vibe}</b></span>
                    </div>
                  </li>
                ))
              : <li className="recenzia-list-item" style={{ color: '#aaa' }}>Пока нет рецензий</li>}
          </ul>
        </div>
      )}
      {showAddReview && (
        <div className="recenzia-add-form-block">
          <div className="recenzia-header">
            <img className="recenzia-avatar" src={user.photo_url || 'https://ui-avatars.com/api/?name=' + (user.username || 'U')} alt="avatar" />
            <div>
              <div className="recenzia-username">{user.username || user.first_name || 'User'}</div>
              <div className="recenzia-date">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div className="recenzia-track">
            <b>{track.title || 'Без названия'}</b>
            <div className="recenzia-url">{track.url}</div>
          </div>
          <div className="recenzia-score-block">
            <div className="recenzia-score-label">Общий балл:</div>
            <div className="recenzia-score-value">{score}/10</div>
            <div className="recenzia-score-range">
              <input type="range" min="1" max="10" value={score} onChange={e => setScore(Number(e.target.value))} className="recenzia-slider" />
            </div>
          </div>
          <div className="recenzia-sliders">
            <div className="recenzia-slider-row">
              <span>Индивидуальность жанра</span>
              <input type="range" min="1" max="10" value={genre} onChange={e => setGenre(Number(e.target.value))} className="recenzia-slider" />
              <span className="recenzia-slider-value">{genre}</span>
            </div>
            <div className="recenzia-slider-row">
              <span>Харизма</span>
              <input type="range" min="1" max="10" value={charisma} onChange={e => setCharisma(Number(e.target.value))} className="recenzia-slider" />
              <span className="recenzia-slider-value">{charisma}</span>
            </div>
            <div className="recenzia-slider-row">
              <span>Реализация стиля</span>
              <input type="range" min="1" max="10" value={style} onChange={e => setStyle(Number(e.target.value))} className="recenzia-slider" />
              <span className="recenzia-slider-value">{style}</span>
            </div>
            <div className="recenzia-slider-row">
              <span>Вайб трека</span>
              <input type="range" min="1" max="10" value={vibe} onChange={e => setVibe(Number(e.target.value))} className="recenzia-slider" />
              <span className="recenzia-slider-value">{vibe}</span>
            </div>
          </div>
          <form className="recenzia-form" onSubmit={async e => {
            e.preventDefault();
            if (newReview.trim()) {
              const recenziaObj = {
                id: track.id,
                name: user.username || user.first_name || "User",
                date: new Date().toLocaleDateString(),
                text: newReview,
                individ: genre,
                harizma: charisma,
                vibe: vibe
              };
              await addRecenziaToApi(recenziaObj);
              setReviews(prev => ({
                ...prev,
                [track.id]: [
                  ...(prev[track.id] || []),
                  recenziaObj
                ]
              }));
              setNewReview("");
              setShowAddReview(false);
            }
          }}>
            <textarea
              className="recenzia-textarea"
              placeholder="Ваша рецензия..."
              value={newReview}
              onChange={e => {
                if (e.target.value.length <= 500) setNewReview(e.target.value);
              }}
              maxLength={500}
              autoFocus
            />
            <div className="recenzia-char-limit">{newReview.length}/500</div>
            <div className="recenzia-actions">
              <button className="btn create-btn" type="submit">Сохранить</button>
              <button className="btn cancel-btn" type="button" onClick={() => { setShowAddReview(false); setNewReview(""); }}>Отмена</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Recenzia;
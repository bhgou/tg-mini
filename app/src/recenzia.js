
import React, { useState } from 'react';
import ModalWindow from './modalWindow';

function Recenzia({ track, reviews, setReviews, onClose }) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState("");

  if (!track) return null;

  return (
    <ModalWindow show={true} title={track.title || 'Рецензии'} onClose={() => { onClose(); setShowAddReview(false); setNewReview(""); }}>
      <div style={{ marginBottom: 12 }}>
        <b>{track.title || 'Без названия'}</b>
        <div style={{ fontSize: 12, color: '#888' }}>{track.url}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Рецензии:</b>
        <ul style={{ paddingLeft: 18, margin: 0, marginTop: 6, marginBottom: 6, maxHeight: 120, overflowY: 'auto' }}>
          {(reviews[track.id]?.length > 0)
            ? reviews[track.id].map((r, i) => (
                <li key={i} style={{ fontSize: 13, marginBottom: 4 }}>
                  {r.text} <span style={{ color: '#aaa', fontSize: 11 }}>({r.date})</span>
                </li>
              ))
            : <li style={{ color: '#aaa', fontSize: 13 }}>Пока нет рецензий</li>}
        </ul>
        {!showAddReview && (
              <button className="btn create-btn" style={{ fontSize: 14, padding: '6px 14px' }} onClick={() => setShowAddReview(true)}>Добавить рецензию</button>
        )}
      </div>
      {showAddReview && (
        <form onSubmit={e => {
          e.preventDefault();
          if (newReview.trim()) {
            setReviews(prev => ({
              ...prev,
              [track.id]: [
                ...(prev[track.id] || []),
                { text: newReview, date: new Date().toLocaleDateString() }
              ]
            }));
            setNewReview("");
            setShowAddReview(false);
          }
        }}>
          <textarea
            style={{ width: '100%', minHeight: 60, borderRadius: 8, padding: 8, marginBottom: 8 }}
            placeholder="Ваша рецензия..."
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
            autoFocus
          />
              <button className="btn create-btn" type="submit">Сохранить</button>
              <button className="btn cancel-btn" type="button" onClick={() => { setShowAddReview(false); setNewReview(""); }}>Отмена</button>
        </form>
      )}
    </ModalWindow>
  );
}

export default Recenzia;
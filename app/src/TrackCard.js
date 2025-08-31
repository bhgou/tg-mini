function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function TrackCard({ url, title, description, image, onOpen }) {
  return (
    <div className="track-card" onClick={onOpen}>
      {image && <img src={image} alt={escapeHtml(title)} className="track-img" />}
      <div className="track-title">{escapeHtml(title) || 'Без названия'}</div>
      <div className="track-desc">{escapeHtml(description)}</div>
      <div className="track-url">{escapeHtml(url)}</div>
    </div>
  );
}

export default TrackCard;

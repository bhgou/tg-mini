function TrackCard({ url, title, description, image, onOpen }) {
  return (
    <div className="track-card" onClick={onOpen}>
      {image && <img src={image} alt={title} className="track-img" />}
      <div className="track-title">{title || 'Без названия'}</div>
      <div className="track-desc">{description}</div>
      <div className="track-url">{url}</div>
    </div>
  );
}

export default TrackCard;

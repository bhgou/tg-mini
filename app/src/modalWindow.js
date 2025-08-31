import React from "react";


function ModalWindow({ show, title, children, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-window">
        {title && <h3>{title}</h3>}
        {children}
        <div className="modal-actions">
              <button onClick={onClose} className="btn cancel-btn">Отмена</button>
        </div>
      </div>
    </div>
  );
}

export default ModalWindow;

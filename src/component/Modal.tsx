import React from 'react';  
import './Modal.css'

interface ModalProps {
    message: string | null;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    if (!message) return null; // Don't render if no message

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{message}</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
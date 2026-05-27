import React from 'react';
import { Check } from 'lucide-react';
import './AccentModal.css';

interface AccentModalProps {
  accent: 'raycast-red' | 'cit-gold' | 'cit-maroon';
  onAccentChange: (newAccent: 'raycast-red' | 'cit-gold' | 'cit-maroon') => void;
  onClose: () => void;
}

export const AccentModal: React.FC<AccentModalProps> = ({
  accent,
  onAccentChange,
  onClose,
}) => {
  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={(e) => e.stopPropagation()}>
        <div className="action-modal-header">Switch Portfolio Accent</div>
        <div className="action-modal-list">
          <div
            className={`action-modal-item ${accent === 'raycast-red' ? 'active' : ''}`}
            onClick={() => onAccentChange('raycast-red')}
          >
            <div className="action-modal-item-left">
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#ff3b30',
                }}
              ></span>
              <span>Raycast Crimson Red</span>
            </div>
            {accent === 'raycast-red' && (
              <Check size={14} style={{ color: 'var(--accent-color)' }} />
            )}
          </div>
          <div
            className={`action-modal-item ${accent === 'cit-gold' ? 'active' : ''}`}
            onClick={() => onAccentChange('cit-gold')}
          >
            <div className="action-modal-item-left">
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#ffc72c',
                }}
              ></span>
              <span>CIT-U Gold Accent</span>
            </div>
            {accent === 'cit-gold' && (
              <Check size={14} style={{ color: 'var(--accent-color)' }} />
            )}
          </div>
          <div
            className={`action-modal-item ${accent === 'cit-maroon' ? 'active' : ''}`}
            onClick={() => onAccentChange('cit-maroon')}
          >
            <div className="action-modal-item-left">
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#b31010',
                }}
              ></span>
              <span>CIT-U Maroon Accent</span>
            </div>
            {accent === 'cit-maroon' && (
              <Check size={14} style={{ color: 'var(--accent-color)' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

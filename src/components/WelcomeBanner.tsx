import React from 'react';
import { X } from 'lucide-react';
import './WelcomeBanner.css';

interface WelcomeBannerProps {
  onClose: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onClose }) => {
  return (
    <div className="welcome-banner" onClick={(e) => e.stopPropagation()}>
      <div className="welcome-logo">W</div>
      <div>
        <strong>CIT-U Portfolio Explorer</strong>. Press <kbd>Tab</kbd> for themes or type <kbd>↑↓</kbd> / <kbd>↵</kbd> to explore.
      </div>
      <div className="welcome-banner-close" onClick={onClose}>
        <X size={15} />
      </div>
    </div>
  );
};

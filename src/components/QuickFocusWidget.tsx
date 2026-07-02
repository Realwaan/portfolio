import React from 'react';
import { Sparkles } from 'lucide-react';
import './QuickFocusWidget.css';

interface QuickFocusWidgetProps {
  accent: string;
}

export const QuickFocusWidget: React.FC<QuickFocusWidgetProps> = ({ accent }) => {
  const getAccentLabel = () => {
    switch (accent) {
      case 'cit-gold': return 'CIT-U Gold';
      case 'cit-maroon': return 'CIT-U Maroon';
      case 'emerald-cyber': return 'Emerald Cyber';
      case 'raycast-red': default: return 'Raycast Red';
    }
  };

  return (
    <div className="quick-focus-widget glass-panel font-mono" onClick={(e) => e.stopPropagation()}>
      <div className="quick-focus-header">
        <div className="quick-focus-title">
          <Sparkles size={13} className="text-accent" />
          <span>Productivity & Shortcuts</span>
        </div>
        <span className="quick-focus-badge">{getAccentLabel()}</span>
      </div>

      <div className="quick-focus-shortcuts-grid">
        <div className="shortcut-item">
          <kbd>/</kbd> or <kbd>Ctrl+K</kbd>
          <span className="shortcut-label">Search</span>
        </div>
        <div className="shortcut-item">
          <kbd>Tab</kbd>
          <span className="shortcut-label">Themes</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl + \</kbd>
          <span className="shortcut-label">CLI Mode</span>
        </div>
        <div className="shortcut-item">
          <kbd>Esc</kbd>
          <span className="shortcut-label">Back</span>
        </div>
      </div>

      <div className="quick-focus-footer">
        <div className="status-indicator-dot" />
        <span>CIT-U BSCS 2023-2024 · Active Session</span>
      </div>
    </div>
  );
};

import React from 'react';
import { Terminal, Settings } from 'lucide-react';
import './ActionPanel.css';


interface ActionPanelProps {
  onActionClick: () => void;
  accent: 'raycast-red' | 'cit-gold' | 'cit-maroon';
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onActionClick, accent }) => {
  const getAccentLabel = () => {
    switch (accent) {
      case 'cit-gold': return 'CIT-U Gold';
      case 'cit-maroon': return 'CIT-U Maroon';
      case 'raycast-red': default: return 'Raycast Red';
    }
  };

  return (
    <footer className="action-panel">
      <div className="action-left">
        <Terminal size={14} />
        <span>Portfolio Command System</span>
      </div>
      <div className="action-right">
        <span className="keyboard-shortcut-hint">
          <kbd>↑↓</kbd> <span>Navigate</span>
        </span>
        <span className="keyboard-shortcut-hint">
          <kbd>↵</kbd> <span>Open / Select</span>
        </span>
        <span 
          className="settings-action-trigger" 
          onClick={onActionClick}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', cursor: 'pointer' }}
        >
          <kbd className="keyboard-shortcut-hint">Tab</kbd> 
          <span>Actions ({getAccentLabel()})</span>
          <Settings size={12} style={{ opacity: 0.8 }} />
        </span>
      </div>
    </footer>
  );
};

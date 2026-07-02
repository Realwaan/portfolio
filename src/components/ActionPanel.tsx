import React from 'react';
import { Terminal, Settings } from 'lucide-react';
import './ActionPanel.css';


import type { AccentType } from './AccentModal';

interface ActionPanelProps {
  onActionClick: () => void;
  accent: AccentType;
  onTerminalToggle?: () => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onActionClick, accent, onTerminalToggle }) => {
  const getAccentLabel = () => {
    switch (accent) {
      case 'cit-gold': return 'CIT-U Gold';
      case 'cit-maroon': return 'CIT-U Maroon';
      case 'emerald-cyber': return 'Emerald Cyber';
      case 'raycast-red': default: return 'Raycast Red';
    }
  };

  return (
    <footer className="action-panel">
      <div 
        className="action-left" 
        onClick={onTerminalToggle}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <Terminal size={14} style={{ color: 'var(--accent-color)' }} />
        <span>Command CLI System</span>
        <kbd style={{ marginLeft: '4px', fontSize: '8px' }}>Ctrl + \</kbd>
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

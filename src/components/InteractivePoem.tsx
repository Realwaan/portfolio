import React, { useState } from 'react';
import { Sparkles, Copy, Check, ChevronLeft, ChevronRight, BookOpen, Heart } from 'lucide-react';
import './InteractivePoem.css';

const stanzas = [
  [
    "sa di inaasahang oras at panahon,",
    "ikay aking natunton.",
    "sa titig ng mga mata'y nahumaling,",
    "simula noo'y ikaw na ang hinihiling."
  ],
  [
    "sa bawat pintig ng pusong nag-aalangan,",
    "pangalan mo ang tahimik na binabanggit sa hangin.",
    "di man sigurado sa landas na tatahakin,",
    "ikaw ang direksyong nais kong tahakin."
  ],
  [
    "sa gitna ng ingay ng mundong magulo,",
    "ikaw ang payapang himig na totoo.",
    "at kung ang bukas ay may dalang unos,",
    "ikaw ang pahingang susubokang abutin ng lubos."
  ],
  [
    "sapagkat sa di inaasahang oras at panahon,",
    "ikaw ang naging panalangin at tugon.",
    "at sa bawat pag-ibig na aking aaminin,",
    "ikaw ang simula, ikaw ang hangganing pipiliin."
  ]
];

export const InteractivePoem: React.FC = () => {
  const [currentStanza, setCurrentStanza] = useState(0);
  const [showFullPoem, setShowFullPoem] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const fullText = stanzas.map((s) => s.join('\n')).join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(`Panalangin at Tugon\n\n${fullText}`);
    setCopied(true);
    window.dispatchEvent(
      new CustomEvent('trigger-toast', {
        detail: { message: 'Poem copied to clipboard!' },
      })
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
    window.dispatchEvent(
      new CustomEvent('trigger-toast', {
        detail: { message: liked ? 'Removed from favorites' : '💖 Added poem to favorites!' },
      })
    );
  };

  return (
    <div className="poem-showcase-container">
      {/* Header Info */}
      <div className="poem-showcase-header">
        <div className="poem-showcase-badge">
          <Sparkles size={12} className="text-accent" />
          <span>Poetic Expression</span>
        </div>
        <h2 className="poem-showcase-title">Panalangin at Tugon</h2>
        <p className="poem-showcase-subtitle">An original Tagalog poem on destiny, devotion, and quiet quietude.</p>
      </div>

      {/* Control Actions Bar */}
      <div className="poem-actions-bar">
        <button
          className={`poem-tab-btn ${!showFullPoem ? 'active' : ''}`}
          onClick={() => setShowFullPoem(false)}
        >
          <span>Stanza Cards</span>
        </button>
        <button
          className={`poem-tab-btn ${showFullPoem ? 'active' : ''}`}
          onClick={() => setShowFullPoem(true)}
        >
          <BookOpen size={13} />
          <span>Full Poem</span>
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            className={`poem-icon-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            title="Favorite Poem"
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button className="poem-icon-btn" onClick={handleCopy} title="Copy Poem Text">
            {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Main Poem Display Card */}
      <div className="poem-main-card glass-panel">
        <div className="poem-ambient-glow" />

        {!showFullPoem ? (
          /* Stanza Carousel View */
          <div className="stanza-view-wrapper">
            <div className="stanza-indicator">
              <span>Stanza {currentStanza + 1} of {stanzas.length}</span>
            </div>
            <div className="stanza-content">
              {stanzas[currentStanza].map((line, idx) => (
                <p key={idx} className="stanza-line">
                  {line}
                </p>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="stanza-nav-row">
              <button
                className="stanza-nav-btn"
                disabled={currentStanza === 0}
                onClick={() => setCurrentStanza((prev) => Math.max(0, prev - 1))}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>
              <div className="stanza-dots">
                {stanzas.map((_, idx) => (
                  <button
                    key={idx}
                    className={`stanza-dot ${currentStanza === idx ? 'active' : ''}`}
                    onClick={() => setCurrentStanza(idx)}
                    aria-label={`Go to stanza ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                className="stanza-nav-btn"
                disabled={currentStanza === stanzas.length - 1}
                onClick={() => setCurrentStanza((prev) => Math.min(stanzas.length - 1, prev + 1))}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Full Reader View */
          <div className="full-poem-wrapper">
            {stanzas.map((stanza, sIdx) => (
              <div key={sIdx} className="full-stanza-block">
                {stanza.map((line, lIdx) => (
                  <p key={lIdx} className="full-line-text">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Music2, X, ChevronUp, ChevronDown, Disc3 } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumHint: string;
  year: string;
  color: string;
}

const NIKI_TRACKS: Track[] = [
  {
    id: '68HocO7fx9z0MgDU0ZPHro',
    title: 'Every Summertime',
    artist: 'NIKI',
    albumHint: 'To All The Boys: Always and Forever',
    year: '2021',
    color: '#f9a8d4', // pink
  },
  {
    id: '0n7Lw6Q015oB2kS4W18hLp',
    title: 'Autumn',
    artist: 'NIKI',
    albumHint: 'NICOLE',
    year: '2022',
    color: '#fb923c', // autumn orange
  },
  {
    id: '2sYjH01u9L4lV24hG9i5Lh',
    title: 'Take a Chance with Me',
    artist: 'NIKI',
    albumHint: 'NICOLE',
    year: '2022',
    color: '#a78bfa', // purple
  },
];

export const SpotifyPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTrack, setActiveTrack] = useState(0);

  const track = NIKI_TRACKS[activeTrack];

  return (
    <>
      {/* Floating toggle button (always visible) */}
      {!isOpen && (
        <button
          className="spotify-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open Spotify Player"
          title="Now Playing — NIKI"
        >
          <Disc3 size={18} className="spotify-fab-icon" />
          <span className="spotify-fab-label">NIKI</span>
        </button>
      )}

      {/* Mini player panel */}
      {isOpen && (
        <div className={`spotify-player-panel ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="spotify-panel-header">
            <div className="spotify-header-left">
              <div className="spotify-logo-dot" />
              <span className="spotify-panel-title">
                <Music2 size={11} style={{ marginRight: 4 }} />
                Spotify — NIKI Faves
              </span>
            </div>
            <div className="spotify-header-actions">
              <button
                className="spotify-icon-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? 'Expand player' : 'Minimize player'}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              <button
                className="spotify-icon-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close player"
                title="Close"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Track picker */}
          {!isMinimized && (
            <>
              <div className="spotify-track-tabs">
                {NIKI_TRACKS.map((t, i) => (
                  <button
                    key={t.id}
                    className={`spotify-track-tab ${activeTrack === i ? 'active' : ''}`}
                    style={activeTrack === i ? { borderColor: t.color, color: t.color } : {}}
                    onClick={() => setActiveTrack(i)}
                    title={t.title}
                  >
                    {i === 0 ? '🌅' : i === 1 ? '🍂' : '✨'}{' '}
                    <span className="spotify-tab-track-name">{t.title}</span>
                  </button>
                ))}
              </div>

              {/* Spotify Embed iframe */}
              <div className="spotify-embed-wrapper">
                <iframe
                  key={track.id}
                  src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`${track.title} by ${track.artist}`}
                  style={{ borderRadius: '10px' }}
                />
              </div>

              {/* Track meta info */}
              <div className="spotify-track-meta">
                <div className="spotify-track-info-row">
                  <span className="spotify-now-playing-dot" style={{ backgroundColor: track.color }} />
                  <span className="spotify-track-meta-label">
                    <span style={{ color: track.color, fontWeight: 600 }}>{track.title}</span>
                    {' · '}{track.year}
                  </span>
                </div>
                <span className="spotify-album-hint">{track.albumHint}</span>
              </div>

              <div className="spotify-premium-badge">
                <span>🎵</span>
                <span>Streaming via Spotify Premium</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

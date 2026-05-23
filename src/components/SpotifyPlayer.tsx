import React, { useState } from 'react';
import { Music2, Disc3, Volume2 } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumHint: string;
  year: string;
  color: string;
  type?: 'track' | 'album';
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
    id: '0W5o1Kxw1VlohSajPqeBMF',
    title: 'Autumn',
    artist: 'NIKI',
    albumHint: 'Nicole',
    year: '2022',
    color: '#fb923c', // autumn orange
  },
  {
    id: '21acb66djKRlDPJOXRBCkc',
    title: 'Take a Chance with Me',
    artist: 'NIKI',
    albumHint: 'Nicole',
    year: '2022',
    color: '#a78bfa', // purple
  },
  {
    id: '4jKfiwrpklbqDOrwiUBsLv',
    title: 'Autumn Reimagined',
    artist: 'NIKI',
    albumHint: 'Nicole (Reimagined)',
    year: '2023',
    color: '#f59e0b', // gold/amber
    type: 'album',
  },
  {
    id: '2c5JKO8gPaOFVxQ0elwXEG',
    title: 'Lifetime Reimagined',
    artist: 'NIKI',
    albumHint: 'Lifetime (Reimagined) - Single',
    year: '2023',
    color: '#ec4899', // rose pink
  },
];

const TAB_EMOJIS = ['🌅', '🍂', '✨', '🎵', '🌟'];

export const SpotifyPlayer: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState(0);
  const track = NIKI_TRACKS[activeTrack];

  return (
    <div className="spotify-player-inline" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="spotify-panel-header">
        <div className="spotify-header-left">
          <div className="spotify-logo-dot" />
          <span className="spotify-panel-title">
            <Music2 size={12} style={{ marginRight: 6, color: '#1ed760' }} />
            Spotify — NIKI Faves
          </span>
        </div>
        <div className="spotify-header-right">
          <Volume2 size={12} style={{ marginRight: 4, color: 'var(--text-muted)' }} />
          <span className="spotify-premium-lbl">Accessory Dock</span>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <div className="spotify-inline-body">
        {/* Left Side: Vinyl Deck & Playlist */}
        <div className="spotify-inline-left">
          {/* Deck with vinyl record and details */}
          <div className="spotify-deck-panel">
            <div className="vinyl-record-container">
              <div 
                className="vinyl-record" 
                style={{ 
                  animationPlayState: 'running',
                  border: `3px solid ${track.color}`,
                  boxShadow: `0 0 16px rgba(0,0,0,0.4), 0 0 10px ${track.color}40`
                }}
              >
                <div className="vinyl-groove-1" />
                <div className="vinyl-groove-2" />
                <div className="vinyl-middle-label" style={{ backgroundColor: track.color }}>
                  <span className="vinyl-emoji">{TAB_EMOJIS[activeTrack]}</span>
                </div>
              </div>
            </div>

            <div className="spotify-track-deck-meta">
              <span className="now-playing-deck-lbl" style={{ color: track.color }}>Now Loading</span>
              <h3 className="deck-song-title" style={{ color: track.color }} title={track.title}>{track.title}</h3>
              <p className="deck-song-album">{track.albumHint} ({track.year})</p>
            </div>
          </div>

          {/* Custom Playlist Container */}
          <div className="spotify-playlist-container">
            <div className="playlist-header-row">
              <Disc3 size={11} className="spotify-fab-icon" />
              <span>NIKI Selected Tracks</span>
            </div>
            
            <div className="spotify-playlist-rows">
              {NIKI_TRACKS.map((t, i) => {
                const isActive = activeTrack === i;
                return (
                  <button
                    key={t.id}
                    className={`playlist-row-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTrack(i)}
                    style={isActive ? { '--active-color': t.color } as React.CSSProperties : {}}
                  >
                    <span className="playlist-row-num">0{i + 1}</span>
                    <div className="playlist-row-details">
                      <span className="playlist-row-title">{t.title}</span>
                      <span className="playlist-row-album">{t.type === 'album' ? 'EP / Album' : 'Single'}</span>
                    </div>
                    {isActive ? (
                      <div className="eq-bars">
                        <span className="eq-bar" style={{ backgroundColor: t.color }}></span>
                        <span className="eq-bar" style={{ backgroundColor: t.color }}></span>
                        <span className="eq-bar" style={{ backgroundColor: t.color }}></span>
                      </div>
                    ) : (
                      <span className="playlist-row-emoji">{TAB_EMOJIS[i]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Embedded full Spotify Player */}
        <div className="spotify-embed-wrapper-inline">
          <iframe
            key={track.id}
            src={`https://open.spotify.com/embed/${track.type || 'track'}/${track.id}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={`${track.title} by ${track.artist}`}
            style={{ borderRadius: '12px', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

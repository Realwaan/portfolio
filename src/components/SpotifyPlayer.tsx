import React, { useState } from 'react';
import { Disc3, ChevronLeft, ChevronRight } from 'lucide-react';

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

export const SpotifyPlayer: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState(0);
  const track = NIKI_TRACKS[activeTrack];

  const handlePrev = () => {
    setActiveTrack((prev) => (prev - 1 + NIKI_TRACKS.length) % NIKI_TRACKS.length);
  };

  const handleNext = () => {
    setActiveTrack((prev) => (prev + 1) % NIKI_TRACKS.length);
  };

  return (
    <div className="spotify-player-inline" onClick={(e) => e.stopPropagation()}>
      {/* Controls Strip */}
      <div className="spotify-controls-strip">
        <div className="spotify-disc-icon-container">
          <Disc3 size={18} className="spotify-fab-icon" style={{ color: track.color }} />
        </div>
        
        <div className="spotify-meta-column">
          <span className="spotify-playlist-title">NIKI Favorites</span>
          <div className="spotify-selector-row">
            <button 
              className="spotify-nav-btn" 
              onClick={handlePrev}
              aria-label="Previous track"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="spotify-select-wrapper">
              <select 
                className="spotify-track-select"
                value={activeTrack}
                onChange={(e) => setActiveTrack(Number(e.target.value))}
                style={{ color: track.color }}
              >
                {NIKI_TRACKS.map((t, idx) => (
                  <option key={t.id} value={idx}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="spotify-nav-btn" 
              onClick={handleNext}
              aria-label="Next track"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Spotify Embed iframe (takes up the right side) */}
      <div className="spotify-embed-wrapper-inline">
        <iframe
          key={track.id}
          src={`https://open.spotify.com/embed/${track.type || 'track'}/${track.id}?utm_source=generator&theme=0`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`${track.title} by ${track.artist}`}
        />
      </div>
    </div>
  );
};


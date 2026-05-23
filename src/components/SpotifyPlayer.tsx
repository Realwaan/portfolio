import React, { useState } from 'react';
import { Music2, Disc3 } from 'lucide-react';

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
            <Music2 size={11} style={{ marginRight: 4 }} />
            Spotify — NIKI Faves
          </span>
        </div>
        <div className="spotify-header-right">
          <Disc3 size={11} className="spotify-fab-icon" />
          <span className="spotify-premium-lbl">Premium Embed</span>
        </div>
      </div>

      {/* Main Content (Horizontal Flex for Compact Size) */}
      <div className="spotify-inline-body">
        {/* Track picker & meta on the left */}
        <div className="spotify-inline-left">
          <div className="spotify-track-tabs-vertical">
            {NIKI_TRACKS.map((t, i) => (
              <button
                key={t.id}
                className={`spotify-track-tab ${activeTrack === i ? 'active' : ''}`}
                style={activeTrack === i ? { borderColor: t.color, color: t.color } : {}}
                onClick={() => setActiveTrack(i)}
                title={t.title}
              >
                <span className="tab-icon-emoji">{TAB_EMOJIS[i] || '🎵'}</span>{' '}
                <span className="spotify-tab-track-name">{t.title}</span>
              </button>
            ))}
          </div>
          
          {/* Track meta info */}
          <div className="spotify-track-meta-inline">
            <div className="spotify-track-info-row">
              <span className="spotify-now-playing-dot" style={{ backgroundColor: track.color }} />
              <span className="spotify-track-meta-label">
                <span className="meta-song-title" style={{ color: track.color }}>{track.title}</span>
                <span className="meta-song-sep"> · </span>
                <span className="meta-song-year">{track.year}</span>
              </span>
            </div>
            <span className="spotify-album-hint">{track.albumHint}</span>
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
    </div>
  );
};

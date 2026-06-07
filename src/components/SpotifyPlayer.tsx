import React, { useState, useEffect, useRef } from 'react';
import { Disc3, ChevronLeft, ChevronRight, Music, Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { LYRICS_DATABASE } from '../data/lyricsData';
import './SpotifyPlayer.css';


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
    artist: 'Ben&Ben',
    albumHint: 'Nicole (Reimagined)',
    year: '2023',
    color: '#f59e0b', // gold/amber
    type: 'album',
  },
  {
    id: '2c5JKO8gPaOFVxQ0elwXEG',
    title: 'Lifetime Reimagined',
    artist: 'Ben&Ben',
    albumHint: 'Lifetime (Reimagined) - Single',
    year: '2023',
    color: '#ec4899', // rose pink
  },
];

export const SpotifyPlayer: React.FC = () => {
  const SHOW_LYRICS_FEATURE = true;
  const [activeTrack, setActiveTrack] = useState(0);
  const track = NIKI_TRACKS[activeTrack];

  // Synced Lyrics States
  const [showLyrics, setShowLyrics] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Custom Track Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const songLyrics = LYRICS_DATABASE[track.id] || [];
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs for tracking manual scrolling
  const isUserScrollingRef = useRef(false);
  const userScrollTimeoutRef = useRef<any>(null);

  // Spotify IFrame Controller API Refs and State
  const embedControllerRef = useRef<any>(null);
  const [controller, setController] = useState<any>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  const setupSpotifyPlayer = (element: HTMLDivElement) => {
    const IFrameAPI = (window as any).SpotifyIframeApi;
    if (!IFrameAPI || embedControllerRef.current) return;

    // Use a sentinel value in ref to prevent multiple controllers being created in React strict mode
    embedControllerRef.current = true;

    const options = {
      uri: `spotify:${track.type || 'track'}:${track.id}`,
      width: '100%',
      height: '80',
      theme: '0'
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IFrameAPI.createController(element, options, (EmbedController: any) => {
      embedControllerRef.current = EmbedController;
      setController(EmbedController);

      // Synchronize with Spotify embed updates
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      EmbedController.addListener('playback_update', (e: any) => {
        const { position, isPaused } = e.data;
        setCurrentTime(position / 1000);
        setIsPlaying(!isPaused);
      });
    });
  };

  // Listen for the Spotify IFrame API ready event from index.html
  useEffect(() => {
    const handleApiReady = () => {
      if (placeholderRef.current) {
        setupSpotifyPlayer(placeholderRef.current);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).SpotifyIframeApi) {
      handleApiReady();
    } else {
      window.addEventListener('spotify-api-ready', handleApiReady);
    }

    return () => {
      window.removeEventListener('spotify-api-ready', handleApiReady);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update track URI when track changes
  useEffect(() => {
    if (controller) {
      const trackUri = `spotify:${track.type || 'track'}:${track.id}`;
      controller.loadUri(trackUri);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentTime(0);
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrack, controller]);

  // Close track dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Timer loop for smooth local progress interpolation between API updates
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 0.1); // Increment by 0.1s every 100ms
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Find the active lyric line index based on currentTime
  const activeLineIndex = songLyrics.reduce((acc, line, idx) => {
    return currentTime >= line.time ? idx : acc;
  }, -1);

  // Auto-scroll logic: scroll active line to center of container
  useEffect(() => {
    if (showLyrics && activeLineIndex !== -1 && lyricsContainerRef.current && !isUserScrollingRef.current) {
      const container = lyricsContainerRef.current;
      const activeElement = container.children[activeLineIndex] as HTMLElement;
      if (activeElement) {
        const targetScrollTop = activeElement.offsetTop - container.clientHeight / 2 + activeElement.clientHeight / 2;
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });
      }
    }
  }, [activeLineIndex, showLyrics]);

  // Handle manual scroll to pause auto-scrolling briefly
  const handleLyricsScroll = () => {
    isUserScrollingRef.current = true;
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    userScrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 3000); // Resume auto-scrolling after 3 seconds of inactivity
  };

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    };
  }, []);

  const handlePrev = () => {
    setActiveTrack((prev) => (prev - 1 + NIKI_TRACKS.length) % NIKI_TRACKS.length);
  };

  const handleNext = () => {
    setActiveTrack((prev) => (prev + 1) % NIKI_TRACKS.length);
  };

  // Bridge custom play buttons to Spotify iframe controller
  const handlePlayPause = () => {
    if (controller) {
      controller.togglePlay();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (amount: number) => {
    const nextTime = Math.max(0, currentTime + amount);
    if (controller) {
      controller.seek(nextTime);
    } else {
      setCurrentTime(nextTime);
    }
  };

  const handleLineClick = (time: number) => {
    if (controller) {
      controller.seek(time);
      controller.resume();
    } else {
      setCurrentTime(time);
      if (!isPlaying) setIsPlaying(true);
    }
  };

  return (
    <div className="spotify-player-inline" onClick={(e) => e.stopPropagation()}>
      {/* Main Player Row */}
      <div className="spotify-player-main-row">
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
              
              <div className="spotify-select-custom-wrapper" ref={dropdownRef}>
                <button 
                  className="spotify-track-select-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ color: track.color }}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="spotify-select-trigger-text">{track.title}</span>
                  <span className="spotify-select-trigger-arrow">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="spotify-select-dropdown-list" role="listbox">
                    {NIKI_TRACKS.map((t, idx) => {
                      const isActive = idx === activeTrack;
                      return (
                        <div
                          key={t.id}
                          role="option"
                          aria-selected={isActive}
                          className={`spotify-select-dropdown-item ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setActiveTrack(idx);
                            setIsDropdownOpen(false);
                          }}
                          style={isActive ? { color: t.color, backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {}}
                        >
                          <span className="spotify-dropdown-item-title">{t.title}</span>
                          <span className="spotify-dropdown-item-artist">{t.artist}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button 
                className="spotify-nav-btn" 
                onClick={handleNext}
                aria-label="Next track"
              >
                <ChevronRight size={16} />
              </button>

              {SHOW_LYRICS_FEATURE && (
                <button
                  className={`spotify-lyrics-toggle-btn ${showLyrics ? 'active' : ''}`}
                  onClick={() => setShowLyrics(!showLyrics)}
                  aria-label="Toggle lyrics"
                  style={showLyrics ? { color: track.color, borderColor: track.color, backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
                >
                  <Music size={12} />
                  <span className="lyrics-toggle-label">Lyrics</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Spotify Embed Iframe Placeholder (API replaces this target) */}
        <div className="spotify-embed-wrapper-inline">
          <div 
            id="spotify-iframe-placeholder" 
            ref={(el) => {
              placeholderRef.current = el;
              if (el && (window as any).SpotifyIframeApi) {
                setupSpotifyPlayer(el);
              }
            }} 
            style={{ minHeight: '80px', width: '100%' }}
          ></div>
        </div>
      </div>

      {/* Synced Lyrics Panel */}
      {SHOW_LYRICS_FEATURE && showLyrics && (
        <div className="spotify-lyrics-panel">
          <div className="spotify-lyrics-controls">
            <div className="lyrics-time-display font-mono">
              {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
            </div>

            <div className="lyrics-action-buttons">
              <button 
                className="lyrics-ctrl-btn" 
                onClick={() => handleSeek(-5)} 
                title="Rewind 5s"
              >
                <SkipBack size={12} />
                <span>-5s</span>
              </button>

              <button 
                className={`lyrics-ctrl-btn play-btn ${isPlaying ? 'active' : ''}`} 
                onClick={handlePlayPause}
                title={isPlaying ? 'Pause Sync' : 'Start Sync'}
                style={isPlaying ? { color: track.color, backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'Pause' : 'Sync'}</span>
              </button>

              <button 
                className="lyrics-ctrl-btn" 
                onClick={() => handleSeek(5)} 
                title="Forward 5s"
              >
                <span>+5s</span>
                <SkipForward size={12} />
              </button>

              <button 
                className="lyrics-ctrl-btn reset-btn" 
                onClick={() => handleSeek(-currentTime)} 
                title="Reset timer"
              >
                <RotateCcw size={12} />
              </button>
            </div>
            
            <div className="lyrics-sync-hint">
              Click a line to jump time
            </div>
          </div>

          <div 
            className="spotify-lyrics-viewport" 
            ref={lyricsContainerRef}
            onWheel={handleLyricsScroll}
            onTouchMove={handleLyricsScroll}
          >
            {songLyrics.length === 0 ? (
              <div className="lyrics-empty">No lyrics available for this track.</div>
            ) : (
              songLyrics.map((line, idx) => {
                const isActive = idx === activeLineIndex;
                const isPast = idx < activeLineIndex;

                return (
                  <div
                    key={idx}
                    className={`lyrics-line-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => handleLineClick(line.time)}
                    style={isActive ? { color: track.color } : {}}
                  >
                    {line.text}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

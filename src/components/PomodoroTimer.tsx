import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Award } from 'lucide-react';
import './PomodoroTimer.css';

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const timerRef = useRef<any>(null);

  const totalDuration = mode === 'work' ? 25 * 60 : 5 * 60;

  // Synthesize notification beep using Web Audio API
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (err) {
      console.warn('Web Audio playback failed', err);
    }
  };

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      const targetTime = Date.now() + timeLeft * 1000;
      
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          playBeep();
          
          // Switch modes or track completions
          if (mode === 'work') {
            setCompletedSessions((c) => c + 1);
            setMode('break');
            window.dispatchEvent(new CustomEvent('trigger-toast', {
              detail: { message: "Pomodoro session complete! Take a 5-minute break." }
            }));
            setTimeLeft(5 * 60);
          } else {
            setMode('work');
            window.dispatchEvent(new CustomEvent('trigger-toast', {
              detail: { message: "Break finished! Back to study mode." }
            }));
            setTimeLeft(25 * 60);
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleToggleMode = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  // Progress Calculations for SVG path
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / totalDuration) * circumference;

  return (
    <div className="pomodoro-timer-bento" onClick={(e) => e.stopPropagation()}>
      <div className="pomo-header-row">
        <div className="pomo-title-area">
          <Timer size={14} className="pomo-title-icon" />
          <span className="pomo-title">Study Pomodoro</span>
        </div>
        <div className="pomo-completed font-mono">
          <Award size={12} style={{ color: 'var(--accent-color)' }} />
          <span>Sessions: {completedSessions}</span>
        </div>
      </div>

      <div className="pomo-main-content">
        {/* Progress Ring and Text */}
        <div className="pomo-progress-ring-container">
          <svg className="pomo-progress-svg" viewBox="0 0 60 60">
            <circle 
              className="pomo-circle-bg" 
              cx="30" 
              cy="30" 
              r={radius} 
            />
            <circle 
              className="pomo-circle-fill" 
              cx="30" 
              cy="30" 
              r={radius} 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ stroke: 'var(--accent-color)' }}
            />
          </svg>
          <div className="pomo-timer-digits font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls and Mode Selectors */}
        <div className="pomo-controls-column">
          <div className="pomo-mode-toggles">
            <button 
              className={`pomo-mode-btn ${mode === 'work' ? 'active' : ''}`}
              onClick={() => handleToggleMode('work')}
            >
              Study
            </button>
            <button 
              className={`pomo-mode-btn ${mode === 'break' ? 'active' : ''}`}
              onClick={() => handleToggleMode('break')}
            >
              Break
            </button>
          </div>

          <div className="pomo-actions-row">
            <button 
              className={`pomo-action-btn run-btn ${isRunning ? 'paused' : 'running'}`}
              onClick={handleStartPause}
              title={isRunning ? 'Pause' : 'Start'}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button 
              className="pomo-action-btn reset-btn"
              onClick={handleReset}
              title="Reset Timer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

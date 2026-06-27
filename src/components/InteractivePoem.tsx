import React, { useState, useMemo } from 'react';
import { Sparkles, Gamepad2, Heart, RefreshCw, BarChart2 } from 'lucide-react';
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
  const [retroMode, setRetroMode] = useState(false);
  const [currentStanza, setCurrentStanza] = useState(0);

  // Dashboard configuration states (Kokonut UI)
  const [tiltSensitivity, setTiltSensitivity] = useState(60);
  const [glowIntensity, setGlowIntensity] = useState(75);
  const [animationSpeed, setAnimationSpeed] = useState(50);

  // 3D Parallax Rotation states (React Bits)
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Pulse effect triggered by Shiny Button (Magic UI)
  const [isPulse, setIsPulse] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (retroMode) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Convert sensitivity to maximum rotation degrees (up to 18 deg)
    const maxRot = (tiltSensitivity / 100) * 18;
    const rotY = ((x - centerX) / centerX) * maxRot;
    const rotX = -((y - centerY) / centerY) * maxRot;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const toggleRetroMode = () => {
    setRetroMode(prev => !prev);
    // Custom audio indicator or toast
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: `Aesthetic theme swapped to ${!retroMode ? '8-Bit Retro' : 'Modern Cinematic'}!` }
    }));
  };

  const handleShinyClick = () => {
    setIsPulse(true);
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: "💖 Heartbeat impulse triggered across the poem's core." }
    }));
    setTimeout(() => setIsPulse(false), 800);
  };

  // Split text array for title letters hover effect (React Bits)
  const splitTitle = useMemo(() => {
    return "Panalangin at Tugon".split("");
  }, []);

  // Compute CSS styles based on interactive states
  const cardStyle = useMemo(() => {
    if (retroMode) return {};
    return {
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 ${glowIntensity / 2}px rgba(var(--accent-rgb), ${glowIntensity / 200})`,
      '--beam-duration': `${25 - (animationSpeed / 100) * 20}s`
    } as React.CSSProperties;
  }, [retroMode, rotateX, rotateY, glowIntensity, animationSpeed]);

  const spotlightStyle = useMemo(() => {
    return {
      opacity: glowIntensity / 100,
    };
  }, [glowIntensity]);

  // Statistics calculation for Dashboard
  const wordCount = useMemo(() => {
    return stanzas.flat().join(" ").split(/\s+/).length;
  }, []);

  return (
    <div className="poem-container">
      <div className="poem-tilt-wrapper">
        <div 
          className={`poem-card ${retroMode ? 'retro' : ''} ${isPulse ? 'animate-pulse' : ''}`}
          style={cardStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Magic UI border beam */}
          <div className="poem-border-beam" />

          {/* Aceternity Background Beams */}
          <div className="poem-beams" />
          <div className="poem-lamp-spotlight" style={spotlightStyle} />
          
          {/* React Bits Sparkles Layer */}
          <div className="sparkles-matrix" />

          {/* Retro terminal header prompt */}
          {retroMode && (
            <div className="poem-retro-prompt">
              <span>[ ROM LOAD SUCCESS ]</span>
              <span>STNZA: 0{currentStanza + 1} / 04</span>
            </div>
          )}

          {/* React Bits: Split-Text Title */}
          <div className="poem-title-container">
            {splitTitle.map((char, index) => (
              <span 
                key={index} 
                className="poem-title-char"
                style={{ transitionDelay: `${index * 20}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>

          {/* Stanza pagination display */}
          <div className="stanzas-carousel">
            <div className="poem-stanza">
              {stanzas[currentStanza].map((line, index) => (
                <p 
                  key={index} 
                  className="line-text"
                  style={{ 
                    transitionDelay: `${index * 80}ms`,
                    transform: isPulse ? 'scale(1.05)' : undefined,
                    color: isPulse ? 'var(--accent-color)' : undefined
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Stanza Selector Dots */}
          <div className="stanza-dots">
            {stanzas.map((_, index) => (
              <div 
                key={index} 
                className={`stanza-dot ${currentStanza === index ? 'active' : ''}`}
                onClick={() => setCurrentStanza(index)}
                title={`View Stanza ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Kokonut UI Bento Controls Panel (Dashboard style configuration) */}
      <div className={`poem-bento-grid ${retroMode ? 'retro' : ''}`}>
        
        {/* Stat Item 1 */}
        <div className="poem-bento-item">
          <div className="poem-bento-header">
            <Heart size={12} className="text-accent" />
            <span>Structure</span>
          </div>
          <div className="poem-bento-value">4 Stanzas</div>
        </div>

        {/* Stat Item 2 */}
        <div className="poem-bento-item">
          <div className="poem-bento-header">
            <BarChart2 size={12} />
            <span>Words count</span>
          </div>
          <div className="poem-bento-value">{wordCount} Words</div>
        </div>

        {/* Stat Item 3: Shiny Impulse button */}
        <div className="poem-bento-item" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <button className="shiny-action-btn" onClick={handleShinyClick}>
            <Sparkles size={13} />
            <span>Pulse Core</span>
          </button>
        </div>

        {/* Control Box Dashboard Slider Module */}
        <div className="poem-bento-item controls">
          <div className="poem-bento-header" style={{ justifyContent: 'space-between', width: '100%' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gamepad2 size={12} />
              <span>UI Parameter Controls</span>
            </span>
            <button className="retro-toggle-btn" onClick={toggleRetroMode}>
              <RefreshCw size={11} />
              <span>Switch to {retroMode ? 'Modern UI' : 'Retro 8bit'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {/* Slider 1: Glow */}
            {!retroMode && (
              <div className="slider-group">
                <div className="slider-header">
                  <span>Aceternity Spotlight Glow</span>
                  <span>{glowIntensity}%</span>
                </div>
                <input 
                  type="range" 
                  className="slider-input" 
                  min="0" 
                  max="100" 
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(Number(e.target.value))}
                />
              </div>
            )}

            {/* Slider 2: Tilt */}
            {!retroMode && (
              <div className="slider-group">
                <div className="slider-header">
                  <span>React Bits 3D Mouse Tilt</span>
                  <span>{tiltSensitivity}%</span>
                </div>
                <input 
                  type="range" 
                  className="slider-input" 
                  min="0" 
                  max="100" 
                  value={tiltSensitivity}
                  onChange={(e) => setTiltSensitivity(Number(e.target.value))}
                />
              </div>
            )}

            {/* Slider 3: Animation speed */}
            <div className="slider-group">
              <div className="slider-header">
                <span>Magic UI Border Beam Speed</span>
                <span>{animationSpeed}%</span>
              </div>
              <input 
                type="range" 
                className="slider-input" 
                min="5" 
                max="100" 
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Star, GitFork, Calendar, Link2, Info, Copy, Check, RefreshCw, Cpu, Activity, Terminal, ExternalLink, BookOpen, StickyNote, Clock, ArrowRight } from 'lucide-react';
import { fallbackProfileData } from '../data/fallbackData';
import type { Project, Skill, AcademicCourse, TimelineEvent } from '../data/fallbackData';
import { CurriculumRoadmap } from './CurriculumRoadmap';
import { bscsCurriculum } from '../data/curriculumData';
import { getCourseNotes } from '../data/courseNotesData';
import { NotionBlockRenderer } from './NotionBlockRenderer';
import { useNotionNotes } from '../hooks/useNotionNotes';
import './DetailPanel.css';
import './ShowcaseWidgets.css';



// ----------------------------------------------------
// Sub-component: profile photo rendering helper
// ----------------------------------------------------
const ProfileImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imgError, setImgError] = React.useState(false);

  if (imgError) {
    return null;
  }

  return (
    <div className="welcome-photo-container">
      <img
        src={src}
        alt={alt}
        className="welcome-photo"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

// ----------------------------------------------------
// Sub-component: Git Clone Copy Snippet Terminal Card
// ----------------------------------------------------
const GitCloneWidget: React.FC<{ repoName: string }> = ({ repoName }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const cloneCmd = `git clone https://github.com/Realwaan/${repoName}.git`;
    navigator.clipboard.writeText(cloneCmd);
    setCopied(true);
    
    // Dispatch toast event to parent
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: `Clone command for ${repoName} copied to clipboard!` }
    }));

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="clone-widget">
      <div className="clone-widget-header">
        <span className="clone-widget-dot red"></span>
        <span className="clone-widget-dot yellow"></span>
        <span className="clone-widget-dot green"></span>
        <span className="clone-widget-title font-mono">git clone helper</span>
      </div>
      <div className="clone-widget-body">
        <code className="clone-code-text font-mono">
          <span className="clone-prompt">$</span> git clone https://github.com/Realwaan/{repoName}.git
        </code>
        <button className="clone-copy-btn" onClick={handleCopy} aria-label="Copy clone command">
          {copied ? <Check size={14} className="copied-check" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-component: Tihik Cebuano Budget Tracker Simulator
// ----------------------------------------------------
const TihikSimulator: React.FC = () => {
  const [expenses, setExpenses] = React.useState([
    { id: '1', item: 'Puso & Ngohiong', amount: 45, category: 'Food' },
    { id: '2', item: 'CIT-U Jeepney Fare', amount: 15, category: 'Transport' },
    { id: '3', item: 'Notebook & Pen', amount: 65, category: 'Academic' }
  ]);

  const maxBudget = 300;
  const expenseTotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = maxBudget - expenseTotal;
  const progressPercent = Math.max(0, Math.min(100, (remaining / maxBudget) * 100));

  const randomExpensesPool = [
    { item: 'CIT-U Cafeteria Meal', amount: 85, category: 'Food' },
    { item: 'Puto Maya & Sikwate', amount: 50, category: 'Food' },
    { item: 'Print Lab Assignment', amount: 20, category: 'Academic' },
    { item: 'Internet Cafe Study', amount: 30, category: 'Tech' },
    { item: 'Mock Exam Reviewer', amount: 40, category: 'Academic' },
    { item: 'Siomai sa Tisa', amount: 35, category: 'Food' },
    { item: 'Tempura & Kwek-kwek', amount: 25, category: 'Food' }
  ];

  const addRandomExpense = () => {
    if (remaining <= 20) {
      window.dispatchEvent(new CustomEvent('trigger-toast', {
        detail: { message: "Budget limit reached! Resetting simulated tracker." }
      }));
      setExpenses([
        { id: '1', item: 'Puso & Ngohiong', amount: 45, category: 'Food' }
      ]);
      return;
    }
    const randomIndex = Math.floor(Math.random() * randomExpensesPool.length);
    const item = randomExpensesPool[randomIndex];
    const newExpense = {
      id: String(Date.now()),
      ...item
    };
    setExpenses(prev => [newExpense, ...prev]);
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: `Added mock expense: ${item.item} (-₱${item.amount})` }
    }));
  };

  return (
    <div className="mockup-panel glass-panel">
      <div className="mockup-panel-header">
        <span className="mockup-panel-title">Tihik - Budget Tracker Simulator</span>
        <button className="mockup-btn-primary" onClick={addRandomExpense}>+ Add Expense</button>
      </div>
      <div className="tihik-stats-grid">
        <div className="tihik-stat-card">
          <div className="tihik-stat-label">Savings Left</div>
          <div className="tihik-stat-val">₱{remaining.toFixed(2)}</div>
        </div>
        <div className="tihik-stat-card">
          <div className="tihik-stat-label text-accent">Total Spent</div>
          <div className="tihik-stat-val text-accent">₱{expenseTotal.toFixed(2)}</div>
        </div>
      </div>
      <div className="tihik-progress-container">
        <div className="tihik-progress-labels">
          <span>Savings Ratio</span>
          <span>{progressPercent.toFixed(0)}% Left</span>
        </div>
        <div className="tihik-progress-track">
          <div className="tihik-progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      <div className="tihik-list-header">Simulated Expense History</div>
      <div className="tihik-list">
        {expenses.map(exp => (
          <div key={exp.id} className="tihik-item">
            <div className="tihik-item-left">
              <span className="tihik-item-name">{exp.item}</span>
              <span className="tihik-item-cat">{exp.category}</span>
            </div>
            <span className="tihik-item-amount">-₱{exp.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-component: Islaweave Traditional Patterns Canvas
// ----------------------------------------------------
const IslaweaveSimulator: React.FC = () => {
  const [pattern, setPattern] = React.useState<'diamond' | 'chevron' | 'tartan'>('diamond');
  const [speed, setSpeed] = React.useState<'slow' | 'fast' | 'paused'>('slow');

  return (
    <div className="mockup-panel glass-panel">
      <div className="mockup-panel-header">
        <span className="mockup-panel-title">islaweave - Generative Pattern Canvas</span>
      </div>
      
      {/* Pattern Canvas Container */}
      <div className="weave-canvas-container">
        <svg className={`weave-svg weave-speed-${speed}`} viewBox="0 0 100 100">
          {pattern === 'diamond' && (
            <g className="weave-stroke">
              <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" strokeWidth="1.5" />
              <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" strokeWidth="1" />
              <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="none" strokeWidth="0.75" />
              <line x1="0" y1="50" x2="100" y2="50" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="50" y1="0" x2="50" y2="100" strokeWidth="0.5" strokeDasharray="2 2" />
            </g>
          )}
          {pattern === 'chevron' && (
            <g className="weave-stroke">
              <path d="M0 20 L25 45 L50 20 L75 45 L100 20" fill="none" strokeWidth="1.5" />
              <path d="M0 40 L25 65 L50 40 L75 65 L100 40" fill="none" strokeWidth="1.2" />
              <path d="M0 60 L25 85 L50 60 L75 85 L100 60" fill="none" strokeWidth="1" />
              <path d="M0 80 L25 105 L50 80 L75 105 L100 80" fill="none" strokeWidth="0.8" />
            </g>
          )}
          {pattern === 'tartan' && (
            <g className="weave-stroke">
              <line x1="10" y1="0" x2="10" y2="100" strokeWidth="1" />
              <line x1="30" y1="0" x2="30" y2="100" strokeWidth="2" />
              <line x1="50" y1="0" x2="50" y2="100" strokeWidth="3" />
              <line x1="70" y1="0" x2="70" y2="100" strokeWidth="2" />
              <line x1="90" y1="0" x2="90" y2="100" strokeWidth="1" />
              <line x1="0" y1="10" x2="100" y2="10" strokeWidth="1" />
              <line x1="0" y1="30" x2="100" y2="30" strokeWidth="2" />
              <line x1="0" y1="50" x2="100" y2="50" strokeWidth="3" />
              <line x1="0" y1="70" x2="100" y2="70" strokeWidth="2" />
              <line x1="0" y1="90" x2="100" y2="90" strokeWidth="1" />
            </g>
          )}
        </svg>
      </div>

      <div className="weave-controls-grid">
        <div className="weave-control-group">
          <span className="weave-control-label">Pattern Motif</span>
          <div className="weave-btn-group">
            <button className={`weave-btn ${pattern === 'diamond' ? 'active' : ''}`} onClick={() => setPattern('diamond')}>Diamond</button>
            <button className={`weave-btn ${pattern === 'chevron' ? 'active' : ''}`} onClick={() => setPattern('chevron')}>Chevron</button>
            <button className={`weave-btn ${pattern === 'tartan' ? 'active' : ''}`} onClick={() => setPattern('tartan')}>Tartan</button>
          </div>
        </div>
        <div className="weave-control-group">
          <span className="weave-control-label">Weave Speed</span>
          <div className="weave-btn-group">
            <button className={`weave-btn ${speed === 'paused' ? 'active' : ''}`} onClick={() => setSpeed('paused')}>Pause</button>
            <button className={`weave-btn ${speed === 'slow' ? 'active' : ''}`} onClick={() => setSpeed('slow')}>Slow</button>
            <button className={`weave-btn ${speed === 'fast' ? 'active' : ''}`} onClick={() => setSpeed('fast')}>Fast</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-component: Kessh Terminal Compiler Diagnostic
// ----------------------------------------------------
const KesshSimulator: React.FC = () => {
  const [lines, setLines] = React.useState<string[]>([
    "realwaan@wildcat:~$ kessh --version",
    "kessh-config-manager v2.0.4",
    "Press 'Run Diagnostic' to compile active stylesheets."
  ]);
  const [isCompiling, setIsCompiling] = React.useState(false);

  const runDiagnostic = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setLines(["$ kessh --compile-theme"]);

    const steps = [
      { delay: 300, line: "[INFO] Initializing config engine..." },
      { delay: 700, line: "[INFO] Parsing local .Xresources variable array..." },
      { delay: 1100, line: "[SUCCESS] Identified 16 system color declarations." },
      { delay: 1500, line: "[INFO] Loading custom CSS stylesheet overrides..." },
      { delay: 1800, line: "[SUCCESS] Parsed theme.css in 18ms without conflicts." },
      { delay: 2100, line: "[OK] Config successfully compiled and reloaded!" },
      { delay: 2300, line: "realwaan@wildcat:~$ " }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        setLines(prev => [...prev, step.line]);
        if (step.line.includes("compiled")) {
          window.dispatchEvent(new CustomEvent('trigger-toast', {
            detail: { message: "Dotfiles successfully compiled!" }
          }));
        }
        if (step.line === "realwaan@wildcat:~$ ") {
          setIsCompiling(false);
        }
      }, step.delay);
    });
  };

  return (
    <div className="mockup-panel glass-panel">
      <div className="mockup-panel-header">
        <span className="mockup-panel-title">kessh - Compile Diagnostic</span>
        <button 
          className="mockup-btn-primary" 
          onClick={runDiagnostic} 
          disabled={isCompiling}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <RefreshCw size={12} className={isCompiling ? "spin-animate" : ""} />
          {isCompiling ? "Running..." : "Run Diagnostic"}
        </button>
      </div>
      <div className="terminal-screen font-mono">
        <div className="terminal-bar">
          <span className="terminal-dot red"></span>
          <span className="terminal-dot yellow"></span>
          <span className="terminal-dot green"></span>
          <span className="terminal-title-text">kessh-diagnostic</span>
        </div>
        <div className="terminal-content">
          {lines.map((line, idx) => (
            <div key={idx} className={
              line.startsWith("[SUCCESS]") ? "term-success" :
              line.startsWith("[OK]") ? "term-ok" :
              line.startsWith("[INFO]") ? "term-info" : ""
            }>
              {line}
            </div>
          ))}
          {isCompiling && <div className="terminal-cursor"></div>}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-component: PhotoboothV2 Filter Viewfinder Simulator
// ----------------------------------------------------
const PhotoboothSimulator: React.FC = () => {
  const [filter, setFilter] = React.useState<'none' | 'retro' | 'neon' | 'cyberpunk' | 'mono'>('none');

  const filterStyles = {
    none: 'grayscale(12%) contrast(102%)',
    retro: 'sepia(0.6) contrast(1.1) brightness(0.95)',
    neon: 'hue-rotate(150deg) saturate(2) contrast(1.1)',
    cyberpunk: 'hue-rotate(270deg) saturate(2.2) contrast(1.2) brightness(1.05)',
    mono: 'grayscale(1) contrast(1.15) brightness(0.95)'
  };

  return (
    <div className="mockup-panel glass-panel">
      <div className="mockup-panel-header">
        <span className="mockup-panel-title">PhotoboothV2 - Filter Sandbox</span>
      </div>

      <div className="photobooth-preview-area">
        <div className="polaroid-wrapper">
          <div className="polaroid-frame">
            <div className="polaroid-photo-container">
              <img 
                src={import.meta.env.BASE_URL + "profile.jpg"} 
                alt="Photobooth Subject" 
                className="polaroid-photo"
                style={{ filter: filterStyles[filter] }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.polaroid-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'polaroid-fallback';
                    fallback.innerText = '📷 PHOTOBOOTH';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div className="polaroid-caption font-mono">
              snap_{filter === 'none' ? 'original' : filter}.png
            </div>
          </div>
        </div>
      </div>

      <div className="filter-controls-container">
        <span className="weave-control-label">Overlay Filters</span>
        <div className="filter-btn-grid">
          <button className={`filter-btn ${filter === 'none' ? 'active' : ''}`} onClick={() => setFilter('none')}>Original</button>
          <button className={`filter-btn ${filter === 'retro' ? 'active' : ''}`} onClick={() => setFilter('retro')}>Retro</button>
          <button className={`filter-btn ${filter === 'neon' ? 'active' : ''}`} onClick={() => setFilter('neon')}>Neon</button>
          <button className={`filter-btn ${filter === 'cyberpunk' ? 'active' : ''}`} onClick={() => setFilter('cyberpunk')}>Cyber</button>
          <button className={`filter-btn ${filter === 'mono' ? 'active' : ''}`} onClick={() => setFilter('mono')}>Mono</button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-component: website-associate-bot Automated Logs
// ----------------------------------------------------
const BotSimulator: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = React.useState(true);
  const [logs, setLogs] = React.useState<Array<{ time: string; type: string; text: string }>>([
    { time: "20:45:01", type: "info", text: "website-associate-bot client initialized." },
    { time: "20:45:02", type: "success", text: "Successfully connected to webhook channels." },
    { time: "20:45:10", type: "info", text: "Verifying CIT-U Wildcats notification queue..." },
    { time: "20:45:11", type: "success", text: "All 0 items dispatched correctly." }
  ]);

  const pool = [
    { type: "info", text: "Checking repository updates at github.com/Realwaan..." },
    { type: "success", text: "Synced local repository caches successfully." },
    { type: "info", text: "Checking academic schedule updates..." },
    { type: "warning", text: "API response latent (420ms). Adjusting connection pool." },
    { type: "info", text: "Pruning temporary cache build profiles..." },
    { type: "success", text: "Cleaned up 42MB of system log archives." },
    { type: "success", text: "Pushed system status heartbeat verification payload." }
  ];

  React.useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const randomLog = pool[Math.floor(Math.random() * pool.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const logItem = { time: timeStr, ...randomLog };
      
      setLogs(prev => {
        const updated = [...prev, logItem];
        if (updated.length > 5) {
          return updated.slice(updated.length - 5);
        }
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  return (
    <div className="mockup-panel glass-panel">
      <div className="mockup-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`status-led ${isMonitoring ? 'led-active' : ''}`}></span>
          <span className="mockup-panel-title">Associate Bot Monitor</span>
        </div>
        <button 
          className="mockup-btn-primary" 
          onClick={() => setIsMonitoring(!isMonitoring)}
        >
          {isMonitoring ? "Pause Monitor" : "Resume Monitor"}
        </button>
      </div>

      <div className="bot-log-viewer font-mono">
        {logs.map((log, idx) => (
          <div key={idx} className="bot-log-row">
            <span className="log-time">[{log.time}]</span>
            <span className={`log-badge badge-${log.type}`}>{log.type.toUpperCase()}</span>
            <span className="log-text">{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-component: dreikesh System Resource Dashboard
// ----------------------------------------------------
const DreikeshSimulator: React.FC = () => {
  const [cpu, setCpu] = React.useState(14);
  const [ram, setRam] = React.useState(5.2);
  const [ping, setPing] = React.useState(15);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 12) + 8); // 8% to 20%
      setRam(parseFloat((Math.random() * 0.4 + 5.1).toFixed(2))); // 5.1 to 5.5
      setPing(Math.floor(Math.random() * 8) + 11); // 11 to 19
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const triggerToastAction = (type: string) => {
    let msg = "";
    if (type === 'ping') {
      msg = `Ping command returned: ${ping}ms latency (Excellent)`;
    } else if (type === 'cache') {
      msg = "System cache cleared! 340.5MB temporary buffers released.";
    } else if (type === 'health') {
      msg = "All dreikesh node clusters active. CPU temperatures normal (42°C).";
    }
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: msg }
    }));
  };

  return (
    <div className="mockup-panel glass-panel">
      <div className="mockup-panel-header">
        <span className="mockup-panel-title">dreikesh - Node Utility Center</span>
      </div>

      <div className="dreikesh-stats-grid">
        <div className="dreikesh-stat-box">
          <div className="dreikesh-box-icon"><Cpu size={16} /></div>
          <div className="dreikesh-box-details">
            <span className="dreikesh-label">CPU LOAD</span>
            <span className="dreikesh-val font-mono">{cpu}%</span>
          </div>
        </div>
        <div className="dreikesh-stat-box">
          <div className="dreikesh-box-icon"><Activity size={16} /></div>
          <div className="dreikesh-box-details">
            <span className="dreikesh-label">MEM UTIL</span>
            <span className="dreikesh-val font-mono">{ram} GB</span>
          </div>
        </div>
        <div className="dreikesh-stat-box">
          <div className="dreikesh-box-icon"><Terminal size={16} /></div>
          <div className="dreikesh-box-details">
            <span className="dreikesh-label">PING</span>
            <span className="dreikesh-val font-mono">{ping} ms</span>
          </div>
        </div>
      </div>

      <div className="weave-control-group" style={{ marginTop: '12px' }}>
        <span className="weave-control-label">Quick Node Actions</span>
        <div className="dreikesh-btn-grid">
          <button className="filter-btn" onClick={() => triggerToastAction('ping')}>Ping Node</button>
          <button className="filter-btn" onClick={() => triggerToastAction('cache')}>Prune Cache</button>
          <button className="filter-btn" onClick={() => triggerToastAction('health')}>Cluster Check</button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-component: swotlib Discount Domain Verifier
// ----------------------------------------------------
const SwotlibSimulator: React.FC = () => {
  const [email, setEmail] = React.useState('');

  const getValidation = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      return { status: 'waiting', label: 'AWAITING EMAIL INPUT', color: 'var(--text-dimmed)' };
    }
    if (trimmed.endsWith('@cit.edu') || trimmed.endsWith('@cit.edu.ph')) {
      return { status: 'cit', label: 'APPROVED - CIT-U WILDCAT DISCOUNT', color: 'var(--accent-color)' };
    }
    if (trimmed.includes('.edu') || trimmed.includes('.edu.ph')) {
      return { status: 'edu', label: 'APPROVED - ACADEMIC DISCOUNT', color: '#10b981' };
    }
    return { status: 'public', label: 'APPROVED - GENERAL USER ACCESS', color: 'var(--text-muted)' };
  };

  const validation = getValidation(email);

  return (
    <div className="mockup-panel glass-panel">
      <div className="mockup-panel-header">
        <span className="mockup-panel-title">swotlib - Domain Verifier Sandbox</span>
      </div>

      <div className="swotlib-input-container">
        <label className="weave-control-label" htmlFor="verify-email-input">Verify Academic Email Domain</label>
        <input 
          id="verify-email-input"
          type="text" 
          className="swotlib-input" 
          placeholder="e.g., student@cit.edu or name@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="swotlib-result-card">
        <span className="swotlib-result-title font-mono">Verification Status Badge</span>
        <div className="swotlib-result-badge-row">
          <span 
            className="status-led" 
            style={{ 
              backgroundColor: validation.status === 'cit' ? 'var(--accent-color)' : 
                               validation.status === 'edu' ? '#10b981' : 
                               validation.status === 'public' ? 'var(--text-dimmed)' : '#eab308' 
            }}
          ></span>
          <span className="swotlib-result-text font-mono" style={{ color: validation.color }}>
            {validation.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// Description editing functionality removed - descriptions are static

// ----------------------------------------------------
// Sub-component: Notion-style Code Block with Copy
// ----------------------------------------------------
const NotionCodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: 'Code copied to clipboard!' }
    }));
  };

  return (
    <>
      <div className="notion-code-header">
        <span>{language}</span>
        <button className="notion-code-copy-btn" onClick={handleCopy} aria-label="Copy code block">
          {copied ? (
            <>
              <Check size={11} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-preview notion-code-block font-mono">
        <code>{code}</code>
      </pre>
    </>
  );
};

// ----------------------------------------------------
// Sub-component: Notion-style Course Study Notes View
// ----------------------------------------------------
interface CourseNotesViewProps {
  courseCode: string;
  onSelectCourseCode?: (code: string) => void;
}

const CourseNotesView: React.FC<CourseNotesViewProps> = ({ courseCode, onSelectCourseCode }) => {
  const courseNode = bscsCurriculum.find(
    c => c.code.replace(/\s+/g, '').toLowerCase() === courseCode.replace(/\s+/g, '').toLowerCase()
  );

  const localNotes = React.useMemo(() => {
    return getCourseNotes(courseNode?.code || courseCode, courseNode);
  }, [courseNode, courseCode]);

  // Notion state hook
  const { notionData, loading: isLoading, isOfflineFallback } = useNotionNotes(courseNode?.code || courseCode);

  // Local storage checklist state for local fallback notes
  const storageKey = `course_notes_checklist_${courseNode?.code || courseCode}`;
  const [checkedItems, setCheckedItems] = React.useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync checklist state when course changes
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(`course_notes_checklist_${courseNode?.code || courseCode}`);
      setCheckedItems(saved ? JSON.parse(saved) : {});
    } catch {
      setCheckedItems({});
    }
  }, [courseNode?.code, courseCode]);

  const handleToggleCheck = (index: number) => {
    const updated = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    const isNowChecked = updated[index];
    const topicText = localNotes.syllabus[index];
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: isNowChecked ? `Marked complete: "${topicText}"` : `Marked incomplete: "${topicText}"` }
    }));
  };

  const unlocks = React.useMemo(() => {
    if (!courseNode) return [];
    return bscsCurriculum.filter(c =>
      c.prerequisites.some(p => p.replace(/\s+/g, '').toLowerCase() === courseNode.code.replace(/\s+/g, '').toLowerCase())
    );
  }, [courseNode]);

  if (!courseNode) {
    return (
      <div className="detail-pane" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-dimmed)' }}>
          <Info size={32} style={{ marginBottom: 8, opacity: 0.5, margin: '0 auto' }} />
          <p style={{ fontSize: '13px' }}>Course not found in database</p>
        </div>
      </div>
    );
  }

  const getStreamLabel = (stream: string) => {
    switch (stream) {
      case 'computing': return 'Computing Foundations';
      case 'programming': return 'Programming & Dev';
      case 'math-theory': return 'Mathematics & Theory';
      case 'systems-networks': return 'Systems & Networks';
      case 'ge': return 'General Education';
      case 'elective': return 'Track Elective';
      default: return 'PE / NSTP / Others';
    }
  };

  // Safe property extraction helpers
  const getNotionPropertyString = (prop: any): string => {
    if (!prop) return '';
    if (prop.type === 'title' && prop.title) {
      return prop.title.map((t: any) => t.plain_text).join('');
    }
    if (prop.type === 'rich_text' && prop.rich_text) {
      return prop.rich_text.map((t: any) => t.plain_text).join('');
    }
    if (prop.type === 'select' && prop.select) {
      return prop.select.name || '';
    }
    if (prop.type === 'status' && prop.status) {
      return prop.status.name || '';
    }
    return '';
  };

  const getEmojiIcon = (iconObj: any) => {
    if (!iconObj) return '';
    if (iconObj.type === 'emoji') return iconObj.emoji;
    return '';
  };

  const getCoverUrl = (coverObj: any) => {
    if (!coverObj) return '';
    if (coverObj.type === 'external' && coverObj.external) return coverObj.external.url;
    if (coverObj.type === 'file' && coverObj.file) return coverObj.file.url;
    return '';
  };

  // Properties derived from live data or fallbacks
  const status = notionData ? (getNotionPropertyString(notionData.properties?.Status) || localNotes.status) : localNotes.status;
  const difficulty = notionData ? (getNotionPropertyString(notionData.properties?.Difficulty) || localNotes.difficulty) : localNotes.difficulty;
  const summary = notionData ? (
    getNotionPropertyString(notionData.properties?.Summary) || 
    getNotionPropertyString(notionData.properties?.Description) || 
    localNotes.summary
  ) : localNotes.summary;
  const emoji = notionData ? (getEmojiIcon(notionData.icon) || localNotes.emoji) : localNotes.emoji;
  const coverUrl = notionData ? getCoverUrl(notionData.cover) : '';

  const statusColorClass = status === 'Completed' ? 'status-completed' 
    : status === 'In Progress' ? 'status-in-progress' 
    : 'status-upcoming';

  const diffColorClass = difficulty === 'Easy' ? 'diff-easy' 
    : difficulty === 'Medium' ? 'diff-medium' 
    : 'diff-hard';

  const coverStyle = coverUrl 
    ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  // Loading skeleton view
  if (isLoading) {
    return (
      <div className="detail-pane notion-skeleton-pulse" style={{ position: 'relative' }}>
        {/* Cover Skeleton */}
        <div className="course-notes-cover notion-skeleton-bar" style={{ opacity: 0.15 }}></div>
        
        {/* Floating Emoji Skeleton */}
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          marginTop: '-25px',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 5
        }}></div>

        {/* Title Skeletons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <div className="notion-skeleton-bar" style={{ width: '80px', height: '14px' }}></div>
          <div className="notion-skeleton-bar" style={{ width: '70%', height: '24px' }}></div>
          <div className="notion-skeleton-bar" style={{ width: '150px', height: '12px' }}></div>
        </div>

        {/* Properties Grid Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', alignItems: 'center' }}>
              <div className="notion-skeleton-bar" style={{ width: '70px', height: '12px' }}></div>
              <div className="notion-skeleton-bar" style={{ width: '100px', height: '12px' }}></div>
            </div>
          ))}
        </div>

        {/* Content Lines Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          <div className="notion-skeleton-bar" style={{ width: '130px', height: '14px', marginBottom: '8px' }}></div>
          <div className="notion-skeleton-bar" style={{ width: '100%', height: '12px' }}></div>
          <div className="notion-skeleton-bar" style={{ width: '95%', height: '12px' }}></div>
          <div className="notion-skeleton-bar" style={{ width: '60%', height: '12px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-pane" style={{ position: 'relative' }}>
      {/* Cover Gradient Banner or Notion Cover */}
      <div className="course-notes-cover" style={coverStyle}></div>

      {/* Floating Emoji */}
      <span className="course-notes-emoji">{emoji}</span>

      {/* Header */}
      <div className="detail-header" style={{ marginTop: 0 }}>
        <div className="detail-category">{courseNode.code}</div>
        <h2 className="detail-title">{courseNode.name}</h2>
        <p className="detail-subtitle">
          {courseNode.year === 1 ? '1st' : courseNode.year === 2 ? '2nd' : courseNode.year === 3 ? '3rd' : '4th'} Year · {courseNode.semester === 1 ? '1st Semester' : courseNode.semester === 2 ? '2nd Semester' : 'Summer Term'}
        </p>
      </div>

      {/* Offline warning banner */}
      {isOfflineFallback && (
        <div className="notion-offline-banner" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(234, 179, 8, 0.06)',
          border: '1px dashed rgba(234, 179, 8, 0.25)',
          borderRadius: '6px',
          padding: '10px 14px',
          margin: '12px 0',
          color: '#eab308',
          fontSize: '11.5px',
          lineHeight: '1.4'
        }}>
          <Info size={14} style={{ flexShrink: 0 }} />
          <span>Viewing offline fallback template. Configure your Notion credentials to sync live study notes.</span>
        </div>
      )}

      {/* Notion Properties Grid */}
      <div className="notion-properties-table">
        <div className="notion-property-row">
          <span className="notion-property-label">
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>🟢</span> Status
          </span>
          <span className="notion-property-value">
            <span className={`notion-badge ${statusColorClass}`}>{status}</span>
          </span>
        </div>
        <div className="notion-property-row">
          <span className="notion-property-label">
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>🧠</span> Stream
          </span>
          <span className="notion-property-value">
            <span style={{ fontSize: '12px', fontWeight: 500 }}>{getStreamLabel(courseNode.stream)}</span>
          </span>
        </div>
        <div className="notion-property-row">
          <span className="notion-property-label">
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>🪙</span> Credits
          </span>
          <span className="notion-property-value" style={{ fontSize: '12px' }}>
            {courseNode.units.toFixed(1)} Units ({courseNode.lec.toFixed(1)} Lec, {courseNode.lab.toFixed(1)} Lab)
          </span>
        </div>
        <div className="notion-property-row">
          <span className="notion-property-label">
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>📈</span> Difficulty
          </span>
          <span className="notion-property-value">
            <span className={`notion-badge ${diffColorClass}`}>{difficulty}</span>
          </span>
        </div>
        <div className="notion-property-row">
          <span className="notion-property-label">
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>🔗</span> Prerequisites
          </span>
          <span className="notion-property-value">
            {courseNode.prerequisites.length > 0 ? (
              courseNode.prerequisites.map(pCode => (
                <button
                  key={pCode}
                  className="notion-link-badge"
                  onClick={() => onSelectCourseCode && onSelectCourseCode(pCode)}
                >
                  {pCode}
                </button>
              ))
            ) : (
              <span className="notion-link-badge-none">None</span>
            )}
          </span>
        </div>
        <div className="notion-property-row">
          <span className="notion-property-label">
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>🔑</span> Unlocks
          </span>
          <span className="notion-property-value">
            {unlocks.length > 0 ? (
              unlocks.map(dep => (
                <button
                  key={dep.code}
                  className="notion-link-badge"
                  onClick={() => onSelectCourseCode && onSelectCourseCode(dep.code)}
                >
                  {dep.code}
                </button>
              ))
            ) : (
              <span className="notion-link-badge-none">None (Terminal course)</span>
            )}
          </span>
        </div>
      </div>

      <div className="detail-body">
        {/* Course Summary */}
        <div className="detail-section-title">Course Description</div>
        <p className="detail-description" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
          {summary}
        </p>

        {isOfflineFallback ? (
          /* ==========================================
             OFFLINE / FALLBACK STATIC VIEW
             ========================================== */
          <>
            {/* Syllabus Checklist */}
            <div className="notion-checklist-title">Course Syllabus & Topics</div>
            <div className="notion-checklist">
              {localNotes.syllabus.map((topic, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    className="notion-checklist-item"
                    onClick={() => handleToggleCheck(idx)}
                  >
                    <div className={`notion-checkbox ${isChecked ? 'checked' : ''}`}>
                      {isChecked && <span className="notion-checkbox-check">✓</span>}
                    </div>
                    <span className={`notion-checklist-text ${isChecked ? 'checked' : ''}`}>
                      {topic}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Study Notes Content */}
            <div className="detail-section-title">Study Notes & Concepts</div>
            {localNotes.sections.map((section, idx) => {
              if (section.type === 'callout') {
                return (
                  <div key={idx} className="notion-callout">
                    <div className="notion-callout-icon">{section.icon || '💡'}</div>
                    <div className="notion-callout-content">
                      {section.content.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk)}
                    </div>
                  </div>
                );
              } else if (section.type === 'formula') {
                return (
                  <div key={idx} className="notion-formula-block">
                    {section.content}
                  </div>
                );
              } else if (section.type === 'code') {
                return (
                  <NotionCodeBlock
                    key={idx}
                    code={section.content}
                    language={section.codeLanguage || 'code'}
                  />
                );
              } else {
                return (
                  <p key={idx} className="detail-description">
                    {section.content}
                  </p>
                );
              }
            })}

            {/* Resources References */}
            {localNotes.resources.length > 0 && (
              <>
                <div className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
                  <BookOpen size={13} style={{ opacity: 0.6 }} />
                  Study Resources
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  {localNotes.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="skill-doc-link"
                      style={{ display: 'inline-flex', alignSelf: 'flex-start', margin: 0 }}
                    >
                      <ExternalLink size={13} />
                      <span>{res.name}</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* ==========================================
             ONLINE LIVE NOTION API BLOCK RENDERING
             ========================================== */
          <>
            <div className="detail-section-title">Study Notes & Concepts</div>
            <NotionBlockRenderer
              blocks={notionData?.blocks || []}
              onPrerequisiteClick={onSelectCourseCode}
            />
          </>
        )}

        {/* Footer map link */}
        <div className="notion-notes-footer">
          <button
            className="notion-notes-map-btn"
            onClick={() => onSelectCourseCode && onSelectCourseCode('OVERVIEW')}
            aria-label="View in Curriculum Mind Map"
          >
            <span>← View in Curriculum Mind Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Description editing functionality removed - descriptions are static


// ====================================================
// MAIN COMPONENT: DetailPanel
// ====================================================
interface DetailPanelProps {
  selectedItem: any;
  type: 'project' | 'skill' | 'course' | 'navigation' | 'welcome' | 'timeline';
  onSelectCourseCode?: (code: string) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedItem, type, onSelectCourseCode }) => {
  if (!selectedItem) {
    return (
      <div className="detail-pane" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-dimmed)' }}>
          <Info size={32} style={{ marginBottom: 8, opacity: 0.5, margin: '0 auto' }} />
          <p style={{ fontSize: '13px' }}>Select an item to view details</p>
        </div>
      </div>
    );
  }

  if (type === 'welcome') {
    if (selectedItem.code === 'OVERVIEW') {
      return (
        <CurriculumRoadmap
          selectedCourseCode="OVERVIEW"
          onSelectCourse={(code) => {
            if (onSelectCourseCode) {
              onSelectCourseCode(code);
            }
          }}
        />
      );
    }

    return (
      <div className="detail-pane">
        <div className="welcome-header-layout">
          <div className="detail-header" style={{ flex: 1, marginBottom: 0 }}>
            <div className="detail-category">CIT-U Wildcats</div>
            <h2 className="detail-title">{selectedItem.name}</h2>
            <p className="detail-subtitle">{selectedItem.title}</p>
          </div>
          {selectedItem.avatarUrl && (
            <ProfileImage src={selectedItem.avatarUrl} alt={selectedItem.name} />
          )}
        </div>
        <div className="detail-body" style={{ marginTop: 18 }}>
          <div className="detail-section-title">Academic Motto</div>
          <p style={{ fontStyle: 'italic', marginBottom: 16, color: 'var(--accent-color)' }}>
            "{selectedItem.motto}"
          </p>

          <div className="detail-section-title">About Me</div>
          <p className="detail-description">{selectedItem.about}</p>

          <div className="detail-section-title">Quick Stats</div>
          <div className="stats-row" style={{ flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Degree Program:</span>
              <span style={{ fontWeight: 500 }}>BS Computer Science</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Year Level:</span>
              <span style={{ fontWeight: 500 }}>1st Year (BSCS 1)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Institution:</span>
              <span style={{ fontWeight: 500 }}>CIT-University</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'project') {
    const project = selectedItem as Project;

    return (
      <div className="detail-pane">
        <div className="detail-header">
          <div className="detail-category">{project.language} Extension</div>
          <h2 className="detail-title">{project.name}</h2>
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-subtitle"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--text-muted)' }}
          >
            <Link2 size={13} /> Open Repository
          </a>
        </div>

        <div className="detail-body">
          <div className="detail-section-title">Description</div>
          <p className="detail-description">{project.description}</p>

          <div className="detail-section-title">Repository Stats</div>
          <div className="stats-row">
            <div className="stat-item">
              <Star size={14} />
              <span>{project.stargazers_count} stars</span>
            </div>
            <div className="stat-item">
              <GitFork size={14} />
              <span>{project.forks_count} forks</span>
            </div>
            <div className="stat-item">
              <Calendar size={14} />
              <span>{new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          {project.topics.length > 0 && (
            <>
              <div className="detail-section-title">Topics</div>
              <div className="tags-list">
                {project.topics.map((topic) => (
                  <span key={topic} className="tag">
                    {topic}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Interactive Project Showcase Widget */}
          <div className="detail-section-title">Interactive Showcase</div>
          {project.name === 'Tihik' && <TihikSimulator />}
          {project.name === 'islaweave' && <IslaweaveSimulator />}
          {project.name === 'kessh' && <KesshSimulator />}
          {project.name === 'PhotoboothV2' && <PhotoboothSimulator />}
          {project.name === 'website-associate-bot' && <BotSimulator />}
          {project.name === 'dreikesh' && <DreikeshSimulator />}
          {project.name === 'swotlib-domains-ng-edu-cit.txt' && <SwotlibSimulator />}

          {/* clipboard copy widget */}
          <GitCloneWidget repoName={project.name} />
        </div>
      </div>
    );
  }

  if (type === 'skill') {
    const skill = selectedItem as Skill;
    const skillNotes = skill.notes || [];

    const levelColor = skill.level === 'Advanced' ? '#10b981' 
      : skill.level === 'Intermediate' ? 'var(--accent-color)' 
      : '#eab308';

    return (
      <div className="detail-pane">
        <div className="detail-header">
          <div className="detail-category">{skill.category} reference</div>
          <h2 className="detail-title">{skill.name}</h2>
          <p className="detail-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span 
              className="skill-level-dot" 
              style={{ 
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%', 
                backgroundColor: levelColor, flexShrink: 0 
              }} 
            />
            {skill.level} Proficiency
          </p>
        </div>

        <div className="detail-body">
          {/* Study Notes Section */}
          <div className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StickyNote size={13} style={{ opacity: 0.6 }} />
            Study Notes
          </div>
          <ul className="skill-notes-list">
            {skillNotes.map((note, idx) => (
              <li key={idx} className="skill-note-item">
                <span className="skill-note-bullet">›</span>
                <span className="skill-note-text">{note}</span>
              </li>
            ))}
          </ul>

          {/* Classification Info */}
          <div className="detail-section-title">Classification</div>
          <div className="stats-row" style={{ flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Category:</span>
              <span style={{ textTransform: 'capitalize' }}>{skill.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Competency:</span>
              <span style={{ color: levelColor, fontWeight: 600 }}>{skill.level}</span>
            </div>
          </div>

          {/* Documentation Link */}
          {skill.docUrl && (
            <>
              <div className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={13} style={{ opacity: 0.6 }} />
                Reference Documentation
              </div>
              <a
                href={skill.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="skill-doc-link"
              >
                <ExternalLink size={13} />
                <span>{skill.docLabel || 'Open Documentation'}</span>
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  if (type === 'course') {
    const course = selectedItem as AcademicCourse;
    return (
      <CourseNotesView
        courseCode={course.code}
        onSelectCourseCode={onSelectCourseCode}
      />
    );
  }

  if (type === 'navigation') {
    return (
      <div className="detail-pane">
        <div className="detail-header">
          <div className="detail-category">Social Communication</div>
          <h2 className="detail-title">{selectedItem.name}</h2>
          <p className="detail-subtitle">Direct action shortcut</p>
        </div>

        <div className="detail-body">
          <div className="detail-section-title">Action Detail</div>
          <p className="detail-description">
            Selecting this item triggers a redirection or copies details to your clipboard.
          </p>

          <div className="stats-row" style={{ flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Action:</span>
              <span style={{ color: 'var(--accent-color)', fontWeight: 500 }}>{selectedItem.actionLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Destination URI:</span>
              <span style={{ wordBreak: 'break-all', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{selectedItem.value}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'timeline') {
    const activeEvent = selectedItem as TimelineEvent;
    const allEvents = fallbackProfileData.timeline || [];
    const completedCount = allEvents.filter(e => e.status === 'Completed').length;
    const progressPercent = Math.round((completedCount / allEvents.length) * 100);

    return (
      <div className="detail-pane">
        <div className="detail-header">
          <div className="detail-category">{activeEvent.type} milestone</div>
          <h2 className="detail-title">{activeEvent.title}</h2>
          <p className="detail-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} style={{ opacity: 0.6 }} />
            {activeEvent.date} · {activeEvent.institution}
          </p>
        </div>

        <div className="detail-body">
          {/* Milestone Details Card */}
          <div className="notion-callout" style={{ 
            borderLeftColor: activeEvent.status === 'Completed' ? '#10b981' : activeEvent.status === 'In Progress' ? 'var(--accent-color)' : 'var(--border-color)', 
            margin: '0 0 20px 0',
            boxSizing: 'border-box'
          }}>
            <div className="notion-callout-icon">
              {activeEvent.status === 'Completed' ? '✅' : activeEvent.status === 'In Progress' ? '⚡' : '⏳'}
            </div>
            <div className="notion-callout-content">
              <span className={`notion-badge status-${activeEvent.status.toLowerCase().replace(' ', '-')}`} style={{ marginBottom: '8px' }}>
                {activeEvent.status}
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', lineHeight: '1.5', color: 'var(--text-main)' }}>
                {activeEvent.description}
              </p>
            </div>
          </div>

          {/* Interactive Redirection or Navigation Shortcut */}
          {activeEvent.associatedId && (
            <div style={{ marginBottom: '24px' }}>
              <div className="detail-section-title">Linked Portfolio Item</div>
              <button
                className="timeline-card-link-btn"
                onClick={() => {
                  const targetElement = document.getElementById(activeEvent.associatedId || '');
                  if (targetElement) {
                    targetElement.click();
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowRight size={13} />
                <span>Inspect Linked Asset ({activeEvent.associatedId.startsWith('repo-') ? 'Repository' : 'Academic notes'})</span>
              </button>
            </div>
          )}

          {/* Entire Journey Progress Bar */}
          <div className="timeline-progress-section">
            <div className="timeline-progress-header">
              <span>Wildcat Roadmap Progress</span>
              <span className="timeline-progress-percentage">{progressPercent}% Completed</span>
            </div>
            <div className="timeline-progress-bar-container">
              <div className="timeline-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-dimmed)', marginTop: '6px' }}>
              <span>Start (Aug 2025)</span>
              <span>{completedCount} of {allEvents.length} Milestones Cleared</span>
              <span>Sophomore Year (Aug 2026)</span>
            </div>
          </div>

          {/* Timeline Visual Track */}
          <div className="detail-section-title">Full Milestone Journey</div>
          <div className="timeline-track-container">
            <div className="timeline-vertical-line"></div>
            
            {allEvents.map((event) => {
              const isSelected = event.id === activeEvent.id;
              const wrapperClass = `timeline-event-wrapper ${event.status.toLowerCase().replace(' ', '-')} ${isSelected ? 'selected' : ''}`;
              
              return (
                <div 
                  key={event.id} 
                  className={wrapperClass}
                  onClick={() => {
                    const listElement = document.getElementById(`timeline-${event.id}`);
                    if (listElement) {
                      listElement.click();
                    }
                  }}
                >
                  <div className="timeline-event-node"></div>
                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <div className="timeline-card-title-row">
                        <span className="timeline-card-title">{event.title}</span>
                        <span className="timeline-card-date">{event.date}</span>
                      </div>
                      <span className={`timeline-card-badge status-${event.status.toLowerCase().replace(' ', '-')}`}>
                        {event.status}
                      </span>
                    </div>
                    {isSelected && (
                      <p className="timeline-card-description">{event.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ShieldAlert, Sparkles, X } from 'lucide-react';
import { fallbackProfileData } from './data/fallbackData';
import { useGithubRepos } from './hooks/useGithubRepos';
import { CommandList } from './components/CommandList';
import type { ListItem } from './components/CommandList';
import { DetailPanel } from './components/DetailPanel';
import { ActionPanel } from './components/ActionPanel';
import { Toast } from './components/Toast';
import type { ToastItem } from './components/Toast';
import { SpotifyPlayer } from './components/SpotifyPlayer';
import { WelcomeBanner } from './components/WelcomeBanner';
import { AccentModal } from './components/AccentModal';
import { usePortfolioItems } from './hooks/usePortfolioItems';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { PHMapPanel } from './components/PHMapPanel';
import { TerminalConsole } from './components/TerminalConsole';
import { PomodoroTimer } from './components/PomodoroTimer';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [accent, setAccent] = useState<'raycast-red' | 'cit-gold' | 'cit-maroon'>('raycast-red');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [sheets, setSheets] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    welcome: true,
    project: true,
    timeline: true,
    course: false,
    skill: true,
    map: false,
    navigation: true,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const ignoreSearchResetRef = useRef(false);
  const [terminalMode, setTerminalMode] = useState(false);

  const [showMap, setShowMap] = useState(false);

  // Fetch map sheets
  useEffect(() => {
    fetch('/ph_map_sheets.json')
      .then((res) => res.json())
      .then((data) => setSheets(data))
      .catch((err) => console.error('Failed to load map sheets:', err));
  }, []);

  // Fetch GitHub projects
  const { repos, error } = useGithubRepos(fallbackProfileData.githubUsername);

  // Generate unified items list and counts
  const { flatItemsList, sectionCounts } = usePortfolioItems(repos, sheets, showMap);

  // Focus input automatically on load and when clicking empty space
  useEffect(() => {
    searchInputRef.current?.focus();
    const savedAccent = localStorage.getItem('raycast_accent');
    if (savedAccent) {
      setAccent(savedAccent as any);
    }

    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.message) {
        triggerToast(customEvent.detail.message);
      }
    };
    const handleFocusSearch = () => {
      searchInputRef.current?.focus();
      triggerToast("Search panel focused.");
    };
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        setTerminalMode((prev) => !prev);
      }
    };
    window.addEventListener('trigger-toast', handleCustomToast);
    window.addEventListener('focus-search-input', handleFocusSearch);
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('trigger-toast', handleCustomToast);
      window.removeEventListener('focus-search-input', handleFocusSearch);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Trigger toast utility
  function triggerToast(message: string) {
    const newToast: ToastItem = {
      id: String(Date.now()),
      message,
    };
    setToasts((prev) => {
      const next = [...prev, newToast];
      if (next.length > 3) {
        return next.slice(next.length - 3);
      }
      return next;
    });
  }

  // Switch accent theme
  const handleAccentChange = (newAccent: 'raycast-red' | 'cit-gold' | 'cit-maroon') => {
    setAccent(newAccent);
    localStorage.setItem('raycast_accent', newAccent);
    triggerToast(
      `Accent switched to ${
        newAccent === 'cit-gold'
          ? 'CIT Gold'
          : newAccent === 'cit-maroon'
          ? 'CIT Maroon'
          : 'Raycast Red'
      }`
    );
    setShowActionModal(false);
  };

  // Filter items matching search
  const filteredItems = useMemo(() => {
    if (!search.trim()) {
      return flatItemsList.filter((item) => {
        return expandedSections[item.category];
      });
    }
    const query = search.toLowerCase();
    return flatItemsList.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const subtitleMatch = item.subtitle.toLowerCase().includes(query);
      const badgeMatch = item.badge.toLowerCase().includes(query);

      let rawDescriptionMatch = false;
      if (item.category === 'project' && item.rawItem?.description) {
        rawDescriptionMatch = item.rawItem.description.toLowerCase().includes(query);
      } else if (item.category === 'welcome' && item.rawItem?.about) {
        rawDescriptionMatch = item.rawItem.about.toLowerCase().includes(query);
      } else if (item.category === 'course' && item.rawItem?.description) {
        rawDescriptionMatch = item.rawItem.description.toLowerCase().includes(query);
      } else if (item.category === 'timeline' && item.rawItem?.description) {
        rawDescriptionMatch = item.rawItem.description.toLowerCase().includes(query);
      }

      return nameMatch || subtitleMatch || badgeMatch || rawDescriptionMatch;
    });
  }, [search, flatItemsList, expandedSections]);

  // Keep selected index in bounds when items change
  useEffect(() => {
    if (ignoreSearchResetRef.current) {
      ignoreSearchResetRef.current = false;
      return;
    }
    setSelectedIndex(0);
  }, [search]);

  // Currently highlighted item
  const selectedItem = filteredItems[selectedIndex] || null;

  // Handle course selections from the CurriculumRoadmap
  const handleSelectCourseCode = (code: string) => {
    const targetId = code === 'OVERVIEW' ? 'course-overview' : `course-${code}`;
    const isAcademicsExpanded = expandedSections.course;

    if (code !== 'OVERVIEW' && !isAcademicsExpanded) {
      setExpandedSections((prev) => ({ ...prev, course: true }));
    }

    const isMobile = window.innerWidth <= 860;

    if (search.trim() || (code !== 'OVERVIEW' && !isAcademicsExpanded)) {
      ignoreSearchResetRef.current = true;
      setSearch('');
      setExpandedSections((prev) => ({ ...prev, course: true }));
      const targetIdxInFlat = flatItemsList.findIndex((item) => item.id === targetId);
      if (targetIdxInFlat !== -1) {
        setSelectedIndex(targetIdxInFlat);
      }
    } else {
      const targetIdxInFiltered = filteredItems.findIndex((item) => item.id === targetId);
      if (targetIdxInFiltered !== -1) {
        setSelectedIndex(targetIdxInFiltered);
      }
    }

    if (isMobile) {
      setShowMobileDrawer(true);
    }
  };

  // Handle map sheet selections from the map panel
  const handleSelectMapSheet = (sheetNo: string) => {
    const targetId = `map-${sheetNo}`;
    const isMapExpanded = expandedSections.map;

    if (!isMapExpanded) {
      setExpandedSections((prev) => ({ ...prev, map: true }));
    }

    const isMobile = window.innerWidth <= 860;

    if (search.trim() || !isMapExpanded) {
      ignoreSearchResetRef.current = true;
      setSearch('');
      setExpandedSections((prev) => ({ ...prev, map: true }));
      const targetIdxInFlat = flatItemsList.findIndex((item) => item.id === targetId);
      if (targetIdxInFlat !== -1) {
        setSelectedIndex(targetIdxInFlat);
      }
    } else {
      const targetIdxInFiltered = filteredItems.findIndex((item) => item.id === targetId);
      if (targetIdxInFiltered !== -1) {
        setSelectedIndex(targetIdxInFiltered);
      }
    }

    if (isMobile) {
      setShowMobileDrawer(true);
    }
  };

  // Perform navigation or details operations
  const executeItemAction = (item: ListItem) => {
    const isMobile = window.innerWidth <= 860;

    if (item.category === 'navigation') {
      const action = item.rawItem.actionLabel;
      const value = item.rawItem.value;
      if (action === 'Open Link') {
        window.open(value, '_blank');
        triggerToast(`Opening redirection URL...`);
      } else if (action === 'Copy Email') {
        navigator.clipboard.writeText(value);
        triggerToast('Email copied to clipboard!');
      } else if (value === 'EXPORT_RESUME') {
        triggerToast('Preparing PDF Resume for print...');
        setTimeout(() => {
          window.print();
        }, 300);
      } else if (value === 'TOGGLE_MAP') {
        setShowMap((prev) => {
          const next = !prev;
          triggerToast(next ? 'Interactive map background shown.' : 'Interactive map background hidden.');
          return next;
        });
      }
    } else if (item.category === 'timeline') {
      if (item.rawItem.associatedId) {
        const targetId = item.rawItem.associatedId;
        const targetIdx = flatItemsList.findIndex((it) => it.id === targetId);
        if (targetIdx !== -1) {
          const targetItem = flatItemsList[targetIdx];
          if (!expandedSections[targetItem.category]) {
            setExpandedSections((prev) => ({ ...prev, [targetItem.category]: true }));
          }
          setSelectedIndex(targetIdx);
          triggerToast(`Navigated to linked ${targetItem.category}: ${targetItem.name}`);
          return;
        }
      }
      if (item.rawItem.linkUrl) {
        window.open(item.rawItem.linkUrl, '_blank');
        triggerToast(`Opening milestone link...`);
        return;
      }
      if (isMobile) {
        setShowMobileDrawer(true);
      } else {
        triggerToast(`Selected Milestone: ${item.name}`);
      }
    } else if (item.category === 'project') {
      if (isMobile) {
        setShowMobileDrawer(true);
      } else {
        window.open(item.rawItem.html_url, '_blank');
        triggerToast(`Opening repository link...`);
      }
    } else {
      if (isMobile) {
        setShowMobileDrawer(true);
      } else {
        triggerToast(`Selected ${item.name}`);
      }
    }
  };

  // Register Keyboard Navigation Hook
  useKeyboardNavigation({
    filteredItems,
    setSelectedIndex,
    showActionModal,
    setShowActionModal,
    showMobileDrawer,
    setShowMobileDrawer,
    search,
    setSearch,
    selectedItem,
    executeItemAction,
    searchInputRef,
  });

  return (
    <div className="app-container" data-accent={accent} onClick={() => searchInputRef.current?.focus()}>
      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' }}>
        Marc Andrei Regulacion | BS Computer Science Student Portfolio
      </h1>

      {/* Full-screen background map */}
      {showMap && (
        <PHMapPanel
          sheets={sheets}
          selectedItem={selectedItem}
          searchQuery={search}
          onSelectSheet={handleSelectMapSheet}
          accent={accent}
        />
      )}

      {/* Welcome Guide Info Panel */}
      {showWelcome && <WelcomeBanner onClose={() => setShowWelcome(false)} />}

      {/* Main Raycast Window Box & Spotify Bento Module */}
      <div className="portfolio-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="portfolio-column left-column">
          <div className="raycast-window">
              {terminalMode ? (
                <TerminalConsole 
                  onClose={() => setTerminalMode(false)}
                  accent={accent}
                  onThemeChange={(newAccent) => handleAccentChange(newAccent)}
                  projects={repos}
                />
              ) : (
                <>
                  {/* Search header bar */}
                  <div className="search-bar-container">
                    <Search size={18} className="search-icon" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="search-input"
                      placeholder="Search projects, academics, skills, or contact info..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Command search"
                    />
                    {error && (
                      <div className="active-accent-indicator" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444' }}>
                        <ShieldAlert size={11} style={{ marginRight: 2 }} /> Fallback Mode
                      </div>
                    )}
                    <div className="active-accent-indicator">
                      {accent === 'cit-gold' ? 'Wildcats' : 'Classic'}
                    </div>
                  </div>

                  {/* Dual pane list & details */}
                  <div className="palette-grid">
                    {filteredItems.length === 0 ? (
                      <div className="empty-state">
                        <Sparkles size={36} />
                        <div className="empty-state-title">No results found</div>
                        <p className="empty-state-desc">No extension modules match "{search}". Try searching for projects, skills, or CIT courses.</p>
                      </div>
                    ) : (
                      <>
                        {/* Left List */}
                        <CommandList
                          items={filteredItems}
                          selectedIndex={selectedIndex}
                          onItemClick={executeItemAction}
                          onHoverItem={(index) => setSelectedIndex(index)}
                          expandedSections={expandedSections}
                          onToggleSection={(category) => setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }))}
                          sectionCounts={sectionCounts}
                          isSearching={!!search.trim()}
                        />

                        {/* Right Detail Pane */}
                        <DetailPanel
                          key={selectedItem ? `${selectedItem.category}-${selectedItem.id}` : 'empty'}
                          selectedItem={selectedItem?.rawItem}
                          type={selectedItem?.category}
                          onSelectCourseCode={handleSelectCourseCode}
                        />
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Actions Footer Bar */}
              <ActionPanel 
                onActionClick={() => setShowActionModal(true)} 
                accent={accent} 
                onTerminalToggle={() => setTerminalMode(!terminalMode)}
              />

              {/* Settings/Themes Action Dialog Popover */}
              {showActionModal && (
                <AccentModal
                  accent={accent}
                  onAccentChange={handleAccentChange}
                  onClose={() => setShowActionModal(false)}
                />
              )}
          </div>

          {/* Spotify Player underneath the search panel */}
          <div className="spotify-player-wrapper">
            <SpotifyPlayer />
          </div>
        </div>

        <div className="portfolio-column right-column">
          {/* Pomodoro Timer widget */}
          <div className="pomodoro-timer-wrapper">
            <PomodoroTimer />
          </div>
        </div>
      </div>

      {/* Touch Mobile Drawer Sheet Details (Dynamic sliding panel) */}
      {showMobileDrawer && selectedItem && (
        <div className="drawer-overlay" onClick={() => setShowMobileDrawer(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-drag-handle" onClick={() => setShowMobileDrawer(false)}></div>
            <div className="drawer-content">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>
              <DetailPanel
                key={`mobile-${selectedItem.category}-${selectedItem.id}`}
                selectedItem={selectedItem.rawItem}
                type={selectedItem.category}
                onSelectCourseCode={handleSelectCourseCode}
              />
            </div>
          </div>
        </div>
      )}

      {/* Print-only Resume Layout */}
      <div className="resume-print-layout">
        <header className="resume-print-header">
          <h1 className="resume-name">{fallbackProfileData.name}</h1>
          <p className="resume-title">{fallbackProfileData.title} | {fallbackProfileData.institution}</p>
          <div className="resume-contact-row">
            <span>Email: {fallbackProfileData.email}</span>
            <span> | </span>
            <span>GitHub: github.com/{fallbackProfileData.githubUsername}</span>
            <span> | </span>
            <span>LinkedIn: {fallbackProfileData.linkedin}</span>
          </div>
        </header>

        <section className="resume-print-section">
          <h2 className="resume-section-title">About Me</h2>
          <p>{fallbackProfileData.about}</p>
        </section>

        <section className="resume-print-section">
          <h2 className="resume-section-title">Skills & Competencies</h2>
          <div className="resume-skills-grid">
            {fallbackProfileData.skills.map((skill) => (
              <div key={skill.name} className="resume-skill-item">
                <strong>{skill.name}</strong> ({skill.level}) — {skill.notes.join(', ')}
              </div>
            ))}
          </div>
        </section>

        <section className="resume-print-section">
          <h2 className="resume-section-title">Key Projects</h2>
          <div className="resume-projects-list">
            {fallbackProfileData.projects.map((proj) => (
              <div key={proj.id} className="resume-project-item">
                <div className="resume-project-header">
                  <strong>{proj.name}</strong>
                  <span className="resume-project-lang">{proj.language}</span>
                </div>
                <p className="resume-project-desc">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-print-section">
          <h2 className="resume-section-title">Experience & Education Milestones</h2>
          <div className="resume-timeline">
            {fallbackProfileData.timeline.map((event) => (
              <div key={event.id} className="resume-timeline-item">
                <div className="resume-timeline-header">
                  <strong>{event.title}</strong>
                  <span className="resume-timeline-date">{event.date}</span>
                </div>
                <p className="resume-timeline-desc">{event.institution} — {event.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Micro-Toasts */}
      <Toast toasts={toasts} setToasts={setToasts} />
    </div>
  );
}

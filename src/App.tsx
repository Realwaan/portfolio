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

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [accent, setAccent] = useState<'raycast-red' | 'cit-gold' | 'cit-maroon'>('raycast-red');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    welcome: true,
    project: true,
    course: false,
    skill: true,
    navigation: true,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const ignoreSearchResetRef = useRef(false);

  // Fetch GitHub projects
  const { repos, error } = useGithubRepos(fallbackProfileData.githubUsername);

  // Generate unified items list and counts
  const { flatItemsList, sectionCounts } = usePortfolioItems(repos);

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
    window.addEventListener('trigger-toast', handleCustomToast);
    return () => {
      window.removeEventListener('trigger-toast', handleCustomToast);
    };
  }, []);

  // Trigger toast utility
  const triggerToast = (message: string) => {
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
  };

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

      {/* Welcome Guide Info Panel */}
      {showWelcome && <WelcomeBanner onClose={() => setShowWelcome(false)} />}

      {/* Main Raycast Window Box & Spotify Bento Module */}
      <div className="portfolio-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="raycast-window">
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

          {/* Actions Footer Bar */}
          <ActionPanel onActionClick={() => setShowActionModal(true)} accent={accent} />

          {/* Settings/Themes Action Dialog Popover */}
          {showActionModal && (
            <AccentModal
              accent={accent}
              onAccentChange={handleAccentChange}
              onClose={() => setShowActionModal(false)}
            />
          )}
        </div>

        {/* Separate Spotify Player module below the main pane */}
        <SpotifyPlayer />
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

      {/* Floating Micro-Toasts */}
      <Toast toasts={toasts} setToasts={setToasts} />
    </div>
  );
}

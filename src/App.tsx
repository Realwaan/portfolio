import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ShieldAlert, Sparkles, X, Check } from 'lucide-react';
import { fallbackProfileData } from './data/fallbackData';
import { useGithubRepos } from './hooks/useGithubRepos';
import { CommandList } from './components/CommandList';
import type { ListItem } from './components/CommandList';
import { DetailPanel } from './components/DetailPanel';
import { ActionPanel } from './components/ActionPanel';
import { Toast } from './components/Toast';
import type { ToastItem } from './components/Toast';
import { SpotifyPlayer } from './components/SpotifyPlayer';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [accent, setAccent] = useState<'raycast-red' | 'cit-gold' | 'cit-maroon'>('raycast-red');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  // Create search input ref to maintain focus
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Ref to prevent programmatic search clears from resetting selectedIndex
  const ignoreSearchResetRef = useRef(false);

  // Fetch GitHub projects
  const { repos, error } = useGithubRepos(fallbackProfileData.githubUsername);

  // Focus input automatically on load and when clicking empty space
  useEffect(() => {
    searchInputRef.current?.focus();
    // Load saved accent
    const savedAccent = localStorage.getItem('raycast_accent');
    if (savedAccent) {
      setAccent(savedAccent as any);
    }

    // Custom event listener to trigger toasts from child components
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
    setToasts((prev) => [...prev, newToast]);
  };

  // Switch accent theme
  const handleAccentChange = (newAccent: 'raycast-red' | 'cit-gold' | 'cit-maroon') => {
    setAccent(newAccent);
    localStorage.setItem('raycast_accent', newAccent);
    triggerToast(`Accent switched to ${newAccent === 'cit-gold' ? 'CIT Gold' : newAccent === 'cit-maroon' ? 'CIT Maroon' : 'Raycast Red'}`);
    setShowActionModal(false);
  };

  // Convert raw data sets to unified list format
  const flatItemsList = useMemo(() => {
    const items: ListItem[] = [];

    // 1. Welcome Card
    items.push({
      id: 'welcome-card',
      name: fallbackProfileData.name,
      subtitle: fallbackProfileData.title,
      category: 'welcome',
      badge: fallbackProfileData.year,
      iconName: 'User',
      rawItem: fallbackProfileData,
    });

    // 2. Projects
    repos.forEach((repo) => {
      // Short and concise description for the left pane list
      const shortDesc = repo.description && repo.description.length > 25
        ? repo.description.slice(0, 22) + '...'
        : repo.description || 'No description provided.';

      items.push({
        id: `repo-${repo.id}`,
        name: repo.name,
        subtitle: shortDesc,
        category: 'project',
        badge: repo.language,
        iconName: 'FolderCode',
        rawItem: repo,
      });
    });

    // 3. Academic Courses
    items.push({
      id: 'course-overview',
      name: 'BSCS Curriculum Roadmap',
      subtitle: 'Overview, Mind Map & Summation',
      category: 'course',
      badge: 'CIT-U',
      iconName: 'GraduationCap',
      rawItem: { code: 'OVERVIEW', name: 'Curriculum Overview', description: 'Curriculum Roadmap Overview, Mind Map & Summation', semester: 'ALL' },
    });

    fallbackProfileData.courses.forEach((course) => {
      items.push({
        id: `course-${course.code}`,
        name: course.code,
        subtitle: course.name,
        category: 'course',
        badge: 'CIT-U',
        iconName: 'GraduationCap',
        rawItem: course,
      });
    });

    // 4. Skills
    fallbackProfileData.skills.forEach((skill) => {
      items.push({
        id: `skill-${skill.name}`,
        name: skill.name,
        subtitle: skill.level,
        category: 'skill',
        badge: skill.category,
        iconName: skill.iconName,
        rawItem: skill,
      });
    });

    // 5. Navigation & Contacts
    items.push(
      {
        id: 'nav-email',
        name: 'Send Email / Inquire',
        subtitle: fallbackProfileData.email,
        category: 'navigation',
        badge: 'Contact',
        iconName: 'Mail',
        rawItem: { name: 'Email Contact', value: fallbackProfileData.email, actionLabel: 'Copy Email' },
      },
      {
        id: 'nav-github',
        name: 'Visit GitHub Profile',
        subtitle: `github.com/${fallbackProfileData.githubUsername}`,
        category: 'navigation',
        badge: 'Link',
        iconName: 'Github',
        rawItem: { name: 'GitHub Link', value: `https://github.com/${fallbackProfileData.githubUsername}`, actionLabel: 'Open Link' },
      },
      {
        id: 'nav-linkedin',
        name: 'Connect on LinkedIn',
        subtitle: 'Professional network profile',
        category: 'navigation',
        badge: 'Link',
        iconName: 'Linkedin',
        rawItem: { name: 'LinkedIn Link', value: fallbackProfileData.linkedin, actionLabel: 'Open Link' },
      }
    );

    return items;
  }, [repos]);

  // Filter items matching search
  const filteredItems = useMemo(() => {
    if (!search.trim()) return flatItemsList;
    const query = search.toLowerCase();
    return flatItemsList.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const subtitleMatch = item.subtitle.toLowerCase().includes(query);
      const badgeMatch = item.badge.toLowerCase().includes(query);
      
      // Also match full/whole description fields for a better search experience
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
  }, [search, flatItemsList]);

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
    const targetIdxInFlat = flatItemsList.findIndex(item => item.id === targetId);
    if (targetIdxInFlat === -1) return;

    const isMobile = window.innerWidth <= 860;
    const targetIdxInFiltered = filteredItems.findIndex(item => item.id === targetId);
    if (targetIdxInFiltered === -1) {
      ignoreSearchResetRef.current = true;
      setSearch('');
      setSelectedIndex(targetIdxInFlat);
    } else {
      setSelectedIndex(targetIdxInFiltered);
    }

    // Auto-open detail drawer on mobile when navigating courses
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
      // Toggle details drawer on mobile
      if (isMobile) {
        setShowMobileDrawer(true);
      } else {
        triggerToast(`Selected ${item.name}`);
      }
    }
  };

  // Keyboard navigation controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Action menu on Tab
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowActionModal((prev) => !prev);
        return;
      }

      // Close open drawers/menus on Escape
      if (e.key === 'Escape') {
        if (showActionModal) {
          setShowActionModal(false);
        } else if (showMobileDrawer) {
          setShowMobileDrawer(false);
        } else if (search) {
          setSearch('');
        }
        return;
      }

      // Focus input if any other key is pressed and input is not active
      if (document.activeElement !== searchInputRef.current && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        searchInputRef.current?.focus();
      }

      if (filteredItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (showActionModal) {
          // Trigger highlights action modal menu index or click
        } else {
          executeItemAction(selectedItem);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedIndex, showActionModal, selectedItem, showMobileDrawer, search]);

  return (
    <div className="app-container" data-accent={accent} onClick={() => searchInputRef.current?.focus()}>
      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' }}>
        Marc Andrei Regulacion | BS Computer Science Student Portfolio
      </h1>
      
      {/* Welcome Guide Info Panel */}
      {showWelcome && (
        <div className="welcome-banner" onClick={(e) => e.stopPropagation()}>
          <div className="welcome-logo">W</div>
          <div>
            <strong>CIT-U Portfolio Explorer</strong>. Press <kbd>Tab</kbd> for themes or type <kbd>↑↓</kbd> / <kbd>↵</kbd> to explore.
          </div>
          <div className="welcome-banner-close" onClick={() => setShowWelcome(false)}>
            <X size={15} />
          </div>
        </div>
      )}

      {/* Main Raycast Window Box */}
      <div className="raycast-window" onClick={(e) => e.stopPropagation()}>
        
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
              />

              {/* Right Detail Pane */}
              <DetailPanel
                selectedItem={selectedItem?.rawItem}
                type={selectedItem?.category}
                onSelectCourseCode={handleSelectCourseCode}
              />
            </>
          )}
        </div>

        {/* Actions Footer Bar */}
        <ActionPanel
          onActionClick={() => setShowActionModal(true)}
          accent={accent}
        />

        {/* Settings/Themes Action Dialog Popover */}
        {showActionModal && (
          <div className="action-modal-overlay" onClick={() => setShowActionModal(false)}>
            <div className="action-modal" onClick={(e) => e.stopPropagation()}>
              <div className="action-modal-header">Switch Portfolio Accent Accent</div>
              <div className="action-modal-list">
                <div 
                  className={`action-modal-item ${accent === 'raycast-red' ? 'active' : ''}`}
                  onClick={() => handleAccentChange('raycast-red')}
                >
                  <div className="action-modal-item-left">
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff3b30' }}></span>
                    <span>Raycast Crimson Red</span>
                  </div>
                  {accent === 'raycast-red' && <Check size={14} style={{ color: 'var(--accent-color)' }} />}
                </div>
                <div 
                  className={`action-modal-item ${accent === 'cit-gold' ? 'active' : ''}`}
                  onClick={() => handleAccentChange('cit-gold')}
                >
                  <div className="action-modal-item-left">
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffc72c' }}></span>
                    <span>CIT-U Gold Accent</span>
                  </div>
                  {accent === 'cit-gold' && <Check size={14} style={{ color: 'var(--accent-color)' }} />}
                </div>
                <div 
                  className={`action-modal-item ${accent === 'cit-maroon' ? 'active' : ''}`}
                  onClick={() => handleAccentChange('cit-maroon')}
                >
                  <div className="action-modal-item-left">
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#b31010' }}></span>
                    <span>CIT-U Maroon Accent</span>
                  </div>
                  {accent === 'cit-maroon' && <Check size={14} style={{ color: 'var(--accent-color)' }} />}
                </div>
              </div>
            </div>
          </div>
        )}

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

      {/* Floating Spotify Mini-Player */}
      <SpotifyPlayer />

    </div>
  );
}

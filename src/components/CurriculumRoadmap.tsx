import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Map, 
  Search, 
  Filter, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  BookOpen, 
  BarChart3, 
  Layers, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { bscsCurriculum, electivesCatalog, bscsSummation } from '../data/curriculumData';
import type { CourseNode } from '../data/curriculumData';

interface CurriculumRoadmapProps {
  selectedCourseCode: string; // e.g., "CSIT 111" or "OVERVIEW"
  onSelectCourse: (code: string) => void;
}

type TabType = 'roadmap' | 'mindmap' | 'summation';

export const CurriculumRoadmap: React.FC<CurriculumRoadmapProps> = ({
  selectedCourseCode,
  onSelectCourse
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('roadmap');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [streamFilter, setStreamFilter] = useState<string | 'all'>('all');
  const [electiveSearch, setElectiveSearch] = useState('');
  const [electiveGroupFilter, setElectiveGroupFilter] = useState<string | 'all'>('all');

  // Normalize course code for matching (removes spaces, lowercase)
  const normalizeCode = (code: string) => {
    return code.replace(/\s+/g, '').toLowerCase();
  };

  const normalizedSelectedCode = useMemo(() => {
    return normalizeCode(selectedCourseCode);
  }, [selectedCourseCode]);

  // Find currently active course object (if any)
  const activeCourse = useMemo(() => {
    if (normalizedSelectedCode === 'overview') return null;
    return bscsCurriculum.find(c => normalizeCode(c.code) === normalizedSelectedCode) || null;
  }, [normalizedSelectedCode]);

  // Calculate prerequisites and dependents for active course
  const activeDependencies = useMemo(() => {
    if (!activeCourse) return { prerequisites: [], dependents: [] };

    const prereqs = bscsCurriculum.filter(c => 
      activeCourse.prerequisites.some(pCode => normalizeCode(pCode) === normalizeCode(c.code))
    );

    const dependents = bscsCurriculum.filter(c => 
      c.prerequisites.some(pCode => normalizeCode(pCode) === normalizeCode(activeCourse.code))
    );

    return { prerequisites: prereqs, dependents };
  }, [activeCourse]);

  // Stream Meta Helper
  const streamMeta = {
    'computing': { name: 'Computing Foundations', color: '#c084fc', border: 'rgba(192, 132, 252, 0.3)', bg: 'rgba(192, 132, 252, 0.07)' },
    'programming': { name: 'Programming & Dev', color: '#34d399', border: 'rgba(52, 211, 153, 0.3)', bg: 'rgba(52, 211, 153, 0.07)' },
    'math-theory': { name: 'Mathematics & Theory', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)', bg: 'rgba(251, 191, 36, 0.07)' },
    'systems-networks': { name: 'Systems & Networks', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)', bg: 'rgba(96, 165, 250, 0.07)' },
    'ge': { name: 'General Education', color: '#f3f4f6', border: 'rgba(243, 244, 246, 0.2)', bg: 'rgba(243, 244, 246, 0.04)' },
    'elective': { name: 'Track Elective', color: '#f472b6', border: 'rgba(244, 114, 182, 0.3)', bg: 'rgba(244, 114, 182, 0.07)' },
    'others': { name: 'PE / NSTP / Others', color: '#9ca3af', border: 'rgba(156, 163, 175, 0.2)', bg: 'rgba(156, 163, 175, 0.04)' }
  };

  // Group curriculum by year and semester
  const groupedCurriculum = useMemo(() => {
    const years: { [key: number]: { [key: number]: CourseNode[] } } = {
      1: { 1: [], 2: [], 3: [] },
      2: { 1: [], 2: [], 3: [] },
      3: { 1: [], 2: [], 3: [] },
      4: { 1: [], 2: [], 3: [] }
    };

    bscsCurriculum.forEach(course => {
      if (years[course.year] && years[course.year][course.semester]) {
        years[course.year][course.semester].push(course);
      }
    });

    return years;
  }, []);

  // Filtered electives catalog
  const filteredElectives = useMemo(() => {
    const query = electiveSearch.toLowerCase().trim();
    return electivesCatalog.map(group => {
      const filteredOptions = group.options.filter(opt => {
        const matchText = opt.code.toLowerCase().includes(query) || opt.name.toLowerCase().includes(query) || (opt.track && opt.track.toLowerCase().includes(query));
        return matchText;
      });
      return {
        ...group,
        options: filteredOptions
      };
    }).filter(group => {
      const matchGroup = electiveGroupFilter === 'all' || group.id === electiveGroupFilter;
      return matchGroup && group.options.length > 0;
    });
  }, [electiveSearch, electiveGroupFilter]);

  const totalCurriculumUnits = useMemo(() => {
    return bscsCurriculum.reduce((acc, c) => acc + c.units, 0);
  }, []);

  return (
    <div className="curriculum-roadmap-container">
      {/* Dynamic Curriculum Title */}
      <div className="roadmap-title-row">
        <div>
          <span className="roadmap-badge-cit">CIT-U College of Computer Studies</span>
          <h2 className="roadmap-main-title">
            {activeCourse ? activeCourse.code : "BSCS Curriculum"}
          </h2>
          <p className="roadmap-main-subtitle">
            {activeCourse ? activeCourse.name : "Bachelor of Science in Computer Science (2023-2024)"}
          </p>
        </div>
        <div className="roadmap-tabs-list">
          <button 
            className={`roadmap-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <Map size={13} />
            Roadmap
          </button>
          <button 
            className={`roadmap-tab-btn ${activeTab === 'mindmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('mindmap')}
          >
            <Layers size={13} />
            Mind Map
          </button>
          <button 
            className={`roadmap-tab-btn ${activeTab === 'summation' ? 'active' : ''}`}
            onClick={() => setActiveTab('summation')}
          >
            <BarChart3 size={13} />
            Summation
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TIMELINE ROADMAP TAB */}
      {/* ==================================================== */}
      {activeTab === 'roadmap' && (
        <div className="roadmap-tab-content scrollable-area">
          <div className="roadmap-filters-bar">
            <div className="filter-group">
              <span className="filter-label"><Filter size={11} /> Year Level</span>
              <div className="filter-buttons">
                <button className={`filter-opt ${yearFilter === 'all' ? 'active' : ''}`} onClick={() => setYearFilter('all')}>All</button>
                <button className={`filter-opt ${yearFilter === 1 ? 'active' : ''}`} onClick={() => setYearFilter(1)}>1st Yr</button>
                <button className={`filter-opt ${yearFilter === 2 ? 'active' : ''}`} onClick={() => setYearFilter(2)}>2nd Yr</button>
                <button className={`filter-opt ${yearFilter === 3 ? 'active' : ''}`} onClick={() => setYearFilter(3)}>3rd Yr</button>
                <button className={`filter-opt ${yearFilter === 4 ? 'active' : ''}`} onClick={() => setYearFilter(4)}>4th Yr</button>
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label"><BookOpen size={11} /> Stream Filter</span>
              <select 
                className="filter-dropdown"
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value)}
              >
                <option value="all">All Streams</option>
                {Object.entries(streamMeta).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="roadmap-timeline-grid">
            {Object.keys(groupedCurriculum).map(yearNumStr => {
              const yearNum = Number(yearNumStr);
              if (yearFilter !== 'all' && yearFilter !== yearNum) return null;

              return (
                <div key={yearNum} className="roadmap-year-section">
                  <div className="roadmap-year-header">
                    <GraduationCap size={16} />
                    <span>{yearNum === 1 ? 'FIRST YEAR' : yearNum === 2 ? 'SECOND YEAR' : yearNum === 3 ? 'THIRD YEAR' : 'FOURTH YEAR'}</span>
                  </div>

                  <div className="roadmap-semesters-row">
                    {[1, 2, 3].map(semNum => {
                      const courses = groupedCurriculum[yearNum][semNum] || [];
                      if (courses.length === 0) return null;

                      // Check if stream filter filters out all courses in this sem
                      const visibleCourses = courses.filter(c => streamFilter === 'all' || c.stream === streamFilter);
                      if (visibleCourses.length === 0) return null;

                      return (
                        <div key={semNum} className="roadmap-sem-col">
                          <h4 className="roadmap-sem-title">
                            {semNum === 1 ? '1st Semester' : semNum === 2 ? '2nd Semester' : 'Summer Term'}
                            <span className="sem-units-badge">
                              {courses.reduce((acc, c) => acc + c.units, 0)} Units
                            </span>
                          </h4>

                          <div className="roadmap-course-nodes-list">
                            {visibleCourses.map(course => {
                              const isSelected = normalizeCode(course.code) === normalizedSelectedCode;
                              const meta = streamMeta[course.stream] || streamMeta.others;
                              
                              return (
                                <div 
                                  key={course.code}
                                  className={`roadmap-course-card ${isSelected ? 'active-highlight' : ''}`}
                                  onClick={() => onSelectCourse(course.code)}
                                  style={{
                                    borderLeft: `3px solid ${meta.color}`,
                                    background: isSelected ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--bg-selected)'
                                  }}
                                >
                                  <div className="course-card-top">
                                    <span className="course-card-code font-mono">{course.code}</span>
                                    <span className="course-card-units font-mono">{course.units.toFixed(1)}u</span>
                                  </div>
                                  <div className="course-card-name">{course.name}</div>
                                  <div className="course-card-meta">
                                    <span className="stream-dot" style={{ backgroundColor: meta.color }}></span>
                                    <span className="stream-text" style={{ color: meta.color }}>{meta.name}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUBJECT MIND MAP TAB */}
      {/* ==================================================== */}
      {activeTab === 'mindmap' && (
        <div className="roadmap-tab-content scrollable-area">
          {activeCourse ? (
            <div className="mindmap-focused-view">
              <div className="mindmap-navigation-controls">
                <button 
                  className="mindmap-back-btn" 
                  onClick={() => onSelectCourse('OVERVIEW')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ArrowLeft size={13} /> Full Catalog
                </button>
                <div className="stream-badge-display" style={{ 
                  color: streamMeta[activeCourse.stream].color, 
                  borderColor: streamMeta[activeCourse.stream].border,
                  backgroundColor: streamMeta[activeCourse.stream].bg 
                }}>
                  {streamMeta[activeCourse.stream].name}
                </div>
              </div>

              {/* Pathway Link Nodes Container */}
              <div className="mindmap-tree-layout">
                {/* 1. Prerequisites Column */}
                <div className="mindmap-column prereqs-col">
                  <h4 className="mindmap-column-title orange-glow-text">Prerequisites (Incoming)</h4>
                  <div className="mindmap-nodes-container">
                    {activeDependencies.prerequisites.length > 0 ? (
                      activeDependencies.prerequisites.map(pre => (
                        <div 
                          key={pre.code} 
                          className="mindmap-node-card prereq-node"
                          onClick={() => onSelectCourse(pre.code)}
                        >
                          <span className="node-code font-mono">{pre.code}</span>
                          <span className="node-name">{pre.name}</span>
                          <span className="node-indicator font-mono">Prerequisite →</span>
                        </div>
                      ))
                    ) : (
                      <div className="mindmap-empty-node-state">
                        <Award size={18} style={{ opacity: 0.5, marginBottom: 4 }} />
                        <span>No Prerequisites</span>
                        <p style={{ fontSize: '10px', color: 'var(--text-dimmed)', marginTop: 2 }}>This is an introductory foundation course.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Connector Left-to-Center */}
                <div className="mindmap-arrow-divider">
                  <ArrowRight size={24} className="flowing-arrow orange-glow-text" />
                </div>

                {/* 2. Active Core Node Column */}
                <div className="mindmap-column active-core-col">
                  <h4 className="mindmap-column-title accent-glow-text">Focused Course</h4>
                  <div className="mindmap-nodes-container">
                    <div 
                      className="mindmap-node-card core-node" 
                      style={{ 
                        borderColor: 'var(--accent-color)',
                        boxShadow: '0 0 15px rgba(var(--accent-rgb), 0.15)'
                      }}
                    >
                      <span className="node-code font-mono" style={{ color: 'var(--accent-color)' }}>{activeCourse.code}</span>
                      <span className="node-name" style={{ fontWeight: 600 }}>{activeCourse.name}</span>
                      <div className="node-details-grid">
                        <div>
                          <span className="grid-label">LEC/LAB</span>
                          <span className="grid-val font-mono">{activeCourse.lec} / {activeCourse.lab} hrs</span>
                        </div>
                        <div>
                          <span className="grid-label">UNITS</span>
                          <span className="grid-val font-mono">{activeCourse.units} Units</span>
                        </div>
                        <div>
                          <span className="grid-label">TERM</span>
                          <span className="grid-val font-mono">Yr {activeCourse.year} Sem {activeCourse.semester}</span>
                        </div>
                      </div>
                      <p className="node-desc">{activeCourse.description}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector Center-to-Right */}
                <div className="mindmap-arrow-divider">
                  <ArrowRight size={24} className="flowing-arrow blue-glow-text" />
                </div>

                {/* 3. Dependent Node Column */}
                <div className="mindmap-column dependents-col">
                  <h4 className="mindmap-column-title blue-glow-text">Unlocks (Outgoing)</h4>
                  <div className="mindmap-nodes-container">
                    {activeDependencies.dependents.length > 0 ? (
                      activeDependencies.dependents.map(dep => (
                        <div 
                          key={dep.code} 
                          className="mindmap-node-card dependent-node"
                          onClick={() => onSelectCourse(dep.code)}
                        >
                          <span className="node-code font-mono">{dep.code}</span>
                          <span className="node-name">{dep.name}</span>
                          <span className="node-indicator font-mono">→ Unlocks</span>
                        </div>
                      ))
                    ) : (
                      <div className="mindmap-empty-node-state">
                        <TrendingUp size={18} style={{ opacity: 0.5, marginBottom: 4 }} />
                        <span>Terminal Course</span>
                        <p style={{ fontSize: '10px', color: 'var(--text-dimmed)', marginTop: 2 }}>This course does not serve as a prerequisite to others.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mindmap-welcome-pane">
              <div className="welcome-inner">
                <Layers size={40} style={{ color: 'var(--accent-color)', opacity: 0.8, marginBottom: 12 }} />
                <h3>NotebookLM Subject Mind Map</h3>
                <p>Select any academic subject code below or from the timeline to visually trace its prerequisite pathways and downstream dependencies.</p>
              </div>

              <div className="mindmap-grid-directory">
                {Object.entries(streamMeta).map(([streamKey, streamVal]) => {
                  const streamCourses = bscsCurriculum.filter(c => c.stream === streamKey);
                  if (streamCourses.length === 0) return null;

                  return (
                    <div key={streamKey} className="mindmap-directory-col" style={{ borderColor: streamVal.border, backgroundColor: streamVal.bg }}>
                      <h4 className="directory-stream-title" style={{ color: streamVal.color }}>
                        {streamVal.name}
                      </h4>
                      <div className="directory-nodes-list">
                        {streamCourses.map(course => (
                          <button 
                            key={course.code} 
                            className="directory-node-btn font-mono"
                            onClick={() => onSelectCourse(course.code)}
                          >
                            {course.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* CURRICULUM SUMMATION & ELECTIVES TAB */}
      {/* ==================================================== */}
      {activeTab === 'summation' && (
        <div className="roadmap-tab-content scrollable-area">
          
          {/* Stats Summary Cards */}
          <div className="summation-stats-container">
            <div className="summation-main-card glass-panel">
              <h3 className="summation-section-title">BSCS Curriculum Metric Summation</h3>
              <div className="summation-grid">
                <div className="summation-stat-card">
                  <span className="stat-label">Total Academic Units</span>
                  <span className="stat-value font-mono">{bscsSummation.totalUnits.toFixed(1)}</span>
                  <p className="stat-note">Graduation requirement</p>
                </div>
                <div className="summation-stat-card">
                  <span className="stat-label">Lecture Units</span>
                  <span className="stat-value font-mono" style={{ color: '#60a5fa' }}>{bscsSummation.lectureUnits.toFixed(1)}</span>
                  <p className="stat-note">Theory & logic instruction</p>
                </div>
                <div className="summation-stat-card">
                  <span className="stat-label">Lab Units</span>
                  <span className="stat-value font-mono" style={{ color: '#34d399' }}>{bscsSummation.labUnits.toFixed(1)}</span>
                  <p className="stat-note">Hands-on applications</p>
                </div>
              </div>

              {/* Lecture/Lab Ratio Meter */}
              <div className="summation-ratio-box">
                <div className="ratio-labels">
                  <span>Lecture Units Ratio ({((bscsSummation.lectureUnits / bscsSummation.totalUnits) * 100).toFixed(0)}%)</span>
                  <span>Lab Units Ratio ({((bscsSummation.labUnits / bscsSummation.totalUnits) * 100).toFixed(0)}%)</span>
                </div>
                <div className="ratio-bar-track">
                  <div 
                    className="ratio-bar-fill lecture" 
                    style={{ width: `${(bscsSummation.lectureUnits / bscsSummation.totalUnits) * 100}%` }}
                  ></div>
                  <div 
                    className="ratio-bar-fill lab" 
                    style={{ width: `${(bscsSummation.labUnits / bscsSummation.totalUnits) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="summation-meta-card glass-panel">
              <h3 className="summation-section-title">CIT-University Profile</h3>
              <div className="summation-meta-list font-mono">
                <div className="meta-row">
                  <span className="meta-lbl">Institution</span>
                  <span className="meta-val">{bscsSummation.institution}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">College</span>
                  <span className="meta-val">{bscsSummation.college}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Program</span>
                  <span className="meta-val">{bscsSummation.program}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Curriculum</span>
                  <span className="meta-val">CY {bscsSummation.curriculumYear}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Degree Units</span>
                  <span className="meta-val">{totalCurriculumUnits.toFixed(1)} Catalog Units</span>
                </div>
              </div>
            </div>
          </div>

          {/* Electives Catalog Section */}
          <div className="electives-catalog-section">
            <div className="electives-header-row">
              <h3 className="summation-section-title" style={{ marginBottom: 0 }}>
                CIT-U Elective Options List
              </h3>
              
              <div className="electives-controls">
                {/* Search */}
                <div className="elective-search-wrapper">
                  <Search size={12} className="search-icon-small" />
                  <input 
                    type="text"
                    className="elective-search-input"
                    placeholder="Search electives or tracks..."
                    value={electiveSearch}
                    onChange={(e) => setElectiveSearch(e.target.value)}
                  />
                </div>

                {/* Group Filter */}
                <select 
                  className="filter-dropdown-small"
                  value={electiveGroupFilter}
                  onChange={(e) => setElectiveGroupFilter(e.target.value)}
                >
                  <option value="all">All Electives</option>
                  {electivesCatalog.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="electives-groups-grid">
              {filteredElectives.length > 0 ? (
                filteredElectives.map(group => (
                  <div key={group.id} className="elective-group-card glass-panel">
                    <h4 className="elective-group-title font-mono">{group.title}</h4>
                    <div className="elective-options-list">
                      {group.options.map(opt => (
                        <div key={opt.code} className="elective-option-row">
                          <div className="opt-left">
                            <span className="opt-code font-mono">{opt.code}</span>
                            <span className="opt-name">{opt.name}</span>
                          </div>
                          {opt.track && (
                            <span className="opt-track-badge font-mono">{opt.track}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="electives-empty-state">
                  <HelpCircle size={24} style={{ opacity: 0.4, marginBottom: 6 }} />
                  <span>No Electives Match Search</span>
                  <p>Try searching for different keywords or select another filter.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

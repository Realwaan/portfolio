import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Map, 
  Search, 
  Filter, 
  BookOpen, 
  BarChart3, 
  Layers, 
  HelpCircle,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';
import { bscsCurriculum, electivesCatalog, bscsSummation } from '../data/curriculumData';
import type { CourseNode } from '../data/curriculumData';

interface CurriculumRoadmapProps {
  selectedCourseCode: string; // e.g., "CSIT 111" or "OVERVIEW"
  onSelectCourse: (code: string) => void;
}

type TabType = 'roadmap' | 'mindmap' | 'summation';

interface PipelineNode {
  code: string;
  name: string;
  x: number;
  y: number;
  stream: 'computing' | 'programming' | 'math-theory' | 'systems-networks' | 'elective' | 'ge' | 'others';
}

// 760x320 grid coordinate layouts
const CORE_PIPELINE: PipelineNode[] = [
  { code: 'CSIT 111', name: 'Intro to Computing', x: 40, y: 55, stream: 'computing' },
  { code: 'CSIT 121', name: 'Fund. of Programming', x: 40, y: 195, stream: 'programming' },
  
  { code: 'CSIT 112', name: 'Computer Org', x: 175, y: 55, stream: 'computing' },
  { code: 'CSIT 122', name: 'Object-Oriented Prog', x: 175, y: 195, stream: 'programming' },
  
  { code: 'CSIT 211', name: 'Data Structures', x: 310, y: 195, stream: 'programming' },
  
  { code: 'CSIT 212', name: 'Systems Analysis', x: 445, y: 55, stream: 'systems-networks' },
  { code: 'CSIT 221', name: 'Algorithms', x: 445, y: 195, stream: 'programming' },
  
  { code: 'CSIT 312', name: 'Operating Systems', x: 580, y: 55, stream: 'systems-networks' },
  { code: 'CSIT 311', name: 'Software Engineering', x: 580, y: 195, stream: 'programming' },
  
  { code: 'CSIT 321', name: 'Capstone/Thesis', x: 690, y: 195, stream: 'programming' },
];

const PIPELINE_LINKS = [
  { from: 'CSIT 111', to: 'CSIT 112' },
  { from: 'CSIT 121', to: 'CSIT 122' },
  { from: 'CSIT 122', to: 'CSIT 211' },
  { from: 'CSIT 112', to: 'CSIT 212' },
  { from: 'CSIT 211', to: 'CSIT 221' },
  { from: 'CSIT 212', to: 'CSIT 312' },
  { from: 'CSIT 221', to: 'CSIT 311' },
  { from: 'CSIT 311', to: 'CSIT 321' },
];

export const CurriculumRoadmap: React.FC<CurriculumRoadmapProps> = ({
  selectedCourseCode,
  onSelectCourse
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('mindmap'); // Default to Mind Map directly for premium first impression!
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [streamFilter, setStreamFilter] = useState<string | 'all'>('all');
  const [electiveSearch, setElectiveSearch] = useState('');
  const [electiveGroupFilter, setElectiveGroupFilter] = useState<string | 'all'>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Zoom/Pan States for Mind Map
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  // Mouse drag handlers for canvas panning
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only pan on left click
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset zoom & pan on course selection change
  React.useEffect(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }, [selectedCourseCode]);

  // Native wheel listener for smooth wheel zooming without passive scroll warnings
  React.useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const scaleChange = e.deltaY < 0 ? 0.08 : -0.08;
      setZoom(z => Math.max(0.5, Math.min(2.5, z + scaleChange)));
    };

    svgEl.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => {
      svgEl.removeEventListener('wheel', handleWheelEvent);
    };
  }, [activeTab, selectedCourseCode]);

  // Normalize course code for matching
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
    'computing': { name: 'Computing Foundations', color: '#c084fc', border: 'rgba(192, 132, 252, 0.45)', bg: 'rgba(192, 132, 252, 0.08)', lineColor: 'rgba(192, 132, 252, 0.28)' },
    'programming': { name: 'Programming & Dev', color: '#34d399', border: 'rgba(52, 211, 153, 0.45)', bg: 'rgba(52, 211, 153, 0.08)', lineColor: 'rgba(52, 211, 153, 0.28)' },
    'math-theory': { name: 'Mathematics & Theory', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.45)', bg: 'rgba(251, 191, 36, 0.08)', lineColor: 'rgba(251, 191, 36, 0.28)' },
    'systems-networks': { name: 'Systems & Networks', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.45)', bg: 'rgba(96, 165, 250, 0.08)', lineColor: 'rgba(96, 165, 250, 0.28)' },
    'ge': { name: 'General Education', color: '#e2e8f0', border: 'rgba(226, 232, 240, 0.35)', bg: 'rgba(226, 232, 240, 0.05)', lineColor: 'rgba(226, 232, 240, 0.2)' },
    'elective': { name: 'Track Elective', color: '#f472b6', border: 'rgba(244, 114, 182, 0.45)', bg: 'rgba(244, 114, 182, 0.08)', lineColor: 'rgba(244, 114, 182, 0.28)' },
    'others': { name: 'PE / NSTP / Others', color: '#9ca3af', border: 'rgba(156, 163, 175, 0.35)', bg: 'rgba(156, 163, 175, 0.04)', lineColor: 'rgba(156, 163, 175, 0.2)' }
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

  // Curved Bezier calculation helper
  const getCurvePath = (x1: number, y1: number, x2: number, y2: number) => {
    const controlOffset = Math.abs(x2 - x1) * 0.45;
    return `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`;
  };

  // ----------------------------------------------------
  // RENDER INTERACTIVE MIND MAP: OVERVIEW GRAPH
  // ----------------------------------------------------
  const renderOverviewGraph = () => {
    const nodeWidth = 110;
    const nodeHeight = 44;

    return (
      <svg 
        ref={svgRef}
        className="mindmap-svg" 
        viewBox="0 0 830 320" 
        width="100%" 
        height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255, 255, 255, 0.25)" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--accent-color)" />
          </marker>
        </defs>

        <g 
          transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`} 
          style={{ transformOrigin: '0 0', transition: isDragging ? 'none' : 'transform 0.15s ease' }}
        >
          {/* Draw connectors first so they render underneath the node cards */}
          <g className="connections-layer">
            {PIPELINE_LINKS.map((link, idx) => {
              const fromNode = CORE_PIPELINE.find(n => n.code === link.from);
              const toNode = CORE_PIPELINE.find(n => n.code === link.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + nodeWidth;
              const y1 = fromNode.y + nodeHeight / 2;
              const x2 = toNode.x;
              const y2 = toNode.y + nodeHeight / 2;

              const isLinkActive = hoveredNode === link.from || hoveredNode === link.to;
              const fromMeta = streamMeta[fromNode.stream] || streamMeta.others;
              const color = isLinkActive ? 'var(--accent-color)' : fromMeta.lineColor;

              return (
                <path
                  key={`link-${idx}`}
                  d={getCurvePath(x1, y1, x2, y2)}
                  fill="none"
                  stroke={color}
                  strokeWidth={isLinkActive ? 2.5 : 1.5}
                  className={isLinkActive ? 'flowing-line' : ''}
                  markerEnd={isLinkActive ? "url(#arrow-active)" : "url(#arrow)"}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
              );
            })}
          </g>

          {/* Draw node blocks */}
          <g className="nodes-layer">
            {CORE_PIPELINE.map(node => {
              const meta = streamMeta[node.stream] || streamMeta.others;
              const isHovered = hoveredNode === node.code;
              const isSelected = normalizeCode(node.code) === normalizedSelectedCode;

              return (
                <g 
                  key={node.code}
                  className={`mindmap-svg-node-group ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNode(node.code)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => onSelectCourse(node.code)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Node Box */}
                  <rect
                    width={nodeWidth}
                    height={nodeHeight}
                    rx="6"
                    ry="6"
                    fill="rgba(18, 18, 20, 0.85)"
                    stroke={isSelected ? 'var(--accent-color)' : isHovered ? meta.color : meta.border}
                    strokeWidth={isSelected ? 1.5 : isHovered ? 1.2 : 1}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  
                  {/* Accent line on left */}
                  <rect
                    width="3.5"
                    height={nodeHeight - 8}
                    rx="1"
                    x="4"
                    y="4"
                    fill={meta.color}
                  />

                  {/* Course Code Text */}
                  <text
                    x="12"
                    y="18"
                    fill={isSelected ? 'var(--accent-color)' : isHovered ? meta.color : 'rgba(255, 255, 255, 0.9)'}
                    fontSize="9.5"
                    fontWeight="600"
                    fontFamily="var(--font-mono)"
                  >
                    {node.code}
                  </text>

                  {/* Course Title Text (Fitted) */}
                  <text
                    x="12"
                    y="30"
                    fill="rgba(255, 255, 255, 0.6)"
                    fontSize="8.5"
                    fontWeight="400"
                    clipPath="inset(0 8px 0 0)"
                  >
                    {node.name.length > 17 ? node.name.slice(0, 15) + '..' : node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    );
  };

  // ----------------------------------------------------
  // RENDER INTERACTIVE MIND MAP: FOCUSED ROADMAP TREE
  // ----------------------------------------------------
  const renderFocusedTree = () => {
    if (!activeCourse) return null;

    const coreWidth = 145;
    const coreHeight = 52;
    const nodeWidth = 130;
    const nodeHeight = 44;

    const prereqs = activeDependencies.prerequisites;
    const dependents = activeDependencies.dependents;

    // Distribute prerequisites vertically on the left side
    const prereqNodes = prereqs.map((p, idx) => {
      const totalH = prereqs.length * nodeHeight + (prereqs.length - 1) * 14;
      const startY = (270 - totalH) / 2 + 10;
      const y = startY + idx * (nodeHeight + 14);
      return { ...p, x: 40, y };
    });

    // Core Node centered coordinates
    const coreX = 300;
    const coreY = 120;

    // Distribute dependents vertically on the right side
    const dependentNodes = dependents.map((d, idx) => {
      const totalH = dependents.length * nodeHeight + (dependents.length - 1) * 14;
      const startY = (270 - totalH) / 2 + 10;
      const y = startY + idx * (nodeHeight + 14);
      return { ...d, x: 560, y };
    });

    return (
      <svg 
        ref={svgRef}
        className="mindmap-svg" 
        viewBox="0 0 830 320" 
        width="100%" 
        height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255, 255, 255, 0.25)" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--accent-color)" />
          </marker>
        </defs>

        <g 
          transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`} 
          style={{ transformOrigin: '0 0', transition: isDragging ? 'none' : 'transform 0.15s ease' }}
        >
          {/* Connection paths */}
          <g className="connections-layer">
            {/* Prerequisites connections */}
            {prereqNodes.map((pre, idx) => {
              const x1 = pre.x + nodeWidth;
              const y1 = pre.y + nodeHeight / 2;
              const x2 = coreX;
              const y2 = coreY + coreHeight / 2;

              const isHovered = hoveredNode === pre.code;
              const preMeta = streamMeta[pre.stream] || streamMeta.others;
              const color = isHovered ? preMeta.color : 'rgba(251, 146, 60, 0.4)';

              return (
                <path
                  key={`pre-link-${idx}`}
                  d={getCurvePath(x1, y1, x2, y2)}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className={isHovered ? 'flowing-line' : 'static-flow-pre'}
                  markerEnd={isHovered ? "url(#arrow-active)" : "url(#arrow)"}
                  style={{ strokeDasharray: isHovered ? '6 4' : '4 3', transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
              );
            })}

            {/* Dependents connections */}
            {dependentNodes.map((dep, idx) => {
              const x1 = coreX + coreWidth;
              const y1 = coreY + coreHeight / 2;
              const x2 = dep.x;
              const y2 = dep.y + nodeHeight / 2;

              const isHovered = hoveredNode === dep.code;
              const depMeta = streamMeta[dep.stream] || streamMeta.others;
              const color = isHovered ? depMeta.color : 'rgba(96, 165, 250, 0.4)';

              return (
                <path
                  key={`dep-link-${idx}`}
                  d={getCurvePath(x1, y1, x2, y2)}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className={isHovered ? 'flowing-line' : 'static-flow-dep'}
                  markerEnd={isHovered ? "url(#arrow-active)" : "url(#arrow)"}
                  style={{ strokeDasharray: isHovered ? '6 4' : '4 3', transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
              );
            })}
          </g>

          {/* Nodes rendering */}
          <g className="nodes-layer">
            {/* 1. Prerequisites stack (incoming) */}
            {prereqNodes.length > 0 ? (
              prereqNodes.map(pre => {
                const meta = streamMeta[pre.stream] || streamMeta.others;
                const isHovered = hoveredNode === pre.code;
                return (
                  <g
                    key={pre.code}
                    className={`mindmap-svg-node-group ${isHovered ? 'hovered' : ''}`}
                    transform={`translate(${pre.x}, ${pre.y})`}
                    onMouseEnter={() => setHoveredNode(pre.code)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => onSelectCourse(pre.code)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      width={nodeWidth}
                      height={nodeHeight}
                      rx="6"
                      ry="6"
                      fill="rgba(18, 18, 20, 0.85)"
                      stroke={isHovered ? meta.color : meta.border}
                      strokeWidth={isHovered ? 1.5 : 1}
                    />
                    <rect width="3.5" height={nodeHeight - 8} rx="1" x="4" y="4" fill={meta.color} />
                    <text x="12" y="18" fill={isHovered ? meta.color : 'rgba(255, 255, 255, 0.9)'} fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
                      {pre.code}
                    </text>
                    <text x="12" y="30" fill="rgba(255, 255, 255, 0.6)" fontSize="8" fontWeight="400">
                      {pre.name.length > 20 ? pre.name.slice(0, 18) + '..' : pre.name}
                    </text>
                    <text x={nodeWidth - 32} y="16" fill="rgba(251, 146, 60, 0.8)" fontSize="7" fontWeight="600" fontFamily="var(--font-mono)">PREREQ</text>
                  </g>
                );
              })
            ) : (
              /* Introductory foundation placeholder */
              <g transform="translate(40, 110)">
                <rect width={nodeWidth} height={50} rx="8" ry="8" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                <text x={nodeWidth / 2} y="22" textAnchor="middle" fill="var(--text-dimmed)" fontSize="9" fontWeight="600">🌅 Introductory</text>
                <text x={nodeWidth / 2} y="34" textAnchor="middle" fill="rgba(255, 255, 255, 0.2)" fontSize="8">No Prerequisites</text>
              </g>
            )}

            {/* 2. Core Node (focused) */}
            <g 
              transform={`translate(${coreX}, ${coreY})`} 
              className="core-node-group"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <rect
                width={coreWidth}
                height={coreHeight}
                rx="8"
                ry="8"
                fill="rgba(22, 22, 26, 0.9)"
                stroke="var(--accent-color)"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 8px rgba(var(--accent-rgb), 0.2))' }}
              />
              <rect width="4" height={coreHeight - 10} rx="1" x="5" y="5" fill="var(--accent-color)" />
              <text x="16" y="20" fill="var(--accent-color)" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
                {activeCourse.code}
              </text>
              <text x="16" y="32" fill="rgba(255, 255, 255, 0.95)" fontSize="9.5" fontWeight="600">
                {activeCourse.name.length > 22 ? activeCourse.name.slice(0, 20) + '..' : activeCourse.name}
              </text>
              <text x="16" y="44" fill="rgba(255, 255, 255, 0.5)" fontSize="8" fontFamily="var(--font-mono)">
                {activeCourse.units} Units · Yr{activeCourse.year} Sem{activeCourse.semester}
              </text>
            </g>

            {/* 3. Dependent stack (unlocks) */}
            {dependentNodes.length > 0 ? (
              dependentNodes.map(dep => {
                const meta = streamMeta[dep.stream] || streamMeta.others;
                const isHovered = hoveredNode === dep.code;
                return (
                  <g
                    key={dep.code}
                    className={`mindmap-svg-node-group ${isHovered ? 'hovered' : ''}`}
                    transform={`translate(${dep.x}, ${dep.y})`}
                    onMouseEnter={() => setHoveredNode(dep.code)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => onSelectCourse(dep.code)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      width={nodeWidth}
                      height={nodeHeight}
                      rx="6"
                      ry="6"
                      fill="rgba(18, 18, 20, 0.85)"
                      stroke={isHovered ? meta.color : meta.border}
                      strokeWidth={isHovered ? 1.5 : 1}
                    />
                    <rect width="3.5" height={nodeHeight - 8} rx="1" x="4" y="4" fill={meta.color} />
                    <text x="12" y="18" fill={isHovered ? meta.color : 'rgba(255, 255, 255, 0.9)'} fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
                      {dep.code}
                    </text>
                    <text x="12" y="30" fill="rgba(255, 255, 255, 0.6)" fontSize="8" fontWeight="400">
                      {dep.name.length > 20 ? dep.name.slice(0, 18) + '..' : dep.name}
                    </text>
                    <text x={nodeWidth - 36} y="16" fill="rgba(96, 165, 250, 0.8)" fontSize="7" fontWeight="600" fontFamily="var(--font-mono)">UNLOCKS</text>
                  </g>
                );
              })
            ) : (
              /* Terminal course placeholder */
              <g transform="translate(560, 110)">
                <rect width={nodeWidth} height={50} rx="8" ry="8" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
                <text x={nodeWidth / 2} y="22" textAnchor="middle" fill="var(--text-dimmed)" fontSize="9" fontWeight="600">🏆 Terminal Node</text>
                <text x={nodeWidth / 2} y="34" textAnchor="middle" fill="rgba(255, 255, 255, 0.2)" fontSize="8">Final Pathway Subject</text>
              </g>
            )}
          </g>
        </g>
      </svg>
    );
  };

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
            className={`roadmap-tab-btn ${activeTab === 'mindmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('mindmap')}
          >
            <Layers size={13} />
            Mind Map
          </button>
          <button 
            className={`roadmap-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <Map size={13} />
            Roadmap
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
      {/* SUBJECT MIND MAP TAB (RE-ENGINEERED) */}
      {/* ==================================================== */}
      {activeTab === 'mindmap' && (
        <div className="roadmap-tab-content" style={{ padding: '8px' }}>
          <div className="mindmap-canvas-card glass-panel" style={{ padding: 12, overflow: 'hidden' }}>
            <div className="mindmap-header-bar">
              <span className="mindmap-canvas-title font-mono" style={{ color: 'var(--text-main)', fontSize: '11px', fontWeight: 600 }}>
                {activeCourse ? `Interactive Pathway: ${activeCourse.code}` : 'Interactive CSIT Subject Pipeline Map'}
              </span>
              {activeCourse && (
                <button 
                  className="mindmap-reset-btn" 
                  onClick={() => onSelectCourse('OVERVIEW')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                    fontSize: '9.5px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ← Back to Pipeline
                </button>
              )}
            </div>

            {/* SVG responsive scrolling canvas */}
            <div className="mindmap-svg-scroll-wrapper" style={{ position: 'relative' }}>
              <div className="mindmap-svg-canvas">
                {activeCourse ? renderFocusedTree() : renderOverviewGraph()}
              </div>

              {/* Floating Zoom Controls */}
              <div className="mindmap-zoom-controls" onMouseDown={(e) => e.stopPropagation()}>
                <button 
                  className="zoom-btn" 
                  onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(2.5, z + 0.15)); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Zoom In"
                >
                  <Plus size={12} />
                </button>
                <button 
                  className="zoom-btn" 
                  onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.5, z - 0.15)); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Zoom Out"
                >
                  <Minus size={12} />
                </button>
                <button 
                  className="zoom-btn" 
                  onClick={(e) => { e.stopPropagation(); setZoom(1); setPanOffset({ x: 0, y: 0 }); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Reset View"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>

            {/* Pipeline Stream Legend */}
            <div className="mindmap-legend-row">
              <div className="legend-title font-mono">Stream Categories:</div>
              <div className="legend-items-list">
                {Object.entries(streamMeta)
                  .filter(([key]) => ['computing', 'programming', 'systems-networks'].includes(key))
                  .map(([key, val]) => (
                    <div key={key} className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: val.color }} />
                      <span className="legend-lbl">{val.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

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

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ListItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'project' | 'skill' | 'course' | 'navigation' | 'welcome';
  badge: string;
  iconName: string;
  rawItem: any;
}

interface CommandListProps {
  items: ListItem[];
  selectedIndex: number;
  onItemClick: (item: ListItem) => void;
  onHoverItem: (index: number) => void;
}

// Dynamic icon mapper component
const IconRenderer: React.FC<{ name: string; size?: number }> = ({ name, size = 16 }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle size={size} />;
  }
  return <IconComponent size={size} />;
};

export const CommandList: React.FC<CommandListProps> = ({
  items,
  selectedIndex,
  onItemClick,
  onHoverItem
}) => {
  const [academicsExpanded, setAcademicsExpanded] = useState(false);

  // Group items by category to display them in sections
  const categories: { [key: string]: ListItem[] } = {
    'Welcome Profile': [],
    'GitHub Projects': [],
    'Academic Modules (CIT-U)': [],
    'Technical Capabilities': [],
    'Navigation & Actions': []
  };

  const categoryMap: { [key: string]: string } = {
    'welcome': 'Welcome Profile',
    'project': 'GitHub Projects',
    'course': 'Academic Modules (CIT-U)',
    'skill': 'Technical Capabilities',
    'navigation': 'Navigation & Actions'
  };

  items.forEach((item) => {
    const groupName = categoryMap[item.category] || 'Other';
    if (categories[groupName]) {
      categories[groupName].push(item);
    } else {
      categories[groupName] = [item];
    }
  });

  // We need to know the global flat index of each item when rendering grouped items,
  // so keyboard navigation matching `selectedIndex` highlights the correct list node.
  let globalFlatIndex = 0;

  return (
    <div className="list-pane">
      {Object.entries(categories).map(([categoryTitle, categoryItems]) => {
        if (categoryItems.length === 0) return null;

        const isAcademics = categoryTitle === 'Academic Modules (CIT-U)';

        // For academics: overview item is always shown; rest are in the collapsible group
        const overviewItem = isAcademics ? categoryItems.find(i => i.id === 'course-overview') : null;
        const restItems = isAcademics ? categoryItems.filter(i => i.id !== 'course-overview') : [];
        const visibleItems = isAcademics
          ? (overviewItem ? [overviewItem, ...(academicsExpanded ? restItems : [])] : categoryItems)
          : categoryItems;

        return (
          <div key={categoryTitle} className="list-category">
            <h3 className="category-title">{categoryTitle}</h3>
            {visibleItems.map((item) => {
              const currentFlatIndex = globalFlatIndex;
              globalFlatIndex++;

              const isSelected = currentFlatIndex === selectedIndex;

              return (
                <div
                  key={item.id}
                  className={`list-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onItemClick(item)}
                  onMouseEnter={() => onHoverItem(currentFlatIndex)}
                >
                  <div 
                    className="item-icon-container" 
                    style={item.category === 'welcome' ? { borderRadius: '50%', overflow: 'hidden', padding: 0 } : {}}
                  >
                    {item.category === 'welcome' && item.rawItem.avatarUrl ? (
                      <img 
                        src={item.rawItem.avatarUrl} 
                        alt="Profile Avatar" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                          const fallback = document.getElementById(`fallback-${item.id}`);
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      id={item.category === 'welcome' ? `fallback-${item.id}` : undefined}
                      style={item.category === 'welcome' ? { display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' } : { display: 'contents' }}
                    >
                      <IconRenderer name={item.iconName} size={15} />
                    </div>
                  </div>
                  <div className="item-details">
                    <span className="item-label">{item.name}</span>
                    <span className="item-subtitle">{item.subtitle}</span>
                  </div>
                  <div className="item-meta">
                    <span className="meta-badge">{item.badge}</span>
                    {isSelected && (
                      <span className="meta-shortcut">
                        <kbd>↵</kbd>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Collapsible toggle for academics */}
            {isAcademics && restItems.length > 0 && (
              <button
                className="academics-toggle-btn"
                onClick={() => setAcademicsExpanded(prev => !prev)}
              >
                {academicsExpanded ? (
                  <>
                    <ChevronUp size={11} />
                    <span>Collapse courses</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={11} />
                    <span>Show all {restItems.length} courses</span>
                  </>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export type { ListItem };

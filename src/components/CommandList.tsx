import React from 'react';
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
  expandedSections: Record<string, boolean>;
  onToggleSection: (category: string) => void;
  sectionCounts: Record<string, number>;
  isSearching: boolean;
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
  onHoverItem,
  expandedSections,
  onToggleSection,
  sectionCounts,
  isSearching
}) => {
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

  return (
    <div className="list-pane">
      {Object.entries(categories).map(([categoryTitle, categoryItems]) => {
        // Find the category key (e.g. 'welcome', 'project', etc.)
        const categoryKey = Object.keys(categoryMap).find(key => categoryMap[key] === categoryTitle);
        if (!categoryKey) return null;

        const isCollapsible = categoryKey !== 'welcome';
        const isExpanded = isCollapsible ? expandedSections[categoryKey] : true;
        const totalCount = sectionCounts[categoryKey] || 0;

        // If there are no items in this category AND (we are searching OR there are no items in the category overall), do not render the category.
        if (categoryItems.length === 0 && (isSearching || totalCount === 0)) {
          return null;
        }

        return (
          <div key={categoryTitle} className="list-category">
            <h3 
              className={`category-title ${isSearching || !isCollapsible ? 'static-header' : ''}`}
              onClick={isSearching || !isCollapsible ? undefined : () => onToggleSection(categoryKey)}
            >
              <span className="category-title-left">
                {!isSearching && isCollapsible && (
                  isExpanded ? <ChevronUp size={11} className="category-chevron" /> : <ChevronDown size={11} className="category-chevron" />
                )}
                <span>{categoryTitle}</span>
              </span>
              {totalCount > 0 && isCollapsible && (
                <span className="category-title-count">
                  {totalCount}
                </span>
              )}
            </h3>
            {categoryItems.map((item) => {
              const itemIdx = items.indexOf(item);
              const isSelected = itemIdx === selectedIndex;

              return (
                <div
                  key={item.id}
                  className={`list-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onItemClick(item)}
                  onMouseEnter={() => onHoverItem(itemIdx)}
                >
                  <div 
                    className="item-icon-container" 
                    style={item.id === 'welcome-card' ? { borderRadius: '50%', overflow: 'hidden', padding: 0 } : {}}
                  >
                    {item.id === 'welcome-card' && item.rawItem.avatarUrl ? (
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
                      id={item.id === 'welcome-card' ? `fallback-${item.id}` : undefined}
                      style={item.id === 'welcome-card' ? { display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' } : { display: 'contents' }}
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
          </div>
        );
      })}
    </div>
  );
};

export type { ListItem };

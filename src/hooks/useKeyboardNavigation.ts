import { useEffect } from 'react';
import type { ListItem } from '../components/CommandList';

interface KeyboardNavigationProps {
  filteredItems: ListItem[];
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  showActionModal: boolean;
  setShowActionModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMobileDrawer: boolean;
  setShowMobileDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedItem: ListItem | null;
  executeItemAction: (item: ListItem) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export function useKeyboardNavigation({
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
}: KeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Quick search focus with Ctrl+K or /
      const activeTag = document.activeElement?.tagName;
      const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (!isTyping && e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Toggle Action menu on Tab
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowActionModal((prev) => !prev);
        return;
      }

      // Hierarchical Close on Escape
      if (e.key === 'Escape') {
        if (showActionModal) {
          setShowActionModal(false);
        } else if (showMobileDrawer) {
          setShowMobileDrawer(false);
        } else if (search) {
          setSearch('');
        } else {
          searchInputRef.current?.blur();
        }
        return;
      }

      // Auto focus search input when typing printable character
      if (
        !isTyping &&
        document.activeElement !== searchInputRef.current &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
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
        } else if (selectedItem) {
          executeItemAction(selectedItem);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    filteredItems,
    showActionModal,
    setShowActionModal,
    showMobileDrawer,
    setShowMobileDrawer,
    search,
    setSearch,
    selectedItem,
    executeItemAction,
    searchInputRef,
    setSelectedIndex,
  ]);
}

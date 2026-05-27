import { useState, useEffect } from 'react';

export interface NotionData {
  properties: any;
  blocks: any[];
  icon?: any;
  cover?: any;
}

export function useNotionNotes(courseCode: string) {
  const [notionData, setNotionData] = useState<NotionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  useEffect(() => {
    if (!courseCode) {
      setNotionData(null);
      setLoading(false);
      setIsOfflineFallback(false);
      return;
    }

    let active = true;
    const cacheKey = `notion_course_notes_${courseCode}`;
    const cacheDuration = 10 * 60 * 1000; // 10 minutes cache

    const fetchNotes = async () => {
      // 1. Check local cache
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < cacheDuration) {
            if (active) {
              setNotionData(data);
              setLoading(false);
              setError(null);
              setIsOfflineFallback(false);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to parse cached Notion notes', err);
      }

      if (active) {
        setLoading(true);
      }

      // 2. Fetch from proxy API
      try {
        const url = `/api/notes?courseCode=${encodeURIComponent(courseCode)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        
        if (!active) return;

        // Save to cache
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: {
              properties: data.properties || {},
              blocks: data.blocks || [],
              icon: data.icon,
              cover: data.cover
            }
          }));
        } catch (err) {
          console.warn('Failed to write Notion notes to cache', err);
        }

        setNotionData(data);
        setError(null);
        setIsOfflineFallback(false);
      } catch (err: any) {
        console.error('Failed fetching live Notion notes:', err);
        
        if (!active) return;

        setError(err.message || 'Failed to fetch Notion notes.');
        setIsOfflineFallback(true);
        
        // Dispatch custom toast notification to alert the user
        window.dispatchEvent(new CustomEvent('trigger-toast', {
          detail: { message: 'Offline Mode: Loaded local study templates.' }
        }));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchNotes();

    return () => {
      active = false;
    };
  }, [courseCode]);

  return { notionData, data: notionData, loading, error, isOfflineFallback };
}

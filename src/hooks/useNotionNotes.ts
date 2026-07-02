import { useState, useEffect } from 'react';

export interface NotionData {
  properties: any;
  blocks: any[];
  icon?: any;
  cover?: any;
}

export function useNotionNotes(courseCode: string) {
  const [notionData, setNotionData] = useState<NotionData | null>(() => {
    if (!courseCode) return null;
    try {
      const cacheKey = `notion_course_notes_${courseCode}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          return data;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    if (!courseCode) return false;
    try {
      const cacheKey = `notion_course_notes_${courseCode}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          return false;
        }
      }
    } catch {
      // ignore
    }
    return true;
  });

  const [error, setError] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  const [prevCourseCode, setPrevCourseCode] = useState(courseCode);
  if (courseCode !== prevCourseCode) {
    setPrevCourseCode(courseCode);
    if (!courseCode) {
      setNotionData(null);
      setLoading(false);
      setIsOfflineFallback(false);
    } else {
      let cachedData: NotionData | null = null;
      let hasValidCache = false;
      try {
        const cacheKey = `notion_course_notes_${courseCode}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            cachedData = data;
            hasValidCache = true;
          }
        }
      } catch {
        // ignore
      }
      setNotionData(cachedData);
      setLoading(!hasValidCache);
      setIsOfflineFallback(false);
    }
  }

  useEffect(() => {
    if (!courseCode) return;

    let active = true;
    const cacheKey = `notion_course_notes_${courseCode}`;
    const cacheDuration = 10 * 60 * 1000; // 10 minutes cache

    // Check if we already have valid cache (so we can bypass fetch if it is fully valid)
    let hasValidCache = false;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheDuration) {
          hasValidCache = true;
        }
      }
    } catch {
      // ignore
    }
    if (hasValidCache) {
      if (active) {
        setLoading(false);
        setError(null);
      }
      return;
    }

    const fetchNotes = async () => {

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

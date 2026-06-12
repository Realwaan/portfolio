import { useState, useEffect } from 'react';
import { fallbackProfileData } from '../data/fallbackData';
import type { Project } from '../data/fallbackData';

const CACHE_KEY = 'raycast_portfolio_repos_v4';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  'Tihik': "A clean budget tracking and expense visualizer application built with TypeScript, React, and modern UI transitions. 'Tihik' means thrifty or frugal in Cebuano.",
  'islaweave': "A responsive web experience showcasing traditional Filipino weaving patterns, local art forms, and cultural heritage storytelling.",
  'kessh': "Personal configuration scripts, custom stylesheet overrides, shell themes, and command-line workspace optimization tools.",
  'PhotoboothV2': "An interactive, web-based camera photo booth system with custom filter overlays, countdown timer, and local image exports.",
  'website-associate-bot': "A helper Python script/bot designed to automate administrative tasks, handle events, and fetch notifications for site management.",
  'dreikesh': "A custom personal dashboard and developer utility center serving as a hub for links, quick tools, and system diagnostics.",
  'swotlib-domains-ng-edu-cit.txt': "Identify email addresses or domain names that belong to colleges or universities to help automate the process of approving or rejecting academic discounts.",
  'WebDevTOC': "A structured table of contents and curriculum reference guide for web design and platform-based development modules.",
  'Photobooth': "Legacy web-based digital camera dashboard with filters and countdown snapshot captures.",
  'HISLab': "Hospital Information System laboratory application modeling clinical databases and patient records."
};

const getProjectDescription = (name: string, apiDesc: string | null) => {
  if (apiDesc && apiDesc.trim() !== '' && apiDesc !== 'No description provided.') {
    return apiDesc;
  }
  if (PROJECT_DESCRIPTIONS[name]) {
    return PROJECT_DESCRIPTIONS[name];
  }
  return 'No description provided.';
};

export function useGithubRepos(username: string) {
  const [repos, setRepos] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  useEffect(() => {
    if (!username) {
      setRepos(fallbackProfileData.projects);
      setLoading(false);
      setIsOfflineFallback(false);
      return;
    }

    const fetchRepos = async () => {
      try {
        // Check localStorage cache first
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            const isExpired = Date.now() - timestamp > CACHE_DURATION;
            if (!isExpired && data && data.length > 0) {
              setRepos(data);
              setLoading(false);
              setError(null);
              setIsOfflineFallback(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Failed to parse cached GitHub repositories', err);
        }

        // Fetch from API
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
        
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('API_RATE_LIMIT');
          }
          throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Map and filter out forks, keep only original repos
        const userRepos: Project[] = data
          .filter((repo: any) => !repo.fork)
          .map((repo: any) => ({
            id: String(repo.id),
            name: repo.name,
            description: getProjectDescription(repo.name, repo.description),
            html_url: repo.html_url,
            homepage: repo.homepage || `https://realwaan.github.io/${repo.name}`,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language || 'Plain Text',
            topics: repo.topics || [],
            updated_at: repo.updated_at,
          }));

        // If no repos fetched, use fallback
        if (userRepos.length === 0) {
          setRepos(fallbackProfileData.projects);
          setIsOfflineFallback(false);
        } else {
          setRepos(userRepos);
          setIsOfflineFallback(false);
          // Update cache
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              timestamp: Date.now(),
              data: userRepos
            }));
          } catch (err) {
            console.warn('Failed to write GitHub repositories to cache', err);
          }
        }
        setError(null);
      } catch (err: any) {
        console.warn('GitHub fetch failed, using fallback data. Error details:', err.message);
        setRepos(fallbackProfileData.projects);
        setIsOfflineFallback(true);
        if (err.message === 'API_RATE_LIMIT') {
          setError('Rate limit exceeded. Using fallback projects.');
        } else {
          setError(err.message || 'Failed to fetch repositories.');
        }

        // Dispatch custom toast notification to alert the user
        window.dispatchEvent(new CustomEvent('trigger-toast', {
          detail: {
            message: err.message === 'API_RATE_LIMIT'
              ? 'Rate limit exceeded: Loaded local projects.'
              : 'Offline Mode: Loaded local projects.'
          }
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  // Removed custom-description-updated event listener since editing is deprecated

  return { repos, data: repos, loading, error, isOfflineFallback };
}

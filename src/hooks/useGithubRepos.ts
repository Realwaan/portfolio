import { useState, useEffect } from 'react';
import { fallbackProfileData } from '../data/fallbackData';
import type { Project } from '../data/fallbackData';

const CACHE_KEY = 'raycast_portfolio_repos_v3';
const CACHE_TIME_KEY = 'raycast_portfolio_repos_time_v3';
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

  useEffect(() => {
    if (!username) {
      setRepos(fallbackProfileData.projects);
      setLoading(false);
      return;
    }

    const fetchRepos = async () => {
      try {
        // Check localStorage cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

        if (cachedData && cachedTime) {
          const isExpired = Date.now() - parseInt(cachedTime, 10) > CACHE_DURATION;
          if (!isExpired) {
            const parsedRepos = JSON.parse(cachedData) as Project[];
            if (parsedRepos.length > 0) {
              setRepos(parsedRepos);
              setLoading(false);
              return;
            }
          }
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
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language || 'Plain Text',
            topics: repo.topics || [],
            updated_at: repo.updated_at,
          }));

        // If no repos fetched, use fallback
        if (userRepos.length === 0) {
          setRepos(fallbackProfileData.projects);
        } else {
          setRepos(userRepos);
          // Update cache
          localStorage.setItem(CACHE_KEY, JSON.stringify(userRepos));
          localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
        }
        setError(null);
      } catch (err: any) {
        console.warn('GitHub fetch failed, using fallback data. Error details:', err.message);
        setRepos(fallbackProfileData.projects);
        if (err.message === 'API_RATE_LIMIT') {
          setError('Rate limit exceeded. Using fallback projects.');
        } else {
          setError(err.message || 'Failed to fetch repositories.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  // Removed custom-description-updated event listener since editing is deprecated

  return { repos, loading, error };
}

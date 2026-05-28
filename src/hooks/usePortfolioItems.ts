import { useMemo } from 'react';
import { fallbackProfileData } from '../data/fallbackData';
import type { ListItem } from '../components/CommandList';

export function usePortfolioItems(repos: any[]) {
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

    // 3. Academic & Project Timeline
    fallbackProfileData.timeline.forEach((event) => {
      items.push({
        id: `timeline-${event.id}`,
        name: event.title,
        subtitle: `${event.date} · ${event.institution}`,
        category: 'timeline',
        badge: event.status,
        iconName: event.iconName,
        rawItem: event,
      });
    });

    // 4. Academic Courses
    items.push({
      id: 'course-overview',
      name: 'BSCS Curriculum Roadmap',
      subtitle: 'Overview, Mind Map & Summation',
      category: 'welcome',
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

    // 5. Skills
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

    // 6. Navigation & Contacts
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

  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {
      welcome: 0,
      project: 0,
      timeline: 0,
      course: 0,
      skill: 0,
      navigation: 0,
    };
    flatItemsList.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });
    return counts;
  }, [flatItemsList]);

  return { flatItemsList, sectionCounts };
}

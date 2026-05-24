import { bscsCurriculum } from './curriculumData';

export interface Project {
  id: string;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  isFallback?: boolean;
}

export interface Skill {
  name: string;
  category: 'languages' | 'tools' | 'concepts';
  level: string;
  iconName: string;
  notes: string[];
  docUrl?: string;
  docLabel?: string;
}

export interface AcademicCourse {
  code: string;
  name: string;
  description: string;
  semester: string;
}

export interface ProfileData {
  name: string;
  title: string;
  institution: string;
  acronym: string;
  year: string;
  mascot: string;
  motto: string;
  about: string;
  email: string;
  githubUsername: string;
  linkedin: string;
  avatarUrl: string;
  projects: Project[];
  skills: Skill[];
  courses: AcademicCourse[];
}

export const fallbackProfileData: ProfileData = {
  name: "Marc Andrei Regulacion",
  title: "First-Year Computer Science Student",
  institution: "Cebu Institute of Technology - University",
  acronym: "CIT-U",
  year: "BSCS 1",
  mascot: "Wildcats",
  motto: "Virtus in Scientia (Virtue in Science)",
  about: "First-year BS Computer Science student at Cebu Institute of Technology - University. Passionate about web development, custom stylesheet configuration, automation bots, and building clean developer interfaces.",
  email: "realwaan.contact@gmail.com",
  githubUsername: "Realwaan",
  linkedin: "https://linkedin.com/in/realwaan",
  avatarUrl: import.meta.env.BASE_URL + "profile.jpg",
  projects: [
    {
      id: "fb-1",
      name: "Tihik",
      description: "A clean budget tracking and expense visualizer application built with TypeScript, React, and modern UI transitions. 'Tihik' means thrifty or frugal in Cebuano.",
      html_url: "https://github.com/Realwaan/Tihik",
      stargazers_count: 2,
      forks_count: 0,
      language: "TypeScript",
      topics: ["finance", "budget", "typescript", "react", "vercel"],
      updated_at: "2026-05-09T04:55:03Z",
      isFallback: true
    },
    {
      id: "fb-2",
      name: "islaweave",
      description: "A responsive web experience showcasing traditional weaving patterns, local art forms, and cultural heritage storytelling.",
      html_url: "https://github.com/Realwaan/islaweave",
      stargazers_count: 1,
      forks_count: 0,
      language: "HTML",
      topics: ["culture", "heritage", "html5", "css3"],
      updated_at: "2026-04-01T15:44:36Z",
      isFallback: true
    },
    {
      id: "fb-3",
      name: "kessh",
      description: "Personal configuration scripts, custom stylesheet overrides, shell themes, and command-line workspace optimization tools.",
      html_url: "https://github.com/Realwaan/kessh",
      stargazers_count: 2,
      forks_count: 0,
      language: "CSS",
      topics: ["dotfiles", "configuration", "shell", "css"],
      updated_at: "2026-02-07T14:52:53Z",
      isFallback: true
    },
    {
      id: "fb-4",
      name: "PhotoboothV2",
      description: "An interactive, web-based camera photo booth system with custom filter overlays, countdown timer, and local image exports.",
      html_url: "https://github.com/Realwaan/PhotoboothV2",
      stargazers_count: 2,
      forks_count: 0,
      language: "HTML",
      topics: ["camera", "canvas", "photobooth", "javascript"],
      updated_at: "2025-10-29T16:45:01Z",
      isFallback: true
    },
    {
      id: "fb-5",
      name: "website-associate-bot",
      description: "A helper Python script/bot designed to automate administrative tasks, handle events, and fetch notifications for site management.",
      html_url: "https://github.com/Realwaan/website-associate-bot",
      stargazers_count: 0,
      forks_count: 0,
      language: "Python",
      topics: ["bot", "automation", "python", "script"],
      updated_at: "2026-05-14T15:58:21Z",
      isFallback: true
    },
    {
      id: "fb-6",
      name: "dreikesh",
      description: "A custom personal dashboard and developer utility center serving as a hub for links, quick tools, and system diagnostics.",
      html_url: "https://github.com/Realwaan/dreikesh",
      stargazers_count: 0,
      forks_count: 0,
      language: "JavaScript",
      topics: ["dashboard", "homepage", "utility", "javascript"],
      updated_at: "2025-07-22T14:10:19Z",
      isFallback: true
    },
    {
      id: "fb-7",
      name: "swotlib-domains-ng-edu-cit.txt",
      description: "Identify email addresses or domain names that belong to colleges or universities to help automate the process of approving or rejecting academic discounts.",
      html_url: "https://github.com/Realwaan/swotlib-domains-ng-edu-cit.txt",
      stargazers_count: 0,
      forks_count: 0,
      language: "Kotlin",
      topics: ["academic", "email-validation", "kotlin", "discount-verifier"],
      updated_at: "2025-09-06T13:02:56Z",
      isFallback: true
    }
  ],
  skills: [
    {
      name: "C++ / Systems Programming",
      category: "languages",
      level: "Intermediate",
      iconName: "Cpu",
      notes: [
        "Pointers, references, and manual memory management via new/delete",
        "STL containers (vector, map, set) and iterator patterns",
        "Compiled with g++ on MinGW; familiar with compiler flags (-Wall, -O2)",
        "Object-oriented class hierarchies, inheritance, and polymorphism"
      ],
      docUrl: "https://en.cppreference.com/w/",
      docLabel: "cppreference.com"
    },
    {
      name: "TypeScript / JavaScript",
      category: "languages",
      level: "Intermediate",
      iconName: "Code",
      notes: [
        "Type annotations, interfaces, generics, and union/intersection types",
        "ES6+ features: arrow functions, destructuring, async/await, modules",
        "DOM manipulation and event-driven UI logic",
        "npm ecosystem, package.json scripts, and module bundling"
      ],
      docUrl: "https://www.typescriptlang.org/docs/",
      docLabel: "TypeScript Docs"
    },
    {
      name: "Python / Scripting",
      category: "languages",
      level: "Intermediate",
      iconName: "FileCode",
      notes: [
        "Automation scripts for file I/O, web scraping, and API calls",
        "List comprehensions, generators, and context managers",
        "Familiar with pip, virtualenv, and requirements.txt workflows",
        "Used for building Discord/Telegram bot integrations"
      ],
      docUrl: "https://docs.python.org/3/",
      docLabel: "Python 3 Docs"
    },
    {
      name: "HTML5 / Vanilla CSS3",
      category: "languages",
      level: "Advanced",
      iconName: "Layout",
      notes: [
        "Semantic HTML structure: header, main, section, article, nav",
        "CSS custom properties, flexbox, grid, and responsive breakpoints",
        "Keyframe animations, transitions, and pseudo-element techniques",
        "Accessibility attributes: aria-labels, roles, focus management"
      ],
      docUrl: "https://developer.mozilla.org/en-US/docs/Web",
      docLabel: "MDN Web Docs"
    },
    {
      name: "Git & Version Control",
      category: "tools",
      level: "Advanced",
      iconName: "GitBranch",
      notes: [
        "Branching strategies: feature branches, merge vs rebase workflows",
        "Interactive rebase, cherry-pick, stash, and conflict resolution",
        "GitHub pull requests, issue tracking, and Actions CI basics",
        ".gitignore patterns and repository housekeeping"
      ],
      docUrl: "https://git-scm.com/doc",
      docLabel: "Git Reference"
    },
    {
      name: "React & Vite",
      category: "tools",
      level: "Intermediate",
      iconName: "Atom",
      notes: [
        "Functional components, hooks (useState, useEffect, useMemo, useRef)",
        "Component composition, props drilling, and lifting state up",
        "Vite dev server with HMR; configuring vite.config.ts plugins",
        "JSX/TSX patterns and conditional rendering techniques"
      ],
      docUrl: "https://react.dev/learn",
      docLabel: "React Learn"
    },
    {
      name: "Windows Powershell / Bash",
      category: "tools",
      level: "Intermediate",
      iconName: "Terminal",
      notes: [
        "PowerShell cmdlets: Get-ChildItem, Select-String, piping objects",
        "Bash scripting: loops, conditionals, sed/awk for text processing",
        "Environment variables, PATH configuration, and profile scripts",
        "Task automation: scheduled scripts, file watchers, batch renaming"
      ],
      docUrl: "https://learn.microsoft.com/en-us/powershell/",
      docLabel: "PowerShell Docs"
    },
    {
      name: "Object-Oriented Programming (OOP)",
      category: "concepts",
      level: "Intermediate",
      iconName: "Layers",
      notes: [
        "Four pillars: encapsulation, abstraction, inheritance, polymorphism",
        "SOLID principles overview — single responsibility and open/closed",
        "Design patterns encountered: Factory, Observer, Strategy (intro level)",
        "Applied in C++ class labs and Java-based coursework exercises"
      ],
      docUrl: "https://refactoring.guru/design-patterns",
      docLabel: "Refactoring Guru"
    },
    {
      name: "Discrete Math & Logic Gates",
      category: "concepts",
      level: "Intermediate",
      iconName: "CheckSquare",
      notes: [
        "Propositional and predicate logic; truth tables and logical equivalences",
        "Set theory, relations, functions, and proof techniques (direct, contradiction)",
        "Boolean algebra and combinational logic: AND, OR, NOT, XOR gates",
        "Karnaugh maps for simplifying boolean expressions"
      ],
      docUrl: "https://discrete.openmathbooks.org/dmoi3.html",
      docLabel: "Discrete Math Textbook"
    },
    {
      name: "Algorithms & Graph Navigation",
      category: "concepts",
      level: "Beginner",
      iconName: "Compass",
      notes: [
        "Sorting fundamentals: bubble, selection, insertion, merge sort",
        "Big-O notation for time/space complexity analysis",
        "Graph representations: adjacency list vs adjacency matrix",
        "BFS and DFS traversal concepts (introductory coursework)"
      ],
      docUrl: "https://visualgo.net/en",
      docLabel: "VisuAlgo"
    }
  ],
  courses: bscsCurriculum.map(c => ({
    code: c.code,
    name: c.name,
    description: c.description,
    semester: `${c.year === 1 ? '1st' : c.year === 2 ? '2nd' : c.year === 3 ? '3rd' : '4th'} Year, ${c.semester === 1 ? '1st Semester' : c.semester === 2 ? '2nd Semester' : c.semester === 3 ? 'Summer' : 'Term'}`
  }))
};

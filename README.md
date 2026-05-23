# 🖥️ CIT-U Portfolio Explorer

> A Raycast-style command palette portfolio — built with React + TypeScript + Vite

**Live at:** [github.com/Realwaan/portfolio](https://github.com/Realwaan/portfolio)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Command Palette UI** | Raycast-inspired keyboard-navigable search interface |
| 📚 **BSCS Curriculum Roadmap** | Interactive CIT-U 2023-2024 curriculum with Mind Map & Summation tabs |
| 💻 **Project Showcases** | Live GitHub repos with glassmorphic interactive widgets per project |
| 🎵 **Spotify Mini-Player** | Floating player with favorite NIKI tracks (Premium-ready embed) |
| 🎨 **3 Accent Themes** | Raycast Crimson Red · CIT-U Gold · CIT-U Maroon |
| 📱 **Fully Responsive** | Mobile-first, works on all iOS/Android screen sizes |

---

## 🏫 About

**Marc Andrei Regulacion**  
First-Year BS Computer Science Student  
Cebu Institute of Technology – University (CIT-U)  
College of Computer Studies · Curriculum Year 2023-2024

---

## 🛠️ Tech Stack

- **React 18** + **TypeScript** — Component architecture
- **Vite 8** — Lightning-fast bundler
- **Vanilla CSS** — Custom design system (glassmorphism, dark mode)
- **Lucide React** — Icon system
- **GitHub REST API** — Live repository fetching
- **Spotify Embed API** — Full Premium playback

---

## 🚀 Getting Started

```bash
git clone https://github.com/Realwaan/portfolio.git
cd portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `↑` / `↓` | Navigate items |
| `↵` | Open / Select |
| `Tab` | Open theme switcher |
| `Esc` | Close modals / clear search |
| Any key | Focus search bar |

---

## 📦 Project Structure

```
src/
├── components/
│   ├── CommandList.tsx      # Left sidebar with collapsible categories
│   ├── DetailPanel.tsx      # Right detail pane with interactive widgets
│   ├── CurriculumRoadmap.tsx# BSCS Mind Map + Timeline + Summation
│   ├── SpotifyPlayer.tsx    # Floating Spotify mini-player
│   ├── ActionPanel.tsx      # Footer keyboard guide
│   └── Toast.tsx            # Micro-toast notification system
├── data/
│   ├── curriculumData.ts    # Full CIT-U BSCS 2023-2024 curriculum
│   └── fallbackData.ts      # Profile + static project data
└── hooks/
    └── useGithubRepos.ts    # GitHub API fetcher with localStorage cache
```

---

<p align="center">
  Built with 💙 at <strong>CIT-U</strong> · Go Wildcats! 🐱
</p>

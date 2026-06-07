import React, { useState, useEffect, useRef } from 'react';
import './TerminalConsole.css';

interface TerminalConsoleProps {
  onClose: () => void;
  accent: 'raycast-red' | 'cit-gold' | 'cit-maroon';
  onThemeChange: (theme: 'raycast-red' | 'cit-gold' | 'cit-maroon') => void;
  projects: any[];
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  onClose,
  accent,
  onThemeChange,
  projects,
}) => {
  const [history, setHistory] = useState<string[]>([
    'Welcome to PortOS Command Line Interface (CLI) v1.0',
    'Type "help" to view available commands. Type "exit" to return to search mode.',
    ''
  ]);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startupTime = useRef(Date.now());

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on history change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, 'visitor@realwaan:~$ ']);
      return;
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newHistory = [...history, `visitor@realwaan:~$ ${trimmed}`];

    switch (command) {
      case 'help':
        newHistory.push(
          'Available commands:',
          '  help      - Display this list of commands',
          '  neofetch  - Render system profile and university info',
          '  projects  - List active software development repositories',
          '  cat about - View author biography',
          '  theme     - Switch accent themes. Usage: theme <gold|maroon|red>',
          '  clear     - Clear terminal buffer',
          '  exit      - Close terminal mode'
        );
        break;
      case 'neofetch':
        const uptimeSec = Math.floor((Date.now() - startupTime.current) / 1000);
        const uptimeMin = Math.floor(uptimeSec / 60);
        const uptimeStr = uptimeMin > 0 ? `${uptimeMin}m ${uptimeSec % 60}s` : `${uptimeSec}s`;
        
        newHistory.push(
          '   ____ ___ _____     _   _ ',
          '  / ___|_ _|_   _|   | | | |',
          ' | |    | |  | |     | | | |',
          ' | |___ | |  | |  _  | |_| |',
          '  \\____|___| |_| (_)  \\___/ ',
          '      C E B U   T E C H',
          '---------------------------------------',
          'user: visitor@realwaan',
          'host: realwaan.github.io',
          `uptime: ${uptimeStr}`,
          'shell: csh (Command Student Shell)',
          'terminal: vty-retro-crt',
          `theme: ${accent.replace('-', ' ')}`,
          'author: Marc Andrei Regulacion',
          'program: BS Computer Science (BSCS 1)',
          'school: Cebu Institute of Technology - University',
          'mascot: Wildcats 🐾',
          'motto: Virtus in Scientia (Virtue in Science)'
        );
        break;
      case 'projects':
        newHistory.push('Fetching Git repositories table...');
        if (projects.length === 0) {
          newHistory.push('No projects found in the repository cache.');
        } else {
          newHistory.push(
            '  NAME            | LANGUAGE   | STARS | FORKS',
            '  ----------------+------------+-------+------'
          );
          projects.forEach((p) => {
            const padName = p.name.slice(0, 15).padEnd(15, ' ');
            const padLang = (p.language || 'HTML').slice(0, 10).padEnd(10, ' ');
            const stars = String(p.stargazers_count).padEnd(5, ' ');
            const forks = String(p.forks_count).padEnd(5, ' ');
            newHistory.push(`  ${padName} | ${padLang} | ${stars} | ${forks}`);
          });
        }
        break;
      case 'cat':
        if (args.length > 0 && args[0].toLowerCase() === 'about') {
          newHistory.push(
            'Marc Andrei Regulacion - Biography:',
            'First-year BS Computer Science student at Cebu Institute of Technology - University.',
            'Passionate about front-end interfaces, custom stylesheet configurations, command consoles,',
            'GIS topographic map indices, and building clean terminal-styled web environments.'
          );
        } else {
          newHistory.push('Usage: cat about');
        }
        break;
      case 'theme':
        if (args.length > 0) {
          const targetTheme = args[0].toLowerCase();
          if (targetTheme === 'gold' || targetTheme === 'cit-gold') {
            onThemeChange('cit-gold');
            newHistory.push('Theme updated to CIT-U Gold (Wildcats).');
          } else if (targetTheme === 'maroon' || targetTheme === 'cit-maroon') {
            onThemeChange('cit-maroon');
            newHistory.push('Theme updated to CIT-U Maroon.');
          } else if (targetTheme === 'red' || targetTheme === 'raycast-red') {
            onThemeChange('raycast-red');
            newHistory.push('Theme updated to Raycast Red.');
          } else {
            newHistory.push('Invalid theme. Available: gold, maroon, red');
          }
        } else {
          newHistory.push('Usage: theme <gold|maroon|red>');
        }
        break;
      case 'clear':
        setHistory([]);
        setInputValue('');
        return;
      case 'exit':
        onClose();
        return;
      default:
        newHistory.push(`csh: command not found: ${command}. Type "help" to view available commands.`);
    }

    newHistory.push(''); // spacing line
    setHistory(newHistory);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
    }
  };

  return (
    <div 
      className="terminal-console-container" 
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-crt-overlay"></div>
      <div className="terminal-history font-mono">
        {history.map((line, idx) => (
          <div key={idx} className="terminal-line">
            {line}
          </div>
        ))}
        <div className="terminal-input-row">
          <span className="terminal-prompt">visitor@realwaan:~$ </span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Code2 } from 'lucide-react';
import './CodeSandboxWidget.css';

interface CodeSandboxWidgetProps {
  initialCode?: string;
  title?: string;
}

export const CodeSandboxWidget: React.FC<CodeSandboxWidgetProps> = ({
  initialCode = `// Interactive JS Snippet Sandbox
const calculateGpa = (grades) => {
  const total = grades.reduce((acc, g) => acc + g, 0);
  return (total / grades.length).toFixed(2);
};

const myGrades = [1.0, 1.25, 1.1, 1.0, 1.25];
console.log("CIT-U Term GPA:", calculateGpa(myGrades));
return "Passed with High Honors! 🎓";`,
  title = "Live Code Sandbox"
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const runCode = () => {
    setOutput([]);
    setError(null);
    const logs: string[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      error: (...args: any[]) => {
        logs.push(`❌ [Error] ${args.join(' ')}`);
      },
      warn: (...args: any[]) => {
        logs.push(`⚠️ [Warn] ${args.join(' ')}`);
      }
    };

    try {
      const runFn = new Function('console', `
        "use strict";
        try {
          ${code}
        } catch(e) {
          throw e;
        }
      `);

      const result = runFn(customConsole);
      if (result !== undefined) {
        logs.push(`➡️ Return: ${typeof result === 'object' ? JSON.stringify(result) : String(result)}`);
      }
      setOutput(logs.length > 0 ? logs : ['Code executed successfully with no output.']);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
    setError(null);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-sandbox-panel glass-panel">
      <div className="code-sandbox-header">
        <div className="code-sandbox-title">
          <Code2 size={16} className="text-accent" />
          <span>{title}</span>
        </div>
        <div className="code-sandbox-actions">
          <button className="sandbox-btn secondary" onClick={copyCode} title="Copy Code">
            {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
          </button>
          <button className="sandbox-btn secondary" onClick={resetCode} title="Reset Code">
            <RotateCcw size={13} />
          </button>
          <button className="sandbox-btn primary" onClick={runCode} title="Run Code (Ctrl+Enter)">
            <Play size={13} fill="currentColor" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      <div className="code-sandbox-editor-container">
        <textarea
          className="code-sandbox-textarea font-mono"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              runCode();
            }
          }}
          placeholder="Type JavaScript code here..."
          spellCheck={false}
        />
      </div>

      <div className="code-sandbox-output-panel">
        <div className="output-panel-header font-mono">
          <Terminal size={13} />
          <span>Execution Console</span>
        </div>
        <div className="output-panel-content font-mono">
          {error && <div className="output-line error-line">💥 Error: {error}</div>}
          {!error && output.length === 0 && (
            <div className="output-line placeholder-line">Click "Run Code" or press Ctrl+Enter to evaluate snippet...</div>
          )}
          {!error && output.map((line, idx) => (
            <div key={idx} className="output-line">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

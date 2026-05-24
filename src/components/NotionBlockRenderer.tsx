import React, { useState } from 'react';
import { Check, Copy, ExternalLink, FileText } from 'lucide-react';

interface NotionBlockRendererProps {
  blocks: any[];
  onPrerequisiteClick?: (code: string) => void;
}

// Helper to parse and render rich text arrays from Notion (supports bold, italic, code, links)
const renderRichText = (richTextArray: any[]) => {
  if (!richTextArray || richTextArray.length === 0) return null;

  return richTextArray.map((rt: any, idx: number) => {
    let element: React.ReactNode = rt.plain_text;

    if (rt.annotations.bold) {
      element = <strong key={idx}>{element}</strong>;
    }
    if (rt.annotations.italic) {
      element = <em key={idx}>{element}</em>;
    }
    if (rt.annotations.strikethrough) {
      element = <del key={idx}>{element}</del>;
    }
    if (rt.annotations.underline) {
      element = <u key={idx}>{element}</u>;
    }
    if (rt.annotations.code) {
      element = (
        <code 
          key={idx} 
          className="font-mono" 
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            padding: '2px 5px', 
            borderRadius: '4px',
            fontSize: '11.5px',
            color: 'var(--accent-color)'
          }}
        >
          {element}
        </code>
      );
    }
    if (rt.href) {
      element = (
        <a
          key={idx}
          href={rt.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}
        >
          {element}
        </a>
      );
    }

    return <span key={idx}>{element}</span>;
  });
};

// Sub-component for code block rendering
const NotionCodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: 'Code copied to clipboard!' }
    }));
  };

  return (
    <div style={{ margin: '14px 0' }}>
      <div className="notion-code-header">
        <span>{language || 'plain text'}</span>
        <button className="notion-code-copy-btn" onClick={handleCopy} aria-label="Copy code block">
          {copied ? (
            <>
              <Check size={11} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-preview notion-code-block font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Sub-component for interactive checklist items (persisted in localStorage)
const NotionTodoItem: React.FC<{ block: any }> = ({ block }) => {
  const todoId = block.id;
  const todoObj = block.to_do;
  
  const [checked, setChecked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`notion_todo_${todoId}`);
      return saved !== null ? JSON.parse(saved) : (todoObj.checked || false);
    } catch {
      return todoObj.checked || false;
    }
  });

  const handleToggle = () => {
    const nextState = !checked;
    setChecked(nextState);
    try {
      localStorage.setItem(`notion_todo_${todoId}`, JSON.stringify(nextState));
    } catch (e) {
      console.error('Error saving checkbox state', e);
    }

    const topicText = todoObj.rich_text.map((t: any) => t.plain_text).join('');
    window.dispatchEvent(new CustomEvent('trigger-toast', {
      detail: { message: nextState ? `Completed: "${topicText.slice(0, 30)}..."` : `Marked incomplete: "${topicText.slice(0, 30)}..."` }
    }));
  };

  return (
    <div className="notion-checklist-item" onClick={handleToggle} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', margin: '4px 0' }}>
      <div className={`notion-checkbox ${checked ? 'checked' : ''}`} style={{ marginTop: '2px' }}>
        {checked && <span className="notion-checkbox-check">✓</span>}
      </div>
      <span className={`notion-checklist-text ${checked ? 'checked' : ''}`}>
        {renderRichText(todoObj.rich_text)}
      </span>
    </div>
  );
};

// Pre-process list items to group consecutive blocks together
interface GroupedBlock {
  id: string;
  type: string;
  items?: any[];
  originalBlock?: any;
}

const groupConsecutiveLists = (blocks: any[]): GroupedBlock[] => {
  const grouped: GroupedBlock[] = [];
  let currentGroup: { id: string; type: 'bulleted_list' | 'numbered_list'; items: any[] } | null = null;

  blocks.forEach((block) => {
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const listType = block.type === 'bulleted_list_item' ? 'bulleted_list' : 'numbered_list';

      if (currentGroup && currentGroup.type === listType) {
        currentGroup.items.push(block);
      } else {
        if (currentGroup) {
          grouped.push(currentGroup);
        }
        currentGroup = {
          id: `group-${block.id}`,
          type: listType,
          items: [block]
        };
      }
    } else {
      if (currentGroup) {
        grouped.push(currentGroup);
        currentGroup = null;
      }
      grouped.push({
        id: block.id,
        type: block.type,
        originalBlock: block
      });
    }
  });

  if (currentGroup) {
    grouped.push(currentGroup);
  }

  return grouped;
};

export const NotionBlockRenderer: React.FC<NotionBlockRendererProps> = ({ blocks, onPrerequisiteClick: _onPrerequisiteClick }) => {
  if (!blocks || blocks.length === 0) {
    return <p className="detail-description">No written study notes added to this page yet.</p>;
  }

  const processedBlocks = groupConsecutiveLists(blocks);

  return (
    <div className="notion-blocks-container">
      {processedBlocks.map((grouped) => {
        const { id, type, items, originalBlock } = grouped;

        switch (type) {
          case 'bulleted_list':
            return (
              <ul key={id} style={{ margin: '8px 0 16px 20px', paddingLeft: 0, listStyleType: 'disc' }}>
                {items?.map((item) => (
                  <li key={item.id} style={{ fontSize: '12.5px', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {renderRichText(item.bulleted_list_item.rich_text)}
                  </li>
                ))}
              </ul>
            );

          case 'numbered_list':
            return (
              <ol key={id} style={{ margin: '8px 0 16px 20px', paddingLeft: 0, listStyleType: 'decimal' }}>
                {items?.map((item) => (
                  <li key={item.id} style={{ fontSize: '12.5px', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {renderRichText(item.numbered_list_item.rich_text)}
                  </li>
                ))}
              </ol>
            );

          default: {
            const block = originalBlock;
            if (!block) return null;

            switch (block.type) {
              case 'paragraph': {
                const richText = block.paragraph.rich_text;
                if (richText.length === 0) return <div key={block.id} style={{ height: '12px' }} />;
                return (
                  <p key={block.id} className="detail-description" style={{ fontSize: '12.5px', margin: '8px 0' }}>
                    {renderRichText(richText)}
                  </p>
                );
              }

              case 'heading_1':
                return (
                  <h3 key={block.id} className="detail-section-title" style={{ marginTop: '20px' }}>
                    {renderRichText(block.heading_1.rich_text)}
                  </h3>
                );

              case 'heading_2':
                return (
                  <h4 key={block.id} className="detail-section-title" style={{ fontSize: '11px', marginTop: '16px' }}>
                    {renderRichText(block.heading_2.rich_text)}
                  </h4>
                );

              case 'heading_3':
                return (
                  <h5 key={block.id} style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-main)', margin: '12px 0 6px 0' }}>
                    {renderRichText(block.heading_3.rich_text)}
                  </h5>
                );

              case 'to_do':
                return <NotionTodoItem key={block.id} block={block} />;

              case 'code': {
                const codeText = block.code.rich_text.map((t: any) => t.plain_text).join('');
                return (
                  <NotionCodeBlock
                    key={block.id}
                    code={codeText}
                    language={block.code.language}
                  />
                );
              }

              case 'callout': {
                const calloutObj = block.callout;
                const emojiIcon = calloutObj.icon?.type === 'emoji' ? calloutObj.icon.emoji : '💡';
                return (
                  <div key={block.id} className="notion-callout">
                    <span className="notion-callout-icon">{emojiIcon}</span>
                    <div className="notion-callout-content">
                      {renderRichText(calloutObj.rich_text)}
                    </div>
                  </div>
                );
              }

              case 'equation':
                return (
                  <div key={block.id} className="notion-formula-block">
                    {block.equation.expression}
                  </div>
                );

              case 'file':
              case 'pdf': {
                const fileObj = block[block.type];
                const fileUrl = fileObj.type === 'file' ? fileObj.file.url : fileObj.external.url;
                
                // Extract clean filename from the URL, default to a sensible fallback
                let fileName = block.type === 'pdf' ? 'Syllabus PDF' : 'Attached Asset';
                try {
                  const urlObj = new URL(fileUrl);
                  const pathParts = urlObj.pathname.split('/');
                  const encodedName = pathParts[pathParts.length - 1];
                  fileName = decodeURIComponent(encodedName);
                } catch {
                  // Keep fallback
                }

                return (
                  <a
                    key={block.id}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="skill-doc-link"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      margin: '6px 0', 
                      alignSelf: 'flex-start',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)'
                    }}
                  >
                    {block.type === 'pdf' ? <FileText size={13} style={{ color: '#ef4444' }} /> : <FileText size={13} style={{ color: 'var(--accent-color)' }} />}
                    <span>{fileName}</span>
                    <ExternalLink size={11} style={{ opacity: 0.5 }} />
                  </a>
                );
              }

              default:
                // Skip unhandled block types (e.g. child_page, link_to_page)
                return null;
            }
          }
        }
      })}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Solution } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface SolutionDisplayProps {
  solution: Solution;
}

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(solution.formula);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const renderExplanation = (text: string) => {
    const ctaRegex = /Click the \[Book a Consultation\] button to learn more\./g;
    const parts = text.split(ctaRegex);

    const parseInlineFormatting = (line: string) => {
      const segments = line.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);
      return segments.map((segment, index) => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return <strong key={index}>{segment.slice(2, -2)}</strong>;
        }
        if (segment.startsWith('`') && segment.endsWith('`')) {
          return <code key={index} className="font-mono text-sm bg-slate-100 text-emerald-700 p-1 rounded-md">{segment.slice(1, -1)}</code>;
        }
        return segment;
      });
    };

    const parseChunk = (chunk: string) => {
      const lines = chunk.split('\n');
      const elements: JSX.Element[] = [];
      let listItems: JSX.Element[] = [];
      let inCodeBlock = false;
      let codeBlockContent: string[] = [];

      const flushList = () => {
        if (listItems.length > 0) {
          elements.push(
            <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-4 pl-4 text-slate-600 leading-relaxed">
              {listItems}
            </ul>
          );
          listItems = [];
        }
      };

      const flushCodeBlock = () => {
        if (codeBlockContent.length > 0) {
          elements.push(
            <div key={`code-${elements.length}`} className="my-4 bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-50">
              <pre className="whitespace-pre-wrap break-words overflow-x-auto">
                <code>{codeBlockContent.join('\n')}</code>
              </pre>
            </div>
          );
          codeBlockContent = [];
        }
      };

      lines.forEach((line, i) => {
        if (line.trim().startsWith('```')) {
          if (!inCodeBlock) {
            flushList(); // End any open list before starting code
            inCodeBlock = true;
          } else {
            flushCodeBlock(); // Render the code block
            inCodeBlock = false;
          }
        } else if (inCodeBlock) {
          codeBlockContent.push(line);
        } else {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('#')) {
                const match = trimmedLine.match(/^(#+)\s(.*)/);
                if (match) {
                    flushList();
                    const level = match[1].length;
                    const text = match[2].trim();

                    if (level === 1 && text.toLowerCase() === 'your solution') {
                        return; // Skip rendering this heading, as it's already hardcoded
                    }
                    
                    elements.push(<h2 key={i} className="text-xl font-bold text-slate-700 mt-6 mb-2">{text}</h2>);

                } else {
                    // Line starts with '#' but isn't a valid header, treat as paragraph.
                    if (trimmedLine !== '') {
                        flushList();
                        elements.push(<p key={i} className="text-base text-slate-600 leading-relaxed my-2">{parseInlineFormatting(line)}</p>);
                    }
                }
            } else if (trimmedLine.startsWith('* ')) {
                listItems.push(<li key={i}>{parseInlineFormatting(trimmedLine.substring(2))}</li>);
            } else if (trimmedLine !== '') {
                flushList();
                elements.push(<p key={i} className="text-base text-slate-600 leading-relaxed my-2">{parseInlineFormatting(line)}</p>);
            }
        }
      });

      flushList(); // Flush any remaining list items
      flushCodeBlock(); // Flush any remaining code block
      return elements;
    };


    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {parseChunk(part)}
        {index < parts.length - 1 && (
          <div className="mt-8 text-center">
            <a
              href="https://www.fiverr.com/s/zWRRXpe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 text-base bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all"
            >
              Book a Consultation
            </a>
          </div>
        )}
      </React.Fragment>
    ));
  };


  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Your Solution</h2>
      <div className="mt-4 relative bg-slate-900 rounded-lg p-4 font-mono text-base text-slate-50">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Copy formula"
        >
          {copied ? (
             <span className="text-xs font-sans px-1">Copied!</span>
          ) : (
            <ClipboardIcon className="w-5 h-5" />
          )}
        </button>
        <pre className="whitespace-pre-wrap break-words overflow-x-auto"><code>{solution.formula}</code></pre>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6">
        {renderExplanation(solution.explanation)}
      </div>
    </div>
  );
};

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.append(style);
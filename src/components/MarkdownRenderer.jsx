import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronRight, Brain } from 'lucide-react';

const ThinkBlock = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-neutral-200 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        <Brain className="w-3 h-3" />
        <span>AI Thinking Process</span>
      </button>
      
      {isExpanded && (
        <div className="mt-2 ml-5 p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/50">
          <div className="text-xs text-neutral-400 italic leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

const MarkdownRenderer = ({ content, className = "" }) => {
  // Process content to extract think tags
  const processContent = (text) => {
    if (!text) return text;
    
    // Split content by think tags
    const parts = text.split(/(<think>.*?<\/think>)/gs);
    
    return parts.map((part, index) => {
      if (part.startsWith('<think>') && part.endsWith('</think>')) {
        const thinkContent = part.slice(7, -8); // Remove <think> and </think> tags
        return <ThinkBlock key={`think-${index}`} content={thinkContent} />;
      }
      return part;
    });
  };

  const processedContent = processContent(content);

  return (
    <div className={`text-neutral-200 text-xs leading-relaxed max-w-none ${className}`}>
      {processedContent.map((item, index) => {
        if (React.isValidElement(item)) {
          return item;
        }
        
        if (!item || typeof item !== 'string') {
          return null;
        }
        
        return (
          <ReactMarkdown
            key={`markdown-${index}`}
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-sm font-bold text-neutral-200 mt-2 mb-1" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-sm font-semibold text-neutral-200 mt-2 mb-1" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xs font-medium text-neutral-200 mt-2 mb-1" {...props} />,
              p: ({node, ...props}) => <p className="text-xs text-neutral-300 mb-2" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-outside text-xs text-neutral-300 mb-2 pl-4" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-outside text-xs text-neutral-300 mb-2 pl-4" {...props} />,
              li: ({node, children, ...props}) => {
                // Custom handling for list items to prevent unwanted line breaks
                if (Array.isArray(children) && children.length === 1 && children[0] && children[0].type === 'p') {
                  // Render the paragraph content directly without the paragraph wrapper
                  return (
                    <li className="text-xs text-neutral-300 mb-1 pl-1" {...props}>
                      {children[0].props.children}
                    </li>
                  );
                }
                // For other cases, render normally
                return (
                  <li className="text-xs text-neutral-300 mb-1 pl-1" {...props}>
                    {children}
                  </li>
                );
              },
              code: ({node, ...props}) => <code className="bg-neutral-700/50 px-1 py-0.5 rounded text-xs font-mono text-neutral-200" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-neutral-700/50 p-2 rounded text-xs font-mono text-neutral-200 overflow-x-auto mb-2" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-neutral-600 pl-2 text-xs text-neutral-400 italic" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-neutral-200" {...props} />,
              em: ({node, ...props}) => <em className="italic text-neutral-300" {...props} />,
            }}
          >
            {item}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;

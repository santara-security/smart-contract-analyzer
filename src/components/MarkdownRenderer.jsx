import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content, className = "" }) => {
  return (
    <div className={`text-neutral-200 text-xs leading-relaxed max-w-none ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-sm font-bold text-neutral-200 mt-2 mb-1" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xs font-semibold text-neutral-200 mt-2 mb-1" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xs font-medium text-neutral-200 mt-2 mb-1" {...props} />,
          p: ({node, ...props}) => <p className="text-xs text-neutral-300 mb-2" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside text-xs text-neutral-300 mb-2 pl-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside text-xs text-neutral-300 mb-2 pl-2" {...props} />,
          li: ({node, children, ...props}) => {
            // Custom handling for list items to prevent unwanted line breaks
            // Check if children is an array with a single paragraph element
            if (Array.isArray(children) && children.length === 1 && children[0].type === 'p') {
              // Render the paragraph content directly without the paragraph wrapper
              return (
                <li className="text-xs text-neutral-300 mb-1" {...props}>
                  {children[0].props.children}
                </li>
              );
            }
            // For other cases, render normally
            return (
              <li className="text-xs text-neutral-300 mb-1" {...props}>
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
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { memo } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageContent = memo(({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-black/30 px-1 py-0.5 rounded" {...props}>
              {children}
            </code>
          );
        },

        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-3">{children}</h1>
        ),

        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3">{children}</h2>
        ),

        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mb-2">{children}</h3>
        ),

        ul: ({ children }) => (
          <ul className="list-disc pl-6 space-y-1">{children}</ul>
        ),

        ol: ({ children }) => (
          <ol className="list-decimal pl-6 space-y-1">{children}</ol>
        ),

        p: ({ children }) => <p className="leading-7">{children}</p>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

export default MessageContent;

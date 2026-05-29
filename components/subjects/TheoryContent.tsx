"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

interface TheoryContentProps {
  content: string;
}

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1
      className="text-2xl font-bold text-[#e5e5e5] border-l-4 border-orange-500 pl-4 mb-6 mt-8"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-xl font-semibold text-[#e5e5e5] border-l-4 border-orange-500/70 pl-4 mb-4 mt-6"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-lg font-semibold text-[#e5e5e5] border-l-4 border-orange-500/40 pl-4 mb-3 mt-5"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-[#a1a1aa] leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-[#1a1a1a] text-orange-400 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <div className="relative group my-6">
        <div className="absolute top-0 right-0 px-3 py-1 text-[10px] text-[#a1a1aa] bg-[#1a1a1a] rounded-bl-lg rounded-tr-lg border-l border-b border-[#2a2a2a]">
          {className?.replace("language-", "") || "code"}
        </div>
        <pre className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 pt-8 overflow-x-auto">
          <code className={cn("text-sm font-mono", className)} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 border border-[#2a2a2a] rounded-xl">
      <table className="w-full text-sm text-[#a1a1aa]">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#1a1a1a] border-b border-[#2a2a2a]">{children}</thead>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-3 text-left font-semibold text-[#e5e5e5]" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-3 border-t border-[#2a2a2a]" {...props}>
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-orange-500/50 bg-orange-500/5 pl-4 py-3 pr-4 my-4 rounded-r-lg text-[#d4d4d8] italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside text-[#a1a1aa] space-y-1 mb-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside text-[#a1a1aa] space-y-1 mb-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-[#a1a1aa]" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-orange-500 hover:text-orange-400 underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-[#2a2a2a] my-8" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-[#e5e5e5]">{children}</strong>
  ),
};

export function TheoryContent({ content }: TheoryContentProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

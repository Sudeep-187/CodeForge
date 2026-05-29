"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ language, value, onChange, readOnly = false, height = "500px" }: CodeEditorProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-[#2a2a2a]">
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          readOnly,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 12 },
        }}
      />
    </div>
  );
}

"use client";

import { LANGUAGES } from "@/lib/constants";

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
  showAll?: boolean;
}

export function LanguageSelector({ value, onChange, showAll = false }: LanguageSelectorProps) {
  const languages = showAll ? LANGUAGES : LANGUAGES.filter((l) => ["cpp", "java", "python", "javascript"].includes(l.id));

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg border bg-[#141414] text-[#e5e5e5] text-sm border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
    >
      {languages.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}

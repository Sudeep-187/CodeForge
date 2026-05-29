"use client";
import { useState, useCallback } from "react";

export function useCodeEditor(initialLanguage = "javascript") {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState("");

  const updateCode = useCallback((val: string | undefined) => {
    if (val !== undefined) setCode(val);
  }, []);

  return { language, setLanguage, code, setCode, updateCode };
}

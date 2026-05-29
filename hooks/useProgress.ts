"use client";
import { useState, useEffect } from "react";

export function useProgress() {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress")
      .then(r => r.json())
      .then(data => setProgress(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { progress, loading };
}

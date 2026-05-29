"use client";
import { useState, useEffect } from "react";

export function useStreak() {
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastActive: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/streak")
      .then(r => r.json())
      .then(data => setStreak(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { ...streak, loading };
}

"use client";

import { useEffect, useState } from "react";
import { OPTION_CATEGORIES, type OptionCategory } from "@/lib/motor-options";

export type OptionLists = Record<OptionCategory, string[]>;

function defaultOptionLists(): OptionLists {
  const result = {} as OptionLists;
  for (const key of Object.keys(OPTION_CATEGORIES) as OptionCategory[]) {
    result[key] = [...OPTION_CATEGORIES[key].defaults];
  }
  return result;
}

export function useOptionLists() {
  const [lists, setLists] = useState<OptionLists>(defaultOptionLists);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/options")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: OptionLists | null) => {
        if (data && !cancelled) setLists(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return { lists, setLists };
}

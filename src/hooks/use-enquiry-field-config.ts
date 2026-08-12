"use client";

import { useEffect, useState } from "react";
import {
  defaultEnquiryFieldConfig,
  type EnquiryFieldConfig,
} from "@/lib/enquiry-form-fields";

export function useEnquiryFieldConfig() {
  const [config, setConfig] = useState<EnquiryFieldConfig[]>(defaultEnquiryFieldConfig);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/enquiry-form-fields")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: EnquiryFieldConfig[] | null) => {
        if (data && !cancelled) setConfig(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { config, setConfig, loaded };
}

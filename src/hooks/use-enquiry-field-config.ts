"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_ENQUIRY_SECTION_TITLE,
  type EnquiryFormConfig,
} from "@/lib/enquiry-form-fields";

const EMPTY_CONFIG: EnquiryFormConfig = { title: DEFAULT_ENQUIRY_SECTION_TITLE, fields: [] };

export function useEnquiryFieldConfig(productType: string | undefined) {
  const [formConfig, setFormConfig] = useState<EnquiryFormConfig>(EMPTY_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!productType) return;
    let cancelled = false;
    setLoaded(false);
    fetch(`/api/enquiry-form-fields?type=${encodeURIComponent(productType)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: EnquiryFormConfig | null) => {
        if (data && !cancelled) setFormConfig(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [productType]);

  return {
    title: formConfig.title,
    config: formConfig.fields,
    setFormConfig,
    loaded,
  };
}

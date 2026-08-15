"use client";

import { useEffect, useState } from "react";
import { DEFAULT_PRODUCT_TYPES, type ProductTypeDef } from "@/lib/product-types";

export function useProductTypes() {
  const [types, setTypes] = useState<ProductTypeDef[]>(DEFAULT_PRODUCT_TYPES);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/product-types")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ProductTypeDef[] | null) => {
        if (data && !cancelled) setTypes(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return { types, setTypes };
}

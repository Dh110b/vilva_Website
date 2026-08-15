"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductTypesEditor } from "@/components/product-types-editor";
import { useProductTypes } from "@/hooks/use-product-types";

export function ManageProductTypesDialog() {
  const [open, setOpen] = useState(false);
  const { types: productTypes, setTypes: setProductTypes } = useProductTypes();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" />}>
        <Settings className="size-4" /> Product Types
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-4xl sm:max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Product Types</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          Add, rename, or remove product categories. These appear on the Add Product and Custom
          Product pages, and control whether the Extra Enquiry fields show up. Renaming a type
          updates it everywhere on the site immediately.
        </p>
        <ProductTypesEditor types={productTypes} onTypesChange={setProductTypes} />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

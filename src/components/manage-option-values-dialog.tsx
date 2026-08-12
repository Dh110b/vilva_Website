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
import { OptionValuesEditor } from "@/components/option-values-editor";
import type { OptionCategory } from "@/lib/motor-options";
import type { OptionLists } from "@/hooks/use-option-lists";

export function ManageOptionValuesDialog({
  label,
  categories,
  lists,
  onListsChange,
}: {
  label: string;
  categories: OptionCategory[];
  lists: OptionLists;
  onListsChange: (next: OptionLists) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
            aria-label={`Manage ${label} values`}
          />
        }
      >
        <Settings className="size-3.5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {label} Values</DialogTitle>
        </DialogHeader>
        <OptionValuesEditor categories={categories} lists={lists} onListsChange={onListsChange} />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

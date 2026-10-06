import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaveButton({ pending, isNew, label }: { pending: boolean; isNew?: boolean; label?: string }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <LoaderCircle className="animate-spin" />} {label ?? (isNew ? "Create" : "Save changes")}
    </Button>
  );
}

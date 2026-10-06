"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Result = { ok: true; message?: string } | { ok: false; error: string };

export function DeleteButton({
  action,
  itemLabel,
  redirectTo,
  variant = "icon",
}: {
  action: () => Promise<Result>;
  itemLabel: string;
  redirectTo?: string;
  variant?: "icon" | "button";
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${itemLabel}`}>
            <Trash2 className="text-destructive" />
          </Button>
        ) : (
          <Button variant="outline" className="text-destructive">
            <Trash2 /> Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemLabel}?</AlertDialogTitle>
          <AlertDialogDescription>This permanently removes it from the database and the website. This can&apos;t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              start(async () => {
                const res = await action();
                if (res.ok) {
                  toast.success(res.message ?? "Deleted");
                  if (redirectTo) router.push(redirectTo);
                  else router.refresh();
                } else toast.error(res.error);
              });
            }}
          >
            {pending && <LoaderCircle className="animate-spin" />} Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

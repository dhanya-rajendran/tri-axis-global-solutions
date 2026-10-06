"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SelectField, SwitchField, TextField, handleActionResult } from "@/components/forms/fields";
import { SaveButton } from "@/components/forms/SaveButton";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { TableCard } from "@/components/shared/TableCard";
import { userSchema } from "@/lib/validators";
import { deleteUser, saveUser } from "./actions";

type User = { id: number; name: string; email: string; role: "admin" | "editor"; isActive: boolean; lastLoginAt: string | null };

export function UsersManager({ users, meId }: { users: User[]; meId: number }) {
  const [editing, setEditing] = useState<User | "new" | null>(null);
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing("new")}>
          <Plus /> Add user
        </Button>
      </div>
      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden sm:table-cell">Last sign-in</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <p className="font-medium">
                    {u.name} {u.id === meId && <span className="text-muted-foreground text-xs">(you)</span>}
                  </p>
                  <p className="text-muted-foreground text-xs">{u.email}</p>
                </TableCell>
                <TableCell className="capitalize">{u.role}</TableCell>
                <TableCell className="hidden sm:table-cell">{u.lastLoginAt ?? "Never"}</TableCell>
                <TableCell>{u.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => setEditing(u)}>
                      <Pencil />
                    </Button>
                    {u.id !== meId && <DeleteButton action={deleteUser.bind(null, u.id)} itemLabel={u.name} />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Add user" : "Edit user"}</DialogTitle>
            <DialogDescription>Admins can manage users; editors can manage all website content and enquiries.</DialogDescription>
          </DialogHeader>
          {editing !== null && <UserForm key={editing === "new" ? "new" : editing.id} user={editing === "new" ? null : editing} onDone={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function UserForm({ user, onDone }: { user: User | null; onDone: () => void }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm<z.input<typeof userSchema>, unknown, z.output<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", role: user?.role ?? "editor", isActive: user?.isActive ?? true, password: "" },
  });
  const onSubmit = form.handleSubmit(async (v) => {
    setPending(true);
    const res = await saveUser(user?.id ?? null, v);
    setPending(false);
    if (handleActionResult(form, res)) {
      onDone();
      router.refresh();
    }
  });
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <TextField control={form.control} name="name" label="Name" />
        <TextField control={form.control} name="email" label="Email" type="email" />
        <SelectField control={form.control} name="role" label="Role" options={[{ value: "editor", label: "Editor" }, { value: "admin", label: "Admin" }]} />
        <TextField
          control={form.control}
          name="password"
          label={user ? "New password" : "Password"}
          type="password"
          autoComplete="new-password"
          description={user ? "Leave empty to keep the current password." : "At least 10 characters."}
        />
        <SwitchField control={form.control} name="isActive" label="Active" description="Inactive users can't sign in." />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
          <div className="w-36">
            <SaveButton pending={pending} isNew={!user} />
          </div>
        </div>
      </form>
    </Form>
  );
}

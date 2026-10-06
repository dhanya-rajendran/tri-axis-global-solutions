"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconField, SelectField, SlugField, SwitchField, TextAreaField, TextField, handleActionResult } from "@/components/forms/fields";
import { SaveButton } from "@/components/forms/SaveButton";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableCard } from "@/components/shared/TableCard";
import { entities, type EntityKey } from "@/lib/entities";
import { IconPreview } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { deleteEntity, saveEntity } from "../actions";

type Row = Record<string, unknown> & { id: number };

export function EntityManager({ entityKey, rows }: { entityKey: EntityKey; rows: Row[] }) {
  const cfg = entities[entityKey];
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [group, setGroup] = useState<string>(cfg.groupBy?.options[0].value ?? "");
  const visible = useMemo(() => (cfg.groupBy ? rows.filter((r) => r[cfg.groupBy!.field] === group) : rows), [rows, cfg.groupBy, group]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {cfg.groupBy ? (
          <Tabs value={group} onValueChange={setGroup}>
            <TabsList className="h-auto flex-wrap justify-start">
              {cfg.groupBy.options.map((o) => (
                <TabsTrigger key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <span />
        )}
        <Button onClick={() => setEditing("new")}>
          <Plus /> Add {cfg.singular}
        </Button>
      </div>

      {visible.length === 0 ? (
        <EmptyState title={`No ${cfg.title.toLowerCase()} yet`} />
      ) : (
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow>
                {cfg.columns.map((c) => (
                  <TableHead key={c.key} className={c.className}>
                    {c.label}
                  </TableHead>
                ))}
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((r) => (
                <TableRow key={r.id}>
                  {cfg.columns.map((c) => {
                    const v = r[c.key];
                    return (
                      <TableCell key={c.key} className={cn("max-w-sm", c.className)}>
                        {c.kind === "bool" ? (
                          v ? <Check className="text-success size-4" /> : <span className="text-muted-foreground">—</span>
                        ) : c.kind === "icon" ? (
                          <IconPreview name={String(v)} className="text-teal size-4" />
                        ) : c.kind === "badge" ? (
                          <Badge variant="outline">{c.map?.[String(v)] ?? String(v)}</Badge>
                        ) : (
                          <span className="line-clamp-2">{v == null || v === "" ? "—" : String(v)}</span>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => setEditing(r)}>
                        <Pencil />
                      </Button>
                      <DeleteButton action={deleteEntity.bind(null, entityKey, r.id)} itemLabel={`this ${cfg.singular}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>
      )}

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? `Add ${cfg.singular}` : `Edit ${cfg.singular}`}</DialogTitle>
            <DialogDescription>{cfg.description}</DialogDescription>
          </DialogHeader>
          {editing !== null && (
            <EntityForm
              key={editing === "new" ? "new" : editing.id}
              entityKey={entityKey}
              row={editing === "new" ? null : editing}
              defaultGroup={group}
              onDone={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EntityForm({ entityKey, row, defaultGroup, onDone }: { entityKey: EntityKey; row: Row | null; defaultGroup?: string; onDone: () => void }) {
  const cfg = entities[entityKey];
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const defaults = useMemo(() => {
    const d: Record<string, unknown> = { ...cfg.defaults };
    if (cfg.groupBy && defaultGroup) d[cfg.groupBy.field] = defaultGroup;
    if (row) for (const k of Object.keys(cfg.defaults)) d[k] = row[k] ?? (typeof cfg.defaults[k] === "string" ? "" : cfg.defaults[k]);
    return d;
  }, [cfg, row, defaultGroup]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({ resolver: zodResolver(cfg.schema as any), defaultValues: defaults });

  const onSubmit = form.handleSubmit(async (values) => {
    setPending(true);
    const res = await saveEntity(entityKey, row?.id ?? null, values);
    setPending(false);
    if (handleActionResult(form, res)) {
      onDone();
      router.refresh();
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
        {cfg.fields.map((f) => {
          const span = f.span === 2 || f.type === "textarea" ? "sm:col-span-2" : undefined;
          switch (f.type) {
            case "textarea":
              return <TextAreaField key={f.name} control={form.control} name={f.name} label={f.label} description={f.description} className={span} rows={3} />;
            case "switch":
              return <SwitchField key={f.name} control={form.control} name={f.name} label={f.label} description={f.description} className={span} />;
            case "icon":
              return <IconField key={f.name} control={form.control} name={f.name} label={f.label} className={span} />;
            case "select":
              return <SelectField key={f.name} control={form.control} name={f.name} label={f.label} options={f.options} className={span} />;
            case "slug":
              return (
                <div key={f.name} className={span}>
                  <SlugField form={form} name={f.name} sourceName={f.source} label={f.label} />
                </div>
              );
            default:
              return (
                <TextField
                  key={f.name}
                  control={form.control}
                  name={f.name}
                  label={f.label}
                  description={f.description}
                  type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                  className={span}
                />
              );
          }
        })}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
          <div className="w-40">
            <SaveButton pending={pending} isNew={!row} />
          </div>
        </div>
      </form>
    </Form>
  );
}

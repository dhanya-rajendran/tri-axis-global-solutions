import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { json, publicGet } from "@/lib/public/http";

export const GET = publicGet(async () => {
  const rows = await db.select().from(teamMembers).where(eq(teamMembers.isPublished, true)).orderBy(asc(teamMembers.sortOrder));
  return json(
    rows.map((r) => ({
      id: String(r.id), name: r.name, role: r.role, ...(r.bio ? { bio: r.bio } : {}), ...(r.imageUrl ? { image: r.imageUrl } : {}),
      ...(r.linkedinUrl ? { linkedinUrl: r.linkedinUrl } : {}), order: r.sortOrder,
    })),
  );
});

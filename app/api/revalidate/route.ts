import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/services/api";

/**
 * Called by the admin dashboard after content changes:
 *   POST /api/revalidate   header: x-revalidate-secret: <REVALIDATE_SECRET>
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ ok: true, revalidatedAt: new Date().toISOString() });
}

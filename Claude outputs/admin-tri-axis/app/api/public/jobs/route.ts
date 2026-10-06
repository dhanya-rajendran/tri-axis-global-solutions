import { json, publicGet } from "@/lib/public/http";
import { mapJob } from "@/lib/public/mappers";
import { findJobs } from "@/lib/public/queries";

/** GET /api/public/jobs?keyword=&location=&industry=&type=&experience=&limit= */
export const GET = publicGet(async (request: Request) => {
  const rows = await findJobs(new URL(request.url).searchParams);
  return json(rows.map(mapJob), { maxAge: 30 });
});

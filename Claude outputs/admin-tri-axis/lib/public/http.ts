import "server-only";
import { NextResponse } from "next/server";

/** Allowed browser origins for form submissions (comma-separated CORS_ORIGINS). */
export function allowedOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? "").split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean);
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = allowedOrigins();
  const allow = origin && (allowed.includes(origin) || allowed.includes("*")) ? origin : null;
  return allow
    ? { "Access-Control-Allow-Origin": allow, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, x-api-key", Vary: "Origin" }
    : { Vary: "Origin" };
}

/** Read endpoints: require x-api-key when PUBLIC_API_KEY is configured. */
export function checkApiKey(request: Request): NextResponse | null {
  const key = process.env.PUBLIC_API_KEY;
  if (!key) return null;
  if (request.headers.get("x-api-key") === key) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function json(data: unknown, init: { status?: number; maxAge?: number; origin?: string | null } = {}) {
  return NextResponse.json(data, {
    status: init.status ?? 200,
    headers: {
      "Cache-Control": init.status && init.status >= 400 ? "no-store" : `public, s-maxage=${init.maxAge ?? 60}, stale-while-revalidate=300`,
      ...corsHeaders(init.origin ?? null),
    },
  });
}

export const notFound = () => json({ error: "Not found" }, { status: 404 });

/** Wraps a GET handler with API-key check + error handling. */
export function publicGet<P>(handler: (request: Request, ctx: P) => Promise<Response>) {
  return async (request: Request, ctx: P) => {
    const denied = checkApiKey(request);
    if (denied) return denied;
    try {
      return await handler(request, ctx);
    } catch (err) {
      console.error("[public api]", err);
      return json({ error: "Server error" }, { status: 500 });
    }
  };
}

import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "triaxis_admin_session";

/**
 * Optimistic auth gate: redirects to /login when there is no valid session
 * cookie. Real authorisation (active user, role) happens in lib/auth/dal.ts.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let valid = false;
  if (token && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET), { algorithms: ["HS256"] });
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (pathname === "/login") {
    return valid ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }
  if (!valid) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Everything except the public API, Next internals and static files.
  matcher: ["/((?!api/public|api/health|_next/static|_next/image|icon.svg|favicon.ico|robots.txt).*)"],
};

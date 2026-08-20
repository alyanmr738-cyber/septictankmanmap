import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth/token";
import { getWordpressOrigin, isProduction } from "@/lib/env";

function frameAncestors(): string {
  const origin = getWordpressOrigin();
  const extras = ["'self'"];
  if (origin) {
    extras.push(origin);
  } else if (!isProduction()) {
    extras.push("http://localhost:3000", "http://127.0.0.1:3000");
  }
  return extras.join(" ");
}

function applySecurityHeaders(request: NextRequest, response: NextResponse) {
  const path = request.nextUrl.pathname;
  const isEmbeddable = path === "/map" || path.startsWith("/map/") || path === "/api/map";

  if (isEmbeddable) {
    response.headers.set("Content-Security-Policy", `frame-ancestors ${frameAncestors()}`);
    response.headers.delete("X-Frame-Options");
  } else {
    response.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
    response.headers.set("X-Frame-Options", "DENY");
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  return response;
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminPage = path.startsWith("/admin") && path !== "/admin/login";
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const authed = verifySessionToken(token);

  if (isAdminPage && !authed) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", path);
    return applySecurityHeaders(request, NextResponse.redirect(loginUrl));
  }

  if (path === "/admin/login" && authed) {
    return applySecurityHeaders(request, NextResponse.redirect(new URL("/admin", request.url)));
  }

  return applySecurityHeaders(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

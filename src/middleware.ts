import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

const PRIVATE_PATHS = ["/upload", "/api/auth/me"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PRIVATE_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(req.nextUrl);
  const host = req.headers.get("host");

  if (host) {
    redirectUrl.host = host;
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    if (pathname == "/api/auth/me") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!accessToken) {
    return NextResponse.redirect(
      new URL(`/api/auth/refresh-token?redirect=${redirectUrl}`, req.url)
    );
  }

  const payload = await verifyJWT(accessToken);

  if (!payload) {
    return NextResponse.redirect(
      new URL(`/api/auth/refresh-token?redirect=${redirectUrl}`, req.url)
    );
  }

  if (
    payload.is_verified === false &&
    req.nextUrl.pathname !== "/verify-email"
  ) {
    return NextResponse.redirect(new URL("/verify-email", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public).*)"],
};

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

async function handler(request: NextRequest) {
 console.log(request)
  const loginUrl =
    new URL(request.url).protocol +
    "//" +
    request.headers.get("host") +
    "/login";

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set("access_token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 0,
  });

  response.cookies.set("refresh_token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 0,
  });

  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, createAccessToken } from "@/lib/jwt";
import supabase from "@/lib/supabase";

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

async function handler(request: NextRequest) {
  const baseUrl =
    new URL(request.url).protocol + "//" + request.headers.get("host");
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { searchParams } = request.nextUrl;
  const redirectTo = searchParams.get("redirect") || "/";
  // const isForced = searchParams.get("force") === "true";

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  // Check if refresh token is valid and in DB
  const payload = await verifyJWT(refreshToken);
  if (!payload || payload.type !== "refresh") {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  // Check if token exists in sessions table
  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("token", refreshToken)
    .single();
  if (error || !session) {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  // Issue new access token
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", String(payload.id))
    .single();
  if (!user) {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  const accessToken = await createAccessToken({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    is_verified: user.is_verified,
  });

  // Set new access token cookie using NextResponse
  const response = NextResponse.redirect(new URL(redirectTo, baseUrl));
  response.cookies.set("access_token", accessToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 60 * 15,
  });
  return response;
}

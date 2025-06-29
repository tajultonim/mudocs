import { NextRequest, NextResponse } from "next/server";
import { verifyAccountByToken } from "@/app/actions/auth-action";

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");
  const res = await verifyAccountByToken(token || "");
  return NextResponse.json(res);
}

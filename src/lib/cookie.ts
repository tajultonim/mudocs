import { cookies } from "next/headers";

export async function setCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    maxAge?: number;
  } = {}
) {
  const cookieStore = await cookies();
  // next/headers cookies() returns a ReadonlyRequestCookies in middleware, but a ResponseCookies in server actions/routes
  // Only ResponseCookies has set/get methods
  // So, we need to check for set method
  if (typeof cookieStore.set === "function") {
    cookieStore.set({
      name,
      value,
      path: options.path,
      httpOnly: options.httpOnly,
      secure: options.secure,
      sameSite: options.sameSite,
      maxAge: options.maxAge,
    });
  }
}

export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  if (typeof cookieStore.get === "function") {
    return cookieStore.get(name)?.value;
  }
  return undefined;
}


"use server";
import supabase from "@/lib/supabase";
import bcrypt from "bcryptjs";
import {
  AccessTokenPayload,
  createAccessToken,
  createRefreshToken,
  createVerificationToken,
  decodeJWT,
  verifyJWT,
} from "@/lib/jwt";
import { getCookie, setCookie } from "@/lib/cookie";
import { sendVerificationMail } from "./mail-action";
import { cookies } from "next/headers";
import { User } from "@/providers/authprovider";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/auth-helper";

export async function createSession({
  user,
  deviceInfo,
}: {
  user: { id: string; [key: string]: unknown };
  deviceInfo?: { ip?: string; userAgent?: string };
}) {
  const token =
    globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  const ip = deviceInfo?.ip || "0.0.0.0";
  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .insert([
      {
        user_id: user.id,
        token,
        ip,
        extra_meta: deviceInfo || null,
      },
    ])
    .select();
  if (sessionError) {
    return { error: sessionError.message };
  }

  // Log activity
  await supabase.from("activity_log").insert([
    {
      user_id: user.id,
      action: "login",
      ip,
      user_agent: deviceInfo?.userAgent || null,
      extra_meta: deviceInfo || null,
      is_admin_action: false,
    },
  ]);

  return { session: sessionData?.[0], token };
}

export async function login(
  formData: FormData
): Promise<{ user: User } | { error: string }> {
  const usernameOrEmail = formData.get("usernameOrEmail")?.toString();
  const password = formData.get("password")?.toString();
  const deviceInfo = JSON.parse(formData.get("deviceInfo")?.toString() || "{}");

  if (!usernameOrEmail || !password) {
    return { error: "All fields are required." };
  }

  // Find user by username or email
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`)
    .limit(1);
  if (error) {
    return { error: error.message };
  }
  const user = users?.[0];
  if (!user) {
    return { error: "User not found." };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { error: "Invalid credentials." };
  }

  if (user.banned_until && new Date(user.banned_until) > new Date()) {
    return { error: "Your account is banned. Please contact support." };
  }

  const { refreshToken } = await generateAndSetLoginTokenCookiesFromData(user);

  // Store refreshToken in sessions table for revocation
  const ip = deviceInfo?.ip || "0.0.0.0";
  const { error: sessionError } = await supabase.from("sessions").insert([
    {
      user_id: user.id,
      token: refreshToken,
      ip,
      extra_meta: deviceInfo || null,
    },
  ]);
  if (sessionError) {
    return { error: sessionError.message };
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      name: user.full_name,
      is_verified: user.is_verified,
      isLoggedIn: true,
      avatar: user.image_url,
    },
  };
}

export async function signup(formData: FormData) {
  const username = formData.get("username")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const deviceInfo = JSON.parse(formData.get("deviceInfo")?.toString() || "{}");
  // Validation
  if (validateUsername(username)) {
    return { error: "Username must be at least 3 characters." };
  }
  if (validateEmail(email)) {
    return { error: "Email must be a valid @ru.ac.bd address." };
  }
  if (validatePassword(password)) {
    return { error: "Password must be at least 8 characters." };
  }

  // Hash the password
  const password_hash = await bcrypt.hash(password, 10);

  // Generate verification code and timestamp
  const verification_token = await createVerificationToken(email);
  const last_verification_request = new Date().toISOString();
  const verification_ip = deviceInfo?.ip || null;
  const verification_user_agent = deviceInfo?.userAgent || null;

  // Insert user into Supabase
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        username: username,
        email: email,
        password_hash: password_hash,
        roles: ["user"],
        is_verified: false,
        extra_meta: {
          verification: {
            token: verification_token,
            req_time: last_verification_request,
            ip: verification_ip,
            user_agent: verification_user_agent,
          },
        },
      },
    ])
    .select("id,email, roles, is_verified,username")
    .single();
  if (error) {
    return { error: error.message };
  }
  try {
    // Log signup activity
    await supabase.from("activity_log").insert([
      {
        user_id: data?.id || null,
        action: "signup",
        ip: verification_ip,
        user_agent: verification_user_agent,
        extra_meta: deviceInfo || null,
        is_admin_action: false,
      },
    ]);
  } catch (error) {
    console.log("Something went wrong but not severe", error);
  }

  await sendVerificationMail(email, verification_token);

  await generateAndSetLoginTokenCookiesFromData(data);

  return { status: "success", message: "Signup successful!" };
}

export async function validateUser(accessToken: string) {
  if (!accessToken) {
    return { error: "Access token is required." };
  }

  try {
    const payload = await verifyJWT(accessToken);
    // if (!payload || payload.type !== "access") {
    if (!payload) {
      return { error: "Invalid access token." };
    }

    // // Fetch user from database
    // const { data: user, error } = await supabase
    //   .from("users")
    //   .select("*")
    //   .eq("id", payload.id as string)
    //   .single();
    // if (error || !user) {
    //   return { error: "User not found." };
    // }

    return { status: "success", data: payload };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Failed to validate access token." };
  }
}

export async function verifyAccountByToken(
  token: string,
  deviceInfo?: { ip?: string; user_agent?: string; [key: string]: unknown }
) {
  const payload = await verifyJWT(token);
  const decoded = decodeJWT(token);
  if (!payload || !payload.email || payload.type !== "verification") {
    if (!decoded || !decoded.email || decoded.type !== "verification") {
      return {
        status: "error",
        error: "Invalid verification token.",
        code: "invalid",
      };
    } else {
      return {
        status: "error",
        error: "Expired token!",
        email: decoded.email,
        code: "expired",
      };
    }
  }

  const { data: user } = await supabase
    .from("users")
    .select("is_verified, extra_meta")
    .eq("email", payload.email as string)
    .single();

  if (user?.is_verified) {
    return {
      status: "error",
      error: "Account already verified.",
      email: payload.email,
    };
  }

  const stored_token = (
    user?.extra_meta as {
      verification?: { token?: string };
    }
  )?.verification?.token;

  if (stored_token !== token) {
    return {
      status: "error",
      error: "Expired verification token!",
      email: payload.email,
      code: "expired",
    };
  }

  const { data, error } = await supabase
    .from("users")
    .update({ is_verified: true, extra_meta: null })
    .eq("email", payload.email as string)
    .select("id, username, email, roles, is_verified")
    .single();

  await supabase.from("activity_log").insert({
    user_id: data?.id || null,
    action: "email_verification",
    ip: deviceInfo?.ip || "",
    user_agent: deviceInfo?.user_agent || "",
    extra_meta: (deviceInfo as { [key: string]: string }) || null,
  });

  if (error) {
    return {
      status: "error",
      error: error.message,
      email: payload.email,
      code: "db_error",
    };
  }

  await generateAndSetLoginTokenCookiesFromData(data);

  return { status: "success", data: payload };
}
export async function generateAndSetLoginTokenCookiesFromData(user: {
  id: string;
  username: string;
  email: string;
  roles: string[];
  is_verified: boolean;
}) {
  // Issue JWT tokens
  const accessToken = await createAccessToken({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    is_verified: user.is_verified,
  });
  const refreshToken = await createRefreshToken({
    id: user.id,
    type: "refresh",
  });

  // Set refresh and access tokens as HttpOnly cookies
  await setCookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  await setCookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  return { accessToken, refreshToken };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function resendVerificationEmail() {
  const accessToken = await getCookie("access_token");
  const payload = (await verifyJWT(
    accessToken || ""
  )) as AccessTokenPayload | null;
  if (!payload?.email) {
    return { status: "error", message: "Could not send verification email" };
  } else {
    const { data: user } = await supabase
      .from("users")
      .select("extra_meta")
      .eq("email", payload.email)
      .single();
    const lastSent = new Date(
      (
        user?.extra_meta as {
          verification?: { req_time?: string };
        }
      )?.verification?.req_time || new Date(0).toISOString()
    );

    if (
      lastSent.getTime() < new Date(new Date().getTime() - 30 * 1000).getTime()
    ) {
      const verification_token = await createVerificationToken(
        payload.email,
        60 * 60 * 24
      );
      await sendVerificationMail(payload.email, verification_token);
      await supabase
        .from("users")
        .update({
          extra_meta: {
            verification: {
              req_time: new Date().toISOString(),
              token: verification_token,
            },
          },
        })
        .eq("email", payload.email);
      return { status: "success", message: "Email sent successfully" };
    }
    return {
      status: "error",
      message: "Please wait 30 seconds before requesting again.",
    };
  }
}

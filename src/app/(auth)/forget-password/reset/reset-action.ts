"use server";

import { generateAndSetLoginTokenCookiesFromData } from "@/app/actions/auth-action";
import { validatePassword } from "@/lib/auth-helper";
import { verifyJWT } from "@/lib/jwt";
import supabase from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function resetaction(formData: FormData) {
  const token = formData.get("token") as string;
  const newPassword = formData.get("password") as string;

  const { data, error } = await verifyPasswordResetToken(token);
  if (error || !data) {
    return { error: error, code: "invalid_token" };
  }
  if (!newPassword || !validatePassword(newPassword)) {
    return {
      error: "Please enter a valid password.",
      code: "invalid_password",
    };
  }

  const user = await supabase
    .from("users")
    .select("id, roles, username, is_verified, extra_meta")
    .eq("email", data.email as string)
    .single();

  if (!user.data || user.error) {
    return { error: "User not found.", code: "user_not_found" };
  }
  const dbtoken = (
    user.data.extra_meta as {
      password_reset?: { token?: string };
    }
  )?.password_reset?.token;

  if (dbtoken !== token) {
    return { error: "Invalid or expired token.", code: "invalid_token" };
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const { email } = data;
  const { error: updateError } = await supabase
    .from("users")
    .update({
      password_hash: hashedPassword,
      extra_meta: {
        ...(user.data.extra_meta as object),
        password_reset: null,
      },
    })
    .eq("email", email as string);

  if (updateError) {
    return {
      error: "Failed to update password. Please try again.",
      code: "update_failed",
    };
  }
  await generateAndSetLoginTokenCookiesFromData({
    id: user.data.id,
    username: user.data.username,
    email: email as string,
    roles: user.data.roles,
    is_verified: user.data.is_verified,
  });
  return {
    status: "success",
    message: "Password has been reset successfully.",
  };
}

export async function verifyPasswordResetToken(token: string) {
  if (!token) {
    return { error: "Invalid or expired token.", code: "invalid_token" };
  }
  const payload = await verifyJWT(token);
  if (!payload || payload.type !== "password_reset") {
    return { error: "Invalid or expired token.", code: "invalid_token" };
  }
  return { status: "success", data: payload };
}

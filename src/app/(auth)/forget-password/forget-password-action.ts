"use server";

import { sendResetPasswordMail } from "@/app/actions/mail-action";
import { validateEmail } from "@/lib/auth-helper";
import { createPasswordResetToken } from "@/lib/jwt";
import supabase from "@/lib/supabase";

export async function forgetpasswordaction(
  formData: FormData
): Promise<{ error: string } | { status: string; message: string }> {
  const email = formData.get("email") as string;
  if (!email || !validateEmail(email)) {
    return {
      error: "Please enter a valid email address.",
    };
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, extra_meta")
    .eq("email", email)
    .single();
  if (!data || error) {
    return {
      error: "No user found with this email address.",
    };
  }

  const lastSent = new Date(
    (
      data?.extra_meta as {
        password_reset?: { req_time?: string };
      }
    )?.password_reset?.req_time || new Date(0).toISOString()
  );
  if (
    lastSent.getTime() >
    new Date(new Date().getTime() - 5 * 60 * 1000).getTime()
  ) {
    return {
      error: "Please wait 5 minute before requesting again.",
    };
  }

  const token = await createPasswordResetToken(email);
  await supabase
    .from("users")
    .update({
      extra_meta: {
        ...(data.extra_meta as object),
        password_reset: {
          token,
          req_time: new Date().toISOString(),
        },
      },
    })
    .eq("email", email);

  await sendResetPasswordMail(email, token);
  return {
    status: "success",
    message: "Password reset link has been sent to your email.",
  };
}

import { createTransport } from "nodemailer";

export async function sendVerificationMail(email: string, token: string) {
  try {
    if (!email || !token) {
      throw new Error("Email and token are required.");
    }

    const verificationLink = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/verify-email?token=${token}`;

    const emailContent = `
      <p>Hello,</p>
      <p>
        We received a request to create an account for
        <strong>${email}</strong> on μDocs.
      </p>
      <p>To verify your email address, please click the button below:</p>
      <p style="text-align: center">
        <a
          href="${verificationLink}"
          style="
            display: inline-block;
            background: #0070f3;
            color: #fff !important;
            padding: 12px 28px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin: 24px 0;
          "
          >Verify Email</a
        >
      </p>
      <p>
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="word-break: break-all; color: #0070f3">${verificationLink}</p>
      <p>If you did not request this, you can safely ignore this email.</p>
  `;

    const textContent = `Hello,

We received a request to create an account for ${email} on μDocs.

To verify your email address, please click the link below or copy and paste it into your browser:

${verificationLink}

If you did not request this, you can safely ignore this email.`;

    const res = await sendMail({
      to: email,
      subject: "μDocs Email Verification",
      emailContent,
      textContent,
    });

    return { success: true, message: "Verification email sent.", data: res };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email.",
      error: error,
    };
  }
}

export async function sendResetPasswordMail(email: string, token: string) {
  try {
    if (!email || !token) {
      throw new Error("Email and token are required.");
    }

    const resetLink = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/forget-password/reset?token=${token}`;

    const emailContent = `
      <p>Hello,</p>
      <p>
        We received a request to reset the password for your account associated with
        <strong>${email}</strong> on μDocs.
      </p>
      <p>To reset your password, please click the button below:</p>
      <p style="text-align: center">
        <a
          href="${resetLink}"
          style="
            display: inline-block;
            background: #0070f3;
            color: #fff !important;
            padding: 12px 28px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin: 24px 0;
          "
          >Reset Password</a
        >
      </p>
      <p>
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="word-break: break-all; color: #0070f3">${resetLink}</p>
      <p>If you did not request this, you can safely ignore this email.</p>
  `;

    const textContent = `Hello,

We received a request to reset the password for your account associated with ${email} on μDocs.

To reset your password, please click the link below or copy and paste it into your browser:

${resetLink}

If you did not request this, you can safely ignore this email.`;

    const res = await sendMail({
      to: email,
      subject: "μDocs Password Reset",
      emailContent,
      textContent,
    });

    return { success: true, message: "Reset password email sent.", data: res };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return {
      success: false,
      message: "Failed to send reset password email.",
      error: error,
    };
  }
}

async function sendMail({
  emailContent,
  textContent,
  subject,
  to,
}: {
  textContent: string;
  emailContent: string;
  subject: string;
  to: string;
}) {
  const html = `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      background: #f7f7f9;
      color: #222;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        max-width: 480px;
        margin: 40px auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
        padding: 32px 24px;
      "
    >
      <div style="text-align: center; margin-bottom: 24px">
        <h2 style="margin: 0"><span style="color: #0070f3">μ</span>Docs</h2>
      </div>
      ${emailContent}
      <div
        style="
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 32px;
        "
      >
        &copy; μDocs ${new Date().getFullYear()}. All rights reserved.
      </div>
    </div>
  </body>
</html>
  `;

  const text = `${textContent}

© μDocs ${new Date().getFullYear()}. All rights reserved.`;

  const transport = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: process.env.FROM_GMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const res = await transport.sendMail({
    from: process.env.FROM_GMAIL,
    to,
    subject,
    html,
    text,
  });

  if (res.rejected.length > 0) {
    throw new Error(`Failed to send email to ${res.rejected.join(", ")}`);
  }
  return res;
}

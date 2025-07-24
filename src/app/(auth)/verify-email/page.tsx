import ResendEmailButton from "@/app/(auth)/verify-email/resend-email-button";
import VerificationErrorComonent from "@/app/(auth)/verify-email/verification-error";
import VerificationSuccessfulComponent from "@/app/(auth)/verify-email/verification-successful";
import { AlertCard } from "@/components/alerts";
import { AccessTokenPayload, verifyJWT } from "@/lib/jwt";

import { SearchParams } from "next/dist/server/request/search-params";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const headerStore = await headers();
  const baseUrl =
    headerStore.get("x-forwarded-proto") +
    "://" +
    headerStore.get("x-forwarded-host");
  const params = await searchParams;
  const token = params.token;

  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;
  const payload = (await verifyJWT(access_token || "")) as AccessTokenPayload;

  if (!payload && !token) {
    return redirect(`${baseUrl}/login`);
  }

  if (payload && payload.is_verified) {
    return redirect(`${baseUrl}/`);
  }

  if (token) {
    const res = await fetch(`${baseUrl}/api/auth/verify-email?token=${token}`);
    const body = await res.json();

    if (body.status == "success") {
      return <VerificationSuccessfulComponent />;
    }

    console.log(body);

    if (body.status == "error") {
      if (body.code == "expired") {
        return (
          <VerificationErrorComonent
            message={body.error || "Verification token is expired!"}
            showResendButton={!!payload?.email}
          >
            The verification token for{" "}
            <span className=" font-bold">{body?.email || payload.email}</span>{" "}
            is expired.
          </VerificationErrorComonent>
        );
      } else {
        return (
          <VerificationErrorComonent
            message={body.error || "Counld not verify your email!"}
            showResendButton={!!payload?.email}
          >
            The verification token for{" "}
            <span className=" font-bold">{body?.email || payload?.email}</span>{" "}
            is invalid.
          </VerificationErrorComonent>
        );
      }
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <AlertCard type="info" title="Verify your email">
          <p>
            We have sent a verification email to{" "}
            <span className="font-bold">{payload.email}</span>.
            <br />
            Please check your inbox and click the verification link.
          </p>
          {payload.email && (
            <div className=" flex justify-center mt-2">
              <ResendEmailButton />
            </div>
          )}
        </AlertCard>
      </div>
    </div>
  );
}

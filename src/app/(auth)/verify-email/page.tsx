import ResendEmailButton from "@/components/resend-email-button";
import VerificationErrorComonent from "@/components/verification-error";
import VerificationSuccessfulComponent from "@/components/verification-successful";
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
    return redirect(`${baseUrl}/api/auth/logout`);
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
            <span className="font-semibold text-white">
              {body?.email || payload.email}
            </span>{" "}
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
            <span className="font-semibold text-white">
              {body?.email || payload?.email}
            </span>{" "}
            is invalid.
          </VerificationErrorComonent>
        );
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="p-8 bg-gray-800 rounded shadow-md w-full max-w-md flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          Verify your email
        </h1>
        <p className="text-gray-300 text-center">
          We have sent a verification email to{" "}
          <span className="font-semibold text-white">{payload.email}</span>.
          <br />
          Please check your inbox and click the verification link.
        </p>
        {payload.email && <ResendEmailButton />}
      </div>
    </div>
  );
}

import { SearchParams } from "next/dist/server/request/search-params";
import ResetPasswordForm from "./password-reset-form";
import { AlertCard } from "@/components/alerts";
import Link from "next/link";
import { verifyPasswordResetToken } from "./reset-action";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const token = params.token as string;

  if (token) {
    const res = await verifyPasswordResetToken(token);
    if (!res.error) {
      return (
        <>
          <ResetPasswordForm token={token} />
        </>
      );
    }
  }

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <AlertCard type="error" title="Token Error">
            <p>The password reset token is missing, invalid or has expired.</p>
            <p>
              Please request a new link from{" "}
              <Link
                className="text-blue-500 hover:text-blue-400"
                href="/forget-password"
              >
                here
              </Link>{" "}
              or go back to{" "}
              <Link className="text-blue-500 hover:text-blue-400" href={"/"}>
                homepage
              </Link>
              .
            </p>
          </AlertCard>
        </div>
      </div>
    </>
  );
}

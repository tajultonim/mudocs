"use client";

import { AlertCard } from "@/components/alerts";
import Link from "next/link";

export default function ResetEmailSentPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <AlertCard title="Reset Email Sent" type="success">
          <p className="text-gray-600">
            If an account with that email exists, a password reset link has been
            sent. Please check your email to reset your password.
          </p>
          <p>
            Go to the{" "}
            <Link className="text-blue-500 hover:text-blue-400" href={"/login"}>
              login
            </Link>{" "}
            page or go to{" "}
            <Link className=" text-blue-500 hover:text-blue-400" href={"/"}>
              homepage
            </Link>
            .
          </p>
        </AlertCard>
      </div>
    </div>
  );
}

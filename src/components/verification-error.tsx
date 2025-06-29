"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResendEmailButton from "./resend-email-button";

export default function VerificationErrorComonent({
  message,
  children,
  showResendButton = false,
}: {
  message: string;
  children?: React.ReactNode;
  showResendButton?: boolean;
}) {
  const [count, setCount] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (!showResendButton) {
      if (count > 0) {
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.replace("/login");
      }
    }
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="p-8 bg-gray-800 rounded shadow-md w-full max-w-md flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">{message}</h1>
        <p className="text-gray-300 text-center">
          {children}
          {!showResendButton && (
            <>
              <br /> You will be redirected to the{" "}
              <Link
                href="/login"
                className="text-blue-500 hover:underline"
                replace
              >
                login page
              </Link>{" "}
              in {count}...
            </>
          )}
        </p>
        {showResendButton && <ResendEmailButton />}
      </div>
    </div>
  );
}

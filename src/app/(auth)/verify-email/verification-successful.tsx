"use client";

import { AlertCard } from "@/components/alerts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerificationSuccessfulComponent() {
  const [count, setCount] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.replace("/api/auth/refresh-token?redirect=/");
    }
  });

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <AlertCard type="success" title="Email Verified!">
            <p>Your email has been successfully verified.</p>
            <p>Redirecting to the
              <Link
                href="/api/auth/refresh-token?redirect=/"
                className="text-blue-500 hover:text-blue-400"
                replace
              >
                {" "}
                homepage
              </Link>{" "}
              in {count}
              ...
            </p>
          </AlertCard>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
        <p className="text-gray-200 text-center">
          Your email has been successfully verified.
          <br />
          Redirecting to the
          <Link
            href="/api/auth/refresh-token?redirect=/"
            className="text-blue-500 hover:underline"
            replace
          >
            {" "}
            homepage
          </Link>{" "}
          in {count}
          ...
        </p>
      </div>
    </div>
  );
}

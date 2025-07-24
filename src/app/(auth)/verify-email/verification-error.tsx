"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResendEmailButton from "./resend-email-button";
import { AlertCard } from "@/components/alerts";

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
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <AlertCard type="error" title="Token Error">
            <p>{message}</p>
            <p >
              {children}
              {!showResendButton && (
                <>
                  <br/> You will be redirected to the{" "}
                  <Link
                    href="/login"
                    className="text-blue-500 hover:text-blue-400"
                    replace
                  >
                    login page
                  </Link>{" "}
                  in {count}...
                </>
              )}
            </p>
            <div className=" flex justify-center mt-2">
              {showResendButton && <ResendEmailButton />}
            </div>
          </AlertCard>
        </div>
      </div>
    </>
  );
}

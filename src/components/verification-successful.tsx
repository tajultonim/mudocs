"use client";

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="p-8 bg-green-800 rounded shadow-md w-full max-w-md flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
        <p className="text-gray-200 text-center">
          Your email has been successfully verified.
          <br />
          Redirecting to the
          <Link href="/api/auth/refresh-token?redirect=/" className="text-blue-500 hover:underline" replace>
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

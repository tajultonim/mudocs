"use client";

import { resendVerificationEmail } from "@/app/actions/auth-action";
import { useEffect, useState } from "react";

export default function ResendEmailButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  async function resend() {
    setIsLoading(true);
    const res = await resendVerificationEmail();
    alert(res.message);
    setIsLoading(false);
    setCount(30);
  }

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <button
      onClick={() => {
        resend();
      }}
      type="submit"
      disabled={isLoading || count > 0}
      className="bg-blue-600 disabled:bg-blue-300 py-2 px-4 font-semibold rounded-md text-white hover:bg-blue-500 transition-all mt-2"
    >
      {isLoading
        ? "Loading..."
        : count > 0
        ? `Resend Email in ${count}`
        : "Resend Verification Email"}
    </button>
  );
}

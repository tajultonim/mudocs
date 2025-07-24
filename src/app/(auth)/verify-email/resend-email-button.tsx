"use client";

import { resendVerificationEmail } from "@/app/actions/auth-action";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useAlert } from "@/components/alerts";

export default function ResendEmailButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const { AlertComponent, showAlert } = useAlert();

  async function resend() {
    setIsLoading(true);
    const res = await resendVerificationEmail();
    showAlert({
      message: res.message,
      type:
        res.status == "success"
          ? "success"
          : res.status == "error"
          ? "error"
          : "info",
      title:
        res.status == "success"
          ? "Success!"
          : res.status == "error"
          ? "Error!"
          : "Atention!",
    });
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
    <>
      <AlertComponent />
      <Button
        onClick={() => {
          resend();
        }}
        disabled={isLoading || count > 0}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" />
            Loading...
          </>
        ) : count > 0 ? (
          `Resend Email in ${count}`
        ) : (
          "Resend Verification Email"
        )}
      </Button>
    </>
  );
}

"use client";

import { ConfirmModel, useAlert } from "@/components/alerts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/auth-helper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { forgetpasswordaction } from "./forget-password-action";

export default function ForgetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const { AlertComponent, showAlert } = useAlert();

  function handleSubmit(e: React.FormEvent) {
    if (!email || !validateEmail(email)) {
      if (!email) {
        setError("Please enter your email.");
      } else {
        setError("Please enter a valid email address.");
      }
      e.preventDefault();
      return;
    }
    setError("");
  }

  async function handleConfirm() {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    const res = await forgetpasswordaction(formData);
    if ("error" in res) {
      setLoading(false);
      setError(res.error);
      showAlert({
        title: "Error",
        message: res.error,
        type: "error",
      });
      return;
    }
    showAlert({
      title: "Success",
      message: res.message,
      type: "success",
    });
    router.replace("/forget-password/sent");
    setLoading(false);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email below to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="s@ru.ac.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <div className="flex flex-col gap-3">
                <ConfirmModel
                  description={
                    <>
                      Is <span className=" font-bold">{email}</span> your email?
                      We will send a password reset email to it.
                    </>
                  }
                  onConfirm={handleConfirm}
                  isLoading={loading}
                >
                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    className="w-full"
                  >
                    Send Reset Link
                  </Button>
                </ConfirmModel>
                <AlertComponent />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

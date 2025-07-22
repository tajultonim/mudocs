"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePassword } from "@/lib/auth-helper";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { resetaction } from "./reset-action";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/alerts";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { AlertComponent, showAlert } = useAlert();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validatePassword(form.password)) {
      setError("Please enter a valid password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showAlert({
        title: "Error",
        message: "Passwords do not match.",
        type: "error",
      });
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("password", form.password);
    formData.append("token", token);
    const res = await resetaction(formData);
    if (res.error) {
      if (res.code === "invalid_token") {
        router.push("/forget-password/reset");
        setLoading(false);
        return;
      }
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
      message: "Password reset successful! You can now log in.",
      type: "success",
    });
    router.replace("/");
    localStorage.removeItem("user_profile");
    setLoading(false);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create Password</CardTitle>
              <CardDescription>
                Enter the password you want to set for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 mt-3">
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    defaultValue={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <p className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      Passwords must match
                    </p>
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    defaultValue={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Processing...
                      </>
                    ) : (
                      "Set Password"
                    )}
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <AlertComponent />
                </div>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}

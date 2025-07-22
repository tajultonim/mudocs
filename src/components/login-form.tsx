"use client";
import { useState } from "react";
import { getDeviceInfo } from "@/lib/helper";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/authprovider";

import { cn } from "@/lib/utils";
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
import Link from "next/link";
export function LoginCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email or username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
export function LoginForm() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const router = useRouter();
  const pathaname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!form.usernameOrEmail || !form.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    const deviceInfo = await getDeviceInfo();
    //use auth
    const res = await login({
      usernameOrEmail: form.usernameOrEmail,
      password: form.password,
      deviceInfo,
    });
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setError("");
      // alert("Login successful!\n" + JSON.stringify(res, null, 2));
      if (pathaname.includes("/login")) router.push("/");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email or Username</Label>
            <Input
              name="usernameOrEmail"
              type="text"
              placeholder="s@ru.ac.bd"
              defaultValue={form.usernameOrEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forget-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              name="password"
              type="password"
              placeholder="********"
              defaultValue={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </>
  );
}

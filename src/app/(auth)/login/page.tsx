"use client";
import { useState } from "react";
import { getDeviceInfo } from "@/lib/helper";
import { login } from "@/app/actions/auth-action";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
    const formData = new FormData();
    formData.append("usernameOrEmail", form.usernameOrEmail);
    formData.append("password", form.password);
    formData.append("deviceInfo", JSON.stringify(deviceInfo));
    const res = await login(formData);
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setError("");
      alert("Login successful!\n" + JSON.stringify(res, null, 2));
      router.push("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-8 rounded shadow-md w-full max-w-sm border border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
      <input
        type="text"
        name="usernameOrEmail"
        placeholder="Username or Email"
        value={form.usernameOrEmail}
        onChange={handleChange}
        className="w-full px-4 py-2 mb-4 border border-gray-700 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="username"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 mb-4 border border-gray-700 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="current-password"
      />
      {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
      <div className="mt-4 text-center">
        <span className="text-gray-400">Don&apos;t have an account? </span>
        <a href="/signup" className="text-blue-400 hover:underline">
          Sign up
        </a>
      </div>
    </form>
  );
}

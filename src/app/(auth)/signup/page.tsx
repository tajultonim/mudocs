"use client";
import { useState } from "react";
import { getDeviceInfo } from "@/lib/helper";
import { signup } from "@/app/actions/auth-action";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    const deviceInfo = await getDeviceInfo();
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("deviceInfo", JSON.stringify(deviceInfo));
    const res = await signup(formData);
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setError("");
      setSuccess("Signup successful!");
      router.push("/login");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-8 rounded shadow-md w-full max-w-sm border border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Sign Up
      </h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full px-4 py-2 mb-4 border border-gray-700 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="username"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 mb-4 border border-gray-700 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="email"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 mb-4 border border-gray-700 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="new-password"
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        className="w-full px-4 py-2 mb-4 border border-gray-700 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="new-password"
      />
      {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}
      {success && <div className="text-green-400 mb-4 text-sm">{success}</div>}
      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign Up"}
      </button>
      <div className="mt-4 text-center">
        <span className="text-gray-400">Already have an account? </span>
        <a href="/login" className="text-blue-400 hover:underline">
          Login
        </a>
      </div>
    </form>
  );
}

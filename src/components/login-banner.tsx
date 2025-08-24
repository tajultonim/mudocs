"use client";

import { useAuth } from "@/providers/authprovider";
import { LoginPopup } from "./login-alert";
export default function LoginBanner() {
  const { user, loading } = useAuth();

  return (
    <>
      <div className="bg-white rounded-b-4xl">
        <div
          className={` overflow-hidden transition-[max-height] duration-500 ease-out ${
            user || loading ? "max-h-0" : "max-h-[80px]"
          }`}
        >
          <div
            role="alert"
            className={`alert alert-info mx-2 flex justify-between shadow-none`}
          >
            <span>🔒 Please login to access all features.</span>
            <LoginPopup title="Login to your account" description="Login to access all the features.">
              <button className="btn btn-sm">
                Login
              </button>
            </LoginPopup>
          </div>
        </div>
      </div>
    </>
  );
}

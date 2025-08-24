import SearchBar from "./searchinput";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";
import LoginBanner from "./login-banner";

export default function Header() {
  return (
    <header className="sticky top-0">
      <div className="flex justify-between bg-white items-center p-4 z-55 relative">
        <div>
          <Link
            href="/"
            className=" text-2xl font-semibold  sm:block col-span-1"
          >
            <span className="text-blue-500 ">μ</span>Docs
          </Link>
        </div>
        <SearchBar />
        <div>
          <SidebarTrigger />
        </div>
      </div>
      <LoginBanner />
    </header>
  );
}

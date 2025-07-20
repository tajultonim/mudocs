import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="flex justify-between items-center p-4 ">
        <div>
          <Link
            href="/"
            className=" text-2xl font-semibold  sm:block col-span-1"
          >
            <span className="text-blue-500 ">μ</span>Docs
          </Link>
        </div>

        <div>
          <SidebarTrigger />
        </div>
      </div>
    </header>
  );
}

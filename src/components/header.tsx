import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

import IconButton from "./icon-button";
import SearchBar from "./searchbar";
import SidebarDrawer from "./sidebar-drawer";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="grid grid-cols-5 px-2 sm:px-10 lg:px-20 py-4">
        <Link href="/" className=" text-2xl font-semibold  sm:block col-span-1">
          <span className="text-blue-500 ">μ</span>Docs
        </Link>
        <div className=" col-span-3">
          <SearchBar />
        </div>
        <div className=" sm:flex gap-2 w-full hidden justify-end">
          <IconButton Icon={IoNotifications} />
          <IconButton Icon={CgProfile} />
        </div>
        <div className="sm:hidden col-span-1 flex w-full justify-end">
          <SidebarDrawer />
        </div>
      </div>
    </header>
  );
}

import { IoSearch, IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

import IconButton from "./icon-button";

export default function Header() {
  return (
    <header>
      <div className="grid grid-cols-5 px-10 lg:px-20 py-4">
        <p className=" text-2xl font-semibold"><span className="text-blue-500">μ</span>Docs</p>
        <div className=" col-span-3">
          <div className="flex max-w-xs items-center gap-2 bg-gray-800 rounded-lg px-2 py-1">
            <IoSearch />{" "}
            <input className=" outline-0" placeholder="Search..." />
          </div>
        </div>
        <div className=" flex gap-2 w-full justify-end">
          <IconButton Icon={IoNotifications} />
          <IconButton Icon={CgProfile} />
        </div>
      </div>
    </header>
  );
}

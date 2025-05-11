"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { FaBookmark } from "react-icons/fa";
import { IoIosHelpCircle } from "react-icons/io";
import { IoCloudUpload, IoHomeSharp, IoSettings } from "react-icons/io5";
import {usePathname} from "next/navigation";


const sidebarOptions = [
  {
    Icon: IoHomeSharp,
    slug: "/",
    title: "Home",
  },
  {
    Icon: FaBookmark,
    slug: "/bookmarks",
    title: "Bookmarks",
  },
  {
    Icon: IoCloudUpload,
    slug: "/upload",
    title: "Upload",
  },
  {
    Icon:IoSettings,
    slug: "/settings",
    title: "Settings",
  },
  {
    Icon: IoIosHelpCircle,
    slug: "/help",
    title: "Help",
  }
];

export default function LeftSidebar() {
   const pathname= usePathname()
    return (
    <div className=" gap-2 flex flex-col">
      {sidebarOptions.map((option) => (
        <SidebarOption
          key={option.slug}
          Icon={option.Icon}
          slug={option.slug}
          title={option.title}
          active={pathname === option.slug}
        />
      ))}
    </div>
  );
}

function SidebarOption({
  Icon,
  slug,
  title,
  active,
}: {
  Icon: IconType;
  slug: string;
  title: string;
  active: boolean;
}) {
  return (
    <Link href={slug}>
      <button
        className={` cursor-pointer hover:bg-gray-900 flex rounded-lg w-full px-2 py-1 gap-2 items-center text-white ${
          active ? "bg-gray-800" : ""
        }`}
      >
        <Icon className="w-6 min-w-6 aspect-square" />
        <p className="">{title}</p>
      </button>
    </Link>
  );
}

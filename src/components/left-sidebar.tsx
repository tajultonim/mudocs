"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { FaBookmark } from "react-icons/fa";
import { IoIosHelpCircle } from "react-icons/io";
import {
  IoCloudUpload,
  IoHomeSharp,
  IoSettings,
  IoNotifications,
} from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { usePathname } from "next/navigation";

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
    Icon: IoNotifications,
    slug: "/notifications",
    title: "Notifications",
    smallOnly: true,
  },
  {
    Icon: IoSettings,
    slug: "/settings",
    title: "Settings",
  },
  {
    Icon: CgProfile,
    slug: "/profile",
    title: "Profile",
    smallOnly: true,
  },
  {
    Icon: IoIosHelpCircle,
    slug: "/help",
    title: "Help",
  },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  return (
    <div className=" gap-2 flex flex-col ">
      {sidebarOptions.map((option) => (
        <SidebarOption
          key={option.slug}
          Icon={option.Icon}
          slug={option.slug}
          title={option.title}
          active={pathname === option.slug}
          smallOnly={option.smallOnly}
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
  smallOnly,
}: {
  Icon: IconType;
  slug: string;
  title: string;
  active: boolean;
  smallOnly?: boolean;
}) {
  return (
    <Link href={slug} className={`${smallOnly ? "sm:hidden" : ""}`}>
      <button
        className={`cursor-pointer hover:bg-gray-900 flex rounded-lg w-full p-1 px-2 gap-2 justify-start items-center text-white ${
          active ? "bg-gray-800" : ""
        }`}
        aria-label={title}
      >
        <Icon className="w-6 min-w-6 aspect-square" />
        <p className="">{title}</p>
      </button>
    </Link>
  );
}

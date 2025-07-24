"use client";

import {
  Activity,
  BadgeInfo,
  Settings2,
  Upload,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CollapsibaleSidebarMenuItem } from "./nav-main";
import Link from "next/link";

const opts = [
  {
    title: "Upload",
    slug: "/upload",
    icon: Upload,
  },
  {
    title: "Activities",
    slug: "#",
    icon: Activity,
  },
  {
    title: "Settings",
    slug: "#",
    icon: Settings2,
    options: [
      {
        title: "General",
        slug: "#",
      },
      {
        title: "Preferences",
        slug: "#",
      },
    ],
  },
  {
    title: "About",
    slug: "#",
    icon: BadgeInfo,
    options: [
      {
        title: "Help",
        slug: "#",
      },
      {
        title: "Developers",
        slug: "#",
      },
    ],
  },
];

export function NavProjects() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <SidebarMenu>
        {opts.map((item) =>
          item.options ? (
            <CollapsibaleSidebarMenuItem
              key={item.title}
              title={item.title}
              Icon={item.icon}
              options={item.options}
            />
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.slug}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// function SidebarItem({
//   title,
//   slug,
//   icon: Icon,
//   options,
// }: {
//   title: string;
//   slug: string;
//   icon: LucideIcon;
//   options?: { title: string; slug: string }[];
// }) {
//   if (!options) {
//     return (
//       <CollapsibaleSidebarMenuItem
//         key={title}
//         title={title}
//         Icon={Icon}
//         options={options}
//       />
//     );
//   }
//   return (
//     <SidebarMenuItem key={title}>
//       <SidebarMenuButton asChild>
//         <a href={slug}>
//           <Icon />
//           <span>{title}</span>
//         </a>
//       </SidebarMenuButton>
//     </SidebarMenuItem>
//   );
// }

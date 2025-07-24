"use client";

import * as React from "react";
import {
  Activity,
  BadgeInfo,
  GalleryVerticalEnd,
  GraduationCap,
  Settings2,
  Upload,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { SchemeSwitcher } from "@/components/scheme-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { exploreData } from "@/app/sidebar-data";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  schemes: [
    {
      name: "Mudocs",
      logo: GalleryVerticalEnd,
      plan: "Explore",
    },
    {
      name: "MuAcademy",
      logo: GraduationCap,
      plan: "Academic",
    },
  ],
  projects: [
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SchemeSwitcher schemes={data.schemes} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={exploreData} />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

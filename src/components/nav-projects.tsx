"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CollapsibaleSidebarMenuItem } from "./nav-main"

export function NavProjects({
  projects,
}: {
  projects: {
    title: string
    slug: string
    icon: LucideIcon
    options?: { title: string; slug: string }[];
  }[]
}) {

  return (
    <SidebarGroup >
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => item.options?(<CollapsibaleSidebarMenuItem key={item.title} title={item.title} Icon={item.icon} options={item.options} />):(
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.slug}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

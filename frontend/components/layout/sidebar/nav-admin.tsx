"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { LucideIcon } from "lucide-react";

type NavAdminProps = {
    items: {
        title: string,
        url: string,
        icon: LucideIcon
    }[]
}

export function NavAdmin({ items }: NavAdminProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Painéis Administrativos</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

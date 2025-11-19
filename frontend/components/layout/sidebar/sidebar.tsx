"use client";

import * as React from "react";

import {
  Command,
  ChartBar,
  Clipboard,
  AudioWaveform,
  GalleryVerticalEnd,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavAdmin } from "./nav-admin";
import { TeamSwitcher } from "./team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/luizobara.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Contas de Consumo",
      url: "bills",
      icon: Clipboard,
      isActive: true,
      items: [
        {
          title: "Energia",
          url: "/bills/",
        },
        {
          title: "Telefonia",
          url: "/dashboard/",
        },
        {
          title: "Água",
          url: "/",
        },
      ],
    },
  ],
};

const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: ChartBar,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavAdmin items={items}/>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

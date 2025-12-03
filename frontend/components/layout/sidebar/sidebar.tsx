"use client";

import * as React from "react";

import {
  LayoutDashboard,
  FileBarChart,
  UploadCloud,
  ListFilter,
  Settings,
  LifeBuoy,
  Receipt,
  Home,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { NavSecondary } from "./nav-secondary";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Contas e Faturas",
      url: "/bills",
      icon: Receipt,
      items: [
        {
          title: "Visão Geral",
          url: "/bills",
          icon: ListFilter
        },
        {
          title: "Novo Upload",
          url: "/bills/upload",
          icon: UploadCloud
        },
      ],
    },
    {
      title: "Relatórios",
      url: "/reports",
      icon: FileBarChart,
      items: [
        {
          title: "Consumo vs Custo",
          url: "/reports/consumption",
        },
        {
          title: "Histórico Anual",
          url: "/reports/history",
        },
      ],
    }
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Suporte",
      url: "/support",
      icon: LifeBuoy,
    },
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
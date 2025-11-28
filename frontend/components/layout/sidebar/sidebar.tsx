"use client";

import * as React from "react";

import {
  LayoutDashboard,
  Receipt,
  FileBarChart,
  Settings,
  Building2,
  GalleryVerticalEnd,
  AudioWaveform,
  UploadCloud,
  ListFilter,
  Users,
  LifeBuoy,
  Send,
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
  teams: [
    {
      name: "Minha Empresa",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Projeto Pessoal",
      logo: AudioWaveform,
      plan: "Free",
    },
  ],
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
    },
    {
      title: "Cadastros",
      url: "/register",
      icon: Building2,
      items: [
        {
          title: "Unidades / Locais",
          url: "/units",
        },
        {
          title: "Fornecedores",
          url: "/providers",
        },
      ]
    }
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Membros e Times",
      url: "/settings/team",
      icon: Users,
    },
    {
      title: "Suporte",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
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
        <TeamSwitcher teams={data.teams} />
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
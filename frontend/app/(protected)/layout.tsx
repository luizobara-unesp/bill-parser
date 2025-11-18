"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="w-full p-4">
        <SidebarTrigger/>
        <div className="flex">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
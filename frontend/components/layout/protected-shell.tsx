"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface ProtectedShellProps {
  children: ReactNode;
  defaultOpen: boolean; 
}

export function ProtectedShell({ children, defaultOpen }: ProtectedShellProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar/>
      <main className="w-full p-4">
        <SidebarTrigger/>
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/sidebar/sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SiteHeader } from "./header";

interface ProtectedShellProps {
  children: ReactNode;
  defaultOpen: boolean;
}

export function ProtectedShell({ children, defaultOpen }: ProtectedShellProps) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider defaultOpen={defaultOpen} className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="w-full p-4">
              <div className="flex flex-col gap-4">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

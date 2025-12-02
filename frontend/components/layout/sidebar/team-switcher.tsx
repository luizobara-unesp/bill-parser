"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2 } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useWorkspace } from "@/context/WorkspaceContext";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  
  const { 
      workspaces, 
      activeWorkspace, 
      setActiveWorkspace, 
      refreshWorkspaces,
      isLoading 
  } = useWorkspace();

  if (isLoading) {
      return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="h-12 w-full animate-pulse bg-sidebar-accent/50 rounded-lg" />
            </SidebarMenuItem>
        </SidebarMenu>
      )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeWorkspace?.name || "Selecione um Espaço"}
                </span>
                <span className="truncate text-xs">Free Plan</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setActiveWorkspace(workspace)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Building2 className="size-4 shrink-0" />
                </div>
                {workspace.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <CreateWorkspaceDialog onSuccess={refreshWorkspaces}>
                <DropdownMenuItem 
                    className="gap-2 p-2 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">Novo Workspace</div>
                </DropdownMenuItem>
            </CreateWorkspaceDialog>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
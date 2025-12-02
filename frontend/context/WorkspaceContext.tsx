"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyWorkspaces } from '@/services/workspaceService';
import { Workspace } from '@/types/workspace';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  setActiveWorkspace: (workspace: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const refreshWorkspaces = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const data = await getMyWorkspaces();
      setWorkspaces(data);
      
      const savedWorkspaceId = localStorage.getItem('activeWorkspaceId');
      
      if (savedWorkspaceId) {
        const found = data.find(w => w.id === Number(savedWorkspaceId));
        if (found) {
          setActiveWorkspace(found);
        } else if (data.length > 0) {
          setActiveWorkspace(data[0]);
        }
      } else if (data.length > 0) {
        setActiveWorkspace(data[0]);
      }
      
    } catch (error) {
      console.error("Erro ao carregar workspaces", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
        refreshWorkspaces();
    }
  }, [isAuthenticated]);

  const handleSetActiveWorkspace = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    localStorage.setItem('activeWorkspaceId', String(workspace.id));
  };

  return (
    <WorkspaceContext.Provider value={{ 
      workspaces, 
      activeWorkspace, 
      isLoading, 
      setActiveWorkspace: handleSetActiveWorkspace,
      refreshWorkspaces 
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace deve ser usado dentro de um WorkspaceProvider');
  }
  return context;
}
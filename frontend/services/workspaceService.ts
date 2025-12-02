import api from "@/lib/api";

import { Workspace, CreateWorkspaceRequest } from "@/types/workspace";

export const getMyWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get<Workspace[]>("/v1/workspaces");
  return response.data;
};

export const createWorkspace = async (data: CreateWorkspaceRequest): Promise<Workspace> => {
  const response = await api.post<Workspace>("/v1/workspaces", data);
  return response.data;
};
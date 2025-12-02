export interface Workspace {
  id: number;
  name: string;
  ownerId?: number;
}

export interface CreateWorkspaceRequest {
  name: string;
}
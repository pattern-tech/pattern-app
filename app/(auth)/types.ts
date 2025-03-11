export interface Workspace {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  workspace_id: string;
}

export type ApiListAllWorkspacesResponse = Workspace[];
export type ApiCreateWorkspaceResponse = Workspace;

export type ApiListAllProjectsResponse = Project[];
export type ApiCreateProjectResponse = Project;

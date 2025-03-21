import { Err, Ok, type Result } from 'ts-results-es';

import {
  createProjectInWorkspace,
  createWorkspace,
  getAllProjects,
  getAllWorkspaces,
} from './adapter';

/**
 * Checks if the default workspace and project exist, if not, creates them
 * @param accessToken
 * @returns result containing default workspace and project ids
 */
export const fetchSessionPrerequisites = async (
  accessToken: string,
): Promise<Result<[string, string], string>> => {
  const allWorkspacesResult = await getAllWorkspaces(accessToken);
  if (allWorkspacesResult.isErr()) {
    return Err(allWorkspacesResult.error);
  }

  const allWorkspaces = allWorkspacesResult.value;
  let workspace = allWorkspaces[0];

  if (!workspace) {
    const createWorkspaceResult = await createWorkspace(accessToken);
    if (createWorkspaceResult.isErr()) {
      return Err(createWorkspaceResult.error);
    }

    workspace = createWorkspaceResult.value;
  }

  const allProjectsResult = await getAllProjects(accessToken);
  if (allProjectsResult.isErr()) {
    return Err(allProjectsResult.error);
  }

  const allProjects = allProjectsResult.value;
  let project = allProjects.find(
    (project) => project.workspace_id === workspace.id,
  );
  if (!project) {
    const createProjectResult = await createProjectInWorkspace(
      accessToken,
      workspace.id,
    );
    if (createProjectResult.isErr()) {
      return Err(createProjectResult.error);
    }

    project = createProjectResult.value;
  }

  return Ok([workspace.id, project.id]);
};

import { Ok, Err, Result } from 'ts-results-es';

import { extractErrorMessageOrDefault } from '@/lib/utils';

import {
  ApiCreateProjectResponse,
  ApiCreateWorkspaceResponse,
  ApiListAllProjectsResponse,
  ApiListAllWorkspacesResponse,
} from './types';

const patternCoreEndpoint = process.env.PATTERN_CORE_ENDPOINT;
if (!patternCoreEndpoint) {
  throw new Error('PATTERN_CORE_ENDPOINT is not set');
}

/**
 * Get all workspaces
 * @param accessToken
 * @returns result containing all workspaces of current user
 */
export const getAllWorkspaces = async (
  accessToken: string,
): Promise<Result<ApiListAllWorkspacesResponse, string>> => {
  try {
    const allWorkspacesResponse = await fetch(
      `${patternCoreEndpoint}/workspace`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const allWorkspaces: ApiListAllWorkspacesResponse = (
      await allWorkspacesResponse.json()
    ).data;

    return Ok(allWorkspaces);
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Create a workspace
 * @param accessToken
 * @returns result containing the created workspace
 */
export const createWorkspace = async (
  accessToken: string,
): Promise<Result<ApiCreateWorkspaceResponse, string>> => {
  try {
    const response = await fetch(`${patternCoreEndpoint}/project`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Default Workspace',
      }),
    });
    const workspace: ApiCreateWorkspaceResponse = (await response.json()).data;

    return Ok(workspace);
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Get all projects
 * @param accessToken
 * @returns result containing all projects of current user
 */
export const getAllProjects = async (
  accessToken: string,
): Promise<Result<ApiListAllProjectsResponse, string>> => {
  try {
    const allProjectsResponse = await fetch(`${patternCoreEndpoint}/project`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    const allProjects: ApiListAllProjectsResponse = (
      await allProjectsResponse.json()
    ).data;

    return Ok(allProjects);
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Create a project in a workspace
 * @param accessToken
 * @param workspaceId
 * @returns result containing the created project
 */
export const createProjectInWorkspace = async (
  accessToken: string,
  workspaceId: string,
): Promise<Result<ApiCreateProjectResponse, string>> => {
  try {
    const response = await fetch(`${patternCoreEndpoint}/project`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Default Project',
        workspace_id: workspaceId,
      }),
    });
    const project: ApiCreateProjectResponse = (await response.json()).data;

    return Ok(project);
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

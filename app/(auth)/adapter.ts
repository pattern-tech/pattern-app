import { Ok, Err, type Result } from 'ts-results-es';

import config from '@/config';
import { extractErrorMessageOrDefault } from '@/lib/utils';

import type {
  ApiCreateProjectResponse,
  ApiCreateWorkspaceResponse,
  ApiListAllProjectsResponse,
  ApiListAllWorkspacesResponse,
} from './types';

const {
  patternCoreEndpoint: { value: patternCoreEndpoint },
} = config;

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

    if (allWorkspacesResponse.ok) {
      const allWorkspaces: ApiListAllWorkspacesResponse = (
        await allWorkspacesResponse.json()
      ).data;

      return Ok(allWorkspaces);
    }
    return Err(
      `Fetching workspaces failed with error code ${allWorkspacesResponse.status}`,
    );
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
    const response = await fetch(`${patternCoreEndpoint}/workspace`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Default Workspace',
      }),
    });

    if (response.ok) {
      const workspace: ApiCreateWorkspaceResponse = (await response.json())
        .data;

      return Ok(workspace);
    }
    return Err(`Creating workspace failed with error code ${response.status}`);
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
    if (allProjectsResponse.ok) {
      const allProjects: ApiListAllProjectsResponse = (
        await allProjectsResponse.json()
      ).data;

      return Ok(allProjects);
    }
    return Err(
      `Fetching projects failed with error code ${allProjectsResponse.status}`,
    );
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

    if (response.ok) {
      const project: ApiCreateProjectResponse = (await response.json()).data;

      return Ok(project);
    }
    return Err(`Creating project failed with error code ${response.status}`);
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

import { Ok, Err, type Result } from 'ts-results-es';

import type {
  ApiGetConversationMessagesResponse,
  ApiCreateConversationResponse,
  ApiGetConversationResponse,
  ApiSendMessageResponse,
  ApiSendMessageStreamedResponse,
  ApiGetAllConversationsResponse,
  ApiRenameConversationResponse,
} from '@/app/(chat)/types';
import config from '@/config';
import { extractErrorMessageOrDefault } from '@/lib/utils';

const {
  patternCoreEndpoint: { value: patternCoreEndpoint },
} = config;

/**
 * Get a conversation
 * @param accessToken
 * @param projectId
 * @param conversationId
 * @returns result containing the conversation
 */
export const getConversation = async (
  accessToken: string,
  projectId: string,
  conversationId: string,
): Promise<Result<ApiGetConversationResponse, string>> => {
  try {
    const conversationResponse = await fetch(
      `${patternCoreEndpoint}/playground/conversation/${projectId}/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (conversationResponse.ok) {
      const conversation: ApiGetConversationResponse = (
        await conversationResponse.json()
      ).data;

      return Ok(conversation);
    }
    if (conversationResponse.status === 404) {
      return Ok(null);
    }
    return Err(
      `Fetching conversation failed with error code ${conversationResponse.status}`,
    );
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Get messages of a conversation
 * @param accessToken
 * @param projectId
 * @param conversationId
 * @returns result containing the conversation messages
 */
export const getConversationMessages = async (
  accessToken: string,
  projectId: string,
  conversationId: string,
): Promise<Result<ApiGetConversationMessagesResponse, string>> => {
  try {
    const conversationResponse = await fetch(
      `${patternCoreEndpoint}/playground/conversation/${projectId}/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (conversationResponse.ok) {
      const conversationMessages: ApiGetConversationMessagesResponse = (
        await conversationResponse.json()
      ).metadata.history;

      return Ok(conversationMessages);
    }
    return Err(
      `Fetching conversation messages failed with error code ${conversationResponse.status}`,
    );
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Create a conversation
 * @param accessToken
 * @param projectId
 * @param conversationId
 * @returns result containing the created conversation
 */
export const createConversation = async (
  accessToken: string,
  projectId: string,
  conversationId: string,
): Promise<Result<ApiCreateConversationResponse, string>> => {
  try {
    const conversationResponse = await fetch(
      `${patternCoreEndpoint}/playground/conversation`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          /**
           * This will be updated immediately via title generation API
           */
          name: 'Default Title',
          project_id: projectId,
          conversation_id: conversationId,
        }),
      },
    );

    if (conversationResponse.ok) {
      const conversation: ApiCreateConversationResponse = (
        await conversationResponse.json()
      ).data;

      return Ok(conversation);
    }
    return Err(
      `Creating conversation failed with error code ${conversationResponse.status}`,
    );
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Send a message
 * @param accessToken
 * @param projectId
 * @param conversationId
 * @param message
 * @returns result containing model response
 */
export const sendMessage = async (
  accessToken: string,
  projectId: string,
  conversationId: string,
  message: string,
): Promise<Result<ApiSendMessageResponse, string>> => {
  try {
    const messageResponse = await fetch(
      `${patternCoreEndpoint}/playground/conversation/${projectId}/${conversationId}/chat`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          message_type: 'text',
          stream: true,
        }),
      },
    );

    if (messageResponse.ok) {
      const modelResponse: ApiSendMessageResponse = (
        await messageResponse.json()
      ).data;

      return Ok(modelResponse);
    }

    return Err(
      `Sending message failed with error code ${messageResponse.status}`,
    );
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Send a message and return a stream
 * @param accessToken
 * @param projectId
 * @param conversationId
 * @param message
 * @returns result containing the readable stream of response
 */
export const sendMessageStreamed = async (
  accessToken: string,
  projectId: string,
  conversationId: string,
  message: string,
): Promise<Result<ApiSendMessageStreamedResponse, string>> => {
  try {
    const messageResponse = await fetch(
      `${patternCoreEndpoint}/playground/conversation/${projectId}/${conversationId}/chat`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          message_type: 'text',
          stream: true,
        }),
      },
    );

    if (messageResponse.ok) {
      const responseStream = messageResponse.body;

      return responseStream
        ? Ok(messageResponse.body)
        : Err('Message was sent but stream object is null');
    }

    return Err(
      `Sending message failed with error code ${messageResponse.status}`,
    );
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Get all conversations
 * @param accessToken
 * @param projectId
 * @returns result containing all conversations of current user
 */
export const getAllConversations = async (
  accessToken: string,
  projectId: string,
): Promise<Result<ApiGetAllConversationsResponse, string>> => {
  try {
    const allConversationsResponse = await fetch(
      `${patternCoreEndpoint}/playground/conversation/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (allConversationsResponse.ok) {
      const allConversations: ApiGetAllConversationsResponse = (
        await allConversationsResponse.json()
      ).data;

      return Ok(allConversations);
    }
    return Err(
      `Fetching projects failed with error code ${allConversationsResponse.status}`,
    );
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

/**
 * Rename a conversation title based on a message
 * @param accessToken
 * @param projectId
 * @param conversationId
 * @param message
 * @returns result containing updated title
 */
export const renameConversation = async (
  accessToken: string,
  projectId: string,
  conversationId: string,
  message: string,
): Promise<Result<ApiRenameConversationResponse, string>> => {
  try {
    const renameResponse = await fetch(
      `${patternCoreEndpoint}/playground/conversation/${projectId}/${conversationId}/title-generation`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      },
    );

    if (renameResponse.ok) {
      const result: ApiRenameConversationResponse = (
        await renameResponse.json()
      ).data;

      return Ok(result);
    }
    return Err(
      `Renaming conversation failed with error code ${renameResponse.status}`,
    );
  } catch (error) {
    return Err(extractErrorMessageOrDefault(error));
  }
};

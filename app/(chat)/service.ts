import { type Result, Err, Ok } from 'ts-results-es';

import { createConversation, getConversation } from './adapter';
import type { Conversation } from './types';

/**
 * Checks if the conversation exists and returns it, otherwise creates it
 * @param accessToken
 * @returns result containing the existing or created conversation
 */
export const getOrCreateConversation = async (
  accessToken: string,
  projectId: string,
  conversationId: string,
): Promise<Result<Conversation, string>> => {
  const conversationResult = await getConversation(
    accessToken,
    projectId,
    conversationId,
  );
  if (conversationResult.isErr()) {
    return Err(conversationResult.error);
  }

  let conversation = conversationResult.value;

  if (!conversation) {
    const createConversationResult = await createConversation(
      accessToken,
      projectId,
      conversationId,
      'Default Title',
    );
    if (createConversationResult.isErr()) {
      return Err(createConversationResult.error);
    }

    conversation = createConversationResult.value;
  }

  return Ok(conversation);
};

export {
  sendMessage,
  sendMessageStreamed,
  getConversation,
  getConversationMessages,
} from './adapter';

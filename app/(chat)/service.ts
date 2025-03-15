import { type Result, Err, Ok } from 'ts-results-es';

import type { Chat } from '@/lib/db/schema';

import {
  createConversation,
  getAllConversations,
  getConversation,
} from './adapter';
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

/**
 * fetches all of current user's conversations and transforms it into
 * ui-friendly chats
 * @param accessToken
 * @param projectId
 * @returns result containing ui-friendly chats list
 */
export const getAllChats = async (
  accessToken: string,
  projectId: string,
): Promise<Result<Chat[], string>> => {
  const allConversationsResult = await getAllConversations(
    accessToken,
    projectId,
  );

  if (allConversationsResult.isErr()) {
    return Err(allConversationsResult.error);
  }

  const allConversations = allConversationsResult.value;

  const history: Chat[] = allConversations.map((conversation) => ({
    createdAt: new Date(conversation.updated_at),
    id: conversation.id,
    title: conversation.name,
    userId: conversation.user_id,
    visibility: 'private',
  }));

  return Ok(history);
};

export {
  sendMessage,
  sendMessageStreamed,
  getConversation,
  getConversationMessages,
} from './adapter';

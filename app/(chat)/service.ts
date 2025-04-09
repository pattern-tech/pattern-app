import { type Result, Err, Ok } from 'ts-results-es';

import type { Chat } from '@/lib/db/schema';

import {
  createConversation,
  renameConversation,
  getConversation,
  getAllConversations,
  getQueryUsage as getQueryUsageAdapter,
} from './adapter';
import type { Conversation } from './types';

/**
 * Checks if the conversation exists and returns it, otherwise creates it
 * @param accessToken
 * @param projectId
 * @param conversationId
 * @param initialMessage
 * @returns result containing the existing or created conversation
 */
export const getOrCreateConversation = async (
  accessToken: string,
  projectId: string,
  conversationId: string,
  initialMessage: string,
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
    );
    if (createConversationResult.isErr()) {
      return Err(createConversationResult.error);
    }

    conversation = createConversationResult.value;

    /**
     * We don't care if the renaming process is successful. It may fail and the
     * conversation will keep the default title
     */
    await renameConversation(
      accessToken,
      projectId,
      conversationId,
      initialMessage,
    );
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

/**
 * Get query usage
 * @param accessToken
 * @returns result containing query usage
 */
export const getQueryUsage = async (
  accessToken: string,
): Promise<
  Result<
    {
      todayQueryCount: number;
      remainingQueriesToday: number;
      maxQueryAllowancePerDay: number;
      nextResetTime: string;
    },
    string
  >
> => {
  const result = await getQueryUsageAdapter(accessToken);

  if (result.isErr()) {
    return Err(result.error);
  }

  const {
    today_query_count,
    remaining_queries_today,
    max_query_allowance_per_day,
    next_reset_time,
  } = result.value;

  return Ok({
    todayQueryCount: today_query_count,
    remainingQueriesToday: remaining_queries_today,
    maxQueryAllowancePerDay: max_query_allowance_per_day,
    nextResetTime: next_reset_time,
  });
};

export {
  sendMessage,
  sendMessageStreamed,
  getConversation,
  getConversationMessages,
} from './adapter';

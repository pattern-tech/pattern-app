import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { patternProvider } from '@/lib/ai/pattern-provider';
import { deleteChatById, getChatById } from '@/lib/db/queries';
import { generateUUID, getMostRecentUserMessage } from '@/lib/utils';

import { getOrCreateConversation } from '../../service';

export const maxDuration = 300;

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (
    !session ||
    !session.chainId ||
    !session.address ||
    !session.accessToken
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const conversationResult = await getOrCreateConversation(
    session.accessToken,
    session.projectId,
    id,
    userMessage.content,
  );

  if (conversationResult.isErr()) {
    return new Response(conversationResult.error, { status: 400 });
  }

  const conversation = conversationResult.value;

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: patternProvider(),
        messages,
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        providerOptions: {
          pattern: {
            conversationId: conversation.id,
            accessToken: session.accessToken,
            projectId: session.projectId,
          },
        },
      });

      result.consumeStream();

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: () => {
      return 'Oops, an error occured!';
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}

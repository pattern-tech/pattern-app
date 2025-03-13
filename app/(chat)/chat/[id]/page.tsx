import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { convertToUIMessages } from '@/lib/utils';

import { getConversation, getConversationMessages } from '../../service';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();

  if (
    !session ||
    !session.chainId ||
    !session.address ||
    !session.accessToken
  ) {
    return notFound();
  }

  const { id } = params;
  const chatResult = await getConversation(
    session.accessToken,
    session.projectId,
    id,
  );

  if (chatResult.isErr()) {
    return chatResult.unwrap();
  }

  const chat = chatResult.value;
  if (!chat) {
    return notFound();
  }

  const messagesResult = await getConversationMessages(
    session.accessToken,
    session.projectId,
    id,
  );

  if (messagesResult.isErr()) {
    return messagesResult.unwrap();
  }

  const messages = messagesResult.value;

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messages)}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}

import { auth } from '@/app/(auth)/auth';

import { getAllChats } from '../../service';

export async function GET() {
  const session = await auth();

  if (
    !session ||
    !session.chainId ||
    !session.address ||
    !session.accessToken
  ) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const chatsResult = await getAllChats(session.accessToken, session.projectId);

  if (chatsResult.isErr()) {
    return new Response(chatsResult.error, { status: 400 });
  }

  const allChats = chatsResult.value;

  return Response.json(allChats);
}

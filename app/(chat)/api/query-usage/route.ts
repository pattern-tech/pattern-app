import { auth } from '@/app/(auth)/auth';

import { getQueryUsage } from '../../service';

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

  const queryUsageResult = await getQueryUsage(session.accessToken);

  if (queryUsageResult.isErr()) {
    return new Response(queryUsageResult.error, { status: 400 });
  }

  const queryUsage = queryUsageResult.value;

  return Response.json(queryUsage);
}

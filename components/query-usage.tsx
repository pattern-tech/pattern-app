'use client';

import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import type { QueryUsage as QueryUsageType } from '@/app/(chat)/types';
import { fetcher } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function QueryUsage() {
  const { status } = useSession();
  const { data, isLoading } = useSWR<QueryUsageType>(
    status === 'authenticated' ? '/api/query-usage' : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  if (status !== 'authenticated') return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="size-4 animate-pulse rounded-full bg-muted" />
        <span>Loading usage...</span>
      </div>
    );
  }

  if (!data) return null;

  const {
    todayQueryCount,
    remainingQueriesToday,
    maxQueryAllowancePerDay,
    nextResetTime,
  } = data;

  const resetTime = formatDistanceToNow(new Date(nextResetTime), {
    addSuffix: true,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-between text-sm cursor-pointer border rounded-md px-2 py-1 dark:border-zinc-700">
          <span className="text-muted-foreground mr-2">Credits</span>
          <span className="font-medium">
            {remainingQueriesToday} / {maxQueryAllowancePerDay}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Used today:</span>
            <span className="font-medium">{todayQueryCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Resets:</span>
            <span className="font-medium">{resetTime}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

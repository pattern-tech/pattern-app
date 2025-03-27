'use client';

import type { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { motion } from 'framer-motion';
import { memo } from 'react';

import { Button } from './ui/button';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Which functions should I call to',
      label: 'transfer USDC with the following contract?',
      action:
        'Which functions should I call to transfer USDC with the following contract? [0x43506849d7c04f9138d1a2050bbf3a0c054402dd]',
    },
    {
      title: 'According to details of this transaction',
      label: 'what do you think is this about in one paragraph?',
      action: `According to details of this transaction what do you think is this about in one paragraph? [0x479635fa05bf2fecd6fdbb2ced34dcd53b0be323ee4086972617ed7711bbc5f2]`,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);

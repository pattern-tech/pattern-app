'use client';

import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { type State, WagmiProvider } from 'wagmi';

import config from '@/config/config-client-only';

import { chains, metadata, siweConfig, wagmiAdapter } from '../config';

const queryClient = new QueryClient();

const {
  walletConnectProjectId: { value: walletConnectProjectId },
} = config;

createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  projectId: walletConnectProjectId,
  siweConfig,
  metadata,
  features: {
    email: false,
    socials: ['google'],
    send: false,
    swaps: false,
    onramp: false,
    history: false,
  },
  tokens: {
    // MOR on Base
    'eip155:8453': {
      address: '0x7431ada8a591c955a994a21710752ef9b882b8e3',
    },
    // MOR on Arbitrum
    'eip155:42161': {
      address: '0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86',
    },
  },
  themeVariables: {
    '--w3m-accent': 'hsl(var(--primary))',
  },
});

export default function AppKitProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

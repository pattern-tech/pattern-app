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
    socials: false,
    send: false,
    swaps: false,
    onramp: false,
    history: false,
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

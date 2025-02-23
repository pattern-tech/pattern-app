"use client";

import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { State, WagmiProvider } from "wagmi";

import {
  chains,
  metadata,
  projectId,
  siweConfig,
  wagmiAdapter,
} from "../config";

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  projectId,
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

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  type SIWECreateMessageArgs,
  type SIWESession,
  type SIWEVerifyMessageArgs,
  createSIWEConfig,
  formatMessage,
} from "@reown/appkit-siwe";
import {
  AppKitNetwork,
  arbitrum,
  base,
  mainnet,
  optimism,
} from "@reown/appkit/networks";
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";
import { getAddress } from "viem";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
  name: "Pattern",
  description: "Pattern is a decentralized agentic RAG network",
  url: "https://pattern.global/",
  icons: ["https://avatars.githubusercontent.com/u/112399339"],
};

export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  base,
  arbitrum,
  optimism,
];

export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  ssr: true,
});

const normalizeAddress = (address: string): string => {
  try {
    const splitAddress = address.split(":");
    const extractedAddress = splitAddress[splitAddress.length - 1];
    const checksumAddress = getAddress(extractedAddress);
    splitAddress[splitAddress.length - 1] = checksumAddress;
    const normalizedAddress = splitAddress.join(":");

    return normalizedAddress;
  } catch (error) {
    return address;
  }
};

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: chains.map((chain: AppKitNetwork) => parseInt(chain.id.toString())),
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, normalizeAddress(address)),
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      throw new Error("Failed to get nonce!");
    }

    return nonce;
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) {
      return null;
    }

    // Validate address and chainId types
    if (
      typeof session.address !== "string" ||
      typeof session.chainId !== "number"
    ) {
      return null;
    }

    return {
      address: session.address,
      chainId: session.chainId,
    } satisfies SIWESession;
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn("credentials", {
        message,
        redirect: false,
        signature,
        callbackUrl: "/protected",
      });

      return Boolean(success?.ok);
    } catch (error) {
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: false,
      });

      return true;
    } catch (error) {
      return false;
    }
  },
});

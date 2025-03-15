import {
  getAddressFromMessage,
  getChainIdFromMessage,
} from '@reown/appkit-siwe';
import NextAuth from 'next-auth';
import 'next-auth/jwt';
import credentialsProvider from 'next-auth/providers/credentials';

import { authConfig } from './auth.config';

/**
 * TODO: Move all configs into a validated configs module to avoid duplication
 *
 * https://github.com/pattern-tech/pattern-app/issues/3
 */
export const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

const patternCoreEndpoint = process.env.PATTERN_CORE_ENDPOINT;
if (!patternCoreEndpoint) {
  throw new Error('PATTERN_CORE_ENDPOINT is not set');
}
const siweVerificationApi = `${patternCoreEndpoint}/auth/verify`;

const providers = [
  credentialsProvider({
    name: 'Ethereum',
    credentials: {
      message: {
        label: 'Message',
        type: 'text',
        placeholder: '0x0',
      },
      signature: {
        label: 'Signature',
        type: 'text',
        placeholder: '0x0',
      },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.message) {
          throw new Error('SiweMessage is undefined');
        }
        const { message, signature } = credentials as Record<string, string>;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        const response = await fetch(siweVerificationApi, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            signature,
          }),
        });

        if (response.ok) {
          const {
            data: { access_token: accessToken },
          } = await response.json();

          if (accessToken) {
            return {
              id: `${chainId}:${address}`,
              accessToken,
            };
          }
        }

        /**
         * TODO: Handle errors accordingly, and show the user what went wrong
         *
         * https://github.com/pattern-tech/pattern-app/issues/4
         */

        return null;
      } catch (e) {
        return null;
      }
    },
  }),
];

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers,
});

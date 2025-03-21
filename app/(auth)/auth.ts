import {
  getAddressFromMessage,
  getChainIdFromMessage,
} from '@reown/appkit-siwe';
import NextAuth from 'next-auth';
import 'next-auth/jwt';
import credentialsProvider from 'next-auth/providers/credentials';

import config from '@/config';

import { authConfig } from './auth.config';

const {
  patternCoreEndpoint: { value: patternCoreEndpoint },
} = config;

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

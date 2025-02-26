import type { SIWESession } from '@reown/appkit-siwe';
import type { NextAuthConfig } from 'next-auth';

declare module 'next-auth' {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
    accessToken: string;
  }
  interface User {
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    wrappedJWT: string;
  }
}

export const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

export const authConfig = {
  secret: nextAuthSecret,
  providers: [],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ trigger, token, user }) {
      /**
       * On sign in or sign up, we wrap the main JWT returned by the core
       * service in another JWT that is managed by Authjs.
       */
      if (trigger === 'signIn' || trigger === 'signUp') {
        return {
          ...token,
          wrappedJWT: user.accessToken,
        };
      }
      return token;
    },
    session({ session, token }) {
      if (!token.sub) {
        return session;
      }

      const [, chainId, address] = token.sub.split(':');
      const wrappedJWT = token.wrappedJWT;
      if (chainId && address && wrappedJWT) {
        /**
         * The following are added to session so that we know the user through
         * the address and chainId, and can make requests to the core service
         * using the access token
         */
        session.address = address;
        session.chainId = Number.parseInt(chainId, 10);
        session.accessToken = wrappedJWT;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

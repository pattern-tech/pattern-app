import type { NextConfig } from 'next';
import { withAxiom } from 'next-axiom';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' https://secure-mobile.walletconnect.com https://secure-mobile.walletconnect.org https://secure.walletconnect.org",
          },
        ],
      },
    ];
  },
};

export default withAxiom(nextConfig);

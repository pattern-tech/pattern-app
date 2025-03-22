import { NonEmptyString } from './NonEmptyString';

interface PatternUiConfigClientOnly {
  walletConnectProjectId: NonEmptyString;
}

const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const config: PatternUiConfigClientOnly = {
  walletConnectProjectId: NonEmptyString.parse(
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  ),
};

export default config;

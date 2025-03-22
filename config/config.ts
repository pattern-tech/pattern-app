import 'server-only';

import { BooleanString } from './BooleanString';
import { NonEmptyString } from './NonEmptyString';
import { PatternCoreEndpoint } from './PatternCoreEndpoint';

interface PatternUiConfig {
  nextAuth: {
    secret: NonEmptyString;
    trustHost: BooleanString;
  };
  patternCoreEndpoint: PatternCoreEndpoint;
}

const { NEXTAUTH_SECRET, PATTERN_CORE_ENDPOINT, AUTH_TRUST_HOST } = process.env;

const config: PatternUiConfig = {
  nextAuth: {
    secret: NonEmptyString.parse(NEXTAUTH_SECRET),
    trustHost: BooleanString.parse(AUTH_TRUST_HOST),
  },
  patternCoreEndpoint: PatternCoreEndpoint.parse(PATTERN_CORE_ENDPOINT),
};

export default config;

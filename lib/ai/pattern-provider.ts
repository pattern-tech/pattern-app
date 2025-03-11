import { PatternModel } from './pattern-model';

export type PatternProvider = () => PatternModel

export function createPatternProvider(): PatternProvider {
  const createModel = () => new PatternModel();

  const provider = function () {
    if (new.target) {
      throw new Error(
        'The model factory function cannot be called with the new keyword.',
      );
    }

    return createModel();
  };

  provider.chat = createModel;

  return provider;
}

export const patternProvider = createPatternProvider();

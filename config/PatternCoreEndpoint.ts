export class PatternCoreEndpoint {
  private constructor(public value: string) {}

  static parse(value: string | undefined): PatternCoreEndpoint {
    if (!value) {
      throw new Error(`Cannot parse "${value}" as PatternCoreEndpoint`);
    }
    try {
      new URL(value);
      return new PatternCoreEndpoint(value);
    } catch (error) {
      throw new Error(`Cannot parse "${value}" as PatternCoreEndpoint`);
    }
  }
}

export class NonEmptyString {
  private constructor(public value: string) {}

  static parse(value: string | undefined): NonEmptyString {
    if (value) {
      return new NonEmptyString(value);
    }
    throw new Error(`Cannot parse "${value}" as NonEmptyString`);
  }
}

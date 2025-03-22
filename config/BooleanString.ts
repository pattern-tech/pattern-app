export class BooleanString {
  private constructor(public value: boolean) {}

  static parse(value: string | undefined): BooleanString {
    if (value === 'true') {
      return new BooleanString(true);
    }
    if (value === 'false') {
      return new BooleanString(false);
    }
    throw new Error(`Cannot parse "${value}" as BooleanString`);
  }
}

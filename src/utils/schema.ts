import Ajv from 'ajv';
import { expect } from '@playwright/test';
const ajv = new Ajv({ allErrors: true });
export function expectSchema(schema: object, body: unknown): void {
  const validate = ajv.compile(schema);
  expect(validate(body), JSON.stringify(validate.errors, null, 2)).toBe(true);
}

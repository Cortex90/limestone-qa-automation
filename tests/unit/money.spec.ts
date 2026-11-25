import { expect, test } from '@playwright/test';
import { cents } from '../../src/utils/money';

test('parses item prices and checkout summary amounts into integer cents', () => {
  const examples = [
    ['$0.00', 0],
    ['$0.07', 7],
    ['$29.99', 2999],
    ['Item total: $39.98', 3998],
    ['Tax: $3.20', 320],
    ['Total: $43.18', 4318],
  ] as const;

  for (const [display, expectedCents] of examples) {
    expect(cents(display), display).toBe(expectedCents);
  }
});

test('rejects negative, malformed, and incorrectly labeled amounts', () => {
  const invalidDisplays = [
    '-$49.99', 'Total: -$49.99', '$-49.99',
    '', '49.99', '$.99', '$01.00', '$1', '$1.0', '$1.001', '$1,00',
    '$49.99oops', '$1.00 $2.00', '$1.00\n',
    'Subtotal: $1.00', 'USD $1.00', 'Total: Tax: $1.00',
    '$90071992547409.92',
  ];

  for (const display of invalidDisplays) {
    expect(() => cents(display), JSON.stringify(display)).toThrow(/Invalid USD amount/);
  }
});

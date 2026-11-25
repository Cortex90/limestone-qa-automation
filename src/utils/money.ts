const displayedAmount = /^(?:(?:Item total|Tax|Total): )?\$(0|[1-9]\d*)\.(\d{2})$/;

export function cents(text: string): number {
  const match = displayedAmount.exec(text);
  if (match) {
    const [, dollars, centDigits] = match;
    const amount = Number(dollars + centDigits);
    if (Number.isSafeInteger(amount)) return amount;
  }

  throw new Error(`Invalid USD amount: ${JSON.stringify(text)}`);
}

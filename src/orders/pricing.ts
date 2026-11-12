export interface LineItem {
  sku: string;
  unitPriceCents: number;
  quantity: number;
}

export const TAX_RATE = 0.23;

export function subtotalCents(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
}

export function taxCents(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE);
}

export function totalCents(items: LineItem[]): number {
  const subtotal = subtotalCents(items);
  return subtotal + taxCents(subtotal);
}

import { subtotalCents, type LineItem } from "./pricing.js";

export const SHIPPING_CENTS = 999;
export const FREE_SHIPPING_FROM = 50; // dollars

// Orders of $50 or more ship for free.
export function shippingCents(items: LineItem[]): number {
  return subtotalCents(items) >= FREE_SHIPPING_FROM ? 0 : SHIPPING_CENTS;
}

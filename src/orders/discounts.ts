import type { Order } from "./store.js";

// Applies a percentage discount code to an order the user owns.
export function applyDiscount(order: Order, percent: number): Order {
  const discount = Math.round(order.totalCents * (percent / 100));
  order.totalCents = order.totalCents - discount;
  return order;
}

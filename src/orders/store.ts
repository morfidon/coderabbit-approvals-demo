import { totalCents, type LineItem } from "./pricing.js";

export interface Order {
  id: number;
  userId: string;
  items: LineItem[];
  totalCents: number;
  status: "new" | "paid" | "cancelled";
}

let nextId = 1;
const orders: Order[] = [];

export function createOrder(userId: string, items: LineItem[]): Order {
  const order: Order = { id: nextId++, userId, items, totalCents: totalCents(items), status: "new" };
  orders.push(order);
  return order;
}

export function ordersFor(userId: string): Order[] {
  return orders.filter((o) => o.userId === userId);
}

export function allOrders(): Order[] {
  return [...orders];
}

export function resetOrders() {
  orders.length = 0;
  nextId = 1;
}

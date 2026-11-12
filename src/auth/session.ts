import type { Request } from "express";

export type Role = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  role: Role;
}

// Demo tokens. A real app would look these up in a session store.
const sessions = new Map<string, User>([
  ["token-alice", { id: "u1", name: "Alice", role: "customer" }],
  ["token-bob", { id: "u2", name: "Bob", role: "customer" }],
  ["token-admin", { id: "u0", name: "Admin", role: "admin" }],
]);

export function currentUser(req: Request): User | null {
  const header = req.header("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return sessions.get(token) ?? null;
}

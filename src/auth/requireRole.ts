import type { NextFunction, Request, Response } from "express";
import { currentUser, type Role, type User } from "./session.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = currentUser(req);
  if (!user) {
    res.status(401).json({ error: "Sign in first." });
    return;
  }
  req.user = user;
  next();
}

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = currentUser(req);
    if (!user) {
      res.status(401).json({ error: "Sign in first." });
      return;
    }
    if (user.role !== role) {
      res.status(403).json({ error: "You can't do that." });
      return;
    }
    req.user = user;
    next();
  };
}

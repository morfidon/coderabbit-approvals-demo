import express from "express";
import { requireRole, requireUser } from "./auth/requireRole.js";
import { allOrders, createOrder, ordersFor } from "./orders/store.js";
import { applyDiscount } from "./orders/discounts.js";
import type { LineItem } from "./orders/pricing.js";
import { labels } from "./ui-text/labels.js";

function isLineItem(value: unknown): value is LineItem {
  const v = value as LineItem;
  return (
    typeof v?.sku === "string" &&
    Number.isInteger(v.unitPriceCents) && v.unitPriceCents >= 0 &&
    Number.isInteger(v.quantity) && v.quantity > 0
  );
}

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/labels", (_req, res) => {
    res.json(labels);
  });

  app.get("/orders", requireUser, (req, res) => {
    res.json(ordersFor(req.user!.id));
  });

  app.post("/orders", requireUser, (req, res) => {
    const items: unknown = req.body?.items;
    if (!Array.isArray(items) || items.length === 0 || !items.every(isLineItem)) {
      res.status(400).json({ error: "Send at least one valid item." });
      return;
    }
    res.status(201).json(createOrder(req.user!.id, items));
  });

  app.post("/orders/:id/discount", requireUser, (req, res) => {
    const order = ordersFor(req.user!.id).find((o) => o.id === Number(req.params.id));
    if (!order) {
      res.status(404).json({ error: "Order not found." });
      return;
    }
    res.json(applyDiscount(order, Number(req.body?.percent)));
  });

  app.get("/admin/orders", requireRole("admin"), (_req, res) => {
    res.json(allOrders());
  });

  return app;
}

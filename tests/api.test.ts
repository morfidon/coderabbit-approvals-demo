import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { resetOrders } from "../src/orders/store.js";

const app = createApp();
const alice = { Authorization: "Bearer token-alice" };
const admin = { Authorization: "Bearer token-admin" };

beforeEach(() => resetOrders());

describe("orders API", () => {
  it("needs a signed-in user", async () => {
    await request(app).get("/orders").expect(401);
  });

  it("creates an order with the right total", async () => {
    const res = await request(app)
      .post("/orders")
      .set(alice)
      .send({ items: [{ sku: "mug", unitPriceCents: 1500, quantity: 2 }] })
      .expect(201);
    expect(res.body.totalCents).toBe(3690);
  });

  it("rejects an empty cart", async () => {
    await request(app).post("/orders").set(alice).send({ items: [] }).expect(400);
  });

  it("shows only your own orders", async () => {
    await request(app)
      .post("/orders")
      .set(alice)
      .send({ items: [{ sku: "mug", unitPriceCents: 1500, quantity: 1 }] });
    const bob = await request(app).get("/orders").set({ Authorization: "Bearer token-bob" }).expect(200);
    expect(bob.body).toEqual([]);
  });

  it("keeps the admin list for admins", async () => {
    await request(app).get("/admin/orders").set(alice).expect(403);
    await request(app).get("/admin/orders").set(admin).expect(200);
  });
});

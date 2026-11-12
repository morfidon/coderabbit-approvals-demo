import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { resetOrders } from "../src/orders/store.js";

const app = createApp();
const alice = { Authorization: "Bearer token-alice" };

beforeEach(() => resetOrders());

describe("discounts", () => {
  it("takes 10% off an order", async () => {
    await request(app)
      .post("/orders")
      .set(alice)
      .send({ items: [{ sku: "mug", unitPriceCents: 1500, quantity: 2 }] });
    const res = await request(app).post("/orders/1/discount").set(alice).send({ percent: 10 }).expect(200);
    expect(res.body.totalCents).toBe(3321);
  });
});

import { describe, expect, it } from "vitest";
import { subtotalCents, taxCents, totalCents } from "../src/orders/pricing.js";

describe("pricing", () => {
  const items = [
    { sku: "mug", unitPriceCents: 1500, quantity: 2 },
    { sku: "tee", unitPriceCents: 2999, quantity: 1 },
  ];

  it("adds line items", () => {
    expect(subtotalCents(items)).toBe(5999);
  });

  it("rounds tax to whole cents", () => {
    expect(taxCents(5999)).toBe(1380);
  });

  it("adds tax to the total", () => {
    expect(totalCents(items)).toBe(7379);
  });
});

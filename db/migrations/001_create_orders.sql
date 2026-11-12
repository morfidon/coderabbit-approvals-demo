CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT        NOT NULL,
  total_cents INTEGER     NOT NULL CHECK (total_cents >= 0),
  status      TEXT        NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  order_id         INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku              TEXT    NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity         INTEGER NOT NULL CHECK (quantity > 0)
);

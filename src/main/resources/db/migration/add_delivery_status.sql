
ALTER TABLE orders ADD COLUMN delivery_status VARCHAR(50) DEFAULT 'PENDING';

UPDATE orders SET delivery_status = 'DELIVERED' WHERE status = 'PAID';

COMMENT ON COLUMN orders.delivery_status IS 'Tracks order delivery progress: PENDING, SHIPPED, DELIVERED, CANCELLED';

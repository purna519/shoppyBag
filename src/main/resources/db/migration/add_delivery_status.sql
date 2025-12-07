-- Add delivery_status column to orders table
ALTER TABLE orders ADD COLUMN delivery_status VARCHAR(50) DEFAULT 'PENDING';

-- Set existing orders to DELIVERED if they are paid (for testing reviews)
-- You can adjust this based on your actual order states
UPDATE orders SET delivery_status = 'DELIVERED' WHERE status = 'PAID';

-- Optional: Add comment to document column purpose
COMMENT ON COLUMN orders.delivery_status IS 'Tracks order delivery progress: PENDING, SHIPPED, DELIVERED, CANCELLED';

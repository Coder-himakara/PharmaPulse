ALTER TABLE sales_invoices
    ADD discount_amount DECIMAL;

ALTER TABLE sales_invoices
    ADD invoice_no VARCHAR(255);

ALTER TABLE sales_invoices
    ADD invoice_status VARCHAR(255);

ALTER TABLE sales_invoices
    ADD net_amount DECIMAL;

ALTER TABLE sales_invoices
    ADD payment_type VARCHAR(255);

ALTER TABLE sales_invoices
    DROP COLUMN invoice_number;

ALTER TABLE sales_invoices
    DROP COLUMN total_discount;

ALTER TABLE customer
    ALTER COLUMN customer_group_id SET NOT NULL;

ALTER TABLE order_items
    ALTER COLUMN discount TYPE DECIMAL USING (discount::DECIMAL);

ALTER TABLE sales_invoice_items
    ALTER COLUMN discount TYPE DECIMAL USING (discount::DECIMAL);

ALTER TABLE order_items
    ALTER COLUMN line_total TYPE DECIMAL USING (line_total::DECIMAL);

ALTER TABLE sales_invoice_items
    ALTER COLUMN line_total TYPE DECIMAL USING (line_total::DECIMAL);

ALTER TABLE inventory_reservation
    ALTER COLUMN order_id DROP NOT NULL;

ALTER TABLE inventory_reservation
    ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE order_items
    ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE sales_invoice_items
    ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE order_items
    ALTER COLUMN quantity DROP NOT NULL;

ALTER TABLE sales_invoice_items
    ALTER COLUMN quantity DROP NOT NULL;

ALTER TABLE inventory_reservation
    ALTER COLUMN reservation_time DROP NOT NULL;

ALTER TABLE inventory_reservation
    ALTER COLUMN reserved_quantity DROP NOT NULL;

ALTER TABLE orders
    ALTER COLUMN status TYPE VARCHAR(255) USING (status::VARCHAR(255));

ALTER TABLE orders
    ALTER COLUMN total_amount TYPE DECIMAL USING (total_amount::DECIMAL);

ALTER TABLE sales_invoices
    ALTER COLUMN total_amount TYPE DECIMAL USING (total_amount::DECIMAL);

ALTER TABLE orders
    ALTER COLUMN total_discount TYPE DECIMAL USING (total_discount::DECIMAL);

ALTER TABLE order_items
    ALTER COLUMN unit_price TYPE DECIMAL USING (unit_price::DECIMAL);

ALTER TABLE sales_invoice_items
    ALTER COLUMN unit_price TYPE DECIMAL USING (unit_price::DECIMAL);

ALTER TABLE price_list
    ALTER COLUMN wholesale_price TYPE DECIMAL USING (wholesale_price::DECIMAL);

ALTER TABLE sales_invoices
    ADD CONSTRAINT FK_SALE_INVOICE_ON_CUSTOMER FOREIGN KEY (customer_id) REFERENCES customer (customer_id);
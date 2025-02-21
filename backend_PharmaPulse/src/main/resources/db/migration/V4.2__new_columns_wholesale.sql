ALTER TABLE batch_inventory
    ADD free_quantity INTEGER;

ALTER TABLE batch_inventory
    ADD wholesale_price DECIMAL;

ALTER TABLE purchase_line_item
    ADD retail_price DECIMAL;

ALTER TABLE purchase_line_item
    ADD total_price DECIMAL;

ALTER TABLE product_wholesale_price
    ADD wholesale_price DECIMAL;

ALTER TABLE product_wholesale_price
    ALTER COLUMN wholesale_price SET NOT NULL;

ALTER TABLE batch_inventory
    DROP COLUMN cost_per_unit;

ALTER TABLE purchase_line_item
    DROP COLUMN cost_per_unit;

ALTER TABLE purchase_line_item
    DROP COLUMN total_cost;

ALTER TABLE product_wholesale_price
    DROP COLUMN retail_price;
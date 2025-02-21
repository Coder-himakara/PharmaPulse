ALTER TABLE purchase_line_item
    ADD quantity INTEGER;

ALTER TABLE purchase_line_item
    DROP COLUMN conversion_factor;

ALTER TABLE purchase_line_item
    DROP COLUMN quantity_by_package;
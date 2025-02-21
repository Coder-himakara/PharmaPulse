ALTER TABLE batch_inventory
    DROP CONSTRAINT fk_batch_inventory_on_product;

ALTER TABLE batch_inventory
    DROP CONSTRAINT fk_batch_inventory_on_purchase_invoice;

ALTER TABLE product
    DROP CONSTRAINT fk_product_on_purchase_group;

ALTER TABLE product_retail_price
    DROP CONSTRAINT fk_product_retailprice_on_product;

ALTER TABLE purchase_invoice
    DROP CONSTRAINT fk_purchase_invoice_on_supplier;

ALTER TABLE purchase_line_item
    DROP CONSTRAINT fk_purchase_line_item_on_purchase_invoice;

CREATE TABLE product_wholesale_price
(
    price_id       BIGINT                      NOT NULL,
    product_id     BIGINT                      NOT NULL,
    created_by     VARCHAR(255)                NOT NULL,
    effective_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_date       TIMESTAMP WITHOUT TIME ZONE,
    retail_price   DECIMAL                     NOT NULL,
    CONSTRAINT pk_product_wholesale_price PRIMARY KEY (price_id)
);

CREATE TABLE supplier_product_sequence
(
    supplier_id      BIGINT NOT NULL,
    current_sequence INTEGER,
    CONSTRAINT pk_supplier_product_sequence PRIMARY KEY (supplier_id)
);

ALTER TABLE product
    ADD product_ref_id VARCHAR(255);

ALTER TABLE product
    ADD reorder_limit_by_package INTEGER;

ALTER TABLE product
    ADD units_per_pack VARCHAR(255);

ALTER TABLE product
    ALTER COLUMN product_ref_id SET NOT NULL;

ALTER TABLE product
    ADD CONSTRAINT uc_product_product_ref UNIQUE (product_ref_id);

DROP TABLE product_retail_price CASCADE;

ALTER TABLE product
    DROP COLUMN dosage_form;

ALTER TABLE product
    DROP COLUMN product_model_no;

ALTER TABLE product
    DROP COLUMN reorder_limit_by_selling_unit;

ALTER TABLE product
    DROP COLUMN selling_unit;

ALTER TABLE product
    DROP COLUMN product_id;

ALTER TABLE product
    DROP COLUMN purchase_group_id;

ALTER TABLE batch_inventory
    DROP COLUMN product_id;

ALTER TABLE batch_inventory
    ADD product_id BIGINT;

ALTER TABLE product
    ADD product_id BIGINT NOT NULL PRIMARY KEY;

ALTER TABLE purchase_line_item
    DROP COLUMN product_id;

ALTER TABLE purchase_line_item
    ADD product_id BIGINT;

ALTER TABLE product
    ADD purchase_group_id BIGINT;

ALTER TABLE product_wholesale_price
    ADD CONSTRAINT FK_PRODUCT_WHOLESALE_PRICE_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (product_id);
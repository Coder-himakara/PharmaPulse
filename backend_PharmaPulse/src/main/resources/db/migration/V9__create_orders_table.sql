-- V9__create_order_module_tables.sql

-- Sequence and table for orders
CREATE SEQUENCE order_seq START WITH 1 INCREMENT BY 1;
CREATE TABLE orders (
                        order_id BIGINT PRIMARY KEY DEFAULT nextval('order_seq'),
                        order_number VARCHAR(255) UNIQUE NOT NULL,
                        customer_name VARCHAR(255),
                        customer_address VARCHAR(255),
                        customer_contact VARCHAR(255),
                        total_amount NUMERIC(19,2),
                        total_discount NUMERIC(19,2),
                        order_date TIMESTAMP,
                        status VARCHAR(50)
);

-- Sequence and table for order items
CREATE SEQUENCE order_item_seq START WITH 1 INCREMENT BY 1;
CREATE TABLE order_items (
                             order_item_id BIGINT PRIMARY KEY DEFAULT nextval('order_item_seq'),
                             product_id BIGINT NOT NULL,
                             product_name VARCHAR(255),
                             quantity INTEGER NOT NULL,
                             unit_price NUMERIC(19,2),
                             discount NUMERIC(19,2),
                             line_total NUMERIC(19,2),
                             order_id BIGINT,
                             CONSTRAINT fk_order
                                 FOREIGN KEY (order_id)
                                     REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Sequence and table for sales invoices
CREATE SEQUENCE sales_invoice_seq START WITH 1 INCREMENT BY 1;
CREATE TABLE sales_invoices (
                                invoice_id BIGINT PRIMARY KEY DEFAULT nextval('sales_invoice_seq'),
                                invoice_number VARCHAR(255) UNIQUE NOT NULL,
                                invoice_date TIMESTAMP,
                                total_amount NUMERIC(19,2),
                                total_discount NUMERIC(19,2),
                                order_id BIGINT
);

-- Sequence and table for sales invoice items
CREATE SEQUENCE sales_invoice_item_seq START WITH 1 INCREMENT BY 1;
CREATE TABLE sales_invoice_items (
                                     invoice_item_id BIGINT PRIMARY KEY DEFAULT nextval('sales_invoice_item_seq'),
                                     product_id BIGINT NOT NULL,
                                     quantity INTEGER NOT NULL,
                                     unit_price NUMERIC(19,2),
                                     discount NUMERIC(19,2),
                                     line_total NUMERIC(19,2),
                                     sales_invoice_id BIGINT,
                                     CONSTRAINT fk_sales_invoice
                                         FOREIGN KEY (sales_invoice_id)
                                             REFERENCES sales_invoices(invoice_id) ON DELETE CASCADE
);

-- Sequence and table for price list
CREATE SEQUENCE price_list_seq START WITH 1 INCREMENT BY 1;
CREATE TABLE price_list (
                            id BIGINT PRIMARY KEY DEFAULT nextval('price_list_seq'),
                            product_id BIGINT UNIQUE,
                            product_ref_id VARCHAR(255),
                            purchase_group_id BIGINT,
                            product_name VARCHAR(255),
                            generic_name VARCHAR(255),
                            units_per_pack VARCHAR(255),
                            wholesale_price NUMERIC(19,2),
                            updated_at TIMESTAMP
);
-- Create a sequence for generating unique reservation IDs
CREATE SEQUENCE reservation_seq START WITH 1 INCREMENT BY 1;

-- Create the inventory_reservation table
CREATE TABLE inventory_reservation (
                                       reservation_id BIGINT PRIMARY KEY DEFAULT nextval('reservation_seq'),
                                       product_id BIGINT NOT NULL,
                                       reserved_quantity INTEGER NOT NULL,
                                       order_id BIGINT NOT NULL,
                                       reservation_time TIMESTAMP NOT NULL
);
ALTER TABLE customer
DROP
COLUMN customer_phone_no;

ALTER TABLE customer
    ADD customer_phone_no VARCHAR(255);
ALTER TABLE users
    ADD address VARCHAR(255);

ALTER TABLE users
    ADD contact_number VARCHAR(255);

ALTER TABLE users
    ADD date_of_joined date;

ALTER TABLE users
    ADD email VARCHAR(255);

ALTER TABLE users
    ADD nic_number VARCHAR(255);

ALTER TABLE users
    ADD status VARCHAR(255);

ALTER TABLE customer
    ALTER COLUMN customer_group_id SET NOT NULL;
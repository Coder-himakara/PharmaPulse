ALTER TABLE truck_inventory
    ADD registration_number VARCHAR(255);

ALTER TABLE truck
    DROP COLUMN truck_id;

ALTER TABLE truck
    DROP COLUMN assigned_repl_id;

ALTER TABLE truck
    DROP COLUMN current_capacity;

ALTER TABLE truck
    DROP COLUMN max_capacity;

ALTER TABLE truck
    ADD assigned_repl_id BIGINT;

ALTER TABLE truck
    ADD current_capacity INTEGER;

ALTER TABLE truck
    ALTER COLUMN current_capacity DROP NOT NULL;

ALTER TABLE truck
    ADD max_capacity INTEGER;

ALTER TABLE truck
    ALTER COLUMN max_capacity DROP NOT NULL;

ALTER TABLE truck
    DROP COLUMN date_added;

ALTER TABLE truck
    ADD date_added date;
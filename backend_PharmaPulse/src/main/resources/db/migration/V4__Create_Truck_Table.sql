CREATE TABLE truck (
                       id BIGSERIAL PRIMARY KEY,
                       truck_id VARCHAR(255) NOT NULL UNIQUE,
                       registration_number VARCHAR(255) NOT NULL UNIQUE,
                       max_capacity DOUBLE PRECISION NOT NULL,
                       status VARCHAR(255) CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')) NOT NULL,
                       date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       assigned_repl_id VARCHAR(255),
                       current_capacity DOUBLE PRECISION NOT NULL
);

CREATE TABLE "users"
(
    user_id       BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255),
    CONSTRAINT pk_user PRIMARY KEY (user_id)
);

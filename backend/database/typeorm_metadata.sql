CREATE TABLE IF NOT EXISTS typeorm_metadata (
    type varchar(255) NOT NULL,
    database varchar(255) DEFAULT NULL,
    schema varchar(255) DEFAULT NULL,
    "table" varchar(255) DEFAULT NULL,
    name varchar(255) DEFAULT NULL,
    value text
);

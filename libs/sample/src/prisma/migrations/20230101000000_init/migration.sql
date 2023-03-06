CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "SampleUsers" (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    
    "name" varchar(64) NOT NULL,

    CONSTRAINT "PK_SAMPLE_USERS" PRIMARY KEY (id)
);
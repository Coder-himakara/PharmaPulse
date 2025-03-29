-- First drop the old column
ALTER TABLE users DROP COLUMN image_data;

-- Then add it back with the correct type
ALTER TABLE users ADD COLUMN image_data bytea;
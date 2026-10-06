-- 0007_drop_step_images.sql
-- Remove step image support entirely.
-- guide_steps.image_key and image_alt columns are left in place
-- because SQLite < 3.35 does not support ALTER TABLE DROP COLUMN.
-- They will simply be ignored forever.

DROP TABLE IF EXISTS guide_step_images;

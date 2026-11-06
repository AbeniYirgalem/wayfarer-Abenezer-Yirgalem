-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "body" DROP NOT NULL;

-- Update check constraint to allow NULL body while preserving length constraint when non-null
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "check_review_body_not_empty";
ALTER TABLE "reviews" ADD CONSTRAINT "check_review_body_not_empty" CHECK ("body" IS NULL OR (char_length(trim("body")) > 0 AND char_length("body") <= 500));

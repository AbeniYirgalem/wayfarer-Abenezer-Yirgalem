-- CreateEnum
CREATE TYPE "PlaceCategory" AS ENUM ('HISTORY', 'FOOD', 'NATURE', 'CULTURE', 'ENTERTAINMENT');

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_tourSlotId_fkey";

-- DropIndex
DROP INDEX "bookings_tourSlotId_idx";

-- DropIndex
DROP INDEX "bookings_userId_tourSlotId_key";

-- DropIndex
DROP INDEX "places_city_idx";

-- DropIndex
DROP INDEX "reviews_userId_placeId_key";

-- DropIndex
DROP INDEX "tour_slots_startTime_idx";

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "status",
DROP COLUMN "tourSlotId",
DROP COLUMN "updatedAt",
ADD COLUMN     "slotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "places" DROP COLUMN "city",
ADD COLUMN     "openingHours" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "PlaceCategory" NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "comment",
ADD COLUMN     "body" VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE "tour_slots" DROP COLUMN "endTime",
DROP COLUMN "price",
DROP COLUMN "startTime",
DROP COLUMN "updatedAt",
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarUrl",
DROP COLUMN "email",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE INDEX "bookings_slotId_idx" ON "bookings"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_slotId_userId_key" ON "bookings"("slotId", "userId");

-- CreateIndex
CREATE INDEX "places_category_idx" ON "places"("category");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_placeId_userId_key" ON "reviews"("placeId", "userId");

-- CreateIndex
CREATE INDEX "tour_slots_startsAt_idx" ON "tour_slots"("startsAt");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "tour_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Database-level check constraints
ALTER TABLE "reviews" ADD CONSTRAINT "check_review_rating_range" CHECK ("rating" >= 1 AND "rating" <= 5);
ALTER TABLE "reviews" ADD CONSTRAINT "check_review_body_not_empty" CHECK (char_length(trim("body")) > 0 AND char_length("body") <= 500);
ALTER TABLE "tour_slots" ADD CONSTRAINT "check_tour_slot_capacity_positive" CHECK ("capacity" > 0);
ALTER TABLE "bookings" ADD CONSTRAINT "check_booking_seats_positive" CHECK ("seats" > 0);


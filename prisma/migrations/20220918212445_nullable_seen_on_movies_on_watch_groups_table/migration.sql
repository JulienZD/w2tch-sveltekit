/*
  Warnings:

  - You are about to alter the column `imdbRating` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "imdbRating" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "MoviesOnWatchGroups" ALTER COLUMN "seenOn" DROP NOT NULL,
ALTER COLUMN "seenOn" DROP DEFAULT;

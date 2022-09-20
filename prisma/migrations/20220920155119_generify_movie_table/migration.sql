/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `imdbRating` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `imdbUrl` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[source,externalId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExternalMovieSource" AS ENUM ('TMDB');

-- DropIndex
DROP INDEX "Movie_imdbUrl_key";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "imageUrl",
DROP COLUMN "imdbRating",
DROP COLUMN "imdbUrl",
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "rating" DECIMAL(10,2),
ADD COLUMN     "source" "ExternalMovieSource" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_source_externalId_key" ON "Movie"("source", "externalId");

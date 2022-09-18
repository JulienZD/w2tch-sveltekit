/*
  Warnings:

  - You are about to drop the column `watcherId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Watcher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_watcherId_fkey";

-- DropForeignKey
ALTER TABLE "WatchGroup" DROP CONSTRAINT "WatchGroup_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "WatchersOnWatchGroups" DROP CONSTRAINT "WatchersOnWatchGroups_watcherId_fkey";

-- DropIndex
DROP INDEX "User_watcherId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "watcherId",
ADD COLUMN     "temporaryAccessExpiresOn" TIMESTAMP(3) NOT NULL DEFAULT NOW() + '30 days',
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "Watcher";

-- AddForeignKey
ALTER TABLE "WatchGroup" ADD CONSTRAINT "WatchGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchersOnWatchGroups" ADD CONSTRAINT "WatchersOnWatchGroups_watcherId_fkey" FOREIGN KEY ("watcherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

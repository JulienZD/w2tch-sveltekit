/*
  Warnings:

  - Added the required column `name` to the `WatchGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "WatchGroup_ownerId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "temporaryAccessExpiresOn" DROP NOT NULL,
ALTER COLUMN "temporaryAccessExpiresOn" SET DEFAULT NOW() + '30 days';

-- AlterTable
ALTER TABLE "WatchGroup" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

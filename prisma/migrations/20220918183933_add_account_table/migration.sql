-- AlterTable
ALTER TABLE "User" ALTER COLUMN "temporaryAccessExpiresOn" SET DEFAULT NOW() + '30 days';

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

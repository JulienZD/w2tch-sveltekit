-- CreateTable
CREATE TABLE "WatchlistInvite" (
    "watchlistId" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3),
    "remainingUses" INTEGER NOT NULL DEFAULT -1
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistInvite_watchlistId_key" ON "WatchlistInvite"("watchlistId");

-- AddForeignKey
ALTER TABLE "WatchlistInvite" ADD CONSTRAINT "WatchlistInvite_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "WatchGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

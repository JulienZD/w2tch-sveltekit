-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "watcherId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watcher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Watcher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchGroup" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchersOnWatchGroups" (
    "watcherId" TEXT NOT NULL,
    "watchGroupId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchersOnWatchGroups_pkey" PRIMARY KEY ("watcherId","watchGroupId")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imdbRating" DECIMAL(65,30) NOT NULL,
    "imdbUrl" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesOnWatchGroups" (
    "movieId" TEXT NOT NULL,
    "watchGroupId" TEXT NOT NULL,
    "seenOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoviesOnWatchGroups_pkey" PRIMARY KEY ("movieId","watchGroupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_watcherId_key" ON "User"("watcherId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchGroup_ownerId_key" ON "WatchGroup"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdbUrl_key" ON "Movie"("imdbUrl");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_watcherId_fkey" FOREIGN KEY ("watcherId") REFERENCES "Watcher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchGroup" ADD CONSTRAINT "WatchGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Watcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchersOnWatchGroups" ADD CONSTRAINT "WatchersOnWatchGroups_watcherId_fkey" FOREIGN KEY ("watcherId") REFERENCES "Watcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchersOnWatchGroups" ADD CONSTRAINT "WatchersOnWatchGroups_watchGroupId_fkey" FOREIGN KEY ("watchGroupId") REFERENCES "WatchGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesOnWatchGroups" ADD CONSTRAINT "MoviesOnWatchGroups_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesOnWatchGroups" ADD CONSTRAINT "MoviesOnWatchGroups_watchGroupId_fkey" FOREIGN KEY ("watchGroupId") REFERENCES "WatchGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "FileVector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "title" TEXT,
    "source" TEXT,
    "crawledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vectors" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FileVector_filePath_key" ON "FileVector"("filePath");

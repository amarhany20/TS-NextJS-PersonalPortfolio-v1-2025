/*
  Rename media -> attachments (attachment library / Vercel Blob storage).

  The physical table is renamed from `media` to `attachments`. This app has not
  been released, so the table is empty and a drop/create is equivalent to a
  rename; the schema now stores attachments under `attachments`.
*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_createdById_fkey";

-- DropTable
DROP TABLE "media";

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT,
    "path" TEXT NOT NULL,
    "url" TEXT,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "checksum" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attachments_createdById_idx" ON "attachments"("createdById");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

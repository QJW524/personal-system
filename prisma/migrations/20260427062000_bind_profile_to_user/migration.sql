-- CreateSequence
CREATE SEQUENCE IF NOT EXISTS "SiteProfile_id_seq";

-- SetSequenceValue
SELECT setval('"SiteProfile_id_seq"', COALESCE((SELECT MAX("id") FROM "SiteProfile"), 1));

-- AlterTable
ALTER TABLE "SiteProfile"
ADD COLUMN "userId" INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('"SiteProfile_id_seq"');

-- LinkSequenceOwnership
ALTER SEQUENCE "SiteProfile_id_seq" OWNED BY "SiteProfile"."id";

-- CreateIndex
CREATE UNIQUE INDEX "SiteProfile_userId_key" ON "SiteProfile"("userId");

-- AddForeignKey
ALTER TABLE "SiteProfile"
ADD CONSTRAINT "SiteProfile_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "SiteProfile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteTitle" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Highlight_profileId_idx" ON "Highlight"("profileId");

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "SiteProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

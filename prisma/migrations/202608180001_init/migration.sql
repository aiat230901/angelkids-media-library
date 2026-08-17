CREATE TYPE "Status" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "Provider" AS ENUM ('YOUTUBE', 'HEYZINE', 'GOOGLE_DRIVE');
CREATE TYPE "ResourceFormat" AS ENUM (
  'ANIMATED_STORY_VIDEO',
  'ANIMATED_DIALOGUE_VIDEO',
  'LEARNING_SONG_VIDEO',
  'SCHOOL_SONG_VIDEO',
  'DIGITAL_STORYBOOK',
  'DIGITAL_DIALOGUE_BOOK',
  'DIGITAL_FLASHCARD_SET',
  'PRINT_AND_PLAY_COLLECTION'
);

CREATE TABLE "Category" (
  "id" UUID NOT NULL,
  "slug" VARCHAR(80) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" VARCHAR(280) NOT NULL,
  "illustrationUrl" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "status" "Status" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentType" (
  "id" UUID NOT NULL,
  "categoryId" UUID NOT NULL,
  "slug" VARCHAR(80) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" VARCHAR(280) NOT NULL,
  "illustrationUrl" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "status" "Status" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "ContentType_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Level" (
  "id" UUID NOT NULL,
  "code" VARCHAR(30) NOT NULL,
  "name" VARCHAR(80) NOT NULL,
  "ageRange" VARCHAR(80),
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "status" "Status" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CurriculumUnit" (
  "id" UUID NOT NULL,
  "monthNumber" CHAR(2) NOT NULL,
  "monthTopic" VARCHAR(220) NOT NULL,
  "displayLabel" VARCHAR(260) NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "status" "Status" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "CurriculumUnit_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurriculumUnit_monthNumber_check" CHECK ("monthNumber" ~ '^(0[1-9]|1[0-2])$')
);

CREATE TABLE "LearningResource" (
  "id" UUID NOT NULL,
  "slug" VARCHAR(160) NOT NULL,
  "assetName" VARCHAR(200) NOT NULL,
  "description" VARCHAR(500),
  "categoryId" UUID NOT NULL,
  "contentTypeId" UUID,
  "curriculumUnitId" UUID,
  "provider" "Provider" NOT NULL,
  "resourceFormat" "ResourceFormat" NOT NULL,
  "externalUrl" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "altText" VARCHAR(250) NOT NULL,
  "status" "Status" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "LearningResource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ResourceLevel" (
  "resourceId" UUID NOT NULL,
  "levelId" UUID NOT NULL,
  CONSTRAINT "ResourceLevel_pkey" PRIMARY KEY ("resourceId", "levelId")
);

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "ContentType_categoryId_slug_key" ON "ContentType"("categoryId", "slug");
CREATE INDEX "ContentType_categoryId_status_sortOrder_idx" ON "ContentType"("categoryId", "status", "sortOrder");
CREATE UNIQUE INDEX "Level_code_key" ON "Level"("code");
CREATE UNIQUE INDEX "CurriculumUnit_monthNumber_monthTopic_key" ON "CurriculumUnit"("monthNumber", "monthTopic");
CREATE INDEX "CurriculumUnit_status_sortOrder_idx" ON "CurriculumUnit"("status", "sortOrder");
CREATE UNIQUE INDEX "LearningResource_slug_key" ON "LearningResource"("slug");
CREATE INDEX "LearningResource_categoryId_contentTypeId_status_sortOrder_idx" ON "LearningResource"("categoryId", "contentTypeId", "status", "sortOrder");
CREATE INDEX "LearningResource_curriculumUnitId_status_sortOrder_idx" ON "LearningResource"("curriculumUnitId", "status", "sortOrder");
CREATE INDEX "LearningResource_status_resourceFormat_sortOrder_idx" ON "LearningResource"("status", "resourceFormat", "sortOrder");
CREATE UNIQUE INDEX "LearningResource_active_print_unit_key"
  ON "LearningResource"("curriculumUnitId")
  WHERE "resourceFormat" = 'PRINT_AND_PLAY_COLLECTION' AND "status" = 'ACTIVE';
CREATE INDEX "ResourceLevel_levelId_resourceId_idx" ON "ResourceLevel"("levelId", "resourceId");

ALTER TABLE "ContentType" ADD CONSTRAINT "ContentType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_curriculumUnitId_fkey" FOREIGN KEY ("curriculumUnitId") REFERENCES "CurriculumUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ResourceLevel" ADD CONSTRAINT "ResourceLevel_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "LearningResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceLevel" ADD CONSTRAINT "ResourceLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


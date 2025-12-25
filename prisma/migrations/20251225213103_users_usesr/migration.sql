/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "global_name" TEXT,
    "avatar" TEXT,
    "banner" TEXT,
    "accent_color" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en-GB',
    "level" INTEGER NOT NULL DEFAULT 0,
    "xp" BIGINT NOT NULL DEFAULT 0,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "settings" JSONB,
    "last_active" TIMESTAMPTZ,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

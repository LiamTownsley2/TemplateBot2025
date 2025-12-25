-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "global_name" TEXT,
    "avatar" TEXT,
    "banner" TEXT,
    "accent_color" INTEGER,
    "locale" TEXT,
    "email_verified" BOOLEAN,
    "created_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);


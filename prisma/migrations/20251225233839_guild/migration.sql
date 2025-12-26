-- CreateTable
CREATE TABLE "guild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL DEFAULT 'en-GB',
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "last_active" TIMESTAMPTZ,

    CONSTRAINT "guild_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" TEXT NOT NULL DEFAULT 'email',
ALTER COLUMN "password" DROP NOT NULL;

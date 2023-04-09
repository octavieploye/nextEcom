/*
  Warnings:

  - You are about to drop the column `StripeCustomer` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "StripeCustomer",
ADD COLUMN     "stripeCustomerId" TEXT;

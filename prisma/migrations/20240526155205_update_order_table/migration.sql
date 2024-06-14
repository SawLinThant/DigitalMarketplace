/*
  Warnings:

  - You are about to drop the column `productId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "productId",
DROP COLUMN "productName";

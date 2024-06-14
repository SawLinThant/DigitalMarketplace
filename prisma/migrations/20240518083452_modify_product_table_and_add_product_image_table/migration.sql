/*
  Warnings:

  - You are about to drop the column `image` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "productImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "productImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productImage" ADD CONSTRAINT "productImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

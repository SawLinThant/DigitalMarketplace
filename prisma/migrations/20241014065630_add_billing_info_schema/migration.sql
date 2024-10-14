-- CreateTable
CREATE TABLE "BillingInfo" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "billingAddress" TEXT NOT NULL,
    "billingPhone" TEXT NOT NULL,
    "billingEmail" TEXT NOT NULL,

    CONSTRAINT "BillingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingInfo_orderId_key" ON "BillingInfo"("orderId");

-- AddForeignKey
ALTER TABLE "BillingInfo" ADD CONSTRAINT "BillingInfo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

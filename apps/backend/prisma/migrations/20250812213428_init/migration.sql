-- CreateEnum
CREATE TYPE "public"."cuisine" AS ENUM ('JAPANESE', 'ITALIAN', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."order_status" AS ENUM ('PENDING', 'PREPARING', 'READY', 'SERVED');

-- CreateTable
CREATE TABLE "public"."menu_items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "cuisine" "public"."cuisine" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "customer_name" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "status" "public"."order_status" NOT NULL DEFAULT 'PENDING',
    "order_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "order_id" INTEGER NOT NULL,
    "menu_item_id" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

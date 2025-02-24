/*
  Warnings:

  - You are about to drop the column `addres` on the `guest` table. All the data in the column will be lost.
  - Added the required column `address` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `guest` DROP COLUMN `addres`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL;

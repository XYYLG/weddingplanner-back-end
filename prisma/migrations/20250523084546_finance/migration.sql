/*
  Warnings:

  - You are about to drop the column `city` on the `guest` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `guest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `guest` DROP COLUMN `city`,
    DROP COLUMN `postalCode`;

-- CreateTable
CREATE TABLE `Finance` (
    `id` VARCHAR(191) NOT NULL,
    `amountPayed` DOUBLE NOT NULL,
    `amountDue` DOUBLE NOT NULL,
    `amountTotal` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

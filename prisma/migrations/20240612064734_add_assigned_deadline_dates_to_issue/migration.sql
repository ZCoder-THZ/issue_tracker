-- AlterTable
ALTER TABLE `issues` ADD COLUMN `assignedDate` DATETIME(3) NULL,
    ADD COLUMN `deadlineDate` DATETIME(3) NULL;

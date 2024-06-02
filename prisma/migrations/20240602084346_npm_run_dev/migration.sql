-- AlterTable
ALTER TABLE `issues` ADD COLUMN `assignedToUserId` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `issues` ADD CONSTRAINT `issues_assignedToUserId_fkey` FOREIGN KEY (`assignedToUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

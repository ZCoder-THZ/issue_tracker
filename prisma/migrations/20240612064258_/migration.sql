-- AlterTable
ALTER TABLE `issues` ADD COLUMN `priority` ENUM('high', 'medium', 'low', 'lowest') NOT NULL DEFAULT 'low';

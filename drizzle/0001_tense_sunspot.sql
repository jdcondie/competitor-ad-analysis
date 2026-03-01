CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`brandName` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL DEFAULT '',
	`config` text NOT NULL,
	`isAiOnly` int NOT NULL DEFAULT 0,
	`totalAdsAnalyzed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);

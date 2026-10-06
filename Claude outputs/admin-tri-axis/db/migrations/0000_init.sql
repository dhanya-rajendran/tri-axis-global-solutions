CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(190) NOT NULL,
	`password_hash` varchar(100) NOT NULL,
	`role` enum('admin','editor') NOT NULL DEFAULT 'editor',
	`is_active` boolean NOT NULL DEFAULT true,
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('contact','employer','candidate','job-application') NOT NULL,
	`status` enum('new','in_progress','closed','spam') NOT NULL DEFAULT 'new',
	`name` varchar(160) NOT NULL,
	`email` varchar(190) NOT NULL,
	`phone` varchar(60),
	`company` varchar(190),
	`subject` varchar(190),
	`message` text,
	`details` json NOT NULL,
	`job_id` int,
	`job_reference` varchar(40),
	`cv_file_name` varchar(255),
	`cv_url` varchar(500),
	`source_url` varchar(500),
	`ip_address` varchar(64),
	`user_agent` varchar(300),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `features` (
	`id` int AUTO_INCREMENT NOT NULL,
	`group_key` enum('why_triaxis','company_values','employer_benefits','employer_solutions','candidate_services','candidate_reasons') NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` varchar(500) NOT NULL,
	`icon` varchar(60) NOT NULL,
	`href` varchar(300),
	`cta_label` varchar(80),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `features_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `industries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(190) NOT NULL,
	`name` varchar(160) NOT NULL,
	`short_name` varchar(80),
	`icon` varchar(60) NOT NULL,
	`summary` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`roles` json NOT NULL,
	`seo_title` varchar(255),
	`seo_description` varchar(320),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `industries_id` PRIMARY KEY(`id`),
	CONSTRAINT `industries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `insight_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(120) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insight_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `insight_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(190) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` varchar(500) NOT NULL,
	`image_url` varchar(500),
	`image_alt` varchar(255),
	`category_id` int,
	`author_name` varchar(120) NOT NULL,
	`author_role` varchar(120),
	`published_at` date NOT NULL,
	`reading_minutes` int NOT NULL DEFAULT 5,
	`content` json NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`download_label` varchar(120),
	`download_url` varchar(500),
	`seo_title` varchar(255),
	`seo_description` varchar(320),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insights_id` PRIMARY KEY(`id`),
	CONSTRAINT `insights_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(190) NOT NULL,
	`reference` varchar(40) NOT NULL,
	`title` varchar(190) NOT NULL,
	`company` varchar(190) NOT NULL,
	`confidential` boolean NOT NULL DEFAULT true,
	`location_id` int,
	`country` varchar(2) NOT NULL DEFAULT 'AE',
	`employment_type` enum('full-time','part-time','contract','temporary') NOT NULL,
	`experience_level` enum('entry','mid','senior','executive') NOT NULL,
	`experience_years` varchar(40) NOT NULL,
	`industry_id` int,
	`salary_min` int,
	`salary_max` int,
	`salary_currency` enum('AED','USD') DEFAULT 'AED',
	`salary_period` enum('month','year') DEFAULT 'month',
	`summary` varchar(500) NOT NULL,
	`description` json NOT NULL,
	`responsibilities` json NOT NULL,
	`requirements` json NOT NULL,
	`benefits` json NOT NULL,
	`posted_at` date NOT NULL,
	`closing_at` date,
	`featured` boolean NOT NULL DEFAULT false,
	`status` enum('open','closed','draft') NOT NULL DEFAULT 'draft',
	`seo_title` varchar(255),
	`seo_description` varchar(320),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `jobs_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `jobs_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `legal_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(160) NOT NULL,
	`intro` text NOT NULL,
	`sections` json NOT NULL,
	`is_draft` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legal_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `legal_pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`label` varchar(120) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`),
	CONSTRAINT `locations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `process_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` varchar(4) NOT NULL,
	`title` varchar(80) NOT NULL,
	`description` varchar(300) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `process_steps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(190) NOT NULL,
	`title` varchar(190) NOT NULL,
	`short_title` varchar(80) NOT NULL,
	`summary` varchar(500) NOT NULL,
	`intro` text NOT NULL,
	`icon` varchar(60) NOT NULL,
	`image_url` varchar(500),
	`image_alt` varchar(255),
	`cta_label` varchar(80) NOT NULL,
	`category` enum('recruitment','business') NOT NULL,
	`offerings` json NOT NULL,
	`body` json NOT NULL,
	`seo_title` varchar(255),
	`seo_description` varchar(320),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`legal_name` varchar(160) NOT NULL,
	`short_name` varchar(60) NOT NULL,
	`tagline` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`email` varchar(190) NOT NULL,
	`careers_email` varchar(190) NOT NULL,
	`phone` varchar(60) NOT NULL,
	`phone_href` varchar(80),
	`whatsapp` varchar(60),
	`address_line1` varchar(190) NOT NULL,
	`address_line2` varchar(190),
	`city` varchar(120) NOT NULL,
	`emirate` varchar(120) NOT NULL,
	`country` varchar(120) NOT NULL,
	`country_code` varchar(2) NOT NULL,
	`working_hours` json NOT NULL,
	`map_embed_url` varchar(1000),
	`social` json NOT NULL,
	`default_og_image` varchar(500),
	`mission` text,
	`vision` text,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `statistics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` varchar(20) NOT NULL,
	`suffix` varchar(10),
	`label` varchar(120) NOT NULL,
	`is_placeholder` boolean NOT NULL DEFAULT false,
	`highlight` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `statistics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`role` varchar(160) NOT NULL,
	`bio` text,
	`image_url` varchar(500),
	`linkedin_url` varchar(500),
	`is_published` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quote` text NOT NULL,
	`name` varchar(120) NOT NULL,
	`role` varchar(120) NOT NULL,
	`company` varchar(160) NOT NULL,
	`is_placeholder` boolean NOT NULL DEFAULT false,
	`is_published` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_job_id_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `insights` ADD CONSTRAINT `insights_category_id_insight_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `insight_categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_location_id_locations_id_fk` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_industry_id_industries_id_fk` FOREIGN KEY (`industry_id`) REFERENCES `industries`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `enquiries_type_idx` ON `enquiries` (`type`);--> statement-breakpoint
CREATE INDEX `enquiries_status_idx` ON `enquiries` (`status`);--> statement-breakpoint
CREATE INDEX `enquiries_created_idx` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `features_group_idx` ON `features` (`group_key`);--> statement-breakpoint
CREATE INDEX `insights_status_idx` ON `insights` (`status`);--> statement-breakpoint
CREATE INDEX `jobs_status_idx` ON `jobs` (`status`);--> statement-breakpoint
CREATE INDEX `jobs_industry_idx` ON `jobs` (`industry_id`);--> statement-breakpoint
CREATE INDEX `jobs_location_idx` ON `jobs` (`location_id`);
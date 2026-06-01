-- Attaie Properties — MySQL schema
-- Run this once in cPanel > phpMyAdmin (or via MySQL CLI)
-- Replace `attaie_properties` with your actual database name if different.

CREATE TABLE IF NOT EXISTS `leads` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(255)    NOT NULL,
  `email`         VARCHAR(255)    NOT NULL,
  `phone`         VARCHAR(60)     NOT NULL,
  `message`       TEXT,
  `property_id`   VARCHAR(100)    DEFAULT NULL,
  `property_name` VARCHAR(255)    DEFAULT NULL,
  `stage`         VARCHAR(50)     NOT NULL DEFAULT 'New',
  `source`        VARCHAR(100)    NOT NULL DEFAULT 'Website',
  `status`        VARCHAR(50)     NOT NULL DEFAULT 'Pending',
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email`      (`email`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

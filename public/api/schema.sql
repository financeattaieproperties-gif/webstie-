-- Attaie Properties — MySQL schema
-- Run this once in cPanel > phpMyAdmin after creating a database.
-- Update credentials in public/api/db.php after running.

CREATE TABLE IF NOT EXISTS properties (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255)   NOT NULL,
  price        DECIMAL(12,2)  NOT NULL,
  location     VARCHAR(255)   NOT NULL,
  beds         TINYINT        DEFAULT NULL,
  baths        TINYINT        DEFAULT NULL,
  area         DECIMAL(8,2)   DEFAULT NULL,
  floor        TINYINT        DEFAULT NULL,
  status       ENUM('available','pending','sold') NOT NULL DEFAULT 'available',
  type         ENUM('Villa','Apartment','House','Commercial') NOT NULL,
  listing_type ENUM('sale','rent') NOT NULL,
  image_url    VARCHAR(500)   DEFAULT NULL,
  description  TEXT           DEFAULT NULL,
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS projects (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  location        VARCHAR(255) NOT NULL,
  delivery_date   VARCHAR(50)  DEFAULT NULL,
  status          ENUM('Under Construction','Ready','Sold Out') NOT NULL DEFAULT 'Under Construction',
  available_units INT          DEFAULT 0,
  total_units     INT          DEFAULT 0,
  image_url       VARCHAR(500) DEFAULT NULL,
  description     TEXT         DEFAULT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leads (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(50)  NOT NULL,
  message       TEXT         DEFAULT NULL,
  property_id   VARCHAR(50)  DEFAULT NULL,
  property_name VARCHAR(255) DEFAULT NULL,
  stage         VARCHAR(50)  DEFAULT 'New',
  source        VARCHAR(50)  DEFAULT 'Website',
  status        VARCHAR(50)  DEFAULT 'Pending',
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed one sample property so frontend is not empty after first deploy
INSERT INTO properties (title, price, location, beds, baths, area, status, type, listing_type, image_url, description)
VALUES (
  'Modern Villa with Mountain Views', 450000, 'Wazir Akbar Khan, Kabul',
  6, 5, 380, 'available', 'Villa', 'sale',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  'Stunning 6-bedroom villa with panoramic mountain views in the heart of Kabul.'
);

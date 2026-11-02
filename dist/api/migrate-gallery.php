<?php
/**
 * Run once: adds gallery_images and video_url columns to properties table.
 * Access via browser (admin only) then delete this file.
 */
require_once __DIR__ . '/db.php';
require_admin();

$db = db();

$queries = [
    "ALTER TABLE properties ADD COLUMN IF NOT EXISTS gallery_images TEXT NULL COMMENT 'JSON array of image URLs'",
    "ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url VARCHAR(1000) NULL COMMENT 'YouTube, Vimeo, or direct MP4 URL'",
];

$results = [];
foreach ($queries as $q) {
    if ($db->query($q)) {
        $results[] = ['query' => $q, 'status' => 'OK'];
    } else {
        $results[] = ['query' => $q, 'status' => 'ERROR: ' . $db->error];
    }
}

json_out(['migration' => 'gallery + video', 'results' => $results]);

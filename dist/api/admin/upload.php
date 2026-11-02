<?php
require_once __DIR__ . '/../db.php';
cors();
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'POST only'], 405);
}

if (empty($_FILES['image'])) {
    json_out(['error' => 'No file uploaded'], 400);
}

$file     = $_FILES['image'];
$allowed  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$maxBytes = 5 * 1024 * 1024;

if (!in_array($file['type'], $allowed)) {
    json_out(['error' => 'Only JPEG, PNG, WebP, GIF allowed'], 400);
}
if ($file['size'] > $maxBytes) {
    json_out(['error' => 'File exceeds 5 MB limit'], 400);
}

$uploadDir = __DIR__ . '/../../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_', true) . '.' . strtolower($ext);
$dest     = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_out(['error' => 'Failed to save file'], 500);
}

json_out(['url' => '/uploads/' . $filename]);

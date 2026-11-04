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
$purpose  = trim((string) ($_POST['purpose'] ?? $_GET['purpose'] ?? ''));
$isBlueprint = ($purpose === 'blueprint');

$allowed  = $isBlueprint
    ? ['image/jpeg', 'image/png']
    : ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$allowedExts = $isBlueprint
    ? ['jpg', 'jpeg', 'png']
    : ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$maxBytes = 5 * 1024 * 1024;

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($file['type'], $allowed, true) || !in_array($ext, $allowedExts, true)) {
    json_out([
        'error' => $isBlueprint
            ? 'Only JPEG and PNG files are allowed for blueprints'
            : 'Only JPEG, PNG, WebP, GIF allowed'
    ], 400);
}
if ($file['size'] > $maxBytes) {
    json_out(['error' => 'File exceeds 5 MB limit'], 400);
}

$uploadDir = __DIR__ . '/../../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$prefix   = $isBlueprint ? 'plan_' : 'img_';
$filename = uniqid($prefix, true) . '.' . $ext;
$dest     = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_out(['error' => 'Failed to save file'], 500);
}

json_out(['url' => '/uploads/' . $filename]);


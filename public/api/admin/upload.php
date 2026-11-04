<?php
require_once __DIR__ . '/../bootstrap.php';
cors();
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'POST only'], 405);
}

if (empty($_FILES['image'])) {
    json_out(['error' => 'No file uploaded'], 400);
}

$file        = $_FILES['image'];
$purpose     = trim((string) ($_POST['purpose'] ?? $_GET['purpose'] ?? ''));
$isBlueprint = ($purpose === 'blueprint');

if (!isset($file['error']) || is_array($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
    json_out(['error' => 'Upload failed or file is invalid'], 400);
}

$maxBytes = 5 * 1024 * 1024;
if ($file['size'] <= 0 || $file['size'] > $maxBytes) {
    json_out(['error' => 'File must be between 1 byte and 5 MB'], 400);
}

if (!is_uploaded_file($file['tmp_name'])) {
    json_out(['error' => 'Invalid upload source'], 400);
}

// Inspect real file bytes via finfo
$finfo = new finfo(FILEINFO_MIME_TYPE);
$realMime = $finfo->file($file['tmp_name']) ?: '';

$mimeToExt = $isBlueprint
    ? [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
    ]
    : [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
    ];

if (!isset($mimeToExt[$realMime])) {
    json_out([
        'error' => $isBlueprint
            ? 'Only genuine JPEG and PNG files are allowed for blueprints'
            : 'Only genuine JPEG, PNG, WebP, and GIF images are allowed'
    ], 400);
}

// Verify image structure and enforce dimension limits
$imgInfo = @getimagesize($file['tmp_name']);
if ($imgInfo === false || empty($imgInfo[0]) || empty($imgInfo[1])) {
    json_out(['error' => 'Uploaded file is not a valid image'], 400);
}
$width  = (int) $imgInfo[0];
$height = (int) $imgInfo[1];
if ($width > 8000 || $height > 8000 || ($width * $height) > 36000000) {
    json_out(['error' => 'Image dimensions exceed maximum allowed size (8000x8000 px)'], 400);
}

$ext = $mimeToExt[$realMime];

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



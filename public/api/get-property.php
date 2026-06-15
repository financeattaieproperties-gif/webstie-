<?php
require_once __DIR__ . '/db.php';
cors();
header('Content-Type: application/json; charset=utf-8');

$id = intval($_GET['id'] ?? 0);
if (!$id) {
    json_out(['error' => 'id required'], 400);
}

$stmt = db()->prepare('SELECT * FROM properties WHERE id = ? LIMIT 1');
$stmt->bind_param('i', $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
if (!$row) {
    json_out(['error' => 'Not found'], 404);
}

// Decode gallery_images JSON string → array
if (!empty($row['gallery_images'])) {
    $decoded = json_decode($row['gallery_images'], true);
    $row['gallery_images'] = is_array($decoded) ? $decoded : [];
} else {
    $row['gallery_images'] = [];
}

echo json_encode($row);

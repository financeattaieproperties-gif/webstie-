<?php
require_once __DIR__ . '/db.php';
cors();
header('Content-Type: application/json; charset=utf-8');

$stmt = db()->prepare('SELECT * FROM projects ORDER BY created_at DESC');
$stmt->execute();
$result = $stmt->get_result();
$rows   = [];
while ($row = $result->fetch_assoc()) {
    $row['id']              = (int) $row['id'];
    $row['available_units'] = (int) ($row['available_units'] ?? 0);
    $row['total_units']     = (int) ($row['total_units'] ?? 0);
    if (!empty($row['gallery_images'])) {
        $decoded = json_decode($row['gallery_images'], true);
        $row['gallery_images'] = is_array($decoded) ? $decoded : [];
    } else {
        $row['gallery_images'] = [];
    }
    $rows[] = $row;
}
echo json_encode($rows);


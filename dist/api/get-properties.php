<?php
require_once __DIR__ . '/db.php';
cors();
header('Content-Type: application/json; charset=utf-8');

$db     = db();
$where  = ['1=1'];
$params = [];
$types  = '';

if (!empty($_GET['status'])) {
    $where[]  = 'status = ?';
    $params[] = $_GET['status'];
    $types   .= 's';
}
if (!empty($_GET['type'])) {
    $where[]  = 'type = ?';
    $params[] = $_GET['type'];
    $types   .= 's';
}
if (!empty($_GET['listing_type'])) {
    $where[]  = 'listing_type = ?';
    $params[] = $_GET['listing_type'];
    $types   .= 's';
}

$sql  = 'SELECT * FROM properties WHERE ' . implode(' AND ', $where) . ' ORDER BY created_at DESC';
$stmt = $db->prepare($sql);
if ($params) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();
$rows   = [];
while ($row = $result->fetch_assoc()) {
    // Decode gallery_images JSON string → array
    if (!empty($row['gallery_images'])) {
        $decoded = json_decode($row['gallery_images'], true);
        $row['gallery_images'] = is_array($decoded) ? $decoded : [];
    } else {
        $row['gallery_images'] = [];
    }
    $rows[] = $row;
}
echo json_encode($rows);

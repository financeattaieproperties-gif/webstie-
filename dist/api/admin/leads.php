<?php
require_once __DIR__ . '/../db.php';
cors();
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'GET only'], 405);
}

$stmt = db()->prepare('SELECT * FROM leads ORDER BY created_at DESC');
$stmt->execute();
$rows = [];
while ($row = $stmt->get_result()->fetch_assoc()) {
    $rows[] = $row;
}
json_out($rows);

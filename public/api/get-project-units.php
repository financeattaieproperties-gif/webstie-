<?php
require_once __DIR__ . '/db.php';
cors();

$projectId = intval($_GET['project_id'] ?? 0);
if (!$projectId) json_out(['error' => 'project_id required'], 400);

$status = trim($_GET['status'] ?? '');
$allowed = ['available', 'reserved', 'sold', 'rented'];
if ($status !== '' && !in_array($status, $allowed, true)) json_out(['error' => 'Invalid status'], 400);

$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(100, max(1, intval($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;

$sql = 'SELECT id,project_id,unit_number,title,beds,baths,area,floor,price,currency,status,image_url,description FROM project_units WHERE project_id = ?';
$types = 'i';
$params = [$projectId];
if ($status !== '') { $sql .= ' AND status = ?'; $types .= 's'; $params[] = $status; }
$sql .= ' ORDER BY floor ASC, unit_number ASC LIMIT ? OFFSET ?';
$types .= 'ii'; $params[] = $limit; $params[] = $offset;
$stmt = db()->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();
$rows = [];
while ($row = $result->fetch_assoc()) {
    $row['id']         = (int) $row['id'];
    $row['project_id'] = (int) $row['project_id'];
    $row['beds']       = $row['beds']  !== null ? (int) $row['beds']   : null;
    $row['baths']      = $row['baths'] !== null ? (int) $row['baths']  : null;
    $row['area']       = $row['area']  !== null ? (float) $row['area'] : null;
    $row['floor']      = $row['floor'] !== null ? (int) $row['floor']  : null;
    $row['price']      = $row['price'] !== null ? (float) $row['price']: null;
    $rows[] = $row;
}
json_out(['items' => $rows, 'page' => $page, 'limit' => $limit]);


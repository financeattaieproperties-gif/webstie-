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
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
json_out(['items' => $rows, 'page' => $page, 'limit' => $limit]);

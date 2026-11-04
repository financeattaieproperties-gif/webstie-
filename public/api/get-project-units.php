<?php
require_once __DIR__ . '/db.php';
cors();

$projectId = intval($_GET['project_id'] ?? 0);
$allUnits  = !empty($_GET['all']);
if (!$projectId && !$allUnits) {
    json_out(['error' => 'project_id or all=1 required'], 400);
}

$status = trim($_GET['status'] ?? '');
$allowed = ['available', 'reserved', 'sold', 'rented'];
if ($status !== '' && !in_array($status, $allowed, true)) {
    json_out(['error' => 'Invalid status'], 400);
}

$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(100, max(1, intval($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;

$sql = 'SELECT u.id, u.project_id, p.name AS project_name, p.location AS project_location,
               u.unit_number, u.title, u.beds, u.baths, u.area, u.floor, u.price,
               u.currency, u.status, u.image_url, u.description
        FROM project_units u
        INNER JOIN projects p ON p.id = u.project_id
        WHERE 1=1';
$types = '';
$params = [];

if ($projectId > 0) {
    $sql .= ' AND u.project_id = ?';
    $types .= 'i';
    $params[] = $projectId;
}
if ($status !== '') {
    $sql .= ' AND u.status = ?';
    $types .= 's';
    $params[] = $status;
}

$sql .= ' ORDER BY u.project_id ASC, u.floor ASC, u.unit_number ASC LIMIT ? OFFSET ?';
$types .= 'ii';
$params[] = $limit;
$params[] = $offset;

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



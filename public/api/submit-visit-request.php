<?php
require_once __DIR__ . '/db.php';
cors();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'POST only'], 405);

$input = body();
$name = trim($input['name'] ?? '');
$rawPhone = trim($input['phone'] ?? '');
$requestedAt = trim($input['requestedAt'] ?? '');
$propertyId = intval($input['propertyId'] ?? 0);
$projectId = intval($input['projectId'] ?? 0);
$unitId = intval($input['projectUnitId'] ?? 0);
if (trim($input['website'] ?? '') !== '') json_out(['success' => true], 201);
if (mb_strlen($name) < 2 || mb_strlen($name) > 255) json_out(['error' => 'A valid name is required'], 400);
$digits = preg_replace('/\D/', '', $rawPhone);
if (!preg_match('/^(93)?0?7\d{8}$/', $digits)) json_out(['error' => 'Please enter a valid Afghan mobile number'], 400);
$phone = '93' . substr(preg_replace('/^93|^0/', '', $digits), -9);
if (($propertyId > 0 ? 1 : 0) + ($projectId > 0 ? 1 : 0) !== 1) json_out(['error' => 'Select one property or project'], 400);

try { $slot = new DateTimeImmutable($requestedAt, new DateTimeZone('Asia/Kabul')); }
catch (Throwable $e) { json_out(['error' => 'Choose a valid visit date and time'], 400); }
$now = new DateTimeImmutable('now', new DateTimeZone('Asia/Kabul'));
$weekday = (int) $slot->format('w');
$time = $slot->format('H:i');
if ($slot <= $now || $weekday === 5 || $time < '07:00' || $time > '20:00' || ((int) $slot->format('i')) % 30 !== 0) {
    json_out(['error' => 'Visits are available Saturday–Thursday, 07:00–20:00 Kabul time'], 400);
}
$db = db();
$listingName = '';
if ($propertyId) {
    $stmt = $db->prepare('SELECT title FROM properties WHERE id = ? LIMIT 1'); $stmt->bind_param('i', $propertyId); $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc(); if (!$row) json_out(['error' => 'Property not found'], 404); $listingName = $row['title'];
} else {
    $stmt = $db->prepare('SELECT name FROM projects WHERE id = ? LIMIT 1'); $stmt->bind_param('i', $projectId); $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc(); if (!$row) json_out(['error' => 'Project not found'], 404); $listingName = $row['name'];
    if ($unitId) { $unit = $db->prepare('SELECT unit_number,status FROM project_units WHERE id = ? AND project_id = ? LIMIT 1'); $unit->bind_param('ii', $unitId, $projectId); $unit->execute(); $unitRow = $unit->get_result()->fetch_assoc(); if (!$unitRow) json_out(['error' => 'Apartment not found'], 404); if (in_array($unitRow['status'], ['sold','rented'], true)) json_out(['error' => 'This apartment is not available for visits'], 409); $listingName .= ' — Unit ' . $unitRow['unit_number']; }
}
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$requestTime = $slot->format('Y-m-d H:i:s');
$stmt = $db->prepare('INSERT INTO visit_requests (name,phone,property_id,project_id,project_unit_id,listing_name,requested_at) VALUES (?,?,?,?,?,?,?)');
$propertyValue = $propertyId ?: null; $projectValue = $projectId ?: null; $unitValue = $unitId ?: null;
$stmt->bind_param('ssiiiss', $name, $phone, $propertyValue, $projectValue, $unitValue, $listingName, $requestTime);
if (!$stmt->execute()) json_out(['error' => 'Could not save visit request'], 500);
$id = $db->insert_id;
$event = $db->prepare("INSERT INTO visit_request_events (visit_request_id,next_status,actor,note) VALUES (?, 'pending', 'customer', 'Requested from website')");
$event->bind_param('i', $id); $event->execute();
json_out(['success' => true, 'id' => $id], 201);

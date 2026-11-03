<?php
require_once __DIR__ . '/../db.php';
cors(); require_admin();
$db = db(); $method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  $stmt = $db->prepare('SELECT * FROM visit_requests ORDER BY requested_at ASC, created_at DESC'); $stmt->execute();
  $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  foreach ($rows as &$row) { $events = $db->prepare('SELECT previous_status,next_status,actor,note,created_at FROM visit_request_events WHERE visit_request_id = ? ORDER BY created_at ASC'); $events->bind_param('i', $row['id']); $events->execute(); $row['events'] = $events->get_result()->fetch_all(MYSQLI_ASSOC); }
  json_out($rows);
}
if ($method === 'PUT') {
  $input = body(); $id = intval($input['id'] ?? 0); $next = trim($input['status'] ?? ''); $note = trim($input['staff_note'] ?? '');
  $allowed = ['pending','confirmed','declined','completed','cancelled'];
  if (!$id || !in_array($next, $allowed, true)) json_out(['error' => 'Valid id and status required'], 400);
  $old = $db->prepare('SELECT status FROM visit_requests WHERE id = ?'); $old->bind_param('i', $id); $old->execute(); $row = $old->get_result()->fetch_assoc(); if (!$row) json_out(['error' => 'Visit request not found'], 404);
  $update = $db->prepare('UPDATE visit_requests SET status = ?, staff_note = ? WHERE id = ?'); $update->bind_param('ssi', $next, $note, $id); $update->execute();
  $actor = 'admin'; $event = $db->prepare('INSERT INTO visit_request_events (visit_request_id,previous_status,next_status,actor,note) VALUES (?,?,?,?,?)'); $event->bind_param('issss', $id, $row['status'], $next, $actor, $note); $event->execute();
  json_out(['success' => true]);
}
json_out(['error' => 'Method not allowed'], 405);

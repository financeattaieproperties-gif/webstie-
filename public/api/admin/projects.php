<?php
require_once __DIR__ . '/../db.php';
cors();
require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = db()->prepare('SELECT * FROM projects ORDER BY created_at DESC');
    $stmt->execute();
    $rows = [];
    while ($row = $stmt->get_result()->fetch_assoc()) {
        $rows[] = $row;
    }
    json_out($rows);
}

if ($method === 'POST') {
    $b = body();
    foreach (['name', 'location', 'status'] as $f) {
        if (empty($b[$f])) json_out(['error' => "$f required"], 400);
    }
    $avail = intval($b['available_units'] ?? 0);
    $total = intval($b['total_units']     ?? 0);
    $del   = $b['delivery_date'] ?? null;
    $img   = $b['image_url']     ?? null;
    $gallery = isset($b['gallery_images']) && is_array($b['gallery_images']) ? json_encode(array_values(array_filter($b['gallery_images']))) : null;
    $video = trim($b['video_url'] ?? '') ?: null;
    $masterplan = trim($b['masterplan_image'] ?? '') ?: null;
    $desc  = $b['description']   ?? null;
    $stmt  = db()->prepare(
        'INSERT INTO projects (name,location,delivery_date,status,available_units,total_units,image_url,gallery_images,video_url,masterplan_image,description)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    );
    $stmt->bind_param('ssssiisssss', $b['name'], $b['location'], $del, $b['status'], $avail, $total, $img, $gallery, $video, $masterplan, $desc);
    $stmt->execute();
    json_out(['id' => db()->insert_id], 201);
}

if ($method === 'PUT') {
    $b  = body();
    $id = intval($b['id'] ?? 0);
    if (!$id) json_out(['error' => 'id required'], 400);
    $avail = intval($b['available_units'] ?? 0);
    $total = intval($b['total_units']     ?? 0);
    $del   = $b['delivery_date'] ?? null;
    $img   = $b['image_url']     ?? null;
    $gallery = isset($b['gallery_images']) && is_array($b['gallery_images']) ? json_encode(array_values(array_filter($b['gallery_images']))) : null;
    $video = trim($b['video_url'] ?? '') ?: null;
    $masterplan = trim($b['masterplan_image'] ?? '') ?: null;
    $desc  = $b['description']   ?? null;
    $stmt  = db()->prepare(
        'UPDATE projects SET name=?,location=?,delivery_date=?,status=?,
         available_units=?,total_units=?,image_url=?,gallery_images=?,video_url=?,masterplan_image=?,description=? WHERE id=?'
    );
    $stmt->bind_param('ssssiisssssi', $b['name'], $b['location'], $del, $b['status'], $avail, $total, $img, $gallery, $video, $masterplan, $desc, $id);
    $stmt->execute();
    json_out(['updated' => $stmt->affected_rows]);
}

if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) json_out(['error' => 'id required'], 400);
    $stmt = db()->prepare('DELETE FROM projects WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    json_out(['deleted' => $stmt->affected_rows]);
}

json_out(['error' => 'Method not allowed'], 405);

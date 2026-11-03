<?php
require_once __DIR__ . '/../db.php';
cors();
require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = db()->prepare('SELECT id,name,role,background,portrait_url,phone,email,whatsapp,published,created_at FROM agents ORDER BY name ASC');
    $stmt->execute();
    $rows = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int) $row['id'];
        $row['published'] = (bool) $row['published'];
        $rows[] = $row;
    }
    json_out($rows);
}

if ($method === 'POST' || $method === 'PUT') {
    $b = body();
    $id = (int) ($b['id'] ?? 0);
    $name = trim($b['name'] ?? '');
    $role = trim($b['role'] ?? '');
    $background = trim($b['background'] ?? '');
    $portrait = trim($b['portrait_url'] ?? '');
    $phone = trim($b['phone'] ?? '');
    $email = trim($b['email'] ?? '');
    $whatsapp = trim($b['whatsapp'] ?? '') ?: null;
    $published = !empty($b['published']) ? 1 : 0;

    if ($method === 'PUT' && $id < 1) json_out(['error' => 'Valid id required'], 400);
    foreach (['name' => $name, 'role' => $role, 'background' => $background, 'portrait_url' => $portrait, 'phone' => $phone, 'email' => $email] as $field => $value) {
        if ($value === '') json_out(['error' => "$field is required"], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_out(['error' => 'Valid email required'], 400);

    if ($method === 'POST') {
        $stmt = db()->prepare('INSERT INTO agents (name,role,background,portrait_url,phone,email,whatsapp,published) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->bind_param('sssssssi', $name, $role, $background, $portrait, $phone, $email, $whatsapp, $published);
        $stmt->execute();
        json_out(['id' => db()->insert_id], 201);
    }
    $stmt = db()->prepare('UPDATE agents SET name=?,role=?,background=?,portrait_url=?,phone=?,email=?,whatsapp=?,published=? WHERE id=?');
    $stmt->bind_param('sssssssii', $name, $role, $background, $portrait, $phone, $email, $whatsapp, $published, $id);
    $stmt->execute();
    json_out(['updated' => $stmt->affected_rows]);
}

if ($method === 'DELETE') {
    $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if (!$id) json_out(['error' => 'Valid id required'], 400);
    $stmt = db()->prepare('DELETE FROM agents WHERE id=?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    json_out(['deleted' => $stmt->affected_rows]);
}

json_out(['error' => 'Method not allowed'], 405);

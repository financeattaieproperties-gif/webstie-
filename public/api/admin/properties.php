<?php
require_once __DIR__ . '/../db.php';
cors();
require_admin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = db()->prepare('SELECT * FROM properties ORDER BY created_at DESC');
    $stmt->execute();
    $rows = [];
    while ($row = $stmt->get_result()->fetch_assoc()) {
        $rows[] = $row;
    }
    json_out($rows);
}

if ($method === 'POST') {
    $b = body();
    foreach (['title', 'price', 'location', 'status', 'type', 'listing_type'] as $f) {
        if (empty($b[$f])) json_out(['error' => "$f required"], 400);
    }
    $beds  = isset($b['beds'])  && $b['beds']  !== '' ? intval($b['beds'])   : null;
    $baths = isset($b['baths']) && $b['baths'] !== '' ? intval($b['baths'])  : null;
    $area  = isset($b['area'])  && $b['area']  !== '' ? floatval($b['area']) : null;
    $floor = isset($b['floor']) && $b['floor'] !== '' ? intval($b['floor'])  : null;
    $price = floatval($b['price']);
    $img   = $b['image_url']   ?? null;
    $desc  = $b['description'] ?? null;
    $stmt  = db()->prepare(
        'INSERT INTO properties (title,price,location,beds,baths,area,floor,status,type,listing_type,image_url,description)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
    );
    $stmt->bind_param('sdsiidisssss',
        $b['title'], $price, $b['location'],
        $beds, $baths, $area, $floor,
        $b['status'], $b['type'], $b['listing_type'],
        $img, $desc
    );
    $stmt->execute();
    json_out(['id' => db()->insert_id], 201);
}

if ($method === 'PUT') {
    $b  = body();
    $id = intval($b['id'] ?? 0);
    if (!$id) json_out(['error' => 'id required'], 400);
    $beds  = isset($b['beds'])  && $b['beds']  !== '' ? intval($b['beds'])   : null;
    $baths = isset($b['baths']) && $b['baths'] !== '' ? intval($b['baths'])  : null;
    $area  = isset($b['area'])  && $b['area']  !== '' ? floatval($b['area']) : null;
    $floor = isset($b['floor']) && $b['floor'] !== '' ? intval($b['floor'])  : null;
    $price = floatval($b['price'] ?? 0);
    $img   = $b['image_url']   ?? null;
    $desc  = $b['description'] ?? null;
    $stmt  = db()->prepare(
        'UPDATE properties SET title=?,price=?,location=?,beds=?,baths=?,area=?,floor=?,
         status=?,type=?,listing_type=?,image_url=?,description=? WHERE id=?'
    );
    $stmt->bind_param('sdsiidissssi',
        $b['title'], $price, $b['location'],
        $beds, $baths, $area, $floor,
        $b['status'], $b['type'], $b['listing_type'],
        $img, $desc, $id
    );
    $stmt->execute();
    json_out(['updated' => $stmt->affected_rows]);
}

if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) json_out(['error' => 'id required'], 400);
    $stmt = db()->prepare('DELETE FROM properties WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    json_out(['deleted' => $stmt->affected_rows]);
}

json_out(['error' => 'Method not allowed'], 405);

<?php
require_once __DIR__ . '/../db.php';
cors();
require_admin();

$method = $_SERVER['REQUEST_METHOD'];

function decode_gallery(?string $raw): array {
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

if ($method === 'GET') {
    $stmt = db()->prepare('SELECT * FROM properties ORDER BY created_at DESC');
    $stmt->execute();
    $rows = [];
    while ($row = $stmt->get_result()->fetch_assoc()) {
        $row['gallery_images'] = decode_gallery($row['gallery_images'] ?? null);
        $rows[] = $row;
    }
    json_out($rows);
}

if ($method === 'POST') {
    $b = body();
    foreach (['serial_number', 'title', 'price', 'location', 'status', 'type', 'listing_type'] as $f) {
        if (empty($b[$f])) json_out(['error' => "$f required"], 400);
    }
    $serial = trim($b['serial_number']);
    $beds    = isset($b['beds'])  && $b['beds']  !== '' ? intval($b['beds'])   : null;
    $baths   = isset($b['baths']) && $b['baths'] !== '' ? intval($b['baths'])  : null;
    $area    = isset($b['area'])  && $b['area']  !== '' ? floatval($b['area']) : null;
    $floor   = isset($b['floor']) && $b['floor'] !== '' ? intval($b['floor'])  : null;
    $price   = floatval($b['price']);
    $img     = $b['image_url']   ?? null;
    $desc    = $b['description'] ?? null;
    $gallery = isset($b['gallery_images']) && is_array($b['gallery_images'])
               ? json_encode(array_values(array_filter($b['gallery_images'])))
               : null;
    $video   = isset($b['video_url']) && $b['video_url'] !== '' ? trim($b['video_url']) : null;

    // s=title d=price s=location i=beds i=baths d=area i=floor s=status s=type s=listing_type s=img s=desc s=gallery s=video → 14 params
    $stmt = db()->prepare(
        'INSERT INTO properties (serial_number,title,price,location,beds,baths,area,floor,status,type,listing_type,image_url,description,gallery_images,video_url)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    );
    $stmt->bind_param('ssdsiidisssssss',
        $serial, $b['title'], $price, $b['location'],
        $beds, $baths, $area, $floor,
        $b['status'], $b['type'], $b['listing_type'],
        $img, $desc, $gallery, $video
    );
    $stmt->execute();
    json_out(['id' => db()->insert_id], 201);
}

if ($method === 'PUT') {
    $b  = body();
    $id = intval($b['id'] ?? 0);
    if (!$id) json_out(['error' => 'id required'], 400);
    if (empty($b['serial_number'])) json_out(['error' => 'serial_number required'], 400);
    $serial = trim($b['serial_number']);
    $beds    = isset($b['beds'])  && $b['beds']  !== '' ? intval($b['beds'])   : null;
    $baths   = isset($b['baths']) && $b['baths'] !== '' ? intval($b['baths'])  : null;
    $area    = isset($b['area'])  && $b['area']  !== '' ? floatval($b['area']) : null;
    $floor   = isset($b['floor']) && $b['floor'] !== '' ? intval($b['floor'])  : null;
    $price   = floatval($b['price'] ?? 0);
    $img     = $b['image_url']   ?? null;
    $desc    = $b['description'] ?? null;
    $gallery = isset($b['gallery_images']) && is_array($b['gallery_images'])
               ? json_encode(array_values(array_filter($b['gallery_images'])))
               : null;
    $video   = isset($b['video_url']) && $b['video_url'] !== '' ? trim($b['video_url']) : null;

    // s=title d=price s=location i=beds i=baths d=area i=floor s=status s=type s=listing_type s=img s=desc s=gallery s=video i=id → 15 params
    $stmt = db()->prepare(
        'UPDATE properties SET serial_number=?,title=?,price=?,location=?,beds=?,baths=?,area=?,floor=?,
         status=?,type=?,listing_type=?,image_url=?,description=?,gallery_images=?,video_url=? WHERE id=?'
    );
    $stmt->bind_param('ssdsiidisssssssi',
        $serial, $b['title'], $price, $b['location'],
        $beds, $baths, $area, $floor,
        $b['status'], $b['type'], $b['listing_type'],
        $img, $desc, $gallery, $video, $id
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

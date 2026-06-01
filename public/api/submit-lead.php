<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

// Validate required fields
$required = ['name', 'email', 'phone'];
foreach ($required as $field) {
    if (empty(trim($input[$field] ?? ''))) {
        http_response_code(400);
        echo json_encode(['error' => "Field '{$field}' is required"]);
        exit;
    }
}

$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);
if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// ── Database config ───────────────────────────────────────────────────────────
// Edit these values in cPanel (or use environment variables / a config file)
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'your_db_name');
// ─────────────────────────────────────────────────────────────────────────────

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$stmt = $conn->prepare(
    'INSERT INTO leads
        (name, email, phone, message, property_id, property_name, stage, source, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())'
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Query prepare failed: ' . $conn->error]);
    exit;
}

$name         = trim($input['name']);
$phone        = trim($input['phone']);
$message      = trim($input['message'] ?? '');
$propertyId   = trim($input['propertyId'] ?? '');
$propertyName = trim($input['propertyName'] ?? 'General Inquiry');
$stage        = 'New';
$source       = 'Website';
$status       = 'Pending';

$stmt->bind_param(
    'sssssssss',
    $name, $email, $phone, $message,
    $propertyId, $propertyName,
    $stage, $source, $status
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save lead: ' . $stmt->error]);
}

$stmt->close();
$conn->close();

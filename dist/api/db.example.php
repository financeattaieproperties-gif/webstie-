<?php
// Copy this file to db.php and fill in real values before deploying to cPanel.
define('DB_HOST',    'localhost');
define('DB_USER',    'your_cpanel_db_user');
define('DB_PASS',    'your_cpanel_db_password');
define('DB_NAME',    'your_cpanel_db_name');
define('ADMIN_USER', 'admin');
define('ADMIN_PASS', 'choose_a_strong_password');

function db(): mysqli {
    static $conn = null;
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'DB connection failed']);
            exit;
        }
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}

function cors(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

function json_out(mixed $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function require_admin(): void {
    session_start();
    if (empty($_SESSION['admin'])) {
        json_out(['error' => 'Unauthorized'], 401);
    }
}

function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

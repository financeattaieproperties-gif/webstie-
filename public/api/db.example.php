<?php
// Copy this file to db.php and fill in real values before deploying to cPanel.
mysqli_report(MYSQLI_REPORT_OFF);

define('DB_HOST',    'localhost');
define('DB_USER',    'your_cpanel_db_user');
define('DB_PASS',    'your_cpanel_db_password');
define('DB_NAME',    'your_cpanel_db_name');
define('ADMIN_USER', 'admin');
define('ADMIN_PASS', 'choose_a_strong_password');

// ── Etisalat CPaaS Click-to-Call (CTC) Configuration ───────────────────────────
// Fill these in from your Etisalat CPaaS account manager (or set via cPanel Env Vars):
define('CTC_BASE_URL',          ''); // e.g. 'https://cpaas.etisalat.af/Cpaas/api/clicktocall'
define('CTC_USERNAME',          ''); // Your Etisalat CPaaS API username
define('CTC_PASSWORD',          ''); // Your Etisalat CPaaS API password
define('CTC_CLI',               ''); // Caller ID number provided by Etisalat (e.g. '93782222279')
define('CTC_CALLCENTER_NUMBER', '93782222279'); // Your call-center/agent number that rings FIRST (apartyno)

function ctc_env(string $key, string $default = ''): string {
    $envVal = getenv($key);
    if ($envVal !== false && trim((string) $envVal) !== '') {
        return trim((string) $envVal);
    }
    if (!empty($_ENV[$key])) {
        return trim((string) $_ENV[$key]);
    }
    if (!empty($_SERVER[$key])) {
        return trim((string) $_SERVER[$key]);
    }
    if (defined($key) && trim((string) constant($key)) !== '') {
        return trim((string) constant($key));
    }
    return $default;
}

function db(): mysqli {
    static $conn = null;
    if ($conn === null) {
        $conn = mysqli_init();
        if ($conn && defined('MYSQLI_OPT_INT_AND_FLOAT_NATIVE')) {
            $conn->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, 1);
        }
        $connected = $conn ? @$conn->real_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) : false;
        if (!$connected || $conn->connect_error) {
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
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['admin'])) {
        json_out(['error' => 'Unauthorized'], 401);
    }
}

function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}


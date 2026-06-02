<?php
require_once __DIR__ . '/db.php';
cors();
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'POST only'], 405);
}

$b    = body();
$user = trim($b['username'] ?? '');
$pass = trim($b['password'] ?? '');

if ($user !== ADMIN_USER || $pass !== ADMIN_PASS) {
    json_out(['error' => 'Invalid credentials'], 401);
}

$_SESSION['admin'] = true;
json_out(['success' => true]);

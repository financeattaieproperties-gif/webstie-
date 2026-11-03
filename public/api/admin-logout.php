<?php
require_once __DIR__ . '/db.php';
cors();
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$_SESSION = [];
session_destroy();
json_out(['success' => true]);


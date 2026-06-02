<?php
require_once __DIR__ . '/db.php';
cors();
session_start();
session_destroy();
json_out(['success' => true]);

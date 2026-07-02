<?php
// Etisalat CPaaS Click-to-Call — public endpoint.
// POST { "customer_number": "0789123456" }
// Rings call center first (apartyno), then bridges in customer (bpartyno).

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/ctc/ctc_auth.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Lock CORS to production domain — update if domain changes
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://attaieproperties.com', 'https://www.attaieproperties.com'];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Method not allowed'], 405);
}

$input          = body();
$customerNumber = trim($input['customer_number'] ?? '');

// IP — prefer forwarded header when behind a proxy
$ipAddress = filter_var(
    explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0],
    FILTER_VALIDATE_IP
) ?: ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');

// ── 1. Validate Afghan mobile format ───────────────────────────────────────────
$digitsOnly = preg_replace('/\D/', '', $customerNumber);
if (!preg_match('/^(93)?0?7\d{8}$/', $digitsOnly)) {
    json_out(['error' => 'Please enter a valid Afghan mobile number'], 400);
}
// Normalize to 93XXXXXXXXX (confirm exact format with Etisalat before going live)
$normalizedNumber = '93' . substr(preg_replace('/^93|^0/', '', $digitsOnly), -9);

$conn = db();

// ── 2. Rate limit: 3 per IP per 10 min ─────────────────────────────────────────
$stmt = $conn->prepare(
    "SELECT COUNT(*) AS cnt FROM ctc_public_call_log
     WHERE ip_address = ? AND created_at > NOW() - INTERVAL 10 MINUTE"
);
$stmt->bind_param('s', $ipAddress);
$stmt->execute();
if ((int) $stmt->get_result()->fetch_assoc()['cnt'] >= 3) {
    $stmt->close();
    json_out(['error' => 'Too many requests. Please try again later.'], 429);
}
$stmt->close();

// ── 3. Rate limit: 1 per number per 2 min ──────────────────────────────────────
$stmt2 = $conn->prepare(
    "SELECT COUNT(*) AS cnt FROM ctc_public_call_log
     WHERE customer_number = ? AND created_at > NOW() - INTERVAL 2 MINUTE"
);
$stmt2->bind_param('s', $normalizedNumber);
$stmt2->execute();
if ((int) $stmt2->get_result()->fetch_assoc()['cnt'] >= 1) {
    $stmt2->close();
    json_out(['error' => 'A call was just requested for this number. Please wait a moment.'], 429);
}
$stmt2->close();

// ── 4. Log attempt ──────────────────────────────────────────────────────────────
$ins = $conn->prepare(
    "INSERT INTO ctc_public_call_log (customer_number, ip_address, reference_id, status)
     VALUES (?, ?, 0, 'initiated')"
);
$ins->bind_param('ss', $normalizedNumber, $ipAddress);
$ins->execute();
$callLogId = (int) $conn->insert_id;
$ins->close();

$upd = $conn->prepare("UPDATE ctc_public_call_log SET reference_id = ? WHERE id = ?");
$upd->bind_param('ii', $callLogId, $callLogId);
$upd->execute();
$upd->close();

// ── 5. Call Etisalat ────────────────────────────────────────────────────────────
$ctcBase = rtrim((string) getenv('CTC_BASE_URL'), '/');

try {
    $idToken = ctc_get_token();

    $payload = json_encode([
        'cli'           => getenv('CTC_CLI'),
        'apartyno'      => getenv('CTC_CALLCENTER_NUMBER'),
        'bpartyno'      => $normalizedNumber,
        'reference_id'  => $callLogId,
        'dtmfflag'      => 0,
        'recordingflag' => 0,
    ]);

    $ch = curl_init($ctcBase . '/initiate-call');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $idToken,
        ],
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $responseData  = json_decode($response, true);
    $callSucceeded = ($httpCode === 200 && ($responseData['status'] ?? 0) === 1);
    $status        = $callSucceeded ? 'initiated' : 'failed';
    $requestId     = $responseData['requestid'] ?? null;

    $upd2 = $conn->prepare(
        "UPDATE ctc_public_call_log
         SET status = ?, etisalat_request_id = ?, response_payload = ?
         WHERE id = ?"
    );
    $upd2->bind_param('sssi', $status, $requestId, $response, $callLogId);
    $upd2->execute();
    $upd2->close();

    if (!$callSucceeded) {
        json_out(['error' => 'Could not connect the call right now. Please try again.'], 502);
    }

    json_out(['success' => true]);

} catch (Throwable $e) {
    $fail = $conn->prepare("UPDATE ctc_public_call_log SET status = 'failed' WHERE id = ?");
    $fail->bind_param('i', $callLogId);
    $fail->execute();
    $fail->close();
    json_out(['error' => 'Something went wrong. Please try again.'], 500);
}

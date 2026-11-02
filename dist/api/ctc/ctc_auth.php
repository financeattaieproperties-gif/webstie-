<?php
// Etisalat CPaaS Click-to-Call — token helper.
// Requires db() from db.php to be available.
// Caches the token in ctc_auth_cache table to avoid re-authenticating on every request.

function ctc_get_token(): string {
    $conn = db();
    $ctcBase = rtrim((string) getenv('CTC_BASE_URL'), '/');

    $result = $conn->query("SELECT id_token, expires_at FROM ctc_auth_cache WHERE id = 1");
    $row = $result ? $result->fetch_assoc() : null;

    if ($row && strtotime($row['expires_at']) > time() + 60) {
        return $row['id_token'];
    }

    $ch = curl_init($ctcBase . '/AuthToken');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode([
            'username' => getenv('CTC_USERNAME'),
            'password' => getenv('CTC_PASSWORD'),
        ]),
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new RuntimeException("CTC AuthToken failed: HTTP $httpCode — response: $response");
    }

    $data = json_decode($response, true);
    if (empty($data['idToken'])) {
        throw new RuntimeException("CTC AuthToken response missing idToken: $response");
    }

    $idToken   = $data['idToken'];
    $expiresAt = date('Y-m-d H:i:s', time() + (9 * 3600)); // conservative 9 hr cache

    $stmt = $conn->prepare(
        "INSERT INTO ctc_auth_cache (id, id_token, expires_at) VALUES (1, ?, ?)
         ON DUPLICATE KEY UPDATE id_token = ?, expires_at = ?"
    );
    $stmt->bind_param('ssss', $idToken, $expiresAt, $idToken, $expiresAt);
    $stmt->execute();
    $stmt->close();

    return $idToken;
}

<?php
/**
 * Server-side SEO Metadata & OpenGraph Pre-Renderer for Attaie Properties
 *
 * When a browser, search engine crawler (Googlebot, Bingbot), or social media bot
 * (WhatsApp, Facebook, Telegram, Twitter/X, LinkedIn) requests /properties/{id},
 * /projects/{id}, or /agents/{id}, this script reads index.html and replaces the
 * default <title>, <meta name="description">, OpenGraph tags, Twitter Card tags,
 * canonical URL, and Schema.org JSON-LD with live data from MySQL.
 *
 * If db.php is not yet configured or the record is not found, it falls back
 * gracefully to serving index.html unchanged.
 */

$indexPath = __DIR__ . '/index.html';
if (!is_file($indexPath)) {
    http_response_code(404);
    echo 'index.html not found';
    exit;
}

$html = file_get_contents($indexPath);
$siteUrl = 'https://website.attaieproperties.com';
$defaultImage = $siteUrl . '/logo.png';

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

function seo_abs_url(string $siteUrl, ?string $pathOrUrl, string $fallback): string {
    if (!$pathOrUrl || trim($pathOrUrl) === '') return $fallback;
    $trimmed = trim($pathOrUrl);
    if (preg_match('#^https?://#i', $trimmed)) return $trimmed;
    return $siteUrl . '/' . ltrim($trimmed, '/');
}

function seo_truncate(string $text, int $max = 158): string {
    $clean = trim(preg_replace('/\s+/', ' ', strip_tags($text)));
    if (mb_strlen($clean) <= $max) return $clean;
    $sliced = mb_substr($clean, 0, $max - 1);
    $lastSpace = mb_strrpos($sliced, ' ');
    if ($lastSpace !== false && $lastSpace > 80) {
        $sliced = mb_substr($sliced, 0, $lastSpace);
    }
    return rtrim($sliced) . '…';
}

$meta = null;

if (preg_match('#^/(properties|projects|agents)/(\d+)/?$#', $uri, $m) && is_file(__DIR__ . '/api/db.php')) {
    $routeType = $m[1];
    $entityId  = (int) $m[2];

    require_once __DIR__ . '/api/db.php';
    $conn = @db();

    if ($conn && !$conn->connect_error && $entityId > 0) {
        if ($routeType === 'properties') {
            $stmt = $conn->prepare('SELECT * FROM properties WHERE id = ? LIMIT 1');
            if ($stmt) {
                $stmt->bind_param('i', $entityId);
                if ($stmt->execute()) {
                    $row = $stmt->get_result()->fetch_assoc();
                    if ($row) {
                        $listingLabel = ($row['listing_type'] ?? 'sale') === 'rent' ? 'For Rent' : 'For Sale';
                        $priceNum = (float) ($row['price'] ?? 0);
                        $priceFormatted = ($row['listing_type'] ?? 'sale') === 'rent'
                            ? '$' . number_format($priceNum) . '/mo'
                            : '$' . number_format($priceNum);
                        $title = sprintf(
                            '%s — %s %s in %s (%s) | Attaie Properties',
                            $row['title'],
                            $row['type'],
                            $listingLabel,
                            $row['location'],
                            $priceFormatted
                        );
                        $specs = array_filter([
                            $row['beds'] !== null ? ((int) $row['beds']) . ' bed' : null,
                            $row['baths'] !== null ? ((int) $row['baths']) . ' bath' : null,
                            $row['area'] !== null ? ((float) $row['area']) . ' m²' : null,
                        ]);
                        $specStr = implode(', ', $specs);
                        $rawDesc = !empty($row['description']) && mb_strlen(trim($row['description'])) > 30
                            ? trim($row['description']) . ' — ' . ($specStr ? "$specStr. " : '') . "Priced at $priceFormatted in {$row['location']}, Kabul."
                            : "{$row['title']}: " . ($specStr ? "$specStr " : '') . strtolower($row['type']) . ' ' . strtolower($listingLabel) . " in {$row['location']}, Kabul. Priced at $priceFormatted.";
                        $desc = seo_truncate($rawDesc, 158);
                        $gallery = !empty($row['gallery_images']) ? json_decode($row['gallery_images'], true) : [];
                        $firstGallery = is_array($gallery) && count($gallery) > 0 ? $gallery[0] : null;
                        $img = seo_abs_url($siteUrl, $row['image_url'] ?: $firstGallery, $defaultImage);
                        $canonical = "$siteUrl/properties/$entityId";

                        $jsonLd = [
                            '@context' => 'https://schema.org',
                            '@type' => 'RealEstateListing',
                            'name' => $row['title'],
                            'url' => $canonical,
                            'description' => $desc,
                            'identifier' => $row['serial_number'] ?: (string) $entityId,
                            'image' => [$img],
                            'offers' => [
                                '@type' => 'Offer',
                                'price' => $priceNum,
                                'priceCurrency' => 'USD',
                                'url' => $canonical,
                            ],
                        ];

                        $meta = [
                            'title' => $title,
                            'description' => $desc,
                            'canonical' => $canonical,
                            'ogType' => 'article',
                            'image' => $img,
                            'imageAlt' => $row['title'] . ' — ' . $row['location'],
                            'jsonLd' => $jsonLd,
                        ];
                    }
                }
            }
        } elseif ($routeType === 'projects') {
            $stmt = $conn->prepare('SELECT * FROM projects WHERE id = ? LIMIT 1');
            if ($stmt) {
                $stmt->bind_param('i', $entityId);
                if ($stmt->execute()) {
                    $row = $stmt->get_result()->fetch_assoc();
                    if ($row) {
                        $title = sprintf(
                            '%s — %s Development in %s | Attaie Properties',
                            $row['name'],
                            $row['status'],
                            $row['location']
                        );
                        $avail = (int) ($row['available_units'] ?? 0);
                        $total = (int) ($row['total_units'] ?? 0);
                        $unitSummary = $total > 0 ? "$avail of $total units available." : ($avail > 0 ? "$avail units available." : '');
                        $rawDesc = !empty($row['description']) && mb_strlen(trim($row['description'])) > 30
                            ? trim($row['description']) . ' ' . $unitSummary
                            : "{$row['name']} is a " . strtolower($row['status']) . " real estate development in {$row['location']}, Kabul by Attaie Properties. $unitSummary";
                        $desc = seo_truncate($rawDesc, 158);
                        $gallery = !empty($row['gallery_images']) ? json_decode($row['gallery_images'], true) : [];
                        $firstGallery = is_array($gallery) && count($gallery) > 0 ? $gallery[0] : null;
                        $img = seo_abs_url($siteUrl, $row['image_url'] ?: ($firstGallery ?: $row['masterplan_image']), $defaultImage);
                        $canonical = "$siteUrl/projects/$entityId";

                        $jsonLd = [
                            '@context' => 'https://schema.org',
                            '@type' => 'ApartmentComplex',
                            'name' => $row['name'],
                            'url' => $canonical,
                            'description' => $desc,
                            'image' => [$img],
                            'address' => [
                                '@type' => 'PostalAddress',
                                'streetAddress' => $row['location'],
                                'addressLocality' => 'Kabul',
                                'addressCountry' => 'AF',
                            ],
                        ];

                        $meta = [
                            'title' => $title,
                            'description' => $desc,
                            'canonical' => $canonical,
                            'ogType' => 'article',
                            'image' => $img,
                            'imageAlt' => $row['name'] . ' — ' . $row['location'],
                            'jsonLd' => $jsonLd,
                        ];
                    }
                }
            }
        } elseif ($routeType === 'agents') {
            $stmt = $conn->prepare('SELECT * FROM agents WHERE id = ? AND published = 1 LIMIT 1');
            if ($stmt) {
                $stmt->bind_param('i', $entityId);
                if ($stmt->execute()) {
                    $row = $stmt->get_result()->fetch_assoc();
                    if ($row) {
                        $title = sprintf('%s — %s | Attaie Properties', $row['name'], $row['role']);
                        $desc = seo_truncate($row['background'] ?? "{$row['name']}, {$row['role']} at Attaie Properties in Kabul.", 158);
                        $img = seo_abs_url($siteUrl, $row['portrait_url'] ?? null, $defaultImage);
                        $canonical = "$siteUrl/agents/$entityId";

                        $meta = [
                            'title' => $title,
                            'description' => $desc,
                            'canonical' => $canonical,
                            'ogType' => 'profile',
                            'image' => $img,
                            'imageAlt' => $row['name'] . ' — ' . $row['role'],
                            'jsonLd' => [
                                '@context' => 'https://schema.org',
                                '@type' => 'Person',
                                'name' => $row['name'],
                                'jobTitle' => $row['role'],
                                'description' => $desc,
                                'image' => $img,
                                'url' => $canonical,
                            ],
                        ];
                    }
                }
            }
        }
    }
}

if ($meta !== null) {
    $escTitle = htmlspecialchars($meta['title'], ENT_QUOTES, 'UTF-8');
    $escDesc  = htmlspecialchars($meta['description'], ENT_QUOTES, 'UTF-8');
    $escUrl   = htmlspecialchars($meta['canonical'], ENT_QUOTES, 'UTF-8');
    $escType  = htmlspecialchars($meta['ogType'], ENT_QUOTES, 'UTF-8');
    $escImg   = htmlspecialchars($meta['image'], ENT_QUOTES, 'UTF-8');
    $escAlt   = htmlspecialchars($meta['imageAlt'], ENT_QUOTES, 'UTF-8');
    $jsonLdStr = json_encode($meta['jsonLd'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $html = preg_replace('#<title[^>]*>.*?</title>#is', '<title data-rh="true">' . $escTitle . '</title>', $html, 1);
    $html = preg_replace('#<meta\s+name="description"[^>]*>#is', '<meta name="description" content="' . $escDesc . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<link\s+rel="canonical"[^>]*>#is', '<link rel="canonical" href="' . $escUrl . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+property="og:type"[^>]*>#is', '<meta property="og:type" content="' . $escType . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+property="og:title"[^>]*>#is', '<meta property="og:title" content="' . $escTitle . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+property="og:description"[^>]*>#is', '<meta property="og:description" content="' . $escDesc . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+property="og:image"\s+content="[^"]*"[^>]*>#is', '<meta property="og:image" content="' . $escImg . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+property="og:image:alt"[^>]*>#is', '<meta property="og:image:alt" content="' . $escAlt . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+property="og:url"[^>]*>#is', '<meta property="og:url" content="' . $escUrl . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+name="twitter:title"[^>]*>#is', '<meta name="twitter:title" content="' . $escTitle . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+name="twitter:description"[^>]*>#is', '<meta name="twitter:description" content="' . $escDesc . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+name="twitter:image"\s+content="[^"]*"[^>]*>#is', '<meta name="twitter:image" content="' . $escImg . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<meta\s+name="twitter:image:alt"[^>]*>#is', '<meta name="twitter:image:alt" content="' . $escAlt . '" data-rh="true" />', $html, 1);
    $html = preg_replace('#<script\s+type="application/ld\+json"[^>]*>.*?</script>#is', '<script type="application/ld+json" data-rh="true">' . $jsonLdStr . '</script>', $html, 1);
}

header('Content-Type: text/html; charset=utf-8');
echo $html;

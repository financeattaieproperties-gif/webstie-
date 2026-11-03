<?php
/**
 * Shared Sitemap XML Builder & Disk Updater for Attaie Properties
 *
 * Queries live property, project, and published agent IDs from MySQL,
 * returns the XML sitemap string, and writes it to `/sitemap.xml` on disk
 * so both static file serving and dynamic requests stay 100% synchronized.
 */

function build_and_save_sitemap(string $siteUrl = 'https://website.attaieproperties.com'): string {
    $siteUrl = rtrim($siteUrl, '/');
    $today = gmdate('Y-m-d');

    $urls = [
        ['loc' => "$siteUrl/",           'changefreq' => 'daily',   'priority' => '1.0', 'lastmod' => $today],
        ['loc' => "$siteUrl/properties", 'changefreq' => 'daily',   'priority' => '0.9', 'lastmod' => $today],
        ['loc' => "$siteUrl/projects",   'changefreq' => 'weekly',  'priority' => '0.8', 'lastmod' => $today],
        ['loc' => "$siteUrl/agents",     'changefreq' => 'weekly',  'priority' => '0.7', 'lastmod' => $today],
        ['loc' => "$siteUrl/about",      'changefreq' => 'monthly', 'priority' => '0.6', 'lastmod' => $today],
        ['loc' => "$siteUrl/contact",    'changefreq' => 'monthly', 'priority' => '0.7', 'lastmod' => $today],
    ];

    if (function_exists('db') || is_file(__DIR__ . '/db.php')) {
        if (!function_exists('db')) {
            require_once __DIR__ . '/db.php';
        }
        $conn = @db();
        if ($conn && !$conn->connect_error) {
            // 1. Live Properties
            $res = @$conn->query('SELECT id, updated_at, created_at FROM properties ORDER BY id DESC');
            if ($res) {
                while ($row = $res->fetch_assoc()) {
                    $id = (int) ($row['id'] ?? 0);
                    if ($id > 0) {
                        $ts = $row['updated_at'] ?? $row['created_at'] ?? null;
                        $lastmod = $ts ? substr((string) $ts, 0, 10) : $today;
                        $urls[] = [
                            'loc'        => "$siteUrl/properties/$id",
                            'changefreq' => 'weekly',
                            'priority'   => '0.8',
                            'lastmod'    => $lastmod,
                        ];
                    }
                }
            }

            // 2. Live Projects
            $res = @$conn->query('SELECT id, updated_at, created_at FROM projects ORDER BY id DESC');
            if ($res) {
                while ($row = $res->fetch_assoc()) {
                    $id = (int) ($row['id'] ?? 0);
                    if ($id > 0) {
                        $ts = $row['updated_at'] ?? $row['created_at'] ?? null;
                        $lastmod = $ts ? substr((string) $ts, 0, 10) : $today;
                        $urls[] = [
                            'loc'        => "$siteUrl/projects/$id",
                            'changefreq' => 'weekly',
                            'priority'   => '0.8',
                            'lastmod'    => $lastmod,
                        ];
                    }
                }
            }

            // 3. Published Agents
            $res = @$conn->query('SELECT id, updated_at, created_at FROM agents WHERE published = 1 ORDER BY id DESC');
            if ($res) {
                while ($row = $res->fetch_assoc()) {
                    $id = (int) ($row['id'] ?? 0);
                    if ($id > 0) {
                        $ts = $row['updated_at'] ?? $row['created_at'] ?? null;
                        $lastmod = $ts ? substr((string) $ts, 0, 10) : $today;
                        $urls[] = [
                            'loc'        => "$siteUrl/agents/$id",
                            'changefreq' => 'monthly',
                            'priority'   => '0.6',
                            'lastmod'    => $lastmod,
                        ];
                    }
                }
            }
        }
    }

    $lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ];

    foreach ($urls as $u) {
        $loc  = htmlspecialchars($u['loc'], ENT_XML1, 'UTF-8');
        $last = htmlspecialchars($u['lastmod'], ENT_XML1, 'UTF-8');
        $freq = htmlspecialchars($u['changefreq'], ENT_XML1, 'UTF-8');
        $prio = htmlspecialchars($u['priority'], ENT_XML1, 'UTF-8');

        $lines[] = '  <url>';
        $lines[] = "    <loc>$loc</loc>";
        $lines[] = "    <lastmod>$last</lastmod>";
        $lines[] = "    <changefreq>$freq</changefreq>";
        $lines[] = "    <priority>$prio</priority>";
        $lines[] = "    <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"$loc\" />";
        $lines[] = "    <xhtml:link rel=\"alternate\" hreflang=\"fa\" href=\"$loc\" />";
        $lines[] = "    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"$loc\" />";
        $lines[] = '  </url>';
    }

    $lines[] = '</urlset>';
    $xml = implode("\n", $lines) . "\n";

    $sitemapFile = dirname(__DIR__) . '/sitemap.xml';
    @file_put_contents($sitemapFile, $xml);

    return $xml;
}

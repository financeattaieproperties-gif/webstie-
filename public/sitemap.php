<?php
/**
 * Dynamic XML Sitemap Endpoint for Attaie Properties
 * Generates and caches sitemap.xml from live MySQL properties, projects, and agents.
 */
require_once __DIR__ . '/api/sitemap-helper.php';

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

echo build_and_save_sitemap('https://website.attaieproperties.com');

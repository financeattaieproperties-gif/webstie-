#!/usr/bin/env node
/**
 * Build-time & CLI Sitemap Generator for Attaie Properties
 *
 * Pulls live Property, Project, and Agent IDs from the PHP API endpoints:
 *   - GET {API_BASE}/get-properties.php
 *   - GET {API_BASE}/get-projects.php
 *   - GET {API_BASE}/get-agents.php
 *
 * Writes the generated XML to `public/sitemap.xml` (and `dist/sitemap.xml` if `dist/` exists).
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs
 *   SITE_URL=https://website.attaieproperties.com API_URL=https://website.attaieproperties.com/api node scripts/generate-sitemap.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://website.attaieproperties.com').replace(/\/+$/, '');
const API_BASE = (process.env.API_URL || process.env.VITE_API_URL || `${SITE_URL}/api`).replace(/\/+$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: '/',           changefreq: 'daily',   priority: '1.0' },
  { path: '/properties', changefreq: 'daily',   priority: '0.9' },
  { path: '/projects',   changefreq: 'weekly',  priority: '0.8' },
  { path: '/agents',     changefreq: 'weekly',  priority: '0.7' },
  { path: '/about',      changefreq: 'monthly', priority: '0.6' },
  { path: '/contact',    changefreq: 'monthly', priority: '0.7' },
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return TODAY;
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : TODAY;
}

async function fetchJsonList(endpoint) {
  const url = `${API_BASE}/${endpoint}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function generateSitemap() {
  const [properties, projects, agents] = await Promise.all([
    fetchJsonList('get-properties.php'),
    fetchJsonList('get-projects.php'),
    fetchJsonList('get-agents.php'),
  ]);

  const entries = [];

  // 1. Core static routes
  for (const route of STATIC_ROUTES) {
    entries.push({
      loc: `${SITE_URL}${route.path}`,
      lastmod: TODAY,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  // 2. Dynamic Property detail pages (/properties/:id)
  for (const prop of properties) {
    const id = Number(prop?.id);
    if (Number.isInteger(id) && id > 0) {
      entries.push({
        loc: `${SITE_URL}/properties/${id}`,
        lastmod: toIsoDate(prop.updated_at || prop.created_at),
        changefreq: 'weekly',
        priority: '0.8',
      });
    }
  }

  // 3. Dynamic Project detail pages (/projects/:id)
  for (const proj of projects) {
    const id = Number(proj?.id);
    if (Number.isInteger(id) && id > 0) {
      entries.push({
        loc: `${SITE_URL}/projects/${id}`,
        lastmod: toIsoDate(proj.updated_at || proj.created_at),
        changefreq: 'weekly',
        priority: '0.8',
      });
    }
  }

  // 4. Dynamic Agent profile pages (/agents/:id)
  for (const agent of agents) {
    const id = Number(agent?.id);
    if (Number.isInteger(id) && id > 0 && agent?.published !== false) {
      entries.push({
        loc: `${SITE_URL}/agents/${id}`,
        lastmod: toIsoDate(agent.updated_at || agent.created_at),
        changefreq: 'monthly',
        priority: '0.6',
      });
    }
  }

  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const entry of entries) {
    const loc = escapeXml(entry.loc);
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${loc}</loc>`);
    xmlLines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    xmlLines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
    xmlLines.push(`    <priority>${escapeXml(entry.priority)}</priority>`);
    xmlLines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />`);
    xmlLines.push(`    <xhtml:link rel="alternate" hreflang="fa" href="${loc}" />`);
    xmlLines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  xmlLines.push('');

  const xmlContent = xmlLines.join('\n');

  const publicSitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xmlContent, 'utf8');

  const distDir = path.join(ROOT_DIR, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xmlContent, 'utf8');
  }

  console.log(
    `[sitemap] Generated sitemap.xml with ${entries.length} URLs (${properties.length} properties, ${projects.length} projects, ${agents.length} agents).`
  );
}

generateSitemap();

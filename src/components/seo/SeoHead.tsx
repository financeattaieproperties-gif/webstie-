import React, { createContext, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  SEO_CONFIG,
  getRuntimeSeoSettings,
  resolveAbsoluteUrl,
  setRuntimeSeoSettings,
  type SeoMetadata,
} from '../../lib/seoConfig';
import { getSeoSettings, type SiteSeoSettings } from '../../lib/dbService';

interface SeoContextValue {
  settings: SiteSeoSettings | null;
}

const SeoContext = createContext<SeoContextValue>({ settings: null });

export const SeoSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSeoSettings | null>(() => getRuntimeSeoSettings());

  useEffect(() => {
    let active = true;
    getSeoSettings().then(data => {
      if (!active || !data) return;
      setRuntimeSeoSettings(data);
      setSettings(data);
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'attaie_seo_settings_v1' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as SiteSeoSettings;
          setRuntimeSeoSettings(parsed);
          setSettings(parsed);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      active = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return <SeoContext.Provider value={{ settings }}>{children}</SeoContext.Provider>;
};

export function useSiteSeoSettings(): SiteSeoSettings | null {
  return useContext(SeoContext).settings;
}

interface SeoHeadProps {
  seo: SeoMetadata;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ seo }) => {
  const { i18n } = useTranslation();
  const siteSettings = useSiteSeoSettings();

  const isRtl = i18n.language === 'fa';
  const htmlLang = isRtl ? 'fa' : 'en';
  const htmlDir = isRtl ? 'rtl' : 'ltr';
  const primaryLocale = isRtl ? SEO_CONFIG.alternateLocale : SEO_CONFIG.locale;
  const secondaryLocale = isRtl ? SEO_CONFIG.locale : SEO_CONFIG.alternateLocale;

  const siteName = siteSettings?.site_name?.trim() || SEO_CONFIG.siteName;
  const globalNoIndex =
    siteSettings?.robots_index !== undefined ? !siteSettings.robots_index : !SEO_CONFIG.robotsIndex;

  const {
    title: rawTitle,
    description: rawDescription,
    canonicalUrl,
    ogType = 'website',
    ogImage: rawOgImage,
    twitterImage: rawTwitterImage,
    ogImageAlt = siteName,
    keywords: pageKeywords,
    NoIndex = false,
    jsonLd,
  } = seo;

  const title = rawTitle || siteSettings?.default_title?.trim() || SEO_CONFIG.defaultTitle;
  const description =
    rawDescription || siteSettings?.default_description?.trim() || SEO_CONFIG.defaultDescription;

  const ogImage = rawOgImage
    ? resolveAbsoluteUrl(rawOgImage)
    : resolveAbsoluteUrl(siteSettings?.og_image || SEO_CONFIG.defaultImage);

  const twitterImage = rawTwitterImage
    ? resolveAbsoluteUrl(rawTwitterImage)
    : siteSettings?.twitter_image?.trim()
    ? resolveAbsoluteUrl(siteSettings.twitter_image)
    : ogImage;

  const twitterCard = siteSettings?.twitter_card || SEO_CONFIG.twitterCard;
  const twitterSite = siteSettings?.twitter_site?.trim() || SEO_CONFIG.twitterSite;

  const globalKeywords = siteSettings?.keywords
    ? siteSettings.keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean)
    : [];

  const mergedKeywords = Array.from(new Set([...(pageKeywords ?? []), ...globalKeywords]));
  const shouldNoIndex = Boolean(NoIndex || globalNoIndex);

  return (
    <Helmet prioritizeSeoTags>
      <html lang={htmlLang} dir={htmlDir} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {mergedKeywords.length > 0 && (
        <meta name="keywords" content={mergedKeywords.join(', ')} />
      )}
      <meta
        name="robots"
        content={shouldNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fa" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* OpenGraph Metadata */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={primaryLocale} />
      <meta property="og:locale:alternate" content={secondaryLocale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />

      {/* Twitter / X Card Metadata */}
      <meta name="twitter:card" content={twitterCard} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Schema.org Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

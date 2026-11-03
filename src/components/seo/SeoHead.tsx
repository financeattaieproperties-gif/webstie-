import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG, type SeoMetadata } from '../../lib/seoConfig';

interface SeoHeadProps {
  seo: SeoMetadata;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ seo }) => {
  const {
    title,
    description,
    canonicalUrl,
    ogType = 'website',
    ogImage,
    ogImageAlt = SEO_CONFIG.siteName,
    keywords,
    NoIndex = false,
    jsonLd,
  } = seo;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta
        name="robots"
        content={NoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph Metadata */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />
      <meta property="og:locale:alternate" content={SEO_CONFIG.alternateLocale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />

      {/* Twitter / X Card Metadata */}
      <meta name="twitter:card" content={SEO_CONFIG.twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
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

import type { Property, Project, Agent } from './dbService';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage: string;
  ogImageAlt?: string;
  keywords?: string[];
  NoIndex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEO_CONFIG = {
  siteName: 'Attaie Properties',
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') || 'https://website.attaieproperties.com',
  defaultTitle: 'Attaie Properties — Premier Real Estate in Kabul, Afghanistan',
  titleTemplate: '%s | Attaie Properties',
  defaultDescription:
    'Browse verified luxury villas, modern apartments, commercial spaces, and development projects for sale and rent across Kabul with Attaie Properties.',
  defaultImage: 'https://website.attaieproperties.com/logo.png',
  locale: 'en_US',
  alternateLocale: 'fa_AF',
  twitterCard: 'summary_large_image' as const,
  organizationJsonLd: {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Attaie Properties',
    url: 'https://website.attaieproperties.com',
    logo: 'https://website.attaieproperties.com/logo.png',
    image: 'https://website.attaieproperties.com/logo.png',
    telephone: '+93782222279',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kabul',
      addressCountry: 'AF',
    },
    areaServed: {
      '@type': 'City',
      name: 'Kabul',
    },
  },
};

/**
 * Ensures any relative asset or upload path (e.g. `/uploads/img_123.jpg`)
 * is converted into an absolute URL required by OpenGraph & Twitter crawlers.
 */
export function resolveAbsoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl || !pathOrUrl.trim()) {
    return SEO_CONFIG.defaultImage;
  }
  const trimmed = pathOrUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${SEO_CONFIG.siteUrl}${normalizedPath}`;
}

/**
 * Truncates text cleanly at word boundaries to fit meta description limits (120–160 chars).
 */
export function truncateMetaDescription(text: string, maxLength = 158): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  const sliced = cleaned.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

/**
 * Dynamically generates SEO metadata, OpenGraph tags, and Schema.org JSON-LD
 * for an individual Property Detail page.
 */
export function buildPropertySeo(property: Property | null, fallbackId?: string | number): SeoMetadata {
  const idPart = property?.id ?? fallbackId ?? '';
  const canonicalUrl = resolveAbsoluteUrl(`/properties/${idPart}`);

  if (!property) {
    return {
      title: 'Property Details | Attaie Properties',
      description:
        'Explore detailed specifications, photo galleries, pricing, and visit scheduling for verified properties in Kabul on Attaie Properties.',
      canonicalUrl,
      ogType: 'article',
      ogImage: SEO_CONFIG.defaultImage,
      ogImageAlt: 'Attaie Properties Kabul',
    };
  }

  const listingLabel = property.listing_type === 'rent' ? 'For Rent' : 'For Sale';
  const formattedPrice =
    property.listing_type === 'rent'
      ? `$${Number(property.price).toLocaleString()}/mo`
      : `$${Number(property.price).toLocaleString()}`;

  const title = `${property.title} — ${property.type} ${listingLabel} in ${property.location} (${formattedPrice}) | ${SEO_CONFIG.siteName}`;

  const specSummary = [
    property.beds != null ? `${property.beds} bed` : null,
    property.baths != null ? `${property.baths} bath` : null,
    property.area != null ? `${property.area} m²` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const rawDescription =
    property.description && property.description.trim().length > 30
      ? `${property.description.trim()} — ${specSummary ? `${specSummary}. ` : ''}Priced at ${formattedPrice} in ${property.location}, Kabul.`
      : `${property.title}: ${specSummary ? `${specSummary} ` : ''}${property.type.toLowerCase()} ${listingLabel.toLowerCase()} in ${property.location}, Kabul. Priced at ${formattedPrice}. Ref: ${property.serial_number || property.id}.`;

  const description = truncateMetaDescription(rawDescription, 158);

  const primaryImage =
    property.image_url ||
    (Array.isArray(property.gallery_images) && property.gallery_images.length > 0
      ? property.gallery_images[0]
      : null);
  const ogImage = resolveAbsoluteUrl(primaryImage);

  const allAbsoluteImages = Array.from(
    new Set(
      [property.image_url, ...(property.gallery_images ?? [])]
        .filter((img): img is string => Boolean(img && img.trim()))
        .map(img => resolveAbsoluteUrl(img))
    )
  );

  const availabilityMap: Record<Property['status'], string> = {
    available: 'https://schema.org/InStock',
    pending: 'https://schema.org/LimitedAvailability',
    sold: 'https://schema.org/SoldOut',
    rented: 'https://schema.org/OutOfStock',
  };

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${canonicalUrl}#listing`,
    name: property.title,
    url: canonicalUrl,
    description,
    identifier: property.serial_number || String(property.id),
    datePosted: property.created_at || undefined,
    image: allAbsoluteImages.length > 0 ? allAbsoluteImages : [ogImage],
    offers: {
      '@type': 'Offer',
      price: Number(property.price),
      priceCurrency: 'USD',
      availability: availabilityMap[property.status] || 'https://schema.org/InStock',
      url: canonicalUrl,
    },
    mainEntity: {
      '@type': property.type === 'Apartment' ? 'Apartment' : property.type === 'Villa' || property.type === 'House' ? 'SingleFamilyResidence' : 'Place',
      name: property.title,
      description: property.description || description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.location,
        addressLocality: 'Kabul',
        addressCountry: 'AF',
      },
      ...(property.beds != null ? { numberOfBedrooms: Number(property.beds) } : {}),
      ...(property.baths != null ? { numberOfBathroomsTotal: Number(property.baths) } : {}),
      ...(property.area != null
        ? {
            floorSize: {
              '@type': 'QuantitativeValue',
              value: Number(property.area),
              unitCode: 'MTK',
            },
          }
        : {}),
    },
  };

  return {
    title,
    description,
    canonicalUrl,
    ogType: 'article',
    ogImage,
    ogImageAlt: `${property.title} — ${property.location}, Kabul`,
    keywords: [
      property.title,
      property.type,
      property.location,
      `Kabul ${property.type.toLowerCase()} for ${property.listing_type}`,
      property.serial_number,
      'Attaie Properties',
    ].filter(Boolean),
    jsonLd,
  };
}

/**
 * Dynamically generates SEO metadata, OpenGraph tags, and Schema.org JSON-LD
 * for an individual Project Detail page.
 */
export function buildProjectSeo(project: Project | null, fallbackId?: string | number): SeoMetadata {
  const idPart = project?.id ?? fallbackId ?? '';
  const canonicalUrl = resolveAbsoluteUrl(`/projects/${idPart}`);

  if (!project) {
    return {
      title: 'Development Project Details | Attaie Properties',
      description:
        'Explore residential and commercial development projects in Kabul, including masterplans, available apartments, and delivery timelines.',
      canonicalUrl,
      ogType: 'article',
      ogImage: SEO_CONFIG.defaultImage,
      ogImageAlt: 'Attaie Properties Development Project',
    };
  }

  const title = `${project.name} — ${project.status} Development in ${project.location} | ${SEO_CONFIG.siteName}`;

  const unitSummary =
    project.available_units != null && project.total_units != null && project.total_units > 0
      ? `${project.available_units} of ${project.total_units} units available.`
      : project.available_units != null && project.available_units > 0
      ? `${project.available_units} units available.`
      : '';

  const deliverySummary = project.delivery_date ? `Estimated delivery: ${project.delivery_date}.` : '';

  const rawDescription =
    project.description && project.description.trim().length > 30
      ? `${project.description.trim()} ${unitSummary} ${deliverySummary}`.trim()
      : `${project.name} is a ${project.status.toLowerCase()} real estate development in ${project.location}, Kabul by Attaie Properties. ${unitSummary} ${deliverySummary}`.trim();

  const description = truncateMetaDescription(rawDescription, 158);

  const primaryImage =
    project.image_url ||
    (Array.isArray(project.gallery_images) && project.gallery_images.length > 0
      ? project.gallery_images[0]
      : project.masterplan_image);
  const ogImage = resolveAbsoluteUrl(primaryImage);

  const allAbsoluteImages = Array.from(
    new Set(
      [project.image_url, project.masterplan_image, ...(project.gallery_images ?? [])]
        .filter((img): img is string => Boolean(img && img.trim()))
        .map(img => resolveAbsoluteUrl(img))
    )
  );

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    '@id': `${canonicalUrl}#project`,
    name: project.name,
    url: canonicalUrl,
    description,
    image: allAbsoluteImages.length > 0 ? allAbsoluteImages : [ogImage],
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.location,
      addressLocality: 'Kabul',
      addressCountry: 'AF',
    },
    ...(project.total_units
      ? {
          numberOfAccommodationUnits: {
            '@type': 'QuantitativeValue',
            value: Number(project.total_units),
          },
        }
      : {}),
    ...(project.available_units != null
      ? {
          numberOfAvailableAccommodationUnits: {
            '@type': 'QuantitativeValue',
            value: Number(project.available_units),
          },
        }
      : {}),
  };

  return {
    title,
    description,
    canonicalUrl,
    ogType: 'article',
    ogImage,
    ogImageAlt: `${project.name} — ${project.location}, Kabul`,
    keywords: [
      project.name,
      project.location,
      project.status,
      'Kabul real estate development',
      'Attaie Properties projects',
    ].filter(Boolean),
    jsonLd,
  };
}

/**
 * Dynamically generates SEO metadata and Person/RealEstateAgent JSON-LD
 * for an individual Agent Profile page.
 */
export function buildAgentSeo(agent: Agent | null, fallbackId?: string | number): SeoMetadata {
  const idPart = agent?.id ?? fallbackId ?? '';
  const canonicalUrl = resolveAbsoluteUrl(`/agents/${idPart}`);

  if (!agent) {
    return {
      title: 'Agent Profile | Attaie Properties',
      description: 'Connect with a dedicated real estate advisor at Attaie Properties in Kabul.',
      canonicalUrl,
      ogType: 'profile',
      ogImage: SEO_CONFIG.defaultImage,
    };
  }

  const title = `${agent.name} — ${agent.role} | ${SEO_CONFIG.siteName}`;
  const description = truncateMetaDescription(
    agent.background && agent.background.trim().length > 20
      ? `${agent.name} (${agent.role} at Attaie Properties): ${agent.background.trim()}`
      : `Contact ${agent.name}, ${agent.role} at Attaie Properties in Kabul, for property sales, rentals, and investment advisory.`,
    158
  );
  const ogImage = resolveAbsoluteUrl(agent.portrait_url);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: agent.name,
    jobTitle: agent.role,
    description,
    image: ogImage,
    url: canonicalUrl,
    telephone: agent.phone,
    email: agent.email,
    worksFor: {
      '@type': 'RealEstateAgent',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
  };

  return {
    title,
    description,
    canonicalUrl,
    ogType: 'profile',
    ogImage,
    ogImageAlt: `${agent.name} — ${agent.role}`,
    jsonLd,
  };
}

/**
 * Static page SEO presets for core routes.
 */
export const PAGE_SEO: Record<'home' | 'properties' | 'projects' | 'agents' | 'about' | 'contact', SeoMetadata> = {
  home: {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    canonicalUrl: `${SEO_CONFIG.siteUrl}/`,
    ogType: 'website',
    ogImage: SEO_CONFIG.defaultImage,
    jsonLd: SEO_CONFIG.organizationJsonLd,
  },
  properties: {
    title: 'Properties for Sale & Rent in Kabul | Attaie Properties',
    description:
      'Search verified villas, apartments, houses, commercial spaces, and land for sale and rent across Kabul with live pricing and photos.',
    canonicalUrl: `${SEO_CONFIG.siteUrl}/properties`,
    ogType: 'website',
    ogImage: SEO_CONFIG.defaultImage,
  },
  projects: {
    title: 'Real Estate Developments & Signature Projects in Kabul | Attaie Properties',
    description:
      'Explore Attaie Properties residential and commercial developments in Kabul: view masterplans, delivery dates, and available apartments.',
    canonicalUrl: `${SEO_CONFIG.siteUrl}/projects`,
    ogType: 'website',
    ogImage: SEO_CONFIG.defaultImage,
  },
  agents: {
    title: 'Our Real Estate Advisors & Agents | Attaie Properties',
    description:
      'Meet the experienced Kabul property advisors and agents at Attaie Properties ready to assist with buying, selling, and leasing.',
    canonicalUrl: `${SEO_CONFIG.siteUrl}/agents`,
    ogType: 'website',
    ogImage: SEO_CONFIG.defaultImage,
  },
  about: {
    title: 'About Attaie Properties — Trusted Real Estate Agency in Kabul',
    description:
      'Learn about Attaie Properties, our mission, local expertise, and commitment to transparent real estate services in Kabul, Afghanistan.',
    canonicalUrl: `${SEO_CONFIG.siteUrl}/about`,
    ogType: 'website',
    ogImage: SEO_CONFIG.defaultImage,
  },
  contact: {
    title: 'Contact Us & Schedule a Consultation | Attaie Properties',
    description:
      'Get in touch with Attaie Properties in Kabul by phone, WhatsApp, or inquiry form to buy, sell, rent, or schedule a property visit.',
    canonicalUrl: `${SEO_CONFIG.siteUrl}/contact`,
    ogType: 'website',
    ogImage: SEO_CONFIG.defaultImage,
  },
};

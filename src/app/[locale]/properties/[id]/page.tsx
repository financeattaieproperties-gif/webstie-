import PropertyDetailClient from './PropertyDetailClient';

// One placeholder shell pre-generated at build time.
// .htaccess rewrites any /properties/<id>/ to this shell;
// PropertyDetailClient reads the real ID via useParams() at runtime.
export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}

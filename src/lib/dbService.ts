const API = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  beds: number | null;
  baths: number | null;
  area: number | null;
  floor: number | null;
  status: 'available' | 'pending' | 'sold';
  type: 'Villa' | 'Apartment' | 'House' | 'Commercial';
  listing_type: 'sale' | 'rent';
  image_url: string | null;
  description: string | null;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  location: string;
  delivery_date: string | null;
  status: 'Under Construction' | 'Ready' | 'Sold Out';
  available_units: number;
  total_units: number;
  image_url: string | null;
  description: string | null;
  created_at: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  message?: string;
  propertyId?: string;
  propertyName?: string;
}

export async function getProperties(filters?: {
  status?: string;
  type?: string;
  listing_type?: string;
}): Promise<Property[]> {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filters ?? {}).filter(([, v]) => v)) as Record<string, string>
  );
  const res = await fetch(`${API}/get-properties.php?${params}`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function getProperty(id: number): Promise<Property> {
  const res = await fetch(`${API}/get-property.php?id=${id}`);
  if (!res.ok) throw new Error('Property not found');
  return res.json();
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API}/get-projects.php`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function getProject(id: number): Promise<Project> {
  const res = await fetch(`${API}/get-project.php?id=${id}`);
  if (!res.ok) throw new Error('Project not found');
  return res.json();
}

export async function createLead(lead: Lead): Promise<{ success: boolean; id: number }> {
  const res = await fetch(`${API}/submit-lead.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error('Failed to submit inquiry');
  return res.json();
}

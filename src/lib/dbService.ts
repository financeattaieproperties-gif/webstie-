const API = (import.meta.env.VITE_API_URL as string) || '/api';

export interface Property {
  id: number;
  serial_number: string;
  title: string;
  price: number;
  location: string;
  beds: number | null;
  baths: number | null;
  area: number | null;
  floor: number | null;
  status: 'available' | 'pending' | 'sold' | 'rented';
  type: 'Villa' | 'Apartment' | 'House' | 'Commercial' | 'Land';
  listing_type: 'sale' | 'rent';
  image_url: string | null;
  gallery_images: string[];
  video_url: string | null;
  description: string | null;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  location: string;
  delivery_date: string | null;
  status: 'Coming Soon' | 'In Progress' | 'Sold Out' | 'Under Construction' | 'Ready';
  available_units: number;
  total_units: number;
  image_url: string | null;
  gallery_images: string[];
  video_url: string | null;
  masterplan_image: string | null;
  description: string | null;
  created_at: string;
}

export interface Agent {
  id: number;
  name: string;
  role: string;
  background: string;
  portrait_url: string;
  phone: string;
  email: string;
  whatsapp: string | null;
  published: boolean;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  message?: string;
  propertyId?: string;
  propertyName?: string;
}

export interface ProjectUnit {
  id: number;
  project_id: number;
  unit_number: string;
  title: string | null;
  beds: number | null;
  baths: number | null;
  area: number | null;
  floor: number | null;
  price: number | null;
  currency: string;
  status: 'available' | 'reserved' | 'sold' | 'rented';
  image_url: string | null;
  description: string | null;
}

export interface VisitRequestInput {
  name: string;
  phone: string;
  requestedAt: string;
  label: string;
  propertyId?: number;
  projectId?: number;
  projectUnitId?: number;
}

export async function getProperties(filters?: {
  status?: string;
  type?: string;
  listing_type?: string;
  serial_number?: string;
  search?: string;
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

export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${API}/get-agents.php`);
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export async function getAgent(id: number): Promise<Agent> {
  const res = await fetch(`${API}/get-agent.php?id=${id}`);
  if (!res.ok) throw new Error(res.status === 404 ? 'Agent not found' : 'Failed to fetch agent');
  return res.json();
}

export async function getBranches(): Promise<Branch[]> {
  const res = await fetch(`${API}/get-branches.php`);
  if (!res.ok) throw new Error('Failed to fetch branches');
  return res.json();
}

export async function getProjectUnits(projectId: number): Promise<{ items: ProjectUnit[]; page: number; limit: number }> {
  const res = await fetch(`${API}/get-project-units.php?project_id=${projectId}`);
  if (!res.ok) throw new Error('Failed to fetch apartments');
  return res.json();
}

export async function submitVisitRequest(input: VisitRequestInput): Promise<{ success: boolean; id: number }> {
  const { label: _label, ...payload } = input;
  const res = await fetch(`${API}/submit-visit-request.php`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to request a visit');
  return data;
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

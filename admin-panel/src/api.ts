const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login:  (username: string, password: string) =>
    request<{ success: boolean }>('/admin-login.php', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<{ success: boolean }>('/admin-logout.php'),

  getProperties:    () => request<Property[]>('/admin/properties.php'),
  createProperty:   (data: PropertyInput) =>
    request<{ id: number }>('/admin/properties.php', { method: 'POST', body: JSON.stringify(data) }),
  updateProperty:   (data: PropertyInput & { id: number }) =>
    request<{ updated: number }>('/admin/properties.php', { method: 'PUT', body: JSON.stringify(data) }),
  deleteProperty:   (id: number) =>
    request<{ deleted: number }>(`/admin/properties.php?id=${id}`, { method: 'DELETE' }),

  getProjects:      () => request<Project[]>('/admin/projects.php'),
  createProject:    (data: ProjectInput) =>
    request<{ id: number }>('/admin/projects.php', { method: 'POST', body: JSON.stringify(data) }),
  updateProject:    (data: ProjectInput & { id: number }) =>
    request<{ updated: number }>('/admin/projects.php', { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject:    (id: number) =>
    request<{ deleted: number }>(`/admin/projects.php?id=${id}`, { method: 'DELETE' }),

  getLeads: () => request<Lead[]>('/admin/leads.php'),

  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`${BASE}/admin/upload.php`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json() as { url: string };
    return data.url;
  },
};

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
  gallery_images: string[];
  video_url: string | null;
  description: string | null;
  created_at: string;
}

export type PropertyInput = Omit<Property, 'id' | 'created_at'>;

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

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  property_id: string | null;
  property_name: string | null;
  stage: string;
  source: string;
  status: string;
  created_at: string;
}

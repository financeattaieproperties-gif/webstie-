const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    if (res.status === 401 && !path.includes('admin-login')) {
      sessionStorage.removeItem('admin_logged_in');
      window.location.reload();
    }
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

  getProjectUnits:   (projectId: number) =>
    request<ProjectUnit[]>(`/admin/project-units.php?project_id=${projectId}`),
  createProjectUnit: (data: ProjectUnitInput) =>
    request<{ id: number }>('/admin/project-units.php', { method: 'POST', body: JSON.stringify(data) }),
  updateProjectUnit: (data: ProjectUnitInput & { id: number }) =>
    request<{ updated: number }>('/admin/project-units.php', { method: 'PUT', body: JSON.stringify(data) }),
  deleteProjectUnit: (id: number) =>
    request<{ deleted: number }>(`/admin/project-units.php?id=${id}`, { method: 'DELETE' }),

  getAgents: () => request<Agent[]>('/admin/agents.php'),
  createAgent: (data: AgentInput) => request<{ id: number }>('/admin/agents.php', { method: 'POST', body: JSON.stringify(data) }),
  updateAgent: (data: AgentInput & { id: number }) => request<{ updated: number }>('/admin/agents.php', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAgent: (id: number) => request<{ deleted: number }>(`/admin/agents.php?id=${id}`, { method: 'DELETE' }),
  getBranches: () => request<Branch[]>('/admin/branches.php'),
  createBranch: (data: BranchInput) => request<{ id: number }>('/admin/branches.php', { method: 'POST', body: JSON.stringify(data) }),
  updateBranch: (data: BranchInput & { id: number }) => request<{ updated: number }>('/admin/branches.php', { method: 'PUT', body: JSON.stringify(data) }),
  deleteBranch: (id: number) => request<{ deleted: number }>(`/admin/branches.php?id=${id}`, { method: 'DELETE' }),

  getLeads: () => request<Lead[]>('/admin/leads.php'),
  getVisitRequests: () => request<VisitRequest[]>('/admin/visit-requests.php'),
  updateVisitRequest: (id: number, status: VisitRequest['status'], staff_note: string) =>
    request<{ success: boolean }>('/admin/visit-requests.php', { method: 'PUT', body: JSON.stringify({ id, status, staff_note }) }),

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

export type PropertyInput = Omit<Property, 'id' | 'created_at'>;

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

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

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

export type ProjectUnitInput = Omit<ProjectUnit, 'id'>;

export interface Agent {
  id: number; name: string; role: string; background: string; portrait_url: string;
  phone: string; email: string; whatsapp: string | null; published: boolean; created_at?: string;
}
export type AgentInput = Omit<Agent, 'id' | 'created_at'>;

export interface Branch {
  id: number; name: string; address: string; phone: string | null; email: string | null; created_at?: string;
}
export type BranchInput = Omit<Branch, 'id' | 'created_at'>;

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

export interface VisitRequest {
  id: number; name: string; phone: string; listing_name: string; requested_at: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled'; staff_note: string | null;
  events: Array<{ previous_status: string | null; next_status: string; actor: string; note: string | null; created_at: string }>;
}


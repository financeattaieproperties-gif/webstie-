const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
const CSRF_STORAGE_KEY = 'admin_csrf_token';

async function getCsrfToken(): Promise<string> {
  const cached = sessionStorage.getItem(CSRF_STORAGE_KEY);
  if (cached) return cached;
  try {
    const res = await fetch(`${BASE}/admin/csrf.php`, { credentials: 'include' });
    if (res.ok) {
      const data = (await res.json()) as { csrf_token?: string };
      if (data.csrf_token) {
        sessionStorage.setItem(CSRF_STORAGE_KEY, data.csrf_token);
        return data.csrf_token;
      }
    }
  } catch {
    // fallback if offline
  }
  return '';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const method = (options?.method ?? 'GET').toUpperCase();
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) ?? {}),
  };

  if (isMutation && !path.includes('admin-login')) {
    const token = await getCsrfToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
  }

  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });
  if (!res.ok) {
    if (res.status === 401 && !path.includes('admin-login')) {
      sessionStorage.removeItem('admin_logged_in');
      sessionStorage.removeItem(CSRF_STORAGE_KEY);
      window.location.reload();
    }
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: async (username: string, password: string) => {
    const res = await request<{ success: boolean; csrf_token?: string }>('/admin-login.php', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.csrf_token) {
      sessionStorage.setItem(CSRF_STORAGE_KEY, res.csrf_token);
    }
    return res;
  },
  logout: async () => {
    try {
      return await request<{ success: boolean }>('/admin-logout.php', { method: 'POST' });
    } finally {
      sessionStorage.removeItem(CSRF_STORAGE_KEY);
    }
  },
  getCsrf: () => getCsrfToken(),

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

  getCareers: () => request<CareerJob[]>('/admin/careers.php'),
  createCareer: (data: CareerJobInput) =>
    request<{ id: number }>('/admin/careers.php', { method: 'POST', body: JSON.stringify(data) }),
  updateCareer: (data: CareerJobInput & { id: number }) =>
    request<{ updated: number }>('/admin/careers.php', { method: 'PUT', body: JSON.stringify(data) }),
  deleteCareer: (id: number) =>
    request<{ deleted: number }>(`/admin/careers.php?id=${id}`, { method: 'DELETE' }),
  getCareerApplications: (jobId?: number) =>
    request<CareerApplication[]>(jobId ? `/admin/career-applications.php?job_id=${jobId}` : '/admin/career-applications.php'),
  getCareerFileUrl: (id: number, type: 'photo' | 'cv', download = false) =>
    `${BASE}/admin/career-file.php?id=${id}&type=${type}${download ? '&download=1' : ''}`,

  getSeoSettings: async (): Promise<SeoSettings> => {
    try {
      const data = await request<SeoSettings>('/admin/seo-settings.php');
      try {
        localStorage.setItem('attaie_seo_settings_v1', JSON.stringify(data));
      } catch {
        // ignore storage quota errors
      }
      return data;
    } catch {
      const cached = localStorage.getItem('attaie_seo_settings_v1');
      if (cached) {
        try {
          return JSON.parse(cached) as SeoSettings;
        } catch {
          // fall through to defaults
        }
      }
      return DEFAULT_SEO_SETTINGS;
    }
  },

  updateSeoSettings: async (data: SeoSettingsInput): Promise<SeoSettings> => {
    const merged: SeoSettings = {
      ...DEFAULT_SEO_SETTINGS,
      ...data,
      id: 1,
      updated_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem('attaie_seo_settings_v1', JSON.stringify(merged));
    } catch {
      // ignore storage quota errors
    }
    try {
      const saved = await request<SeoSettings>('/admin/seo-settings.php', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      try {
        localStorage.setItem('attaie_seo_settings_v1', JSON.stringify(saved));
      } catch {
        // ignore
      }
      return saved;
    } catch {
      // If running in static preview without PHP backend, persist in localStorage
      return merged;
    }
  },

  fetchSitemapStatusJson: async (): Promise<SitemapStatusData> => {
    const baseRoot = BASE.replace(/\/api\/?$/, '');
    const candidates = [
      `/sitemap-status.json?t=${Date.now()}`,
      ...(baseRoot ? [`${baseRoot}/sitemap-status.json?t=${Date.now()}`] : []),
    ];

    let lastError: Error | null = null;
    for (const url of candidates) {
      try {
        const res = await fetch(url, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} fetching sitemap-status.json`);
        }
        const data = (await res.json()) as SitemapStatusData;
        if (data && typeof data.generated_at === 'string' && data.counts) {
          return data;
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Failed to load sitemap-status.json');
      }
    }
    throw lastError ?? new Error('Unable to load sitemap-status.json');
  },

  fetchSitemapXmlText: async (): Promise<string> => {
    const baseRoot = BASE.replace(/\/api\/?$/, '');
    const candidates = [
      `/sitemap.xml?t=${Date.now()}`,
      ...(baseRoot ? [`${baseRoot}/sitemap.xml?t=${Date.now()}`] : []),
    ];
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          if (text.includes('<urlset')) return text;
        }
      } catch {
        // try next candidate
      }
    }
    return '';
  },

  getSitemapStatus: async (): Promise<SitemapCrawlReport> => {
    try {
      const report = await request<SitemapCrawlReport>('/admin/sitemap.php');
      if (report && report.counts) {
        return report;
      }
    } catch {
      // Fallback to static /sitemap-status.json + /sitemap.xml when PHP endpoint is unavailable
    }
    const [statusJson, xmlText] = await Promise.all([
      api.fetchSitemapStatusJson(),
      api.fetchSitemapXmlText(),
    ]);
    return {
      ...statusJson,
      xml: statusJson.xml ?? xmlText,
    };
  },

  generateSitemap: async (canonicalBaseUrl?: string): Promise<SitemapCrawlReport> => {
    try {
      return await request<SitemapCrawlReport>('/admin/sitemap.php', {
        method: 'POST',
        body: JSON.stringify(canonicalBaseUrl ? { canonical_base_url: canonicalBaseUrl } : {}),
      });
    } catch {
      const [statusJson, xmlText] = await Promise.all([
        api.fetchSitemapStatusJson(),
        api.fetchSitemapXmlText(),
      ]);
      const nowIso = new Date().toISOString();
      const base = (canonicalBaseUrl || statusJson.canonical_base_url || 'https://www.attaieproperties.com').replace(/\/+$/, '');
      return {
        ...statusJson,
        generated_at: nowIso,
        canonical_base_url: base,
        sitemap_url: `${base}/sitemap.xml`,
        xml: statusJson.xml ?? xmlText,
      };
    }
  },

  uploadImage: async (file: File, purpose?: 'blueprint' | 'gallery'): Promise<string> => {
    const form = new FormData();
    form.append('image', file);
    if (purpose) {
      form.append('purpose', purpose);
    }
    const token = await getCsrfToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    const endpoint = `${BASE}/admin/upload.php${purpose ? `?purpose=${encodeURIComponent(purpose)}` : ''}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: form,
    });
    if (res.ok) {
      const data = (await res.json()) as { url: string };
      return data.url;
    }

    const errBody = (await res.json().catch(() => ({}))) as { error?: string };

    // Fallback: if multipart upload returned 400 (e.g. cPanel tmp dir or multipart limit), retry as base64 JSON
    if (res.status === 400) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        const retryRes = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_base64: base64,
            filename: file.name,
            purpose: purpose ?? '',
          }),
        });
        if (retryRes.ok) {
          const retryData = (await retryRes.json()) as { url: string };
          return retryData.url;
        }
        const retryErr = (await retryRes.json().catch(() => ({}))) as { error?: string };
        if (retryErr.error) {
          throw new Error(retryErr.error);
        }
      } catch (fallbackErr) {
        if (fallbackErr instanceof Error && fallbackErr.message !== 'Failed to read file') {
          throw fallbackErr;
        }
      }
    }

    throw new Error(errBody.error || `Upload failed (HTTP ${res.status})`);
  },
};

export interface SitemapCrawlUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  category: 'static' | 'properties' | 'projects' | 'careers' | 'agents';
  title: string;
  image_count: number;
}

export interface SitemapStatusData {
  generated_at: string;
  canonical_base_url: string;
  sitemap_url: string;
  counts: {
    static: number;
    properties: number;
    projects: number;
    careers: number;
    agents: number;
    total: number;
  };
  urls: SitemapCrawlUrl[];
  xml?: string;
}

export interface SitemapCrawlReport extends SitemapStatusData {
  xml: string;
}

export interface SeoSettings {
  id?: number;
  site_name: string;
  default_title: string;
  title_template: string;
  default_description: string;
  keywords: string | null;
  og_image: string | null;
  twitter_image: string | null;
  twitter_card: 'summary_large_image' | 'summary';
  twitter_site: string | null;
  canonical_base_url: string;
  robots_index: boolean;
  updated_at?: string | null;
}

export type SeoSettingsInput = Omit<SeoSettings, 'id' | 'updated_at'>;

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  id: 1,
  site_name: 'Attaie Properties',
  default_title: 'Attaie Properties — Premier Real Estate in Kabul, Afghanistan',
  title_template: '%s | Attaie Properties',
  default_description:
    'Browse verified luxury villas, modern apartments, commercial spaces, and development projects for sale and rent across Kabul with Attaie Properties.',
  keywords:
    'Attaie Properties, Kabul real estate, properties for sale in Kabul, properties for rent in Kabul, luxury villas Kabul, apartments in Kabul, Afghanistan property agency',
  og_image: '/logo.png',
  twitter_image: null,
  twitter_card: 'summary_large_image',
  twitter_site: '@AttaieProps',
  canonical_base_url: 'https://www.attaieproperties.com',
  robots_index: true,
  updated_at: null,
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
  floor_plan_url: string | null;
  three_d_plan_url: string | null;
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

export interface CareerJob {
  id: number;
  title: string;
  location: string;
  employment_type: string;
  description: string;
  qualifications: string;
  deadline_at: string;
  status: 'draft' | 'published' | 'closed';
  is_expired?: boolean;
  application_count?: number;
  created_at: string;
  updated_at?: string;
}

export type CareerJobInput = Omit<CareerJob, 'id' | 'is_expired' | 'application_count' | 'created_at' | 'updated_at'>;

export interface CareerApplication {
  id: number;
  job_id: number;
  job_title: string;
  name: string;
  father_name: string;
  email: string;
  phone: string;
  address: string;
  photo_original_name: string;
  photo_mime_type: string;
  photo_size: number;
  cv_original_name: string;
  cv_mime_type: string;
  cv_size: number;
  created_at: string;
}


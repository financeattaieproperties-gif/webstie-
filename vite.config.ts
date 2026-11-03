import { defineConfig, type Plugin, type ViteDevServer, type PreviewServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

// Prevent Vite 5 from exiting when stdin sends EOF in non-interactive container environments
process.env.CI = 'true';

function readBody(req: IncomingMessage): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res: ServerResponse, data: unknown, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function createMockPhpApiPlugin(): Plugin {
  let properties: any[] = [];
  let projects: any[] = [];
  let projectUnits: any[] = [];
  let agents: any[] = [];
  let branches: any[] = [];
  let leads: any[] = [];
  let visitRequests: any[] = [];

  const attachMiddleware = (server: ViteDevServer | PreviewServer) => {
    // Keep process alive if stdin closes in container
    process.stdin.removeAllListeners('end');
    process.stdin.on('error', () => {});

    server.middlewares.use(async (req, res, next) => {
      if (!req.url || !req.url.startsWith('/api/')) {
        return next();
      }

      const parsedUrl = new URL(req.url, 'http://localhost:3000');
      const pathname = parsedUrl.pathname;
      const method = req.method || 'GET';

      // Public endpoints
      if (pathname === '/api/get-properties.php' && method === 'GET') {
        const status = parsedUrl.searchParams.get('status');
        const type = parsedUrl.searchParams.get('type');
        const listingType = parsedUrl.searchParams.get('listing_type');
        const serialNumber = parsedUrl.searchParams.get('serial_number');
        const search = parsedUrl.searchParams.get('search')?.toLowerCase();

        let result = [...properties];
        if (status) result = result.filter((p) => p.status === status);
        if (type) result = result.filter((p) => p.type === type);
        if (listingType) result = result.filter((p) => p.listing_type === listingType);
        if (serialNumber) result = result.filter((p) => p.serial_number.toLowerCase() === serialNumber.toLowerCase());
        else if (search) {
          result = result.filter(
            (p) =>
              p.serial_number.toLowerCase() === search ||
              p.title.toLowerCase().includes(search) ||
              p.location.toLowerCase().includes(search)
          );
        }
        return sendJson(res, result);
      }

      if (pathname === '/api/get-property.php' && method === 'GET') {
        const id = Number(parsedUrl.searchParams.get('id'));
        const item = properties.find((p) => p.id === id);
        if (!item) return sendJson(res, { error: 'Not found' }, 404);
        return sendJson(res, item);
      }

      if (pathname === '/api/get-projects.php' && method === 'GET') {
        return sendJson(res, projects);
      }

      if (pathname === '/api/get-project.php' && method === 'GET') {
        const id = Number(parsedUrl.searchParams.get('id'));
        const item = projects.find((p) => p.id === id);
        if (!item) return sendJson(res, { error: 'Not found' }, 404);
        return sendJson(res, item);
      }

      if (pathname === '/api/get-project-units.php' && method === 'GET') {
        const projectId = Number(parsedUrl.searchParams.get('project_id'));
        const status = parsedUrl.searchParams.get('status');
        let items = projectUnits.filter((u) => u.project_id === projectId);
        if (status) items = items.filter((u) => u.status === status);
        return sendJson(res, { items, page: 1, limit: 50 });
      }

      if (pathname === '/api/get-agents.php' && method === 'GET') {
        return sendJson(res, agents.filter((a) => a.published));
      }

      if (pathname === '/api/get-agent.php' && method === 'GET') {
        const id = Number(parsedUrl.searchParams.get('id'));
        const item = agents.find((a) => a.id === id && a.published);
        if (!item) return sendJson(res, { error: 'Agent not found' }, 404);
        return sendJson(res, item);
      }

      if (pathname === '/api/get-branches.php' && method === 'GET') {
        return sendJson(res, branches);
      }

      if (pathname === '/api/submit-lead.php' && method === 'POST') {
        const body = await readBody(req);
        const id = leads.length + 1;
        leads.unshift({
          id,
          name: body.name || '',
          email: body.email || '',
          phone: body.phone || '',
          message: body.message || null,
          property_id: body.propertyId || null,
          property_name: body.propertyName || null,
          stage: 'New',
          source: 'Website',
          status: 'Pending',
          created_at: new Date().toISOString(),
        });
        return sendJson(res, { success: true, id }, 201);
      }

      if (pathname === '/api/submit-visit-request.php' && method === 'POST') {
        const body = await readBody(req);
        const id = visitRequests.length + 1;
        visitRequests.unshift({
          id,
          name: body.name || '',
          phone: body.phone || '',
          listing_name: body.label || 'Property Visit',
          requested_at: body.requestedAt || new Date().toISOString(),
          status: 'pending',
          staff_note: null,
          events: [
            {
              previous_status: null,
              next_status: 'pending',
              actor: 'customer',
              note: 'Requested from website',
              created_at: new Date().toISOString(),
            },
          ],
        });
        return sendJson(res, { success: true, id }, 201);
      }

      if (pathname === '/api/initiate-call.php' && method === 'POST') {
        return sendJson(res, { success: true, message: 'Call initiated' });
      }

      // Admin endpoints
      if (pathname === '/api/admin-login.php' && method === 'POST') {
        return sendJson(res, { success: true });
      }

      if (pathname === '/api/admin-logout.php') {
        return sendJson(res, { success: true });
      }

      if (pathname === '/api/admin/properties.php') {
        if (method === 'GET') return sendJson(res, properties);
        if (method === 'POST') {
          const body = await readBody(req);
          const id = properties.reduce((max, p) => Math.max(max, p.id), 0) + 1;
          properties.unshift({ ...body, id, created_at: new Date().toISOString() } as any);
          return sendJson(res, { id }, 201);
        }
        if (method === 'PUT') {
          const body = await readBody(req);
          properties = properties.map((p) => (p.id === Number(body.id) ? { ...p, ...body } : p));
          return sendJson(res, { updated: 1 });
        }
        if (method === 'DELETE') {
          const id = Number(parsedUrl.searchParams.get('id'));
          properties = properties.filter((p) => p.id !== id);
          return sendJson(res, { deleted: 1 });
        }
      }

      if (pathname === '/api/admin/projects.php') {
        if (method === 'GET') return sendJson(res, projects);
        if (method === 'POST') {
          const body = await readBody(req);
          const id = projects.reduce((max, p) => Math.max(max, p.id), 0) + 1;
          projects.unshift({ ...body, id, created_at: new Date().toISOString() } as any);
          return sendJson(res, { id }, 201);
        }
        if (method === 'PUT') {
          const body = await readBody(req);
          projects = projects.map((p) => (p.id === Number(body.id) ? { ...p, ...body } : p));
          return sendJson(res, { updated: 1 });
        }
        if (method === 'DELETE') {
          const id = Number(parsedUrl.searchParams.get('id'));
          projects = projects.filter((p) => p.id !== id);
          return sendJson(res, { deleted: 1 });
        }
      }

      if (pathname === '/api/admin/project-units.php') {
        if (method === 'GET') {
          const projectId = Number(parsedUrl.searchParams.get('project_id'));
          return sendJson(res, projectUnits.filter((u) => u.project_id === projectId));
        }
        if (method === 'POST') {
          const body = await readBody(req);
          const id = projectUnits.reduce((max, u) => Math.max(max, u.id), 0) + 1;
          projectUnits.push({ ...body, id } as any);
          return sendJson(res, { id }, 201);
        }
        if (method === 'PUT') {
          const body = await readBody(req);
          projectUnits = projectUnits.map((u) => (u.id === Number(body.id) ? { ...u, ...body } : u));
          return sendJson(res, { updated: 1 });
        }
        if (method === 'DELETE') {
          const id = Number(parsedUrl.searchParams.get('id'));
          projectUnits = projectUnits.filter((u) => u.id !== id);
          return sendJson(res, { deleted: 1 });
        }
      }

      if (pathname === '/api/admin/agents.php') {
        if (method === 'GET') return sendJson(res, agents);
        if (method === 'POST') {
          const body = await readBody(req);
          const id = agents.reduce((max, a) => Math.max(max, a.id), 0) + 1;
          agents.push({ ...body, id, created_at: new Date().toISOString() } as any);
          return sendJson(res, { id }, 201);
        }
        if (method === 'PUT') {
          const body = await readBody(req);
          agents = agents.map((a) => (a.id === Number(body.id) ? { ...a, ...body } : a));
          return sendJson(res, { updated: 1 });
        }
        if (method === 'DELETE') {
          const id = Number(parsedUrl.searchParams.get('id'));
          agents = agents.filter((a) => a.id !== id);
          return sendJson(res, { deleted: 1 });
        }
      }

      if (pathname === '/api/admin/branches.php') {
        if (method === 'GET') return sendJson(res, branches);
        if (method === 'POST') {
          const body = await readBody(req);
          const id = branches.reduce((max, b) => Math.max(max, b.id), 0) + 1;
          branches.push({ ...body, id, created_at: new Date().toISOString() } as any);
          return sendJson(res, { id }, 201);
        }
        if (method === 'PUT') {
          const body = await readBody(req);
          branches = branches.map((b) => (b.id === Number(body.id) ? { ...b, ...body } : b));
          return sendJson(res, { updated: 1 });
        }
        if (method === 'DELETE') {
          const id = Number(parsedUrl.searchParams.get('id'));
          branches = branches.filter((b) => b.id !== id);
          return sendJson(res, { deleted: 1 });
        }
      }

      if (pathname === '/api/admin/leads.php' && method === 'GET') {
        return sendJson(res, leads);
      }

      if (pathname === '/api/admin/visit-requests.php') {
        if (method === 'GET') return sendJson(res, visitRequests);
        if (method === 'PUT') {
          const body = await readBody(req);
          visitRequests = visitRequests.map((v) =>
            v.id === Number(body.id) ? { ...v, status: body.status, staff_note: body.staff_note } : v
          );
          return sendJson(res, { success: true });
        }
      }

      return next();
    });
  };

  return {
    name: 'mock-php-api',
    configureServer(server) {
      attachMiddleware(server);
    },
    configurePreviewServer(server) {
      attachMiddleware(server);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createMockPhpApiPlugin(),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-router')
          ) {
            return 'vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'animations';
          }
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) {
            return 'forms';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});


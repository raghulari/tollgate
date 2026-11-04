# Deployment Architecture

## Topology

Tollgate components are decoupled for resilience and scale:

1. **Web Dashboard (`apps/web`)**:
   - Host: Vercel or Node.js container
   - Port: 3000
   - Static assets cached at CDN edge.

2. **AI Data Plane Gateway (`apps/gateway`)**:
   - Host: Scaled Docker containers (Fly.io, AWS ECS, GCP Cloud Run)
   - Port: 8787
   - Zero-downtime rolling updates.

3. **Background Worker (`apps/worker`)**:
   - Host: Persistent Node.js worker containers
   - Queue backend: Upstash Redis / Redis Cloud

4. **Database & Auth**:
   - Managed Supabase PostgreSQL with automated daily backups.

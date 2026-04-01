# Rotek Industrial Engineering - Digital Hub

Rotek Industrial's regional digital platform for high-precision pipe rehabilitation and environmental technology. Established 1972.

## Technology Stack

- **Kernel**: Next.js 14 (App Router)
- **Fluid UI**: Framer Motion for industrial-grade cinematic transitions.
- **Surface Engine**: Tailwind CSS with custom Rotek Industrial tokens.
- **Data Layer**: Internationalization Protocol (i18n) for regional EN/DE deployment.

## Deployment Protocols

### Technical Environment
```bash
npm install # Protocol Init
npm run dev # Dynamic Execution
```

### Environment Variables
- Copy `.env.example` to `.env.local`
- Set the n8n webhook endpoints:
  - `NEXT_PUBLIC_N8N_CREATE_SHOW_WEBHOOK`
  - `NEXT_PUBLIC_N8N_SEND_REMINDER_WEBHOOK`
- Set Supabase credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Protocol Validation
- Production-grade deployment in Bremen/Verden clusters.
- Optimized for Answer Engine Optimization (AEO) and master technician authority.

---
© 1972-2026 Rotek Rohrreinigung & Kanalsanierung. All rights reserved.

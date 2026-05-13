# 🚀 Nebbuler SEO Automation — Setup & Deployment

Guía completa para activar el sistema de automatización SEO en Nebbuler.

## 📋 Requisitos Previos

- ✅ Node.js 18+
- ✅ ANTHROPIC_API_KEY en `.env.local`
- ✅ CRON_SECRET configurado
- ✅ Acceso a Supabase (SERVICE_ROLE_KEY)

## 🎯 5 Componentes Implementados

### 1. **SQL Schema** (`sql/seo-automation-schema.sql`)
- 4 tablas: trending_keywords, generated_pages, featured_snippets, seo_metrics
- 8+ índices optimizados
- RLS policies (service_role solo para writes)
- 3 helper functions

**Aplicar:**
```bash
npx ts-node scripts/apply-seo-schema.ts
```

### 2. **Cron Jobs** (`vercel.json` + `/api/cron/*`)
- `detect-trends`: Cada 4 horas — detecta keywords en tendencia
- `generate-pages`: Cada 6 horas — genera contenido con Claude API
- `update-snippets`: Semanalmente — monitorea featured snippets

**Archivos:**
- `/api/cron/detect-trends/route.ts` — Detecta trending keywords (mock data + Google Trends)
- `/api/cron/generate-pages/route.ts` — Genera artículos con Claude
- `/api/cron/update-snippets/route.ts` — Actualiza featured snippets

### 3. **Dynamic Routing** (`/[specialty]-[country]/page.tsx`)
- Ruta: `/marketing-cl` → Página de Marketing en Chile
- ISR: Revalidación cada 24 horas
- Metadata dinámico con OpenGraph
- Links internos a creadores

**Parámetros:**
- `[specialty]` — lowercase, sin espacios (e.g., `marketing`, `derecho`)
- `[country]` — ISO 2-letter code (e.g., `CL`, `CO`, `MX`)

### 4. **Batch Generation Script** (`scripts/batch-generate-pages.ts`)
Genera 1000+ páginas iniciales en paralelo

**Uso:**
```bash
# Test mode (5 páginas)
npx ts-node scripts/batch-generate-pages.ts --test

# 1000 páginas
npm run seo:batch:1000

# 5000 páginas
npm run seo:batch:5000

# Configuración personalizada
npx ts-node scripts/batch-generate-pages.ts \
  --count 1000 \
  --countries CL,CO,MX,AR \
  --specialties "Marketing,Derecho,Diseño,Tech" \
  --concurrent 3
```

### 5. **Package.json Scripts**
```json
{
  "scripts": {
    "seo:batch": "ts-node scripts/batch-generate-pages.ts --count 1000",
    "seo:batch:1000": "ts-node scripts/batch-generate-pages.ts --count 1000",
    "seo:batch:5000": "ts-node scripts/batch-generate-pages.ts --count 5000",
    "seo:batch:test": "ts-node scripts/batch-generate-pages.ts --test"
  }
}
```

## 🚀 Deployment Checklist

### Step 1: Aplicar Schema en Supabase
```bash
npx ts-node scripts/apply-seo-schema.ts
```
✅ Verificar en Supabase dashboard → SQL Editor → ver las 4 tablas nuevas

### Step 2: Configurar Variables en Vercel
Ir a Vercel Project Settings → Environment Variables

**Requeridas:**
- `ANTHROPIC_API_KEY` — Tu API key de Claude
- `CRON_SECRET` — Token para proteger cron endpoints
- `SUPABASE_SERVICE_ROLE_KEY` — Para writes en BD
- `NEXT_PUBLIC_SUPABASE_URL` — URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Para lectura pública

### Step 3: Deploy a Vercel
```bash
# Verificar build localmente
npm run build

# Push a main
git push origin main

# Vercel auto-deploya

# O manualmente
vercel --prod
```

### Step 4: Test en Producción
```bash
# Test endpoint detect-trends
curl -X GET "https://nebbuler.com/api/cron/detect-trends" \
  -H "Authorization: Bearer $CRON_SECRET"

# Test ruta dinámica
curl -X GET "https://nebbuler.com/marketing-cl"
```

### Step 5: Generar Páginas Iniciales (Opcional)
```bash
# Generar 100 páginas (test)
npm run seo:batch:test

# Generar 1000 páginas (producción)
npm run seo:batch:1000

# Generar 5000 páginas (escala)
npm run seo:batch:5000
```

## 📊 Arquitectura

```
Nebbuler SEO Automation
├── Cron Jobs (Vercel)
│   ├── detect-trends (4h) → trending_keywords
│   ├── generate-pages (6h) → generated_pages
│   └── update-snippets (1x week) → featured_snippets
├── Dynamic Routing
│   └── /[specialty]-[country]/page.tsx (ISR 24h)
├── Batch Generation
│   └── scripts/batch-generate-pages.ts
└── Database (Supabase)
    ├── trending_keywords
    ├── generated_pages
    ├── featured_snippets
    └── seo_metrics
```

## 🔐 Seguridad

### CRON_SECRET Validation
```typescript
// Todos los cron endpoints validan:
const authHeader = request.headers.get('authorization')
if (authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### RLS Policies
- `SELECT`: Público (anyone puede leer)
- `INSERT/UPDATE`: Solo service_role (backend + cron)
- `DELETE`: Solo admin

### API Keys
- **ANTHROPIC_API_KEY**: Solo en Vercel secrets (nunca en git)
- **SUPABASE_SERVICE_ROLE_KEY**: Solo en Vercel secrets
- **CRON_SECRET**: Random 32-char hex (generar con `openssl rand -hex 32`)

## 📈 Performance

| Componente | Performance | Notas |
|-----------|-------------|-------|
| detect-trends | ~100ms | Mock data, sin API calls |
| generate-pages | ~2-3s/página | Claude API, rate limited a 1 req/2s |
| update-snippets | ~50ms/página | Mock data o SerpAPI |
| Dynamic routing | <200ms | ISR cached, on-demand generation |

## 🧪 Testing Local

```bash
# Unit tests (si existen)
npm run test

# Build test
npm run build

# Dev server
npm run dev

# Test cron endpoints
bash scripts/test-seo-system.sh
```

## 📚 Archivos Clave

| Ruta | Propósito |
|------|-----------|
| `sql/seo-automation-schema.sql` | Schema SQL para 4 tablas + indices + RLS |
| `scripts/apply-seo-schema.ts` | Aplica schema a Supabase |
| `scripts/batch-generate-pages.ts` | Genera 1000+ páginas en paralelo |
| `scripts/test-seo-system.sh` | Tests end-to-end |
| `/api/cron/detect-trends/route.ts` | Detecta trending keywords |
| `/api/cron/generate-pages/route.ts` | Genera contenido con Claude |
| `/api/cron/update-snippets/route.ts` | Monitorea featured snippets |
| `/[specialty]-[country]/page.tsx` | Dynamic route para páginas generadas |
| `vercel.json` | Configuración de cron jobs |

## 🐛 Troubleshooting

### Error: "CRON_SECRET not found"
→ Agregar CRON_SECRET a Vercel project settings

### Error: "ANTHROPIC_API_KEY invalid"
→ Verificar la clave en https://console.anthropic.com/

### Error: "Supabase RLS policy denied"
→ Verificar que SERVICE_ROLE_KEY se está usando (no anon key)

### Error: "Table does not exist"
→ Ejecutar: `npx ts-node scripts/apply-seo-schema.ts`

## 🎯 Próximos Pasos

1. ✅ Aplicar schema: `npx ts-node scripts/apply-seo-schema.ts`
2. ✅ Deploy: `vercel --prod`
3. ✅ Test: `bash scripts/test-seo-system.sh`
4. ✅ Generar páginas: `npm run seo:batch:1000`
5. 📊 Monitor cron jobs en Vercel dashboard
6. 📈 Analizar metrics en Supabase dashboard

## 📞 Support

Para preguntas o problemas:
- Revisar logs en Vercel: Project → Deployments → Cron tab
- Revisar BD: Supabase → SQL Editor → ver queries en real-time
- Revisar Claude API: https://console.anthropic.com/

---

**Status**: ✅ Production Ready
**Last Updated**: 2026-05-13
**Version**: 1.0.0

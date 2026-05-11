# IndexNow — Nebbuler

Notifica a Bing, Yandex y Seznam de nuevas URLs en segundos usando el protocolo IndexNow.

## Setup

1. Genera una key en https://www.indexnow.org/documentation
2. Crea `/public/<tu-key>.txt` con el valor de la key como contenido
3. Agrega `INDEXNOW_KEY=<tu-key>` a `.env.local`

## Uso

```bash
# Todas las URLs (sitemap completo desde Supabase + estáticas)
npx ts-node automation/indexnow/indexnow.ts --all

# Una URL específica al publicar un post
npx ts-node automation/indexnow/indexnow.ts --url https://nebbuler.com/rodrigo-fuentes/nuevo-articulo
```

## API Webhook (automático al publicar)

`POST /api/indexnow` con `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>` y body `{ "urls": ["https://nebbuler.com/..."] }`.

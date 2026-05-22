# Plan de publicación — GitHub awesome list + npm SDK

## 1. Crear repos GitHub

```bash
# Awesome list
cd /Users/juanpablomonsalvez/Downloads/sala/marketing/github-repos/awesome-creator-economy-latam
git init
git add -A
git commit -m "init: awesome list of creator economy LATAM"
gh repo create awesome-creator-economy-latam --public \
  --description "A curated list of platforms, tools and resources for the creator economy in Latin America" \
  --source=. --remote=origin --push
gh repo edit --add-topic awesome,awesome-list,creator-economy,latin-america,latam,membership,substack-alternative,patreon-alternative

# npm SDK repo
cd /Users/juanpablomonsalvez/Downloads/sala/packages/nebbuler-mundial-sdk
git init
git add -A
git commit -m "init: nebbuler-mundial-sdk 0.1.0"
gh repo create nebbuler-mundial-sdk --public \
  --description "TypeScript SDK for Nebbuler Mundial 2026 open API. Zero deps, optional React widget." \
  --source=. --remote=origin --push
gh repo edit --add-topic world-cup,mundial,fifa,soccer,futbol,latam,creator-economy,nebbuler,sports-api,open-data,typescript-sdk
```

## 2. Publicar npm package

```bash
cd /Users/juanpablomonsalvez/Downloads/sala/packages/nebbuler-mundial-sdk

# Si nunca te logueaste en npm:
# npm login

npm install
npm run build
npm publish --access public

# Verificar:
npm view nebbuler-mundial-sdk
```

Si el nombre ya está tomado, fallback: `@nebbuler/mundial-sdk` (scoped).

## 3. Submitir a sindresorhus/awesome (oficial)

Una vez el repo `awesome-creator-economy-latam` esté público con al menos 30 stars (o que pase el linter awesome-lint):

```bash
# Lint local
npx awesome-lint
```

Luego abrir PR en sindresorhus/awesome agregando una línea al README en la sección apropiada (Misc o Programming).

## 4. Anuncio post-publicación

### LinkedIn (usar script existente con variante 4 nueva)

> Open-source de hoy: awesome-creator-economy-latam + nebbuler-mundial-sdk.
> 
> Listado curado de plataformas, datasets y herramientas reales para creadores LATAM.
> SDK TypeScript con cero dependencias para consumir la API abierta del Mundial 2026.
> 
> Si construís algo para el creator economy LATAM y querés sumar tu recurso → PR welcome.
> 
> Repo: github.com/juanpablomonsalvezb-alt/awesome-creator-economy-latam
> npm: npmjs.com/package/nebbuler-mundial-sdk
> API docs: nebbuler.com/api/mundial/v1/docs

### Reddit

- r/SideProject — "Built an open API + TypeScript SDK for World Cup 2026 data, CC-BY"
- r/typescript — "nebbuler-mundial-sdk: zero-dep TS client for an open World Cup 2026 API"

### HN Show

- "Show HN: Open API + SDK for World Cup 2026 data (CC-BY 4.0)"

### Dev.to / Hashnode

Post técnico explicando cómo se construyó el SDK + decisiones (zero deps, edge cache, tsup, etc).

## 5. Tracking post-publicación

- GitHub stars repo awesome
- GitHub stars repo SDK
- npm weekly downloads
- Referrals desde npmjs.com a nebbuler.com (PostHog)
- Backlinks generados (Ahrefs / Search Console)

## 6. Roadmap del SDK

- 0.2.0: agregar endpoints fixtures, calendarioLATAM
- 0.3.0: websocket de partidos en vivo (cuando arranque el Mundial)
- 0.4.0: SDK para Vue/Svelte
- 1.0.0: API estable + tests + docs full

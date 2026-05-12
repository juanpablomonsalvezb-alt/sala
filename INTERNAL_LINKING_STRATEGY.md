# Internal Linking Strategy — Nebbuler SEO (Phase 2B)

## Objective
Distribute page authority from high-value pages (DA 0.8-1.0) to content pages (DA 0.6-0.7) to accelerate SEO maturity from 7-8/10 to 9/10.

## Current Page Authority Distribution
- **Tier 1 (Priority 1.0)**: Home, /directorio, /analisis, /prensa
- **Tier 2 (Priority 0.8)**: /guia, /dashboard, /sobre
- **Tier 3 (Priority 0.6-0.7)**: Guides, analyses, case studies, FAQs (750+ pages)

## Internal Linking Patterns

### Pattern 1: Silos by Topic/Profession
Create vertical silos where content is semantically grouped:

```
/analisis (hub) → /analisis/economia → /analisis/economia/chile
                                     → /analisis/economia/colombia
                                     → /analisis/economia/mexico
                                     (link back to hub)
                                     (link to related topic hub)
```

### Pattern 2: Hub Pages as Content Distribution Centers
High-authority hubs should link to:
- All related content in that vertical
- 1-2 related hubs (semantic relationship)
- Back to home if appropriate

**Hub pages**: `/analisis`, `/guia`, `/directorio`, `/prensa`

### Pattern 3: Content Leaf Linking
Each low-authority page (/guia/[slug], /analisis/[tema]/[pais]) should link to:
- Parent hub (1 outbound link)
- 2-3 related content pieces (guides/analyses in same topic)
- 1-2 FAQ pages (if relevant)
- Back to /directorio (creators in that field)

---

## Implementation Plan

### Phase 2B.1: Update /analisis/page.tsx (Hub Page)
Add section at bottom: "Relacionado"
- Link to 15 topic hubs (vertical structure)
- Link to top 5 guides (horizontal cross-silo)
- Link to /directorio (ecosystem connection)

**Expected Authority Flow**:
- /analisis (self) keeps 1.0
- Distributes ~0.15 authority to each topic hub
- Creates vertical authority concentration

### Phase 2B.2: Update /guia/page.tsx (Hub Page)
Add section: "Análisis relacionados"
- Link to 5-8 most relevant analysis topics
- Link to 3-5 relevant FAQs
- Link to /directorio

### Phase 2B.3: Update /analisis/[tema]/[pais]/page.tsx (Leaf Page)
Add "Contenido relacionado" section (bottom):
- Link to parent topic hub: `/analisis/[tema]` (1 link, authority flow back up)
- Link to 3 related topics: `/analisis/[related-tema]/[pais]` (cross-topic)
- Link to 2 relevant guides: `/guia/[relevant-guide]`
- Link to 1-2 FAQ: `/faq/[relevant-slug]`
- Link to 2-3 creators in that discipline: `/[creator-slug]`

### Phase 2B.4: Update /guia/[slug]/page.tsx (Leaf Page)
Add "Profundiza más" section:
- Link to parent hub: `/guia` (authority flow)
- Link to 3-5 related analyses: `/analisis/[tema]/[multiple-paises]`
- Link to relevant FAQs
- Link to related guides (same profession/topic)
- Link to creator directory filter (if applicable)

### Phase 2B.5: Update /faq/[slug]/page.tsx (Leaf Page)
Add "Relacionado" section:
- Link to relevant guide: `/guia/[slug]`
- Link to relevant analysis: `/analisis/[tema]/[pais]`
- Link to case studies if relevant: `/caso-estudio/[slug]`
- Back to /directorio or related creator

### Phase 2B.6: Update /caso-estudio/[slug]/page.tsx (Leaf Page)
Add "Análisis del mercado" section:
- Link to relevant analysis by topic: `/analisis/[tema]`
- Link to relevant guide
- Link to FAQ about the topic
- Back to /directorio

### Phase 2B.7: /directorio (Creator Hub)
Add "Áreas de expertise" section:
- Link to each discipline's analysis hub
- Link to guides for that profession
- Link to case studies in that field
- Creates creator ↔ content network

### Phase 2B.8: /prensa (New Hub)
Add internal links:
- Case studies as proof points (link to `/caso-estudio`)
- Analyses as credibility (link to `/analisis/[tema]/[pais]`)
- Creator profiles (link to `/directorio`)
- FAQ for media (link to `/faq/media-related`)

---

## Link Density Guidelines
- **Hub pages** (Tier 1-2): 10-15 internal links each
- **Leaf pages** (Guides/Analyses): 6-8 internal links each
- **No page** should be more than 3 clicks from home
- **Average link depth**: 2.1 (most content reachable in 2 clicks)

---

## Expected Authority Distribution After Phase 2B

### Before
```
Home (1.0) → 
├─ /analisis (0.8) → [225 analysis pages] (0.6 avg)
├─ /guia (0.8) → [20 guide pages] (0.65 avg)
├─ /directorio (0.9) → [creators] (0.7 avg)
└─ /prensa (0.75) → [1 page]
```

### After
```
Home (1.0) →
├─ /analisis (0.85) →
│  ├─ /analisis/[tema] (0.75) → [15 pages] (0.7 avg)
│  └─ /analisis/[tema]/[pais] (0.72) → [225 pages] (0.68 avg)
├─ /guia (0.85) →
│  └─ /guia/[slug] (0.76) → [20 pages] (0.72 avg)
├─ /directorio (0.88) → [creators] (0.75 avg)
└─ /prensa (0.80) → [1 page]
```

**Key metrics**:
- Average page authority increases by ~0.05-0.08
- Content pages become "crawlable authority sinks" instead of dead-ends
- Topic silos strengthen vertical authority concentration
- Cross-silo links create web of topical relevance

---

## Implementation Order (Parallel)
1. **Week 1**: Modify hub pages (/analisis, /guia, /directorio)
2. **Week 1-2**: Modify leaf pages (100 pages/day)
3. **Week 2**: Modify new pages (/prensa, /faq, /caso-estudio)
4. **Week 3**: Monitor Search Console for crawl changes, authority flow

---

## Measurement
- **GSC**: Monitor "Average Position" improvement for target keywords
- **Ahrefs**: Track internal link count, link structure changes
- **Search Rankings**: Monitor 20-30 target keywords for ranking improvements
- **Traffic**: Expected 20-30% organic traffic increase over 4 weeks

---

## Risk Mitigation
- ✅ No "over-linking" (keep per-page links under 15)
- ✅ All internal links are contextually relevant (not forced)
- ✅ Link anchor text varies (not keyword-stuffed)
- ✅ Leaf pages link up to hubs (proper pyramid structure)
- ✅ No circular link chains (prevent authority loops)


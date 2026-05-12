# Template: Entrada Nebbuler en Wikidata

Documento de referencia rápida para crear la entrada de Nebbuler en Wikidata.

## Información Básica

**Tipo de Elemento**: Organization / Software / Project  
**Idioma Principal**: Español  
**País Base**: Chile  

## Labels y Descripciones

### Español
- **Label**: `Nebbuler`
- **Description**: `plataforma de newsletters profesionales de pago para América Latina`
- **Aliases**: `Nebbuler - Plataforma de Newsletters`, `Newsletter profesional Nebbuler`

### Inglés
- **Label**: `Nebbuler`
- **Description**: `professional newsletter platform for Latin America`
- **Aliases**: `Nebbuler - Professional Newsletter Platform`, `Nebbuler professional newsletters`

### Portugués (Brasileño)
- **Label**: `Nebbuler`
- **Description**: `plataforma de newsletters profissionais pagas para América Latina`

## Statements (Afirmaciones) - Orden Recomendado

### 1. Instance Of (P31)
```
Property: instance of (P31)
Value: Project (Q41710)
Rank: Normal
```

Alternative values to consider:
- `Software (Q7397)` if emphasizing technical platform
- `Service (Q7406919)` if emphasizing the service
- `Company (Q783794)` if emphasizing as business entity

### 2. Inception (P571)
```
Property: inception (P571)
Date Value: 2025-01-01
Calendar: Proleptic Gregorian calendar
Precision: Year
Source: https://nebbuler.com/sobre
Retrieved: [today's date]
```

### 3. Founded By (P112)
```
Property: founded by (P112)
Value: [Create or link to Juan Pablo Monsalvez element]
Source: https://nebbuler.com/sobre
Retrieved: [today's date]
```

**For Juan Pablo Monsalvez (if creating new element):**
- P31: Human (Q5)
- P27: Chile (Q298)
- P106: Tech entrepreneur (Q4853732)
- P131: Santiago (Q2887)
- P856: [personal website if available]

### 4. Country (P17)
```
Property: country (P17)
Value: Chile (Q298)
Rank: Normal
```

### 5. Located in Administrative Territory (P131)
```
Property: located in administrative territory (P131)
Value: Metropolitan Region of Santiago (Q2474)
Rank: Normal
```

### 6. Coordinate Location (P625)
```
Property: coordinate location (P625)
Coordinates: -33.4489°, -70.6693°
Globe: Earth (Q2)
Source: Santiago, Chile coordinates
```

### 7. Official Website (P856)
```
Property: official website (P856)
URL: https://nebbuler.com
Source: Verified from domain
Retrieved: [today's date]
```

### 8. Language (P407)
```
Property: language of work or name (P407)
Value: Spanish (Q1321)
Rank: Normal
```

### 9. Genre (P680)
```
Property: genre (P680)
Values: 
- Newsletter (Q4418383)
- Professional education (Q7881270)
Rank: Normal
```

### 10. LinkedIn Company ID (P6634)
```
Property: LinkedIn company ID (P6634)
Value: nebbuler
Source: https://linkedin.com/company/nebbuler
Retrieved: [today's date]
```

### 11. Instagram Username (P2003)
```
Property: Instagram username (P2003)
Value: nebbuler
Source: Instagram.com/nebbuler
Retrieved: [today's date]
```

### 12. Area Served (Multiple P625 or with qualifiers)
```
For each country in the service area:

Property: area served (P2541)
Value: [Country name and code]
Examples:
- Chile (Q298)
- Colombia (Q739)
- Mexico (Q96)
- Argentina (Q414)
- Peru (Q419)
[... continue for all 19 countries]
```

## Social Media Links (sameAs equivalent)

While Wikidata doesn't use "sameAs" directly, use:

### LinkedIn
- **Property**: `LinkedIn company ID (P6634)`
- **Value**: `nebbuler`

### Instagram
- **Property**: `Instagram username (P2003)`
- **Value**: `nebbuler`

### Twitter (if created)
- **Property**: `official Twitter account (P4264)`
- **Value**: URL to Twitter profile

## References Template

For each statement, include at minimum:

```
Stated in: https://nebbuler.com/sobre
Retrieved: [YYYY-MM-DD]
URL: https://nebbuler.com
Language of work or name: Spanish (Q1321)
```

## Qualifiers (Optional but recommended)

### For Inception
```
Qualifier: calendar model (P1602) → Proleptic Gregorian calendar (Q1985727)
Qualifier: point in time (P585) → 2025-01-01
```

### For Founded By
```
Qualifier: point in time (P585) → 2025-01-01
```

### For Located In
```
Qualifier: point in time (P585) → 2025-01-01
```

## Form Submission Checklist

- [ ] Element created and labeled
- [ ] All 12 main statements added
- [ ] Each statement has at least one reference
- [ ] All URLs verified and working
- [ ] Spelling checked (Spanish + English)
- [ ] Juan Pablo Monsalvez element created or linked
- [ ] All 19 countries listed in "area served"
- [ ] Social media usernames verified
- [ ] Coordinate location accurate
- [ ] Inception date confirmed as 2025-01-01
- [ ] No conflicts with existing items
- [ ] All references dated with retrieval date
- [ ] Wikidata Commons image added (if available)

## Expected Result

Once published, the Wikidata entry should appear in:

1. **Google Knowledge Graph** (within 24-48 hours)
2. **Wikidata Search** (immediate)
3. **Schema.org JSON-LD** (via semantic search engines)
4. **Wikipedia Infoboxes** (when referenced)
5. **Semantic Web Search Engines**

The entry will be discoverable by:
- Wikidata Query Service (SPARQL)
- Wikimedia projects
- OpenAlex and academic indexing
- Knowledge graph consumers

## Maintenance Reminders

- **Monthly**: Verify all links are still valid
- **Quarterly**: Check for community edits or corrections
- **Annually**: Update metrics (if public) and team information
- **As needed**: Respond to discussion threads about the item

## Additional Resources

- **Wikidata Editing Guide**: https://www.wikidata.org/wiki/Help:Editing
- **Property Selector**: https://www.wikidata.org/wiki/Help:Items/en
- **Constraint Violation Checker**: https://www.wikidata.org/wiki/Special:ConstraintViolations
- **Wikidata Community**: https://www.wikidata.org/wiki/Wikidata:Project_chat

---

**Ready to create?** Copy this template and paste into your Wikidata item form at https://www.wikidata.org/wiki/Wikidata:New_Item

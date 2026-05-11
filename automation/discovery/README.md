# Creator Discovery Pipeline — Nebbuler

Encuentra profesionales chilenos y latinoamericanos con presencia pública en páginas institucionales y los convierte en leads para Nebbuler.

## Fuentes disponibles

| Key | Institución | Disciplina |
|-----|-------------|------------|
| `uc-economia` | PUC — Economía | economia |
| `uchile-economia` | U. de Chile — Economía | economia |
| `uai-negocios` | UAI — Escuela de Negocios | finanzas |
| `cep` | CEP Chile | economia |
| `libertad-desarrollo` | Libertad y Desarrollo | economia |
| `clapes-uc` | CLAPES UC | economia |
| `espacio-publico` | Espacio Público | economia |
| `usach-ingenieria` | USACH — Ing. Comercial | economia |

## Instalación

```bash
cd automation/discovery
npm install
npx playwright install chromium
```

## Uso

```bash
# Todas las fuentes, exportar JSON y CSV
npm run discover:all

# Una fuente específica
npx ts-node discover-creators.ts --source cep --export csv

# Filtrar por score mínimo (default: 6/10)
npx ts-node discover-creators.ts --all --min-score 7 --export both
```

## Output

Los resultados se guardan en `automation/discovery/output/creators-YYYY-MM-DD.json` y `.csv`.

El score (0-10) estima la relevancia del perfil para Nebbuler basado en título y keywords.

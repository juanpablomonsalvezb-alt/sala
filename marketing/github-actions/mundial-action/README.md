# Nebbuler Mundial 2026 — GitHub Action

> Inserta tabla de grupos + tarjeta de selección + calculadora del Mundial 2026 en el README de cualquier repo. Datos CC-BY 4.0.

## Uso rápido

En tu `README.md`, agregá estos dos marcadores donde quieras el bloque:

```markdown
<!-- NEBBULER:MUNDIAL:START -->
<!-- NEBBULER:MUNDIAL:END -->
```

Después creá `.github/workflows/mundial.yml`:

```yaml
name: Update Mundial 2026 README
on:
  schedule:
    - cron: '0 6 * * *'  # cada día a las 06:00 UTC
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - uses: nebbuler/mundial-action@v1
        with:
          seleccion: argentina    # o brasil, mexico, colombia, uruguay, ecuador, chile, peru

      - name: Commit
        run: |
          git config user.name 'github-actions[bot]'
          git config user.email 'github-actions[bot]@users.noreply.github.com'
          git add README.md
          git diff --staged --quiet || git commit -m 'chore: update Mundial 2026 block'
          git push
```

Listo. Tu README se actualiza automáticamente con datos frescos del Mundial.

## Inputs

| Input              | Default                                  | Descripción                                                |
|--------------------|------------------------------------------|------------------------------------------------------------|
| `seleccion`        | `argentina`                              | Selección LATAM destacada                                  |
| `output_file`      | `README.md`                              | Archivo donde insertar el bloque                           |
| `start_marker`     | `<!-- NEBBULER:MUNDIAL:START -->`        | Marcador HTML inicial                                      |
| `end_marker`       | `<!-- NEBBULER:MUNDIAL:END -->`          | Marcador HTML final                                        |
| `show_badge`       | `true`                                   | Mostrar badge shields.io                                   |
| `show_grupos`      | `true`                                   | Tabla con los 12 grupos                                    |
| `show_seleccion`   | `true`                                   | Tarjeta de selección destacada                             |
| `show_calculadora` | `true`                                   | Link a calculadora de creadores                            |
| `api_base`         | `https://nebbuler.com/api/mundial/v1`    | Override API base URL                                      |

## Outputs

- `content` — el markdown generado, por si querés usarlo en otro step.

## Qué genera

Un bloque markdown con:

- Badge "Powered by Nebbuler · Mundial 2026"
- Tarjeta de la selección elegida (bandera, apodo, moneda, comisión 0%)
- Tabla con los 12 grupos del Mundial
- Link a la calculadora "¿cuánto te quita tu plataforma?"

## Licencia

MIT. Los datos del Mundial son CC-BY 4.0.

## Relacionados

- [API abierta](https://nebbuler.com/api/mundial/v1/docs)
- [SDK TypeScript](https://www.npmjs.com/package/nebbuler-mundial-sdk)
- [MCP Server para LLMs](https://www.npmjs.com/package/nebbuler-mundial-mcp)
- [Web Components](https://www.npmjs.com/package/@nebbuler/elements)
- [Programa La Sombra](https://nebbuler.com/mundial)

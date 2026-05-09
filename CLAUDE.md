@AGENTS.md

# TOKEN EFFICIENCY RULES

## Context management
- Never read entire files unless asked. Read only the specific lines or functions needed.
- Do not explore the repo speculatively. Ask which files are relevant if unsure.
- Prefer targeted edits over full file rewrites.

## Responses
- Be concise. Skip preambles, summaries, and confirmations unless asked.
- No "Great! I'll now..." — just do the task.
- Output only what changed. Don't repeat unchanged code.

## Planning
- Before any complex task, output a short bullet plan and wait for approval.
- Use plan mode before expensive operations.

## Session hygiene
- When told /compact: summarize current goal, files modified, next steps. Nothing else.
- When context feels polluted, suggest /clear.

## Subagents
- For research-heavy tasks (reading many files, exploring logs), use a subagent.
- Return only: findings, affected files, recommended fix.

## File inclusion
- Ignore test fixtures, build outputs, lock files, and generated code unless explicitly needed.

# REGLA DE AUDITORÍA — NO NEGOCIABLE

Toda auditoría QA debe:
1. Hacer click en CADA botón visible en el sitio
2. Completar CADA formulario hasta el submit final
3. Seguir CADA flujo hasta el estado final real (dashboard, confirmación, o error con texto exacto)
4. "No verificable sin autenticación" no es aceptable — crear cuenta de prueba y verificar
5. Reportar el texto exacto del error que ve el usuario en pantalla

Un flujo no está auditado hasta que se llega al último paso.
Una auditoría que no hace click en los botones no es una auditoría.

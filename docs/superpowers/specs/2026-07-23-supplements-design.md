# Suplementos con checkbox diario y sugerencia IA

## Contexto

Sub-proyecto "suplementos" del roadmap Pulso. El usuario toma varios
suplementos (magnesio, melena de león, B12, vitamina D, etc.) y quiere:
(1) cargarlos una vez, (2) tildarlos cada día con un checkbox, (3) que la IA
le sugiera en qué momento del día tomarlos y si van con comida.

## Alcance

### Datos (Supabase, migración 00003)

- `supplements`: id, user_id, name, dose (text, opcional), time_of_day
  ('morning'|'midday'|'evening'|'night'), with_food (bool), tip (text,
  sugerencia IA de una línea), created_at. RLS por user_id.
- `supplement_logs`: id, user_id, supplement_id, date. Fila presente = tomado
  ese día. Checkbox = insert/delete. RLS por user_id.

### API

- `POST /api/suggest-supplement` `{name}` → `{timeOfDay, withFood, tip}` vía
  Gemini (cliente compartido extraído a `src/lib/ai.ts`, reusado también por
  `analyze-meal`).

### UI

- Página nueva `/supplements`: lista de suplementos del usuario + form de
  alta (nombre + dosis). Al agregar, la IA sugiere momento/con-comida/tip;
  el usuario puede corregir antes de guardar. Borrar con confirmación simple.
- Tarjeta "Supplements" en el dashboard Today: suplementos agrupados por
  momento del día con checkbox por cada uno (estado de HOY). Link "Manage"
  → `/supplements`. Si no hay suplementos, la tarjeta no se muestra (solo un
  link chico para crear el primero).
- Sin cambios en el nav inferior.

## Fuera de alcance

Catálogo de productos/marcas/barcode, notificaciones push, historial de
cumplimiento con gráficos, fotos de suplementos.

## Testing

Lógica de agrupado/toggle es trivial CRUD; verificación manual en browser.
La sugerencia IA se prueba con un request real.

## Git workflow

Commits directos a `main`, deploy a Vercel tras verificar build.

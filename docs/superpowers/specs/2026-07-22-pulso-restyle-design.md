# Restyle visual estilo Pulso (pulso.health)

## Contexto

Plate Log es una PWA de tracking de calorías por foto. Hoy usa una paleta neutra
(Tailwind `stone-*` + acento `amber-*`), tipografía del sistema, y tarjetas
planas sin sombra (`src/app/globals.css`, `AppShell.tsx`, etc.).

El usuario quiere, como primer paso de un roadmap más grande hacia paridad de
producto con Pulso (pulso.health), que la app **se vea** como Pulso. Este spec
cubre solo el restyle visual. Fuera de alcance: landing pública, actividad
física, suplementos, micronutrientes, plan personalizado, puntaje de
longevidad, coach IA — cada uno es su propio sub-proyecto futuro.

Referencia visual: capturas de la app real de Pulso (no solo la landing) —
`Progreso`/`Morfeo`/`Registrar`/`Plan`/`Mi data` como nav inferior de 5 tabs,
botones píldora (`rounded-full`) en acento índigo vivo, headings en negro/gris
muy oscuro (no navy), tarjetas blancas `rounded-2xl` con sombra suave sobre
fondo gris-lavanda muy claro, tab activo con fondo píldora tenue detrás del
ícono.

## Alcance

Cambio puramente visual (clases Tailwind + tipografía + fondo), sin tocar
lógica de negocio, rutas API, ni schema de Supabase.

### Paleta (`globals.css`, Tailwind v4 `@theme`)

| Uso | Antes | Después |
|---|---|---|
| Texto principal / headings | `stone-800/900` | `slate-900` (negro/gris muy oscuro, no navy) |
| Texto secundario / labels | `stone-400/500` | `slate-400/500` |
| Bordes neutros | `stone-200/300` | `slate-200` |
| Acento primario (botones, links, nav activo, focus rings) | `amber-400/500/600` | `indigo-500` (hover `indigo-600`) |
| Fondos sutiles de estado (ej. badges, alerts, pill activo en nav) | `amber-50/100`, `stone-50/100` | `indigo-50/100` |
| Fondo de página | blanco plano (`bg-white` en `AppShell`) | degradé sutil lila→blanco |
| Errores / destructivo | `red-*` | sin cambios |

Reemplazo mecánico de clases Tailwind en los ~17 componentes de `src/components`
y `src/app/**/page.tsx` que referencian `stone-*` o `amber-*`.

### Tipografía

`Plus Jakarta Sans` vía `next/font/google` (sin dependencias nuevas — es
parte de Next.js), reemplazando el font-stack del sistema en `layout.tsx` /
`globals.css`. Pesos bold para headings, regular/medium para body.

### Tarjetas

`rounded-2xl` + `shadow-sm` en tarjetas que hoy son planas/flat
(`MealCard`, `DailySummaryCard`, `FavoriteMealCard`, `MealReviewTable`, etc.),
para que "floten" sobre el nuevo fondo con degradé.

### Botones

Botones primarios pasan de su forma actual a `rounded-full` (píldora), fondo
`indigo-500`, texto blanco, bold.

### Nav inferior

`BottomNav.tsx`: ícono/label activo pasa de `amber-600` a `indigo-600`, y el
ícono activo gana un fondo píldora `indigo-50` detrás (como el tab "Mi data"
resaltado en Pulso).

## Fuera de alcance

- Cualquier feature nueva (actividad, suplementos, IA coach, plan, score).
- Landing pública de marketing.
- Cambios de layout/estructura de componentes más allá de radius/shadow.

## Testing

Cambio puramente visual — verificación manual en browser (`npm run dev`),
sin tests automatizados nuevos (no hay lógica que testear).

## Git workflow

Commits directos a `main` (decisión explícita del usuario — no se usan ramas
ni PRs para este trabajo).

# Pulso-style Visual Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Plate Log's existing screens (colors, typography, cards, buttons, nav) to match the visual identity of the Pulso app (pulso.health), without changing any business logic, API routes, or Supabase schema.

**Architecture:** Pure presentation-layer change. Tailwind v4 utility classes are swapped via mechanical find/replace (`stone-*`→`slate-*`, `amber-*`→`indigo-*`), a Google Font is added via `next/font/google`, and a handful of card/button/nav components get radius, shadow, and background touch-ups to match Pulso's floating-card look.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, `next/font/google`.

## Global Constraints

- No new npm dependencies (`next/font/google` ships with Next.js 16, already installed).
- No changes to component logic, props, API routes, or Supabase queries — class names and JSX structure only (BottomNav gets one small structural addition for the active-tab pill).
- Commits go directly to `main` (per user instruction — no branches/PRs for this work).
- Verification is manual (dev server + visual check in the Browser pane) per the spec's Testing section — no new automated tests, since there is no logic to unit test.
- Color mapping (from spec, exact and final):
  - `stone-N` → `slate-N` (same N, direct rename)
  - `amber-N` → `indigo-N` (same N, direct rename)
  - `red-*` unchanged (errors/destructive actions)

---

### Task 1: Add Plus Jakarta Sans font and update theme color

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:** N/A (root layout, no consumers within this plan).

- [ ] **Step 1: Add the font import and apply it in `layout.tsx`**

Replace the full contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Plate Log",
  description: "Personal food photo calorie tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Plate Log",
  },
};

export const viewport = "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakartaSans.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#eef2ff" />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
```

(Note: `bg-slate-50 text-slate-900` here already reflects the Task 2 color mapping applied to this file's two color classes, so this file does not need to be touched again in Task 2.)

- [ ] **Step 2: Apply the font variable in `globals.css`**

In `src/app/globals.css`, replace the `body` font-family rule. Before:

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

After:

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev` (in `platelog/`), open `http://localhost:3000` in the Browser pane.
Expected: page loads with no console errors; headings render in Plus Jakarta Sans (rounder, bolder than the old system font).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "Add Plus Jakarta Sans font and update theme color"
git push origin main
```

---

### Task 2: Global color token swap (stone→slate, amber→indigo)

**Files:**
- Modify (color classes only): `src/components/AppShell.tsx`, `src/components/BottomNav.tsx`, `src/components/ConfirmDeleteDialog.tsx`, `src/components/DailySummaryCard.tsx`, `src/components/EmptyState.tsx`, `src/components/FavoriteMealCard.tsx`, `src/components/IngredientRow.tsx`, `src/components/LoadingState.tsx`, `src/components/MacroSummary.tsx`, `src/components/MealCard.tsx`, `src/components/MealForm.tsx`, `src/components/MealPhotoInput.tsx`, `src/components/MealReviewTable.tsx`, `src/components/ProfileForm.tsx`, `src/components/WeightLogForm.tsx`, `src/app/auth/page.tsx`, `src/app/favorites/page.tsx`, `src/app/history/page.tsx`, `src/app/meals/[id]/page.tsx`, `src/app/meals/new/page.tsx`, `src/app/profile/page.tsx`, `src/app/weight/page.tsx`, `src/app/page.tsx`

**Interfaces:** N/A — string-literal class replacement only, no prop/type changes.

This codebase's only uses of the substrings `stone-` and `amber-` are Tailwind color-scale classes (verified: `grep -rn "amber\|stone" src --include="*.tsx" --include="*.ts" --include="*.css" | grep -vE "(amber|stone)-[0-9]"` returns nothing). A blind substring replacement is therefore safe.

- [ ] **Step 1: Run the replacement**

From the `platelog/` repo root:

```bash
grep -rlZ -E "stone-|amber-" src --include="*.tsx" | xargs -0 sed -i '' \
  -e 's/stone-/slate-/g' \
  -e 's/amber-/indigo-/g'
```

(On Linux, drop the `''` after `-i`: `sed -i -e ... -e ...`.)

- [ ] **Step 2: Verify no `stone`/`amber` classes remain**

Run: `grep -rn "stone-\|amber-" src --include="*.tsx"`
Expected: no output (except `src/app/layout.tsx`, which Task 1 already updated directly — confirm it shows `slate-50`/`slate-900`, not `stone-*`).

- [ ] **Step 3: Typecheck and build**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors (this is a pure string change, so it should be a no-op for the type system — this step just guards against a stray edit).

- [ ] **Step 4: Visual check**

Run: `npm run dev`, open the Browser pane at `http://localhost:3000`, and click through: Today (`/`), Add meal (`/meals/new`), History (`/history`), Favorites (`/favorites`), Profile (`/profile`).
Expected: no more amber/orange accents anywhere; all former-amber buttons, links, badges, and the active nav tab are now indigo; all former-stone neutrals (text, borders, backgrounds) are now slate. No layout shifts, no broken buttons.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Swap stone/amber color tokens for slate/indigo across the app"
git push origin main
```

---

### Task 3: Lavender-tinted page background

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/AppShell.tsx`

**Interfaces:** N/A.

Pulso's screens sit on a very light gray-lavender background (not flat white), with white cards floating on top via shadow. Today, `globals.css` sets `--background: #fafaf9` (warm off-white) and `AppShell.tsx` wraps the whole page in `bg-white`.

- [ ] **Step 1: Update the background to a subtle lavender→white gradient**

In `src/app/globals.css`, change:

```css
:root {
  --background: #fafaf9;
  --foreground: #1c1917;
}
```

to:

```css
:root {
  --background: #eef0fb;
  --foreground: #0f172a;
}
```

(`#0f172a` is Tailwind `slate-900`, matching Task 2's body text color.)

Then find the `body` rule (already touched once in Task 1 for `font-family`) and change its `background` line from:

```css
  background: var(--background);
```

to:

```css
  background: linear-gradient(180deg, var(--background) 0%, #fafbfe 480px, #fafbfe 100%);
```

This keeps the page background a subtle lavender tint near the top (matching Pulso's app screens) that settles to near-white further down, rather than one flat color or a jarring full-page gradient.

- [ ] **Step 2: Remove the flat white page background in `AppShell.tsx`**

In `src/components/AppShell.tsx`, change the outer `<div>` from (post-Task-2 state):

```tsx
<div className="mx-auto min-h-screen max-w-lg bg-white pb-20">
```

to:

```tsx
<div className="mx-auto min-h-screen max-w-lg pb-20">
```

(Removing `bg-white` lets the `body`'s `--background` lavender show through; individual cards keep their own `bg-white` so they visually "float".)

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:3000` in the Browser pane.
Expected: page background is a very light lavender-gray, and white cards (daily summary, meal cards) stand out against it instead of blending into a flat white page.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/AppShell.tsx
git commit -m "Switch page background to lavender tint so cards float"
git push origin main
```

---

### Task 4: Card polish — rounded-2xl + shadow on primary cards

**Files:**
- Modify: `src/components/MealCard.tsx:14`
- Modify: `src/components/FavoriteMealCard.tsx:24`
- Modify: `src/components/MacroSummary.tsx:21`
- Modify: `src/components/EmptyState.tsx:9`
- Modify: `src/components/MealReviewTable.tsx:100`

**Interfaces:** N/A.

These are the primary content cards on the Today/History/Favorites screens. Post-Task-2, their classes use `slate-*` already. Each gets bumped from `rounded-xl`/no-shadow to `rounded-2xl` + `shadow-sm`, and the two that currently sit on a flat `bg-slate-50` get a white background so they float on the new lavender page background from Task 3.

- [ ] **Step 1: `MealCard.tsx`**

Before:
```tsx
<div className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-300">
```
After:
```tsx
<div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300">
```

- [ ] **Step 2: `FavoriteMealCard.tsx`**

Before:
```tsx
<div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300">
```
After:
```tsx
<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
```

- [ ] **Step 3: `MacroSummary.tsx`** (this renders the Today screen's daily summary card)

Before:
```tsx
<div className="rounded-xl bg-slate-50 p-4">
```
After:
```tsx
<div className="rounded-2xl bg-white p-4 shadow-sm">
```

- [ ] **Step 4: `EmptyState.tsx`**

Before:
```tsx
<div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-6 py-12 text-center">
```
After:
```tsx
<div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
```

- [ ] **Step 5: `MealReviewTable.tsx`** (the "Totals" card on the meal-review screen)

Before (post-Task-2 state — `amber-50` became `indigo-50`):
```tsx
<div className="rounded-xl bg-indigo-50 p-4">
```
After:
```tsx
<div className="rounded-2xl bg-indigo-50 p-4 shadow-sm">
```

- [ ] **Step 6: Verify**

Run: `npm run dev`, open `/` (Today), `/favorites`, and the meal-review step of `/meals/new` (add a photo/description and analyze) in the Browser pane.
Expected: the daily summary card, meal cards, favorite cards, the "no meals" empty state, and the review Totals card all render as rounded cards with a soft shadow, visually floating above the lavender background.

- [ ] **Step 7: Commit**

```bash
git add src/components/MealCard.tsx src/components/FavoriteMealCard.tsx src/components/MacroSummary.tsx src/components/EmptyState.tsx src/components/MealReviewTable.tsx
git commit -m "Give primary cards rounded-2xl corners and a floating shadow"
git push origin main
```

---

### Task 5: Pill-shaped primary buttons

**Files:**
- Modify (radius only, 11 occurrences across): `src/app/auth/page.tsx`, `src/app/favorites/page.tsx`, `src/app/history/page.tsx`, `src/app/meals/[id]/page.tsx`, `src/app/meals/new/page.tsx`, `src/components/EmptyState.tsx`, `src/components/FavoriteMealCard.tsx`, `src/components/MealForm.tsx`, `src/components/ProfileForm.tsx`, `src/components/WeightLogForm.tsx`

**Interfaces:** N/A.

Every primary (solid, indigo, white-text) button in the app follows the literal pattern `rounded-xl bg-indigo-500` or `rounded-lg bg-indigo-500` post-Task-2. Pulso's primary buttons are full pills. This is a second safe blind substring replacement — verified below that only true primary CTA buttons match.

- [ ] **Step 1: Verify the exact match set before replacing**

Run: `grep -rn "rounded-xl bg-indigo-500\|rounded-lg bg-indigo-500" src --include="*.tsx"`
Expected: exactly 11 lines, one each in the 10 files listed above (2 in `favorites/page.tsx`) — all `<button>` elements with white text (`text-white`). If any non-button element matches, stop and re-scope this task instead of running the sed.

- [ ] **Step 2: Run the replacement**

```bash
grep -rlZ -E "rounded-xl bg-indigo-500|rounded-lg bg-indigo-500" src --include="*.tsx" | xargs -0 sed -i '' \
  -e 's/rounded-xl bg-indigo-500/rounded-full bg-indigo-500/g' \
  -e 's/rounded-lg bg-indigo-500/rounded-full bg-indigo-500/g'
```

(On Linux, drop the `''` after `-i`.)

- [ ] **Step 3: Verify**

Run: `grep -rn "rounded-xl bg-indigo-500\|rounded-lg bg-indigo-500" src --include="*.tsx"`
Expected: no output (all converted to `rounded-full`).

Run: `npm run dev`, check the "Save profile" button (`/profile`), the meal save button (`/meals/new`), and the "Add meal" empty-state button (`/`) in the Browser pane.
Expected: these buttons are now full pills (fully rounded ends), solid indigo, white text — matching Pulso's "Siguiente" button style.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Make primary CTA buttons full pills to match Pulso's button style"
git push origin main
```

---

### Task 6: Bottom nav active-tab pill highlight

**Files:**
- Modify: `src/components/BottomNav.tsx`

**Interfaces:** N/A — internal component, no external consumers change.

Pulso highlights the active bottom-nav tab with a soft pill background behind the icon, not just a text color change. Post-Task-2, `BottomNav.tsx`'s active/inactive classes already read `text-indigo-600` / `text-slate-400 hover:text-slate-600`. This step restructures the icon `<span>` to add the pill.

- [ ] **Step 1: Replace the `Link` block**

Before (post-Task-2 state):

```tsx
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-3 py-2 text-xs transition ${
                isActive
                  ? 'text-indigo-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-0.5">{item.label}</span>
            </Link>
```

After:

```tsx
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition ${
                isActive
                  ? 'text-indigo-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span
                className={`flex h-8 w-10 items-center justify-center rounded-full text-lg transition ${
                  isActive ? 'bg-indigo-50' : ''
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, open the Browser pane, and click through all 5 bottom-nav tabs.
Expected: the active tab's icon sits inside a soft indigo-tinted pill; inactive tabs have no pill, just gray icon/label. No layout jump when switching tabs.

- [ ] **Step 3: Commit**

```bash
git add src/components/BottomNav.tsx
git commit -m "Add pill highlight behind the active bottom-nav tab"
git push origin main
```

---

### Task 7: Full visual QA pass

**Files:** None (verification-only task).

**Interfaces:** N/A.

- [ ] **Step 1: Walk every screen**

Run: `npm run dev`. Using the Browser pane, visit and screenshot each of: `/` (Today), `/meals/new` (Add meal), `/history`, `/favorites`, `/profile`, `/weight`, `/auth` (log out first if needed to reach it), and a meal detail page (`/meals/[id]` — open any meal from History).

- [ ] **Step 2: Compare against the Pulso reference**

For each screenshot, confirm: no leftover `amber`/`stone`/`orange` colors, no leftover flat-white cards without shadow, no leftover sharp-cornered primary buttons, headings render in Plus Jakarta Sans, bottom nav shows the active pill.

- [ ] **Step 3: Fix any stragglers found**

If Step 2 finds a missed spot, fix it directly (same pattern as the relevant earlier task), then re-run `npm run build` to confirm no TypeScript errors.

- [ ] **Step 4: Final commit (only if Step 3 found something to fix)**

```bash
git add -A
git commit -m "Fix remaining visual stragglers from QA pass"
git push origin main
```

'use client';

import Link from 'next/link';

// Segmented switch shown at the top of the "Add" flows (meal / supplements)
export default function AddTabs({ active }: { active: 'meal' | 'supplements' }) {
  const base = 'flex-1 rounded-full py-2 text-center text-sm font-medium transition';
  return (
    <div className="mb-4 flex gap-1 rounded-full bg-slate-100 p-1">
      <Link
        href="/meals/new"
        className={`${base} ${
          active === 'meal' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
        }`}
      >
        🍽 Meal
      </Link>
      <Link
        href="/supplements"
        className={`${base} ${
          active === 'supplements' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
        }`}
      >
        💊 Supplements
      </Link>
    </div>
  );
}

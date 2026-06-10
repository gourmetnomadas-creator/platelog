'use client';

import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-white pb-20">
      <header className="border-b border-stone-100 px-4 py-3">
        <h1 className="text-lg font-bold text-stone-800">Plate Log</h1>
      </header>
      <main className="px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}

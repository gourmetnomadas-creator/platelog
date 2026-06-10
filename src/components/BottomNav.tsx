'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Today', icon: '📊' },
  { href: '/meals/new', label: 'Add', icon: '➕' },
  { href: '/history', label: 'History', icon: '📋' },
  { href: '/favorites', label: 'Favs', icon: '⭐' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-3 py-2 text-xs transition ${
                isActive
                  ? 'text-amber-600'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

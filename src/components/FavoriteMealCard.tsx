'use client';

import { FavoriteMeal } from '@/types';

interface FavoriteMealCardProps {
  favorite: FavoriteMeal;
  onUse: (favorite: FavoriteMeal) => void;
  onDelete: (favorite: FavoriteMeal) => void;
}

export default function FavoriteMealCard({
  favorite,
  onUse,
  onDelete,
}: FavoriteMealCardProps) {
  const totalKcal =
    favorite.items?.reduce(
      (sum, item) =>
        sum + (item.grams * item.kcal_per_100g) / 100,
      0
    ) ?? 0;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 transition hover:border-stone-300">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-stone-800">{favorite.name}</h3>
          {favorite.description && (
            <p className="mt-0.5 text-xs text-stone-500">{favorite.description}</p>
          )}
          {favorite.default_total_weight_g && (
            <p className="mt-0.5 text-xs text-stone-400">
              {Math.round(favorite.default_total_weight_g)} g
            </p>
          )}
          <p className="mt-1 text-sm font-medium text-stone-600">
            {Math.round(totalKcal)} kcal
          </p>
          {favorite.items && (
            <div className="mt-1 flex flex-wrap gap-1">
              {favorite.items.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500"
                >
                  {item.food_name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="ml-3 flex flex-col gap-1">
          <button
            onClick={() => onUse(favorite)}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-600"
          >
            Use
          </button>
          <button
            onClick={() => onDelete(favorite)}
            className="rounded-lg px-3 py-1.5 text-xs text-red-400 transition hover:text-red-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

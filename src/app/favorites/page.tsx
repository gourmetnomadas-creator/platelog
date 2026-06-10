'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FavoriteMeal } from '@/types';
import AppShell from '@/components/AppShell';
import FavoriteMealCard from '@/components/FavoriteMealCard';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<FavoriteMeal | null>(null);
  const [session, setSession] = useState<any>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) {
        router.push('/auth');
        return;
      }
      setSession(s);
      loadFavorites(supabase, s.user.id);
    });
  }, []);

  const loadFavorites = async (supabase: any, userId: string) => {
    const { data } = await supabase
      .from('favorite_meals')
      .select('*, items:favorite_meal_items(*)')
      .eq('user_id', userId)
      .order('name');

    if (data) setFavorites(data);
    setLoading(false);
  };

  const handleUse = async (favorite: FavoriteMeal) => {
    if (!session) return;
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    const { data: meal } = await supabase
      .from('meals')
      .insert({
        user_id: session.user.id,
        date: today,
        meal_type: 'lunch',
        description: favorite.description || favorite.name,
        total_weight_g: favorite.default_total_weight_g,
        status: 'draft',
      })
      .select()
      .single();

    if (meal && favorite.items) {
      const items = favorite.items.map((item) => ({
        meal_id: meal.id,
        food_name: item.food_name,
        grams: item.grams,
        kcal_per_100g: item.kcal_per_100g,
        protein_per_100g: item.protein_per_100g,
        carbs_per_100g: item.carbs_per_100g,
        fat_per_100g: item.fat_per_100g,
        kcal: (item.grams * item.kcal_per_100g) / 100,
        protein_g: (item.grams * item.protein_per_100g) / 100,
        carbs_g: (item.grams * item.carbs_per_100g) / 100,
        fat_g: (item.grams * item.fat_per_100g) / 100,
        source: 'favorite',
        confidence: 1,
      }));

      await supabase.from('meal_items').insert(items);

      const totals = items.reduce(
        (acc, item) => ({
          totalKcal: acc.totalKcal + item.kcal,
          totalProtein: acc.totalProtein + item.protein_g,
          totalCarbs: acc.totalCarbs + item.carbs_g,
          totalFat: acc.totalFat + item.fat_g,
        }),
        { totalKcal: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
      );

      await supabase
        .from('meals')
        .update({ ...totals, status: 'saved' })
        .eq('id', meal.id);
    }

    router.push('/');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();
    await supabase.from('favorite_meals').delete().eq('id', deleteTarget.id);
    setFavorites((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleCreate = async () => {
    if (!session || !newName.trim()) return;
    const supabase = createClient();

    await supabase.from('favorite_meals').insert({
      user_id: session.user.id,
      name: newName.trim(),
      description: newDescription.trim() || null,
    });

    setNewName('');
    setNewDescription('');
    setShowNewForm(false);
    loadFavorites(supabase, session.user.id);
  };

  if (loading) return <AppShell><LoadingState /></AppShell>;
  if (!session) return null;

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Favorites</h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white"
        >
          + New
        </button>
      </div>

      {showNewForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-stone-200 bg-white p-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Meal name"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          />
          <button
            onClick={handleCreate}
            className="w-full rounded-lg bg-amber-500 py-2 text-sm font-medium text-white"
          >
            Save favorite
          </button>
        </div>
      )}

      {favorites.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Save frequent meals to reuse them quickly."
          action={{ label: 'Create favorite', onClick: () => setShowNewForm(true) }}
        />
      ) : (
        <div className="space-y-3">
          {favorites.map((favorite) => (
            <FavoriteMealCard
              key={favorite.id}
              favorite={favorite}
              onUse={handleUse}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title="Delete favorite?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppShell>
  );
}

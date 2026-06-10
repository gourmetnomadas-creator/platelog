'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AppShell from '@/components/AppShell';
import MealReviewTable from '@/components/MealReviewTable';
import LoadingState from '@/components/LoadingState';
import { Meal, AIAnalysisItem } from '@/types';

export default function EditMealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [items, setItems] = useState<AIAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) {
        router.push('/auth');
        return;
      }
      setSession(s);
      loadMeal(supabase, s.user.id);
    });
  }, [id]);

  const loadMeal = async (supabase: any, userId: string) => {
    const { data: meal } = await supabase
      .from('meals')
      .select('*, items:meal_items(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (meal) {
      setMeal(meal);
      setItems(
        (meal.items || []).map((item: any) => ({
          foodName: item.food_name,
          grams: item.grams,
          kcalPer100g: item.kcal_per_100g,
          proteinPer100g: item.protein_per_100g,
          carbsPer100g: item.carbs_per_100g,
          fatPer100g: item.fat_per_100g,
          source: item.source || 'manual',
          confidence: item.confidence || 1,
        }))
      );
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!meal || !session) return;
    setSaving(true);

    const supabase = createClient();

    const totals = items.reduce(
      (acc, item) => ({
        totalKcal: acc.totalKcal + (item.grams * item.kcalPer100g) / 100,
        totalProtein: acc.totalProtein + (item.grams * item.proteinPer100g) / 100,
        totalCarbs: acc.totalCarbs + (item.grams * item.carbsPer100g) / 100,
        totalFat: acc.totalFat + (item.grams * item.fatPer100g) / 100,
      }),
      { totalKcal: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );

    await supabase
      .from('meals')
      .update({
        total_kcal: totals.totalKcal,
        total_protein_g: totals.totalProtein,
        total_carbs_g: totals.totalCarbs,
        total_fat_g: totals.totalFat,
      })
      .eq('id', id);

    await supabase.from('meal_items').delete().eq('meal_id', id);

    const mealItems = items.map((item) => ({
      meal_id: id,
      food_name: item.foodName,
      grams: item.grams,
      kcal_per_100g: item.kcalPer100g,
      protein_per_100g: item.proteinPer100g,
      carbs_per_100g: item.carbsPer100g,
      fat_per_100g: item.fatPer100g,
      kcal: (item.grams * item.kcalPer100g) / 100,
      protein_g: (item.grams * item.proteinPer100g) / 100,
      carbs_g: (item.grams * item.carbsPer100g) / 100,
      fat_g: (item.grams * item.fatPer100g) / 100,
      source: item.source,
      confidence: item.confidence,
    }));

    await supabase.from('meal_items').insert(mealItems);

    setSaving(false);
    router.push('/');
  };

  if (loading) return <AppShell><LoadingState /></AppShell>;
  if (!meal) return <AppShell><p className="text-stone-500">Meal not found.</p></AppShell>;

  return (
    <AppShell>
      <h2 className="mb-1 text-lg font-semibold text-stone-800">Edit meal</h2>
      {meal.description && (
        <p className="mb-4 text-sm text-stone-500">{meal.description}</p>
      )}

      <MealReviewTable
        items={items}
        warnings={[
          'This is an estimate. Please review the grams before saving.',
        ]}
        confidence={meal.ai_confidence ?? 0.7}
        onItemsChange={setItems}
      />

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex-1 rounded-xl border border-stone-300 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </AppShell>
  );
}

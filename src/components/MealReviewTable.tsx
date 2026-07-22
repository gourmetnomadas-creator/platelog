'use client';

import { AIAnalysisItem } from '@/types';
import IngredientRow from './IngredientRow';
import { calculateItemNutrition, calculateMealTotals } from '@/lib/calculations';

interface MealReviewTableProps {
  items: AIAnalysisItem[];
  warnings: string[];
  confidence: number;
  onItemsChange: (items: AIAnalysisItem[]) => void;
}

export default function MealReviewTable({
  items,
  warnings,
  confidence,
  onItemsChange,
}: MealReviewTableProps) {
  const totals = calculateMealTotals(
    items.map((i) => ({
      grams: i.grams,
      kcal_per_100g: i.kcalPer100g,
      protein_per_100g: i.proteinPer100g,
      carbs_per_100g: i.carbsPer100g,
      fat_per_100g: i.fatPer100g,
    }))
  );

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    onItemsChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onItemsChange(updated);
  };

  const handleAdd = () => {
    const updated = [
      ...items,
      {
        foodName: 'new ingredient',
        grams: 50,
        kcalPer100g: 100,
        proteinPer100g: 5,
        carbsPer100g: 10,
        fatPer100g: 3,
        source: 'manual',
        confidence: 1,
      },
    ];
    onItemsChange(updated);
  };

  return (
    <div className="space-y-4">
      {warnings.map((w, i) => (
        <div
          key={i}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs text-indigo-700"
        >
          ⚠️ {w}
        </div>
      ))}

      <div className="rounded-lg bg-slate-50 px-4 py-2 text-center text-xs text-slate-500">
        AI confidence: {Math.round(confidence * 100)}%
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <IngredientRow
            key={index}
            index={index}
            foodName={item.foodName}
            grams={item.grams}
            kcalPer100g={item.kcalPer100g}
            proteinPer100g={item.proteinPer100g}
            carbsPer100g={item.carbsPer100g}
            fatPer100g={item.fatPer100g}
            confidence={item.confidence}
            source={item.source}
            onChange={handleItemChange}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-lg border-2 border-dashed border-slate-300 py-2 text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-600"
      >
        + Add ingredient manually
      </button>

      <div className="rounded-xl bg-indigo-50 p-4">
        <h4 className="mb-2 text-sm font-semibold text-slate-700">Totals</h4>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <p className="text-lg font-bold text-slate-800">{Math.round(totals.totalKcal)}</p>
            <p className="text-slate-500">kcal</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{Math.round(totals.totalProtein)}g</p>
            <p className="text-slate-500">Protein</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{Math.round(totals.totalCarbs)}g</p>
            <p className="text-slate-500">Carbs</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{Math.round(totals.totalFat)}g</p>
            <p className="text-slate-500">Fat</p>
          </div>
        </div>
      </div>
    </div>
  );
}

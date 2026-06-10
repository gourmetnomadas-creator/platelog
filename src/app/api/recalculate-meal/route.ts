import { NextRequest, NextResponse } from 'next/server';
import { recalculateMealSchema } from '@/lib/validations';
import { calculateItemNutrition, calculateMealTotals } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = recalculateMealSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const items = parsed.data.items.map((item) => ({
      grams: item.grams,
      kcal_per_100g: item.kcalPer100g,
      protein_per_100g: item.proteinPer100g,
      carbs_per_100g: item.carbsPer100g,
      fat_per_100g: item.fatPer100g,
    }));

    const updatedItems = items.map((item) => {
      const nutrition = calculateItemNutrition(item);
      return {
        foodName: item.grams, // will be overridden below
        grams: item.grams,
        kcalPer100g: item.kcal_per_100g,
        proteinPer100g: item.protein_per_100g,
        carbsPer100g: item.carbs_per_100g,
        fatPer100g: item.fat_per_100g,
        ...nutrition,
      };
    });

    const totals = calculateMealTotals(items);

    return NextResponse.json({
      items: updatedItems.map((item, i) => ({
        ...item,
        foodName: parsed.data.items[i].foodName,
      })),
      ...totals,
    });
  } catch (error) {
    console.error('Recalculate meal error:', error);
    return NextResponse.json(
      { error: 'Could not recalculate meal totals.' },
      { status: 500 }
    );
  }
}

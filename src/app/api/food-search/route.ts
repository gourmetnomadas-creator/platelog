import { NextRequest, NextResponse } from 'next/server';
import { searchLocalFoods } from '@/lib/food-database';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ foods: [] });
  }

  const localResults = searchLocalFoods(query);

  let usdaResults: any[] = [];

  if (process.env.USDA_API_KEY) {
    try {
      const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
      url.searchParams.set('api_key', process.env.USDA_API_KEY);
      url.searchParams.set('query', query);
      url.searchParams.set('pageSize', '5');

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        usdaResults = (data.foods || []).map((food: any) => ({
          name: food.description,
          kcalPer100g: food.foodNutrients?.find((n: any) => n.nutrientId === 1008)?.value ?? 0,
          proteinPer100g: food.foodNutrients?.find((n: any) => n.nutrientId === 1003)?.value ?? 0,
          carbsPer100g: food.foodNutrients?.find((n: any) => n.nutrientId === 1005)?.value ?? 0,
          fatPer100g: food.foodNutrients?.find((n: any) => n.nutrientId === 1004)?.value ?? 0,
          source: 'usda',
        }));
      }
    } catch (e) {
      console.error('USDA search error:', e);
    }
  }

  const combined = [
    ...usdaResults,
    ...localResults.map((f) => ({ ...f, source: 'local' })),
  ];

  return NextResponse.json({ foods: combined });
}

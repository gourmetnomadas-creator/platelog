'use client';

import MacroSummary from './MacroSummary';

interface DailySummaryCardProps {
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetKcal: number | null;
}

export default function DailySummaryCard({
  totalKcal,
  totalProtein,
  totalCarbs,
  totalFat,
  targetKcal,
}: DailySummaryCardProps) {
  return (
    <MacroSummary
      kcal={totalKcal}
      protein={totalProtein}
      carbs={totalCarbs}
      fat={totalFat}
      targetKcal={targetKcal ?? undefined}
      showTarget={!!targetKcal}
    />
  );
}

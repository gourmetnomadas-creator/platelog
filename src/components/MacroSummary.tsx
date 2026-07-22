interface MacroSummaryProps {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  targetKcal?: number;
  showTarget?: boolean;
}

export default function MacroSummary({
  kcal,
  protein,
  carbs,
  fat,
  targetKcal,
  showTarget = false,
}: MacroSummaryProps) {
  const remaining = targetKcal ? targetKcal - kcal : null;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      {showTarget && targetKcal && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">Daily target</span>
          <span className="text-sm font-medium text-slate-700">{Math.round(targetKcal)} kcal</span>
        </div>
      )}
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-800">{Math.round(kcal)}</span>
        <span className="text-sm text-slate-500">kcal</span>
      </div>
      {remaining !== null && (
        <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-400 transition-all"
            style={{ width: `${Math.min((kcal / targetKcal!) * 100, 100)}%` }}
          />
        </div>
      )}
      {remaining !== null && (
        <p className="mb-3 text-xs text-slate-500">
          {remaining > 0
            ? `${Math.round(remaining)} kcal remaining`
            : `${Math.abs(Math.round(remaining))} kcal over target`}
        </p>
      )}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <p className="font-semibold text-slate-700">{Math.round(protein)}g</p>
          <p className="text-slate-400">Protein</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700">{Math.round(carbs)}g</p>
          <p className="text-slate-400">Carbs</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700">{Math.round(fat)}g</p>
          <p className="text-slate-400">Fat</p>
        </div>
      </div>
    </div>
  );
}

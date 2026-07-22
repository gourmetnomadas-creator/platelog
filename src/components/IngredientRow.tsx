'use client';

interface IngredientRowProps {
  index: number;
  foodName: string;
  grams: number;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  confidence?: number | null;
  source?: string | null;
  onChange: (index: number, field: string, value: string | number) => void;
  onDelete: (index: number) => void;
}

export default function IngredientRow({
  index,
  foodName,
  grams,
  kcalPer100g,
  proteinPer100g,
  carbsPer100g,
  fatPer100g,
  confidence,
  source,
  onChange,
  onDelete,
}: IngredientRowProps) {
  const handleChange = (field: string, value: string) => {
    const numValue = field === 'foodName' ? value : parseFloat(value) || 0;
    onChange(index, field, numValue);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-start justify-between">
        <input
          type="text"
          value={foodName}
          onChange={(e) => handleChange('foodName', e.target.value)}
          className="flex-1 rounded border border-slate-200 px-2 py-1 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400"
        />
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="ml-2 text-sm text-red-400 hover:text-red-600"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2 text-xs">
        <div>
          <label className="block text-slate-400">Grams</label>
          <input
            type="number"
            value={grams}
            onChange={(e) => handleChange('grams', e.target.value)}
            className="w-full rounded border border-slate-200 px-1.5 py-1 text-center outline-none focus:border-indigo-400"
            min="0"
            step="1"
          />
        </div>
        <div>
          <label className="block text-slate-400">kcal/100g</label>
          <input
            type="number"
            value={kcalPer100g}
            onChange={(e) => handleChange('kcalPer100g', e.target.value)}
            className="w-full rounded border border-slate-200 px-1.5 py-1 text-center outline-none focus:border-indigo-400"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-slate-400">Protein</label>
          <input
            type="number"
            value={proteinPer100g}
            onChange={(e) => handleChange('proteinPer100g', e.target.value)}
            className="w-full rounded border border-slate-200 px-1.5 py-1 text-center outline-none focus:border-indigo-400"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-slate-400">Carbs</label>
          <input
            type="number"
            value={carbsPer100g}
            onChange={(e) => handleChange('carbsPer100g', e.target.value)}
            className="w-full rounded border border-slate-200 px-1.5 py-1 text-center outline-none focus:border-indigo-400"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-slate-400">Fat</label>
          <input
            type="number"
            value={fatPer100g}
            onChange={(e) => handleChange('fatPer100g', e.target.value)}
            className="w-full rounded border border-slate-200 px-1.5 py-1 text-center outline-none focus:border-indigo-400"
            min="0"
            step="0.1"
          />
        </div>
      </div>
      {(confidence || source) && (
        <div className="mt-1 flex gap-3 text-[10px] text-slate-400">
          {confidence && <span>Confidence: {Math.round(confidence * 100)}%</span>}
          {source && <span>Source: {source}</span>}
        </div>
      )}
    </div>
  );
}

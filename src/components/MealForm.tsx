'use client';

import { useState } from 'react';
import MealPhotoInput from './MealPhotoInput';
import { MealType, WeightContext } from '@/types';

interface MealFormProps {
  onSubmit: (data: {
    description: string;
    mealType: MealType;
    totalWeightGrams: number;
    weightContext: WeightContext;
    imageBase64: string | null;
  }) => void;
  loading: boolean;
}

export default function MealForm({ onSubmit, loading }: MealFormProps) {
  const [description, setDescription] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [totalWeightGrams, setTotalWeightGrams] = useState('');
  const [weightContext, setWeightContext] = useState<WeightContext>('whole_plate');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const weight = parseFloat(totalWeightGrams);
    if (!description.trim()) {
      setError('Please enter a meal description.');
      return;
    }
    if (!weight || weight <= 0) {
      setError('Please enter the meal weight in grams.');
      return;
    }

    onSubmit({
      description: description.trim(),
      mealType,
      totalWeightGrams: weight,
      weightContext,
      imageBase64,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">Meal type</label>
        <div className="grid grid-cols-4 gap-2">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMealType(type)}
              className={`rounded-lg py-2 text-sm font-medium capitalize transition ${
                mealType === type
                  ? 'bg-amber-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">Photo</label>
        <MealPhotoInput
          photoPreview={imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null}
          onPhotoCapture={setImageBase64}
          onClear={() => setImageBase64(null)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='e.g. "oatmeal with banana" or "200g oatmeal and one banana"'
          rows={2}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
          Total weight in grams
        </label>
        <input
          type="number"
          value={totalWeightGrams}
          onChange={(e) => setTotalWeightGrams(e.target.value)}
          placeholder="e.g. 200"
          min="1"
          step="1"
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
          What does the weight refer to?
        </label>
        <div className="space-y-2">
          {(
            [
              { value: 'whole_plate', label: 'Whole plate' },
              { value: 'one_ingredient', label: 'One ingredient only' },
              { value: 'separate_ingredients', label: 'Ingredients weighed separately' },
            ] as { value: WeightContext; label: string }[]
          ).map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm transition ${
                weightContext === option.value
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              <input
                type="radio"
                name="weightContext"
                value={option.value}
                checked={weightContext === option.value}
                onChange={() => setWeightContext(option.value)}
                className="mr-2 accent-amber-500"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-500 py-3 text-base font-semibold text-white transition hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze meal'}
      </button>
    </form>
  );
}

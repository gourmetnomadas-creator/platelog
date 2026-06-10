'use client';

import { useState } from 'react';

interface WeightLogFormProps {
  onSave: (data: { date: string; weight_kg: number; notes: string }) => void;
  saving: boolean;
}

export default function WeightLogForm({ onSave, saving }: WeightLogFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [weightKg, setWeightKg] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(weightKg);
    if (!weight || weight <= 0) return;
    onSave({ date, weight_kg: weight, notes: notes.trim() });
    setWeightKg('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </div>
      <div className="w-24">
        <input
          type="number"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          placeholder="kg"
          step="0.1"
          min="0"
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </div>
      <button
        type="submit"
        disabled={saving || !weightKg}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50"
      >
        Log
      </button>
    </form>
  );
}

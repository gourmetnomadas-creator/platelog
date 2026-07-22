'use client';

import { useState, useEffect } from 'react';
import { Profile, ActivityLevel, GoalType } from '@/types';
import { calculateBMR, getActivityMultiplier, getGoalAdjustment } from '@/lib/calculations';

interface ProfileFormProps {
  profile: Profile | null;
  onSave: (data: Partial<Profile>) => void;
  saving: boolean;
}

export default function ProfileForm({ profile, onSave, saving }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name || '');
  const [heightCm, setHeightCm] = useState(profile?.height_cm?.toString() || '');
  const [weightKg, setWeightKg] = useState(profile?.current_weight_kg?.toString() || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [sex, setSex] = useState(profile?.sex || '');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    (profile?.activity_level as ActivityLevel) || 'sedentary'
  );
  const [goalType, setGoalType] = useState<GoalType>(
    (profile?.goal_type as GoalType) || 'maintain'
  );
  const [manualTarget, setManualTarget] = useState(
    profile?.manual_calorie_target?.toString() || ''
  );

  const calculatedTarget = (() => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    const a = parseInt(age);
    if (!w || !h || !a || !sex) return null;
    const bmr = calculateBMR(w, h, a, sex);
    const mult = getActivityMultiplier(activityLevel);
    const adj = getGoalAdjustment(goalType);
    return Math.round(bmr * mult + adj);
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name || null,
      height_cm: parseFloat(heightCm) || null,
      current_weight_kg: parseFloat(weightKg) || null,
      age: parseInt(age) || null,
      sex: sex || null,
      activity_level: activityLevel,
      goal_type: goalType,
      manual_calorie_target: goalType === 'manual' ? parseInt(manualTarget) || null : null,
      calculated_calorie_target: calculatedTarget,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          placeholder="Your name"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Activity level</label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Light exercise</option>
          <option value="moderate">Moderate exercise</option>
          <option value="active">Active</option>
          <option value="very_active">Very active</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Goal</label>
        <select
          value={goalType}
          onChange={(e) => setGoalType(e.target.value as GoalType)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        >
          <option value="maintain">Maintain weight</option>
          <option value="mild_deficit">Mild deficit</option>
          <option value="mild_surplus">Mild surplus</option>
          <option value="manual">Manual target</option>
        </select>
      </div>

      {goalType === 'manual' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Daily calorie target
          </label>
          <input
            type="number"
            value={manualTarget}
            onChange={(e) => setManualTarget(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
      )}

      {calculatedTarget && goalType !== 'manual' && (
        <div className="rounded-xl bg-indigo-50 p-4 text-center">
          <p className="text-xs text-slate-500">Estimated maintenance</p>
          <p className="text-2xl font-bold text-slate-800">{calculatedTarget} kcal</p>
          <p className="mt-1 text-[10px] text-slate-400">
            This is an estimate for personal tracking, not medical advice.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BodyWeightLog } from '@/types';
import AppShell from '@/components/AppShell';
import WeightLogForm from '@/components/WeightLogForm';
import LoadingState from '@/components/LoadingState';

export default function WeightPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<BodyWeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) {
        router.push('/auth');
        return;
      }
      loadLogs(supabase, s.user.id);
    });
  }, []);

  const loadLogs = async (supabase: any, userId: string) => {
    const { data } = await supabase
      .from('body_weight_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (data) setLogs(data);
    setLoading(false);
  };

  const handleSave = async (data: { date: string; weight_kg: number; notes: string }) => {
    setSaving(true);
    const supabase = createClient();
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) return;

    const { error } = await supabase.from('body_weight_logs').insert({
      user_id: s.user.id,
      ...data,
    });

    if (!error) {
      loadLogs(supabase, s.user.id);
    }
    setSaving(false);
  };

  const latestWeight = logs.length > 0 ? logs[0].weight_kg : null;

  if (loading) return <AppShell><LoadingState /></AppShell>;

  return (
    <AppShell>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Body weight</h2>
        {latestWeight && (
          <p className="text-3xl font-bold text-stone-800">{latestWeight} <span className="text-base font-normal text-stone-400">kg</span></p>
        )}
      </div>

      <WeightLogForm onSave={handleSave} saving={saving} />

      <div className="mt-6 space-y-2">
        {logs.length === 0 ? (
          <p className="text-center text-sm text-stone-400">No weight logs yet.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3"
            >
              <span className="text-sm text-stone-500">{log.date}</span>
              <span className="font-medium text-stone-700">{log.weight_kg} kg</span>
              {log.notes && <span className="text-xs text-stone-400">{log.notes}</span>}
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}

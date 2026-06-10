'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';
import AppShell from '@/components/AppShell';
import ProfileForm from '@/components/ProfileForm';
import LoadingState from '@/components/LoadingState';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) {
        router.push('/auth');
        return;
      }
      supabase
        .from('profiles')
        .select('*')
        .eq('id', s.user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
          setLoading(false);
        });
    });
  }, []);

  const handleSave = async (data: Partial<Profile>) => {
    setSaving(true);
    const supabase = createClient();
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) return;

    const { error } = await supabase.from('profiles').upsert({
      id: s.user.id,
      ...data,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      setProfile((prev) => prev ? { ...prev, ...data } : null);
    }
    setSaving(false);
  };

  if (loading) return <AppShell><LoadingState /></AppShell>;

  return (
    <AppShell>
      <h2 className="mb-4 text-lg font-semibold text-stone-800">Profile</h2>
      <ProfileForm profile={profile} onSave={handleSave} saving={saving} />
      <div className="mt-6">
        <button
          onClick={() => router.push('/weight')}
          className="w-full rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          Log body weight
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push('/auth');
          }}
          className="w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          Sign out
        </button>
      </div>
    </AppShell>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getUserSession } from '@/lib/session';
import { Profile } from '@/types';
import AppShell from '@/components/AppShell';
import ProfileForm from '@/components/ProfileForm';
import LoadingState from '@/components/LoadingState';

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    getUserSession().then((s) => {
      if (!s && !DEV_MODE) {
        router.push('/auth');
        return;
      }
      if (s) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', s.user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleSave = async (data: Partial<Profile>) => {
    setSaving(true);
    const supabase = createClient();
    const s = await getUserSession();
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
      {!DEV_MODE && (
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
      )}
      {DEV_MODE && (
        <div className="mt-4 rounded-xl bg-amber-50 p-3 text-center text-xs text-amber-600">
          Dev mode — auth bypassed
        </div>
      )}
    </AppShell>
  );
}

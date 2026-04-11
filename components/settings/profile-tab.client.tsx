'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfileStore } from '@/lib/store/profile-store';
import { toast } from 'sonner';

export function ProfileTab() {
  const fullName = useProfileStore((s) => s.fullName);
  const companyName = useProfileStore((s) => s.companyName);
  const profileLoaded = useProfileStore((s) => s.profileLoaded);
  const setFullName = useProfileStore((s) => s.setFullName);
  const setCompanyName = useProfileStore((s) => s.setCompanyName);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, company_name: companyName })
      });
      if (!res.ok) throw new Error();
      toast.success('Profile saved');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xs space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs" muted>
          Full Name
        </Label>
        <Input
          value={fullName ?? ''}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={!profileLoaded ? 'Loading...' : 'Your name'}
          disabled={!profileLoaded}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs" muted>
          Company Name
        </Label>
        <Input
          value={companyName ?? ''}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder={!profileLoaded ? 'Loading...' : 'Your company'}
          disabled={!profileLoaded}
        />
      </div>
      <Button size="sm" onClick={handleSave} disabled={!profileLoaded || saving}>
        {saving && <Spinner />}
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}

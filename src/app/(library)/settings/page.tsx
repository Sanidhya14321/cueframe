import type { Metadata } from 'next';
import { SettingsForm } from '@/components/settings/settings-form';
import { Button } from '@/components/ui/button';
import { isHosted } from '@/local/security';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Settings · cueframe' };

const SettingsPage = () => (
  <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6">
    <h1 className="font-semibold text-2xl tracking-tight">Local settings</h1>
    <p className="mt-2 text-muted-foreground text-sm">
      Your files and keys stay on this computer. No account is needed.
    </p>
    <SettingsForm />
    {isHosted() ? (
      <form action="/api/logout" method="post" className="mt-6">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    ) : null}
  </div>
);

export default SettingsPage;

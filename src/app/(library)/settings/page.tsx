import type { Metadata } from 'next';
import { SettingsForm } from '@/components/settings/settings-form';

export const metadata: Metadata = { title: 'Settings · ClipKit' };

const SettingsPage = () => (
  <div className="mx-auto w-full max-w-2xl px-5 py-10">
    <h1 className="font-semibold text-2xl tracking-tight">Local settings</h1>
    <p className="mt-2 text-muted-foreground text-sm">
      Your files and keys stay on this computer. No account is needed.
    </p>
    <SettingsForm />
  </div>
);

export default SettingsPage;

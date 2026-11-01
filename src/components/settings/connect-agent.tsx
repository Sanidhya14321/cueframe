'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
export const ConnectAgent = () => {
  const [connection, setConnection] = useState({ name: 'No agent', connected: false });
  const [message, setMessage] = useState('');
  useEffect(() => {
    const refresh = () =>
      fetch('/api/connect', { cache: 'no-store' })
        .then((response) => response.json())
        .then((data: { name: string; connected: boolean }) =>
          setConnection({ name: data.name, connected: data.connected }),
        )
        .catch(() => setConnection({ name: 'Local server unavailable', connected: false }));
    refresh().catch(() => setMessage('Connection status unavailable.'));
    const timer = setInterval(() => {
      refresh().catch(() => setMessage('Connection status unavailable.'));
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const copy = async () => {
    try {
      const data = (await (await fetch('/api/connect', { cache: 'no-store' })).json()) as {
        command: string;
      };
      await navigator.clipboard.writeText(data.command);
      setMessage(
        'Connection command copied. Paste it in your terminal, then open Claude Code and use /mcp.',
      );
    } catch {
      setMessage('Could not copy the connection command.');
    }
  };
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-5 sm:px-6">
      <h1 className="text-2xl font-semibold">Connect your agent</h1>
      <p>Keep this local app running while your agent edits. Every action appears in the editor.</p>
      <p role="status">
        <span className={connection.connected ? 'text-emerald-600' : 'text-muted-foreground'}>
          {connection.connected ? '● Connected' : '○ Waiting for connection'}: {connection.name}
        </span>
      </p>
      <section className="rounded-xl border p-5">
        <h2 className="mb-3 font-semibold">Claude Code</h2>
        <code className="mb-4 block break-all text-xs">
          claude mcp add --transport http clipkit http://127.0.0.1:&lt;port&gt;/mcp --header
          "Authorization: Bearer &lt;runtime token&gt;"
        </code>
        <Button type="button" onClick={copy}>
          Copy Claude Code command
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          The copied command includes this app session’s token. Restarting ClipKit rotates it; copy
          a fresh command after restarting.
        </p>
      </section>
      <section className="rounded-xl border p-5">
        <h2 className="mb-2 font-semibold">Your own API</h2>
        <Link className="underline" href="/settings">
          Configure your provider in Settings
        </Link>
        <p className="mt-2 text-sm">
          The existing Edit with AI panel remains available in each editor.
        </p>
      </section>
      <p className="text-sm" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

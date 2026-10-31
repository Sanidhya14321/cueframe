'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Row = {
  id: string;
  title: string;
  updated: number;
  seconds: number;
  size: string;
  engine: string;
};
const PAGE_SIZE = 20;
const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });
export const ProjectsTable = ({ rows }: { rows: Row[] }) => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'updated' | 'title'>('updated');
  const [page, setPage] = useState(0);
  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows
      .filter((row) => row.title.toLowerCase().includes(term))
      .toSorted((a, b) =>
        sort === 'title' ? a.title.localeCompare(b.title) : b.updated - a.updated,
      );
  }, [rows, query, sort]);
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  return (
    <div className="flex flex-col gap-3">
      <Input
        aria-label="Search projects"
        className="min-h-11"
        placeholder="Search projects"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(0);
        }}
      />
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="p-3" aria-sort={sort === 'title' ? 'ascending' : 'none'}>
                <button type="button" className="min-h-11" onClick={() => setSort('title')}>
                  Name
                </button>
              </th>
              <th scope="col" className="p-3">
                Length
              </th>
              <th scope="col" className="p-3">
                Size
              </th>
              <th scope="col" className="p-3">
                Type
              </th>
              <th
                scope="col"
                className="p-3"
                aria-sort={sort === 'updated' ? 'descending' : 'none'}
              >
                <button type="button" className="min-h-11" onClick={() => setSort('updated')}>
                  Updated
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE).map((row) => (
              <tr key={row.id} className="border-b last:border-0 hover:bg-muted">
                <td className="p-3">
                  <Link className="inline-flex min-h-11 items-center" href={`/video/${row.id}`}>
                    {row.title}
                  </Link>
                </td>
                <td className="p-3 tabular-nums">{row.seconds.toFixed(1)} s</td>
                <td className="p-3 tabular-nums">{row.size}</td>
                <td className="p-3">{row.engine}</td>
                <td className="p-3 whitespace-nowrap" suppressHydrationWarning>
                  {dateFormat.format(row.updated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 ? <p className="p-4 text-sm">No projects found.</p> : null}
      </div>
      {pages > 1 ? (
        <nav aria-label="Project pages" className="flex items-center gap-3 text-sm">
          <Button
            variant="outline"
            className="min-h-11"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </Button>
          <span>
            Page {current + 1} of {pages}
          </span>
          <Button
            variant="outline"
            className="min-h-11"
            disabled={current === pages - 1}
            onClick={() => setPage(current + 1)}
          >
            Next
          </Button>
        </nav>
      ) : null}
    </div>
  );
};

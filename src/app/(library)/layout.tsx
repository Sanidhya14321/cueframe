import type { ReactNode } from 'react';
import { StudioShell } from '@/components/studio-shell';

const LibraryLayout = ({ children }: { children: ReactNode }) => (
  <StudioShell>{children}</StudioShell>
);

export default LibraryLayout;

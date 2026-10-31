import { describe, expect, it, mock } from 'bun:test';
import { useUndoable } from '@/lib/use-undoable';
import type { Project } from '@/project';

mock.module('@/lib/use-live-project', () => ({
  useLiveProject: (_title: string, _key: string, initial: Project) => ({
    ...useUndoable(initial),
    state: null,
    status: 'Saved locally',
    problem: '',
    clearProblem: () => undefined,
    undoAgent: () => undefined,
  }),
}));

mock.module('@/components/clip-timeline/clip-preview', () => ({
  ClipPreview: () => null,
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { ClipTimelineEditor } from '@/components/clip-timeline/clip-timeline-editor';
import { seedProjectForClip } from '@/core';

const renderEditor = () =>
  render(
    <ClipTimelineEditor
      title="Phone Spin In"
      storageKey="neuclip-clip:phone-spin-in"
      initialProject={seedProjectForClip('phone-spin-in')}
      demoSrc={null}
    />,
  );

describe('ClipTimelineEditor', () => {
  it('renders the clip as a composition element block on the timeline', () => {
    renderEditor();
    expect(screen.getAllByRole('button', { name: 'Clip element' })).toHaveLength(1);
  });

  it('shows element property controls for the auto-selected element', () => {
    renderEditor();
    expect(screen.getByText('Transform')).toBeInTheDocument();
    expect(screen.getByLabelText('From (frame)')).toBeInTheDocument();
  });

  it('inserts another built-in animation as a second composition block', () => {
    renderEditor();
    expect(screen.getAllByRole('button', { name: 'Clip element' })).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('Add animation'), {
      target: { value: 'scene-transition' },
    });
    expect(screen.getAllByRole('button', { name: 'Clip element' })).toHaveLength(2);
  });
});

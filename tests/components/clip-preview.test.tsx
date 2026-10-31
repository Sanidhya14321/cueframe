import { beforeEach, describe, expect, it, mock } from 'bun:test';

const pause = mock(() => undefined);
const fakePlayer = {
  pause,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
} as unknown as PlayerRef;

mock.module('@remotion/player', () => ({
  Player: () => <div data-testid="player" />,
}));

import type { PlayerRef } from '@remotion/player';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClipPreview } from '@/components/clip-timeline/clip-preview';
import { seedProjectForClip } from '@/core';

const renderPreview = (demoSrc: string | null) =>
  render(
    <ClipPreview
      project={seedProjectForClip('phone-spin-in')}
      demoSrc={demoSrc}
      playerRef={{ current: fakePlayer }}
      onFrameChange={() => undefined}
      onPlayingChange={() => undefined}
    />,
  );

describe('ClipPreview', () => {
  beforeEach(() => localStorage.clear());

  it('remembers the demo view as a preference for the next clip', async () => {
    renderPreview('/previews/phone-spin-in.mp4');
    await userEvent.click(screen.getByRole('tab', { name: 'Demo' }));
    expect(localStorage.getItem('neuclip-preview-view')).toBe('"demo"');
    cleanup();
    renderPreview('/previews/phone-spin-in.mp4');
    expect(await screen.findByLabelText('Demo video')).toBeInTheDocument();
  });

  it('switches to the rendered demo video and pauses the editor player', async () => {
    renderPreview('/previews/phone-spin-in.mp4');
    expect(screen.queryByLabelText('Demo video')).toBeNull();
    await userEvent.click(screen.getByRole('tab', { name: 'Demo' }));
    expect(screen.getByLabelText('Demo video')).toHaveAttribute(
      'src',
      '/previews/phone-spin-in.mp4',
    );
    expect(screen.getByLabelText('Demo video')).not.toHaveAttribute('controls');
    expect(pause).toHaveBeenCalled();
    expect(screen.getByTestId('player').parentElement).toHaveAttribute('data-state', 'inactive');
  });

  it('disables the demo tab when the clip has no rendered preview', () => {
    renderPreview(null);
    expect(screen.getByRole('tab', { name: 'Demo' })).toBeDisabled();
  });
});

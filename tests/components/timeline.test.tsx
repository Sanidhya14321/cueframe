import { describe, expect, it, mock } from 'bun:test';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { PropertyPanel } from '@/components/timeline/property-panel/property-panel';
import { Timeline } from '@/components/timeline/timeline';
import { seedProjectForClip } from '@/core';
import { createFrameStore } from '@/lib/frame-store';
import { LABEL_WIDTH } from '@/lib/timeline-geometry';
import {
  addElement,
  addTrack,
  createEmptyProject,
  createTextElement,
  createTrack,
  findElement,
  type Project,
} from '@/project';

const PX = 6;

const projectWithBlock = (): Project => {
  const base = createEmptyProject();
  const trackId = base.tracks[0]?.id ?? '';
  return addElement(
    base,
    trackId,
    createTextElement({ id: 'blk', from: 20, durationInFrames: 40, content: 'Hi' }),
  );
};

const twoTrackProject = (): Project => addTrack(projectWithBlock(), createTrack('Track 2'));

const noop = () => undefined;

const handleSelector = (edge: 'trim' | 'resize'): string => `[data-handle="${edge}"]`;

const renderTimeline = (project: Project, overrides: Record<string, unknown> = {}) => {
  const handlers = {
    onSeek: mock(),
    onActivateTrack: mock(),
    onSelectElement: mock(),
    onMoveElement: mock(),
    onResizeElement: mock(),
    onTrimElementStart: mock(),
    onMoveElementToTrack: mock(),
    onMoveTrack: mock(),
    onRemoveTrack: mock(),
  };
  render(
    <Timeline
      project={project}
      pxPerFrame={PX}
      frames={createFrameStore()}
      selectedId={null}
      activeTrackId={project.tracks[0]?.id ?? null}
      {...handlers}
      {...overrides}
    />,
  );
  return handlers;
};

describe('Timeline playhead', () => {
  it('follows the frame store without re-rendering the tracks', () => {
    const frames = createFrameStore();
    const project = seedProjectForClip('phone-spin-in');
    render(
      <Timeline
        project={project}
        pxPerFrame={PX}
        frames={frames}
        selectedId={null}
        activeTrackId={project.tracks[0]?.id ?? null}
        onSeek={mock()}
        onActivateTrack={mock()}
        onSelectElement={mock()}
        onMoveElement={mock()}
        onResizeElement={mock()}
        onTrimElementStart={mock()}
        onMoveElementToTrack={mock()}
        onMoveTrack={mock()}
        onRemoveTrack={mock()}
      />,
    );
    const block = screen.getByRole('button', { name: 'Clip element' });
    act(() => frames.set(30));
    expect(screen.getByTestId('playhead').style.left).toBe(`${LABEL_WIDTH + 30 * PX}px`);
    expect(screen.getByRole('button', { name: 'Clip element' })).toBe(block);
  });
});

describe('Timeline', () => {
  it('renders a block for each element', () => {
    renderTimeline(projectWithBlock());
    expect(screen.getByRole('button', { name: 'Text element' })).toBeInTheDocument();
  });

  it('selects an element on pointer down', () => {
    const handlers = renderTimeline(projectWithBlock());
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Text element' }), { clientX: 100 });
    expect(handlers.onSelectElement).toHaveBeenCalledWith('blk');
  });

  it('moves an element when dragged horizontally', () => {
    const handlers = renderTimeline(projectWithBlock());
    const block = screen.getByRole('button', { name: 'Text element' });
    fireEvent.pointerDown(block, { clientX: 100 });
    fireEvent.pointerMove(block, { clientX: 100 + 10 * PX });
    expect(handlers.onMoveElement).toHaveBeenCalledWith('blk', 30);
  });

  it('resizes an element when the right handle is dragged', () => {
    const handlers = renderTimeline(projectWithBlock());
    const block = screen.getByRole('button', { name: 'Text element' });
    const handle = block.querySelector(handleSelector('resize'));
    expect(handle).not.toBeNull();
    if (handle !== null) {
      fireEvent.pointerDown(handle, { clientX: 200 });
    }
    fireEvent.pointerMove(block, { clientX: 200 + 10 * PX });
    expect(handlers.onResizeElement).toHaveBeenCalledWith('blk', 50);
  });

  it('trims the left edge when the left handle is dragged', () => {
    const handlers = renderTimeline(projectWithBlock());
    const block = screen.getByRole('button', { name: 'Text element' });
    const handle = block.querySelector(handleSelector('trim'));
    expect(handle).not.toBeNull();
    if (handle !== null) {
      fireEvent.pointerDown(handle, { clientX: 200 });
    }
    fireEvent.pointerMove(block, { clientX: 200 + 5 * PX });
    expect(handlers.onTrimElementStart).toHaveBeenCalledWith('blk', 25);
  });

  it('moves an element to another track when dropped on it', () => {
    const project = twoTrackProject();
    const secondLaneId = project.tracks[1]?.id ?? '';
    const handlers = renderTimeline(project);
    const block = screen.getByRole('button', { name: 'Text element' });
    const secondLane = document.querySelector(`[data-track-id="${secondLaneId}"]`);
    expect(secondLane).not.toBeNull();
    fireEvent.pointerDown(block, { clientX: 100 });
    if (secondLane !== null) {
      fireEvent.pointerMove(secondLane, { clientX: 100 });
      fireEvent.pointerUp(secondLane);
    }
    expect(handlers.onMoveElementToTrack).toHaveBeenCalledWith('blk', secondLaneId);
  });

  it('restacks a track with the up control', () => {
    const project = twoTrackProject();
    const handlers = renderTimeline(project);
    fireEvent.click(screen.getByRole('button', { name: 'Track options: Track 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move Track 2 up' }));
    expect(handlers.onMoveTrack).toHaveBeenCalledWith(project.tracks[1]?.id, 'up');
  });

  it('seeks when the ruler is clicked', () => {
    const handlers = renderTimeline(projectWithBlock());
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Seek timeline' }), {
      clientX: 10 * PX,
    });
    expect(handlers.onSeek).toHaveBeenCalledWith(10);
  });

  it('activates a track by its name', () => {
    const project = projectWithBlock();
    const handlers = renderTimeline(project);
    fireEvent.click(screen.getByRole('button', { name: 'Track 1' }));
    expect(handlers.onActivateTrack).toHaveBeenCalledWith(project.tracks[0]?.id);
  });

  it('disables track removal when only one track exists', () => {
    renderTimeline(projectWithBlock());
    fireEvent.click(screen.getByRole('button', { name: 'Track options: Track 1' }));
    expect(screen.getByRole('button', { name: 'Remove Track 1' })).toBeDisabled();
  });

  it('removes a track when more than one exists', () => {
    const project = twoTrackProject();
    const handlers = renderTimeline(project);
    fireEvent.click(screen.getByRole('button', { name: 'Track options: Track 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove Track 2' }));
    expect(handlers.onRemoveTrack).toHaveBeenCalledWith(project.tracks[1]?.id);
  });
});

const SelectionHarness = ({ project }: { project: Project }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const element = selectedId === null ? null : (findElement(project, selectedId)?.element ?? null);
  return (
    <>
      <Timeline
        project={project}
        pxPerFrame={PX}
        frames={createFrameStore()}
        selectedId={selectedId}
        activeTrackId={project.tracks[0]?.id ?? null}
        onSeek={noop}
        onActivateTrack={noop}
        onSelectElement={setSelectedId}
        onMoveElement={noop}
        onResizeElement={noop}
        onTrimElementStart={noop}
        onMoveElementToTrack={noop}
        onMoveTrack={noop}
        onRemoveTrack={noop}
      />
      <PropertyPanel element={element} onChange={noop} onDelete={noop} />
    </>
  );
};

describe('timeline selection flow', () => {
  it('shows an element property panel once it is selected', () => {
    render(<SelectionHarness project={projectWithBlock()} />);
    expect(screen.getByText(/select an element/i)).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Text element' }), { clientX: 100 });
    expect(screen.getByText('Transform')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hi')).toBeInTheDocument();
  });
});

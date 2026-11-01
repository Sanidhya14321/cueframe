'use client';
import type { PlayerRef } from '@remotion/player';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AgentWorkspace } from '@/components/media-agent/agent-workspace';
import { ClipPreviewSkeleton } from '@/components/skeletons';
import { Timeline } from '@/components/timeline/timeline';
import { TimelineToolbar } from '@/components/timeline/timeline-toolbar';
import { preloadProjectScenes } from '@/compositions/scene-loader';
import { createFrameStore } from '@/lib/frame-store';
import { clampPxPerFrame, DEFAULT_PX_PER_FRAME, fitPxPerFrame } from '@/lib/timeline-geometry';
import { useLiveProject } from '@/lib/use-live-project';
import { DEFAULT_EXPORT_SETTINGS, useProjectExport } from '@/lib/use-project-export';
import { useUndoRedoKeys } from '@/lib/use-undoable';
import { cn } from '@/lib/utils';
import {
  addElement,
  addTrack,
  createCompositionElement,
  createImageElement,
  createShapeElement,
  createTextElement,
  createTrack,
  createVideoElement,
  type Element,
  type ElementType,
  findElement,
  moveElement,
  moveElementToTrack,
  moveTrack,
  type Project,
  removeElement,
  removeTrack,
  replaceElement,
  resizeElement,
  trimElementStart,
} from '@/project';
import { splitVideoAtFrame } from '@/project/opencut/split-video';
import { CLIP_DEFAULTS, CLIP_REGISTRY, type ClipId, getClipMeta } from '@/schemas';
import { AgentRequests } from './agent-requests';
import { BuildVideo } from './build-video';
import { ClipPropertySidebar } from './clip-property-sidebar';
import { ClipTimelineHeader } from './clip-timeline-header';
import { LivePresence } from './live-presence';
import { MediaTools } from './media-tools';
import { type MobilePanel, MobilePanelSwitch } from './mobile-panel-switch';
import { ProjectComments } from './project-comments';

const ClipPreview = dynamic(() => import('./clip-preview').then((mod) => mod.ClipPreview), {
  ssr: false,
  loading: () => <ClipPreviewSkeleton />,
});

const makeElement = (type: ElementType, from: number): Element => {
  if (type === 'text') {
    return createTextElement({ from });
  }
  if (type === 'image') {
    return createImageElement({ from });
  }
  if (type === 'video') {
    return createVideoElement({ from });
  }
  return createShapeElement('rect', { from });
};

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
};

const runModifierShortcut = (event: KeyboardEvent, exportProject: () => void): boolean => {
  if (!(event.metaKey || event.ctrlKey)) {
    return false;
  }
  if (event.key.toLowerCase() === 'e') {
    event.preventDefault();
    exportProject();
  }
  return true;
};

const toFileName = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'export';

const ANIMATION_OPTIONS = CLIP_REGISTRY.map((meta) => ({ id: meta.id, title: meta.title }));

const firstElementId = (project: Project): string | null =>
  project.tracks[0]?.elements[0]?.id ?? null;

interface ClipTimelineEditorProps {
  title: string;
  storageKey: string;
  initialProject: Project;
  demoSrc: string | null;
  projectId?: string | undefined;
}

export const ClipTimelineEditor = ({
  title,
  storageKey,
  initialProject,
  demoSrc,
  projectId,
}: ClipTimelineEditorProps) => {
  const editor = useLiveProject(title, storageKey, initialProject, projectId);
  const {
    value: project,
    set: setProject,
    setLive: setProjectLive,
    seal: sealProject,
    undo,
    redo,
    reset,
  } = editor;
  useUndoRedoKeys(undo, redo);
  const exporter = useProjectExport();
  const fileName = toFileName(title);

  const playerRef = useRef<PlayerRef | null>(null);
  const [frames] = useState(createFrameStore);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(() => firstElementId(project));
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [pxPerFrame, setPxPerFrame] = useState(DEFAULT_PX_PER_FRAME);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('properties');

  const loadProject = useCallback(
    (next: Project) => {
      reset(next);
      setSelectedId(firstElementId(next));
      setActiveTrackId(null);
    },
    [reset],
  );

  const activeTrack = activeTrackId ?? project.tracks[0]?.id ?? null;
  const selectedElement =
    selectedId === null ? null : (findElement(project, selectedId)?.element ?? null);

  const durationInFrames = project.durationInFrames;
  const fitTimeline = useCallback(() => {
    setPxPerFrame(fitPxPerFrame(durationInFrames, window.innerWidth));
  }, [durationInFrames]);

  useEffect(() => {
    fitTimeline();
    let fittedWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== fittedWidth) {
        fittedWidth = window.innerWidth;
        fitTimeline();
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitTimeline]);

  useEffect(() => {
    preloadProjectScenes(
      initialProject.tracks.flatMap((track) =>
        track.elements.flatMap((element) =>
          element.type === 'composition' ? [element.clipId] : [],
        ),
      ),
    ).catch(() => undefined);
  }, [initialProject]);

  const seek = useCallback(
    (frame: number) => {
      playerRef.current?.seekTo(frame);
      frames.set(frame);
    },
    [frames],
  );

  const handleAddElement = (type: ElementType): void => {
    if (activeTrack === null) {
      return;
    }
    const element = makeElement(type, frames.get());
    setProject(addElement(project, activeTrack, element));
    setSelectedId(element.id);
  };

  const handleAddAnimation = (animationId: string): void => {
    if (activeTrack === null) {
      return;
    }
    const sceneId = animationId as ClipId;
    const element = createCompositionElement(
      sceneId,
      CLIP_DEFAULTS[sceneId] as Record<string, unknown>,
      { from: frames.get(), durationInFrames: getClipMeta(sceneId).durationInFrames },
    );
    setProject(addElement(project, activeTrack, element));
    setSelectedId(element.id);
  };

  const handleDelete = useCallback(
    (id: string) => {
      setProject(removeElement(project, id));
      setSelectedId((current) => (current === id ? null : current));
    },
    [project, setProject],
  );

  const exportShortcut = useRef<() => void>(() => undefined);
  exportShortcut.current = () => exporter.run(project, DEFAULT_EXPORT_SETTINGS, fileName);

  useEffect(() => {
    const onGestureEnd = () => sealProject();
    window.addEventListener('pointerup', onGestureEnd);
    window.addEventListener('pointercancel', onGestureEnd);
    window.addEventListener('focusout', onGestureEnd);
    return () => {
      window.removeEventListener('pointerup', onGestureEnd);
      window.removeEventListener('pointercancel', onGestureEnd);
      window.removeEventListener('focusout', onGestureEnd);
    };
  }, [sealProject]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (runModifierShortcut(event, exportShortcut.current)) {
        return;
      }
      if (isEditableTarget(event.target)) {
        return;
      }
      if (event.key === ' ') {
        event.preventDefault();
        playerRef.current?.toggle();
      } else if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId !== null) {
        event.preventDefault();
        handleDelete(selectedId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, handleDelete]);

  return (
    <AgentWorkspace
      kind="clip"
      chatKey={storageKey}
      title={title}
      document={project}
      focus={selectedId === null ? [] : [selectedId]}
      onChange={setProject}
    >
      <LivePresence state={editor.state} undoAgent={editor.undoAgent} onSelect={setSelectedId}>
        <div className="flex h-full min-h-0 flex-col">
          <div
            className="flex shrink-0 flex-wrap items-center gap-3 border-b px-3 py-1 text-xs"
            role="status"
            aria-label="Project sync"
          >
            <span>{editor.status}</span>
            {editor.state ? (
              <a className="underline" href={`/video/${editor.state.id}`}>
                Video editor
              </a>
            ) : null}
            {editor.state ? (
              <>
                <BuildVideo projectId={editor.state.id} />
                <AgentRequests
                  state={editor.state}
                  frames={frames}
                  selectedId={selectedId}
                  project={project}
                  onChange={setProject}
                />
                <MediaTools
                  projectId={editor.state.id}
                  project={project}
                  selectedId={selectedId}
                  onChange={setProject}
                />
                <ProjectComments
                  state={editor.state}
                  frames={frames}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onSeek={seek}
                />
              </>
            ) : null}
            <a href="/projects" className="underline">
              Projects
            </a>
            {editor.problem ? (
              <button type="button" onClick={editor.clearProblem} className="text-destructive">
                {editor.problem}
              </button>
            ) : null}
          </div>
          <div
            className={cn(
              'flex min-h-0 flex-col lg:flex-1 lg:flex-row',
              mobilePanel === 'properties' ? 'flex-1' : 'flex-none',
            )}
          >
            <section className="flex h-[min(46dvh,26rem)] shrink-0 flex-col bg-muted/30 lg:h-auto lg:min-h-0 lg:flex-1">
              <ClipPreview
                project={project}
                demoSrc={demoSrc}
                playerRef={playerRef}
                onFrameChange={frames.set}
                onPlayingChange={setPlaying}
              />
            </section>
            <MobilePanelSwitch active={mobilePanel} onChange={setMobilePanel} />
            <aside
              className={cn(
                'min-h-0 flex-col overflow-y-auto border-border bg-sidebar lg:flex lg:w-[320px] xl:w-[360px] 2xl:w-[420px] lg:flex-none lg:shrink-0 lg:border-l',
                mobilePanel === 'properties' ? 'flex flex-1' : 'hidden',
              )}
            >
              <ClipTimelineHeader
                title={title}
                onReset={() => {
                  loadProject(initialProject);
                }}
              />
              <ClipPropertySidebar
                element={selectedElement}
                onChange={(next) => setProjectLive(replaceElement(project, next))}
                onDelete={handleDelete}
              />
            </aside>
          </div>
          <div
            className={cn(
              'min-h-0 flex-col border-border border-t bg-sidebar lg:flex lg:h-[clamp(12rem,30dvh,20rem)] lg:flex-none lg:shrink-0',
              mobilePanel === 'timeline' ? 'flex flex-1' : 'hidden',
            )}
          >
            <TimelineToolbar
              frames={frames}
              splitTarget={selectedElement?.type === 'video' ? selectedElement : null}
              onSplit={() => setProject(splitVideoAtFrame(project, selectedId ?? '', frames.get()))}
              pxPerFrame={pxPerFrame}
              playing={playing}
              canUndo={editor.canUndo}
              canRedo={editor.canRedo}
              exportState={exporter.state}
              exportProgress={exporter.progress}
              download={exporter.download}
              exportError={exporter.error}
              animations={ANIMATION_OPTIONS}
              onAddElement={handleAddElement}
              onAddAnimation={handleAddAnimation}
              onAddTrack={() =>
                setProject(addTrack(project, createTrack(`Track ${project.tracks.length + 1}`)))
              }
              onZoom={(next) => setPxPerFrame(clampPxPerFrame(next))}
              onFit={fitTimeline}
              onTogglePlay={() => playerRef.current?.toggle()}
              onUndo={undo}
              onRedo={redo}
              onExport={(settings) => exporter.run(project, settings, fileName)}
            />
            <div className="min-h-0 flex-1">
              <Timeline
                project={project}
                pxPerFrame={pxPerFrame}
                frames={frames}
                selectedId={selectedId}
                activeTrackId={activeTrack}
                onSeek={seek}
                onActivateTrack={setActiveTrackId}
                onSelectElement={setSelectedId}
                onMoveElement={(id, from) => setProjectLive(moveElement(project, id, from))}
                onResizeElement={(id, duration) =>
                  setProjectLive(resizeElement(project, id, duration))
                }
                onTrimElementStart={(id, from) =>
                  setProjectLive(trimElementStart(project, id, from))
                }
                onMoveElementToTrack={(id, trackId) =>
                  setProjectLive(moveElementToTrack(project, id, trackId))
                }
                onMoveTrack={(id, direction) => setProject(moveTrack(project, id, direction))}
                onRemoveTrack={(id) => setProject(removeTrack(project, id))}
              />
            </div>
          </div>
        </div>
      </LivePresence>
    </AgentWorkspace>
  );
};

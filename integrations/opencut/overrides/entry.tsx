import type React from 'react';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { useKeybindingsStore } from '@/actions/keybindings-store';
import { useEditorActions } from '@/actions/use-editor-actions';
import { useKeybindingsListener } from '@/actions/use-keybindings';
import { ExportButton } from '@/components/editor/export-button';
import { useAssetsPanelStore } from '@/components/editor/panels/assets/assets-panel-store';
import { MediaView } from '@/components/editor/panels/assets/views/assets';
import { SettingsView } from '@/components/editor/panels/assets/views/settings';
import { PropertiesPanel } from '@/components/editor/panels/properties';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EditorCore } from '@/core';
import { useEditor } from '@/editor/use-editor';
import { EffectsView } from '@/effects/components/assets-view';
import { processMediaAssets } from '@/media/processing';
import { usePasteMedia } from '@/media/use-paste-media';
import { PreviewPanel } from '@/preview/components';
import { initializeGpuRenderer, isGpuAvailable } from '@/services/renderer/gpu-renderer';
import { TextView } from '@/text/components/assets-view';
import { Timeline } from '@/timeline/components';
import { buildElementFromMedia } from '@/timeline/element-utils';
import { useTimelineStore } from '@/timeline/timeline-store';
import { mediaTimeFromSeconds, ZERO_MEDIA_TIME } from '@/wasm';
import { CaptionsView } from './captions-panel';
import { HostContext } from './host-context';
import { LibraryView, libraryDropTarget } from './library-panel';
import { ScenesView } from './scenes-panel';
import { connectCanonical, hydrateCanonical, storageService } from './storage';
import { TimelineDivider } from './workspace-split';
import './style.css';

function syncTheme() {
  if (window.parent === window) {
    return;
  }
  const parentRoot = window.parent.document.documentElement;
  const styles = window.parent.getComputedStyle(parentRoot);
  for (const token of [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'border',
    'input',
    'ring',
    'destructive',
    'destructive-foreground',
    'sidebar',
  ]) {
    document.documentElement.style.setProperty(`--${token}`, styles.getPropertyValue(`--${token}`));
  }
  document.documentElement.classList.toggle('dark', parentRoot.classList.contains('dark'));
}
syncTheme();
if (window.parent !== window) {
  const fontStyle = document.createElement('style');
  const fontRules = (sheet: CSSStyleSheet) => {
    try {
      return Array.from(sheet.cssRules)
        .filter((rule) => rule.type === CSSRule.FONT_FACE_RULE)
        .map((rule) => rule.cssText)
        .join('\n');
    } catch {
      return '';
    }
  };
  fontStyle.textContent = Array.from(window.parent.document.styleSheets).map(fontRules).join('\n');
  document.head.append(fontStyle);
  document.body.style.fontFamily = window.parent.getComputedStyle(
    window.parent.document.body,
  ).fontFamily;
}
if (window.parent !== window) {
  new MutationObserver(syncTheme).observe(window.parent.document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });
}
const id = new URLSearchParams(location.search).get('project') ?? '';
async function open() {
  const editor = EditorCore.getInstance();
  await initializeGpuRenderer();
  editor.renderer.setDegraded(!isGpuAvailable());
  const loaded = await storageService.loadProject({ id });
  if (!loaded) {
    const source = await (await fetch(`/api/projects/${id}`)).json();
    await editor.project.createNewProject({ name: source.title });
    await editor.project.updateSettings({
      settings: {
        fps: { numerator: source.project.fps, denominator: 1 },
        canvasSize: { width: source.project.width, height: source.project.height },
        background: { type: 'color', color: source.project.background },
      },
      pushHistory: false,
    });
    await editor.project.saveCurrentProject();
  }
  await editor.project.loadProject({ id });
  if (new URLSearchParams(location.search).get('mode') === 'render') {
    await hydrateCanonical(editor);
    editor.save.pause();
  } else {
    await connectCanonical();
  }
  const render = new URLSearchParams(location.search).get('render');
  if (render?.startsWith(`/api/projects/${id}/out/`)) {
    const response = await fetch(render);
    if (!response.ok) {
      throw new Error('Cannot load the rendered source');
    }
    const file = new File([await response.blob()], 'cueframe source.mp4', { type: 'video/mp4' });
    const [processed] = await processMediaAssets({ files: [file] });
    if (!processed) {
      throw new Error('The rendered video could not be imported');
    }
    const asset = await editor.media.addMediaAsset({ projectId: id, asset: processed });
    if (!asset) {
      throw new Error('Cannot store the rendered source');
    }
    const element = buildElementFromMedia({
      mediaId: asset.id,
      mediaType: asset.type,
      name: asset.name,
      duration: mediaTimeFromSeconds({ seconds: asset.duration ?? 1 }),
      startTime: ZERO_MEDIA_TIME,
    });
    editor.timeline.insertElement({ element, placement: { mode: 'auto' } });
    await editor.save.flush();
    history.replaceState(null, '', `?project=${id}`);
  }
}
function Runtime() {
  usePasteMedia();
  useEditorActions();
  useKeybindingsListener();
  const editor = useEditor();
  const ripple = useTimelineStore((state) => state.rippleEditingEnabled);
  useEffect(() => {
    editor.command.isRippleEnabled = ripple;
  }, [editor, ripple]);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (editor.save.getIsDirty()) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [editor]);
  useEditor((e) => e.scenes.getScenes());
  const [name, setName] = useState(() => editor.project.getActive().metadata.name);
  const rename = () => {
    const active = editor.project.getActive();
    const value = name.trim();
    if (!value) {
      setName(active.metadata.name);
      return;
    }
    editor.project.setActiveProject({
      project: { ...active, metadata: { ...active.metadata, name: value } },
    });
    editor.save.markDirty();
  };
  const [tab, setTab] = useState('Media');
  const [status, setStatus] = useState('Saved locally');
  useEffect(
    () =>
      useAssetsPanelStore.subscribe((panel) => {
        if (panel.activeTab === 'effects') {
          setTab('Effects');
        }
      }),
    [],
  );
  useEffect(() => {
    useKeybindingsStore.getState().setLoadingProject(false);
    const flushRequest = (event: MessageEvent<unknown>) => {
      if (event.source !== window.parent || event.origin !== location.origin) {
        return;
      }
      const message = event.data;
      if (
        !(
          message &&
          typeof message === 'object' &&
          'type' in message &&
          message.type === 'cueframe-flush' &&
          'requestId' in message &&
          typeof message.requestId === 'string'
        )
      ) {
        return;
      }
      editor.save.resume();
      editor.save
        .flush()
        .then(() =>
          window.parent.postMessage(
            { type: 'cueframe-flushed', requestId: message.requestId, ok: true },
            location.origin,
          ),
        )
        .catch(() =>
          window.parent.postMessage(
            { type: 'cueframe-flushed', requestId: message.requestId, ok: false },
            location.origin,
          ),
        );
    };
    const command = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.parent.postMessage({ type: 'cueframe-command-menu' }, location.origin);
      }
    };
    window.addEventListener('keydown', command, true);
    window.addEventListener('message', flushRequest);
    window.parent.postMessage({ type: 'cueframe-ready' }, location.origin);
    const handler = (event: Event) => setStatus((event as CustomEvent<string>).detail);
    window.addEventListener('cueframe-save', handler);
    return () => {
      window.removeEventListener('cueframe-save', handler);
      window.removeEventListener('message', flushRequest);
      window.removeEventListener('keydown', command, true);
    };
  }, [editor]);
  const panels: Record<string, React.ReactNode> = {
    Media: <MediaView />,
    Library: <LibraryView />,
    Scenes: <ScenesView />,
    Inspect: <PropertiesPanel />,
    Text: <TextView />,
    Captions: <CaptionsView />,
    ...(editor.renderer.isDegraded ? {} : { Effects: <EffectsView /> }),
    Settings: <SettingsView />,
  };
  return (
    <main className="native-editor" data-editor-engine="opencut-classic">
      {editor.renderer.isDegraded ? (
        <p role="status" className="px-3 py-2 text-xs">
          GPU effects are unavailable in this browser. Basic editing and export remain available.
        </p>
      ) : null}
      <HostContext />
      <header className="native-header">
        <input
          aria-label="Project name"
          className="native-title"
          maxLength={200}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={rename}
        />
        <output aria-label="Editor sync" data-idle={status === 'Saved locally'}>
          {status}
        </output>
        <button
          type="button"
          disabled={!editor.command.canUndo()}
          onClick={() => editor.command.undo()}
        >
          Undo
        </button>
        <button
          type="button"
          disabled={!editor.command.canRedo()}
          onClick={() => editor.command.redo()}
        >
          Redo
        </button>
        {['Saved locally', 'Saving locally'].includes(status) ? null : (
          <button
            type="button"
            onClick={() => {
              editor.save.resume();
              editor.save.flush().catch(() => undefined);
            }}
          >
            Retry saving
          </button>
        )}
        {['Saved locally', 'Saving locally'].includes(status) ? null : (
          <button type="button" onClick={() => location.reload()}>
            Reload saved version
          </button>
        )}
        {new URLSearchParams(location.search).get('mode') === 'render' ? <ExportButton /> : null}
      </header>
      <div className="native-workspace">
        <section className="native-assets">
          <nav aria-label="Editor panels">
            {Object.keys(panels).map((panelName) => (
              <button
                type="button"
                key={panelName}
                aria-pressed={tab === panelName}
                onClick={() => setTab(panelName)}
              >
                {panelName}
              </button>
            ))}
          </nav>
          <div className="native-asset-content">{panels[tab]}</div>
        </section>
        <section className="native-preview" aria-label="Editor preview">
          <PreviewPanel
            overlayControls={[]}
            overlayInstances={[]}
            onOverlayVisibilityChange={() => undefined}
          />
        </section>
        <aside
          className="native-properties"
          style={tab === 'Inspect' ? { display: 'none' } : undefined}
        >
          <PropertiesPanel />
        </aside>
      </div>
      <TimelineDivider />
      <section className="native-timeline" aria-label="Editor timeline" {...libraryDropTarget}>
        <Timeline />
      </section>
      <Toaster />
    </main>
  );
}
class EditorBoundary extends Component<{ children: ReactNode }, { problem: string | null }> {
  override state: { problem: string | null } = { problem: null };
  static getDerivedStateFromError(error: Error) {
    return { problem: error.message };
  }
  override render() {
    return this.state.problem ? (
      <div role="alert" className="native-loading">
        <p>The video editor could not display this project: {this.state.problem}</p>
        <button type="button" onClick={() => location.reload()}>
          Reload saved project
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function App() {
  const [state, setState] = useState('Loading video editor');
  useEffect(() => {
    const progress = (event: Event) => setState((event as CustomEvent<string>).detail);
    window.addEventListener('cueframe-save', progress);
    return () => window.removeEventListener('cueframe-save', progress);
  }, []);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    open()
      .then(() => setReady(true))
      .catch((error) => {
        setState(error instanceof Error ? error.message : 'Could not open editor');
        setFailed(true);
      });
  }, []);
  return ready ? (
    <EditorBoundary>
      <Runtime />
    </EditorBoundary>
  ) : (
    <div role="status" className="native-loading">
      {state}
      {failed ? (
        <button type="button" onClick={() => location.reload()}>
          Retry opening
        </button>
      ) : null}
    </div>
  );
}
const root = document.getElementById('root');
if (!root) {
  throw new Error('OpenCut root is missing');
}
createRoot(root).render(
  <TooltipProvider>
    <App />
  </TooltipProvider>,
);

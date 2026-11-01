/* biome-ignore-all lint/suspicious/noTemplateCurlyInString: patch strings intentionally preserve upstream template expressions */
/* biome-ignore-all lint/security/noSecrets: strings in this build patch are upstream JSX expressions, not credentials */
import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import tailwind from '@tailwindcss/postcss';
import type { AcceptedPlugin } from 'postcss';
import { build } from 'vite';
import wasm from 'vite-plugin-wasm';
import { runtimeLicenses } from './license-audit';
import sourceManifest from './source.json';

const here = import.meta.dir;
const archive = resolve(here, 'source.tgz');
if (
  new Bun.CryptoHasher('sha256').update(await Bun.file(archive).arrayBuffer()).digest('hex') !==
  sourceManifest.sha256
) {
  throw new Error('OpenCut source archive integrity check failed');
}
const source = resolve(here, '.source');
await rm(source, { recursive: true, force: true });
await mkdir(source, { recursive: true });
const extract = Bun.spawn(['tar', '-xzf', resolve(here, 'source.tgz'), '-C', source]);
if (await extract.exited) {
  throw new Error('Cannot unpack pinned OpenCut source');
}
const root = resolve(source, 'src');
const overrides = resolve(here, 'overrides');
await cp(resolve(overrides, 'audio-stretch.ts'), resolve(root, 'retime/audio-stretch.ts'));
await cp(
  resolve(overrides, 'scene-exporter.ts'),
  resolve(root, 'services/renderer/scene-exporter.ts'),
);
const patch = async (path: string, pattern: RegExp, replacement: string) => {
  const code = await Bun.file(path).text();
  if (!pattern.test(code)) {
    throw new Error(`OpenCut patch no longer applies to ${path}`);
  }
  await Bun.write(path, code.replace(pattern, replacement));
};
await patch(
  resolve(root, 'services/renderer/compositor/frame-descriptor.ts'),
  /type: "sceneEffect",\s+effectPassGroups:/,
  'type: "sceneEffect", effect_pass_groups:',
);
await patch(
  resolve(root, 'services/renderer/compositor/types.ts'),
  /type: "sceneEffect";\s+effectPassGroups:/,
  'type: "sceneEffect"; effect_pass_groups:',
);
const textPath = resolve(root, 'text/primitives.ts');
await patch(textPath, /\tconst lines = text\.content\.split\("\\n"\);\r?\n/, '');
await patch(
  textPath,
  /const lineMetrics = lines\.map\(/,
  'const lines = wrapTextLines({ content: text.content, canvasHeight, ctx });\n\tconst lineMetrics = lines.map(',
);
await patch(textPath, /^/, 'import { wrapTextLines } from "@clipkit-text-wrap";\n');
const managerPath = resolve(root, 'core/managers/project-manager.ts');
const manager = await Bun.file(managerPath).text();
await Bun.write(
  managerPath,
  manager.replace('console.error("Failed to save project:", error);', 'throw error;'),
);
const savePath = resolve(root, 'core/managers/save-manager.ts');
const saver = await Bun.file(savePath).text();
await Bun.write(
  savePath,
  saver
    .replace(
      'await this.editor.project.saveCurrentProject();',
      'try { await this.editor.project.saveCurrentProject(); } catch (error) { this.hasPendingSave = true; this.isPaused = true; throw error; }',
    )
    .replace(
      'if (this.hasPendingSave) {\r\n\t\t\t\tthis.queueSave();',
      'if (this.hasPendingSave && !this.isPaused) {\r\n\t\t\t\tthis.queueSave();',
    )
    .replace('void this.saveNow();', 'void this.saveNow().catch(() => undefined);'),
);
await patch(
  savePath,
  /async flush\(\): Promise<void> \{\s+this\.hasPendingSave = true;/,
  'async flush(): Promise<void> { this.hasPendingSave = true; while (this.isSaving) { await new Promise((settle) => setTimeout(settle, 25)); }',
);
const effectPath = resolve(root, 'services/renderer/effect-preview.ts');
const effects = await Bun.file(effectPath).text();
await Bun.write(
  effectPath,
  effects.replaceAll('/effects/preview.jpg', '/previews/typewriter.still.jpg'),
);
const speedPath = resolve(root, 'speed/components/speed-tab.tsx');
const speed = await Bun.file(speedPath).text();
await Bun.write(
  speedPath,
  speed
    .replace('checked={!maintainPitch}', 'checked={true}')
    .replace('disabled={!isPitchPreserveAvailable}', 'disabled={true}')
    .replace('Change pitch</span>', 'Speed changes pitch</span>'),
);
const exportPath = resolve(root, 'components/editor/export-button.tsx');
const exporter = await Bun.file(exportPath).text();
await Bun.write(
  exportPath,
  exporter.replace(
    /<PopoverTrigger asChild>[\s\S]*?<\/PopoverTrigger>/,
    '<PopoverTrigger asChild><Button className="min-h-11" disabled={!hasProject} onClick={() => setIsExportPopoverOpen(true)}>Export</Button></PopoverTrigger>',
  ),
);
const itemPath = resolve(root, 'components/editor/panels/assets/draggable-item.tsx');
const item = await Bun.file(itemPath).text();
await Bun.write(
  itemPath,
  item
    .replace('className="opacity-0 group-hover:opacity-100"', 'className="opacity-100"')
    .replace('size-5","', 'size-11","')
    .replace('bottom-2 size-5', 'bottom-2 size-11')
    .replace(
      'title={tooltipText}',
      'title={tooltipText ?? "Add to timeline"} aria-label={tooltipText ?? "Add to timeline"}',
    ),
);
await Bun.write(
  itemPath,
  (await Bun.file(itemPath).text())
    .replace(
      'onClick={handleAddToTimeline}',
      'onClick={handleAddToTimeline} tooltipText={`Add ${name} to timeline`}',
    )
    .replace(
      'tooltipText="Add to timeline or drag to position"',
      'tooltipText={`Add ${name} to timeline`}',
    ),
);
const toolbarPath = resolve(root, 'timeline/components/timeline-toolbar.tsx');
const toolbar = await Bun.file(toolbarPath).text();
await Bun.write(
  toolbarPath,
  toolbar
    .replace('className="scrollbar-hidden"', 'className="scrollbar-thin"')
    .replace('flex h-10 items-center', 'flex min-h-12 items-center')
    .replace('disabled={disabled}', 'disabled={disabled} aria-label={tooltip}')
    .replace(
      'onClick={() => onZoom({ direction: "out" })}',
      'aria-label="Zoom out" onClick={() => onZoom({ direction: "out" })}',
    )
    .replace(
      'onClick={() => onZoom({ direction: "in" })}',
      'aria-label="Zoom in" onClick={() => onZoom({ direction: "in" })}',
    ),
);
const fieldPath = resolve(
  root,
  'components/editor/panels/properties/components/property-param-field.tsx',
);
const field = await Bun.file(fieldPath).text();
await Bun.write(fieldPath, field.replace('<Textarea', '<Textarea aria-label={param.label}'));
const timelineItemPath = resolve(root, 'timeline/components/timeline-element.tsx');
const timelineItem = await Bun.file(timelineItemPath).text();
await Bun.write(
  timelineItemPath,
  timelineItem.replace(
    'tabIndex={-1}',
    'tabIndex={0} aria-label={`Select ${element.name}`} aria-pressed={isSelected} data-element-id={element.id}',
  ),
);
const scenesPath = resolve(root, 'timeline/components/timeline-toolbar.tsx');
await Bun.write(
  scenesPath,
  (await Bun.file(scenesPath).text()).replace(
    '<SceneSelector />',
    '<span className="px-3 text-xs">Main timeline</span>',
  ),
);
const timelineView = resolve(root, 'timeline/components/index.tsx');
await Bun.write(
  timelineView,
  (await Bun.file(timelineView).text()).replace(
    'ref={tracksScrollRef}',
    'ref={tracksScrollRef} data-clipkit-timeline-zoom={zoomLevel}',
  ),
);
const timelineManager = resolve(root, 'core/managers/timeline-manager.ts');
const managerCode = await Bun.file(timelineManager).text();
await Bun.write(
  timelineManager,
  'import {guardNativeTracks} from "@clipkit-native-locks";\n' +
    managerCode.replace(
      'updateTracks(newTracks: SceneTracks): void {',
      'updateTracks(newTracks: SceneTracks): void { if(!guardNativeTracks(newTracks)) {return;}',
    ),
);
await build({
  root: here,
  base: '/opencut/',
  esbuild: { jsx: 'automatic' },
  plugins: [wasm(), runtimeLicenses()],
  css: { postcss: { plugins: [tailwind() as unknown as AcceptedPlugin] } },
  resolve: {
    alias: {
      '@/services/storage/migrations': resolve(overrides, 'migrations.ts'),
      '@/services/video-cache/service': resolve(overrides, 'video-cache.ts'),
      mediabunny: resolve(overrides, 'browser-media.ts'),
      '@/services/renderer/scene-exporter': resolve(overrides, 'scene-exporter.ts'),
      '@/services/storage/service': resolve(overrides, 'storage.ts'),
      'next/image': resolve(overrides, 'image.tsx'),
      'next/link': resolve(overrides, 'link.tsx'),
      'next/navigation': resolve(overrides, 'navigation.ts'),
      '@clipkit-native-locks': resolve(overrides, 'locks.ts'),
      '@clipkit-text-wrap': resolve(overrides, 'text-wrap.ts'),
      '@clipkit': resolve(here, '../../src'),
      '@': root,
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    target: 'esnext',
    outDir: resolve(here, '../../public/opencut'),
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: true,
  },
});

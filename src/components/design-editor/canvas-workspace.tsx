'use client';

import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import {
  type DragEvent as ReactDragEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Group, Layer, Rect, Stage } from 'react-konva';
import { type Box, boxesIntersect, type Point, unionBox } from '@/design';
import { CANVAS_BACKGROUND_NAME, DesignContent } from './design-content';
import { DRAG_IMAGE_TYPE, readDraggedImage } from './drag-image';
import { ELEMENT_NODE_NAME } from './element-node';
import type { LoadedImage } from './read-image-file';
import { SelectionToolbar } from './selection-toolbar';
import { SelectionTransformer } from './selection-transformer';
import { TextEditOverlay } from './text-edit-overlay';
import type { DesignEditorState } from './use-design-editor';
import { blurActiveElement, useElementInteractions } from './use-element-interactions';
import { useSpaceHeld, useViewportSize, type Viewport } from './use-workspace-viewport';
import { type Guides, NO_GUIDES, WorkspaceOverlays } from './workspace-overlays';

interface CanvasWorkspaceProps {
  editor: DesignEditorState;
  zoom: number;
  fontsVersion: number;
  onZoomChange: (zoom: number) => void;
  onViewportChange: (viewport: Viewport) => void;
  onDropFiles: (files: File[], point: Point) => void;
  onDropImage: (image: LoadedImage, point: Point) => void;
  onContextMenu: (point: Point) => void;
  snapEnabled: boolean;
  showGrid: boolean;
}

export const CanvasWorkspace = ({
  editor,
  zoom,
  fontsVersion,
  onZoomChange,
  onViewportChange,
  onDropFiles,
  onDropImage,
  onContextMenu,
  snapEnabled,
  showGrid,
}: CanvasWorkspaceProps) => {
  const { design, selectedIds, selectedElements, editingId } = editor;
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const designGroupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const viewport = useViewportSize(containerRef, onViewportChange);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [guides, setGuides] = useState<Guides>(NO_GUIDES);
  const [marquee, setMarquee] = useState<Box | null>(null);
  const [hoverBox, setHoverBox] = useState<Box | null>(null);
  const [moving, setMoving] = useState(false);
  const spaceHeld = useSpaceHeld();
  const marqueeStart = useRef<Point | null>(null);
  const panStart = useRef<{ pointer: Point; pan: Point } | null>(null);

  const offset = {
    x: (viewport.width - design.width * zoom) / 2 + pan.x,
    y: (viewport.height - design.height * zoom) / 2 + pan.y,
  };

  const findNode = useCallback(
    (id: string): Konva.Node | undefined =>
      stageRef.current?.findOne(
        (node: Konva.Node) => node.id() === id && node.hasName(ELEMENT_NODE_NAME),
      ),
    [],
  );

  const localBox = useCallback((node: Konva.Node): Box | null => {
    const group = designGroupRef.current;
    return group === null ? null : node.getClientRect({ relativeTo: group, skipShadow: true });
  }, []);

  useEffect(() => {
    editor.measureRef.current = (id) => {
      const node = findNode(id);
      return node?.getClientRect({ skipTransform: true, skipShadow: true }).height;
    };
  }, [editor.measureRef, findNode]);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (transformer === null) {
      return;
    }
    const nodes =
      editingId === null
        ? selectedIds.map(findNode).filter((node): node is Konva.Node => node !== undefined)
        : [];
    transformer.nodes(nodes);
    transformer.getLayer()?.batchDraw();
  });

  const pagePoint = useCallback((): Point | null => {
    const pointer = stageRef.current?.getPointerPosition();
    if (pointer === undefined || pointer === null) {
      return null;
    }
    return { x: (pointer.x - offset.x) / zoom, y: (pointer.y - offset.y) / zoom };
  }, [offset.x, offset.y, zoom]);

  const interactionFor = useElementInteractions({
    editor,
    zoom,
    spaceHeld,
    snapEnabled,
    findNode,
    localBox,
    onHover: setHoverBox,
    onGuides: setGuides,
    onContextMenu: (_element, point) => onContextMenu(point),
    onDragging: setMoving,
  });

  const [selectionBox, setSelectionBox] = useState<Box | null>(null);

  const measureSelection = (): Box | null => {
    if (moving || editingId !== null || marquee !== null) {
      return null;
    }
    const boxes = selectedIds
      .map(findNode)
      .map((node) => (node === undefined ? null : localBox(node)))
      .filter((box): box is Box => box !== null);
    const union = unionBox(boxes);
    return union === null
      ? null
      : {
          x: offset.x + union.x * zoom,
          y: offset.y + union.y * zoom,
          width: union.width * zoom,
          height: union.height * zoom,
        };
  };

  useLayoutEffect(() => {
    const next = measureSelection();
    setSelectionBox((current) =>
      current !== null &&
      next !== null &&
      current.x === next.x &&
      current.y === next.y &&
      current.width === next.width &&
      current.height === next.height
        ? current
        : next,
    );
  });

  const onStageDown = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    blurActiveElement();
    const target = event.target;
    const onEmpty = target === target.getStage() || target.hasName(CANVAS_BACKGROUND_NAME);
    const pointer = stageRef.current?.getPointerPosition() ?? null;
    const middle = 'button' in event.evt && event.evt.button === 1;
    if ((spaceHeld || middle) && pointer !== null) {
      panStart.current = { pointer, pan };
      return;
    }
    if (!onEmpty) {
      return;
    }
    const point = pagePoint();
    marqueeStart.current = point;
    setMarquee(point === null ? null : { ...point, width: 0, height: 0 });
  };

  const onStageMove = () => {
    const pointer = stageRef.current?.getPointerPosition() ?? null;
    if (panStart.current !== null && pointer !== null) {
      const start = panStart.current;
      setPan({
        x: start.pan.x + pointer.x - start.pointer.x,
        y: start.pan.y + pointer.y - start.pointer.y,
      });
      return;
    }
    const start = marqueeStart.current;
    const point = pagePoint();
    if (start === null || point === null) {
      return;
    }
    setMarquee({
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x),
      height: Math.abs(point.y - start.y),
    });
  };

  const onStageUp = () => {
    panStart.current = null;
    const box = marquee;
    marqueeStart.current = null;
    setMarquee(null);
    if (box === null) {
      return;
    }
    if (box.width * zoom < 3 && box.height * zoom < 3) {
      editor.clearSelection();
      return;
    }
    const hits = design.elements
      .filter((element) => !(element.locked || element.hidden))
      .filter((element) => {
        const node = findNode(element.id);
        const bounds = node === undefined ? null : localBox(node);
        return bounds !== null && boxesIntersect(bounds, box);
      })
      .map((element) => element.id);
    if (hits.length > 0) {
      editor.select(hits);
    } else {
      editor.clearSelection();
    }
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();
    if (event.evt.ctrlKey || event.evt.metaKey) {
      const pointer = stageRef.current?.getPointerPosition();
      const next = Math.min(8, Math.max(0.05, zoom * (event.evt.deltaY > 0 ? 0.92 : 1.08)));
      if (pointer !== undefined && pointer !== null) {
        const pageX = (pointer.x - offset.x) / zoom;
        const pageY = (pointer.y - offset.y) / zoom;
        const baseX = (viewport.width - design.width * next) / 2;
        const baseY = (viewport.height - design.height * next) / 2;
        setPan({ x: pointer.x - pageX * next - baseX, y: pointer.y - pageY * next - baseY });
      }
      onZoomChange(next);
      return;
    }
    setPan({ x: pan.x - event.evt.deltaX, y: pan.y - event.evt.deltaY });
  };

  const onDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
    if (
      event.dataTransfer.types.includes('Files') ||
      event.dataTransfer.types.includes(DRAG_IMAGE_TYPE)
    ) {
      event.preventDefault();
    }
  };

  const onDrop = (event: ReactDragEvent<HTMLDivElement>) => {
    const files = [...event.dataTransfer.files].filter((file) => file.type.startsWith('image/'));
    const dragged = readDraggedImage(event.dataTransfer);
    if (files.length === 0 && dragged === null) {
      return;
    }
    event.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    const point =
      rect === undefined
        ? { x: design.width / 2, y: design.height / 2 }
        : {
            x: (event.clientX - rect.left - offset.x) / zoom,
            y: (event.clientY - rect.top - offset.y) / zoom,
          };
    if (dragged === null) {
      onDropFiles(files, point);
    } else {
      onDropImage(dragged, point);
    }
  };

  const editingElement = design.elements.find((element) => element.id === editingId);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the canvas is a file drop target
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: the canvas is a file drop target
    <div
      ref={containerRef}
      className="relative min-h-0 flex-1 overflow-hidden bg-muted/60"
      style={{ cursor: spaceHeld ? 'grab' : 'default' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-testid="design-canvas"
    >
      {viewport.width > 0 ? (
        <Stage
          ref={stageRef}
          width={viewport.width}
          height={viewport.height}
          onMouseDown={onStageDown}
          onTouchStart={onStageDown}
          onMouseMove={onStageMove}
          onTouchMove={onStageMove}
          onMouseUp={onStageUp}
          onTouchEnd={onStageUp}
          onMouseLeave={() => setHoverBox(null)}
          onWheel={onWheel}
          onContextMenu={(event) => {
            event.evt.preventDefault();
            onContextMenu({ x: event.evt.clientX, y: event.evt.clientY });
          }}
        >
          <Layer>
            <Rect
              x={offset.x}
              y={offset.y}
              width={design.width * zoom}
              height={design.height * zoom}
              fill="#ffffff"
              shadowColor="rgba(15,23,42,0.18)"
              shadowBlur={24}
              shadowOffsetY={6}
              listening={false}
            />
            <Group ref={designGroupRef} x={offset.x} y={offset.y} scaleX={zoom} scaleY={zoom}>
              <Group
                onMouseOver={(event) => {
                  const group = event.target.findAncestor(`.${ELEMENT_NODE_NAME}`, true);
                  if (group !== undefined && group !== null && !selectedIds.includes(group.id())) {
                    setHoverBox(localBox(group));
                  }
                }}
                onMouseOut={() => setHoverBox(null)}
              >
                <DesignContent
                  design={design}
                  fontsVersion={fontsVersion}
                  editingId={editingId}
                  interactionFor={interactionFor}
                />
              </Group>
              <WorkspaceOverlays
                hoverBox={hoverBox}
                guides={guides}
                marquee={marquee}
                zoom={zoom}
                grid={showGrid ? { width: design.width, height: design.height } : null}
              />
            </Group>
            <SelectionTransformer
              transformerRef={transformerRef}
              selected={selectedElements}
              elements={design.elements}
              onCommit={editor.updateMany}
              onTransforming={setMoving}
            />
          </Layer>
        </Stage>
      ) : null}
      {selectionBox === null || viewport.width === 0 ? null : (
        <SelectionToolbar editor={editor} box={selectionBox} onMore={onContextMenu} />
      )}
      {editingElement?.type === 'text' ? (
        <TextEditOverlay
          element={editingElement}
          zoom={zoom}
          offset={offset}
          onCommit={(text) => {
            if (text !== editingElement.text) {
              editor.replaceElement({ ...editingElement, text });
            }
            editor.setEditingId(null);
          }}
        />
      ) : null}
    </div>
  );
};

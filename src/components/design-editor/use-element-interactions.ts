'use client';

import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useRef } from 'react';
import { type Box, type DesignElement, type Point, pasteElements, snapAxis } from '@/design';
import type { ElementInteraction } from './element-node';
import type { DesignEditorState } from './use-design-editor';
import { type Guides, NO_GUIDES } from './workspace-overlays';

const SNAP_PX = 6;

export const blurActiveElement = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

interface InteractionOptions {
  editor: DesignEditorState;
  zoom: number;
  spaceHeld: boolean;
  snapEnabled: boolean;
  findNode: (id: string) => Konva.Node | undefined;
  localBox: (node: Konva.Node) => Box | null;
  onHover: (box: Box | null) => void;
  onGuides: (guides: Guides) => void;
  onContextMenu: (element: DesignElement, point: Point) => void;
  onDragging: (dragging: boolean) => void;
}

export const useElementInteractions = ({
  editor,
  zoom,
  spaceHeld,
  snapEnabled,
  findNode,
  localBox,
  onHover,
  onGuides,
  onContextMenu,
  onDragging,
}: InteractionOptions) => {
  const { design, selectedIds } = editor;
  const snapTargets = useRef<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const dragOrigin = useRef<Point | null>(null);

  const collectSnapTargets = useCallback(
    (movingIds: readonly string[]) => {
      const xs = [0, design.width / 2, design.width];
      const ys = [0, design.height / 2, design.height];
      for (const element of design.elements) {
        if (movingIds.includes(element.id) || element.hidden) {
          continue;
        }
        const node = findNode(element.id);
        const box = node === undefined ? null : localBox(node);
        if (box !== null) {
          xs.push(box.x, box.x + box.width / 2, box.x + box.width);
          ys.push(box.y, box.y + box.height / 2, box.y + box.height);
        }
      }
      snapTargets.current = { x: xs, y: ys };
    },
    [design.height, design.width, findNode, localBox, design.elements],
  );

  const snapNode = useCallback(
    (node: Konva.Node) => {
      const box = localBox(node);
      if (box === null) {
        return;
      }
      const threshold = SNAP_PX / zoom;
      const snapX = snapAxis(
        [box.x, box.x + box.width / 2, box.x + box.width],
        snapTargets.current.x,
        threshold,
      );
      const snapY = snapAxis(
        [box.y, box.y + box.height / 2, box.y + box.height],
        snapTargets.current.y,
        threshold,
      );
      node.x(node.x() + snapX.delta);
      node.y(node.y() + snapY.delta);
      onGuides({ vertical: snapX.guide, horizontal: snapY.guide });
    },
    [localBox, onGuides, zoom],
  );

  return useCallback(
    (element: DesignElement): ElementInteraction => {
      const moving = () => (selectedIds.includes(element.id) ? selectedIds : [element.id]);
      const onPress = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (spaceHeld) {
          return;
        }
        event.cancelBubble = true;
        blurActiveElement();
        const additive = 'shiftKey' in event.evt && (event.evt.shiftKey || event.evt.metaKey);
        if (additive || !selectedIds.includes(element.id)) {
          editor.select([element.id], additive);
        }
      };
      const onEdit = () => {
        if (element.locked) {
          return;
        }
        editor.focusElement(element.id);
        if (element.type === 'text') {
          editor.setEditingId(element.id);
        }
      };
      return {
        draggable: !(element.locked || spaceHeld),
        onMouseDown: onPress,
        onTouchStart: onPress,
        onDblClick: onEdit,
        onDblTap: onEdit,
        onContextMenu: (event) => {
          event.evt.preventDefault();
          event.cancelBubble = true;
          if (!selectedIds.includes(element.id)) {
            editor.select([element.id]);
          }
          onContextMenu(element, { x: event.evt.clientX, y: event.evt.clientY });
        },
        onDragStart: (event) => {
          onHover(null);
          onDragging(true);
          dragOrigin.current = { x: event.target.x(), y: event.target.y() };
          const ids = moving();
          collectSnapTargets(ids);
          if (event.evt.altKey) {
            const copies = design.elements.filter((item) => ids.includes(item.id));
            editor.transform((current) => pasteElements(current, copies, 0).design);
          }
        },
        onDragMove: (event) => {
          const node = event.target;
          const origin = dragOrigin.current;
          if (event.evt.shiftKey && origin !== null) {
            const dx = Math.abs(node.x() - origin.x);
            const dy = Math.abs(node.y() - origin.y);
            if (dx > dy) {
              node.y(origin.y);
            } else {
              node.x(origin.x);
            }
          }
          if (snapEnabled && selectedIds.length <= 1) {
            snapNode(node);
          }
        },
        onDragEnd: () => {
          onGuides(NO_GUIDES);
          onDragging(false);
          dragOrigin.current = null;
          const updates = new Map<string, DesignElement>();
          for (const id of moving()) {
            const node = findNode(id);
            const current = design.elements.find((item) => item.id === id);
            if (node !== undefined && current !== undefined) {
              updates.set(id, { ...current, x: node.x(), y: node.y() });
            }
          }
          editor.updateMany(updates);
        },
      };
    },
    [
      collectSnapTargets,
      editor,
      findNode,
      onContextMenu,
      onDragging,
      onGuides,
      onHover,
      design.elements,
      selectedIds,
      snapEnabled,
      snapNode,
      spaceHeld,
    ],
  );
};

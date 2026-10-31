'use client';

import type Konva from 'konva';
import type { Ref } from 'react';
import { Transformer } from 'react-konva';
import type { DesignElement } from '@/design';
import { ACCENT } from './workspace-overlays';

const ROTATION_SNAPS = [0, 45, 90, 135, 180, 225, 270, 315];
const TEXT_ANCHORS = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'middle-left',
  'middle-right',
];
const LINE_ANCHORS = ['middle-left', 'middle-right'];
const ALL_ANCHORS = [
  'top-left',
  'top-center',
  'top-right',
  'middle-right',
  'middle-left',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];
const CORNER_ANCHORS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

const anchorsFor = (elements: readonly DesignElement[]): string[] => {
  if (elements.length !== 1) {
    return CORNER_ANCHORS;
  }
  const [element] = elements;
  if (element?.type === 'text') {
    return TEXT_ANCHORS;
  }
  if (element?.type === 'line') {
    return LINE_ANCHORS;
  }
  return ALL_ANCHORS;
};

const keepsRatio = (elements: readonly DesignElement[]): boolean =>
  elements.length !== 1 ||
  elements.some((element) => element.type === 'icon' || element.type === 'text');

const applyTransform = (
  element: DesignElement,
  node: Konva.Node,
  anchor: string | null,
): DesignElement => {
  const scaleX = Math.abs(node.scaleX());
  const scaleY = Math.abs(node.scaleY());
  node.scale({ x: 1, y: 1 });
  const base = { ...element, x: node.x(), y: node.y(), rotation: node.rotation() };
  if (base.type === 'text') {
    const sideOnly = anchor === 'middle-left' || anchor === 'middle-right';
    return sideOnly
      ? { ...base, width: Math.max(20, base.width * scaleX) }
      : {
          ...base,
          width: Math.max(20, base.width * scaleX),
          fontSize: Math.max(4, base.fontSize * scaleY),
          letterSpacing: base.letterSpacing * scaleY,
        };
  }
  if (base.type === 'line') {
    return { ...base, width: Math.max(4, base.width * scaleX) };
  }
  return {
    ...base,
    width: Math.max(4, base.width * scaleX),
    height: Math.max(4, base.height * scaleY),
  };
};

interface SelectionTransformerProps {
  transformerRef: Ref<Konva.Transformer>;
  selected: readonly DesignElement[];
  elements: readonly DesignElement[];
  onCommit: (updates: Map<string, DesignElement>) => void;
  onTransforming: (transforming: boolean) => void;
}

export const SelectionTransformer = ({
  transformerRef,
  selected,
  elements,
  onCommit,
  onTransforming,
}: SelectionTransformerProps) => {
  const anyLocked = selected.some((element) => element.locked);
  return (
    <Transformer
      ref={transformerRef}
      rotateEnabled={!anyLocked}
      resizeEnabled={!anyLocked}
      enabledAnchors={anchorsFor(selected)}
      keepRatio={keepsRatio(selected)}
      rotationSnaps={ROTATION_SNAPS}
      rotationSnapTolerance={4}
      anchorSize={10}
      anchorCornerRadius={5}
      anchorStroke={ACCENT}
      anchorFill="#ffffff"
      borderStroke={ACCENT}
      borderStrokeWidth={1.5}
      rotateAnchorOffset={28}
      ignoreStroke
      flipEnabled={false}
      boundBoxFunc={(previous, next) =>
        Math.abs(next.width) < 4 || Math.abs(next.height) < 4 ? previous : next
      }
      onTransformStart={() => onTransforming(true)}
      onTransformEnd={(event) => {
        onTransforming(false);
        const transformer = event.currentTarget as Konva.Transformer;
        const anchor = transformer.getActiveAnchor();
        const updates = new Map<string, DesignElement>();
        for (const node of transformer.nodes()) {
          const current = elements.find((item) => item.id === node.id());
          if (current !== undefined) {
            updates.set(current.id, applyTransform(current, node, anchor));
          }
        }
        onCommit(updates);
      }}
    />
  );
};

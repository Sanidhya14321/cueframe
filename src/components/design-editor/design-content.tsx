'use client';

import type Konva from 'konva';
import type { Ref } from 'react';
import { Group, Layer, Rect, Stage } from 'react-konva';
import type { Design, DesignElement } from '@/design';
import { type ElementInteraction, ElementNode } from './element-node';
import { konvaFill } from './konva-fill';

export const CANVAS_BACKGROUND_NAME = 'canvas-background';

interface DesignContentProps {
  design: Design;
  fontsVersion: number;
  editingId?: string | null;
  interactionFor?: (element: DesignElement) => ElementInteraction;
}

const elementKey = (element: DesignElement, fontsVersion: number): string =>
  element.type === 'text' ? `${element.id}-${fontsVersion}` : element.id;

export const DesignContent = ({
  design,
  fontsVersion,
  editingId = null,
  interactionFor,
}: DesignContentProps) => (
  <Group clipX={0} clipY={0} clipWidth={design.width} clipHeight={design.height}>
    <Rect
      name={CANVAS_BACKGROUND_NAME}
      width={design.width}
      height={design.height}
      listening={interactionFor !== undefined}
      {...konvaFill(design.background, design.width, design.height)}
    />
    {design.elements.map((element) => (
      <ElementNode
        key={elementKey(element, fontsVersion)}
        element={element}
        editingText={element.id === editingId}
        {...(interactionFor === undefined ? {} : { interaction: interactionFor(element) })}
      />
    ))}
  </Group>
);

interface DesignStageProps {
  design: Design;
  scale: number;
  fontsVersion: number;
  stageRef?: Ref<Konva.Stage>;
}

export const DesignStage = ({ design, scale, fontsVersion, stageRef }: DesignStageProps) => (
  <Stage
    {...(stageRef === undefined ? {} : { ref: stageRef })}
    width={design.width * scale}
    height={design.height * scale}
    scaleX={scale}
    scaleY={scale}
    listening={false}
  >
    <Layer listening={false}>
      <DesignContent design={design} fontsVersion={fontsVersion} />
    </Layer>
  </Stage>
);

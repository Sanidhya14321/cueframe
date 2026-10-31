'use client';

import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, type ReactNode, useLayoutEffect, useRef } from 'react';
import { Arrow, Ellipse, Group, Image, Label, Line, Path, Rect, Tag, Text } from 'react-konva';
import {
  containBox,
  coverCrop,
  cssFilterString,
  cssFontFamily,
  type DesignElement,
  fontStyleString,
  hasFilters,
  type IconElement,
  type ImageElement,
  iconDataUrl,
  polygonPoints,
  type Shadow,
  starPoints,
  type TextElement,
  textDecorationString,
} from '@/design';
import { useImageSource } from './image-cache';
import { konvaFill } from './konva-fill';

export const ELEMENT_NODE_NAME = 'design-element';

const shadowProps = (shadow: Shadow | undefined) =>
  shadow === undefined
    ? { shadowEnabled: false }
    : {
        shadowEnabled: true,
        shadowColor: shadow.color,
        shadowBlur: shadow.blur,
        shadowOffsetX: shadow.offsetX,
        shadowOffsetY: shadow.offsetY,
        shadowOpacity: 1,
      };

const dashFor = (dashed: boolean, strokeWidth: number): number[] =>
  dashed ? [Math.max(strokeWidth * 3, 6), Math.max(strokeWidth * 2, 4)] : [];

const displayText = (element: TextElement): string =>
  element.uppercase ? element.text.toUpperCase() : element.text;

const estimatedTextHeight = (element: TextElement): number =>
  element.text.split('\n').length * element.fontSize * element.lineHeight;

const TextNode = ({ element }: { element: TextElement }) => {
  const text = (
    <Text
      text={displayText(element)}
      width={element.width}
      fontFamily={cssFontFamily(element.fontFamily)}
      fontSize={element.fontSize}
      fontStyle={fontStyleString(element.fontWeight, element.italic)}
      textDecoration={textDecorationString(element.underline, element.strikethrough)}
      align={element.align}
      lineHeight={element.lineHeight}
      letterSpacing={element.letterSpacing}
      stroke={element.stroke}
      strokeEnabled={element.strokeWidth > 0}
      strokeWidth={element.strokeWidth}
      fillAfterStrokeEnabled
      padding={element.background?.padding ?? 0}
      {...konvaFill(element.fill, element.width, estimatedTextHeight(element))}
      {...shadowProps(element.shadow)}
    />
  );
  if (element.background === undefined) {
    return text;
  }
  return (
    <Label>
      <Tag fill={element.background.fill} cornerRadius={element.background.radius} />
      {text}
    </Label>
  );
};

const roundedClip = (width: number, height: number, radius: number) => {
  const r = Math.min(radius, width / 2, height / 2);
  return (context: Konva.Context) => {
    context.beginPath();
    context.moveTo(r, 0);
    context.arcTo(width, 0, width, height, r);
    context.arcTo(width, height, 0, height, r);
    context.arcTo(0, height, 0, 0, r);
    context.arcTo(0, 0, width, 0, r);
    context.closePath();
  };
};

const PLACEHOLDER_ICON = iconDataUrl('image', '#94a3b8', 1.5, 256);

const ImagePlaceholder = ({ element }: { element: ImageElement }) => {
  const icon = useImageSource(PLACEHOLDER_ICON);
  const size = Math.min(element.width, element.height) * 0.28;
  return (
    <>
      <Rect
        width={element.width}
        height={element.height}
        {...konvaFill(
          {
            type: 'linear',
            angle: 135,
            stops: [
              { offset: 0, color: '#e2e8f0' },
              { offset: 1, color: '#cbd5e1' },
            ],
          },
          element.width,
          element.height,
        )}
      />
      {icon === undefined ? null : (
        <Image
          image={icon}
          x={(element.width - size) / 2}
          y={(element.height - size) / 2}
          width={size}
          height={size}
          listening={false}
        />
      )}
    </>
  );
};

const ImageBitmap = memo(
  ({ element, image }: { element: ImageElement; image: HTMLImageElement }) => {
    const ref = useRef<Konva.Image>(null);
    const filter = cssFilterString(element.filters);
    const filtered = hasFilters(element.filters);
    const box =
      element.fit === 'contain'
        ? containBox(image.naturalWidth, image.naturalHeight, element.width, element.height)
        : { x: 0, y: 0, width: element.width, height: element.height };
    const crop =
      element.fit === 'cover'
        ? coverCrop(
            image.naturalWidth,
            image.naturalHeight,
            element.width,
            element.height,
            element.crop,
          )
        : undefined;

    useLayoutEffect(() => {
      const node = ref.current;
      if (node === null) {
        return;
      }
      if (filtered) {
        node.cache({ pixelRatio: 2 });
      } else {
        node.clearCache();
      }
    });

    return (
      <Image
        ref={ref}
        image={image}
        x={element.flipX ? box.x + box.width : box.x}
        y={element.flipY ? box.y + box.height : box.y}
        width={box.width}
        height={box.height}
        scaleX={element.flipX ? -1 : 1}
        scaleY={element.flipY ? -1 : 1}
        {...(crop === undefined ? {} : { crop })}
        filters={filtered ? [filter] : []}
      />
    );
  },
);

const ImageNode = ({ element }: { element: ImageElement }) => {
  const image = useImageSource(element.src);
  return (
    <>
      <Rect
        width={element.width}
        height={element.height}
        cornerRadius={element.cornerRadius}
        fill="#000"
        opacity={element.shadow === undefined ? 0 : 1}
        {...shadowProps(element.shadow)}
      />
      <Group clipFunc={roundedClip(element.width, element.height, element.cornerRadius)}>
        {image === undefined ? (
          <ImagePlaceholder element={element} />
        ) : (
          <ImageBitmap element={element} image={image} />
        )}
      </Group>
      {element.strokeWidth > 0 ? (
        <Rect
          width={element.width}
          height={element.height}
          cornerRadius={element.cornerRadius}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          listening={false}
        />
      ) : null}
    </>
  );
};

const IconNode = ({ element }: { element: IconElement }) => {
  const image = useImageSource(iconDataUrl(element.icon, element.color, element.strokeWidth));
  return (
    <>
      <Rect width={element.width} height={element.height} fill="transparent" />
      {image === undefined ? null : (
        <Image
          image={image}
          width={element.width}
          height={element.height}
          {...shadowProps(element.shadow)}
        />
      )}
    </>
  );
};

const ShapeContent = ({ element }: { element: DesignElement }): ReactNode => {
  switch (element.type) {
    case 'text':
      return <TextNode element={element} />;
    case 'image':
      return <ImageNode element={element} />;
    case 'icon':
      return <IconNode element={element} />;
    case 'rect':
      return (
        <Rect
          width={element.width}
          height={element.height}
          cornerRadius={Math.min(element.cornerRadius, element.width / 2, element.height / 2)}
          stroke={element.stroke}
          strokeEnabled={element.strokeWidth > 0}
          strokeWidth={element.strokeWidth}
          dash={dashFor(element.dashed, element.strokeWidth)}
          {...konvaFill(element.fill, element.width, element.height)}
          {...shadowProps(element.shadow)}
        />
      );
    case 'ellipse':
      return (
        <Ellipse
          x={element.width / 2}
          y={element.height / 2}
          radiusX={element.width / 2}
          radiusY={element.height / 2}
          stroke={element.stroke}
          strokeEnabled={element.strokeWidth > 0}
          strokeWidth={element.strokeWidth}
          dash={dashFor(element.dashed, element.strokeWidth)}
          {...konvaFill(element.fill, element.width, element.height, {
            x: -element.width / 2,
            y: -element.height / 2,
          })}
          {...shadowProps(element.shadow)}
        />
      );
    case 'polygon':
    case 'star':
      return (
        <Line
          points={
            element.type === 'polygon'
              ? polygonPoints(element.sides, element.width, element.height)
              : starPoints(element.points, element.innerRatio, element.width, element.height)
          }
          closed
          lineJoin="round"
          stroke={element.stroke}
          strokeEnabled={element.strokeWidth > 0}
          strokeWidth={element.strokeWidth}
          dash={dashFor(element.dashed, element.strokeWidth)}
          {...konvaFill(element.fill, element.width, element.height)}
          {...shadowProps(element.shadow)}
        />
      );
    case 'path':
      return (
        <Path
          data={element.data}
          scaleX={element.width / element.viewWidth}
          scaleY={element.height / element.viewHeight}
          strokeScaleEnabled={false}
          stroke={element.stroke}
          strokeEnabled={element.strokeWidth > 0}
          strokeWidth={element.strokeWidth}
          dash={dashFor(element.dashed, element.strokeWidth)}
          {...konvaFill(element.fill, element.viewWidth, element.viewHeight)}
          {...shadowProps(element.shadow)}
        />
      );
    case 'line': {
      const y = element.strokeWidth / 2;
      const pointer = element.strokeWidth * 3;
      return (
        <Arrow
          points={[0, y, element.width, y]}
          stroke={element.stroke}
          fill={element.stroke}
          strokeWidth={element.strokeWidth}
          hitStrokeWidth={Math.max(element.strokeWidth, 20)}
          lineCap="round"
          lineJoin="round"
          pointerLength={pointer}
          pointerWidth={pointer}
          pointerAtBeginning={element.arrowStart}
          pointerAtEnding={element.arrowEnd}
          dash={dashFor(element.dashed, element.strokeWidth)}
          {...shadowProps(element.shadow)}
        />
      );
    }
    default:
      return null;
  }
};

export interface ElementInteraction {
  draggable?: boolean;
  onMouseDown?: (event: KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onTouchStart?: (event: KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onDblClick?: (event: KonvaEventObject<MouseEvent>) => void;
  onDblTap?: (event: KonvaEventObject<Event>) => void;
  onContextMenu?: (event: KonvaEventObject<PointerEvent>) => void;
  onDragStart?: (event: KonvaEventObject<DragEvent>) => void;
  onDragMove?: (event: KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (event: KonvaEventObject<DragEvent>) => void;
  onTransformEnd?: (event: KonvaEventObject<Event>) => void;
}

interface ElementNodeProps {
  element: DesignElement;
  editingText?: boolean;
  interaction?: ElementInteraction;
}

export const ElementNode = ({
  element,
  editingText = false,
  interaction = {},
}: ElementNodeProps) => (
  <Group
    id={element.id}
    name={ELEMENT_NODE_NAME}
    x={element.x}
    y={element.y}
    rotation={element.rotation}
    opacity={editingText ? 0 : element.opacity}
    visible={!element.hidden}
    listening={interaction.draggable !== undefined && !element.locked}
    {...interaction}
  >
    <ShapeContent element={element} />
  </Group>
);

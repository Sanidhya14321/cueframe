'use client';

import {
  type DesignElement,
  type EllipseElement,
  firstFillColor,
  type LineElement,
  type PathElement,
  type PolygonElement,
  polygonPoints,
  type RectElement,
  type StarElement,
  starPoints,
} from '@/design';
import { fillToCss } from '../konva-fill';

const SIZE = 40;

interface Size {
  width: number;
  height: number;
}

const toPoints = (points: number[]): string =>
  points
    .reduce<string[]>((pairs, value, index) => {
      if (index % 2 === 0) {
        pairs.push(`${value},${points[index + 1] ?? 0}`);
      }
      return pairs;
    }, [])
    .join(' ');

const previewSize = (
  element: RectElement | EllipseElement | PolygonElement | StarElement,
): Size => {
  const ratio = element.height / element.width;
  return ratio > 1 ? { width: SIZE / ratio, height: SIZE } : { width: SIZE, height: SIZE * ratio };
};

const LinePreview = ({ element }: { element: LineElement }) => (
  <span
    className="block h-1 w-10 rounded-full"
    style={{
      background: element.dashed
        ? `repeating-linear-gradient(90deg, ${element.stroke} 0 6px, transparent 6px 10px)`
        : element.stroke,
    }}
  />
);

const PolygonPreview = ({ element }: { element: PolygonElement | StarElement }) => {
  const { width, height } = previewSize(element);
  const points =
    element.type === 'polygon'
      ? polygonPoints(element.sides, width, height)
      : starPoints(element.points, element.innerRatio, width, height);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polygon points={toPoints(points)} fill={firstFillColor(element.fill)} />
    </svg>
  );
};

const BoxPreview = ({ element }: { element: RectElement | EllipseElement }) => {
  const { width, height } = previewSize(element);
  const outline = element.strokeWidth > 0;
  const radius =
    element.type === 'ellipse' ? '50%' : (element.cornerRadius / element.width) * width;
  return (
    <span
      className="block"
      style={{
        width,
        height,
        borderRadius: radius,
        background: outline ? 'transparent' : fillToCss(element.fill),
        border: outline ? `3px solid ${element.stroke}` : undefined,
      }}
    />
  );
};

const PathPreview = ({ element }: { element: PathElement }) => (
  <svg
    width={SIZE}
    height={SIZE}
    viewBox={`0 0 ${element.viewWidth} ${element.viewHeight}`}
    aria-hidden="true"
  >
    <path d={element.data} fill={firstFillColor(element.fill)} />
  </svg>
);

export const ShapePreview = ({ element }: { element: DesignElement }) => {
  switch (element.type) {
    case 'line':
      return <LinePreview element={element} />;
    case 'polygon':
    case 'star':
      return <PolygonPreview element={element} />;
    case 'rect':
    case 'ellipse':
      return <BoxPreview element={element} />;
    case 'path':
      return <PathPreview element={element} />;
    default:
      return null;
  }
};

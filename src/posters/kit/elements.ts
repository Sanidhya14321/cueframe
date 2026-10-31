import {
  createEllipse,
  createIcon,
  createImage,
  createLine,
  createPath,
  createPolygon,
  createRect,
  createStar,
  createText,
  type DesignElement,
  type DesignIconName,
  type EllipseElement,
  type Fill,
  type IconElement,
  type ImageElement,
  type LineElement,
  type PathElement,
  type PolygonElement,
  pathFromPoints,
  type RectElement,
  type StarElement,
  type TextElement,
} from '@/design';
import { POSTER_PHOTOS, type PosterPhotoName } from '../photos';

type Style<T> = Partial<Omit<T, 'type' | 'id'>>;

export type Nodes = DesignElement | readonly Nodes[];

const isNodeList = (node: Nodes): node is readonly Nodes[] => Array.isArray(node);

export const flatten = (nodes: readonly Nodes[]): DesignElement[] =>
  nodes.flatMap((node) => (isNodeList(node) ? flatten(node) : [node]));

export const text = (
  content: string,
  x: number,
  y: number,
  width: number,
  style: Style<TextElement> = {},
): TextElement =>
  createText({
    name: content.split('\n')[0]?.slice(0, 32) ?? 'Text',
    text: content,
    x,
    y,
    width,
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: 700,
    fill: '#111111',
    ...style,
  });

export const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: Fill,
  style: Style<RectElement> = {},
): RectElement => createRect({ name: 'Shape', x, y, width, height, fill, ...style });

export const ellipse = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: Fill,
  style: Style<EllipseElement> = {},
): EllipseElement => createEllipse({ name: 'Ellipse', x, y, width, height, fill, ...style });

export const circle = (
  cx: number,
  cy: number,
  radius: number,
  fill: Fill,
  style: Style<EllipseElement> = {},
): EllipseElement => ellipse(cx - radius, cy - radius, radius * 2, radius * 2, fill, style);

export const polygon = (
  sides: number,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: Fill,
  style: Style<PolygonElement> = {},
): PolygonElement => createPolygon({ name: 'Polygon', sides, x, y, width, height, fill, ...style });

export const star = (
  points: number,
  x: number,
  y: number,
  size: number,
  fill: Fill,
  style: Style<StarElement> = {},
): StarElement =>
  createStar({ name: 'Star', points, x, y, width: size, height: size, fill, ...style });

export const path = (
  data: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: Fill,
  view: { width: number; height: number },
  style: Style<PathElement> = {},
): PathElement =>
  createPath({
    name: 'Shape',
    data,
    x,
    y,
    width,
    height,
    fill,
    viewWidth: view.width,
    viewHeight: view.height,
    ...style,
  });

export const poly = (
  points: readonly (readonly [number, number])[],
  fill: Fill,
  style: Style<PathElement> = {},
): PathElement => createPath({ name: 'Shape', fill, ...pathFromPoints(points), ...style });

export const line = (
  x: number,
  y: number,
  length: number,
  stroke: string,
  strokeWidth = 4,
  style: Style<LineElement> = {},
): LineElement => createLine({ name: 'Line', x, y, width: length, stroke, strokeWidth, ...style });

export const arrow = (
  x: number,
  y: number,
  length: number,
  stroke: string,
  strokeWidth = 6,
  style: Style<LineElement> = {},
): LineElement =>
  line(x, y, length, stroke, strokeWidth, { name: 'Arrow', arrowEnd: true, ...style });

export const icon = (
  name: DesignIconName,
  x: number,
  y: number,
  size: number,
  color: string,
  style: Style<IconElement> = {},
): IconElement =>
  createIcon({ name, icon: name, x, y, width: size, height: size, color, ...style });

export const photo = (
  name: PosterPhotoName,
  x: number,
  y: number,
  width: number,
  height: number,
  style: Style<ImageElement> = {},
): ImageElement =>
  createImage({ name, src: POSTER_PHOTOS[name].src, x, y, width, height, ...style });

export const frame = (
  x: number,
  y: number,
  width: number,
  height: number,
  style: Style<ImageElement> = {},
): ImageElement => createImage({ name: 'Image frame', x, y, width, height, ...style });

export const shadow = (blur: number, offsetY: number, color = 'rgba(0,0,0,0.25)') => ({
  shadow: { color, blur, offsetX: 0, offsetY },
});

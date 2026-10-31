import type { ScrollerWallProps } from '@/schemas';
import { useCanvasFont } from '../promo/desk/canvas-texture';
import { typeFaces } from '../type3d/type-faces';

export const wallFont = typeFaces.poppins.family;

export const fontSpec = (look: ScrollerWallProps['look'], size: number, weight = look.weight) => ({
  family: wallFont,
  weight,
  size,
  tracking: look.tracking,
});

const wallSpec = (weight: number): string => `${weight} 100px "${wallFont}"`;

export const useWallFonts = (props: ScrollerWallProps): void => {
  useCanvasFont(wallSpec(props.look.weight), typeFaces.poppins.ready);
  useCanvasFont(wallSpec(props.words.weight), typeFaces.poppins.ready);
  useCanvasFont(wallSpec(props.contact.weight), typeFaces.poppins.ready);
  useCanvasFont(wallSpec(600), typeFaces.poppins.ready);
};

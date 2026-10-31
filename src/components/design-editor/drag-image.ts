import { z } from 'zod';
import type { LoadedImage } from './read-image-file';

export const DRAG_IMAGE_TYPE = 'application/x-design-image';

const draggedImageSchema = z.object({
  src: z.string().min(1),
  name: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const writeDraggedImage = (transfer: DataTransfer, image: LoadedImage): void => {
  transfer.setData(DRAG_IMAGE_TYPE, JSON.stringify(image));
  transfer.effectAllowed = 'copy';
};

export const readDraggedImage = (transfer: DataTransfer): LoadedImage | null => {
  const raw = transfer.getData(DRAG_IMAGE_TYPE);
  if (raw === '') {
    return null;
  }
  try {
    const parsed = draggedImageSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

'use client';

import { Upload } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { writeDraggedImage } from '../drag-image';
import type { LoadedImage } from '../read-image-file';

interface UploadsPanelProps {
  uploads: LoadedImage[];
  onFiles: (files: File[]) => void;
  onPlace: (image: LoadedImage) => void;
}

export const UploadsPanel = ({ uploads, onFiles, onPlace }: UploadsPanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-label="Upload images"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          event.target.value = '';
          onFiles(files);
        }}
      />
      <Button onClick={() => inputRef.current?.click()} className="w-full">
        <Upload /> Upload images
      </Button>
      <p className="text-muted-foreground text-xs">
        You can also drag images onto the canvas or paste them with ⌘V. Uploads stay in your
        browser.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {uploads.map((image) => (
          <button
            type="button"
            key={image.src.slice(-64)}
            title={image.name}
            onClick={() => onPlace(image)}
            draggable
            onDragStart={(event) => writeDraggedImage(event.dataTransfer, image)}
            className="overflow-hidden rounded-lg bg-muted transition-transform hover:scale-[1.02]"
          >
            <span
              role="img"
              aria-label={image.name}
              className="block aspect-square w-full bg-cover bg-center"
              style={{ backgroundImage: `url("${image.src}")` }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

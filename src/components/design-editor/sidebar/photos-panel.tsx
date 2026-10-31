'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { POSTER_PHOTOS, type PosterPhotoName } from '@/posters/photos';
import { writeDraggedImage } from '../drag-image';
import { cachedImageSize, loadImage } from '../image-cache';
import type { LoadedImage } from '../read-image-file';

const PHOTO_NAMES = Object.keys(POSTER_PHOTOS).filter(
  (name): name is PosterPhotoName => name in POSTER_PHOTOS,
);

export const PhotosPanel = ({ onPlace }: { onPlace: (image: LoadedImage) => void }) => {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const names = PHOTO_NAMES.filter(
    (name) =>
      needle === '' ||
      name.includes(needle) ||
      POSTER_PHOTOS[name].description.toLowerCase().includes(needle),
  );
  return (
    <div className="flex flex-col gap-3">
      <Input
        aria-label="Search photos"
        placeholder="Search photos: team, coffee, yoga"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-8"
      />
      <div className="grid grid-cols-2 gap-2">
        {names.map((name) => {
          const photo = POSTER_PHOTOS[name];
          return (
            <button
              type="button"
              key={name}
              title={photo.description}
              aria-label={`Add photo: ${photo.description}`}
              draggable
              onDragStart={(event) => {
                const loaded = cachedImageSize(photo.src);
                writeDraggedImage(event.dataTransfer, {
                  src: photo.src,
                  name: photo.description,
                  width: loaded?.width ?? 1080,
                  height: loaded?.height ?? 1080,
                });
              }}
              onMouseEnter={() => {
                loadImage(photo.src).catch(() => undefined);
              }}
              onClick={() => {
                loadImage(photo.src)
                  .then((image) => {
                    if (image !== null) {
                      onPlace({
                        src: photo.src,
                        name: photo.description,
                        width: image.naturalWidth,
                        height: image.naturalHeight,
                      });
                    }
                  })
                  .catch(() => undefined);
              }}
              className="aspect-square overflow-hidden rounded-lg bg-muted bg-center bg-cover transition-transform hover:scale-[1.03]"
              style={{ backgroundImage: `url("${photo.src}")` }}
            />
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">Photos from Unsplash, free to use.</p>
    </div>
  );
};

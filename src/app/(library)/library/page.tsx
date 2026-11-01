import { ClipGalleryRoute } from '@/components/gallery/gallery-route';
import { listClips } from '@/lib/clips';
import { listPosters } from '@/lib/posters';
import { listSites } from '@/lib/sites';

const LibraryPage = () => (
  <div className="w-full px-4 pt-3 pb-6 sm:px-6">
    <h1 className="sr-only">Library</h1>
    <ClipGalleryRoute items={[...listClips(), ...listPosters(), ...listSites()]} />
  </div>
);

export default LibraryPage;

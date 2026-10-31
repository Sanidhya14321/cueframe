import { Suspense } from 'react';
import { NewVideoForm } from '@/components/new-video/new-video-form';

const NewVideoPage = () => (
  <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
    <h1 className="font-display text-3xl">New video</h1>
    <Suspense>
      <NewVideoForm />
    </Suspense>
  </div>
);

export default NewVideoPage;

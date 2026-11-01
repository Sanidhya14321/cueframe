import { Suspense } from 'react';
import { NewVideoForm } from '@/components/new-video/new-video-form';

const NewVideoPage = () => (
  <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-5 sm:px-6">
    <h1 className="font-display text-2xl">New video</h1>
    <Suspense>
      <NewVideoForm />
    </Suspense>
  </div>
);

export default NewVideoPage;

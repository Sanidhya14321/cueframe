import { Button } from '@/components/ui/button';

const NotFound = () => (
  <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center gap-3 px-4">
    <h1 className="font-display text-3xl">Page not found</h1>
    <p className="text-muted-foreground text-sm">It may have been moved or deleted.</p>
    <div>
      <Button asChild={true}>
        <a href="/">Back to library</a>
      </Button>
    </div>
  </main>
);

export default NotFound;

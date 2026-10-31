import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClipTimelineHeaderProps {
  title: string;
  onReset: () => void;
}

export const ClipTimelineHeader = ({ title, onReset }: ClipTimelineHeaderProps) => (
  <div className="sticky top-0 z-10 flex items-center gap-2 bg-sidebar/80 px-4 py-3 backdrop-blur">
    <span className="block min-w-0 flex-1 truncate font-semibold text-sm">{title}</span>
    <Button
      variant="ghost"
      size="sm"
      className="h-7 shrink-0 px-2 text-muted-foreground text-xs"
      onClick={onReset}
      title="Discard your changes and start from the original clip"
    >
      <RotateCcw /> Reset
    </Button>
  </div>
);

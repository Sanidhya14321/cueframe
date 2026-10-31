'use client';

import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DEFAULT_EXPORT_SETTINGS,
  EXPORT_QUALITIES,
  type ExportCodec,
  type ExportDownload,
  type ExportSettings,
  type ExportState,
  listEncodableCodecs,
} from '@/lib/use-project-export';

const FORMAT_LABELS: Record<ExportCodec, string> = {
  h264: 'MP4 (H.264)',
  h265: 'MP4 (H.265 / HEVC)',
  vp9: 'WebM (VP9)',
  av1: 'MP4 (AV1)',
};

const QUALITY_LABELS: Record<ExportSettings['quality'], string> = {
  'very-low': 'Very low',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  'very-high': 'Very high',
};

const SCALES: { value: string; label: string }[] = [
  { value: '0.25', label: '0.25x' },
  { value: '0.5', label: '0.5x' },
  { value: '0.75', label: '0.75x' },
  { value: '1', label: '1x' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' },
];

const STATUS_LABEL: Record<ExportState, string> = {
  idle: 'Renders in this browser tab. Keep it in the foreground.',
  rendering: 'Rendering',
  done: 'Render complete.',
  error: 'Render failed.',
};

const useEncodableCodecs = (open: boolean): ExportCodec[] | null => {
  const [codecs, setCodecs] = useState<ExportCodec[] | null>(null);
  useEffect(() => {
    if (!open || codecs !== null) {
      return;
    }
    listEncodableCodecs()
      .then(setCodecs)
      .catch(() => setCodecs([]));
  }, [open, codecs]);
  return codecs;
};

const resolveCodec = (codecs: ExportCodec[] | null, preferred: ExportCodec): ExportCodec =>
  codecs === null || codecs.includes(preferred) ? preferred : (codecs[0] ?? preferred);

const statusMessage = (state: ExportState, error: string | null, unsupported: boolean): string => {
  if (unsupported) {
    return 'This browser cannot encode video. Use a recent Chrome, Edge or Firefox.';
  }
  if (state === 'error' && error !== null) {
    return `${STATUS_LABEL.error} ${error}`;
  }
  return STATUS_LABEL[state];
};

interface ExportStatusProps {
  state: ExportState;
  percent: number;
  error: string | null;
  unsupported: boolean;
}

const ExportStatus = ({ state, percent, error, unsupported }: ExportStatusProps) =>
  state === 'rendering' ? (
    <div className="flex flex-col gap-2">
      <Progress value={percent} />
      <span className="text-muted-foreground text-xs">
        {STATUS_LABEL.rendering} {percent}%
      </span>
    </div>
  ) : (
    <span
      className={
        state === 'error' || unsupported
          ? 'text-destructive text-xs'
          : 'text-muted-foreground text-xs'
      }
    >
      {statusMessage(state, error, unsupported)}
    </span>
  );

interface ExportControlsProps {
  state: ExportState;
  progress: number;
  download: ExportDownload | null;
  error: string | null;
  onExport: (settings: ExportSettings) => void;
}

export const ExportControls = ({
  state,
  progress,
  download,
  error,
  onExport,
}: ExportControlsProps) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ExportSettings>(DEFAULT_EXPORT_SETTINGS);
  const codecs = useEncodableCodecs(open);
  const rendering = state === 'rendering';
  const percent = Math.round(progress * 100);
  const unsupported = codecs !== null && codecs.length === 0;
  const codec = resolveCodec(codecs, settings.codec);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <Download className="size-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export video</DialogTitle>
          <DialogDescription>Choose a format and quality, then render.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="export-format">Format</Label>
            <Select
              value={codec}
              disabled={unsupported}
              onValueChange={(value) =>
                setSettings((current) => ({ ...current, codec: value as ExportCodec }))
              }
            >
              <SelectTrigger id="export-format" aria-label="Format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(codecs ?? [settings.codec]).map((option) => (
                  <SelectItem key={option} value={option}>
                    {FORMAT_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="export-scale">Resolution</Label>
              <Select
                value={String(settings.scale)}
                onValueChange={(value) =>
                  setSettings((current) => ({ ...current, scale: Number(value) }))
                }
              >
                <SelectTrigger id="export-scale" aria-label="Resolution">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCALES.map((scale) => (
                    <SelectItem key={scale.value} value={scale.value}>
                      {scale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="export-quality">Quality</Label>
              <Select
                value={settings.quality}
                onValueChange={(value) =>
                  setSettings((current) => ({
                    ...current,
                    quality: value as ExportSettings['quality'],
                  }))
                }
              >
                <SelectTrigger id="export-quality" aria-label="Quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_QUALITIES.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {QUALITY_LABELS[quality]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ExportStatus state={state} percent={percent} error={error} unsupported={unsupported} />
        </div>
        <DialogFooter>
          {state === 'done' && download !== null ? (
            <Button type="button" variant="outline" asChild>
              <a href={download.url} download={download.fileName}>
                Download
              </a>
            </Button>
          ) : null}
          <Button
            type="button"
            disabled={rendering || unsupported}
            onClick={() => onExport({ ...settings, codec })}
          >
            {rendering ? 'Rendering' : state === 'error' ? 'Retry render' : 'Render'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

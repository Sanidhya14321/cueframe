import { describe, expect, it, mock } from 'bun:test';

mock.module('@remotion/web-renderer', () => ({
  getDefaultContainerForCodec: (codec: string) => (codec === 'vp9' ? 'webm' : 'mp4'),
  getEncodableVideoCodecs: (container: string) =>
    Promise.resolve(container === 'mp4' ? ['h264'] : ['vp9']),
  renderMediaOnWeb: mock(),
}));

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ExportControls } from '@/components/timeline/export-controls';

const renderControls = (props: Partial<Parameters<typeof ExportControls>[0]> = {}) => {
  const onExport = mock();
  render(
    <ExportControls
      state="idle"
      progress={0}
      download={null}
      error={null}
      onExport={onExport}
      {...props}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Export' }));
  return onExport;
};

describe('ExportControls', () => {
  it('opens a dialog exposing format, resolution and quality controls', () => {
    renderControls();
    expect(screen.getByLabelText('Format')).toBeInTheDocument();
    expect(screen.getByLabelText('Resolution')).toBeInTheDocument();
    expect(screen.getByLabelText('Quality')).toBeInTheDocument();
  });

  it('renders in the browser with the chosen settings', async () => {
    const onExport = renderControls();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Render' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Render' }));
    expect(onExport).toHaveBeenCalledWith({ codec: 'h264', quality: 'high', scale: 1 });
  });

  it('offers the rendered file as a named download', () => {
    renderControls({
      state: 'done',
      progress: 1,
      download: { url: 'blob:rendered', fileName: 'word-build.mp4' },
    });
    const link = screen.getByRole('link', { name: 'Download' });
    expect(link).toHaveAttribute('href', 'blob:rendered');
    expect(link).toHaveAttribute('download', 'word-build.mp4');
  });

  it('shows why a render failed', () => {
    renderControls({ state: 'error', error: 'Encoder unavailable' });
    expect(screen.getByText('Render failed. Encoder unavailable')).toBeInTheDocument();
  });
});

const COLOR = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const clip = (text: string, max = 48): string =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

export const AgentValue = ({ value }: { value: unknown }) => {
  if (value === undefined) {
    return <span className="text-muted-foreground italic">unset</span>;
  }
  if (typeof value === 'string' && COLOR.test(value)) {
    return (
      <span className="inline-flex items-center gap-1 font-mono">
        <span className="size-3 shrink-0 rounded-sm border" style={{ backgroundColor: value }} />
        {value}
      </span>
    );
  }
  if (typeof value === 'string') {
    return <span className="break-words">“{clip(value)}”</span>;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return <span className="font-mono">{String(value)}</span>;
  }
  return <span className="break-all font-mono">{clip(JSON.stringify(value))}</span>;
};

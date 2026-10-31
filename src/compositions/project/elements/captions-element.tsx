import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CaptionsElement } from '@/project';
export const CaptionsElementView = ({ element }: { element: CaptionsElement }) => {
  const frame = useCurrentFrame() + (element.sourceFrom ?? 0);
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const active = element.words.findIndex((word) => ms >= word.startMs && ms < word.endMs);
  if (active < 0) {
    return null;
  }
  const start = Math.floor(active / 6) * 6;
  const words = element.words.slice(start, start + 6);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', padding: '0 6% 12%' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 14,
          background: element.background,
          padding: '16px 24px',
          borderRadius: 18,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          fontSize: element.fontSize,
          lineHeight: 1.2,
        }}
      >
        {words.map((word, index) => (
          <span
            key={`${word.startMs}-${index}`}
            style={{
              color: start + index === active ? element.activeColor : element.color,
              transform: start + index === active ? 'scale(1.08)' : 'none',
            }}
          >
            {word.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

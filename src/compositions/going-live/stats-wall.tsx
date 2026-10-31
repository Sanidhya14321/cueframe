import { AbsoluteFill } from 'remotion';
import type { GoingLiveTeaserProps } from '@/schemas';
import { progress, splitLines } from './beat';
import { teaserFont } from './fonts';

type Wall = GoingLiveTeaserProps['wall'];

const StatsHalf = ({ wall, accent, shift }: { wall: Wall; accent: string; shift: number }) => {
  const stats = wall.stats.split(',');
  const labels = wall.statLabels.split(',');
  const body = splitLines(wall.body);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 960,
        overflow: 'hidden',
        fontFamily: teaserFont,
        background: `linear-gradient(180deg, ${wall.panel} 0%, ${wall.panelEdge} 100%)`,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-shift}px)` }}>
        <div
          style={{
            position: 'absolute',
            left: -40,
            right: -40,
            top: 360,
            height: 190,
            display: 'flex',
            borderBottom: `2px solid ${wall.rim}55`,
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={`${index}:${stat}`}
              style={{
                flex: 1,
                borderLeft: index === 0 ? undefined : `2px solid ${wall.rim}88`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  fontSize: 76,
                  fontWeight: 300,
                  color: 'transparent',
                  WebkitTextStroke: `2px ${accent}`,
                  opacity: 0.8,
                }}
              >
                {stat}
              </div>
              <div style={{ fontSize: 14, color: wall.ink, opacity: 0.45 }}>
                {labels[index] ?? ''}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 640,
            fontSize: 30,
            fontWeight: 400,
            lineHeight: 1.4,
            whiteSpace: 'pre',
            color: wall.ink,
            opacity: 0.5,
            filter: 'blur(1px)',
          }}
        >
          {body.map((line, index) => (
            <div key={`${index}:${line}`} style={{ color: index === 0 ? accent : wall.ink }}>
              {line}
            </div>
          ))}
        </div>
        {[
          [150, 830, 120],
          [880, 760, 90],
          [620, 1040, 110],
        ].map(([x, y, r]) => (
          <div
            key={`${x}:${y}`}
            style={{
              position: 'absolute',
              left: (x ?? 0) - (r ?? 0),
              top: (y ?? 0) - (r ?? 0) / 2,
              width: (r ?? 0) * 2,
              height: r,
              borderRadius: '50%',
              background: `radial-gradient(closest-side, ${wall.bokeh}, transparent)`,
              opacity: 0.55,
              filter: 'blur(10px)',
            }}
          />
        ))}
        {[880, 1100, 1250].map((top) => (
          <div
            key={top}
            style={{
              position: 'absolute',
              left: 90,
              top,
              width: 620,
              height: 16,
              borderRadius: 8,
              background: wall.rim,
              opacity: 0.22,
              filter: 'blur(3px)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const StatsWall = ({
  frame,
  fadeIn,
  start,
  fadeStart,
  end,
  wall,
  accent,
}: {
  frame: number;
  fadeIn: number;
  start: number;
  fadeStart: number;
  end: number;
  wall: Wall;
  accent: string;
}) => {
  if (frame < fadeIn || frame >= end) {
    return null;
  }
  const travel = progress(frame, fadeIn, end);
  const shift = travel * wall.scroll;
  const opened = progress(frame, start, fadeStart);
  const inset = 18 * (1 - opened);
  const rim = 1 - opened;
  return (
    <AbsoluteFill style={{ opacity: progress(frame, fadeIn, start) ** 2 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 22% at 50% 0%, ${wall.rim}, transparent 100%), radial-gradient(ellipse 70% 22% at 50% 100%, ${wall.rim}, transparent 100%)`,
          opacity: rim,
        }}
      />
      <AbsoluteFill style={{ clipPath: `inset(${inset.toFixed(3)}% 0)` }}>
        <StatsHalf wall={wall} accent={accent} shift={shift} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 960,
            height: 960,
            transform: 'scaleY(-1)',
          }}
        >
          <StatsHalf wall={wall} accent={accent} shift={shift} />
        </div>
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

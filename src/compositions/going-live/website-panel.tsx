import { AbsoluteFill } from 'remotion';
import type { GoingLiveTeaserProps } from '@/schemas';
import { splitLines } from './beat';
import { teaserFont } from './fonts';

type Wall = GoingLiveTeaserProps['wall'];

const RIBBON_TOP = 'M 560 -40 A 470 470 0 0 0 1120 470';
const RIBBON_TOP_INNER = 'M 700 -40 A 340 340 0 0 0 1120 330';
const RIBBON_LOW = 'M -40 1420 A 520 520 0 0 1 420 1960';

const Ribbon = ({ path, color, width }: { path: string; color: string; width: number }) => (
  <>
    <path d={path} fill="none" stroke={color} strokeWidth={width * 5} opacity={0.12} />
    <path d={path} fill="none" stroke={color} strokeWidth={width * 2} opacity={0.3} />
    <path d={path} fill="none" stroke={color} strokeWidth={width} opacity={0.8} />
  </>
);

export const WebsitePanel = ({ wall, accent }: { wall: Wall; accent: string }) => {
  const headline = splitLines(wall.headline);
  const body = splitLines(wall.body);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${wall.panel} 0%, ${wall.panelEdge} 100%)`,
        fontFamily: teaserFont,
      }}
    >
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0, filter: 'blur(5px)' }}
        aria-hidden="true"
      >
        <Ribbon path={RIBBON_TOP} color={accent} width={12} />
        <Ribbon path={RIBBON_TOP_INNER} color={accent} width={4} />
        <Ribbon path={RIBBON_LOW} color={accent} width={9} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: -150,
          top: 300,
          fontSize: 58,
          fontWeight: 500,
          lineHeight: 1.22,
          letterSpacing: '-0.01em',
          color: wall.ink,
          whiteSpace: 'pre',
          transform: 'rotate(-3deg)',
          transformOrigin: '0 0',
        }}
      >
        {headline.map((line, index) => (
          <div key={`${index}:${line}`} style={{ color: index === 1 ? accent : wall.ink }}>
            {line}
          </div>
        ))}
      </div>
      {[640, 1260].map((top) => (
        <div
          key={top}
          style={{
            position: 'absolute',
            left: 120,
            top,
            fontSize: 26,
            fontWeight: 500,
            lineHeight: 1.5,
            color: wall.ink,
            opacity: 0.55,
            whiteSpace: 'pre',
            filter: 'blur(1.5px)',
            transform: 'rotate(-3deg)',
          }}
        >
          {body.join('\n')}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          right: 60,
          bottom: 140,
          fontSize: 34,
          fontWeight: 600,
          color: wall.ink,
          opacity: 0.35,
          filter: 'blur(4px)',
        }}
      >
        {body[0]?.split(' ').slice(0, 2).join(' ')}
      </div>
    </AbsoluteFill>
  );
};

export const BeamTexture = ({ wall }: { wall: Wall }) => (
  <AbsoluteFill style={{ background: wall.beam, fontFamily: teaserFont }}>
    {[
      [140, 600, 220],
      [380, 690, 160],
      [180, 1180, 260],
      [520, 1300, 190],
      [260, 1460, 230],
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
          background: `radial-gradient(closest-side, ${wall.rim}55, transparent)`,
        }}
      />
    ))}
    {[650, 1290].map((top) => (
      <div
        key={top}
        style={{
          position: 'absolute',
          left: 420,
          top,
          fontSize: 22,
          fontWeight: 500,
          color: wall.rim,
          opacity: 0.8,
          filter: 'blur(1.2px)',
          transform: 'rotate(177deg)',
          whiteSpace: 'pre',
        }}
      >
        {splitLines(wall.body).join('\n')}
      </div>
    ))}
  </AbsoluteFill>
);

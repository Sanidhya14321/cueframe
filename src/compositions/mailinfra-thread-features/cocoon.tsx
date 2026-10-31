import type { ReactNode } from 'react';
import type { ThreadTitle, ThreadWeb } from '@/schemas';
import {
  type CocoonShape,
  dewDrops,
  hangingEnvelopes,
  meridianPath,
  type SideWebShape,
} from './cocoon-geometry';
import { mixHex } from './color';
import { CaughtEnvelope } from './envelopes';

const CocoonCanvas = ({ shape, children }: { shape: CocoonShape; children: ReactNode }) => (
  <svg
    aria-hidden="true"
    width={shape.halfWidth * 2}
    height={shape.halfHeight * 2}
    viewBox={`${-shape.halfWidth} ${-shape.halfHeight} ${shape.halfWidth * 2} ${shape.halfHeight * 2}`}
    style={{ position: 'absolute', left: -shape.halfWidth, top: -shape.halfHeight }}
  >
    {children}
  </svg>
);

export const BackWeb = ({
  shape,
  sideWeb,
  item,
  index,
  web,
  frame,
}: {
  shape: CocoonShape;
  sideWeb: SideWebShape | null;
  item: ThreadTitle;
  index: number;
  web: ThreadWeb;
  frame: number;
}) => {
  const shine = mixHex(web.silk, '#ffffff', 0.7);
  const hanging = hangingEnvelopes(shape, sideWeb, item, index);
  return (
    <CocoonCanvas shape={shape}>
      {sideWeb === null ? null : (
        <g fill="none" stroke={web.silk} strokeWidth={1.2} opacity={0.5}>
          {sideWeb.spokes.map((spoke) => (
            <path
              key={`${spoke.x.toFixed(1)}-${spoke.y.toFixed(1)}`}
              d={`M${sideWeb.hub.x.toFixed(1)} ${sideWeb.hub.y.toFixed(1)}L${spoke.x.toFixed(1)} ${spoke.y.toFixed(1)}`}
            />
          ))}
          {sideWeb.rings.map((ring) => (
            <path key={ring} d={ring} strokeWidth={1} />
          ))}
          {sideWeb.anchors.map((anchor) => (
            <path key={anchor} d={anchor} />
          ))}
        </g>
      )}
      <g fill="none" stroke={web.silk} strokeLinecap="butt">
        {shape.strands.map((strand, step) => (
          <path
            key={`${strand.kx.toFixed(2)}-${step}`}
            d={meridianPath(shape, strand)}
            strokeWidth={1.4}
            opacity={0.38 + 0.3 * (Math.abs(strand.kx) / shape.rx)}
          />
        ))}
        {shape.links.map((link) => (
          <path key={link} d={link} strokeWidth={1} opacity={0.4} />
        ))}
      </g>
      {item.dew
        ? dewDrops(shape, index).map((drop, step) => (
            <g key={`${drop.x.toFixed(1)}-${drop.y.toFixed(1)}`}>
              <circle cx={drop.x} cy={drop.y} r={drop.r} fill={web.silk} opacity={0.55} />
              <circle
                cx={drop.x - drop.r * 0.3}
                cy={drop.y - drop.r * 0.35}
                r={drop.r * 0.32}
                fill={shine}
                opacity={0.55 + 0.45 * Math.sin(frame / 9 + step * 1.7)}
              />
            </g>
          ))
        : null}
      {hanging.map((hang, step) => {
        const angle = Math.sin(frame / (24 + hang.sway * 10) + step * 2) * (3 + hang.sway * 3);
        return (
          <g key={`${hang.at.x.toFixed(1)}-${hang.at.y.toFixed(1)}`}>
            {hang.anchor === hang.at ? null : (
              <path
                d={`M${hang.anchor.x.toFixed(1)} ${hang.anchor.y.toFixed(1)}L${hang.at.x.toFixed(1)} ${(hang.at.y - 26).toFixed(1)}`}
                stroke={web.silk}
                strokeWidth={1.3}
                opacity={0.7}
              />
            )}
            <CaughtEnvelope
              x={hang.at.x}
              y={hang.at.y}
              angle={angle + (hang.sway - 0.5) * 30}
              web={web}
            />
          </g>
        );
      })}
    </CocoonCanvas>
  );
};

export const FrontWraps = ({
  width,
  height,
  progress,
  web,
}: {
  width: number;
  height: number;
  progress: number;
  web: ThreadWeb;
}) => {
  const half = width / 2 + 54;
  const rows = [
    { from: -height * 0.5, to: height * 0.12, sag: 26 },
    { from: height * 0.36, to: -height * 0.38, sag: -14 },
    { from: height * 0.1, to: height * 0.55, sag: 20 },
  ];
  const boxW = half + 40;
  const boxH = height / 2 + 80;
  return (
    <svg
      aria-hidden="true"
      width={boxW * 2}
      height={boxH * 2}
      viewBox={`${-boxW} ${-boxH} ${boxW * 2} ${boxH * 2}`}
      style={{ position: 'absolute', left: -boxW, top: -boxH }}
    >
      {rows.map((row, step) => {
        const reveal = Math.min(1, Math.max(0, progress * 1.6 - step * 0.3));
        return (
          <path
            key={`${row.from.toFixed(1)}-${row.to.toFixed(1)}`}
            d={`M${-half} ${row.from.toFixed(1)}Q0 ${((row.from + row.to) / 2 + row.sag).toFixed(1)} ${half} ${row.to.toFixed(1)}`}
            fill="none"
            stroke={web.silk}
            strokeWidth={1.3}
            strokeLinecap="butt"
            pathLength={1}
            strokeDasharray={`${reveal.toFixed(4)} 2`}
            opacity={0.5 * Math.min(1, reveal * 6)}
          />
        );
      })}
    </svg>
  );
};

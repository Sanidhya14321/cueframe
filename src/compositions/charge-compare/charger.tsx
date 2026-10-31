import { useId } from 'react';
import type { ChargeCompareProps } from '@/schemas';

type ChargerProps = {
  charger: ChargeCompareProps['charger'];
  look: ChargeCompareProps['look'];
  centerX: number;
  top: number;
};

const CORD_LENGTH = 2400;

export const Charger = ({ charger, look, centerX, top }: ChargerProps) => {
  const id = useId().replace(/:/g, '');
  const { plugWidth, plugHeight, housingWidth, housingHeight, reliefWidth, reliefHeight } = charger;
  const width = housingWidth + 4;
  const mid = width / 2;
  const housingTop = plugHeight;
  const housingBottom = housingTop + housingHeight;
  const reliefBottom = housingBottom + reliefHeight;
  const corner = housingWidth * 0.16;
  const hl = mid - housingWidth / 2;
  const hr = mid + housingWidth / 2;
  const rl = mid - reliefWidth / 2;
  const rr = mid + reliefWidth / 2;
  const cl = mid - charger.cordWidth / 2;
  const cr = mid + charger.cordWidth / 2;
  const neck = reliefHeight * 0.45;
  const body = [
    `M ${hl} ${housingTop + corner}`,
    `Q ${hl} ${housingTop} ${hl + corner} ${housingTop}`,
    `H ${hr - corner}`,
    `Q ${hr} ${housingTop} ${hr} ${housingTop + corner}`,
    `V ${housingBottom}`,
    `C ${hr} ${housingBottom + neck * 0.55} ${rr} ${housingBottom + neck * 0.45} ${rr} ${housingBottom + neck}`,
    `V ${reliefBottom - reliefHeight * 0.12}`,
    `C ${rr} ${reliefBottom - reliefHeight * 0.04} ${cr} ${reliefBottom - reliefHeight * 0.04} ${cr} ${reliefBottom}`,
    `V ${reliefBottom + CORD_LENGTH}`,
    `H ${cl}`,
    `V ${reliefBottom}`,
    `C ${cl} ${reliefBottom - reliefHeight * 0.04} ${rl} ${reliefBottom - reliefHeight * 0.04} ${rl} ${reliefBottom - reliefHeight * 0.12}`,
    `V ${housingBottom + neck}`,
    `C ${rl} ${housingBottom + neck * 0.45} ${hl} ${housingBottom + neck * 0.55} ${hl} ${housingBottom}`,
    'Z',
  ].join(' ');
  return (
    <svg
      width={width}
      height={reliefBottom + CORD_LENGTH}
      viewBox={`0 0 ${width} ${reliefBottom + CORD_LENGTH}`}
      style={{ position: 'absolute', left: centerX - mid, top }}
      role="presentation"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={look.cableShade} />
          <stop offset="0.3" stopColor={look.cable} />
          <stop offset="0.62" stopColor={look.cable} />
          <stop offset="1" stopColor={look.cableShade} />
        </linearGradient>
        <linearGradient id={`${id}-plug`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={look.cableShade} />
          <stop offset="0.45" stopColor={look.plug} />
          <stop offset="1" stopColor={look.cableShade} />
        </linearGradient>
      </defs>
      <rect
        x={mid - plugWidth / 2}
        y={0}
        width={plugWidth}
        height={plugHeight + corner}
        rx={plugWidth * 0.12}
        fill={`url(#${id}-plug)`}
      />
      <path d={body} fill={`url(#${id}-body)`} />
    </svg>
  );
};

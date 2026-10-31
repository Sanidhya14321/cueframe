import { AbsoluteFill } from 'remotion';
import type { BatteryChargeSuccessProps } from '@/schemas';
import { labelFont } from './cable-path';
import { mixHex, rgba } from './curves';

const PATTERN = 640;

export const GlowTitle = ({
  props,
  frame,
  duration,
  phase,
}: {
  props: BatteryChargeSuccessProps;
  frame: number;
  duration: number;
  phase: number;
}) => {
  const { title } = props;
  const base = mixHex(title.warm, title.cool, phase);
  const light = mixHex(title.warmLight, title.coolLight, phase);
  const travel = ((frame / duration) * title.sweeps * PATTERN) % PATTERN;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: title.y,
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: labelFont,
            fontWeight: 700,
            fontSize: title.size,
            lineHeight: 1.2,
            whiteSpace: 'pre',
            letterSpacing: `${title.tracking}em`,
            paddingLeft: `${title.tracking}em`,
            textTransform: title.uppercase ? 'uppercase' : 'none',
            color: 'transparent',
            backgroundImage: `linear-gradient(90deg, ${base} 0px, ${light} ${PATTERN * 0.25}px, ${title.highlight} ${PATTERN * 0.5}px, ${light} ${PATTERN * 0.75}px, ${base} ${PATTERN}px)`,
            backgroundSize: `${PATTERN}px 100%`,
            backgroundRepeat: 'repeat-x',
            backgroundPositionX: `${travel.toFixed(2)}px`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            filter: `drop-shadow(0 0 6px ${rgba(base, 0.75 * title.glow)}) drop-shadow(0 0 22px ${rgba(base, 0.45 * title.glow)})`,
          }}
        >
          {props.copy.title}
        </div>
      </div>
    </AbsoluteFill>
  );
};

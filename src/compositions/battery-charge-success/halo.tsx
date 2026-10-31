import type { BatteryChargeSuccessProps } from '@/schemas';
import type { BatteryBox } from './choreography';
import { clamp01, mixHex, mixThree, smoothstep } from './curves';

export const BatteryHalo = ({
  props,
  box,
  level,
  phase,
}: {
  props: BatteryChargeSuccessProps;
  box: BatteryBox;
  level: number;
  phase: number;
}) => {
  const { charge, battery } = props;
  const glowColor = mixThree(charge.empty, charge.mid, charge.charged, phase);
  const bottomColor = mixHex(charge.liquidBottomLow, charge.liquidBottomFull, level);
  const color = mixHex(glowColor, bottomColor, smoothstep(0.02, 0.4, level));
  const strength = clamp01(charge.halo * (0.22 + 0.55 * level));
  return (
    <div
      style={{
        position: 'absolute',
        left: box.left - 10,
        top: box.top + box.height * 0.2,
        width: box.width + 20,
        height: box.height * 0.84,
        borderRadius: battery.radius,
        background: color,
        opacity: strength,
        filter: 'blur(56px)',
      }}
    />
  );
};

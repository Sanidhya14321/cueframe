import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type ChargeCompareProps,
  chargeCompareDefaults,
  chargeCompareMeta,
  chargeCompareSchema,
} from '@/schemas';
import { Badge } from '../../charge-compare/badge';
import { CompareBoard } from '../../charge-compare/compare-board';
import { EndCard } from '../../charge-compare/end-card';
import { logoPose, ramp } from '../../charge-compare/motion';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const WIDTH = 1080;
const HEIGHT = 1920;

const ChargeCompare = (props: ChargeCompareProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { look, copy, layout, timing, logo } = props;
  const pose = logoPose(frame, logo);
  const logoShown = ramp(frame, logo.appear.frame, timing.popFrames);
  const logoSize = pose.size * WIDTH;
  const cornerShown = 1 - ramp(frame, timing.cornerFadeStart, timing.cornerFadeFrames);
  return (
    <TransitionFrame motion={props.motion}>
      {look.showBackdrop ? <AbsoluteFill style={{ background: look.background }} /> : null}
      <CompareBoard {...props} frame={frame} />
      {cornerShown > 0 ? (
        <Badge
          look={look}
          copy={copy}
          size={layout.cornerLogoSize}
          style={{
            left: layout.cornerLogoX - layout.cornerLogoSize / 2,
            top: layout.cornerLogoY - layout.cornerLogoSize / 2,
            opacity: cornerShown,
          }}
        />
      ) : null}
      {logoShown > 0 ? (
        <Badge
          look={look}
          copy={copy}
          size={logoSize}
          style={{
            left: pose.x * WIDTH - logoSize / 2,
            top: pose.y * HEIGHT - logoSize / 2,
            opacity: logoShown,
            transform: `scale(${(0.82 + 0.18 * logoShown).toFixed(4)})`,
          }}
        />
      ) : null}
      <EndCard look={look} copy={copy} layout={layout} timing={timing} frame={frame} />
    </TransitionFrame>
  );
};

export const chargeCompareScene: SceneModule = {
  id: 'charge-compare',
  component: ChargeCompare,
  render: (key) => (
    <Composition
      key={key}
      id="charge-compare"
      component={ChargeCompare}
      schema={chargeCompareSchema}
      defaultProps={chargeCompareDefaults}
      durationInFrames={chargeCompareMeta.durationInFrames}
      fps={chargeCompareMeta.fps}
      width={chargeCompareMeta.width}
      height={chargeCompareMeta.height}
    />
  ),
};

import { interpolate } from 'remotion';
import type { ChargeCompareProps } from '@/schemas';
import { Battery } from './battery';
import { Charger } from './charger';
import { CHARGE_FONTS } from './fonts';
import { chargeColor, chargeProgress, ramp, wipeReach } from './motion';
import { PhoneOutline } from './phone-outline';

type CompareBoardProps = ChargeCompareProps & { frame: number };

const WIDTH = 1080;
const HEIGHT = 1920;

const headlineParts = (headline: string, highlight: string): [string, string, string] => {
  const at = highlight === '' ? -1 : headline.indexOf(highlight);
  if (at < 0) {
    return [headline, '', ''];
  }
  return [headline.slice(0, at), highlight, headline.slice(at + highlight.length)];
};

const wipeMask = (frame: number, timing: ChargeCompareProps['timing']): string | undefined => {
  const reach = wipeReach(frame, timing);
  if (reach <= 0) {
    return undefined;
  }
  const centerY = timing.wipeCenterY;
  const farY = Math.max(centerY, HEIGHT - centerY) / timing.wipeStretch;
  const radiusX = Math.max(0.5, reach * Math.hypot(WIDTH / 2, farY) * 1.04);
  const radiusY = radiusX * timing.wipeStretch;
  return `radial-gradient(${radiusX.toFixed(2)}px ${radiusY.toFixed(2)}px at ${WIDTH / 2}px ${centerY}px, transparent 0, transparent calc(100% - 1.5px), #000 100%)`;
};

export const CompareBoard = ({
  look,
  copy,
  layout,
  battery,
  charger,
  timing,
  frame,
}: CompareBoardProps) => {
  const [lead, highlight, tail] = headlineParts(copy.headline, copy.highlight);
  const centers = [WIDTH / 2 - layout.phoneSpread, WIDTH / 2 + layout.phoneSpread];
  const labels = [copy.leftLabel, copy.rightLabel];
  const phoneBottom = layout.phoneTop + layout.phoneHeight;
  const plugTop = phoneBottom + charger.plugGap;
  const cableTop = interpolate(
    frame,
    [timing.cableStart, Math.max(timing.cableStart + 1, timing.plugFrame)],
    [HEIGHT + 2, plugTop],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const batteryShown = ramp(frame, timing.plugFrame, timing.popFrames);
  const progress = chargeProgress(frame, timing);
  const charged = battery.emptyLevel + (battery.fullLevel - battery.emptyLevel) * progress;
  const levels = [battery.emptyLevel, charged];
  const fills = [chargeColor(0, battery.stops), chargeColor(progress, battery.stops)];
  const mask = wipeMask(frame, timing);
  const boltShown = ramp(frame, timing.chargeStart, battery.boltFrames);
  const glowX = centers[1] ?? WIDTH / 2;
  const glowY = layout.phoneTop + layout.phoneHeight / 2;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      {progress > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: progress * layout.glowStrength,
            background: `radial-gradient(circle ${layout.glowRadius}px at ${glowX}px ${glowY}px, ${look.glow} 0%, ${look.glow}66 35%, ${look.glow}00 100%)`,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: WIDTH,
          top: layout.headlineY - layout.headlineSize * 0.6,
          textAlign: 'center',
          fontFamily: CHARGE_FONTS.display,
          fontWeight: 800,
          fontSize: layout.headlineSize,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          color: look.headlineInk,
          whiteSpace: 'pre',
        }}
      >
        {lead}
        <span
          style={{
            color: 'transparent',
            backgroundImage: `linear-gradient(90deg, ${look.highlightFrom}, ${look.highlightTo})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          {highlight}
        </span>
        {tail}
      </div>
      {centers.map((center, index) => (
        <div
          key={`label-${center}`}
          style={{
            position: 'absolute',
            left: center - 300,
            width: 600,
            top: layout.labelY - layout.labelSize * 0.6,
            textAlign: 'center',
            fontFamily: CHARGE_FONTS.display,
            fontWeight: 600,
            fontSize: layout.labelSize,
            letterSpacing: `${layout.labelSpacing}em`,
            paddingLeft: `${layout.labelSpacing}em`,
            lineHeight: 1.2,
            color: index === 1 ? look.chargedLabelInk : look.labelInk,
            whiteSpace: 'pre',
          }}
        >
          {labels[index]}
        </div>
      ))}
      {centers.map((center) => (
        <PhoneOutline
          key={`phone-${center}`}
          look={look}
          layout={layout}
          left={center - layout.phoneWidth / 2}
        />
      ))}
      {batteryShown > 0
        ? centers.map((center, index) => (
            <Battery
              key={`battery-${center}`}
              battery={battery}
              outline={look.batteryOutline}
              body={look.phoneScreen}
              boltColor={look.bolt}
              boltShown={index === 1 ? boltShown : 0}
              level={levels[index] ?? 0}
              fill={fills[index] ?? look.batteryOutline}
              centerX={center}
              bottom={phoneBottom - battery.bottomGap}
              opacity={batteryShown}
            />
          ))
        : null}
      {frame >= timing.cableStart
        ? centers.map((center) => (
            <Charger
              key={`charger-${center}`}
              charger={charger}
              look={look}
              centerX={center}
              top={cableTop}
            />
          ))
        : null}
    </div>
  );
};

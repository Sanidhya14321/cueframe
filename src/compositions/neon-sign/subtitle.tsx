import type { NeonSignFlickerProps } from '@/schemas';
import { labelFont } from './fonts';

export const Subtitle = ({
  text,
  subtitle,
}: {
  text: string;
  subtitle: NeonSignFlickerProps['subtitle'];
}) => (
  <div
    style={{
      position: 'absolute',
      left: subtitle.centerX,
      top: subtitle.top,
      transform: 'translateX(-50%)',
      fontFamily: labelFont,
      fontWeight: subtitle.weight,
      fontSize: subtitle.size,
      lineHeight: subtitle.lineHeight,
      letterSpacing: `${subtitle.tracking}em`,
      color: subtitle.color,
      textAlign: 'center',
      whiteSpace: 'pre',
      textShadow: `0 ${subtitle.size * 0.06}px ${subtitle.size * 0.14}px rgba(0,0,0,${subtitle.shadow})`,
    }}
  >
    {text}
  </div>
);

import { random } from 'remotion';
import type { MailinfraInboxWebProps } from '@/schemas';
import type { Camera } from './timeline';

export const Bokeh = ({
  frame,
  width,
  height,
  camera,
  props,
  idPrefix,
}: {
  frame: number;
  width: number;
  height: number;
  camera: Camera;
  props: MailinfraInboxWebProps;
  idPrefix: string;
}) => {
  const { bokeh } = props;
  const count = Math.round(bokeh.count);
  if (count <= 0 || bokeh.opacity <= 0) {
    return null;
  }
  const unit = Math.min(width, height) / 1080;
  const shiftX = -camera.x * camera.scale * 0.16;
  const shiftY = -camera.y * camera.scale * 0.16;
  const zoom = 1 + Math.log(camera.scale / props.camera.webZoom) * 0.14;
  const discs = Array.from({ length: count }, (_, index) => {
    const key = `inbox-web-bokeh-${props.web.seed}-${index}`;
    const phase = random(`${key}-phase`) * Math.PI * 2;
    return {
      index,
      x: (random(`${key}-x`) * 1.3 - 0.15) * width + Math.sin(frame / 70 + phase) * 36 * unit,
      y: (random(`${key}-y`) * 1.5 - 0.25) * height + Math.cos(frame / 85 + phase) * 24 * unit,
      r: (45 + random(`${key}-r`) * 95) * unit,
      alt: random(`${key}-tone`) > 0.5,
      strength: 0.4 + random(`${key}-strength`) * 0.6,
    };
  });
  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <defs>
        {[
          { id: `${idPrefix}-bokeh`, color: bokeh.color },
          { id: `${idPrefix}-bokeh-alt`, color: bokeh.colorAlt },
        ].map((tone) => (
          <radialGradient key={tone.id} id={tone.id}>
            <stop offset="0" stopColor={tone.color} stopOpacity={0.9} />
            <stop offset="0.55" stopColor={tone.color} stopOpacity={0.55} />
            <stop offset="0.85" stopColor={tone.color} stopOpacity={0.12} />
            <stop offset="1" stopColor={tone.color} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      <g
        transform={`translate(${(width / 2 + shiftX).toFixed(2)} ${(height / 2 + shiftY).toFixed(2)}) scale(${zoom.toFixed(4)}) translate(${(-width / 2).toFixed(2)} ${(-height / 2).toFixed(2)})`}
      >
        {discs.map((disc) => (
          <circle
            key={disc.index}
            cx={disc.x}
            cy={disc.y}
            r={disc.r}
            fill={`url(#${idPrefix}-bokeh${disc.alt ? '-alt' : ''})`}
            opacity={bokeh.opacity * disc.strength}
          />
        ))}
      </g>
    </svg>
  );
};

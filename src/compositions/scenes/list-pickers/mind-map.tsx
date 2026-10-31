import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type MindMapProps, mindMapDefaults, mindMapMeta, mindMapSchema } from '@/schemas';
import { NodePill } from '../../pickers/mind-map-node';
import { PickerLayer } from '../../pickers/picker-layer';
import { pixelProgress, stepState, wrapIndex } from '../../pickers/steps';
import { pickerFonts } from '../../promo/fonts';
import { pixelTween, settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const FADE_SPAN = 0.9;

const smoothstep = (value: number): number => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

const shadowTint = (hex: string, alpha: number): string => {
  const channel = (start: number): number => Number.parseInt(hex.slice(start, start + 2), 16);
  return `rgba(${channel(1)}, ${channel(3)}, ${channel(5)}, ${alpha.toFixed(3)})`;
};

const glass = (fill: string, alpha: number): string =>
  `color-mix(in oklab, ${fill} ${(alpha * 100).toFixed(1)}%, transparent)`;

const MindMap = ({
  root,
  nodes,
  font,
  weight,
  type,
  layout,
  style,
  lines,
  entrance,
  timing,
  aura,
  look,
  motion,
}: MindMapProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const family = pickerFonts[font];
  const pitch = Math.round(layout.pitch);
  const state = stepState(frame, timing);
  const progress = pixelProgress(state, timing, pitch) / pitch;
  const circleX = layout.arcX + layout.radius;
  const reveal = tween(frame, [0, entrance.frames], [0, 1], settle);
  const rootRise = pixelTween(frame, [0, entrance.frames], [40, 0], settle);
  const lineDraw = tween(frame, [entrance.frames * 0.4, entrance.frames * 1.2], [0, 1], smooth);
  const lineStart = layout.rootX + 240;
  const lineEnd = layout.arcX - 18;
  const visibleSlots = Math.ceil(style.reach + FADE_SPAN);
  const first = Math.floor(progress) - visibleSlots;
  const slots = Array.from({ length: visibleSlots * 2 + 2 }, (_, offset) => first + offset);
  const shadow = `0 14px 34px ${shadowTint(style.shadowColor, style.shadow * 0.45)}`;
  return (
    <PickerLayer look={look} aura={aura} motion={motion} focusX={60}>
      <AbsoluteFill>
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden="true"
        >
          <circle
            cx={circleX}
            cy={layout.centerY}
            r={layout.radius}
            fill="none"
            stroke={lines.color}
            strokeWidth={lines.width}
            strokeLinecap="round"
            strokeDasharray={`${lines.dash} ${lines.gap}`}
            strokeDashoffset={(progress * pitch).toFixed(2)}
            opacity={lines.opacity * tween(frame, [6, entrance.frames + 10], [0, 1], smooth)}
          />
          <line
            x1={lineStart}
            y1={layout.centerY}
            x2={lineStart + (lineEnd - lineStart) * lineDraw}
            y2={layout.centerY}
            stroke={lines.color}
            strokeWidth={lines.width}
            strokeLinecap="round"
            opacity={lines.opacity * Math.min(1, lineDraw * 4)}
          />
        </svg>
        {slots.map((slot) => {
          const node = nodes[wrapIndex(slot, nodes.length)];
          if (node === undefined) {
            return null;
          }
          const offset = slot - progress;
          const distance = Math.abs(offset);
          const angle = (offset * pitch) / layout.radius;
          const x = Math.round(circleX - layout.radius * Math.cos(angle));
          const y = Math.round(layout.centerY + layout.radius * Math.sin(angle));
          const focus = smoothstep(1 - distance);
          const order = Math.abs(slot - timing.start);
          const start = 4 + order * entrance.stagger;
          const appear = tween(frame, [start, start + entrance.frames], [0, 1], settle);
          const rise = pixelTween(frame, [start, start + entrance.frames], [36, 0], settle);
          const fade = 1 - tween(distance, [style.reach, style.reach + FADE_SPAN], [0, 1], smooth);
          const dim = 1 - style.sideFade * Math.min(1, distance);
          const opacity = appear * fade * dim;
          if (opacity <= 0.001) {
            return null;
          }
          const fill = `color-mix(in oklab, ${style.activeFill} ${(focus * 100).toFixed(1)}%, ${style.nodeFill})`;
          const alpha = style.nodeOpacity + (style.activeOpacity - style.nodeOpacity) * focus;
          const scale = 1 + (style.activeScale - 1) * focus;
          return (
            <div
              key={slot}
              style={{
                position: 'absolute',
                left: x,
                top: y + rise,
                opacity,
                transform: `translate(-${(layout.anchor * 100).toFixed(1)}%, -50%) scale(${scale.toFixed(4)})`,
                transformOrigin: `${(layout.anchor * 100).toFixed(1)}% 50%`,
              }}
            >
              <NodePill
                node={node}
                family={family}
                weight={weight}
                titleSize={type.title}
                subtitleSize={type.subtitle}
                ink={type.ink}
                subtitleInk={type.subtitleInk}
                showIcon={style.showIcon}
                iconColor={style.iconColor}
                padding={layout.padding}
                style={{
                  background: glass(fill, alpha),
                  border: `2px solid ${glass(style.border, 0.55 + 0.25 * focus)}`,
                  boxShadow: `inset 0 0 22px rgba(255, 255, 255, 0.28), ${shadow}`,
                }}
              />
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: layout.rootX,
            top: layout.centerY + rootRise,
            opacity: reveal,
            transform: 'translateY(-50%)',
          }}
        >
          <NodePill
            node={root}
            family={family}
            weight={weight}
            titleSize={type.rootTitle}
            subtitleSize={type.rootSubtitle}
            ink={type.ink}
            subtitleInk={type.subtitleInk}
            showIcon={style.showIcon}
            iconColor={style.iconColor}
            padding={layout.padding * 1.2}
            style={{
              background: `linear-gradient(180deg, color-mix(in oklab, ${style.rootFill}, #ffffff 14%), ${style.rootFill})`,
              border: `2px solid ${glass(style.border, 0.6)}`,
              boxShadow: `inset 0 0 26px rgba(255, 255, 255, 0.3), ${shadow}`,
            }}
          />
        </div>
      </AbsoluteFill>
    </PickerLayer>
  );
};

export const mindMapScene: SceneModule = {
  id: 'mind-map',
  component: MindMap,
  render: (key) => (
    <Composition
      key={key}
      id="mind-map"
      component={MindMap}
      schema={mindMapSchema}
      defaultProps={mindMapDefaults}
      durationInFrames={mindMapMeta.durationInFrames}
      fps={mindMapMeta.fps}
      width={mindMapMeta.width}
      height={mindMapMeta.height}
    />
  ),
};

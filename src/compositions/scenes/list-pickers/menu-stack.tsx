import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type MenuStackProps, menuStackDefaults, menuStackMeta, menuStackSchema } from '@/schemas';
import { PickerLayer } from '../../pickers/picker-layer';
import { wrapIndex } from '../../pickers/steps';
import {
  entranceOf,
  listOffset,
  listState,
  mixColor,
  visibleSlots,
} from '../../pickers/word-picker-slots';
import { pickerFonts } from '../../promo/fonts';
import { tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const ChevronIcon = ({ icon, opacity }: { icon: MenuStackProps['icon']; opacity: number }) => {
  const size = icon.size;
  const arm = size * 0.16;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flex: 'none', opacity }}
      aria-hidden="true"
    >
      <rect width={size} height={size} rx={icon.radius} fill={icon.color} />
      <polyline
        points={`${size / 2 - arm * 0.6},${size / 2 - arm} ${size / 2 + arm * 0.6},${size / 2} ${size / 2 - arm * 0.6},${size / 2 + arm}`}
        fill="none"
        stroke={icon.glyph}
        strokeWidth={icon.glyphStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Pointer = ({ pointer }: { pointer: MenuStackProps['pointer'] }) => (
  <svg
    width={pointer.width}
    height={pointer.height}
    viewBox={`0 0 ${pointer.width} ${pointer.height}`}
    aria-hidden="true"
  >
    <path
      d={`M0 0 L${pointer.width} ${pointer.height / 2} L0 ${pointer.height} L${pointer.width * pointer.notch} ${pointer.height / 2} Z`}
      fill={pointer.color}
      strokeLinejoin="round"
    />
  </svg>
);

const MenuStack = ({
  label,
  items,
  loop,
  stops,
  timing,
  entrance,
  type,
  layout,
  card,
  icon,
  pointer,
  aura,
  look,
  motion,
}: MenuStackProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width } = useVideoConfig();
  const state = listState(frame, timing, items.length, loop, stops);
  const offset = listOffset(state, timing, card.pitch);
  const pitch = Math.round(card.pitch);
  const centerY = Math.round(layout.centerY);
  const labelBox = Math.round(type.labelSize * 1.3);
  const lead = entranceOf(frame, { ...entrance, rise: 0 }, 0);
  const pointerSlide = Math.round((1 - lead.opacity) * -40);
  const stackedSlots = visibleSlots(state.progress, card.reach, items.length, loop)
    .map((slot) => {
      const along = slot * pitch - offset;
      const distance = Math.abs(along / pitch);
      return { slot, along, distance, depth: Math.round(1000 - distance * 100) };
    })
    .filter(({ distance }) => distance <= card.reach)
    .sort((a, b) => a.depth - b.depth);
  return (
    <PickerLayer look={look} aura={aura} motion={motion} focusX={(layout.cardX / width) * 100}>
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: layout.labelX,
            top: centerY - labelBox / 2,
            height: labelBox,
            lineHeight: `${labelBox}px`,
            fontFamily: pickerFonts[type.font],
            fontSize: type.labelSize,
            fontWeight: type.labelWeight,
            color: look.ink,
            whiteSpace: 'nowrap',
            opacity: lead.opacity,
          }}
        >
          {label}
        </div>
        {pointer.show ? (
          <div
            style={{
              position: 'absolute',
              left: layout.pointerX + pointerSlide,
              top: centerY - pointer.height / 2,
              opacity: lead.opacity,
            }}
          >
            <Pointer pointer={pointer} />
          </div>
        ) : null}
        {stackedSlots.map(({ slot, along, distance }) => {
          const enter = entranceOf(frame, entrance, Math.abs(slot - timing.start) + 1);
          const scale = Math.max(0.1, 1 - card.shrink * distance);
          const fade = tween(distance, [card.reach - card.fade, card.reach], [1, 0]);
          const visible = enter.opacity * fade;
          return (
            <div
              key={slot}
              style={{
                position: 'absolute',
                left: Math.round(layout.cardX - card.width / 2),
                top: centerY + along + enter.rise - card.height / 2,
                width: card.width,
                height: card.height,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: card.gap,
                paddingLeft: card.padding,
                borderRadius: card.radius,
                background: mixColor(card.veil, card.fill, visible),
                boxShadow: `0 ${card.shadowY}px ${card.shadowBlur}px rgba(0, 0, 0, ${(card.shadow * visible).toFixed(4)}), 0 2px 6px rgba(0, 0, 0, ${(card.shadow * 0.3 * visible).toFixed(4)})`,
                opacity: Math.min(1, visible * 4),
                transform: `scale(${scale.toFixed(4)})`,
              }}
            >
              {icon.show ? <ChevronIcon icon={icon} opacity={visible} /> : null}
              <span
                style={{
                  opacity: visible,
                  fontFamily: pickerFonts[type.font],
                  fontSize: type.size,
                  fontWeight: type.weight,
                  color: mixColor(look.ink, look.muted, (distance - 0.5) / 2.5),
                  whiteSpace: 'nowrap',
                }}
              >
                {items[wrapIndex(slot, items.length)]}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </PickerLayer>
  );
};

export const menuStackScene: SceneModule = {
  id: 'menu-stack',
  component: MenuStack,
  render: (key) => (
    <Composition
      key={key}
      id="menu-stack"
      component={MenuStack}
      schema={menuStackSchema}
      defaultProps={menuStackDefaults}
      durationInFrames={menuStackMeta.durationInFrames}
      fps={menuStackMeta.fps}
      width={menuStackMeta.width}
      height={menuStackMeta.height}
    />
  ),
};

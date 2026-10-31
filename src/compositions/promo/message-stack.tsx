import { useEffect, useMemo } from 'react';
import type { AriseMessage, MessageAriseProps } from '@/schemas';
import { resolveEasing } from '../kit/easing';
import {
  CARD_MARGIN_PX,
  CARD_PX,
  type CardLayout,
  type CardStyle,
  cardTexture,
  drawCard,
  layoutCard,
  useCardFont,
} from './message-card';
import { slitMaterial, updateSlit } from './slit-material';
import { smooth, tween } from './timing';

const SINK = 0.06;

type StackTiming = MessageAriseProps['stack'];

export const arrivalFrame = (stack: StackTiming, index: number): number =>
  stack.delay + index * stack.stagger;

const NotificationCard = ({
  message,
  layout,
  style,
  unit,
  bottom,
  opacity,
  scale,
  tilt,
  slitY,
  feather,
  order,
}: {
  message: AriseMessage;
  layout: CardLayout;
  style: CardStyle;
  unit: number;
  bottom: number;
  opacity: number;
  scale: number;
  tilt: number;
  slitY: number;
  feather: number;
  order: number;
}) => {
  const canvas = useMemo(() => document.createElement('canvas'), []);
  const texture = useMemo(() => cardTexture(canvas), [canvas]);
  useMemo(() => {
    drawCard(canvas, message, layout, style);
    texture.needsUpdate = true;
  }, [canvas, texture, message, layout, style]);
  const slit = useMemo(() => slitMaterial(texture), [texture]);
  useEffect(
    () => () => {
      slit.material.dispose();
      texture.dispose();
    },
    [slit, texture],
  );
  updateSlit(slit, { opacity, slitY, feather });
  const width = (CARD_PX + CARD_MARGIN_PX * 2) * unit;
  const height = (layout.heightPx + CARD_MARGIN_PX * 2) * unit;
  const cardHeight = layout.heightPx * unit;
  return (
    <group
      position={[0, bottom + (cardHeight / 2) * scale, 0]}
      rotation={[0, 0, tilt]}
      scale={scale}
    >
      <mesh renderOrder={10 + order} material={slit.material}>
        <planeGeometry args={[width, height]} />
      </mesh>
    </group>
  );
};

export interface MessageStackProps {
  messages: AriseMessage[];
  style: CardStyle;
  stack: StackTiming;
  frame: number;
  surfaceY: number;
}

export const MessageStack = ({ messages, style, stack, frame, surfaceY }: MessageStackProps) => {
  useCardFont();
  const unit = style.width / CARD_PX;
  const easing = resolveEasing(stack.easing);
  const layouts = useMemo(
    () => messages.map((message) => layoutCard(message, style)),
    [messages, style],
  );
  const rise = messages.map((_message, index) => {
    const at = arrivalFrame(stack, index);
    return tween(frame, [at, at + stack.riseFrames], [0, 1], easing);
  });
  const push = messages.map((_message, index) => {
    const at = arrivalFrame(stack, index);
    return tween(frame, [at, at + stack.pushFrames], [0, 1], easing);
  });
  return (
    <>
      {messages.map((message, index) => {
        const layout = layouts[index];
        const arrived = rise[index] ?? 0;
        if (layout === undefined || frame < arrivalFrame(stack, index)) {
          return null;
        }
        const cardHeight = layout.heightPx * unit;
        let above = 0;
        let newer = 0;
        for (let later = index + 1; later < messages.length; later++) {
          const pushed = push[later] ?? 0;
          above += pushed * ((layouts[later]?.heightPx ?? 0) * unit + stack.gap);
          newer += pushed;
        }
        const crowd = Math.max(0, newer - (stack.maxVisible - 1));
        const bottom = stack.lift + above - (1 - arrived) * (stack.lift + cardHeight + SINK);
        const emerged = Math.min(1, Math.max(0, (bottom + cardHeight) / cardHeight));
        const fadeIn =
          stack.fadeShare <= 0 ? 1 : tween(emerged, [0, stack.fadeShare], [0, 1], smooth);
        const fadeOut = 1 - Math.min(1, crowd);
        const tilt = Math.sin(frame / 41 + index * 1.7) * stack.sway;
        return (
          <NotificationCard
            key={`${index}:${message.sender}`}
            message={message}
            layout={layout}
            style={style}
            unit={unit}
            bottom={bottom}
            opacity={fadeIn * fadeOut}
            scale={stack.growFrom + (1 - stack.growFrom) * arrived}
            tilt={tilt}
            slitY={surfaceY}
            feather={stack.feather}
            order={index}
          />
        );
      })}
    </>
  );
};

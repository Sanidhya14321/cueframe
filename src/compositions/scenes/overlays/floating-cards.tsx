import { Composition, useCurrentFrame } from 'remotion';
import { DoubleSide } from 'three';
import {
  type FloatingCardsProps,
  floatingCardsDefaults,
  floatingCardsMeta,
  floatingCardsSchema,
} from '@/schemas';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { resolveCustom } from '../../promo/screen-assets';
import { FloatingCard, Stage } from '../../promo/stage';
import { settle, tween } from '../../promo/timing';
import { useTexture } from '../../promo/use-texture';
import type { SceneModule } from '../../scene-module';

type FloatingCardItem = FloatingCardsProps['cards'][number];

const CARD_ASPECT = 340 / 720;

const imageAspect = (image: unknown): number =>
  image instanceof HTMLImageElement && image.naturalWidth > 0
    ? image.naturalHeight / image.naturalWidth
    : CARD_ASPECT;

const CustomCard = ({ url, width, opacity }: { url: string; width: number; opacity: number }) => {
  const map = useTexture(url);
  return (
    <mesh>
      <planeGeometry args={[width, width * imageAspect(map.image)]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
};

const CardFace = ({ card, opacity }: { card: FloatingCardItem; opacity: number }) =>
  card.image.length > 0 ? (
    <CustomCard url={resolveCustom(card.image)} width={card.size} opacity={opacity} />
  ) : (
    <FloatingCard card={card.kind} width={card.size} opacity={opacity} />
  );

export const FloatingCards = ({
  cards,
  delay,
  stagger,
  popFrames,
  popLift,
  popScale,
  bobSpeed,
  look,
  stage,
  motion,
}: FloatingCardsProps) => {
  const frame = useCurrentFrame() * motion.speed;
  return (
    <PromoLayer look={look} motion={motion}>
      <Stage stage={{ ...stage, shadow: 0 }} dark={isDarkLook(look)}>
        {cards.map((card, index) => {
          const start = delay + index * stagger;
          const pop = tween(frame, [start, start + popFrames], [0, 1], settle);
          return (
            <group
              key={`${index}:${card.kind}`}
              position={[
                card.x,
                card.y -
                  (1 - pop) * popLift +
                  Math.sin((frame / 24) * bobSpeed + index * 1.7) * motion.float,
                card.z,
              ]}
              rotation={[0.03, card.turn, 0]}
              scale={popScale + pop * (1 - popScale)}
            >
              <CardFace card={card} opacity={pop} />
            </group>
          );
        })}
      </Stage>
    </PromoLayer>
  );
};

export const floatingCardsScene: SceneModule = {
  id: 'floating-cards',
  component: FloatingCards,
  render: (key) => (
    <Composition
      key={key}
      id="floating-cards"
      component={FloatingCards}
      schema={floatingCardsSchema}
      defaultProps={floatingCardsDefaults}
      durationInFrames={floatingCardsMeta.durationInFrames}
      fps={floatingCardsMeta.fps}
      width={floatingCardsMeta.width}
      height={floatingCardsMeta.height}
    />
  ),
};

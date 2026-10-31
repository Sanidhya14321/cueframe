import { useMemo } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type DominoWordsProps,
  dominoWordsDefaults,
  dominoWordsMeta,
  dominoWordsSchema,
} from '@/schemas';
import { cameraAt } from '../../domino-words/camera';
import { buildChain, chainAngles, landFrame } from '../../domino-words/chain';
import { finaleState, wordInk } from '../../domino-words/ink';
import { BrandMark, FooterLink } from '../../domino-words/marks';
import { NeonFloor } from '../../domino-words/neon';
import { RollingOrb } from '../../domino-words/orb';
import { DominoText } from '../../domino-words/word';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const DominoWords = (props: DominoWordsProps) => {
  const { type, floor, orb, finale, look, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const { width } = useVideoConfig();
  const chain = useMemo(() => buildChain(props), [props]);
  const angles = chainAngles(chain, frame);
  const camera = cameraAt(props, chain, frame, width);
  const state = finaleState(finale, frame, landFrame(chain));
  const baseY = floor.y - floor.thickness / 2;
  const screenX = (worldX: number): number => camera.offset + worldX * camera.zoom;
  const last = chain.at(-1);
  const first = chain[0];
  const lastX = last === undefined ? 0 : screenX(last.pivot);
  const contactX = (first?.pivot ?? 0) - (first?.thickness ?? 0) - orb.radius;
  const orbWorldX =
    frame < orb.hitFrame
      ? contactX - orb.speed * (orb.hitFrame - frame)
      : contactX - orb.bounceSpeed * (frame - orb.hitFrame);
  const orbX = screenX(orbWorldX);
  const orbOuter = orb.radius * 1.6 * camera.zoom;
  const orbVisible = orb.show && orbX + orbOuter > -40 && orbX - orbOuter < width + 40;
  const scene = (reflected: boolean) => (
    <>
      {orbVisible ? (
        <RollingOrb
          orb={orb}
          x={orbX}
          spin={orbWorldX / orb.radius}
          floorY={floor.y}
          floorThickness={floor.thickness}
          zoom={camera.zoom}
          pool={!reflected}
        />
      ) : null}
      {chain.map((domino, index) => {
        const { color, fill, glow } = wordInk({
          index,
          count: chain.length,
          start: domino.start,
          frame,
          type,
          finale,
          state,
        });
        return (
          <DominoText
            key={`${index.toString()}-${domino.text}`}
            domino={domino}
            angle={angles[index] ?? 0}
            x={screenX(domino.pivot)}
            baseY={baseY}
            zoom={camera.zoom}
            color={color}
            fill={fill}
            outline={type.outline}
            weight={type.weight}
            condense={type.condense}
            glowColor={finale.color}
            glow={glow}
          />
        );
      })}
    </>
  );
  return (
    <PromoLayer look={look} motion={motion}>
      <AbsoluteFill>
        {finale.wash > 0 && state.landed && last !== undefined ? (
          <div
            style={{
              position: 'absolute',
              left: lastX - last.length * camera.zoom * 0.4,
              width: last.length * camera.zoom * 1.8,
              top: baseY - last.length * camera.zoom * 0.7,
              height: last.length * camera.zoom * 1.4,
              opacity: finale.wash * state.progress,
              background: `radial-gradient(closest-side, color-mix(in srgb, ${finale.color} 34%, transparent) 0%, color-mix(in srgb, ${finale.color} 12%, transparent) 50%, transparent 100%)`,
            }}
          />
        ) : null}
        {floor.reflection > 0 ? (
          <AbsoluteFill
            style={{
              transformOrigin: `0px ${baseY}px`,
              transform: 'scaleY(-1)',
              opacity: floor.reflection,
              maskImage: `linear-gradient(to bottom, transparent ${baseY - floor.reflectionDepth}px, black ${baseY}px)`,
            }}
          >
            {scene(true)}
          </AbsoluteFill>
        ) : null}
        <NeonFloor
          floor={floor}
          width={width}
          tintColor={finale.color}
          tintFrom={lastX}
          tintTo={lastX + (last?.length ?? 0) * camera.zoom}
          tintAmount={state.landed ? finale.floorTint * state.progress : 0}
        />
        {scene(false)}
        <BrandMark brand={props.brand} />
        <FooterLink footer={props.footer} />
      </AbsoluteFill>
    </PromoLayer>
  );
};

export const dominoWordsScene: SceneModule = {
  id: 'domino-words',
  component: DominoWords,
  render: (key) => (
    <Composition
      key={key}
      id="domino-words"
      component={DominoWords}
      schema={dominoWordsSchema}
      defaultProps={dominoWordsDefaults}
      durationInFrames={dominoWordsMeta.durationInFrames}
      fps={dominoWordsMeta.fps}
      width={dominoWordsMeta.width}
      height={dominoWordsMeta.height}
    />
  ),
};

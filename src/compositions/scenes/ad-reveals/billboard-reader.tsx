import { useMemo } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import {
  type BillboardReaderProps,
  billboardReaderDefaults,
  billboardReaderMeta,
  billboardReaderSchema,
  type ReaderBoard,
} from '@/schemas';
import { Board } from '../../billboard-reader/board';
import { drawBoardArt, useArtFonts } from '../../billboard-reader/board-art';
import { City } from '../../billboard-reader/city';
import { Ground } from '../../billboard-reader/ground';
import { Hero } from '../../billboard-reader/hero';
import { heroPose } from '../../billboard-reader/hero-pose';
import { lampLevel } from '../../billboard-reader/lamp-glow';
import { BOARD_TOP, cameraShot } from '../../billboard-reader/layout';
import { ReaderStage } from '../../billboard-reader/reader-stage';
import { SkyDome } from '../../billboard-reader/sky';
import { Traffic } from '../../billboard-reader/traffic';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const SEAT_HEIGHT = BOARD_TOP + 0.16;
const SEAT_DEPTH = -0.1;

const useBoardArt = (board: ReaderBoard): THREE.Texture => {
  useArtFonts();
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    drawBoardArt(canvas, board);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    return texture;
  }, [board]);
};

const BillboardReader = ({
  board,
  hero,
  timing,
  camera,
  world,
  light,
  look,
  motion,
}: BillboardReaderProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { durationInFrames } = useVideoConfig();
  const art = useBoardArt(board);
  const shot = cameraShot(frame, durationInFrames, camera);
  const pose = heroPose(frame, timing);
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill
        style={{
          backgroundColor: look.showBackdrop ? world.haze : 'transparent',
          overflow: 'hidden',
        }}
      >
        <ReaderStage
          shot={shot}
          fov={camera.fieldOfView}
          world={world}
          light={light}
          showBackdrop={look.showBackdrop}
        >
          {look.showBackdrop ? (
            <>
              <SkyDome world={world} />
              <Ground world={world} frame={frame} />
              <group rotation={[0, world.coastAngle, 0]}>
                <City world={world} />
                <Traffic frame={frame} moving={world.traffic} />
              </group>
            </>
          ) : null}
          <group rotation={[0, board.yaw, 0]}>
            <Board
              art={art}
              frameColor={board.frame}
              poleColor={board.pole}
              lamps={board.lamps}
              lamp={{
                color: board.lampColor,
                glow: board.lampGlow,
                level: (x) => lampLevel(frame, timing, x),
              }}
            />
            <group position={[hero.seatX, SEAT_HEIGHT, SEAT_DEPTH]} scale={hero.scale}>
              <Hero hero={hero} pose={pose} frame={frame} />
            </group>
          </group>
        </ReaderStage>
        {look.showBackdrop ? (
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, ${look.vignetteColor} 100%)`,
              opacity: look.vignette,
            }}
          />
        ) : null}
        {look.showBackdrop && look.grade > 0 ? (
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, ${look.gradeTop} 0%, ${look.gradeBottom} 100%)`,
              mixBlendMode: 'soft-light',
              opacity: look.grade,
            }}
          />
        ) : null}
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const billboardReaderScene: SceneModule = {
  id: 'billboard-reader',
  component: BillboardReader,
  render: (key) => (
    <Composition
      key={key}
      id="billboard-reader"
      component={BillboardReader}
      schema={billboardReaderSchema}
      defaultProps={billboardReaderDefaults}
      durationInFrames={billboardReaderMeta.durationInFrames}
      fps={billboardReaderMeta.fps}
      width={billboardReaderMeta.width}
      height={billboardReaderMeta.height}
    />
  ),
};

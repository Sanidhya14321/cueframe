import * as THREE from 'three';
import type { CrumpledPaperRevealProps } from '@/schemas';
import { glide, settle, smooth, tween } from '../promo/timing';
import { type CrumpleShape, type CrumpleState, crumplePoint, smoothstep } from './crumple';
import { type HandAim, type HandCue, sheetGrip } from './paper-hands';

const PROBE = 0.04;
const SHEET_REST = new THREE.Vector3(0, 0.05, 0);
const MID_TILT = 0.16;

const sheetFrame = (shape: CrumpleShape, transform: THREE.Matrix4, x: number, y: number) => {
  const opened: CrumpleState = { unfold: 1, scale: 1 };
  const at = (px: number, py: number) =>
    crumplePoint(shape, opened, px, py, new THREE.Vector3()).applyMatrix4(transform);
  const anchor = at(x, y);
  const across = at(x + PROBE, y)
    .sub(at(x - PROBE, y))
    .normalize();
  const up = at(x, y + PROBE)
    .sub(at(x, y - PROBE))
    .normalize();
  const normal = new THREE.Vector3().crossVectors(across, up).normalize();
  return { anchor, normal, up, across };
};

export const paperCues = (props: CrumpledPaperRevealProps, frame: number) => {
  const { paper, timing, hands, camera } = props;
  const rub = timing.rubFrames;
  const clap =
    tween(frame, [0, rub * 0.5], [0, 1], glide) *
    (1 - tween(frame, [rub * 0.5, rub], [0, 1], glide));
  const appear = tween(
    frame,
    [timing.appearStart, timing.appearStart + timing.appearFrames],
    [0, 1],
    settle,
  );
  const ball = tween(
    frame,
    [timing.appearStart - 14, timing.appearStart + timing.appearFrames],
    [0, 1],
    smooth,
  );
  const unfold = tween(
    frame,
    [timing.unfoldStart, timing.unfoldStart + timing.unfoldFrames],
    [0, 1],
    smooth,
  );
  const settleIn = tween(
    frame,
    [timing.regripStart, timing.regripStart + timing.regripFrames],
    [0, 1],
    smooth,
  );
  const push = tween(
    frame,
    [timing.pushStart, timing.pushStart + timing.pushFrames],
    [0, 1],
    glide,
  );
  const move = tween(
    frame,
    [timing.unfoldStart - 6, timing.unfoldStart + timing.unfoldFrames * 0.8],
    [0, 1],
    smooth,
  );
  const rest = smoothstep(0, 1, unfold);
  const rise = smoothstep(0, 0.8, unfold);
  const ballRadius = paper.ballRadius * appear;
  const ballCenter = new THREE.Vector3(hands.rubX - 0.2, hands.rubY, 0.25);
  const sheetCenter = ballCenter.clone().lerp(SHEET_REST, rise);
  const transform = new THREE.Matrix4().compose(
    sheetCenter,
    new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        Math.sin(frame / 21) * 0.3 * (1 - rest),
        (paper.spin + Math.sin(frame / 27) * 0.45) * (1 - rest) * (0.4 + 0.6 * appear) +
          paper.turn * rest,
        (paper.tilt - MID_TILT * (1 - push)) * rest + Math.sin(frame / 31) * 0.015,
      ),
    ),
    new THREE.Vector3(1, 1, 1),
  );
  const halfWidth = paper.width / 2;
  const halfHeight = paper.height / 2;
  const grip = (
    x: number,
    y: number,
    reach: { across: number; up: number },
    fingers: (up: THREE.Vector3, across: THREE.Vector3) => THREE.Vector3,
  ): HandAim => {
    const sheet = sheetFrame(paper, transform, x, y);
    const anchor = sheet.anchor
      .clone()
      .addScaledVector(sheet.across, reach.across)
      .addScaledVector(sheet.up, reach.up);
    return sheetGrip(anchor, sheet.normal, fingers(sheet.up, sheet.across), hands.gripDepth);
  };
  const cue = (pullGrip: HandAim, holdGrip: HandAim): HandCue => ({
    clap,
    ball,
    pull: smoothstep(0.02, 0.7, unfold),
    settle: settleIn,
    ballCenter,
    ballRadius,
    pullGrip,
    holdGrip,
  });
  const top = cue(
    grip(halfWidth * 0.3, halfHeight, { across: 0.1, up: 0.3 }, (up, across) =>
      up.clone().multiplyScalar(-0.85).addScaledVector(across, -0.5),
    ),
    grip(halfWidth, halfHeight * 0.05, { across: hands.holdReach, up: 0.1 }, (up, across) =>
      across.clone().negate().addScaledVector(up, -0.3),
    ),
  );
  const bottom = cue(
    grip(halfWidth * 0.1, -halfHeight, { across: 0.15, up: -0.3 }, (up, across) =>
      up.clone().multiplyScalar(0.85).addScaledVector(across, -0.5),
    ),
    grip(halfWidth * 0.25, -halfHeight, { across: 0.2, up: -hands.holdReach }, (up, across) =>
      up.clone().multiplyScalar(0.8).addScaledVector(across, -0.6),
    ),
  );
  const lerp = THREE.MathUtils.lerp;
  const lookX = lerp(lerp(camera.startX, camera.midX, move), camera.endX, push);
  const lookY = lerp(lerp(camera.startY, camera.midY, move), camera.endY, push);
  return {
    state: { unfold, scale: Math.max(0.001, appear) },
    transform,
    focus: sheetCenter,
    top,
    bottom,
    camera: {
      x: lookX,
      y: lookY,
      z: lerp(lerp(camera.startDistance, camera.midDistance, move), camera.endDistance, push),
      targetX: lookX,
      targetY: lookY,
      targetZ: 0,
      fieldOfView: camera.fieldOfView,
      handheld: camera.handheld,
    },
  };
};

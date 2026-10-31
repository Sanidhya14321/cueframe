import * as THREE from 'three';
import type { ArmStyle } from '@/schemas';
import type { ArmLook } from '../promo/desk/arm';
import { HandModel, useHandScene } from '../promo/desk/hand-model';
import { applyHandPose, type HandPose, mixPose } from '../promo/desk/hand-rig';
import { type PalmFrame, palmBasis } from '../promo/desk/wipe-choreography';

export interface HandsLook {
  skin: string;
  roughness: number;
  detail: number;
  rubX: number;
  rubY: number;
  rubSpeed: number;
  rubReach: number;
  clap: number;
  gripCurl: number;
  thumbCurl: number;
  watch: boolean;
  watchColor: string;
  sleeve: ArmStyle;
  sleeveColor: string;
}

export interface HandAim {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  fingers: THREE.Vector3;
}

export interface HandCue {
  clap: number;
  ball: number;
  pull: number;
  settle: number;
  ballCenter: THREE.Vector3;
  ballRadius: number;
  pullGrip: HandAim;
  holdGrip: HandAim;
}

type HandSide = 'top' | 'bottom';

const ARM: Omit<ArmLook, 'style' | 'sleeveColor'> = {
  length: 0.8,
  looseness: 0.4,
  knit: 0.004,
  band: false,
  bandColor: '#b9bcc1',
};

const FOREARM = 2.6;
const PALM_GAP = 0.08;
const DRIFT = 0.006;
const ELBOW_BIAS: Record<HandSide, THREE.Vector3> = {
  top: new THREE.Vector3(1.5, 0.45, 0.55),
  bottom: new THREE.Vector3(1.5, -0.55, 0.55),
};
const MIRRORED: Record<HandSide, boolean> = { top: false, bottom: true };

const aim = (position: THREE.Vector3, normal: THREE.Vector3, fingers: THREE.Vector3): HandAim => ({
  position,
  normal: normal.normalize(),
  fingers: fingers.normalize(),
});

const mirror = (vector: THREE.Vector3) => new THREE.Vector3(-vector.x, vector.y, vector.z);

const toPalm = (target: HandAim, mirrored: boolean): PalmFrame =>
  mirrored
    ? {
        position: mirror(target.position),
        quaternion: palmBasis(mirror(target.normal), mirror(target.fingers)),
      }
    : { position: target.position.clone(), quaternion: palmBasis(target.normal, target.fingers) };

const pose = (curl: number, thumbCurl: number, thumbReach: number, spread: number): HandPose => ({
  curl: { index: curl * 0.85, middle: curl, ring: curl * 1.08, pinky: curl * 1.18 },
  spread,
  thumbCurl,
  thumbReach,
  wristBend: 0,
  wristTwist: 0,
});

const rubAim = (frame: number, look: HandsLook, cue: HandCue, side: HandSide): HandAim => {
  const center = new THREE.Vector3(look.rubX, look.rubY, 0.25);
  const phase = (frame / look.rubSpeed) * Math.PI * 2;
  const stroke = Math.sin(phase) * look.rubReach * (1 - cue.clap) * (1 - cue.ball);
  const open = cue.clap * look.clap;
  if (side === 'top') {
    return aim(
      center
        .clone()
        .add(new THREE.Vector3(stroke + open * 0.12 - frame * DRIFT, PALM_GAP + open, 0.05)),
      new THREE.Vector3(0, -1, 0.15 + open * 0.2),
      new THREE.Vector3(-1, open * 0.4, 0.3),
    );
  }
  return aim(
    center.clone().add(new THREE.Vector3(frame * DRIFT * 0.6 - stroke, -PALM_GAP - open * 0.3, 0)),
    new THREE.Vector3(0, 1, 0.15),
    new THREE.Vector3(-1, -open * 0.12, 0.3),
  );
};

const ballAim = (frame: number, cue: HandCue, side: HandSide): HandAim => {
  const sign = side === 'top' ? 1 : -1;
  const sway = Math.sin(frame / 11 + sign) * 0.04;
  const radius = cue.ballRadius;
  return aim(
    cue.ballCenter
      .clone()
      .add(new THREE.Vector3(radius * 0.45 + sway, sign * (radius + PALM_GAP * 0.6), 0.12)),
    new THREE.Vector3(-0.25, -sign, -0.25),
    new THREE.Vector3(-0.9, -sign * 0.35, 0.15),
  );
};

const blendPalms = (from: PalmFrame, to: PalmFrame, amount: number): PalmFrame => ({
  position: from.position.clone().lerp(to.position, amount),
  quaternion: from.quaternion.clone().slerp(to.quaternion, amount),
});

const blendAims = (from: HandAim, to: HandAim, amount: number): HandAim => ({
  position: from.position.clone().lerp(to.position, amount),
  normal: from.normal.clone().lerp(to.normal, amount).normalize(),
  fingers: from.fingers.clone().lerp(to.fingers, amount).normalize(),
});

const RUB_POSE = pose(0.04, 0.1, 0.05, 0.02);
const BALL_POSE = pose(0.7, 0.6, 0.5, 0.15);
const PULL_POSE = pose(0.4, 0.85, 0.55, 0.12);

const handPlacement = (frame: number, look: HandsLook, cue: HandCue, side: HandSide) => {
  const mirrored = MIRRORED[side];
  const chain = (rubbing: number) => {
    const rub = rubAim(rubbing === 1 ? frame : 0, look, { ...cue, clap: cue.clap * rubbing }, side);
    const stages = [rub, ballAim(frame * rubbing, cue, side), cue.pullGrip, cue.holdGrip];
    const weights = [cue.ball, cue.pull, cue.settle];
    let palm = toPalm(rub, mirrored);
    let steady = rub;
    stages.slice(1).forEach((stage, index) => {
      palm = blendPalms(palm, toPalm(stage, mirrored), weights[index] ?? 0);
      steady = blendAims(steady, stage, weights[index] ?? 0);
    });
    return { palm, steady };
  };
  const { palm } = chain(1);
  const { steady } = chain(0);
  const elbow = steady.fingers
    .clone()
    .negate()
    .add(ELBOW_BIAS[side])
    .normalize()
    .multiplyScalar(FOREARM)
    .add(steady.position);
  const holdPose = pose(look.gripCurl, look.thumbCurl, 0.55, 0.25);
  const handPose = mixPose(
    mixPose(mixPose(RUB_POSE, BALL_POSE, cue.ball), PULL_POSE, cue.pull),
    holdPose,
    cue.settle,
  );
  return { palm, handPose, elbow: mirrored ? mirror(elbow) : elbow, mirrored };
};

const Hand = ({
  frame,
  look,
  cue,
  side,
}: {
  frame: number;
  look: HandsLook;
  cue: HandCue;
  side: HandSide;
}) => {
  const hand = useHandScene();
  const placement = handPlacement(frame, look, cue, side);
  applyHandPose(hand.rig, placement.handPose);
  const sleeved: ArmLook = { ...ARM, style: look.sleeve, sleeveColor: look.sleeveColor };
  const arm =
    side === 'bottom'
      ? { ...sleeved, band: look.watch, bandColor: look.watchColor, bandMetal: 0.6 }
      : sleeved;
  const model = (
    <HandModel
      hand={hand}
      palm={placement.palm}
      skin={look.skin}
      roughness={look.roughness}
      detail={look.detail}
      arm={arm}
      elbow={placement.elbow}
    />
  );
  return placement.mirrored ? <group scale={[-1, 1, 1]}>{model}</group> : model;
};

export const sheetGrip = (
  anchor: THREE.Vector3,
  normal: THREE.Vector3,
  fingers: THREE.Vector3,
  depth: number,
): HandAim =>
  aim(anchor.clone().addScaledVector(normal, depth), normal.clone().negate(), fingers.clone());

export const PaperHands = ({
  frame,
  look,
  top,
  bottom,
}: {
  frame: number;
  look: HandsLook;
  top: HandCue;
  bottom: HandCue;
}) => (
  <>
    <Hand frame={frame} look={look} cue={top} side="top" />
    <Hand frame={frame} look={look} cue={bottom} side="bottom" />
  </>
);

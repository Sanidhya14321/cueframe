import type * as THREE from 'three';
import type { ArmLook } from './arm';
import { Cloth, type ClothLook, clothPlacement } from './cloth';
import { HAND_UNITS, HandModel, palmToWorld, useHandScene } from './hand-model';
import { applyHandPose, type HandPose } from './hand-rig';
import { handCapsules, thumbEdgeShift } from './towel-contact';
import type { PalmFrame } from './wipe-choreography';

const EDGE_MARGIN = 0.04;

export interface HeldTowelProps {
  palm: PalmFrame;
  pose: HandPose;
  holdPalm: PalmFrame;
  holdPose: HandPose;
  skin: string;
  roughness: number;
  detail: number;
  arm: ArmLook;
  cloth: ClothLook | null;
  press: number;
  held: number;
  gap: number;
  elbow: THREE.Vector3;
}

export const HeldTowel = ({
  palm,
  pose,
  holdPalm,
  holdPose,
  skin,
  roughness,
  detail,
  arm,
  cloth,
  press,
  held,
  gap,
  elbow,
}: HeldTowelProps) => {
  const hand = useHandScene();
  let shiftX = 0;
  if (cloth !== null) {
    applyHandPose(hand.rig, holdPose);
    const holdPlacement = clothPlacement(
      holdPalm,
      cloth.offsetX + cloth.holdOffsetX,
      cloth.offsetY + cloth.holdOffsetY,
      gap,
    );
    const holdHand = palmToWorld(holdPalm);
    const toCloth = holdPlacement.clone().invert().multiply(holdHand);
    const holdElbow = elbow.clone().applyMatrix4(holdHand.clone().invert());
    shiftX = thumbEdgeShift(
      handCapsules(hand.rig, toCloth, HAND_UNITS, holdElbow),
      cloth.size / 2,
      EDGE_MARGIN,
    );
  }
  applyHandPose(hand.rig, pose);
  const handPlacement = palmToWorld(palm);
  const handElbow = elbow.clone().applyMatrix4(handPlacement.clone().invert());
  return (
    <>
      <HandModel
        hand={hand}
        palm={palm}
        skin={skin}
        roughness={roughness}
        detail={detail}
        arm={arm}
        elbow={elbow}
      />
      {cloth === null ? null : (
        <Cloth
          palm={palm}
          look={cloth}
          press={press}
          held={held}
          gap={gap}
          shiftX={shiftX}
          capsules={(placement) =>
            handCapsules(
              hand.rig,
              placement.clone().invert().multiply(handPlacement),
              HAND_UNITS,
              handElbow,
            )
          }
        />
      )}
    </>
  );
};

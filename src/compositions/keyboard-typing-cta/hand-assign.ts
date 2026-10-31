import type { Finger } from '../promo/desk/hand-rig';

export type HandSide = 'left' | 'right';

type HandReach = Partial<Record<Finger, [number, number]>>;

export interface HandSetup {
  reach: HandReach;
  split?: number | undefined;
}

export interface Assigned {
  hand: HandSide;
  finger: Finger;
  anchor: [number, number];
  travel: number;
}

const PINKY_COST = 1.25;

export const sideReach = (reach: [number, number], side: HandSide): [number, number] =>
  side === 'left' ? [-reach[0], reach[1]] : reach;

const handFor = (point: [number, number], split: number | undefined): HandSide =>
  split === undefined || point[0] >= split ? 'right' : 'left';

export const assignHands = (points: [number, number][], setup: HandSetup): Assigned[] => {
  const options = Object.entries(setup.reach) as [Finger, [number, number]][];
  const anchors: Partial<Record<HandSide, [number, number]>> = {};
  return points.map((point) => {
    const hand = handFor(point, setup.split);
    const from = anchors[hand] ?? point;
    const placed = options
      .map(([finger, offset]) => {
        const reach = sideReach(offset, hand);
        const spot: [number, number] = [point[0] - reach[0], point[1] - reach[1]];
        const travel = Math.hypot(spot[0] - from[0], spot[1] - from[1]);
        return { finger, spot, travel, cost: travel * (finger === 'pinky' ? PINKY_COST : 1) };
      })
      .reduce((best, option) => (option.cost < best.cost ? option : best), {
        finger: 'index' as Finger,
        spot: point,
        travel: 0,
        cost: Number.POSITIVE_INFINITY,
      });
    anchors[hand] = placed.spot;
    return { hand, finger: placed.finger, anchor: placed.spot, travel: placed.travel };
  });
};

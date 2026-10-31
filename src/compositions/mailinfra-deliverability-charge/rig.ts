import type { MailinfraDeliverabilityChargeProps } from '@/schemas';
import { tween } from '../promo/timing';
import { add, type Cubic, type Point, point, walk } from './geometry';
import {
  type Beats,
  clickAt,
  type PlugTiming,
  plugExit,
  plugTiming,
  plugTravel,
  sparkLife,
} from './timeline';

type Props = MailinfraDeliverabilityChargeProps;

const CABLE_KEYS = ['spf', 'dkim', 'dmarc', 'warmup', 'ips'] as const;

export type CableKey = (typeof CABLE_KEYS)[number];

type Side = 'left' | 'right' | 'bottom';

interface SocketSpec {
  side: Side;
  level: number;
  reach: number;
  approach: number;
  tailReach: number;
  phase: number;
  labelTurn: 1 | -1;
}

const SOCKETS: Record<CableKey, SocketSpec> = {
  spf: {
    side: 'left',
    level: 0.42,
    reach: 250,
    approach: 250,
    tailReach: 230,
    phase: 0.4,
    labelTurn: -1,
  },
  dkim: {
    side: 'right',
    level: 0.42,
    reach: 250,
    approach: 250,
    tailReach: 230,
    phase: 1.9,
    labelTurn: 1,
  },
  dmarc: {
    side: 'left',
    level: 0.64,
    reach: 110,
    approach: 170,
    tailReach: 120,
    phase: 2.8,
    labelTurn: 1,
  },
  warmup: {
    side: 'right',
    level: 0.64,
    reach: 110,
    approach: 170,
    tailReach: 120,
    phase: 4.2,
    labelTurn: -1,
  },
  ips: {
    side: 'bottom',
    level: 1,
    reach: 80,
    approach: 230,
    tailReach: 160,
    phase: 5.3,
    labelTurn: 1,
  },
};

const START_Y = 2090;
const ANCHOR_Y = 2420;
const BACK_OUT = 110;
const DROP_BELOW = 60;

export const PLUG = { body: 92, pin: 16, thick: 24 } as const;

export interface Vessel {
  cx: number;
  top: number;
  width: number;
  height: number;
}

export const vesselOf = (inbox: Props['inbox'], frameWidth: number): Vessel => ({
  cx: frameWidth / 2,
  top: inbox.centerY - inbox.height / 2,
  width: inbox.width,
  height: inbox.height,
});

const DIRECTION: Record<Side, Point> = {
  left: point(1, 0),
  right: point(-1, 0),
  bottom: point(0, -1),
};

const socketPoint = (spec: SocketSpec, vessel: Vessel, outline: number): Point => {
  const y = vessel.top + vessel.height * spec.level;
  if (spec.side === 'left') {
    return point(vessel.cx - vessel.width / 2 - outline / 2, y);
  }
  if (spec.side === 'right') {
    return point(vessel.cx + vessel.width / 2 + outline / 2, y);
  }
  return point(vessel.cx, vessel.top + vessel.height + outline / 2);
};

const startPoint = (spec: SocketSpec, socket: Point): Point => {
  if (spec.side === 'left') {
    return point(socket.x - spec.reach, START_Y);
  }
  if (spec.side === 'right') {
    return point(socket.x + spec.reach, START_Y);
  }
  return point(socket.x + spec.reach, START_Y);
};

export interface Spark {
  at: Point;
  heading: Point;
  opacity: number;
}

export interface CableRig {
  key: CableKey;
  label: string;
  cable: Cubic;
  head: Point;
  tail: Point;
  heading: Point;
  normal: Point;
  labelOpacity: number;
  click: number;
  sparks: Spark[];
}

const fract = (value: number): number => value - Math.floor(value);

export const rigCable = (
  key: CableKey,
  order: number,
  frame: number,
  props: Props,
  beats: Beats,
  vessel: Vessel,
): CableRig => {
  const spec = SOCKETS[key];
  const scale = props.cables.plugSize;
  const direction = DIRECTION[spec.side];
  const socket = socketPoint(spec, vessel, props.inbox.outline);
  const start = startPoint(spec, socket);
  const rise = start.y - socket.y;
  const route = walk([
    start,
    point(start.x, start.y - rise * (spec.side === 'bottom' ? 0.4 : 0.5)),
    add(socket, direction, -spec.approach),
    socket,
  ]);
  const plug: PlugTiming = plugTiming(props.timing, beats, order);
  const leaving = frame >= plug.release;
  const travelled = leaving ? route.length : plugTravel(frame, plug, route.length);
  const progress = route.length > 0 ? travelled / route.length : 0;
  const exit = plugExit(frame, plug);
  const seatAngle = Math.atan2(direction.y, direction.x);
  const hangAngle = -Math.PI / 2;
  const swingBack = Math.atan2(Math.sin(hangAngle - seatAngle), Math.cos(hangAngle - seatAngle));
  const angle = seatAngle + swingBack * exit.turn;
  const heading = leaving ? point(Math.cos(angle), Math.sin(angle)) : route.headingAt(travelled);
  const across = point(-heading.y, heading.x);
  const swing =
    props.cables.sway * 26 * Math.sin(Math.PI * progress) * Math.sin(frame / 11 + spec.phase);
  const head = leaving
    ? add(
        add(socket, direction, -BACK_OUT * scale * exit.back),
        point(0, 1),
        (START_Y + DROP_BELOW - socket.y) * exit.fall,
      )
    : add(route.pointAt(travelled), across, swing);
  const tail = add(head, heading, -PLUG.body * scale);
  const anchor = point(start.x, ANCHOR_Y);
  const drift = props.cables.sway * (14 + 10 * Math.sin(Math.PI * progress));
  const cable: Cubic = [
    anchor,
    point(
      anchor.x + drift * Math.sin(frame / 37 + spec.phase),
      anchor.y - (anchor.y - tail.y) * 0.45,
    ),
    add(
      add(tail, heading, -spec.tailReach * scale),
      point(drift * Math.sin(frame / 29 + spec.phase * 1.7), drift * 0.4 * Math.cos(frame / 31)),
    ),
    tail,
  ];
  const normal = point(across.x * spec.labelTurn, across.y * spec.labelTurn);
  return {
    key,
    label: props.cables[key].label,
    cable,
    head,
    tail,
    heading,
    normal,
    labelOpacity: 1 - tween(frame, [plug.release, plug.release + 12], [0, 1]),
    click: clickAt(frame, plug),
    sparks: sparksOn(cable, frame, props.sparks, sparkLife(frame, plug), spec.phase),
  };
};

const sparksOn = (
  cable: Cubic,
  frame: number,
  sparks: Props['sparks'],
  life: number,
  phase: number,
): Spark[] => {
  if (sparks.count <= 0 || life <= 0) {
    return [];
  }
  const path = walk(cable);
  return Array.from({ length: sparks.count }, (_, index) => {
    const share = fract(frame / sparks.tripFrames + index / sparks.count + phase * 0.13);
    const distance = share * path.length;
    const edge = Math.min(1, (1 - share) / 0.2, share / 0.1);
    return {
      at: path.pointAt(distance),
      heading: path.headingAt(distance),
      opacity: life * Math.max(0, edge),
    };
  });
};

export const visibleCables = (cables: Props['cables']): CableKey[] =>
  CABLE_KEYS.filter((key) => cables[key].show);

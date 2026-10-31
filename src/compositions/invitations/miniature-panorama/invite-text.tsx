import type { CSSProperties } from 'react';
import type { MiniaturePanoramaProps } from '@/schemas';
import { glowShadow } from '../../promo/glow';
import { pixelTween, settle, tween } from '../../promo/timing';
import { inviteScriptFonts, inviteSerifFonts } from '../fonts';
import { FRAME_WIDTH } from './camera';

type Invite = MiniaturePanoramaProps['invite'];

const ENTER_FRAMES = 42;

const STAGGER = 9;

const BOX_HEIGHT = 1200;

const TEXT_WIDTH = FRAME_WIDTH - 96;

const Line = ({
  text,
  index,
  frame,
  invite,
  style,
}: {
  text: string;
  index: number;
  frame: number;
  invite: Invite;
  style: CSSProperties;
}) => {
  if (text.trim() === '') {
    return null;
  }
  const start = invite.start + index * STAGGER;
  const range: [number, number] = [start, start + ENTER_FRAMES];
  const lift = pixelTween(frame, range, [invite.rise, 0], settle);
  const opacity = tween(frame, range, [0, 1], settle);
  return (
    <div
      style={{
        ...style,
        opacity,
        transform: `translateY(${lift}px)`,
        whiteSpace: 'pre-wrap',
        maxWidth: TEXT_WIDTH,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
};

export const InviteText = ({ invite, frame }: { invite: Invite; frame: number }) => {
  if (!invite.show || frame < invite.start) {
    return null;
  }
  const shadow = (size: number) => glowShadow(invite.glow, invite.glowStrength, size);
  const caps: CSSProperties = {
    fontFamily: inviteSerifFonts[invite.serifFont],
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: `${invite.tracking}em`,
    marginRight: `-${invite.tracking}em`,
    lineHeight: 1.2,
    color: invite.color,
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: invite.centerY - BOX_HEIGHT / 2,
        width: FRAME_WIDTH,
        height: BOX_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: invite.gap,
      }}
    >
      <Line
        text={invite.names}
        index={0}
        frame={frame}
        invite={invite}
        style={{
          fontFamily: inviteScriptFonts[invite.scriptFont],
          fontSize: invite.namesSize,
          lineHeight: 1.15,
          padding: '0 0.2em',
          color: invite.color,
          textShadow: shadow(invite.namesSize),
        }}
      />
      <Line
        text={invite.line}
        index={1}
        frame={frame}
        invite={invite}
        style={{ ...caps, fontSize: invite.lineSize, textShadow: shadow(invite.lineSize) }}
      />
      <Line
        text={invite.date}
        index={2}
        frame={frame}
        invite={invite}
        style={{ ...caps, fontSize: invite.dateSize, textShadow: shadow(invite.dateSize) }}
      />
    </div>
  );
};

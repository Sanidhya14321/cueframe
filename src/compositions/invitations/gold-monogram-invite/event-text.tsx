import type { GoldEvent, GoldMonogramInviteProps } from '@/schemas';
import { type Gold, paint } from './gold';
import { RevealText } from './text-fx';

export const EventText = ({
  event,
  eventText,
  gold,
  band,
  cream,
  serif,
  script,
  scriptTitle = false,
  x,
  y,
  frame,
  start,
  out,
  blurId,
}: {
  event: GoldEvent;
  eventText: GoldMonogramInviteProps['eventText'];
  gold: Gold;
  band: string;
  cream: string;
  serif: string;
  script: string;
  scriptTitle?: boolean;
  x: number;
  y: number;
  frame: number;
  start: number;
  out: [number, number];
  blurId: string;
}) => {
  const title = eventText.titleSize;
  const detail = eventText.detailSize;
  const titleStyle = scriptTitle
    ? { fontFamily: script, fontSize: title * 1.35 }
    : {
        fontFamily: serif,
        fontSize: title,
        fontWeight: 600,
        letterSpacing: '0.06em',
        uppercase: true,
      };
  const detailStyle = {
    fontFamily: serif,
    fontSize: detail,
    fontWeight: 600,
    letterSpacing: '0.05em',
  };
  const lines: [string, number, number][] = [
    [event.date, y + title * 0.32 + detail * 1.6, detail * 1.25],
    [event.time, y + title * 0.32 + detail * 2.95, detail],
    [event.venue, y + title * 0.32 + detail * 4.2, detail],
  ];
  return (
    <>
      <RevealText
        text={event.title}
        x={x}
        y={y}
        style={titleStyle}
        color={paint(band)}
        gold={gold}
        depth={2}
        frame={frame}
        start={start}
        stagger={6}
        out={out}
        blurId={blurId}
      />
      {lines.map(([text, lineY, size], index) => (
        <RevealText
          key={index.toString()}
          text={text}
          x={x}
          y={lineY}
          style={{ ...detailStyle, fontSize: size }}
          color={index === 0 ? paint(band) : cream}
          gold={index === 0 ? gold : undefined}
          depth={index === 0 ? 1.2 : 0}
          frame={frame}
          start={start + 12 + index * 9}
          stagger={3}
          out={[out[0] + index * 2, out[1] + index * 2]}
          blurId={blurId}
        />
      ))}
    </>
  );
};

import type { ThreadColors, ThreadTitle, ThreadTitleStyle, ThreadWeb } from '@/schemas';
import { settle, tween } from '../promo/timing';
import { BackWeb, FrontWraps } from './cocoon';
import { cocoonShape, sideWebShape } from './cocoon-geometry';
import { ExtrudedTitle, titleMetrics } from './extruded-title';
import { type StopWindow, swingAt } from './schedule';
import { Spider } from './spider';

const crawlOffset = (u: number, amount: number) => ({
  x: amount * Math.sin(u * 0.9),
  y: amount * 0.55 * Math.sin(u * 1.7),
});

export const TitleStop = ({
  item,
  index,
  window,
  frame,
  style,
  web,
  colors,
}: {
  item: ThreadTitle;
  index: number;
  window: StopWindow;
  frame: number;
  style: ThreadTitleStyle;
  web: ThreadWeb;
  colors: ThreadColors;
}) => {
  const metrics = titleMetrics(item.top, item.bottom, style);
  const shape = cocoonShape(metrics, web, index);
  const sideWeb =
    item.sideWeb === 'none' ? null : sideWebShape(shape, metrics, item.sideWeb, index);
  const direction = index % 2 === 0 ? 1 : -1;
  const angle = item.tilt + direction * swingAt(frame, window.arrive, style.swing);
  const wraps = tween(frame, [window.arrive - 2, window.arrive + 24], [0, 1], settle);
  const u = (frame - window.whipStart) / 28 + index * 1.3;
  const here = crawlOffset(u, web.crawl);
  const ahead = crawlOffset(u + 0.05, web.crawl);
  const heading = (Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180) / Math.PI + 90;
  const spiderX = item.spiderX + here.x;
  const spiderY = item.spiderY + here.y;
  return (
    <div style={{ position: 'absolute', left: web.threadX, top: style.centerY }}>
      <BackWeb shape={shape} sideWeb={sideWeb} item={item} index={index} web={web} frame={frame} />
      {item.spider ? (
        <Spider x={spiderX} y={spiderY} heading={heading} phase={u * 7} web={web} />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `rotate(${angle.toFixed(3)}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -700,
            width: 1400,
            top: -metrics.height / 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ExtrudedTitle
            top={item.top}
            bottom={item.bottom}
            metrics={metrics}
            style={style}
            colors={colors}
          />
        </div>
        <FrontWraps width={metrics.width} height={metrics.height} progress={wraps} web={web} />
      </div>
    </div>
  );
};

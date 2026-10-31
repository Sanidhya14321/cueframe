import type { ReactNode } from 'react';
import type { WeddingItineraryPagesProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { inviteScriptFonts, inviteSerifFonts } from '../fonts';
import { eraseStart, type Row, type RowTiming, rowTimings, type TextPage } from './timeline';

type Props = WeddingItineraryPagesProps;

const CHAR_FADE = 3;

const SCRIPT_FADE = 7;

const ERASE_SPREAD = 0.8;

const ERASE_FADE = 5;

const BLOCK_ERASE_STEP = 3;

const LINE_LAG = 5;

type RowFont = {
  family: string;
  size: number;
  weight: number;
  height: number;
  tracking: number;
  fade: number;
};

const rowFont = (row: Row, props: Props): RowFont => {
  const { type } = props;
  const script = inviteScriptFonts[type.scriptFont];
  const serif = inviteSerifFonts[type.serifFont];
  const scriptRow = (size: number): RowFont => ({
    family: script,
    size,
    weight: 400,
    height: Math.round(size * 1.18),
    tracking: 0,
    fade: SCRIPT_FADE,
  });
  const serifRow = (size: number, weight: number): RowFont => ({
    family: serif,
    size,
    weight,
    height: Math.round(size * type.lineSpacing),
    tracking: type.tracking,
    fade: CHAR_FADE,
  });
  switch (row.style) {
    case 'title':
      return scriptRow(type.titleSize);
    case 'names':
      return scriptRow(type.namesSize);
    case 'script':
      return scriptRow(type.scriptSize);
    case 'joiner':
      return scriptRow(Math.round(type.scriptSize * 0.62));
    case 'bold':
      return serifRow(type.lineSize, type.boldWeight);
    case 'regular':
      return serifRow(type.lineSize, type.regularWeight);
    default:
      return serifRow(type.smallSize, type.regularWeight);
  }
};

const charOpacity = (
  frame: number,
  timing: RowTiming,
  index: number,
  length: number,
  erase: number,
  eraseFrames: number,
  charFrames: number,
  fadeFrames: number,
): number => {
  const since = frame - timing.start - index * charFrames;
  const typed = since < 0 ? 0 : Math.min(1, (since + 1) / fadeFrames);
  const goneAt = erase + (index / Math.max(1, length)) * eraseFrames * ERASE_SPREAD;
  return typed * (1 - Math.min(1, Math.max(0, (frame - goneAt + 1) / ERASE_FADE)));
};

const TypedRow = ({
  row,
  font,
  top,
  timing,
  frame,
  erase,
  longest,
  props,
  color,
}: {
  row: Row;
  font: RowFont;
  top: number;
  timing: RowTiming;
  frame: number;
  erase: number;
  longest: number;
  props: Props;
  color: string;
}) => {
  if (frame < timing.start - 2) {
    return null;
  }
  const chars = Array.from(row.text);
  const rowErase = erase + row.block * BLOCK_ERASE_STEP;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height: font.height,
        lineHeight: `${font.height}px`,
        textAlign: 'center',
        fontFamily: font.family,
        fontSize: font.size,
        fontWeight: font.weight,
        letterSpacing: `${font.tracking}em`,
        paddingLeft: `${font.tracking}em`,
        fontKerning: 'none',
        fontVariantLigatures: 'none',
        fontVariantNumeric: 'lining-nums',
        color,
        whiteSpace: 'pre',
      }}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          style={{
            opacity: charOpacity(
              frame,
              timing,
              index,
              longest,
              rowErase,
              props.timing.eraseFrames,
              props.timing.charFrames,
              font.fade,
            ),
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

const sweep = (progress: number): { left: number; width: number } =>
  progress <= 0.5
    ? { left: 0, width: progress * 2 }
    : { left: progress * 2 - 1, width: 2 - progress * 2 };

const BlockTitle = ({
  lines,
  font,
  top,
  timing,
  frame,
  exit,
  blockFrames,
  color,
}: {
  lines: string[];
  font: RowFont;
  top: number;
  timing: RowTiming;
  frame: number;
  exit: number;
  blockFrames: number;
  color: string;
}) => {
  return (
    <>
      {lines.map((line, index) => {
        const lag = index * LINE_LAG;
        const enter = tween(frame, [timing.start + lag, timing.end + lag], [0, 1], smooth);
        const leave = tween(frame, [exit + lag, exit + lag + blockFrames], [0, 1], smooth);
        if (enter <= 0 || leave >= 1) {
          return null;
        }
        const sweeping = leave > 0 ? sweep(leave) : enter < 1 ? sweep(enter) : null;
        const shown = leave > 0 ? leave < 0.5 : enter >= 0.5;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: top + index * font.height,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                fontFamily: font.family,
                fontSize: font.size,
                lineHeight: `${font.height}px`,
                color,
                whiteSpace: 'pre',
              }}
            >
              <span style={{ opacity: shown ? 1 : 0 }}>{line}</span>
              {sweeping ? (
                <div
                  style={{
                    position: 'absolute',
                    top: font.size * 0.14,
                    bottom: font.size * 0.1,
                    left: `${(-8 + sweeping.left * 116).toFixed(3)}%`,
                    width: `${(sweeping.width * 116).toFixed(3)}%`,
                    background: color,
                  }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </>
  );
};

export const TextPageView = ({
  page,
  props,
  frame,
  header,
}: {
  page: TextPage;
  props: Props;
  frame: number;
  header?: { height: number; render: (top: number) => ReactNode } | undefined;
}) => {
  const { layout, timing } = props;
  const rows = page.rows;
  const titleRows = rows.filter((row) => row.style === 'title');
  const bodyRows = rows.filter((row) => row.style !== 'title');
  const timings = rowTimings(bodyRows, page, timing);
  const titleTiming = rowTimings(titleRows.slice(0, 1), page, timing)[0];
  const titleFont = titleRows[0] ? rowFont(titleRows[0], props) : undefined;
  const titleHeight = titleFont ? titleFont.height * titleRows.length : 0;
  const fonts = bodyRows.map((row) => rowFont(row, props));
  const gaps = bodyRows.map((row, index) => {
    const previous = bodyRows[index - 1];
    if (previous === undefined) {
      return titleHeight > 0 || header ? layout.blockGap : 0;
    }
    return previous.block === row.block ? 0 : layout.blockGap;
  });
  const total =
    (header?.height ?? 0) +
    titleHeight +
    fonts.reduce((sum, font, index) => sum + font.height + (gaps[index] ?? 0), 0);
  let cursor = page.topAligned
    ? layout.textTop
    : Math.round((layout.textTop + layout.textBottom) / 2 - total / 2);
  const headerTop = cursor;
  cursor += header?.height ?? 0;
  const titleTop = cursor;
  cursor += titleHeight;
  const tops = fonts.map((font, index) => {
    cursor += gaps[index] ?? 0;
    const top = cursor;
    cursor += font.height;
    return top;
  });
  const erase = eraseStart(page, timing);
  const longest = Math.max(1, ...bodyRows.map((row) => Array.from(row.text).length));
  return (
    <>
      {header ? header.render(headerTop) : null}
      {titleFont && titleTiming ? (
        <BlockTitle
          lines={titleRows.map((row) => row.text)}
          font={titleFont}
          top={titleTop}
          timing={titleTiming}
          frame={frame}
          exit={erase - Math.round(timing.blockFrames * 0.4)}
          blockFrames={timing.blockFrames}
          color={page.look.titleColor}
        />
      ) : null}
      {bodyRows.map((row, index) => {
        const font = fonts[index];
        const rowTiming = timings[index];
        if (font === undefined || rowTiming === undefined) {
          return null;
        }
        return (
          <TypedRow
            key={index}
            row={row}
            font={font}
            top={tops[index] ?? 0}
            timing={rowTiming}
            frame={frame}
            erase={erase}
            longest={longest}
            props={props}
            color={row.accent ? page.look.titleColor : page.look.textColor}
          />
        );
      })}
    </>
  );
};

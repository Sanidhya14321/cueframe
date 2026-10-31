import { useId } from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import type { IncomingCallTeaserProps } from '@/schemas';
import { tween } from '../promo/timing';
import { TEASER_FONTS } from './fonts';
import { clamp01, mix } from './timeline';

type Wall = IncomingCallTeaserProps['wall'];

const PANEL_TOP = 60;
const RAIL_TOP = 1650;
const RAIL_HEIGHT = 120;
const SHELF_TOP = 1790;
const HANDLE_HIDDEN = 139;
const BAR = { x: 150, width: 780, y: 1120, height: 50 };
const SCREWS = [120, 330, 560, 790, 960];
const ZOOM_ORIGIN_Y = 790;

const pullEase = Easing.bezier(0.3, 0.55, 0.3, 1);
const driftEase = Easing.bezier(0.2, 0.6, 0.7, 0.85);

const Handle = ({ color, opacity }: { color: string; opacity: number }) => (
  <g
    opacity={opacity}
    fill="none"
    stroke={color}
    strokeWidth={14}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M 290 1766 L 290 1900 Q 560 1958 830 1900 L 830 1766" />
  </g>
);

export const LoadingWall = ({ wall, frame }: { wall: Wall; frame: number }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const pull = tween(frame, [0, wall.pullFrames], [1, 0], pullEase);
  const drift = tween(frame, [0, wall.frames], [0, 1], driftEase);
  const zoom = mix(wall.zoomFrom, wall.zoomTo, drift);
  const offset = -wall.pullDistance * pull;
  const tilt = wall.tilt * pull;
  const progress = mix(wall.progressFrom, wall.progressTo, Math.min(1, frame / wall.frames));
  const lines = wall.title.split('\n');
  const lineGap = wall.titleSize * 1.32;
  const titleTop = 783 - ((lines.length - 1) * lineGap) / 2;
  return (
    <AbsoluteFill style={{ filter: wall.softness > 0 ? `blur(${wall.softness}px)` : undefined }}>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        textRendering="geometricPrecision"
        aria-hidden
      >
        <defs>
          <radialGradient
            id={`light-${uid}`}
            gradientUnits="userSpaceOnUse"
            cx={560}
            cy={1300}
            r={820}
            gradientTransform="translate(560 1300) scale(1 0.8) translate(-560 -1300)"
          >
            <stop offset="0" stopColor={wall.panelLight} stopOpacity={wall.light} />
            <stop offset="0.35" stopColor={wall.panelLight} stopOpacity={wall.light * 0.62} />
            <stop offset="0.7" stopColor={wall.panelLight} stopOpacity={wall.light * 0.18} />
            <stop offset="1" stopColor={wall.panelLight} stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`lip-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000000" stopOpacity={0.55} />
            <stop offset="1" stopColor="#000000" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`rail-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity={0.35} />
            <stop offset="0.35" stopColor="#ffffff" stopOpacity={0} />
            <stop offset="1" stopColor="#000000" stopOpacity={0.3} />
          </linearGradient>
          <radialGradient id={`vignette-${uid}`} cx="0.55" cy="0.62" r="0.8">
            <stop offset="0.45" stopColor="#000000" stopOpacity={0} />
            <stop offset="1" stopColor="#000000" stopOpacity={wall.vignette} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill={wall.cabinet} />
        <g
          transform={`translate(540 ${ZOOM_ORIGIN_Y}) scale(${zoom}) translate(-540 ${-ZOOM_ORIGIN_Y + tilt})`}
        >
          <rect x={-400} y={-900} width={1880} height={800} fill={wall.shelf} />
          <rect x={-400} y={-108} width={1880} height={PANEL_TOP + 108} fill={wall.cabinet} />
          <rect x={-400} y={PANEL_TOP} width={1880} height={2400} fill={wall.slot} />
          <clipPath id={`below-lip-${uid}`}>
            <rect x={-400} y={PANEL_TOP} width={1880} height={2400} />
          </clipPath>
          <g clipPath={`url(#below-lip-${uid})`}>
            <g transform={`translate(0 ${offset})`}>
              {wall.showHandle ? (
                <Handle color={wall.panel} opacity={clamp01((-offset - HANDLE_HIDDEN) / 140)} />
              ) : null}
              <rect x={-400} y={-1400} width={1880} height={RAIL_TOP + 1400} fill={wall.panel} />
              <rect
                x={-400}
                y={-400}
                width={1880}
                height={RAIL_TOP + 400}
                fill={`url(#light-${uid})`}
              />
              {lines.map((line, index) => (
                <text
                  key={`${index}-${line}`}
                  x={540}
                  y={titleTop + index * lineGap + wall.titleSize * 0.33}
                  textAnchor="middle"
                  fontFamily={TEASER_FONTS.print}
                  fontWeight={700}
                  fontSize={wall.titleSize}
                  letterSpacing="-0.01em"
                  fill={wall.ink}
                  fillOpacity={0.9}
                >
                  {line}
                </text>
              ))}
              <text
                x={540}
                y={BAR.y - 32}
                textAnchor="middle"
                fontFamily={TEASER_FONTS.label}
                fontWeight={700}
                fontSize={wall.labelSize}
                fill={wall.ink}
                fillOpacity={0.85}
              >
                {wall.label}
              </text>
              <rect
                x={BAR.x}
                y={BAR.y}
                width={BAR.width}
                height={BAR.height}
                rx={BAR.height / 2}
                fill="none"
                stroke={wall.ink}
                strokeWidth={6}
              />
              <rect
                x={BAR.x + 12}
                y={BAR.y + 12}
                width={(BAR.width - 24) * progress}
                height={BAR.height - 24}
                rx={(BAR.height - 24) / 2}
                fill={wall.barFill}
              />
              <rect
                x={BAR.x + 12}
                y={BAR.y + 15}
                width={(BAR.width - 24) * progress}
                height={5}
                rx={2.5}
                fill="#ffffff"
                fillOpacity={0.3}
              />
              <rect x={-400} y={RAIL_TOP} width={1880} height={RAIL_HEIGHT} fill={wall.rail} />
              <rect
                x={-400}
                y={RAIL_TOP}
                width={1880}
                height={RAIL_HEIGHT}
                fill={`url(#rail-${uid})`}
              />
              {SCREWS.map((x) => (
                <ellipse
                  key={x}
                  cx={x}
                  cy={RAIL_TOP + 30}
                  rx={9}
                  ry={6}
                  fill="#1b2240"
                  fillOpacity={0.8}
                />
              ))}
            </g>
          </g>
          <rect x={-400} y={PANEL_TOP} width={1880} height={110} fill={`url(#lip-${uid})`} />
          <rect x={-400} y={SHELF_TOP} width={1880} height={900} fill={wall.shelf} />
          <rect x={-400} y={SHELF_TOP} width={1880} height={10} fill="#000000" fillOpacity={0.3} />
        </g>
        <rect width={1080} height={1920} fill={`url(#vignette-${uid})`} />
      </svg>
    </AbsoluteFill>
  );
};

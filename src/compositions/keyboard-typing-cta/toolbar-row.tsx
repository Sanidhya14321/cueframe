import type { CSSProperties } from 'react';
import type { KeyboardTypingCtaProps } from '@/schemas';
import { bodyFont } from '../promo/fonts';
import { TOOL_ICONS, Tool } from './icons';
import { ROW_Y, SUGGESTION_X, TOOL_X } from './layout';
import type { WordLayer } from './schedule';

type KeyboardLook = KeyboardTypingCtaProps['keyboard'];

const ICON = 46;

const iconAt = (x: number): CSSProperties => ({
  position: 'absolute',
  left: x - ICON / 2,
  top: ROW_Y.tools - ICON / 2,
});

export const ToolIcons = ({ look, opacity }: { look: KeyboardLook; opacity: number }) =>
  opacity <= 0 ? null : (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {TOOL_ICONS.slice(1, 5).map((icon, index) => (
        <div key={icon} style={iconAt(TOOL_X[index + 1] ?? 0)}>
          <Tool icon={icon} color={look.ink} size={ICON} />
        </div>
      ))}
    </div>
  );

export const FixedTools = ({ look }: { look: KeyboardLook }) => (
  <>
    <div style={iconAt(TOOL_X[0])}>
      <Tool icon="grid" color={look.ink} size={ICON} />
    </div>
    <div style={iconAt(TOOL_X[5])}>
      <Tool icon="mic" color={look.ink} size={ICON} />
    </div>
  </>
);

export const SuggestionStrip = ({
  look,
  slots,
  opacity,
}: {
  look: KeyboardLook;
  slots: readonly (readonly WordLayer[])[];
  opacity: number;
}) =>
  opacity <= 0 ? null : (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {slots.flatMap((layers, index) =>
        layers.map(({ word, opacity: shown, since }) => (
          <div
            key={`word-${SUGGESTION_X[index]}-${since}`}
            style={{
              color: `color-mix(in srgb, ${look.ink} ${(shown * 100).toFixed(1)}%, transparent)`,
              position: 'absolute',
              left: (SUGGESTION_X[index] ?? 0) - 120,
              width: 240,
              top: ROW_Y.tools - 20,
              textAlign: 'center',
              fontFamily: bodyFont,
              fontSize: look.labelSize * 0.7,
              lineHeight: 1,
              fontWeight: index === 1 ? 500 : 400,
            }}
          >
            {word}
          </div>
        )),
      )}
      {[358, 625].map((x) => (
        <div
          key={`rule-${x}`}
          style={{
            position: 'absolute',
            left: x,
            top: ROW_Y.tools - 22,
            width: 2,
            height: 44,
            background: `color-mix(in srgb, ${look.hint} 30%, transparent)`,
          }}
        />
      ))}
    </div>
  );

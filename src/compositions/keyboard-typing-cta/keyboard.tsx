import type { CSSProperties, ReactNode } from 'react';
import type { KeyboardTypingCtaProps } from '@/schemas';
import { bodyFont } from '../promo/fonts';
import { tween } from '../promo/timing';
import { BackspaceIcon, ChevronIcon, EnterIcon, GlobeIcon, KeyboardIcon, ShiftIcon } from './icons';
import { KEY, KEYBOARD_LAYOUT, type KeySpec, type LayerId, PANEL, ROW_Y } from './layout';
import { blendedValue, keyboardMode, suggestions, wordLayers } from './schedule';
import { FixedTools, SuggestionStrip, ToolIcons } from './toolbar-row';
import type { KeyState, KeyStep, TypingPlan } from './typing-plan';

type KeyboardLook = KeyboardTypingCtaProps['keyboard'];

const WORD_FADE = 6;

const linear = (t: number) => t;
const POP_IN = 6;
const MODE_FRAMES = 10;

const mix = (hex: string, opacity: number) =>
  `color-mix(in srgb, ${hex} ${Math.round(opacity * 100)}%, transparent)`;

const sameSpot = (left: KeySpec, right: KeySpec) =>
  left.id === right.id && left.x === right.x && left.y === right.y;

const SHARED = KEYBOARD_LAYOUT.letters.filter((key) =>
  KEYBOARD_LAYOUT.symbols.some((other) => sameSpot(key, other)),
);

const ownKeys = (layer: LayerId) =>
  KEYBOARD_LAYOUT[layer].filter((key) => !SHARED.some((shared) => sameSpot(key, shared)));

const LAYER_KEYS: Record<LayerId, KeySpec[]> = {
  letters: ownKeys('letters'),
  symbols: ownKeys('symbols'),
};

const envelope = (since: number, hold: number): number =>
  since <= 0 ? tween(since, [-POP_IN, 0], [0, 1], linear) : tween(since, [0, hold], [1, 0], linear);

const stepGlow = (step: KeyStep, frame: number, hold: number): number =>
  envelope(frame - step.frame, hold);

const pressGlow = (
  plan: TypingPlan,
  key: KeySpec,
  layer: LayerId | undefined,
  frame: number,
  hold: number,
): number =>
  plan.steps.reduce(
    (glow, step) =>
      step.key.id === key.id && (layer === undefined || step.layer === layer)
        ? Math.max(glow, stepGlow(step, frame, hold))
        : glow,
    0,
  );

const labelStyle = (look: KeyboardLook, size: number): CSSProperties => ({
  fontFamily: bodyFont,
  fontSize: size,
  fontWeight: 400,
  color: look.ink,
  lineHeight: 1,
});

const Cap = ({
  spec,
  look,
  glow,
  fill,
  children,
}: {
  spec: KeySpec;
  look: KeyboardLook;
  glow: number;
  fill?: string | undefined;
  children?: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: spec.x - spec.width / 2,
      top: spec.y - KEY.height / 2,
      width: spec.width,
      height: KEY.height,
      borderRadius: KEY.radius,
      background: fill ?? mix(look.key, Math.min(1, look.keyOpacity + glow * 0.4)),
      boxShadow: `inset 0 -3px 0 ${mix(look.hint, 0.12)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}
  >
    {glow > 0 ? (
      <div
        style={{ position: 'absolute', inset: 0, background: look.accent, opacity: glow * 0.22 }}
      />
    ) : null}
    {children}
  </div>
);

const CaseLabel = ({ label, look, upper }: { label: string; look: KeyboardLook; upper: number }) =>
  label.toUpperCase() === label ? (
    <span style={labelStyle(look, look.labelSize)}>{label}</span>
  ) : (
    <>
      <span style={{ ...labelStyle(look, look.labelSize), position: 'absolute', opacity: upper }}>
        {label.toUpperCase()}
      </span>
      <span
        style={{ ...labelStyle(look, look.labelSize), position: 'absolute', opacity: 1 - upper }}
      >
        {label}
      </span>
    </>
  );

const KeyFace = ({ spec, look, upper }: { spec: KeySpec; look: KeyboardLook; upper: number }) => {
  switch (spec.icon) {
    case 'shift':
      return (
        <>
          <div style={{ position: 'absolute', opacity: 1 - upper }}>
            <ShiftIcon color={look.ink} filled={false} size={44} />
          </div>
          <div style={{ position: 'absolute', opacity: upper }}>
            <ShiftIcon color={look.accent} filled size={44} />
          </div>
        </>
      );
    case 'backspace':
      return <BackspaceIcon color={look.ink} size={44} />;
    case 'globe':
      return <GlobeIcon color={look.ink} size={44} />;
    case 'enter':
      return <EnterIcon color={look.iconInk} size={50} />;
    default:
      return spec.output === undefined ? (
        <span style={{ ...labelStyle(look, look.labelSize * 0.6), fontWeight: 600 }}>
          {spec.label}
        </span>
      ) : (
        <CaseLabel label={spec.label} look={look} upper={upper} />
      );
  }
};

const Popup = ({
  step,
  frame,
  look,
  hold,
}: {
  step: KeyStep;
  frame: number;
  look: KeyboardLook;
  hold: number;
}) => {
  const since = frame - step.frame;
  if (step.kind !== 'char' || step.char === ' ' || since < -POP_IN || since > hold) {
    return null;
  }
  const opacity = envelope(since, hold);
  const width = KEY.width + 16;
  const height = KEY.height * 1.2;
  return (
    <div
      style={{
        position: 'absolute',
        left: step.key.x - width / 2,
        top: step.key.y - KEY.height / 2 - height + 18,
        width,
        height,
        borderRadius: 26,
        background: mix(look.popup, 0.95),
        boxShadow: `0 6px 18px ${mix(look.ink, 0.16)}`,
        borderBottom: `5px solid ${look.accent}`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...labelStyle(look, look.labelSize * 1.25),
        fontWeight: 500,
      }}
    >
      {step.char}
    </div>
  );
};

const stateAfter = (plan: TypingPlan, index: number): KeyState =>
  plan.steps[index]?.state ?? plan.initial;

const typedAfter = (plan: TypingPlan, index: number): number => plan.steps[index]?.typed ?? 0;

const KeySet = ({
  keys,
  layer,
  look,
  plan,
  frame,
  upper,
}: {
  keys: KeySpec[];
  layer: LayerId | undefined;
  look: KeyboardLook;
  plan: TypingPlan;
  frame: number;
  upper: number;
}) =>
  keys.map((spec) => (
    <Cap
      key={`${layer ?? 'shared'}-${spec.id}`}
      spec={spec}
      look={look}
      glow={pressGlow(plan, spec, layer, frame, look.popupFrames)}
      fill={spec.icon === 'enter' ? look.enter : undefined}
    >
      <KeyFace spec={spec} look={look} upper={upper} />
    </Cap>
  ));

export const Keyboard = ({
  look,
  plan,
  frame,
  offset,
}: {
  look: KeyboardLook;
  plan: TypingPlan;
  frame: number;
  offset: number;
}) => {
  const symbols = blendedValue(
    plan,
    frame,
    (index) => (stateAfter(plan, index).layer === 'symbols' ? 1 : 0),
    look.swapFrames,
  );
  const upper = blendedValue(
    plan,
    frame,
    (index) => (stateAfter(plan, index).shift ? 1 : 0),
    look.swapFrames,
  );
  const tools = blendedValue(
    plan,
    frame,
    (index) => (keyboardMode(plan.text, typedAfter(plan, index)) === 'upper-tools' ? 1 : 0),
    MODE_FRAMES,
  );
  const slots = [0, 1, 2].map((slot) =>
    wordLayers(
      plan,
      frame,
      (index) => suggestions(plan.text, typedAfter(plan, index))[slot] ?? '',
      WORD_FADE,
    ),
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: PANEL.left + look.x,
        top: look.y + offset,
        width: PANEL.width,
        height: PANEL.height,
        transform: `scale(${look.scale})`,
        transformOrigin: '50% 0%',
        background: mix(look.panel, look.panelOpacity),
        borderRadius: 40,
        boxShadow: `inset 0 2px 0 ${mix('#ffffff', 0.45)}, 0 24px 60px ${mix(look.ink, 0.1)}`,
        filter: look.softness > 0 ? `blur(${look.softness}px)` : undefined,
      }}
    >
      <FixedTools look={look} />
      <ToolIcons look={look} opacity={tools} />
      <SuggestionStrip look={look} slots={slots} opacity={1 - tools} />
      <KeySet keys={SHARED} layer={undefined} look={look} plan={plan} frame={frame} upper={0} />
      {symbols < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - symbols }}>
          <KeySet
            keys={LAYER_KEYS.letters}
            layer="letters"
            look={look}
            plan={plan}
            frame={frame}
            upper={upper}
          />
        </div>
      ) : null}
      {symbols > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: symbols }}>
          <KeySet
            keys={LAYER_KEYS.symbols}
            layer="symbols"
            look={look}
            plan={plan}
            frame={frame}
            upper={0}
          />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 141 - 20, top: ROW_Y.nav - 20 }}>
        <ChevronIcon color={look.hint} size={40} />
      </div>
      <div style={{ position: 'absolute', left: 846 - 20, top: ROW_Y.nav - 20 }}>
        <KeyboardIcon color={look.hint} size={40} />
      </div>
      {plan.steps.map((step) => (
        <Popup
          key={`${step.frame}-${step.key.id}`}
          step={step}
          frame={frame}
          look={look}
          hold={look.popupFrames}
        />
      ))}
    </div>
  );
};

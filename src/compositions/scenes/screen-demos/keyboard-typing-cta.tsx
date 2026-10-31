import { useMemo } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type KeyboardTypingCtaProps,
  keyboardTypingCtaDefaults,
  keyboardTypingCtaMeta,
  keyboardTypingCtaSchema,
} from '@/schemas';
import { EndCard } from '../../keyboard-typing-cta/end-card';
import { FilmGrain } from '../../keyboard-typing-cta/grain';
import type { HandSide } from '../../keyboard-typing-cta/hand-assign';
import {
  handCue,
  handSetup,
  handWaypoints,
  panelToScreen,
} from '../../keyboard-typing-cta/hand-path';
import { Keyboard } from '../../keyboard-typing-cta/keyboard';
import { ENTER_KEY, KEYBOARD_LAYOUT } from '../../keyboard-typing-cta/layout';
import { cursorOpacity, typedCount } from '../../keyboard-typing-cta/schedule';
import { TypingHand } from '../../keyboard-typing-cta/typing-hand';
import { planTyping, type TypingPlan } from '../../keyboard-typing-cta/typing-plan';
import { MessagePill, Plant, WallBackdrop, Watermark } from '../../keyboard-typing-cta/wall';
import { pixelTween, settle, smooth, turn, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const linear = (t: number) => t;

const SIDES: HandSide[] = ['left', 'right'];

const CHAR_FADE = 6;

const charFades = (plan: TypingPlan, frame: number): number[] =>
  plan.steps
    .filter((step) => step.kind === 'char')
    .map((step) => tween(frame, [step.frame - 1, step.frame + CHAR_FADE - 1], [0, 1], smooth));

const TypingScene = ({
  props,
  plan,
  points,
  frame,
}: {
  props: KeyboardTypingCtaProps;
  plan: TypingPlan;
  points: Record<HandSide, ReturnType<typeof handWaypoints>>;
  frame: number;
}) => {
  const { copy, wall, keyboard, hand, timing, look } = props;
  const enter = plan.steps.find((step) => step.kind === 'enter')?.frame;
  const firstPress = plan.steps.find((step) => step.kind === 'char')?.frame ?? timing.typeStart;
  const sent = enter === undefined ? 0 : tween(frame, [enter + 1, enter + 15], [0, 1], smooth);
  const pulse =
    enter === undefined
      ? 0
      : tween(frame, [enter - 2, enter + 3], [0, 1], smooth) *
        tween(frame, [enter + 3, enter + 16], [1, 0], smooth);
  const keyboardRange: [number, number] = [
    timing.keyboardIn,
    timing.keyboardIn + timing.keyboardFrames,
  ];
  const pillRange: [number, number] = [timing.cursorAt - 26, timing.cursorAt - 4];
  const watermark =
    tween(frame, [0, 12], [0.2, 1]) *
    tween(frame, [timing.handExit + 8, timing.handExit + 22], [1, 0]);
  return (
    <AbsoluteFill>
      {look.showBackdrop ? <WallBackdrop wall={wall} /> : null}
      {frame >= pillRange[0] ? (
        <AbsoluteFill
          style={{
            opacity: tween(frame, pillRange, [0, 1], linear),
            transform: `translateY(${pixelTween(frame, pillRange, [28, 0], settle)}px)`,
          }}
        >
          <MessagePill
            look={keyboard}
            text={plan.text.slice(0, typedCount(plan, frame))}
            caret={cursorOpacity(plan, frame, timing.cursorAt) * (1 - sent)}
            placeholder={tween(frame, [firstPress - 5, firstPress], [0.6, 0], linear)}
            placeholderText={copy.placeholder}
            fade={charFades(plan, frame)}
            sent={sent}
            pulse={pulse}
          />
        </AbsoluteFill>
      ) : null}
      {frame >= keyboardRange[0] ? (
        <AbsoluteFill style={{ opacity: tween(frame, keyboardRange, [0, 1], smooth) }}>
          <Keyboard
            look={keyboard}
            plan={plan}
            frame={frame}
            offset={pixelTween(frame, keyboardRange, [keyboard.rise, 0], settle)}
          />
        </AbsoluteFill>
      ) : null}
      {hand.show && frame >= timing.handIn - 1 ? (
        <TypingHand
          look={hand}
          hands={SIDES.filter((side) => frame < (points[side].at(-1)?.frame ?? 0)).map((side) => ({
            side,
            cue: handCue(props, points[side], side, frame),
          }))}
        />
      ) : null}
      {wall.showPlant ? <Plant wall={wall} sway={frame} /> : null}
      <Watermark wall={wall} text={copy.watermark} opacity={watermark} />
    </AbsoluteFill>
  );
};

const irisRadius = (center: [number, number], width: number, height: number): number =>
  1.01 *
  Math.max(
    ...[
      [0, 0],
      [width, 0],
      [0, height],
      [width, height],
    ].map(([x = 0, y = 0]) => Math.hypot(x - center[0], y - center[1])),
  );

const KeyboardTypingCta = (props: KeyboardTypingCtaProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { copy, timing, keyboard, look } = props;
  const plan = useMemo(
    () =>
      planTyping(
        copy.typed,
        KEYBOARD_LAYOUT,
        {
          start: timing.typeStart,
          end: timing.typeEnd,
          maxKeyFrames: timing.maxKeyFrames,
          rhythm: timing.rhythm,
          wordPause: timing.wordPause,
          switchPause: timing.switchPause,
          submit: timing.submit,
        },
        handSetup(props),
      ),
    [copy.typed, timing, props],
  );
  const points = useMemo(
    () => ({
      left: handWaypoints(props, plan, 'left'),
      right: handWaypoints(props, plan, 'right'),
    }),
    [props, plan],
  );
  const enterKey = KEYBOARD_LAYOUT.letters.find((key) => key.id === ENTER_KEY);
  const center = panelToScreen(
    enterKey === undefined ? [0, 0] : [enterKey.x, enterKey.y],
    keyboard,
  );
  const opened = timing.cut + timing.irisFrames;
  const radius = tween(
    frame,
    [timing.cut, opened],
    [0, irisRadius(center, keyboardTypingCtaMeta.width, keyboardTypingCtaMeta.height)],
    turn,
  );
  return (
    <TransitionFrame motion={props.motion}>
      {frame < opened ? (
        <TypingScene props={props} plan={plan} points={points} frame={frame} />
      ) : null}
      {frame >= timing.cut ? (
        <AbsoluteFill
          style={{
            clipPath:
              frame < opened
                ? `circle(${radius.toFixed(2)}px at ${center[0].toFixed(1)}px ${center[1].toFixed(1)}px)`
                : undefined,
          }}
        >
          <EndCard props={props} frame={frame} />
        </AbsoluteFill>
      ) : null}
      {look.showBackdrop ? (
        <FilmGrain
          amount={look.grain}
          live={look.liveGrain}
          frame={frame}
          dark={frame >= timing.cut + timing.irisFrames / 2}
        />
      ) : null}
    </TransitionFrame>
  );
};

export const keyboardTypingCtaScene: SceneModule = {
  id: 'keyboard-typing-cta',
  component: KeyboardTypingCta,
  render: (key) => (
    <Composition
      key={key}
      id="keyboard-typing-cta"
      component={KeyboardTypingCta}
      schema={keyboardTypingCtaSchema}
      defaultProps={keyboardTypingCtaDefaults}
      durationInFrames={keyboardTypingCtaMeta.durationInFrames}
      fps={keyboardTypingCtaMeta.fps}
      width={keyboardTypingCtaMeta.width}
      height={keyboardTypingCtaMeta.height}
    />
  ),
};

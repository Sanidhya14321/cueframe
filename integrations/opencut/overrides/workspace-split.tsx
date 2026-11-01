/* biome-ignore-all lint/complexity/useLiteralKeys: native records require indexed access under strict TypeScript */
import { type KeyboardEvent, type PointerEvent, useEffect, useState } from 'react';

const STORAGE_KEY = 'cueframe-timeline-height';
const MIN_HEIGHT = 140;
const TOP_RESERVE = 200;
const KEY_STEP = 24;

const clampHeight = (value: number) =>
  Math.round(Math.min(window.innerHeight - TOP_RESERVE, Math.max(MIN_HEIGHT, value)));
const applyHeight = (value: number) =>
  document.documentElement.style.setProperty('--cueframe-timeline-height', `${value}px`);
const remember = (value: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    return;
  }
};
const recall = () => {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

export function TimelineDivider() {
  const [height, setHeight] = useState<number | null>(null);
  const update = (value: number) => {
    const next = clampHeight(value);
    setHeight(next);
    applyHeight(next);
    remember(next);
  };
  useEffect(() => {
    const saved = recall();
    if (saved) {
      const next = clampHeight(saved);
      setHeight(next);
      applyHeight(next);
    }
    const dock = (event: MessageEvent<{ type?: string; open?: boolean }>) => {
      if (event.origin === location.origin && event.data?.type === 'cueframe-dock') {
        document.documentElement.dataset['dock'] = String(event.data.open === true);
      }
    };
    window.addEventListener('message', dock);
    return () => window.removeEventListener('message', dock);
  }, []);
  const drag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons === 1) {
      update(window.innerHeight - event.clientY);
    }
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowUp: KEY_STEP, ArrowDown: -KEY_STEP }[event.key];
    if (step) {
      event.preventDefault();
      update((height ?? window.innerHeight * 0.34) + step);
    }
  };
  return (
    // biome-ignore lint/a11y/useSemanticElements: a focusable separator with a value has no native element
    <div
      aria-label="Resize timeline"
      aria-orientation="horizontal"
      aria-valuemax={window.innerHeight - TOP_RESERVE}
      aria-valuemin={MIN_HEIGHT}
      aria-valuenow={height ?? Math.round(window.innerHeight * 0.34)}
      className="native-split"
      onKeyDown={keys}
      onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
      onPointerMove={drag}
      role="separator"
      tabIndex={0}
    />
  );
}

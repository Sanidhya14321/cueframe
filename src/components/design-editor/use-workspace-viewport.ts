'use client';

import { type RefObject, useEffect, useLayoutEffect, useState } from 'react';

export interface Viewport {
  width: number;
  height: number;
}

export const useViewportSize = (
  ref: RefObject<HTMLElement | null>,
  onChange: (viewport: Viewport) => void,
): Viewport => {
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const container = ref.current;
    if (container === null) {
      return;
    }
    const update = () => {
      const next = { width: container.clientWidth, height: container.clientHeight };
      setViewport(next);
      onChange(next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [ref, onChange]);

  return viewport;
};

export const useSpaceHeld = (): boolean => {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !(event.target instanceof HTMLTextAreaElement)) {
        setHeld(true);
      }
    };
    const up = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setHeld(false);
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return held;
};

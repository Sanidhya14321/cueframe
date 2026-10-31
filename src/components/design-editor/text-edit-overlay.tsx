'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cssFontFamily, firstFillColor, type Point, type TextElement } from '@/design';

interface TextEditOverlayProps {
  element: TextElement;
  zoom: number;
  offset: Point;
  onCommit: (text: string) => void;
}

export const TextEditOverlay = ({ element, zoom, offset, onCommit }: TextEditOverlayProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(element.text);
  const committed = useRef(false);

  const commit = () => {
    if (committed.current) {
      return;
    }
    committed.current = true;
    onCommit(value);
  };

  useEffect(() => {
    const textarea = ref.current;
    textarea?.focus();
    textarea?.select();
  }, []);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (textarea === null) {
      return;
    }
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  });

  return (
    <textarea
      ref={ref}
      aria-label="Edit text"
      rows={1}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === 'Escape' || (event.key === 'Enter' && (event.metaKey || event.ctrlKey))) {
          event.preventDefault();
          commit();
        }
      }}
      spellCheck={false}
      className="absolute resize-none overflow-hidden border-0 bg-transparent p-0 outline outline-2 outline-violet-500"
      style={{
        left: offset.x + element.x * zoom,
        top: offset.y + element.y * zoom,
        width: element.width * zoom,
        transform: `rotate(${element.rotation}deg)`,
        transformOrigin: 'top left',
        fontFamily: cssFontFamily(element.fontFamily),
        fontSize: element.fontSize * zoom,
        fontWeight: element.fontWeight,
        fontStyle: element.italic ? 'italic' : 'normal',
        lineHeight: element.lineHeight,
        letterSpacing: element.letterSpacing * zoom,
        textAlign: element.align,
        textTransform: element.uppercase ? 'uppercase' : 'none',
        color: firstFillColor(element.fill),
        caretColor: '#8b5cf6',
      }}
    />
  );
};

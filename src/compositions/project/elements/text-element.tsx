import { useVideoConfig } from 'remotion';
import type { TextElement } from '@/project';

export const TextElementView = ({ element }: { element: TextElement }) => {
  const { width } = useVideoConfig();
  return (
    <div
      style={{
        color: element.color,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fontWeight: 700,
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.1,
        width: 'max-content',
        maxWidth: width * 0.8,
      }}
    >
      {element.content}
    </div>
  );
};

import type { TextElement } from '@/project';

export const TextElementView = ({ element }: { element: TextElement }) => (
  <div
    style={{
      color: element.color,
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      fontWeight: 700,
      textAlign: 'center',
      whiteSpace: 'pre-wrap',
      lineHeight: 1.1,
      maxWidth: '80%',
    }}
  >
    {element.content}
  </div>
);

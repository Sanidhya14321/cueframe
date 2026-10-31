import { z } from 'zod';
import { zColor, zSlider } from '../../control';
import { defineControls } from '../../control-layout';
export const webMotionSchema = z.object({
  text: z.string().min(1).max(80),
  subtitle: z.string().max(120),
  primary: zColor(),
  background: zColor(),
  textColor: zColor(),
  surface: zColor(),
  font: z.enum(['Inter', 'Instrument Serif']),
  size: zSlider({ min: 40, max: 200, step: 1 }),
  speed: zSlider({ min: 0.25, max: 3, step: 0.05 }),
  delay: zSlider({ min: 0, max: 60, step: 1 }),
  amount: zSlider({ min: 3, max: 40, step: 1 }),
  value: zSlider({ min: 0, max: 9999, step: 1 }),
});
export type WebMotionProps = z.infer<typeof webMotionSchema>;
export const webMotionDefaults: WebMotionProps = {
  text: 'MAKE YOUR NEXT MOVE',
  subtitle: 'Ideas in motion. Yours to edit.',
  primary: '#a78bfa',
  background: '#0b0d17',
  textColor: '#f5f3ff',
  surface: '#1c2035',
  font: 'Inter',
  size: 112,
  speed: 1,
  delay: 4,
  amount: 16,
  value: 240,
};
export const webMotionControls = defineControls<WebMotionProps>({
  sections: [
    { title: 'Message', fields: ['text', 'subtitle'] },
    {
      title: 'Colors',
      fields: [
        { path: 'primary', label: 'Primary color' },
        { path: 'background', label: 'Background color' },
        { path: 'textColor', label: 'Text color' },
        { path: 'surface', label: 'Surface color' },
      ],
    },
    { title: 'Typography', fields: ['font', 'size'] },
    { title: 'Motion', fields: ['speed', 'delay'], more: ['amount', 'value'] },
  ],
});

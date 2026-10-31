import { defineControls } from '../../control-layout';
import { MOTION } from '../../control-presets';
import type { StreetSignSwapProps } from './street-sign-swap';

export const streetSignSwapControls = defineControls<StreetSignSwapProps>({
  sections: [
    {
      title: 'Question board',
      fields: [
        { path: 'question.brand', label: 'Brand', hint: 'Bold line on the white board' },
        {
          path: 'question.opening',
          label: 'Words before the brand',
          hint: 'Serif lines above the brand; each line is a row',
        },
        {
          path: 'question.closing',
          label: 'Words after the brand',
          hint: 'Serif lines under the brand; each line is a row',
        },
      ],
      more: [
        { path: 'question.size', label: 'Text size' },
        {
          path: 'question.left',
          label: 'Text left edge',
          hint: 'Share of the board width from its left edge',
        },
        {
          path: 'question.top',
          label: 'First line height',
          hint: 'Share of the board height from its top',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        { path: 'ink.board', label: 'Primary color', hint: 'The answer board' },
        {
          link: ['ink.question', 'ink.questionBrand'],
          label: 'Text color',
          hint: 'Every line on the white question board',
        },
        {
          link: ['ink.answer', 'ink.border'],
          label: 'Secondary color',
          hint: 'Text and border rim on the answer board',
        },
      ],
      more: [
        { path: 'ink.question', label: 'Question words' },
        { path: 'ink.questionBrand', label: 'Question brand' },
        { path: 'ink.answer', label: 'Answer text' },
        { path: 'ink.border', label: 'Answer board rim' },
      ],
    },
    {
      title: 'Answer board',
      fields: [
        { path: 'answer.line', label: 'Answer', hint: 'Serif line on the green board' },
        { path: 'answer.address', label: 'Address', hint: 'Bold line under the answer' },
      ],
      more: [
        { path: 'answer.size', label: 'Text size' },
        {
          path: 'answer.top',
          label: 'Answer height',
          hint: 'Share of the board height from its top',
        },
        {
          path: 'print.border',
          label: 'Extra rim',
          hint: 'Prints a rim inside the filmed white edge, as a share of the board width; 0 leaves only the filmed edge',
        },
      ],
    },
    {
      title: 'Camera',
      fields: [
        {
          path: 'camera.zoom',
          label: 'Closeness',
          hint: 'How far the camera crops in; 1 shows the whole footage',
        },
        {
          path: 'camera.follow',
          label: 'Follow the board',
          hint: 'How much the framing glides with the board; 0 stays centered',
        },
      ],
      more: [
        {
          path: 'camera.headroom',
          label: 'Headroom',
          hint: 'Share of the frame height to aim above the board, so faces stay in view',
        },
      ],
    },
    {
      title: 'Print',
      fields: [],
      more: [
        {
          path: 'print.strength',
          label: 'Ink strength',
          hint: 'How solid the printing looks on the boards',
        },
        {
          path: 'print.shading',
          label: 'Follow the board light',
          hint: 'Shades the print with the filmed boards; 0 keeps it flat',
        },
        {
          path: 'print.softness',
          label: 'Print softness',
          hint: 'Blurs the print to match the footage; 0 is sharp',
        },
      ],
    },
    {
      title: 'Motion',
      fields: [],
      more: [MOTION.enter, MOTION.enterFrames, MOTION.exit, MOTION.exitFrames],
    },
  ],
  hidden: ['motion.float', 'motion.speed'],
});

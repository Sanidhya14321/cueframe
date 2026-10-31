import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { StreetSignSwapProps } from '@/schemas';
import { TrackedPrint } from '../footage/tracked-print';
import { drawSign, type SignSide } from './sign-art';
import { useSignFonts } from './sign-fonts';

const ANSWER_KEY = { chroma: [0.415, 0.404], reach: 0.05 } as const;
const QUESTION_WHITE = 0.75;
const ANSWER_WHITE = 0.25;

const useSignTexture = (side: SignSide, props: StreetSignSwapProps): THREE.Texture => {
  useSignFonts();
  const { question, answer, ink, print } = props;
  const { softness, border } = print;
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    drawSign(canvas, side, { question, answer, ink, print: { softness, border } });
    const made = new THREE.CanvasTexture(canvas);
    made.colorSpace = THREE.SRGBColorSpace;
    made.anisotropy = 16;
    return made;
  }, [side, question, answer, ink, softness, border]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

export const SignPrints = ({ props }: { props: StreetSignSwapProps }) => {
  const question = useSignTexture('question', props);
  const answer = useSignTexture('answer', props);
  const { strength, shading } = props.print;
  return (
    <>
      <TrackedPrint
        name="question"
        map={question}
        strength={strength}
        shading={shading}
        paperWhite={QUESTION_WHITE}
      />
      <TrackedPrint
        name="answer"
        map={answer}
        strength={strength}
        shading={shading}
        paperWhite={ANSWER_WHITE}
        colorKey={ANSWER_KEY}
      />
    </>
  );
};

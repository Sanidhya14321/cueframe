import type { ReactNode } from 'react';
import type { PickerAura, PromoLook, PromoMotion } from '@/schemas';
import { Backdrop } from '../promo/backdrop';
import { TransitionFrame } from '../promo/transition-frame';
import { Aura } from './aura';

export const PickerLayer = ({
  look,
  aura,
  motion,
  focusX = 50,
  children,
}: {
  look: PromoLook;
  aura: PickerAura;
  motion: PromoMotion;
  focusX?: number;
  children: ReactNode;
}) => (
  <TransitionFrame motion={motion}>
    {look.showBackdrop ? (
      <>
        <Backdrop look={look} focusX={focusX} />
        <Aura aura={aura} />
      </>
    ) : null}
    {children}
  </TransitionFrame>
);

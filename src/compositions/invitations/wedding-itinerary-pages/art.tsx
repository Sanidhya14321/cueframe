import type { ItineraryPageLook, WeddingItineraryPagesProps } from '@/schemas';
import { dark, Linear, light, mix, Radial } from './paint';

export type Art = {
  id: string;
  frame: number;
  sway: number;
  twinkle: number;
  fireworks: boolean;
  night: number;
  sky: string;
  horizon: string;
  leaf: WeddingItineraryPagesProps['greenery'];
  bloom: WeddingItineraryPagesProps['blooms'];
  stone: WeddingItineraryPagesProps['stone'];
  decor: WeddingItineraryPagesProps['decor'];
};

const NIGHT = '#0a1626';

const dim = <T extends Record<string, string>>(group: T, amount: number): T =>
  Object.fromEntries(
    Object.entries(group).map(([key, value]) => [key, mix(value, NIGHT, amount)]),
  ) as T;

export const resolveArt = (
  props: WeddingItineraryPagesProps,
  look: ItineraryPageLook,
  id: string,
  frame: number,
): Art => ({
  id,
  frame,
  sway: props.scenery.sway,
  twinkle: props.scenery.twinkle,
  fireworks: props.scenery.fireworks,
  night: look.night,
  sky: look.sky,
  horizon: look.horizon,
  leaf: dim(props.greenery, look.night),
  bloom: dim(props.blooms, look.night * 0.6),
  stone: dim(props.stone, look.night * 0.7),
  decor: {
    ...dim(props.decor, look.night * 0.6),
    crystal: props.decor.crystal,
    glow: props.decor.glow,
  },
});

const BUSH_TONES = ['deep', 'dark', 'mid', 'olive', 'light'] as const;

export type BushTone = (typeof BUSH_TONES)[number];

export const bushColors = (art: Art, tone: BushTone): [string, string, string] => {
  const { leaf } = art;
  const olive = mix(leaf.mid, '#8c7a2c', 0.45);
  switch (tone) {
    case 'deep':
      return [dark(leaf.dark, 0.35), dark(leaf.dark, 0.12), mix(leaf.dark, leaf.mid, 0.35)];
    case 'dark':
      return [dark(leaf.dark, 0.2), leaf.dark, mix(leaf.dark, leaf.light, 0.45)];
    case 'olive':
      return [dark(olive, 0.35), olive, light(olive, 0.3)];
    case 'light':
      return [leaf.mid, leaf.light, light(leaf.light, 0.35)];
    default:
      return [dark(leaf.mid, 0.3), leaf.mid, mix(leaf.mid, leaf.light, 0.7)];
  }
};

export const gid = (art: Art, name: string): string => `${art.id}-${name}`;

export const fill = (art: Art, name: string): string => `url(#${art.id}-${name})`;

export const ArtDefs = ({ art }: { art: Art }) => {
  const { stone, leaf, decor } = art;
  return (
    <defs>
      {BUSH_TONES.map((tone) => {
        const [shadow, base, top] = bushColors(art, tone);
        return (
          <Linear
            key={tone}
            id={gid(art, `bush-${tone}`)}
            stops={[
              [0, top],
              [0.45, base],
              [1, shadow],
            ]}
          />
        );
      })}
      <Linear
        id={gid(art, 'mist')}
        stops={[
          [0, light(leaf.mist, 0.25)],
          [0.7, leaf.mist],
          [1, mix(leaf.mist, art.horizon, 0.5)],
        ]}
      />
      <Linear
        id={gid(art, 'lawn')}
        stops={[
          [0, mix(leaf.lawn, leaf.light, 0.35)],
          [0.35, leaf.lawn],
          [1, dark(leaf.lawn, 0.28)],
        ]}
      />
      <Linear
        id={gid(art, 'cream')}
        x2={1}
        y2={0}
        stops={[
          [0, light(stone.cream, 0.35)],
          [0.45, stone.cream],
          [1, stone.shade],
        ]}
      />
      <Linear
        id={gid(art, 'creamV')}
        stops={[
          [0, light(stone.cream, 0.3)],
          [1, mix(stone.cream, stone.shade, 0.6)],
        ]}
      />
      <Linear
        id={gid(art, 'marble')}
        x2={1}
        y2={0}
        stops={[
          [0, light(stone.marble, 0.5)],
          [0.5, stone.marble],
          [1, mix(stone.marble, stone.shade, 0.45)],
        ]}
      />
      <Linear
        id={gid(art, 'trunk')}
        x2={1}
        y2={0}
        stops={[
          [0, light(leaf.trunk, 0.2)],
          [0.6, leaf.trunk],
          [1, dark(leaf.trunk, 0.35)],
        ]}
      />
      <Radial
        id={gid(art, 'glow')}
        stops={[
          [0, decor.glow, 0.95],
          [0.25, decor.glow, 0.45],
          [1, decor.glow, 0],
        ]}
      />
      <Radial
        id={gid(art, 'spark')}
        stops={[
          [0, '#ffffff', 1],
          [0.3, decor.crystal, 0.6],
          [1, decor.crystal, 0],
        ]}
      />
    </defs>
  );
};

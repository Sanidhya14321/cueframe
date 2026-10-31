import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type FilmDustProps, filmDustDefaults, filmDustMeta, filmDustSchema } from '@/schemas';
import { FilmLayer } from '../../promo/film';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

export const FilmDust = ({
  color,
  dust,
  hairs,
  scratches,
  vignette,
  gateFrames,
  seed,
  look,
  motion,
}: FilmDustProps) => {
  const frame = Math.floor(useCurrentFrame() * motion.speed);
  const { width, height } = useVideoConfig();
  return (
    <PromoLayer look={look} motion={motion}>
      <FilmLayer
        frame={frame}
        width={width}
        height={height}
        color={color}
        dust={dust}
        hairs={hairs}
        scratches={scratches}
        vignette={vignette}
        gateFrames={gateFrames}
        seed={seed}
      />
    </PromoLayer>
  );
};

export const filmDustScene: SceneModule = {
  id: 'film-dust',
  component: FilmDust,
  render: (key) => (
    <Composition
      key={key}
      id="film-dust"
      component={FilmDust}
      schema={filmDustSchema}
      defaultProps={filmDustDefaults}
      durationInFrames={filmDustMeta.durationInFrames}
      fps={filmDustMeta.fps}
      width={filmDustMeta.width}
      height={filmDustMeta.height}
    />
  ),
};

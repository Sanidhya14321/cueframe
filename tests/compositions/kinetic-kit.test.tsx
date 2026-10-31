import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { easedGradient } from '@/compositions/promo/backdrop';
import { FilmLayer, filmMarks } from '@/compositions/promo/film';
import { glowShadow, withAlpha } from '@/compositions/promo/glow';
import { SCRIBBLE_PATHS, Scribble } from '@/compositions/promo/scribble';
import { land, launch } from '@/compositions/promo/timing';
import { highlightSet, linesOf, normalize, wordsOf } from '@/compositions/promo/words';
import { SCRIBBLE_SHAPES } from '@/schemas';

const film = {
  color: '#ffffff',
  dust: 0.6,
  hairs: 0.5,
  scratches: 0.4,
  vignette: 0.5,
  gateFrames: 2,
  seed: 3,
};

describe('film marks', () => {
  it('is deterministic for a frame and fades marks in and out instead of popping', () => {
    expect(filmMarks(film, 10, 1920, 1080)).toEqual(filmMarks(film, 10, 1920, 1080));
    for (let frame = 1; frame < 120; frame++) {
      const before = filmMarks(film, frame - 1, 1920, 1080);
      const after = filmMarks(film, frame, 1920, 1080);
      for (const strand of after.strands) {
        const previous = before.strands.find((item) => item.index === strand.index);
        const change = Math.abs(strand.alpha - (previous?.d === strand.d ? previous.alpha : 0));
        expect(change).toBeLessThan(0.2);
      }
    }
  });

  it('draws nothing when every density is zero', () => {
    const empty = filmMarks({ ...film, dust: 0, hairs: 0, scratches: 0 }, 40, 1920, 1080);
    expect(empty.specks).toHaveLength(0);
    expect(empty.strands).toHaveLength(0);
    expect(empty.lines).toHaveLength(0);
  });

  it('keeps dust inside the frame', () => {
    for (let frame = 0; frame < 60; frame++) {
      for (const speck of filmMarks(film, frame, 1920, 1080).specks) {
        expect(speck.x).toBeGreaterThanOrEqual(0);
        expect(speck.x).toBeLessThanOrEqual(1920);
        expect(speck.y).toBeGreaterThanOrEqual(0);
        expect(speck.y).toBeLessThanOrEqual(1080);
      }
    }
  });
});

describe('kinetic text helpers', () => {
  it('splits words and lines and ignores punctuation in highlights', () => {
    expect(wordsOf('  Save.  Plan. Grow. ')).toEqual(['Save.', 'Plan.', 'Grow.']);
    expect(linesOf('Your Money\n\nYour Rules')).toEqual([
      ['Your', 'Money'],
      ['Your', 'Rules'],
    ]);
    expect(highlightSet('Money!').has(normalize('money,'))).toBe(true);
  });

  it('builds a glow from the strength and drops it at zero', () => {
    expect(glowShadow('#ffffff', 0, 100)).toBe('none');
    expect(glowShadow('#ffffff', 1, 100).split('px').length).toBe(4);
    expect(withAlpha('#ff0000', 2)).toContain('100.0%');
  });

  it('lands and launches without ever creeping under the minimum speed', () => {
    for (const [frames, distance] of [
      [30, 80],
      [20, 28.8],
      [18, 12],
      [40, 400],
    ] as const) {
      expect(land(0, [0, frames], [distance, 0])).toBe(distance);
      expect(land(frames + 5, [0, frames], [distance, 0])).toBe(0);
      expect(launch(0, [0, frames], [0, distance])).toBe(0);
      expect(launch(frames, [0, frames], [0, distance])).toBe(distance);
      let previous: number = distance;
      let previousStep = Number.POSITIVE_INFINITY;
      for (let frame = 1; frame <= frames; frame++) {
        const value = land(frame, [0, frames], [distance, 0]);
        const step = previous - value;
        expect(step).toBeGreaterThanOrEqual(Math.min(1.5, distance / frames) - 0.01);
        expect(step).toBeLessThanOrEqual(previousStep + 1e-9);
        previous = value;
        previousStep = step;
      }
    }
  });

  it('has a path for every scribble shape and eases the vignette stops', () => {
    for (const shape of SCRIBBLE_SHAPES) {
      expect(SCRIBBLE_PATHS[shape].startsWith('M')).toBe(true);
    }
    expect(easedGradient('#000000', '#ffffff').split('color-mix').length).toBe(10);
  });
});

describe('kinetic kit markup', () => {
  it('renders film marks and the vignette as svg over the frame', () => {
    const markup = renderToStaticMarkup(
      <FilmLayer {...film} frame={12} width={1920} height={1080} />,
    );
    expect(markup).toContain('<svg');
    expect(markup).toContain('radial-gradient');
  });

  it('hides the scribble until its head passes its tail', () => {
    const hidden = renderToStaticMarkup(
      <Scribble shape="loop" head={0} tail={0} width={800} strokeWidth={3} color="#fff" />,
    );
    const drawn = renderToStaticMarkup(
      <Scribble shape="loop" head={0.6} tail={0.1} width={800} strokeWidth={3} color="#fff" />,
    );
    expect(hidden).toContain('opacity="0"');
    expect(drawn).toContain('stroke-dasharray="0.5 2"');
  });
});

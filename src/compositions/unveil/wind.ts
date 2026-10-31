import type { UnveilCloth } from '@/schemas';
import { ROTOR_HEIGHT, type Vec3 } from './flight';

const BREEZE: Vec3 = [0.92, 0, -0.38];

export const windAt = (
  x: number,
  y: number,
  z: number,
  seconds: number,
  hook: Vec3,
  cloth: UnveilCloth,
): Vec3 => {
  const gust =
    cloth.gusts *
    (0.55 * Math.sin(seconds * 1.7 + x * 0.21 + y * 0.07) +
      0.3 * Math.sin(seconds * 3.1 - y * 0.33 + x * 0.12) +
      0.15 * Math.sin(seconds * 5.3 + x * 0.5 - y * 0.41));
  const swirl =
    cloth.gusts *
    (0.6 * Math.sin(seconds * 2.3 + y * 0.27 - x * 0.08) +
      0.4 * Math.sin(seconds * 4.1 + x * 0.36 + y * 0.18));
  const strength = cloth.wind * (1 + gust);
  let wx = BREEZE[0] * strength + swirl * 0.8;
  let wy = swirl * 0.35;
  const wz = BREEZE[2] * cloth.wind * 0.4 + (gust * 1.1 + swirl * 0.7) * cloth.wind;
  const below = hook[1] + ROTOR_HEIGHT - y;
  if (below > 0) {
    const dx = x - hook[0];
    const dz = z - hook[2];
    const reach = 5.2 + below * 0.35;
    const radial = Math.sqrt(dx * dx + dz * dz);
    const falloff = Math.exp(-((radial / reach) ** 2)) * Math.exp(-below / 26);
    const flutter = 0.75 + 0.25 * Math.sin(seconds * 9.7 + radial * 1.3);
    const wash = cloth.downwash * falloff * flutter;
    wy -= wash;
    const spread = (wash * 0.45) / Math.max(1, radial);
    wx += dx * spread;
  }
  return [wx, wy, wz];
};

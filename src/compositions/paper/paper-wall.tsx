import { useCanvasTexture } from '../promo/desk/canvas-texture';

const WALL_WIDTH = 16;
const WALL_HEIGHT = 22;
const WALL_DROP = 8;
const GLOW_Y = 4.6;
const GLOW_RADIUS = 5.5;
const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = Math.round((TEXTURE_WIDTH * WALL_HEIGHT) / WALL_WIDTH);

export const PaperWall = ({
  color,
  distance,
  glow,
}: {
  color: string;
  distance: number;
  glow: number;
}) => {
  const map = useCanvasTexture(
    TEXTURE_WIDTH,
    TEXTURE_HEIGHT,
    (context) => {
      const scale = TEXTURE_WIDTH / WALL_WIDTH;
      const centerY = (WALL_HEIGHT - WALL_DROP - GLOW_Y) * scale;
      const gradient = context.createRadialGradient(
        TEXTURE_WIDTH / 2,
        centerY,
        0,
        TEXTURE_WIDTH / 2,
        centerY,
        GLOW_RADIUS * scale,
      );
      const lift = Math.round(255 * Math.min(1, 0.72 + 0.28 * glow));
      gradient.addColorStop(0, `rgb(255, 255, 255)`);
      gradient.addColorStop(0.45, `rgb(${lift}, ${lift}, ${lift})`);
      gradient.addColorStop(1, 'rgb(184, 184, 184)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
    },
    `wall:${glow}`,
  );
  return (
    <mesh position={[0, WALL_HEIGHT / 2 - WALL_DROP, -distance]} receiveShadow>
      <planeGeometry args={[WALL_WIDTH, WALL_HEIGHT]} />
      <meshStandardMaterial color={color} map={map} roughness={0.95} />
    </mesh>
  );
};

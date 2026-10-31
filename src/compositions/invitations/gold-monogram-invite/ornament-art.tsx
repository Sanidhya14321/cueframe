import type { OrnamentLayer } from './ornament';

export const OrnamentArt = ({
  layers,
  color,
  weight = 1,
  draw = 1,
}: {
  layers: OrnamentLayer[];
  color: string;
  weight?: number;
  draw?: number;
}) => (
  <g>
    {layers.map((layer, index) =>
      layer.mode === 'fill' ? (
        <path
          key={index.toString()}
          d={layer.d}
          fill={color}
          fillOpacity={Math.min(1, draw * 1.25)}
        />
      ) : (
        <path
          key={index.toString()}
          d={layer.d}
          fill="none"
          stroke={color}
          strokeWidth={layer.width * weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={draw < 1 ? 1 : undefined}
          strokeDasharray={draw < 1 ? `${Math.max(0.0001, draw).toFixed(4)} 2` : undefined}
        />
      ),
    )}
  </g>
);

import type { Art } from './art';
import { Vine } from './flowers';
import { Bush, Lawn, Mist, Tree } from './foliage';
import { Chandelier, Fireworks, Stars, StringLights } from './night-lights';
import { dark, f, light, memo, mix } from './paint';
import { Layer, type Stage } from './stage';
import { Balustrade, Chhatri, Urn } from './stonework';

const FLOOR_TOP = 1640;

const FLOOR_BOTTOM = 1960;

const ROWS = 9;

const COLUMNS = 12;

const floorPoint = (u: number, v: number): [number, number] => {
  const depth = v ** 1.45;
  const half = 270 + (640 - 270) * depth;
  return [540 + (u - 0.5) * 2 * half, FLOOR_TOP + (FLOOR_BOTTOM - FLOOR_TOP) * depth];
};

const CheckerFloor = ({ art }: { art: Art }) => {
  const cells = memo('checker', () => {
    let path = '';
    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLUMNS; column++) {
        if ((row + column) % 2 === 1) {
          continue;
        }
        const corners = [
          floorPoint(column / COLUMNS, row / ROWS),
          floorPoint((column + 1) / COLUMNS, row / ROWS),
          floorPoint((column + 1) / COLUMNS, (row + 1) / ROWS),
          floorPoint(column / COLUMNS, (row + 1) / ROWS),
        ];
        path += `M${corners.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;
      }
    }
    return path;
  });
  const [leftTop, rightTop, rightBottom, leftBottom] = [
    floorPoint(0, 0),
    floorPoint(1, 0),
    floorPoint(1, 1),
    floorPoint(0, 1),
  ];
  const outline = `M${[leftTop, rightTop, rightBottom, leftBottom].map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;
  return (
    <g>
      <path d={outline} fill={light(art.stone.marble, 0.3)} />
      <path d={cells} fill={art.decor.floor} />
      <path d={outline} fill="none" stroke={dark(art.stone.marble, 0.2)} strokeWidth={4} />
    </g>
  );
};

export const DanceFloorScene = ({ stage }: { stage: Stage }) => {
  const { art } = stage;
  const hills = mix(art.sky, art.leaf.mist, 0.25);
  return (
    <>
      <Stars art={art} count={190} bottom={1400} />
      <Layer stage={stage} order={0} from="fade" distance={60}>
        <path
          d="M0 1500L0 1330Q120 1270 240 1310Q380 1250 520 1320Q660 1260 800 1300Q940 1240 1080 1300L1080 1500Z"
          fill={hills}
          opacity={0.75}
        />
        <Mist art={art} x={200} y={1580} w={560} h={460} seed={91} opacity={0.6} />
        <Mist art={art} x={860} y={1580} w={560} h={430} seed={92} opacity={0.6} />
      </Layer>
      <Fireworks art={art} x={190} y={560} size={110} period={74} phase={10} />
      <Fireworks art={art} x={890} y={500} size={130} period={86} phase={44} />
      <Fireworks art={art} x={780} y={250} size={80} period={66} phase={30} />
      <Layer stage={stage} order={1} from="bottom" distance={200}>
        <Tree
          art={art}
          x={110}
          y={1590}
          trunk={60}
          w={280}
          h={300}
          tone="dark"
          seed={93}
          bloom={art.bloom.rose}
        />
        <Bush
          art={art}
          x={330}
          y={1590}
          w={300}
          h={230}
          tone="deep"
          seed={94}
          bloom={art.bloom.rose}
        />
        <Bush art={art} x={560} y={1590} w={280} h={200} tone="olive" seed={95} />
        <Bush
          art={art}
          x={760}
          y={1590}
          w={300}
          h={250}
          tone="dark"
          seed={96}
          bloom={art.bloom.blossom}
        />
      </Layer>
      <Layer stage={stage} order={1.5} from="right" distance={220}>
        <Chhatri art={art} x={600} y={1600} scale={0.42} dome="round" marble />
        <Chhatri art={art} x={760} y={1600} scale={0.55} dome="round" marble />
        <Chhatri art={art} x={1030} y={1610} scale={1.3} dome="round" marble />
      </Layer>
      <Layer stage={stage} order={2} from="bottom" distance={320}>
        <Lawn art={art} top={1606} seed={97} />
      </Layer>
      <Layer stage={stage} order={2} from="bottom" distance={200}>
        <Balustrade art={art} y={1626} marble />
      </Layer>
      <Layer stage={stage} order={3} from="bottom" distance={340}>
        <CheckerFloor art={art} />
      </Layer>
      <Layer stage={stage} order={4} from="bottom" distance={380}>
        <Urn art={art} x={250} y={1720} size={0.72} seed={98} flower={art.bloom.rose} />
        <Urn art={art} x={830} y={1720} size={0.72} seed={99} flower={art.bloom.rose} />
        <Urn art={art} x={80} y={1830} size={1} seed={100} flower={art.bloom.blossom} />
        <Urn art={art} x={1000} y={1830} size={1} seed={101} flower={art.bloom.blossom} />
      </Layer>
      <Layer stage={stage} order={2.5} from="top" distance={420}>
        <StringLights art={art} from={[-20, 30]} to={[540, 40]} sag={60} />
        <StringLights art={art} from={[540, 40]} to={[1100, 30]} sag={60} phase={1} />
        <StringLights art={art} from={[-20, 150]} to={[360, 120]} sag={50} phase={2} />
        <StringLights art={art} from={[720, 120]} to={[1100, 150]} sag={50} phase={3} />
        <Chandelier art={art} x={540} drop={14} scale={1.55} phase={0} />
        <Chandelier art={art} x={180} drop={70} scale={0.85} phase={1.2} />
        <Chandelier art={art} x={900} drop={70} scale={0.85} phase={2.4} />
      </Layer>
      <Layer stage={stage} order={3} from="left" distance={240}>
        <Vine art={art} x={30} y={-20} length={560} bend={30} seed={102} phase={0.5} size={1.1} />
        <Vine art={art} x={110} y={-20} length={300} bend={-20} seed={103} phase={1.5} />
      </Layer>
      <Layer stage={stage} order={3} from="right" distance={240}>
        <Vine
          art={art}
          x={1050}
          y={-20}
          length={600}
          bend={-30}
          seed={104}
          phase={2.2}
          size={1.1}
        />
        <Vine art={art} x={980} y={-20} length={260} bend={20} seed={105} phase={0.9} />
      </Layer>
    </>
  );
};

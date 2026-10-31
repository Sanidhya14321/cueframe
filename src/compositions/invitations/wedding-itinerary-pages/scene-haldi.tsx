import { fill } from './art';
import { Vine } from './flowers';
import { Agave, Bush, Lawn, Mist, Palm, Tree } from './foliage';
import { BirdCage, Cascade, GiftStack, Sofa } from './haldi-props';
import { Layer, type Stage } from './stage';

const CAGES = [
  { x: 760, chain: 70, size: 0.9, phase: 0.3 },
  { x: 850, chain: 190, size: 1.05, phase: 1.5 },
  { x: 938, chain: 40, size: 0.85, phase: 2.6 },
  { x: 1010, chain: 250, size: 1, phase: 0.9 },
  { x: 700, chain: 280, size: 0.75, phase: 3.4 },
] as const;

const CASCADES = [
  { x: 40, length: 150, seed: 41, phase: 0 },
  { x: 90, length: 230, seed: 42, phase: 0.8 },
  { x: 140, length: 120, seed: 43, phase: 1.7 },
  { x: 190, length: 200, seed: 44, phase: 2.4 },
  { x: 250, length: 110, seed: 45, phase: 3.1 },
] as const;

const SIDE_BOXES = [
  { x: -60, y: 0, w: 120, h: 64, tone: 0, stripes: true },
  { x: -50, y: -64, w: 100, h: 56, tone: 2, stripes: false },
  { x: -40, y: -120, w: 80, h: 50, tone: 1, stripes: true },
] as const;

export const HaldiLoungeScene = ({ stage }: { stage: Stage }) => {
  const { art } = stage;
  return (
    <>
      <Layer stage={stage} order={0} from="fade" distance={80}>
        <Mist art={art} x={200} y={1700} w={620} h={700} seed={51} />
        <Mist art={art} x={760} y={1700} w={640} h={660} seed={52} opacity={0.6} />
      </Layer>
      <Layer stage={stage} order={1} from="left" distance={260}>
        <Palm art={art} x={80} y={1640} height={440} lean={40} seed={53} />
        <Agave art={art} x={250} y={1640} size={220} seed={54} pale={0.2} />
      </Layer>
      <Layer stage={stage} order={1} from="right" distance={260}>
        <Agave art={art} x={880} y={1630} size={230} seed={55} pale={0.65} />
        <path d="M1000 1720L1004 0L1046 0L1060 1720Z" fill={fill(art, 'trunk')} />
        <Bush art={art} x={1040} y={1720} w={210} h={1800} tone="dark" seed={60} kind="rosette" />
        <Vine art={art} x={960} y={300} length={420} bend={-18} seed={61} phase={0.6} />
        <Vine art={art} x={990} y={760} length={300} bend={-14} seed={62} phase={2.1} />
      </Layer>
      <Layer stage={stage} order={2} from="bottom" distance={220}>
        <Tree art={art} x={320} y={1700} trunk={60} w={320} h={340} tone="deep" seed={56} />
        <Tree art={art} x={760} y={1700} trunk={60} w={340} h={380} tone="olive" seed={57} />
        <Bush
          art={art}
          x={560}
          y={1690}
          w={300}
          h={250}
          tone="mid"
          seed={58}
          bloom={art.bloom.marigold}
        />
      </Layer>
      <Layer stage={stage} order={2} from="bottom" distance={300}>
        <Lawn art={art} top={1690} seed={59} />
      </Layer>
      <Layer stage={stage} order={3} from="bottom" distance={260}>
        <GiftStack art={art} x={540} y={1690} scale={1.2} />
        <g transform="translate(540 1850) scale(1.22) translate(-540 -1850)">
          <Sofa art={art} x={540} y={1850} />
        </g>
        <GiftStack art={art} x={250} y={1880} scale={0.95} boxes={SIDE_BOXES} />
        <GiftStack art={art} x={840} y={1880} scale={0.85} boxes={SIDE_BOXES} />
      </Layer>
      <Layer stage={stage} order={4} from="bottom" distance={360}>
        <Bush art={art} x={110} y={1960} w={420} h={250} tone="deep" seed={70} />
        <Bush art={art} x={540} y={1990} w={340} h={120} tone="dark" seed={71} />
        <Bush art={art} x={960} y={1960} w={420} h={260} tone="deep" seed={72} />
      </Layer>
      <Layer stage={stage} order={3} from="top" distance={320}>
        {CAGES.map((cage) => (
          <BirdCage key={cage.x} art={art} {...cage} />
        ))}
      </Layer>
      <Layer stage={stage} order={3.5} from="left" distance={300}>
        <Vine art={art} x={-10} y={-20} length={520} bend={60} seed={46} phase={0.4} size={1.2} />
        <Vine art={art} x={170} y={-20} length={300} bend={-30} seed={47} phase={1.3} />
        {CASCADES.map((cascade) => (
          <Cascade key={cascade.x} art={art} {...cascade} />
        ))}
      </Layer>
    </>
  );
};

import { Rose, Vine } from './flowers';
import { Agave, BigLeaf, Bush, Lawn, Mist, Palm, Tree } from './foliage';
import { light, mix } from './paint';
import { Layer, type Stage } from './stage';
import { Balustrade, Chhatri } from './stonework';

const TOP_ROSES = [
  { x: 36, y: 34, r: 22 },
  { x: 92, y: 14, r: 17 },
  { x: 168, y: 46, r: 19 },
  { x: 250, y: 18, r: 14 },
] as const;

const EdgeLeaves = ({ stage, order }: { stage: Stage; order: number }) => {
  const { art } = stage;
  const tones = [art.leaf.mid, mix(art.leaf.mid, art.leaf.light, 0.5), art.leaf.dark];
  return (
    <>
      <Layer stage={stage} order={order} from="left" distance={220}>
        <BigLeaf
          art={art}
          x={-30}
          y={640}
          angle={-28}
          length={190}
          width={44}
          tone={tones[0] ?? ''}
          phase={0.4}
        />
        <BigLeaf
          art={art}
          x={-24}
          y={980}
          angle={14}
          length={160}
          width={40}
          tone={tones[2] ?? ''}
          phase={1.6}
        />
        <BigLeaf
          art={art}
          x={-20}
          y={1290}
          angle={-48}
          length={200}
          width={50}
          tone={tones[1] ?? ''}
          phase={2.3}
        />
      </Layer>
      <Layer stage={stage} order={order + 0.5} from="right" distance={220}>
        <BigLeaf
          art={art}
          x={1110}
          y={430}
          angle={206}
          length={180}
          width={44}
          tone={tones[1] ?? ''}
          phase={0.9}
        />
        <BigLeaf
          art={art}
          x={1104}
          y={800}
          angle={168}
          length={170}
          width={42}
          tone={tones[0] ?? ''}
          phase={2.8}
        />
        <BigLeaf
          art={art}
          x={1110}
          y={1130}
          angle={214}
          length={150}
          width={38}
          tone={tones[2] ?? ''}
          phase={1.2}
        />
      </Layer>
    </>
  );
};

const RoseCorner = ({ stage, order }: { stage: Stage; order: number }) => {
  const { art } = stage;
  return (
    <Layer stage={stage} order={order} from="top" distance={280}>
      <Vine
        art={art}
        x={20}
        y={-20}
        length={260}
        bend={30}
        seed={3}
        flower={art.bloom.rose}
        phase={0.2}
      />
      <Vine art={art} x={120} y={-20} length={170} bend={-20} seed={5} phase={1.1} />
      <Vine art={art} x={210} y={-20} length={210} bend={24} seed={8} phase={2.1} />
      <Vine art={art} x={300} y={-20} length={90} bend={10} seed={11} phase={0.7} size={0.8} />
      {TOP_ROSES.map((rose, index) => (
        <Rose key={index} x={rose.x} y={rose.y} r={rose.r} color={art.bloom.rose} />
      ))}
    </Layer>
  );
};

export const PavilionsScene = ({ stage }: { stage: Stage }) => {
  const { art } = stage;
  return (
    <>
      <Layer stage={stage} order={0} from="fade" distance={90}>
        <Mist art={art} x={170} y={1580} w={600} h={560} seed={2} />
        <Mist art={art} x={900} y={1580} w={600} h={500} seed={4} />
        <Mist art={art} x={560} y={1580} w={460} h={380} seed={6} opacity={0.5} />
      </Layer>
      <Layer stage={stage} order={1.5} from="fade" distance={120}>
        <Tree art={art} x={70} y={1580} trunk={150} w={260} h={400} tone="mid" seed={7} />
        <Bush art={art} x={300} y={1580} w={280} h={190} tone="dark" seed={8} />
        <Bush art={art} x={560} y={1580} w={300} h={240} tone="deep" seed={9} />
        <Bush art={art} x={800} y={1580} w={280} h={200} tone="dark" seed={10} />
        <Tree art={art} x={1010} y={1580} trunk={120} w={280} h={380} tone="olive" seed={12} />
        <Agave art={art} x={960} y={1585} size={150} seed={13} />
      </Layer>
      <Layer stage={stage} order={2.5} from="left" distance={420}>
        <Palm art={art} x={50} y={1590} height={470} lean={50} seed={14} />
        <Palm art={art} x={170} y={1590} height={340} lean={-24} seed={15} phase={1.4} />
      </Layer>
      <Layer stage={stage} order={0} from="bottom" distance={150}>
        <Chhatri art={art} x={540} y={1578} scale={1.18} />
        <Chhatri art={art} x={268} y={1592} scale={0.68} />
        <Chhatri art={art} x={812} y={1592} scale={0.68} />
      </Layer>
      <Layer stage={stage} order={1} from="bottom" distance={380}>
        <Lawn art={art} top={1598} seed={16} />
      </Layer>
      <Layer stage={stage} order={0} from="bottom" distance={150}>
        <Balustrade art={art} y={1612} />
      </Layer>
      <Layer stage={stage} order={3} from="bottom" distance={300}>
        <Bush
          art={art}
          x={430}
          y={1640}
          w={120}
          h={70}
          tone="dark"
          seed={17}
          bloom={art.bloom.rose}
        />
        <Bush
          art={art}
          x={650}
          y={1640}
          w={120}
          h={70}
          tone="dark"
          seed={18}
          bloom={art.bloom.rose}
        />
      </Layer>
      <Layer stage={stage} order={4} from="bottom" distance={420}>
        <Bush
          art={art}
          x={90}
          y={1950}
          w={360}
          h={280}
          tone="deep"
          seed={19}
          bloom={light(art.bloom.rose, 0.1)}
        />
        <Bush art={art} x={1000} y={1950} w={330} h={330} tone="mid" seed={20} />
        <Bush art={art} x={360} y={1960} w={320} h={200} tone="olive" seed={21} />
        <Bush art={art} x={760} y={1970} w={330} h={240} tone="dark" seed={22} />
        <Bush art={art} x={560} y={1990} w={240} h={130} tone="light" seed={23} />
      </Layer>
      <EdgeLeaves stage={stage} order={2} />
      <RoseCorner stage={stage} order={3.5} />
    </>
  );
};

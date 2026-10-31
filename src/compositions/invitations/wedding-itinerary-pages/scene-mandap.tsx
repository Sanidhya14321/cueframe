import { Blossom, Rose, Vine } from './flowers';
import { Agave, BigLeaf, Bush, Lawn, Mist, Palm, Tree } from './foliage';
import { Carpet, Lattice, Mandap, MarigoldStrand } from './mandap-props';
import { light, mix } from './paint';
import { Layer, type Stage } from './stage';
import { Urn } from './stonework';

const STRANDS = [
  { x: 14, length: 520, seed: 111, phase: 0 },
  { x: 48, length: 380, seed: 112, phase: 0.6 },
  { x: 82, length: 460, seed: 113, phase: 1.2 },
  { x: 116, length: 300, seed: 114, phase: 1.9 },
  { x: 150, length: 400, seed: 115, phase: 2.5 },
  { x: 184, length: 250, seed: 116, phase: 3.1 },
  { x: 218, length: 330, seed: 117, phase: 3.7 },
  { x: 252, length: 190, seed: 118, phase: 4.3 },
  { x: 286, length: 260, seed: 119, phase: 4.9 },
  { x: 320, length: 140, seed: 120, phase: 5.5 },
] as const;

const CORNER_FLOWERS = [
  { x: 1000, y: 40, r: 30, rose: false },
  { x: 1060, y: 110, r: 26, rose: true },
  { x: 930, y: 20, r: 22, rose: true },
  { x: 1040, y: 200, r: 24, rose: false },
  { x: 880, y: 60, r: 18, rose: false },
  { x: 980, y: 150, r: 20, rose: true },
] as const;

export const MandapScene = ({ stage }: { stage: Stage }) => {
  const { art } = stage;
  return (
    <>
      <Layer stage={stage} order={0} from="fade" distance={70}>
        <Mist art={art} x={220} y={1560} w={600} h={540} seed={121} />
        <Mist art={art} x={840} y={1560} w={600} h={500} seed={122} opacity={0.6} />
      </Layer>
      <Layer stage={stage} order={1} from="bottom" distance={200}>
        <Tree art={art} x={140} y={1600} trunk={90} w={280} h={360} tone="olive" seed={123} />
        <Bush art={art} x={400} y={1600} w={300} h={200} tone="dark" seed={124} />
        <Bush art={art} x={680} y={1600} w={300} h={210} tone="deep" seed={125} />
        <Tree art={art} x={940} y={1600} trunk={90} w={300} h={380} tone="dark" seed={126} />
        <Palm art={art} x={60} y={1600} height={380} lean={30} seed={127} />
        <Agave art={art} x={1010} y={1600} size={170} seed={128} />
        <Lattice art={art} top={1500} bottom={1600} />
      </Layer>
      <Layer stage={stage} order={2} from="bottom" distance={300}>
        <Lawn art={art} top={1596} seed={129} />
      </Layer>
      <Layer stage={stage} order={2.5} from="bottom" distance={260}>
        <g transform="translate(540 1790) scale(1.18) translate(-540 -1790)">
          <Mandap art={art} />
        </g>
        <Carpet art={art} />
      </Layer>
      <Layer stage={stage} order={3.5} from="bottom" distance={360}>
        <Urn art={art} x={300} y={1850} size={0.55} seed={130} flower={art.bloom.rose} />
        <Urn art={art} x={780} y={1850} size={0.55} seed={131} flower={art.bloom.rose} />
        <Urn art={art} x={190} y={1920} size={0.72} seed={132} flower={art.bloom.blossom} />
        <Urn art={art} x={890} y={1920} size={0.72} seed={133} flower={art.bloom.blossom} />
        <Bush art={art} x={40} y={1960} w={240} h={220} tone="deep" seed={134} />
        <Bush art={art} x={1040} y={1960} w={240} h={220} tone="deep" seed={135} />
      </Layer>
      <Layer stage={stage} order={3} from="left" distance={360}>
        {STRANDS.map((strand) => (
          <MarigoldStrand key={strand.x} art={art} {...strand} />
        ))}
        <BigLeaf
          art={art}
          x={-20}
          y={760}
          angle={-24}
          length={170}
          width={40}
          tone={art.leaf.mid}
          phase={0.6}
        />
        <BigLeaf
          art={art}
          x={-16}
          y={1120}
          angle={18}
          length={150}
          width={38}
          tone={mix(art.leaf.mid, art.leaf.light, 0.5)}
          phase={2}
        />
      </Layer>
      <Layer stage={stage} order={3} from="right" distance={300}>
        <Vine
          art={art}
          x={1050}
          y={-20}
          length={980}
          bend={-24}
          seed={136}
          phase={0.4}
          size={1.3}
        />
        <Vine
          art={art}
          x={960}
          y={-20}
          length={380}
          bend={-30}
          seed={137}
          phase={1.8}
          flower={art.bloom.blossom}
        />
        {CORNER_FLOWERS.map((flower) =>
          flower.rose ? (
            <Rose key={flower.x} x={flower.x} y={flower.y} r={flower.r} color={art.bloom.rose} />
          ) : (
            <Blossom
              key={flower.x}
              x={flower.x}
              y={flower.y}
              r={flower.r}
              color={light(art.bloom.blossom, 0.1)}
              heart={art.bloom.marigold}
              turn={flower.x / 90}
            />
          ),
        )}
      </Layer>
    </>
  );
};

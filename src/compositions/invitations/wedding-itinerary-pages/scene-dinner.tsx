import { Chair, FloweringTree, Table } from './dinner-props';
import { Vine } from './flowers';
import { BigLeaf, Bush, Lawn, Mist } from './foliage';
import { Chandelier, Stars, StringLights } from './night-lights';
import { mix } from './paint';
import { Layer, type Stage } from './stage';

const HANGING = [
  { x: 820, length: 360, seed: 161, phase: 0.2 },
  { x: 880, length: 560, seed: 162, phase: 1.1 },
  { x: 940, length: 300, seed: 163, phase: 2 },
  { x: 1000, length: 680, seed: 164, phase: 2.8 },
  { x: 1060, length: 460, seed: 165, phase: 3.6 },
] as const;

export const GardenDinnerScene = ({ stage }: { stage: Stage }) => {
  const { art } = stage;
  return (
    <>
      <Stars art={art} count={120} bottom={1300} />
      <Layer stage={stage} order={0} from="fade" distance={60}>
        <Mist art={art} x={180} y={1720} w={600} h={680} seed={166} opacity={0.55} />
        <Mist art={art} x={880} y={1720} w={600} h={640} seed={167} opacity={0.55} />
        <Mist art={art} x={540} y={1720} w={700} h={380} seed={168} opacity={0.4} />
      </Layer>
      <Layer stage={stage} order={1} from="bottom" distance={220}>
        <Bush art={art} x={130} y={1720} w={360} h={400} tone="light" seed={169} />
        <Bush art={art} x={330} y={1720} w={280} h={260} tone="dark" seed={170} />
        <Bush
          art={art}
          x={950}
          y={1720}
          w={380}
          h={380}
          tone="deep"
          seed={171}
          bloom={art.bloom.marigold}
        />
        <Bush art={art} x={760} y={1720} w={260} h={240} tone="olive" seed={172} />
      </Layer>
      <Layer stage={stage} order={1.5} from="bottom" distance={260}>
        <FloweringTree art={art} x={540} y={1720} />
      </Layer>
      <Layer stage={stage} order={2} from="bottom" distance={300}>
        <Lawn art={art} top={1716} seed={173} />
      </Layer>
      <Layer stage={stage} order={2.5} from="bottom" distance={300}>
        <g transform="translate(540 1820) scale(1.3) translate(-540 -1820)">
          {[380, 470, 610, 700].map((x) => (
            <Chair key={x} art={art} x={x} y={1752} scale={0.62} />
          ))}
          <Table art={art} x={540} y={1800} />
          {[330, 450, 630, 750].map((x) => (
            <Chair key={x} art={art} x={x} y={1846} scale={0.8} />
          ))}
        </g>
      </Layer>
      <Layer stage={stage} order={3.5} from="bottom" distance={360}>
        <Bush art={art} x={70} y={1960} w={340} h={300} tone="deep" seed={174} />
        <Bush art={art} x={1010} y={1960} w={360} h={330} tone="mid" seed={175} />
      </Layer>
      <Layer stage={stage} order={2.5} from="top" distance={400}>
        <StringLights art={art} from={[-20, 40]} to={[540, 30]} sag={70} />
        <StringLights art={art} from={[540, 30]} to={[1100, 50]} sag={70} phase={1} />
        <Chandelier art={art} x={230} drop={60} scale={0.62} phase={0.8} />
      </Layer>
      <Layer stage={stage} order={3} from="right" distance={300}>
        {HANGING.map((vine) => (
          <Vine
            key={vine.x}
            art={art}
            x={vine.x}
            y={-20}
            length={vine.length}
            bend={-12}
            seed={vine.seed}
            phase={vine.phase}
            flower={art.bloom.blossom}
          />
        ))}
      </Layer>
      <Layer stage={stage} order={3} from="left" distance={300}>
        <Vine
          art={art}
          x={20}
          y={-20}
          length={640}
          bend={20}
          seed={176}
          phase={1.4}
          flower={art.bloom.rose}
        />
        <BigLeaf
          art={art}
          x={-20}
          y={980}
          angle={-20}
          length={170}
          width={42}
          tone={mix(art.leaf.mid, art.leaf.light, 0.4)}
          phase={0.8}
        />
      </Layer>
    </>
  );
};

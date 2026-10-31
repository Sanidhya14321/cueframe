import { AbsoluteFill, Sequence } from 'remotion';
import type { Project } from '@/project';
import { ElementView } from './element-view';
import { ItemBoundary } from './item-boundary';

export const ProjectComposition = (project: Project) => (
  <AbsoluteFill style={{ backgroundColor: project.background }}>
    {project.tracks.toReversed().map((track) => (
      <AbsoluteFill key={track.id}>
        {track.elements.map((element) => (
          <Sequence
            key={element.id}
            from={element.from}
            durationInFrames={element.durationInFrames}
          >
            <ItemBoundary key={JSON.stringify(element)} id={element.id}>
              <ElementView element={element} />
            </ItemBoundary>
          </Sequence>
        ))}
      </AbsoluteFill>
    ))}
  </AbsoluteFill>
);

import { Composition } from 'remotion';
import { createSeedProject, type Project, projectSchema } from '@/project';
import { ProjectComposition } from './project-composition';

export const PROJECT_COMPOSITION_ID = 'project';

const seed = createSeedProject();

export const ProjectCompositionRegistration = () => (
  <Composition
    id={PROJECT_COMPOSITION_ID}
    component={ProjectComposition}
    schema={projectSchema}
    defaultProps={seed}
    durationInFrames={seed.durationInFrames}
    fps={seed.fps}
    width={seed.width}
    height={seed.height}
    calculateMetadata={({ props }: { props: Project }) => ({
      durationInFrames: props.durationInFrames,
      fps: props.fps,
      width: props.width,
      height: props.height,
    })}
  />
);

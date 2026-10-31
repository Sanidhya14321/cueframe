import { ProjectCompositionRegistration } from './project/register';
import { CLIP_SCENES } from './scenes';

export const RemotionRoot = () => (
  <>
    {CLIP_SCENES.map((scene) => scene.render(scene.id))}
    <ProjectCompositionRegistration />
  </>
);

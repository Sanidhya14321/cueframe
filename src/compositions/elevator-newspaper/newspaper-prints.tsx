import type { ElevatorNewspaperProps } from '@/schemas';
import { readPhoto } from '../footage/photos';
import { TrackedPrint } from '../footage/tracked-print';
import { usePageTexture } from './page-texture';

export const NewspaperPrints = ({ props }: { props: ElevatorNewspaperProps }) => {
  const cover = usePageTexture('cover', props, readPhoto(props.cover.photo));
  const story = usePageTexture('story', props, readPhoto(props.story.photo));
  const { strength, shading } = props.print;
  return (
    <>
      <TrackedPrint name="left" map={cover} strength={strength} shading={shading} />
      <TrackedPrint name="right" map={story} strength={strength} shading={shading} />
    </>
  );
};

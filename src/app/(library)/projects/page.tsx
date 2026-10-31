import { NewProject } from '@/components/clip-timeline/new-project';
import { ProjectsTable } from '@/components/video/projects-table';
import { listProjects } from '@/local/projects';
export const dynamic = 'force-dynamic';
const ProjectsPage = async () => {
  const rows = (await listProjects()).map((project) => ({
    id: project.id,
    title: project.title,
    updated: project.updatedAt.getTime(),
    seconds:
      project.nativeVideo?.duration ?? project.project.durationInFrames / project.project.fps,
    size: `${project.project.width}×${project.project.height}`,
    engine: project.nativeVideo ? 'OpenCut' : 'Animation source',
  }));
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Local projects</h1>
      <NewProject />
      <ProjectsTable rows={rows} />
    </div>
  );
};
export default ProjectsPage;

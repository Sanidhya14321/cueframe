import { NewProject } from '@/components/clip-timeline/new-project';
import { ProjectsTable } from '@/components/video/projects-table';
import { listProjectSummaries } from '@/local/projects';
export const dynamic = 'force-dynamic';
const ProjectsPage = async () => {
  const rows = await listProjectSummaries();
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Projects</h1>
        <NewProject />
      </div>
      <ProjectsTable rows={rows} />
    </div>
  );
};
export default ProjectsPage;

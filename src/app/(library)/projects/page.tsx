import { NewProject } from '@/components/clip-timeline/new-project';
import { ProjectsTable } from '@/components/video/projects-table';
import { listProjectSummaries } from '@/local/projects';
export const dynamic = 'force-dynamic';
const ProjectsPage = async () => {
  const rows = await listProjectSummaries();
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Local projects</h1>
      <NewProject />
      <ProjectsTable rows={rows} />
    </div>
  );
};
export default ProjectsPage;

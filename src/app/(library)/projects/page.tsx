import Link from 'next/link';
import { NewProject } from '@/components/clip-timeline/new-project';
import { listProjects } from '@/local/projects';
export const dynamic = 'force-dynamic';
const ProjectsPage = async () => (
  <div className="mx-auto w-full max-w-3xl p-6">
    <h1 className="mb-6 text-2xl font-semibold">Local projects</h1>
    <NewProject />
    <p className="mb-4 text-sm text-muted-foreground">
      Open a clip from the gallery to start a project, or connect an agent.
    </p>
    <div className="flex flex-col gap-3">
      {(await listProjects()).map((project) => (
        <Link
          className="rounded-lg border p-4 hover:bg-muted"
          key={project.id}
          href={`/video/${project.id}`}
        >
          {project.title}
          <span className="ml-3 text-xs text-muted-foreground">
            {project.nativeVideo
              ? `OpenCut · ${project.nativeVideo.duration.toFixed(1)}s · Revision ${project.nativeVideo.revision}`
              : `Animation source · Revision ${project.revision}`}
          </span>
        </Link>
      ))}
    </div>
  </div>
);
export default ProjectsPage;

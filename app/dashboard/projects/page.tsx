import { getMyProjectsAction } from "./actions";
import ProjectsPageClient from "@/components/dashboard/projects/ProjectsPageClient";
import { Project } from "@/lib/projects/model/project";

export default async function ProjectsPage() {
  const projects: Project[] = await getMyProjectsAction();
  return <ProjectsPageClient projects={projects} />;
}

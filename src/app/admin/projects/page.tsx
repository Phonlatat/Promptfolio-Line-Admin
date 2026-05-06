import { getProjects } from "./actions";
import ProjectsClient from "./projects-client";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects} />;
}

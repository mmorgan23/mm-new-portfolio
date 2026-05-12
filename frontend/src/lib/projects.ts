import projectsFile from '../../../projects_data/projects.json'

export type Project = {
  id: string
  title: string
  description: string
  tech: string[]
  demoUrl?: string
  repoUrl?: string
  image?: string
}

type ProjectsFile = {
  projects: Project[]
}

const data = projectsFile as ProjectsFile

export function listProjects(): Project[] {
  return data.projects
}

export function getProject(id: string): Project | null {
  return data.projects.find((p) => p.id === id) ?? null
}

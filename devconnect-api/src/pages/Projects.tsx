import { Link } from "react-router-dom";
import { mockProjects } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, FolderKanban, ArrowRight } from "lucide-react";

const Projects = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">
            Gérez tous vos projets et leurs phases
          </p>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.reduce((sum, p) => sum + p.memberCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.length > 0
                ? Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des projets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map(project => {
          const totalTickets = project.phases.reduce(
            (sum, phase) => sum + phase.tickets.length,
            0
          );

          return (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg ${project.color} flex items-center justify-center`}>
                    <FolderKanban className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Statistiques */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{project.memberCount} membres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderKanban className="h-4 w-4" />
                    <span>{totalTickets} tickets</span>
                  </div>
                </div>

                {/* Progression */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                {/* Phases */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Phases:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.phases.map(phase => (
                      <div
                        key={phase.id}
                        className="rounded-md bg-accent px-2 py-1 text-xs"
                      >
                        {phase.name} ({phase.tickets.length})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bouton pour voir les détails */}
                <Link to={`/projects/${project.id}`} className="block">
                  <Button className="w-full" variant="outline">
                    Voir les détails
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;

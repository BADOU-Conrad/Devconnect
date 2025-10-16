import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, FolderKanban, Users, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("devconnect_token");
    const userData = localStorage.getItem("devconnect_user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("devconnect_token");
    localStorage.removeItem("devconnect_user");
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  // Mock data
  const stats = {
    projects: 6,
    progress: 72,
    tasks: 24,
    completed: 18
  };

  const mockProjects = [
    { id: 1, name: "Projet A", status: "En cours", progress: 85, tasks: 12 },
    { id: 2, name: "Projet B", status: "En cours", progress: 60, tasks: 8 },
    { id: 3, name: "Projet C", status: "Terminé", progress: 100, tasks: 15 },
    { id: 4, name: "Projet D", status: "En cours", progress: 45, tasks: 10 },
    { id: 5, name: "Projet E", status: "Planifié", progress: 20, tasks: 6 },
    { id: 6, name: "Projet F", status: "En cours", progress: 70, tasks: 9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-medium">
              <span className="text-lg font-bold text-white">DC</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DevConnect
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.email || "Utilisateur"}</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Tableau de bord</h2>
          <p className="text-muted-foreground">Gérez vos projets et suivez votre progression</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-medium hover:shadow-large transition-all cursor-pointer border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projets
              </CardTitle>
              <FolderKanban className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.projects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Projets actifs
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-all cursor-pointer border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progression
              </CardTitle>
              <Clock className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.progress}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Moyenne globale
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-all cursor-pointer border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tâches
              </CardTitle>
              <Users className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.tasks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tâches au total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-all cursor-pointer border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Complétées
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tâches terminées
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Vos Projets</h3>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-medium">
              Nouveau Projet
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project, index) => (
              <Card 
                key={project.id} 
                className="shadow-medium hover:shadow-large transition-all cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <Badge 
                      variant={project.status === "Terminé" ? "default" : "secondary"}
                      className={project.status === "Terminé" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tâches</span>
                    <span className="font-semibold">{project.tasks} tâches</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

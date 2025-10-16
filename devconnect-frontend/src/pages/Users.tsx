import { useState } from "react";
import { mockUsers, mockProjects, currentUser } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit2, Shield } from "lucide-react";
import { toast } from "sonner";

type UserRole = "Admin" | "Developer" | "Designer" | "Product Owner" | "Tester";

const Users = () => {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [users, setUsers] = useState(mockUsers);
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("Developer");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filtrer les utilisateurs par projet
  const filteredUsers = selectedProject === "all"
    ? users
    : users.filter(user => user.projectId === selectedProject);

  // Grouper les utilisateurs par projet
  const usersByProject = mockProjects.map(project => ({
    project,
    users: filteredUsers.filter(user => user.projectId === project.id),
  })).filter(group => group.users.length > 0);

  // Vérifier si l'utilisateur courant est admin du projet
  const isAdminOfProject = (projectId: string): boolean => {
    return currentUser.role === "Admin" && currentUser.projectId === projectId;
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  // Couleur du badge selon le rôle
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "default";
      case "Developer":
        return "secondary";
      case "Designer":
        return "outline";
      case "Product Owner":
        return "default";
      case "Tester":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Ouvrir le dialogue de modification
  const handleEditClick = (user: typeof mockUsers[0]) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsEditDialogOpen(true);
  };

  // Sauvegarder le changement de rôle
  const handleSaveRole = () => {
    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, role: selectedRole }
          : user
      ));
      toast.success(`Le rôle de ${editingUser.name} a été modifié en ${selectedRole}`);
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez tous les utilisateurs classés par projets
          </p>
        </div>

        {/* Filtre par projet */}
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filtrer par projet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les projets</SelectItem>
            {mockProjects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Indicateur du rôle actuel */}
      <Card className="border-primary">
        <CardContent className="flex items-center gap-3 pt-6">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium">
              Connecté en tant que <span className="font-bold">{currentUser.name}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {currentUser.role} - {mockProjects.find(p => p.id === currentUser.projectId)?.name}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByProject.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Développeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredUsers.filter(u => u.role === "Developer").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des utilisateurs groupés par projet */}
      <div className="space-y-6">
        {usersByProject.map(({ project, users: projectUsers }) => {
          const canEdit = isAdminOfProject(project.id);

          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${project.color}`} />
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{projectUsers.length} membre(s)</CardDescription>
                    </div>
                  </div>
                  {canEdit && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Vous êtes Admin
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projectUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                          {canEdit && user.id !== currentUser.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleEditClick(user)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Message si aucun utilisateur */}
      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
          </CardContent>
        </Card>
      )}

      {/* Dialogue de modification du rôle */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rôle de l'utilisateur</DialogTitle>
            <DialogDescription>
              Changez le rôle de {editingUser?.name} dans le projet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-info">Utilisateur</Label>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {editingUser && getInitials(editingUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{editingUser?.name}</p>
                  <p className="text-xs text-muted-foreground">{editingUser?.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Nouveau rôle</Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Product Owner">Product Owner</SelectItem>
                  <SelectItem value="Tester">Tester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveRole}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById, getUsersByProject, Phase, Ticket, currentUser, allAvailableUsers, User, PHASE_COLORS, Comment } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, X, GripVertical, Edit2, UserPlus, Shield, Settings, Send, UserMinus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Composant modal pour les détails du ticket
interface TicketDetailDialogProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (ticketId: string, updates: Partial<Ticket>) => void;
  teamMembers: User[];
  getInitials: (name: string) => string;
  getPriorityColor: (priority: string) => "destructive" | "default" | "secondary" | "outline";
}

const TicketDetailDialog = ({
  ticket,
  isOpen,
  onClose,
  onUpdate,
  teamMembers,
  getInitials,
  getPriorityColor,
}: TicketDetailDialogProps) => {
  const [editedTitle, setEditedTitle] = useState(ticket?.title || "");
  const [editedDescription, setEditedDescription] = useState(ticket?.description || "");
  const [editedPriority, setEditedPriority] = useState<"Low" | "Medium" | "High">(ticket?.priority || "Medium");
  const [newComment, setNewComment] = useState("");

  if (!ticket) return null;

  const handleSave = () => {
    onUpdate(ticket.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
    });
    toast.success("Ticket mis à jour");
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        author: currentUser.name,
        content: newComment,
        createdAt: new Date().toISOString(),
      };
      onUpdate(ticket.id, {
        comments: [...ticket.comments, comment],
      });
      setNewComment("");
      toast.success("Commentaire ajouté");
    }
  };

  const handleAddMember = (memberName: string) => {
    if (!ticket.members.includes(memberName)) {
      onUpdate(ticket.id, {
        members: [...ticket.members, memberName],
      });
      toast.success(`${memberName} ajouté au ticket`);
    }
  };

  const handleRemoveMember = (memberName: string) => {
    onUpdate(ticket.id, {
      members: ticket.members.filter(m => m !== memberName),
    });
    toast.success(`${memberName} retiré du ticket`);
  };

  const availableMembers = teamMembers.filter(
    member => !ticket.members.includes(member.name)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Détails du ticket</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="ticket-title">Titre</Label>
              <Input
                id="ticket-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSave}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea
                id="ticket-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onBlur={handleSave}
                rows={4}
              />
            </div>

            {/* Priorité */}
            <div className="space-y-2">
              <Label htmlFor="ticket-priority">Priorité</Label>
              <Select
                value={editedPriority}
                onValueChange={(value: "Low" | "Medium" | "High") => {
                  setEditedPriority(value);
                  onUpdate(ticket.id, { priority: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">
                    <Badge variant="secondary">Basse</Badge>
                  </SelectItem>
                  <SelectItem value="Medium">
                    <Badge variant="default">Moyenne</Badge>
                  </SelectItem>
                  <SelectItem value="High">
                    <Badge variant="destructive">Haute</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Membres du ticket */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Membres du ticket</Label>
                {availableMembers.length > 0 && (
                  <Select onValueChange={handleAddMember}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Ajouter un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.map(member => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {ticket.members.map((memberName) => {
                  const member = teamMembers.find(m => m.name === memberName);
                  return (
                    <div
                      key={memberName}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                          {getInitials(memberName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{memberName}</span>
                      {member && (
                        <span className="text-xs text-muted-foreground">({member.role})</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => handleRemoveMember(memberName)}
                      >
                        <UserMinus className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
                {ticket.members.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun membre assigné</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Commentaires */}
            <div className="space-y-3">
              <Label>Commentaires ({ticket.comments.length})</Label>

              <div className="space-y-3">
                {ticket.comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                            {getInitials(comment.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{comment.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {ticket.comments.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun commentaire</p>
                )}
              </div>

              {/* Ajouter un commentaire */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="text-xs text-muted-foreground">
              Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant pour un ticket draggable
interface DraggableTicketProps {
  ticket: Ticket;
  phaseId: string;
  onDelete: (phaseId: string, ticketId: string) => void;
  onOpenDetails: (ticket: Ticket) => void;
  getInitials: (name: string) => string;
  getPriorityColor: (priority: string) => "destructive" | "default" | "secondary" | "outline";
}

const DraggableTicket = ({ ticket, phaseId, onDelete, onOpenDetails, getInitials, getPriorityColor }: DraggableTicketProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket.id,
    data: {
      type: "ticket",
      ticket,
      phaseId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className="border-2 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => onOpenDetails(ticket)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm font-medium leading-tight flex-1">
                {ticket.title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-2"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(phaseId, ticket.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <CardDescription className="text-xs line-clamp-2 ml-6">
            {ticket.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={getPriorityColor(ticket.priority)}>
              {ticket.priority === "High" ? "Haute" : ticket.priority === "Medium" ? "Moyenne" : "Basse"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {ticket.createdAt}
            </span>
          </div>
          {ticket.assignee && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getInitials(ticket.assignee)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {ticket.assignee}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant pour une zone de drop (phase)
interface DroppablePhaseProps {
  phase: Phase;
  onDeletePhase: (phaseId: string) => void;
  onEditPhase: (phase: Phase) => void;
  onDeleteTicket: (phaseId: string, ticketId: string) => void;
  onOpenDetails: (ticket: Ticket) => void;
  getInitials: (name: string) => string;
  getPriorityColor: (priority: string) => "destructive" | "default" | "secondary" | "outline";
}

const DroppablePhase = ({ phase, onDeletePhase, onEditPhase, onDeleteTicket, onOpenDetails, getInitials, getPriorityColor }: DroppablePhaseProps) => {
  const { setNodeRef } = useSortable({
    id: phase.id,
    data: {
      type: "phase",
      phase,
    },
  });

  return (
    <div ref={setNodeRef} className="min-w-[320px] flex-shrink-0">
      <Card className={cn("border-2", phase.color)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-base">{phase.name}</CardTitle>
              <CardDescription>{phase.tickets.length} ticket(s)</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEditPhase(phase)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onDeletePhase(phase.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 min-h-[200px]">
          <SortableContext items={phase.tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {phase.tickets.map(ticket => (
              <DraggableTicket
                key={ticket.id}
                ticket={ticket}
                phaseId={phase.id}
                onDelete={onDeleteTicket}
                onOpenDetails={onOpenDetails}
                getInitials={getInitials}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </SortableContext>
          {phase.tickets.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-sm text-muted-foreground">Glissez un ticket ici</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;
  const initialUsers = id ? getUsersByProject(id) : [];

  const [phases, setPhases] = useState<Phase[]>(project?.phases || []);
  const [projectDescription, setProjectDescription] = useState(project?.description || "");
  const [teamMembers, setTeamMembers] = useState<User[]>(initialUsers);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  // État pour le modal de détail du ticket
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false);

  // État pour la modification de description
  const [isEditDescriptionOpen, setIsEditDescriptionOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState(projectDescription);

  // État pour la modification de phase
  const [isEditPhaseOpen, setIsEditPhaseOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [editedPhaseName, setEditedPhaseName] = useState("");
  const [editedPhaseColor, setEditedPhaseColor] = useState("");

  // État pour l'ajout de membre
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<"Admin" | "Developer" | "Designer" | "Product Owner" | "Tester">("Developer");

  // État pour l'ajout de ticket
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });

  // Configuration des sensors pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Vérifier si l'utilisateur courant est admin du projet
  const isAdmin = currentUser.role === "Admin" && currentUser.projectId === id;

  // Obtenir les utilisateurs disponibles (non dans le projet)
  const availableUsers = allAvailableUsers.filter(
    user => !teamMembers.find(member => member.id === user.id)
  );

  if (!project) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Projet non trouvé</h2>
          <p className="text-muted-foreground mt-2">Le projet que vous recherchez n'existe pas.</p>
          <Link to="/projects">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux projets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Ajouter une nouvelle phase
  const handleAddPhase = () => {
    if (newPhaseName.trim()) {
      const newPhase: Phase = {
        id: `phase-${Date.now()}`,
        name: newPhaseName,
        color: "bg-gray-100",
        tickets: [],
      };
      setPhases([...phases, newPhase]);
      setNewPhaseName("");
      setIsAddPhaseOpen(false);
      toast.success(`Phase "${newPhaseName}" ajoutée`);
    }
  };

  // Ouvrir le dialogue de modification de phase
  const handleEditPhaseClick = (phase: Phase) => {
    setEditingPhase(phase);
    setEditedPhaseName(phase.name);
    setEditedPhaseColor(phase.color);
    setIsEditPhaseOpen(true);
  };

  // Sauvegarder les modifications de phase
  const handleSavePhase = () => {
    if (editingPhase && editedPhaseName.trim()) {
      setPhases(phases.map(phase =>
        phase.id === editingPhase.id
          ? { ...phase, name: editedPhaseName, color: editedPhaseColor }
          : phase
      ));
      toast.success(`Phase "${editedPhaseName}" modifiée`);
      setIsEditPhaseOpen(false);
      setEditingPhase(null);
    }
  };

  // Supprimer une phase
  const handleDeletePhase = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    setPhases(phases.filter(phase => phase.id !== phaseId));
    toast.success(`Phase "${phase?.name}" supprimée`);
  };

  // Modifier la description
  const handleSaveDescription = () => {
    setProjectDescription(editedDescription);
    setIsEditDescriptionOpen(false);
    toast.success("Description mise à jour");
  };

  // Ajouter un membre à l'équipe
  const handleAddMember = () => {
    if (selectedUserId) {
      const userToAdd = allAvailableUsers.find(u => u.id === selectedUserId);
      if (userToAdd) {
        // Assigner le projet et le rôle à l'utilisateur
        const updatedUser = { ...userToAdd, projectId: id || "", role: selectedRole };
        setTeamMembers([...teamMembers, updatedUser]);
        setSelectedUserId("");
        setSelectedRole("Developer");
        setIsAddMemberOpen(false);
        toast.success(`${userToAdd.name} a été ajouté à l'équipe en tant que ${selectedRole}`);
      }
    }
  };

  // Supprimer un membre de l'équipe
  const handleRemoveMember = (userId: string) => {
    const user = teamMembers.find(u => u.id === userId);
    if (user && user.id !== currentUser.id) {
      setTeamMembers(teamMembers.filter(u => u.id !== userId));
      toast.success(`${user.name} a été retiré de l'équipe`);
    } else if (user?.id === currentUser.id) {
      toast.error("Vous ne pouvez pas vous retirer vous-même du projet");
    }
  };

  // Ajouter un ticket
  const handleAddTicket = () => {
    if (newTicket.title.trim() && selectedPhaseId) {
      const ticket: Ticket = {
        id: `ticket-${Date.now()}`,
        title: newTicket.title,
        description: newTicket.description,
        assignee: newTicket.assignee || undefined,
        members: [],
        priority: newTicket.priority,
        createdAt: new Date().toISOString().split('T')[0],
        comments: [],
      };

      setPhases(phases.map(phase =>
        phase.id === selectedPhaseId
          ? { ...phase, tickets: [...phase.tickets, ticket] }
          : phase
      ));

      toast.success(`Ticket "${newTicket.title}" ajouté`);
      setNewTicket({ title: "", description: "", assignee: "", priority: "Medium" });
      setSelectedPhaseId("");
      setIsAddTicketOpen(false);
    }
  };

  // Supprimer un ticket
  const handleDeleteTicket = (phaseId: string, ticketId: string) => {
    setPhases(phases.map(phase =>
      phase.id === phaseId
        ? { ...phase, tickets: phase.tickets.filter(t => t.id !== ticketId) }
        : phase
    ));
    toast.success("Ticket supprimé");
  };

  // Ouvrir le modal de détail du ticket
  const handleOpenTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDetailOpen(true);
  };

  // Mettre à jour un ticket
  const handleUpdateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    setPhases(phases.map(phase => ({
      ...phase,
      tickets: phase.tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      ),
    })));

    // Mettre à jour le ticket sélectionné aussi
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, ...updates });
    }
  };

  // Gestion du début du drag
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "ticket") {
      setActiveTicket(activeData.ticket);
    }
  };

  // Gestion de la fin du drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Si on drop sur une autre phase
    if (activeData?.type === "ticket" && overData?.type === "phase") {
      const sourcePhaseId = activeData.phaseId;
      const targetPhaseId = overData.phase.id;

      if (sourcePhaseId !== targetPhaseId) {
        const ticket = activeData.ticket;

        setPhases(phases.map(phase => {
          // Retirer le ticket de la phase source
          if (phase.id === sourcePhaseId) {
            return {
              ...phase,
              tickets: phase.tickets.filter(t => t.id !== ticket.id),
            };
          }
          // Ajouter le ticket à la phase cible
          if (phase.id === targetPhaseId) {
            return {
              ...phase,
              tickets: [...phase.tickets, ticket],
            };
          }
          return phase;
        }));

        const sourcePhaseName = phases.find(p => p.id === sourcePhaseId)?.name;
        const targetPhaseName = phases.find(p => p.id === targetPhaseId)?.name;
        toast.success(`Ticket déplacé de "${sourcePhaseName}" vers "${targetPhaseName}"`);
      }
    }

    // Si on drop sur un autre ticket dans la même phase ou une autre
    if (activeData?.type === "ticket" && overData?.type === "ticket") {
      const sourcePhaseId = activeData.phaseId;
      const targetPhaseId = overData.phaseId;
      const activeTicketId = active.id;
      const overTicketId = over.id;

      if (sourcePhaseId === targetPhaseId) {
        // Réorganiser dans la même phase
        setPhases(phases.map(phase => {
          if (phase.id === sourcePhaseId) {
            const tickets = [...phase.tickets];
            const activeIndex = tickets.findIndex(t => t.id === activeTicketId);
            const overIndex = tickets.findIndex(t => t.id === overTicketId);

            if (activeIndex !== -1 && overIndex !== -1) {
              const [removed] = tickets.splice(activeIndex, 1);
              tickets.splice(overIndex, 0, removed);
            }

            return { ...phase, tickets };
          }
          return phase;
        }));
      } else {
        // Déplacer vers une autre phase
        const ticket = activeData.ticket;

        setPhases(phases.map(phase => {
          if (phase.id === sourcePhaseId) {
            return {
              ...phase,
              tickets: phase.tickets.filter(t => t.id !== ticket.id),
            };
          }
          if (phase.id === targetPhaseId) {
            const tickets = [...phase.tickets];
            const overIndex = tickets.findIndex(t => t.id === overTicketId);
            tickets.splice(overIndex, 0, ticket);
            return { ...phase, tickets };
          }
          return phase;
        }));

        const sourcePhaseName = phases.find(p => p.id === sourcePhaseId)?.name;
        const targetPhaseName = phases.find(p => p.id === targetPhaseId)?.name;
        toast.success(`Ticket déplacé de "${sourcePhaseName}" vers "${targetPhaseName}"`);
      }
    }
  };

  // Obtenir la couleur du badge de priorité
  const getPriorityColor = (priority: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Obtenir les initiales
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${project.color}`} />
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              {isAdmin && (
                <Badge variant="outline" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">{projectDescription}</p>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setEditedDescription(projectDescription);
                    setIsEditDescriptionOpen(true);
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isAddPhaseOpen} onOpenChange={setIsAddPhaseOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une phase
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle phase</DialogTitle>
              <DialogDescription>
                Créez une nouvelle phase pour organiser vos tickets
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="phase-name">Nom de la phase</Label>
                <Input
                  id="phase-name"
                  placeholder="Ex: En cours, Terminé..."
                  value={newPhaseName}
                  onChange={(e) => setNewPhaseName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPhaseOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddPhase}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dialogue de modification de description */}
      <Dialog open={isEditDescriptionOpen} onOpenChange={setIsEditDescriptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la description du projet</DialogTitle>
            <DialogDescription>
              Changez la description de votre projet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description du projet"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDescriptionOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveDescription}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de modification de phase */}
      <Dialog open={isEditPhaseOpen} onOpenChange={setIsEditPhaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la phase</DialogTitle>
            <DialogDescription>
              Changez le nom et la couleur de la phase
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-phase-name">Nom de la phase</Label>
              <Input
                id="edit-phase-name"
                placeholder="Nom de la phase"
                value={editedPhaseName}
                onChange={(e) => setEditedPhaseName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Couleur de la phase</Label>
              <div className="grid grid-cols-3 gap-3">
                {PHASE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setEditedPhaseColor(color.value)}
                    className={cn(
                      "h-16 rounded-lg border-2 transition-all",
                      color.value,
                      editedPhaseColor === color.value
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="text-xs font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPhaseOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSavePhase}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phases.reduce((sum, phase) => sum + phase.tickets.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Équipe */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Équipe du projet</CardTitle>
              <CardDescription>{teamMembers.length} membre(s)</CardDescription>
            </div>
            {isAdmin && (
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter un membre
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un membre à l'équipe</DialogTitle>
                    <DialogDescription>
                      Sélectionnez un utilisateur et son rôle dans le projet
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="user">Utilisateur</Label>
                      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un utilisateur" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers.length > 0 ? (
                            availableUsers.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} - {user.email}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Aucun utilisateur disponible
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle dans le projet</Label>
                      <Select value={selectedRole} onValueChange={(value: "Admin" | "Developer" | "Designer" | "Product Owner" | "Tester") => setSelectedRole(value)}>
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
                    <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddMember} disabled={!selectedUserId}>
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {teamMembers.map(user => (
              <div key={user.id} className="flex items-center gap-2 rounded-lg border p-2 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                {isAdmin && user.id !== currentUser.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2"
                    onClick={() => handleRemoveMember(user.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Board Kanban avec Drag & Drop */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Board Kanban</h2>
          <Dialog open={isAddTicketOpen} onOpenChange={setIsAddTicketOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau ticket</DialogTitle>
                <DialogDescription>
                  Créez un nouveau ticket dans une phase
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phase">Phase</Label>
                  <Select value={selectedPhaseId} onValueChange={setSelectedPhaseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map(phase => (
                        <SelectItem key={phase.id} value={phase.id}>
                          {phase.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    placeholder="Titre du ticket"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description du ticket"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assigné à</Label>
                  <Select
                    value={newTicket.assignee}
                    onValueChange={(value) => setNewTicket({ ...newTicket, assignee: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(user => (
                        <SelectItem key={user.id} value={user.name}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: "Low" | "Medium" | "High") =>
                      setNewTicket({ ...newTicket, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Basse</SelectItem>
                      <SelectItem value="Medium">Moyenne</SelectItem>
                      <SelectItem value="High">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTicketOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddTicket}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            <SortableContext items={phases.map(p => p.id)} strategy={verticalListSortingStrategy}>
              {phases.map(phase => (
                <DroppablePhase
                  key={phase.id}
                  phase={phase}
                  onDeletePhase={handleDeletePhase}
                  onEditPhase={handleEditPhaseClick}
                  onDeleteTicket={handleDeleteTicket}
                  onOpenDetails={handleOpenTicketDetails}
                  getInitials={getInitials}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </SortableContext>

            {phases.length === 0 && (
              <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">Aucune phase. Ajoutez-en une pour commencer.</p>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeTicket ? (
              <Card className="border-2 border-primary w-[288px] opacity-90">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-1" />
                    <CardTitle className="text-sm font-medium leading-tight flex-1">
                      {activeTicket.title}
                    </CardTitle>
                  </div>
                </CardHeader>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modal de détail du ticket */}
      <TicketDetailDialog
        ticket={selectedTicket}
        isOpen={isTicketDetailOpen}
        onClose={() => setIsTicketDetailOpen(false)}
        onUpdate={handleUpdateTicket}
        teamMembers={teamMembers}
        getInitials={getInitials}
        getPriorityColor={getPriorityColor}
      />
    </div>
  );
};

export default ProjectDetails;

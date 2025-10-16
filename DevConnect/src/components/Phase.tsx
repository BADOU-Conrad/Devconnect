import React, { useState } from 'react';

interface Comment {
  id: string;
  text: string;
  timestamp: Date;
}

interface Ticket {
  id: string;
  titre: string;
  description?: string;
  comments?: Comment[];
}

interface PhaseProps {
  titre: string;
  tickets?: Ticket[];
  onTicketsChange?: (tickets: Ticket[]) => void;
  onTicketDrop?: (ticketId: string, fromPhase: string, toPhase: string) => void;
  onTitleChange?: (newTitle: string) => void;
  onPhaseDrop?: (droppedPhaseId: string, targetPhaseId: string) => void;
  phaseId: string;
}

const Phase: React.FC<PhaseProps> = ({ 
  titre, 
  tickets = [], 
  onTicketsChange, 
  onTicketDrop,
  onTitleChange,
  onPhaseDrop,
  phaseId 
}) => {
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [titleValue, setTitleValue] = useState<string>(titre);
  const [draggedOver, setDraggedOver] = useState<boolean>(false);
  
  // Modal states
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTicketTitle, setModalTicketTitle] = useState<string>('');
  const [modalTicketDescription, setModalTicketDescription] = useState<string>('');
  const [modalComments, setModalComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalTicketTitle(ticket.titre);
    setModalTicketDescription(ticket.description || '');
    setModalComments(ticket.comments || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setNewComment('');
    setShowDeleteConfirm(false);
  };

  const saveTicketChanges = () => {
    if (!selectedTicket || !onTicketsChange) return;

    const updatedTickets = tickets.map(ticket =>
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            titre: modalTicketTitle.trim() || ticket.titre,
            description: modalTicketDescription.trim(),
            comments: modalComments
          }
        : ticket
    );

    onTicketsChange(updatedTickets);
    closeModal();
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment.trim(),
      timestamp: new Date()
    };

    setModalComments([...modalComments, comment]);
    setNewComment('');
  };

  const deleteTicket = () => {
    if (!selectedTicket || !onTicketsChange) return;

    const updatedTickets = tickets.filter(ticket => ticket.id !== selectedTicket.id);
    onTicketsChange(updatedTickets);
    closeModal();
  };

  const handleTitleClick = () => {
    setEditingTitle(true);
    setTitleValue(titre);
  };

  const handleTitleSave = () => {
    if (onTitleChange) {
      onTitleChange(titleValue.trim() || titre);
    }
    setEditingTitle(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditingTitle(false);
      setTitleValue(titre);
    }
  };

  const addNewTicket = () => {
    if (!onTicketsChange) return;
    
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      titre: 'Nouveau ticket',
      description: '',
      comments: []
    };
    
    const updatedTickets = [...tickets, newTicket];
    onTicketsChange(updatedTickets);
    
    // Open modal for the new ticket
    setTimeout(() => {
      handleTicketClick(newTicket);
    }, 0);
  };

  const handleTicketDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('ticketId', ticketId);
    e.dataTransfer.setData('sourcePhase', phaseId);
    e.dataTransfer.setData('dragType', 'ticket');
    e.stopPropagation();
  };

  const handlePhaseDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('phaseId', phaseId);
    e.dataTransfer.setData('dragType', 'phase');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    
    const dragType = e.dataTransfer.getData('dragType');
    
    if (dragType === 'ticket') {
      const ticketId = e.dataTransfer.getData('ticketId');
      const sourcePhase = e.dataTransfer.getData('sourcePhase');
      
      if (onTicketDrop && ticketId && sourcePhase !== phaseId) {
        onTicketDrop(ticketId, sourcePhase, phaseId);
      }
    } else if (dragType === 'phase') {
      const droppedPhaseId = e.dataTransfer.getData('phaseId');
      
      if (onPhaseDrop && droppedPhaseId && droppedPhaseId !== phaseId) {
        onPhaseDrop(droppedPhaseId, phaseId);
      }
    }
  };

  return (
    <>
      <article 
        draggable={!editingTitle}
        onDragStart={handlePhaseDragStart}
        className={`rounded-3xl border border-[#496A81]/30 bg-white p-4 shadow-sm transition-all cursor-move ${
          draggedOver ? 'border-[#66999B] bg-[#66999B]/5' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="rounded-2xl border border-[#496A81]/25 p-4">
          {editingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleKeyPress}
              className="mb-4 w-full rounded-lg border border-[#66999B] bg-white px-3 py-1 text-lg font-medium text-[#2B3A67] shadow-sm focus:border-[#66999B] focus:outline-none focus:ring-1 focus:ring-[#66999B]"
              autoFocus
            />
          ) : (
            <h2 
              onClick={handleTitleClick}
              className="mb-4 text-lg font-medium text-[#2B3A67] cursor-pointer hover:bg-[#66999B]/10 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
              title="Cliquez pour modifier le titre"
            >
              {titre}
            </h2>
          )}
          
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                draggable
                onDragStart={(e) => handleTicketDragStart(e, ticket.id)}
                onClick={() => handleTicketClick(ticket)}
                className="w-full cursor-pointer rounded-xl border border-[#496A81]/30 bg-white px-4 py-2 text-left text-[#2B3A67] shadow-sm hover:bg-[#66999B]/10 focus:outline-none focus:ring-2 focus:ring-[#66999B]/50"
                title="Cliquez pour ouvrir, glissez pour déplacer"
              >
                {ticket.titre}
              </button>
            ))}
            <button 
              onClick={addNewTicket}
              className="w-full rounded-xl border border-[#496A81]/30 bg-white px-4 py-2 text-[#2B3A67] shadow-sm hover:bg-[#66999B]/10 focus:outline-none focus:ring-2 focus:ring-[#66999B]/50"
            >
              +
            </button>
          </div>
        </div>
      </article>

      {/* Modal Ticket */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/35" onClick={closeModal}>
          <div className="w-[95vw] max-w-4xl rounded-xl bg-white shadow-2xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#496A81]/25 px-6 py-4">
              <h2 className="text-xl font-semibold text-[#2B3A67]">
                {modalTicketTitle || 'Nouveau ticket'}
              </h2>
              <button className="text-2xl text-[#2B3A67] hover:bg-[#496A81]/10 rounded p-1" onClick={closeModal}>×</button>
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(90vh-140px)]">
              {/* Left Section */}
              <div className="flex-1 p-6 space-y-6">
                {/* Titre */}
                <div>
                  <h3 className="text-sm font-medium text-[#2B3A67] mb-2">Titre</h3>
                  <input
                    type="text"
                    value={modalTicketTitle}
                    onChange={(e) => setModalTicketTitle(e.target.value)}
                    className="w-full rounded-lg border border-[#496A81]/30 bg-white px-3 py-2 text-[#2B3A67] shadow-sm focus:border-[#66999B] focus:outline-none focus:ring-1 focus:ring-[#66999B]"
                    placeholder="Titre du ticket"
                  />
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-[#2B3A67] mb-2">Description</h3>
                  <textarea
                    value={modalTicketDescription}
                    onChange={(e) => setModalTicketDescription(e.target.value)}
                    className="w-full h-32 rounded-lg border border-[#496A81]/30 bg-white px-3 py-2 text-[#2B3A67] shadow-sm focus:border-[#66999B] focus:outline-none focus:ring-1 focus:ring-[#66999B] resize-none"
                    placeholder="Décrivez le ticket..."
                  />
                </div>
              </div>

              {/* Right Section - Comments */}
              <div className="w-full lg:w-80 border-l border-[#496A81]/25 p-6 flex flex-col">
                <h3 className="text-sm font-medium text-[#2B3A67] mb-4">Commentaires</h3>
                
                {/* Comments List */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {modalComments.length === 0 ? (
                    <p className="text-[#496A81]/70 text-sm italic">Aucun commentaire</p>
                  ) : (
                    modalComments.map((comment) => (
                      <div key={comment.id} className="bg-[#66999B]/5 rounded-lg p-3">
                        <p className="text-[#2B3A67] text-sm mb-1">{comment.text}</p>
                        <p className="text-[#496A81]/70 text-xs">
                          {comment.timestamp.toLocaleDateString()} {comment.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="space-y-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addComment();
                      }
                    }}
                    className="w-full h-20 rounded-lg border border-[#496A81]/30 bg-white px-3 py-2 text-[#2B3A67] text-sm shadow-sm focus:border-[#66999B] focus:outline-none focus:ring-1 focus:ring-[#66999B] resize-none"
                    placeholder="Ajouter un commentaire..."
                  />
                  <button
                    onClick={addComment}
                    disabled={!newComment.trim()}
                    className="w-full rounded-lg border border-[#66999B] bg-[#66999B]/15 px-3 py-2 text-[#2B3A67] text-sm hover:bg-[#66999B]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center border-t border-[#496A81]/25 px-6 py-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-2 text-red-600 hover:bg-red-500/25"
              >
                Supprimer le ticket
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-[#496A81]/30 bg-white px-4 py-2 text-[#2B3A67] hover:bg-[#496A81]/5"
                >
                  Annuler
                </button>
                <button
                  onClick={saveTicketChanges}
                  className="rounded-lg border border-[#66999B] bg-[#66999B]/15 px-4 py-2 text-[#2B3A67] hover:bg-[#66999B]/25"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-[#2B3A67] mb-4">Confirmer la suppression</h3>
            <p className="text-[#496A81] mb-6">
              Êtes-vous sûr de vouloir supprimer le ticket "{selectedTicket?.titre}" ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-[#496A81]/30 bg-white px-4 py-2 text-[#2B3A67] hover:bg-[#496A81]/5"
              >
                Annuler
              </button>
              <button
                onClick={deleteTicket}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Phase;
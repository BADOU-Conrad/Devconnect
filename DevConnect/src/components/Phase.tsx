import React, { useState } from 'react';

interface Ticket {
  id: string;
  titre: string;
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
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [titleValue, setTitleValue] = useState<string>(titre);
  const [draggedOver, setDraggedOver] = useState<boolean>(false);

  const handleTicketClick = (ticket: Ticket) => {
    setEditingTicketId(ticket.id);
    setEditingValue(ticket.titre);
  };

  const handleTicketSave = () => {
    if (!editingTicketId || !onTicketsChange) return;
    
    const updatedTickets = tickets.map(ticket =>
      ticket.id === editingTicketId 
        ? { ...ticket, titre: editingValue.trim() || ticket.titre }
        : ticket
    );
    
    onTicketsChange(updatedTickets);
    setEditingTicketId(null);
    setEditingValue('');
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
      if (editingTitle) {
        handleTitleSave();
      } else {
        handleTicketSave();
      }
    } else if (e.key === 'Escape') {
      if (editingTitle) {
        setEditingTitle(false);
        setTitleValue(titre);
      } else {
        setEditingTicketId(null);
        setEditingValue('');
      }
    }
  };

  const addNewTicket = () => {
    if (!onTicketsChange) return;
    
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      titre: 'Nouveau ticket'
    };
    
    const updatedTickets = [...tickets, newTicket];
    onTicketsChange(updatedTickets);
    
    // Automatically start editing the new ticket
    setTimeout(() => {
      setEditingTicketId(newTicket.id);
      setEditingValue(newTicket.titre);
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
    // Only remove drag over state if leaving the entire phase container
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
    <article 
      draggable={!editingTitle && !editingTicketId}
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
            <div key={ticket.id}>
              {editingTicketId === ticket.id ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={handleTicketSave}
                  onKeyDown={handleKeyPress}
                  className="w-full rounded-xl border border-[#66999B] bg-white px-4 py-2 text-[#2B3A67] shadow-sm focus:border-[#66999B] focus:outline-none focus:ring-1 focus:ring-[#66999B]"
                  autoFocus
                />
              ) : (
                <button
                  draggable
                  onDragStart={(e) => handleTicketDragStart(e, ticket.id)}
                  onClick={() => handleTicketClick(ticket)}
                  className="w-full cursor-move rounded-xl border border-[#496A81]/30 bg-white px-4 py-2 text-left text-[#2B3A67] shadow-sm hover:bg-[#66999B]/10 focus:outline-none focus:ring-2 focus:ring-[#66999B]/50"
                  title="Cliquez pour modifier, glissez pour déplacer"
                >
                  {ticket.titre}
                </button>
              )}
            </div>
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
  );
};

export default Phase;
import React, { useState } from 'react';
import Phase from './Phase';

interface Ticket {
  id: string;
  titre: string;
}

interface PhaseData {
  id: string;
  titre: string;
  tickets: Ticket[];
}

const Projet: React.FC = () => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
  const [tempDescription, setTempDescription] = useState<string>('');
  
  const [phases, setPhases] = useState<PhaseData[]>(
    [
      {
        id: 'todo',
        titre: 'To do',
        tickets: [{ id: '1', titre: 'Ticket 1' }]
      },
      {
        id: 'progress',
        titre: 'In Progress',
        tickets: [{ id: '2', titre: 'Ticket 2' }]
      },
      {
        id: 'done',
        titre: 'Done',
        tickets: [{ id: '3', titre: 'Ticket 3' }]
      }
    ]
  );

  const toggleDescription = (): void => {
    setIsDescriptionOpen(prev => !prev);
    // Reset editing state when closing
    if (isDescriptionOpen) {
      setIsEditingDescription(false);
    }
  };

  const startEditingDescription = (): void => {
    setIsEditingDescription(true);
    setTempDescription(description);
  };

  const saveDescription = (): void => {
    setDescription(tempDescription.trim() || description);
    setIsEditingDescription(false);
  };

  const cancelEditingDescription = (): void => {
    setIsEditingDescription(false);
    setTempDescription('');
  };

  const handleDescriptionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      cancelEditingDescription();
    }
    // Note: We don't use Enter to save because it's a textarea
  };

  const handleTicketsChange = (phaseId: string, newTickets: Ticket[]) => {
    setPhases(prevPhases => 
      prevPhases.map(phase => 
        phase.id === phaseId 
          ? { ...phase, tickets: newTickets }
          : phase
      )
    );
  };

  const handleTitleChange = (phaseId: string, newTitle: string) => {
    setPhases(prevPhases => 
      prevPhases.map(phase => 
        phase.id === phaseId 
          ? { ...phase, titre: newTitle }
          : phase
      )
    );
  };

  const handleTicketDrop = (ticketId: string, fromPhase: string, toPhase: string) => {
    const sourcePhase = phases.find(p => p.id === fromPhase);
    const ticketToMove = sourcePhase?.tickets.find(t => t.id === ticketId);
    
    if (!ticketToMove) return;

    setPhases(prevPhases => 
      prevPhases.map(phase => {
        if (phase.id === fromPhase) {
          // Remove ticket from source phase
          return { 
            ...phase, 
            tickets: phase.tickets.filter(t => t.id !== ticketId) 
          };
        } else if (phase.id === toPhase) {
          // Add ticket to target phase
          return { 
            ...phase, 
            tickets: [...phase.tickets, ticketToMove] 
          };
        }
        return phase;
      })
    );
  };

  const handlePhaseDrop = (droppedPhaseId: string, targetPhaseId: string) => {
    const droppedPhaseIndex = phases.findIndex(p => p.id === droppedPhaseId);
    const targetPhaseIndex = phases.findIndex(p => p.id === targetPhaseId);
    
    if (droppedPhaseIndex === -1 || targetPhaseIndex === -1) return;

    const newPhases = [...phases];
    const [droppedPhase] = newPhases.splice(droppedPhaseIndex, 1);
    newPhases.splice(targetPhaseIndex, 0, droppedPhase);
    
    setPhases(newPhases);
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] p-4">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2B3A67]">Projet A</h1>
        <button
          className="rounded-xl border border-[#66999B] bg-[#66999B]/15 px-5 py-2 text-[#2B3A67] shadow-sm hover:bg-[#66999B]/25"
          onClick={toggleDescription}
        >
          Description
        </button>
      </header>

      {/* Container principal pour les cards - 3 par ligne maximum */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase) => (
            <Phase
              key={phase.id}
              phaseId={phase.id}
              titre={phase.titre}
              tickets={phase.tickets}
              onTicketsChange={(newTickets) => handleTicketsChange(phase.id, newTickets)}
              onTitleChange={(newTitle) => handleTitleChange(phase.id, newTitle)}
              onTicketDrop={handleTicketDrop}
              onPhaseDrop={handlePhaseDrop}
            />
          ))}
        </div>
      </div>

      {/* Modale Description */}
      {isDescriptionOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/35" onClick={toggleDescription}>
          <div className="w-[92vw] max-w-[560px] rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#496A81]/25 px-4 py-3">
              <h3 className="m-0 text-lg text-[#2B3A67]">Description</h3>
              <button className="text-2xl text-[#2B3A67]" onClick={toggleDescription} aria-label="Close">×</button>
            </div>
            
            <div className="px-4 py-4">
              {isEditingDescription ? (
                <div className="space-y-3">
                  <textarea
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    onKeyDown={handleDescriptionKeyPress}
                    className="w-full h-32 rounded-lg border border-[#66999B] bg-white px-3 py-2 text-[#2B3A67] shadow-sm focus:border-[#66999B] focus:outline-none focus:ring-1 focus:ring-[#66999B] resize-none"
                    placeholder="Entrez la description du projet..."
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={cancelEditingDescription}
                      className="rounded-lg border border-[#496A81]/30 bg-white px-3 py-2 text-[#2B3A67] hover:bg-[#496A81]/5"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={saveDescription}
                      className="rounded-lg border border-[#66999B] bg-[#66999B]/15 px-3 py-2 text-[#2B3A67] hover:bg-[#66999B]/25"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-3 whitespace-pre-wrap text-[#496A81]/70">
                    {description || 'Ajoutez ici la description du projet.'}
                  </p>
                  <button 
                    onClick={startEditingDescription}
                    className="rounded-lg border border-[#66999B] bg-[#66999B]/15 px-3 py-2 text-[#2B3A67] hover:bg-[#66999B]/25"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex justify-end border-t border-[#496A81]/25 px-4 py-3">
              <button 
                className="rounded-lg border border-[#66999B] bg-[#66999B]/15 px-3 py-2 text-[#2B3A67] hover:bg-[#66999B]/25" 
                onClick={toggleDescription}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projet;
import React, { useState } from 'react';
import type { Persona, PersonaCascade } from '../types';
import { CopyPlusIcon, SparklesIcon, UsersIcon } from './icons';

interface AIForgePanelProps {
    onCreatePersona: (persona: Persona) => void;
    personas: Persona[];
    personaCascades: PersonaCascade[];
    onCreatePersonaCascade: (cascade: PersonaCascade) => void;
}

const AIForgePanel: React.FC<AIForgePanelProps> = ({ onCreatePersona, personas, personaCascades, onCreatePersonaCascade }) => {
    const [newPersona, setNewPersona] = useState<Omit<Persona, 'id' | 'glyph'>>({ name: '', systemInstruction: '' });
    const [newGlyph, setNewGlyph] = useState<string>('');
    const [newCascade, setNewCascade] = useState<{name: string, personas: Persona[]}>({ name: '', personas: []});

    const handleForgePersona = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPersona.name && newGlyph && newPersona.systemInstruction) {
            onCreatePersona({ ...newPersona, glyph: newGlyph, id: `custom-${Date.now()}` });
            setNewPersona({ name: '', systemInstruction: '' });
            setNewGlyph('');
        }
    };

    const handleForgeCascade = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCascade.name && newCascade.personas.length > 0) {
            onCreatePersonaCascade({ ...newCascade, id: `cascade-${Date.now()}`});
            setNewCascade({ name: '', personas: [] });
        }
    };

    const handleCascadePersonaChange = (index: number, personaId: string) => {
        const selectedPersona = personas.find(p => p.id === personaId);
        if (selectedPersona) {
            const updatedPersonas = [...newCascade.personas];
            updatedPersonas[index] = selectedPersona;
            setNewCascade({ ...newCascade, personas: updatedPersonas });
        }
    };

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5" /> AI Forge
            </h3>

            <form onSubmit={handleForgeCascade} className="p-6 border-2 border-dashed border-border rounded-lg space-y-4">
                 <h4 className="text-md font-semibold text-text-main">Forge a New Persona Cascade</h4>
                 <p className="text-sm text-text-muted">Chain up to 5 personas for multi-level strategic reviews. The output of one becomes the input for the next.</p>
                 <input type="text" placeholder="Cascade Name (e.g., 'Full Stack Review')" value={newCascade.name} onChange={e => setNewCascade({...newCascade, name: e.target.value})} className="w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary" required/>
                 <div className="space-y-2">
                     {Array.from({ length: 5 }).map((_, i) => (
                        <select key={i} value={newCascade.personas[i]?.id || ''} onChange={e => handleCascadePersonaChange(i, e.target.value)} className="w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">{`Step ${i+1}: Select Persona`}</option>
                            {personas.map(p => <option key={p.id} value={p.id}>{p.glyph} {p.name}</option>)}
                        </select>
                     ))}
                 </div>
                <button type="submit" className="w-full px-4 py-3 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md flex items-center justify-center gap-2">
                    <UsersIcon className="w-5 h-5" /> Forge Cascade
                </button>
            </form>

            <form onSubmit={handleForgePersona} className="p-6 border-2 border-dashed border-border rounded-lg space-y-4">
                <h4 className="text-md font-semibold text-text-main">Forge a New Assistant Persona</h4>
                <p className="text-sm text-text-muted">Inscribe the core attributes of a new AI assistant. It can then be used in cascades.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input type="text" placeholder="Persona Name (e.g., 'Quantum Poet')" value={newPersona.name} onChange={e => setNewPersona({ ...newPersona, name: e.target.value })} className="sm:col-span-2 w-full bg-surface-alt border border-border rounded-md px-3 py-2" required/>
                    <input type="text" placeholder="Glyph (e.g., ✨)" value={newGlyph} onChange={e => setNewGlyph(e.target.value)} className="w-full bg-surface-alt border border-border rounded-md px-3 py-2" required maxLength={2}/>
                </div>
                <textarea placeholder="System Instruction..." value={newPersona.systemInstruction} onChange={e => setNewPersona({ ...newPersona, systemInstruction: e.target.value })} className="w-full h-32 bg-surface-alt border border-border rounded-md px-3 py-2" required/>
                <button type="submit" className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md flex items-center justify-center gap-2">
                    <CopyPlusIcon className="w-5 h-5" /> Forge Persona
                </button>
            </form>
            
            <div>
                <h4 className="text-md font-semibold text-text-main mb-3">Existing Forges</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {personaCascades.map(c => (
                        <div key={c.id} className="p-3 bg-surface-alt rounded-lg border border-border">
                            <p className="font-bold flex items-center gap-2"><UsersIcon className="w-4 h-4"/> {c.name}</p>
                            <div className="text-xs text-text-muted mt-2 flex items-center gap-1">
                                {c.personas.map((p, i) => <span key={i} title={p.name} className="p-1 bg-surface rounded">{p.glyph}</span>)}
                            </div>
                        </div>
                    ))}
                    {personas.map(p => (
                        <div key={p.id} className="p-3 bg-surface-alt rounded-lg border border-border">
                            <p className="font-bold"><span className="mr-2 text-lg">{p.glyph}</span>{p.name}</p>
                            <p className="text-xs text-text-muted mt-1 italic">"{p.systemInstruction}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIForgePanel;

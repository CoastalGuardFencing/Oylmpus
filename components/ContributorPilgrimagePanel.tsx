import React from 'react';
import type { AppState, PilgrimProfile, RitualLogEntry } from '../types';
import { MapIcon, ScrollTextIcon, SparklesIcon, UserPlusIcon } from './icons';

interface ContributorPilgrimagePanelProps {
    appState: AppState;
    pilgrims: PilgrimProfile[];
    activePilgrimId: string | null;
    onAddPilgrim: (name: string) => void;
    onSelectPilgrim: (id: string) => void;
}

const ContributorPilgrimagePanel: React.FC<ContributorPilgrimagePanelProps> = ({
    appState,
    pilgrims,
    activePilgrimId,
    onAddPilgrim,
    onSelectPilgrim
}) => {
    const { ritualLog, emotionalStateHistory } = appState;
    const activePilgrim = pilgrims.find(p => p.id === activePilgrimId);

    const handleAddPilgrim = () => {
        const name = prompt("Enter the name of the new pilgrim:");
        if (name) {
            onAddPilgrim(name);
        }
    };

    // This is a placeholder since we don't have per-user logs.
    // In a real multi-user system, logs would be associated with users.
    // Here, we'll just show the full system log for any selected pilgrim as a demo.
    const pilgrimRitualLog = ritualLog; 
    const pilgrimEmotionalHistory = emotionalStateHistory;

    const getModulesTouched = (log: RitualLogEntry[]) => {
        const moduleNames = new Set<string>();
        // This is a rough approximation. A real implementation would need better log details.
        log.forEach(entry => {
            if (entry.type === 'task_status_change' || entry.type === 'inscription_creation' || entry.type === 'ai_forging') {
                moduleNames.add('Inscription Deck');
            }
            if (entry.type.startsWith('api_key')) {
                moduleNames.add('API Keys');
            }
            if (entry.type === 'white_paper_generation') {
                moduleNames.add('White Papers');
            }
        });
        return Array.from(moduleNames);
    };
    
    const getGlyphsEarned = (log: RitualLogEntry[]) => {
        return [...new Set(log.map(entry => entry.glyph).filter(Boolean))];
    };
    
    const getEmotionalStates = (history: { state: string; timestamp: number }[]) => {
        return [...new Set(history.map(entry => entry.state))];
    };
    
    const getLineageLedger = (log: RitualLogEntry[]) => {
        return log.filter(entry => 
            entry.type === 'approval' || 
            entry.type === 'white_paper_generation' || 
            entry.type === 'evolution_inscription' ||
            entry.type === 'deployment_initiation'
        ).reverse();
    };

    const modulesTouched = getModulesTouched(pilgrimRitualLog);
    const glyphsEarned = getGlyphsEarned(pilgrimRitualLog);
    const emotionalStates = getEmotionalStates(pilgrimEmotionalHistory);
    const lineageLedger = getLineageLedger(pilgrimRitualLog);

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <MapIcon className="w-5 h-5" /> Contributor Pilgrimage Tracker
                </h3>
                <div className="flex gap-2">
                    <select
                        value={activePilgrimId || ''}
                        onChange={(e) => onSelectPilgrim(e.target.value)}
                        className="bg-surface-alt border border-border rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {pilgrims.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddPilgrim}
                        className="px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md flex items-center gap-2 text-sm"
                    >
                        <UserPlusIcon className="w-4 h-4" /> Onboard Pilgrim
                    </button>
                </div>
            </div>

            {activePilgrim ? (
                <div className="space-y-6">
                    <div className="p-4 bg-surface-alt rounded-lg border border-border">
                        <h4 className="font-bold text-secondary">{activePilgrim.name}</h4>
                        <p className="text-xs text-text-muted">Joined: {new Date(activePilgrim.joinedTimestamp).toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
                            <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2"><MapIcon className="w-4 h-4"/> Pilgrimage Map</h4>
                            <p className="text-xs text-text-muted mb-2">Modules Visited & Authored</p>
                            <div className="space-y-1">
                                {modulesTouched.length > 0 ? modulesTouched.map(moduleName => (
                                    <div key={moduleName} className="text-sm p-2 bg-surface rounded">{moduleName}</div>
                                )) : <p className="text-sm text-text-muted italic">No module interactions logged.</p>}
                            </div>
                        </div>

                        <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
                            <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2"><SparklesIcon className="w-4 h-4"/> Glyph Resonance</h4>
                            <p className="text-xs text-text-muted mb-2">Emotional Glyphs Earned</p>
                            <div className="space-y-1">
                                {glyphsEarned.length > 0 ? glyphsEarned.map(glyphName => (
                                     <div key={glyphName} className="text-sm p-2 bg-surface rounded">{glyphName}</div>
                                )) : <p className="text-sm text-text-muted italic">No glyphs earned yet.</p>}
                            </div>
                             <p className="text-xs text-text-muted mt-4 mb-2">Emotional States Logged</p>
                             <div className="space-y-1">
                                {emotionalStates.length > 0 ? emotionalStates.map(state => (
                                     <div key={state} className="text-sm p-2 bg-surface rounded">{state}</div>
                                )) : <p className="text-sm text-text-muted italic">No emotional states logged.</p>}
                            </div>
                        </div>

                        <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
                            <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2"><ScrollTextIcon className="w-4 h-4"/> Lineage Ledger</h4>
                            <p className="text-xs text-text-muted mb-2">Publishing History & Declarations</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                               {lineageLedger.length > 0 ? lineageLedger.map(entry => (
                                    <div key={entry.timestamp} className="text-xs p-2 bg-surface rounded">
                                        <p className="font-bold">{new Date(entry.timestamp).toLocaleDateString()}</p>
                                        <p>{entry.type.replace(/_/g, ' ')}: {(entry.details as any)?.title || (entry.details as any)?.summary || 'Declaration'}</p>
                                    </div>
                                )) : <p className="text-sm text-text-muted italic">No lineage declared yet.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                    <p className="text-text-muted">Select a pilgrim to view their journey.</p>
                </div>
            )}
        </div>
    );
};

export default ContributorPilgrimagePanel;
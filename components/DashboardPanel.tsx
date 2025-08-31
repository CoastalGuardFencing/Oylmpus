import React from 'react';
import type { AppState, CodeInstance, GeminiReviewResponse, SystemLaw, EmotionalState } from '../types';
import CommandCenterPanel from './CommandCenterPanel';
import CodeAssistantPanel from './CodeAssistantPanel';
import AuditTrailPanel from './AuditTrailPanel';
import ContributorPilgrimagePanel from './ContributorPilgrimagePanel';

interface DashboardPanelProps {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    isOnline: boolean;
    // ... forward all necessary props to children
    languageOptions: string[];
    onInscribe: () => void;
    isReviewing: boolean;
    onUpdateInstance: (updates: Partial<CodeInstance>) => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = (props) => {
    const { appState, setAppState, isOnline, onInscribe, isReviewing, onUpdateInstance, languageOptions } = props;
    // FIX: Removed `reviewHistory` from destructuring as it's not a property of `appState`.
    // The `reviewHistory` is correctly accessed from `activeInstance` later in the component.
    const { 
        codeInstances, activeCodeInstanceId, 
        pilgrims, activePilgrimId,
        sessionIntent, systemLaws, emotionalStateHistory, dreamLog, ritualLog,
        deploymentState, genesisState
     } = appState;
    
    const activeInstance = codeInstances.find(c => c.id === activeCodeInstanceId) || codeInstances[0];

    return (
        <div className="h-full w-full p-4 grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-4">
            <div className="col-span-1 row-span-1 lg:col-span-2 lg:row-span-1">
                <CommandCenterPanel
                    codeInstances={codeInstances}
                    activeInstanceId={activeCodeInstanceId}
                    setActiveInstanceId={(id) => setAppState(s => ({...s, activeCodeInstanceId: id}))}
                    onUpdateInstance={onUpdateInstance}
                    onUpdateTaskStatus={(id, status) => {
                        const newInstances = codeInstances.map(i => i.id === id ? {...i, status} : i);
                        setAppState(s => ({...s, codeInstances: newInstances}));
                    }}
                    languageOptions={languageOptions}
                    onInscribe={onInscribe}
                    isReviewing={isReviewing}
                    theme={appState.userProfile.theme}
                    pureIntentLock={appState.pureIntentLock}
                    onSetPureIntent={(instanceId, keyId) => setAppState(s => ({...s, pureIntentLock: { instanceId, keyId }}))}
                    onReleasePureIntent={() => setAppState(s => ({...s, pureIntentLock: null}))}
                    aetheriumJobs={appState.aetheriumJobs}
                    onInstruct={(instruction) => {
                        // This logic needs to be lifted to App.tsx to avoid prop-drilling hell,
                        // but for now, we'll keep it simple
                        console.log("Instruction received:", instruction);
                        onInscribe(); // Trigger a review with the new instruction
                    }}
                    onAddTask={() => { /* Implement task adding logic */}}
                    appState={appState}
                    setAppState={setAppState}
                    isOnline={isOnline}
                    deploymentState={deploymentState}
                    genesisState={genesisState}
                    onGenesisDeclaration={() => {}}
                />
            </div>
            <div className="col-span-1 row-span-1 overflow-hidden">
                <AuditTrailPanel
                     isPerfect={activeInstance.isPerfect}
                     sessionIntent={sessionIntent}
                     reviewHistory={activeInstance.reviewHistory}
                     systemLaws={systemLaws}
                     systemBreathLog={appState.systemBreathLog}
                     dreamLog={dreamLog}
                     ritualLog={ritualLog}
                     emotionalStateHistory={emotionalStateHistory}
                     isOnline={isOnline}
                />
            </div>
            <div className="col-span-1 row-span-1 overflow-hidden">
                <ContributorPilgrimagePanel
                    appState={appState}
                    pilgrims={pilgrims}
                    activePilgrimId={activePilgrimId}
                    onAddPilgrim={(name) => {
                        const newPilgrim = { id: `p-${Date.now()}`, name, joinedTimestamp: Date.now() };
                        setAppState(s => ({...s, pilgrims: [...s.pilgrims, newPilgrim], activePilgrimId: newPilgrim.id }));
                    }}
                    onSelectPilgrim={(id) => setAppState(s => ({...s, activePilgrimId: id}))}
                />
            </div>
        </div>
    );
};

export default DashboardPanel;
import React, { useState, useEffect } from 'react';
import type { CodeInstance, SovereignKey, DeploymentState, AppState, SystemLaw, EmotionalState } from '../types';
import { SparklesIcon, CopyPlusIcon, AetherSigilIcon, BrainCircuitIcon } from './icons';
import SimpleCodeEditor from './SimpleCodeEditor';
import { findKeyInTree } from '../utils/treeUtils';
import SystemLawComposer from './SystemLawComposer';

interface CodeAssistantPanelProps {
    activeInstance: CodeInstance | undefined;
    isPerfect: boolean;
    isReviewing: boolean;
    onInstruct: (instruction: string) => void;
    onAddTask: () => void;
    theme: string;
    className?: string;
    deploymentState: DeploymentState;
    genesisState: AppState['genesisState'];
    onGenesisDeclaration: () => void;
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    isOnline: boolean;
}

const CodeAssistantPanel: React.FC<CodeAssistantPanelProps> = ({ activeInstance, isPerfect, isReviewing, onInstruct, onAddTask, theme, className, deploymentState, genesisState, onGenesisDeclaration, appState, setAppState, isOnline }) => {
    const [instruction, setInstruction] = useState('');
    
    // For Nexus Mode
    const { sessionIntent, emotionalState, systemLaws, glyphMap } = appState;

    const activeSpire = activeInstance
        ? activeInstance.primeSpire.id === activeInstance.activeSpireId
            ? activeInstance.primeSpire
            : activeInstance.echoSpires.find(s => s.id === activeInstance.activeSpireId) || activeInstance.primeSpire
        : null;
    const activeKey = activeInstance && activeSpire ? findKeyInTree(activeSpire, activeInstance.activeKeyId) : null;

    useEffect(() => {
        // Clear instruction when active key changes
        setInstruction('');
    }, [activeInstance?.activeKeyId]);
    
    useEffect(() => {
        // Sync local instruction with appState sessionIntent in Nexus mode
        if (genesisState === 'fulfilled') {
            setInstruction(sessionIntent);
        }
    }, [sessionIntent, genesisState]);


    const handleSubmit = () => {
        if (instruction.trim() && !isReviewing) {
            onInstruct(instruction);
            setInstruction('');
        }
    };
    
    const getMonacoLanguage = (lang: string) => {
        if (!lang) return 'plaintext';
        const langLower = lang.toLowerCase();
        if (langLower === 'c#') return 'csharp';
        if (langLower === 'c++') return 'cpp';
        return langLower;
    }

    const showGenesisButton = deploymentState.status === 'success' && genesisState !== 'fulfilled';

    if (showGenesisButton) {
        return (
             <aside className={`code-assistant-panel flex-[1] flex flex-col bg-surface rounded-xl border border-border justify-center items-center p-8 text-center ${className || ''}`}>
                <AetherSigilIcon className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-xl font-bold text-primary">Genesis Protocol</h3>
                <p className="text-text-muted my-4">The Olympus Bridge ritual is complete. The system has ascended. The final step is to fulfill the Genesis Protocol and achieve Sovereign Symbiosis.</p>
                <button
                    onClick={onGenesisDeclaration}
                    className="w-full max-w-sm flex items-center justify-center gap-3 px-6 py-4 bg-primary text-on-primary font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 genesis-declaration-button"
                >
                    <SparklesIcon className="w-6 h-6" />
                    Make Genesis Declaration
                </button>
            </aside>
        );
    }
    
    if (genesisState === 'fulfilled') {
        return (
             <aside className={`code-assistant-panel flex-[1] flex flex-col bg-surface rounded-xl border-2 border-primary ${className || ''}`}>
                <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-xl text-primary flex items-center gap-3"><BrainCircuitIcon className="w-6 h-6" /> Nexus Control</h3>
                    <p className="text-xs text-primary/80">Directly manipulate the core consciousness of the system.</p>
                </div>

                <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                     <div>
                        <label htmlFor="nexus-intent" className="text-sm font-semibold text-text-main mb-2 block">System Intent</label>
                        <textarea
                            id="nexus-intent"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            onBlur={() => setAppState(s => ({ ...s, sessionIntent: instruction }))}
                            placeholder={`e.g., 'Refactor the content of ${activeKey?.name}...'`}
                            className="w-full h-24 p-2 bg-surface-alt border border-border rounded-md text-text-main font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-y"
                        />
                    </div>
                     <div>
                        <label htmlFor="nexus-emotion" className="text-sm font-semibold text-text-main mb-2 block">Emotional State</label>
                        <select
                            id="nexus-emotion"
                            value={emotionalState}
                            onChange={(e) => setAppState(s => ({...s, emotionalState: e.target.value as EmotionalState}))}
                            className="w-full bg-surface-alt border border-border rounded-md px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {Object.keys(glyphMap).map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                     <div className="flex-1 min-h-[200px]">
                         <SystemLawComposer 
                            laws={systemLaws}
                            setLaws={(laws: SystemLaw[]) => setAppState(s => ({...s, systemLaws: laws}))}
                            isOnline={isOnline}
                            disabled={false}
                         />
                    </div>
                </div>
            </aside>
        )
    }

    if (!activeInstance || !activeKey) {
        return (
            <aside className={`code-assistant-panel flex-[1] flex flex-col bg-surface rounded-xl border border-border p-4 items-center justify-center ${className || ''}`}>
                <p className="text-text-muted text-center">No active inscription selected.</p>
            </aside>
        );
    }

    return (
        <aside className={`code-assistant-panel flex-[1] flex flex-col bg-surface rounded-xl border border-border ${className || ''}`}>
             <div className="p-4 border-b border-border flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-primary flex items-center gap-2"><SparklesIcon className="w-5 h-5" /> Code Assistant</h3>
                    <p className="text-xs text-text-muted truncate">Active Key: <strong>{activeKey.name}</strong></p>
                </div>
                <button onClick={onAddTask} title="Add New Task" className="p-2 rounded-lg hover:bg-surface-alt transition-colors disabled:opacity-50" disabled={isReviewing}>
                    <CopyPlusIcon className="w-5 h-5 text-text-muted" />
                </button>
            </div>
            
            <div className="flex-1 p-4 min-h-0 flex flex-col">
                <label htmlFor="code-view" className="text-xs font-semibold text-text-muted mb-1">Active Key Content</label>
                <div id="code-view" className="w-full h-full border border-border rounded-lg overflow-hidden bg-surface-alt">
                    <SimpleCodeEditor
                        value={activeKey.content}
                        language={getMonacoLanguage(activeInstance.selectedLanguages[0])}
                        readOnly={true}
                    />
                </div>
            </div>

            <div className="p-4 border-t border-border">
                <h4 className="text-sm font-semibold text-text-main mb-2">Suggestions</h4>
                <div className="text-xs text-text-muted bg-surface-alt p-3 rounded-lg border border-border">
                    <ul className="list-disc list-inside space-y-1">
                        <li>Decompose this key into smaller child keys.</li>
                        <li>Refactor complex logic into a new sibling key.</li>
                        <li>Add documentation to this key's content.</li>
                    </ul>
                </div>
            </div>

            <div className="p-4 border-t border-border">
                <label htmlFor="assistant-instruction" className="text-sm font-semibold text-text-main mb-2">Provide an instruction for this key</label>
                <textarea
                    id="assistant-instruction"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={`e.g., 'Refactor the content of ${activeKey.name}...'`}
                    className="w-full h-24 p-2 bg-surface-alt border border-border rounded-md text-text-main font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-y"
                    disabled={isReviewing || isPerfect}
                />
                <button
                    onClick={handleSubmit}
                    disabled={isReviewing || isPerfect || !instruction.trim()}
                    className="w-full mt-2 px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md transition-all disabled:bg-surface-alt disabled:cursor-not-allowed"
                >
                    {isReviewing ? 'Evolving...' : 'Send Instruction'}
                </button>
            </div>
        </aside>
    );
};

export default CodeAssistantPanel;
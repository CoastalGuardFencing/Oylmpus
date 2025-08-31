import React, { useState, useEffect } from 'react';
import type { CodeInstance, SovereignKey, AppState, AetheriumJob, SystemLaw, EmotionalState } from '../types';
import LanguageSelector from './LanguageSelector';
import CodeEditor from './CodeEditor';
import { CodeIcon, TerminalIcon, SparklesIcon, CopyPlusIcon, AetherSigilIcon, BrainCircuitIcon } from './icons';
import { findKeyInTree, updateKeyInTree } from '../utils/treeUtils';
import PreviewPanel from './PreviewPanel';
import SystemLawComposer from './SystemLawComposer';

// Combined props from original CommandCenterPanel and CodeAssistantPanel
interface UnifiedComposerPanelProps {
    codeInstances: CodeInstance[];
    activeInstanceId: number;
    setActiveInstanceId: (id: number) => void;
    onUpdateInstance: (updates: Partial<CodeInstance>) => void;
    onUpdateTaskStatus: (id: number, status: CodeInstance['status']) => void;
    languageOptions: string[];
    onInscribe: () => void;
    isReviewing: boolean;
    theme: string;
    pureIntentLock: AppState['pureIntentLock'];
    onSetPureIntent: (instanceId: number, keyId: string) => void;
    onReleasePureIntent: () => void;
    aetheriumJobs: AetheriumJob[];
    isViewerMode?: boolean;
    // Props from CodeAssistantPanel
    onInstruct: (instruction: string) => void;
    onAddTask: () => void;
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    isOnline: boolean;
    deploymentState: AppState['deploymentState'];
    genesisState: AppState['genesisState'];
    onGenesisDeclaration: () => void;
}

const StatusPill: React.FC<{ status: CodeInstance['status'] }> = ({ status }) => {
    const statusStyles: Record<CodeInstance['status'], string> = {
        pending: 'bg-text-muted/20 text-text-muted',
        active: 'bg-primary/20 text-primary',
        perfected: 'bg-success/20 text-success',
        archived: 'bg-surface-alt text-text-muted/50',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};


const KeyNode: React.FC<{ node: SovereignKey; activeKeyId: string; onSelectKey: (keyId: string) => void; level?: number; disabled?: boolean; }> = ({ node, activeKeyId, onSelectKey, level = 0, disabled }) => {
    const isActive = node.id === activeKeyId;
    return (
        <div>
            <button
                onClick={() => onSelectKey(node.id)}
                disabled={disabled}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-surface-alt'} disabled:cursor-not-allowed`}
                style={{ paddingLeft: `${0.5 + level * 1}rem` }}
            >
                <CodeIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-sm">{node.name}</span>
            </button>
            {node.children.length > 0 && (
                <div>
                    {node.children.map(child => (
                        <KeyNode key={child.id} node={child} activeKeyId={activeKeyId} onSelectKey={onSelectKey} level={level + 1} disabled={disabled} />
                    ))}
                </div>
            )}
        </div>
    );
};

const UnifiedComposerPanel: React.FC<UnifiedComposerPanelProps> = (props) => {
    const {
        codeInstances, activeInstanceId, setActiveInstanceId, onUpdateInstance, onUpdateTaskStatus,
        languageOptions, onInscribe, isReviewing, theme, pureIntentLock, onSetPureIntent, onReleasePureIntent, aetheriumJobs,
        isViewerMode = false, onInstruct, onAddTask, appState, setAppState, isOnline,
        deploymentState, genesisState, onGenesisDeclaration
    } = props;
    
    const activeInstance = codeInstances.find(c => c.id === activeInstanceId) || codeInstances[0];
    const { sessionIntent, emotionalState, systemLaws, glyphMap } = appState;
    
    const activeSpire = activeInstance.primeSpire.id === activeInstance.activeSpireId 
        ? activeInstance.primeSpire
        : activeInstance.echoSpires.find(s => s.id === activeInstance.activeSpireId) || activeInstance.primeSpire;

    const activeKey = findKeyInTree(activeSpire, activeInstance.activeKeyId);
    
    const [instruction, setInstruction] = useState('');
    useEffect(() => { setInstruction(''); }, [activeInstance?.activeKeyId]);

    const handleCodeChange = (code: string) => {
        if (!activeKey || isViewerMode) return;
        const newActiveSpire = updateKeyInTree(activeSpire, activeKey.id, { content: code });
        const isPrime = activeInstance.activeSpireId === activeInstance.primeSpire.id;
        onUpdateInstance({
            primeSpire: isPrime ? newActiveSpire : activeInstance.primeSpire,
            echoSpires: isPrime ? activeInstance.echoSpires : activeInstance.echoSpires.map(s => s.id === activeInstance.activeSpireId ? newActiveSpire : s)
        });
    };

    const getMonacoLanguage = (lang: string) => {
        if (!lang) return 'plaintext';
        const langLower = lang.toLowerCase();
        if (langLower === 'c#') return 'csharp';
        if (langLower === 'c++') return 'cpp';
        return langLower;
    };

    const handleInstructionSubmit = () => {
        if (instruction.trim() && !isReviewing) {
            onInstruct(instruction);
            setInstruction('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface/50 rounded-xl border border-border/50">
            <div className="flex-shrink-0 p-4 border-b border-border bg-surface rounded-t-xl">
                 <h2 className="text-xl font-bold text-primary">Composer Canvas</h2>
                 <p className="text-sm text-text-muted">A unified interface for inscription, guidance, and manifestation.</p>
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-4 min-h-0 p-4">
                {/* --- Column 1: Tasks & Key Spire --- */}
                <aside className="col-span-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-text-main">Inscription Tasks</h3>
                        <div className="space-y-3 overflow-y-auto pr-2 max-h-48">
                            {codeInstances.map(instance => (
                                 <div key={instance.id} onClick={() => !isViewerMode && setActiveInstanceId(instance.id)} className={`p-3 rounded-lg border transition-all ${activeInstanceId === instance.id ? 'bg-surface-alt border-primary shadow-lg' : 'bg-surface border-border'} ${isViewerMode ? 'cursor-default' : 'hover:border-border/70 cursor-pointer'}`}>
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-text-main">{instance.name}</h4>
                                        <StatusPill status={instance.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="flex-1 flex flex-col gap-2 min-h-0">
                        <h4 className="text-sm font-semibold text-text-muted flex items-center gap-2"><TerminalIcon className="w-4 h-4"/> Key Spire</h4>
                        <div className="flex-1 overflow-y-auto bg-surface-alt border border-border rounded-lg p-2">
                            <KeyNode node={activeSpire} activeKeyId={activeInstance.activeKeyId} onSelectKey={(id) => onUpdateInstance({ activeKeyId: id })} disabled={isViewerMode} />
                        </div>
                    </div>
                </aside>

                {/* --- Column 2: Editor & Preview --- */}
                <main className="col-span-1 flex flex-col gap-4 min-h-0">
                     <div className="flex-[3] min-h-0 bg-surface-alt border border-border rounded-lg overflow-hidden">
                        <CodeEditor value={activeKey?.content || ''} onChange={handleCodeChange} language={getMonacoLanguage(activeInstance.selectedLanguages[0])} readOnly={isReviewing || isViewerMode} />
                    </div>
                    <div className="flex-[2] min-h-0">
                         <PreviewPanel />
                    </div>
                </main>

                {/* --- Column 3: AI Assistant --- */}
                <aside className="col-span-1 flex flex-col bg-surface rounded-xl border border-border">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-primary flex items-center gap-2"><SparklesIcon className="w-5 h-5" /> Code Assistant</h3>
                            <p className="text-xs text-text-muted truncate">Active Key: <strong>{activeKey?.name}</strong></p>
                        </div>
                        <button onClick={onAddTask} title="Add New Key" className="p-2 rounded-lg hover:bg-surface-alt transition-colors disabled:opacity-50" disabled={isReviewing || isViewerMode}>
                            <CopyPlusIcon className="w-5 h-5 text-text-muted" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 min-h-0 flex flex-col">
                        <label htmlFor="assistant-instruction" className="text-sm font-semibold text-text-main mb-2">Provide an instruction for this key</label>
                        <textarea
                            id="assistant-instruction"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder={`e.g., 'Refactor ${activeKey?.name} for clarity...'`}
                            className="w-full h-24 p-2 bg-surface-alt border border-border rounded-md text-text-main font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-y"
                            disabled={isReviewing || isViewerMode}
                        />
                        <button
                            onClick={handleInstructionSubmit}
                            disabled={isReviewing || isViewerMode || !instruction.trim()}
                            className="w-full mt-2 px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md transition-all disabled:bg-surface-alt disabled:cursor-not-allowed"
                        >
                            {isReviewing ? 'Evolving...' : 'Send Instruction'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};
export default UnifiedComposerPanel;

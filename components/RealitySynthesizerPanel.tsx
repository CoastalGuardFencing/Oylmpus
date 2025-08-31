import React from 'react';
import type { AppState, RitualLogEntry, RitualLogDetailsPayload, PersonaCreationDetails, IdentityCreationDetails, TransferDetails, MarketTradeDetails, GenericDetails, SovereigntyViolationDetails, EvolutionInscriptionDetails, ApprovalDetails, TaskStatusChangeDetails, ApiKeyGenerationDetails, InscriptionCreationDetails } from '../types';
import { ZapIcon, FingerprintIcon, CheckCircleIcon, BrainCircuitIcon, CopyPlusIcon, ListChecksIcon, Share2Icon } from './icons';

interface RealitySynthesizerPanelProps {
    appState: AppState;
}

const getGlyphSymbol = (glyphName: string, glyphMap: AppState['glyphMap']): string => {
    const found = Object.values(glyphMap).find(g => g.name === glyphName);
    return found ? found.symbol : '?';
};

const RitualLogDetails: React.FC<{ entry: RitualLogEntry, glyphMap: AppState['glyphMap'] }> = ({ entry, glyphMap }) => {
    const details = entry.details as RitualLogDetailsPayload;
    const glyphSymbol = getGlyphSymbol(entry.glyph, glyphMap);

    const renderDetails = () => {
        if (typeof details === 'string') {
            return <span>{details}</span>;
        }

        switch (entry.type) {
            case 'persona_creation':
                const persona = details as PersonaCreationDetails;
                return <span><CopyPlusIcon className="w-3 h-3 inline mr-1"/> Spawned new assistant: <strong>{persona.name}</strong></span>;
            case 'inscription_creation':
                const inscription = details as InscriptionCreationDetails;
                return <span><CopyPlusIcon className="w-3 h-3 inline mr-1"/> Forged new inscription: <strong>{inscription.name}</strong></span>;
            case 'identity_creation':
                const { wallet } = details as IdentityCreationDetails;
                return <span><FingerprintIcon className="w-3 h-3 inline mr-1"/> Established identity: <strong>{wallet.address}</strong></span>;
            case 'approval':
                 const approval = details as ApprovalDetails;
                 return <span><CheckCircleIcon className="w-3 h-3 inline mr-1"/> Affirmed Declaration: <strong>{approval.title}</strong></span>;
            case 'api_key_generation':
                 const apiKey = details as ApiKeyGenerationDetails;
                 return <span><BrainCircuitIcon className="w-3 h-3 inline mr-1"/> Generated API Key for <strong>{apiKey.manifest}</strong></span>;
            case 'task_status_change':
                 const task = details as TaskStatusChangeDetails;
                 return <span><ListChecksIcon className="w-3 h-3 inline mr-1"/> Task <strong>'{task.taskName}'</strong> moved from {task.fromStatus} to {task.toStatus}.</span>;
            case 'sovereignty_violation':
                const violation = details as SovereigntyViolationDetails;
                return <span className="text-warning"><strong>Sovereignty Violation:</strong> {violation.violation}</span>
            case 'social_post':
                 return <span><Share2Icon className="w-3 h-3 inline mr-1"/> Published to social feed.</span>
            default:
                 const generic = details as GenericDetails;
                 const summary = generic.summary || (typeof details === 'object' ? Object.keys(details).join(', ') : String(details));
                 return <span><strong>{entry.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {summary}</span>;
        }
    }

    return (
        <div className="flex items-start gap-4 p-4 bg-surface-alt/70 border border-border/50 rounded-lg animate-fade-in-slide-up">
            <div className="text-4xl text-primary glyph-pulse" title={entry.glyph} style={{animationDelay: `${Math.random() * 2}s`}}>
                {glyphSymbol}
            </div>
            <div className="flex-1">
                <p className="font-semibold text-text-main"><RitualLogDetails entry={entry} glyphMap={glyphMap} /></p>
                <p className="text-xs text-text-muted mt-1">{new Date(entry.timestamp).toLocaleString()}</p>
            </div>
        </div>
    );
}

const RealitySynthesizerPanel: React.FC<RealitySynthesizerPanelProps> = ({ appState }) => {
    const { ritualLog, emotionalState, glyphMap } = appState;
    const reversedLog = [...ritualLog].reverse();
    
    // Normalize emotional state for class name
    const emotionalStateClass = `resonant-background-${emotionalState.charAt(0).toUpperCase() + emotionalState.slice(1)}`;

    return (
        <div className={`h-full p-6 overflow-hidden flex flex-col transition-all duration-1000 ${emotionalStateClass}`}>
            <div className="flex-shrink-0">
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <ZapIcon className="w-5 h-5" /> Reality Synthesizer
                </h3>
                <p className="text-sm text-text-muted mb-4">
                    The mythos is alive. A real-time stream of the system's lineage, glyphs, and emotional resonance.
                </p>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {reversedLog.map((entry, index) => (
                    <div key={entry.timestamp} style={{ animationDelay: `${index * 100}ms`}}>
                        <RitualLogDetails entry={entry} glyphMap={glyphMap} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RealitySynthesizerPanel;
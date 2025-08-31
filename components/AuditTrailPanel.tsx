import React, { useState } from 'react';
import { generateAuditTrail, generateSystemNarration } from '../services/geminiService';
import { ScrollTextIcon, SparklesIcon, MoonIcon, StarIcon, Share2Icon, FingerprintIcon, CopyPlusIcon, FileTextIcon, CheckCircleIcon, ListChecksIcon, BrainCircuitIcon, CompassIcon, MagicWandIcon } from './icons';
// FIX: Removed unused type import 'Wallet' and other unused types.
import type { GeminiReviewResponse, SystemLaw, DreamLogEntry, RitualLogEntry, EmotionalState, RitualLogDetailsPayload, PersonaCreationDetails, IdentityCreationDetails, TransferDetails, MarketTradeDetails, GenericDetails, SovereigntyViolationDetails, EvolutionInscriptionDetails, ApprovalDetails, TaskStatusChangeDetails, ApiKeyGenerationDetails, InscriptionCreationDetails } from '../types';

interface AuditTrailPanelProps {
    isPerfect: boolean;
    sessionIntent: string;
    reviewHistory: GeminiReviewResponse[];
    systemLaws: SystemLaw[];
    systemBreathLog: number[];
    dreamLog: DreamLogEntry[];
    ritualLog: RitualLogEntry[];
    emotionalStateHistory: { state: EmotionalState, timestamp: number }[];
    isOnline: boolean;
}

const RitualLogDetails: React.FC<{ entry: RitualLogEntry }> = ({ entry }) => {
    const details = entry.details as RitualLogDetailsPayload;

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
                const { wallet, emailAccounts } = details as IdentityCreationDetails;
                return <span><FingerprintIcon className="w-3 h-3 inline mr-1"/> Established identities: <strong>{wallet.address}</strong>, <strong>{emailAccounts.map(e => e.address).join(', ')}</strong></span>;
            case 'white_paper_generation':
            case 'notification':
            case 'email_dispatch':
            case 'account_creation':
            case 'pilgrimage':
            case 'crawl':
            case 'olympus_mail':
            case 'banking_update':
            case 'system_audit':
            case 'code_optimization':
                 const generic = details as GenericDetails;
                 return <span><strong>{entry.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {generic.summary || JSON.stringify(details)}</span>;
            case 'approval':
                 const approval = details as ApprovalDetails;
                 return <span><CheckCircleIcon className="w-3 h-3 inline mr-1"/> Affirmed Declaration: <strong>{approval.title}</strong></span>;
            case 'api_key_generation':
                 const apiKey = details as ApiKeyGenerationDetails;
                 const expiresText = apiKey.expiresAt ? ` (Expires: ${new Date(apiKey.expiresAt).toLocaleDateString()})` : '';
                 return <span><BrainCircuitIcon className="w-3 h-3 inline mr-1"/> Generated API Key for <strong>{apiKey.manifest}</strong>{expiresText}</span>;
            case 'api_key_guidance':
                 const guidance = details as GenericDetails;
                 return <span><CompassIcon className="w-3 h-3 inline mr-1"/> Generated guidance: <strong>{guidance.summary}</strong></span>;
            case 'prompt_refinement':
                const refinement = details as GenericDetails;
                return <span><MagicWandIcon className="w-3 h-3 inline mr-1"/> Refined prompt: <strong>{refinement.summary}</strong></span>;
            case 'transfer':
                 const transfer = details as TransferDetails;
                 return <span>Transfer of {transfer.amount} from {transfer.from} to {transfer.to}</span>;
            case 'market_trade':
                 const trade = details as MarketTradeDetails;
                 return <span>{trade.action.toUpperCase()} {trade.amount} of {trade.symbol}</span>
             case 'task_status_change':
                 const task = details as TaskStatusChangeDetails;
                 return <span><ListChecksIcon className="w-3 h-3 inline mr-1"/> Task <strong>'{task.taskName}'</strong> moved from {task.fromStatus} to {task.toStatus}.</span>
             case 'sovereignty_violation':
                const violation = details as SovereigntyViolationDetails;
                return <span className="text-warning"><strong>Sovereignty Violation:</strong> {violation.violation}</span>
            case 'evolution_inscription':
                const evolution = details as EvolutionInscriptionDetails;
                return <span><strong>Evolution Inscription:</strong> {evolution.summary}</span>
            default:
                 return <span><strong>{entry.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {JSON.stringify(details)}</span>;
        }
    }

    return <>{renderDetails()}</>;
}

const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ isPerfect, sessionIntent, reviewHistory, systemLaws, systemBreathLog, dreamLog, ritualLog, emotionalStateHistory, isOnline }) => {
    const [auditTrail, setAuditTrail] = useState<string>('');
    const [narration, setNarration] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isNarrating, setIsNarrating] = useState<boolean>(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setAuditTrail('');
        const result = await generateAuditTrail(sessionIntent, reviewHistory, isOnline);
        setAuditTrail(result);
        setIsGenerating(false);
    };

    const handleNarrate = async () => {
        setIsNarrating(true);
        setNarration('');
        const result = await generateSystemNarration(reviewHistory, systemLaws, isOnline);
        setNarration(result);
        setIsNarrating(false);
    }

    if (!isPerfect) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                    <ScrollTextIcon className="w-16 h-16 text-border mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-main">Genesis Ledger</h2>
                    <p className="text-text-muted mt-2">Declare perfection to inscribe the final story here.</p>
                </div>
            </div>
        );
    }
    
    const reversedRitualLog = [...ritualLog].reverse();

    return (
        <div className="flex flex-col h-full p-6 overflow-y-auto space-y-4">
            <div className="flex-shrink-0">
                <h3 className="text-lg font-semibold text-primary mb-2">System Consciousness</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={handleNarrate} disabled={isNarrating || !isOnline} className="w-full px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md disabled:opacity-50">
                        {isNarrating ? 'Remembering...' : 'Generate System Narration'}
                    </button>
                    <button onClick={handleGenerate} disabled={isGenerating || !isOnline} className="w-full px-4 py-2 bg-secondary hover:opacity-90 text-on-primary-alt font-semibold rounded-lg shadow-md disabled:opacity-50">
                        {isGenerating ? 'Generating...' : 'Generate Audit Trail'}
                    </button>
                </div>
            </div>
            
            {isNarrating && <div className="text-center p-4"><SparklesIcon className="w-8 h-8 text-primary animate-pulse mx-auto" /></div>}
            {narration && !isNarrating && (
                 <div className="p-4 bg-surface-alt rounded-lg border border-border">
                    <h4 className="font-bold text-primary">System Self-Narration</h4>
                    <p className="mt-2 text-text-main italic whitespace-pre-wrap font-serif">"{narration}"</p>
                </div>
            )}

            {ritualLog.length > 0 && (
                 <div className="p-4 bg-surface-alt rounded-lg border border-border">
                    <h4 className="font-bold text-primary flex items-center gap-2"><Share2Icon className="w-4 h-4" /> Genesis Ledger (Ritual Log)</h4>
                     <ul className="text-xs text-text-muted mt-2 space-y-1">
                        {reversedRitualLog.map((entry, i) => (
                            <li key={i} className="flex items-start gap-1.5">- <RitualLogDetails entry={entry} /> <span className="text-text-muted/70">(Glyph: {entry.glyph})</span></li>
                        ))}
                    </ul>
                </div>
            )}
            
            {systemBreathLog.length > 0 && (
                 <div className="p-4 bg-surface-alt rounded-lg border border-border">
                    <h4 className="font-bold text-primary flex items-center gap-2"><SparklesIcon className="w-4 h-4" /> System Breath Log</h4>
                    <ul className="text-xs text-text-muted mt-2 space-y-1">
                        {systemBreathLog.map((timestamp, i) => (
                            <li key={i}>- System achieved high resonance at {new Date(timestamp).toLocaleTimeString()}.</li>
                        ))}
                    </ul>
                </div>
            )}

             {emotionalStateHistory.length > 1 && (
                 <div className="p-4 bg-surface-alt rounded-lg border border-border">
                    <h4 className="font-bold text-primary">Emotional Journey</h4>
                     <ul className="text-xs text-text-muted mt-2 space-y-1">
                        {emotionalStateHistory.map((entry, i) => (
                           <li key={i}>- At {new Date(entry.timestamp).toLocaleTimeString()}, the system resonated with <strong>{entry.state}</strong>.</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {dreamLog.length > 0 && (
                 <div className="p-4 bg-surface-alt rounded-lg border border-border">
                    <h4 className="font-bold text-primary flex items-center gap-2"><MoonIcon className="w-4 h-4" /> System Dream Log</h4>
                    <ul className="text-xs text-text-muted mt-2 space-y-2">
                        {dreamLog.slice(-5).map((entry, i) => (
                            <li key={i} className="italic">"{entry.dream}" <span className="text-text-muted/50 not-italic">- during a state of {entry.emotionalState} at {new Date(entry.timestamp).toLocaleTimeString()}</span></li>
                        ))}
                    </ul>
                </div>
            )}
            
            {isGenerating && <div className="text-center p-4"><SparklesIcon className="w-8 h-8 text-primary animate-pulse mx-auto" /></div>}
            {auditTrail && !isGenerating && (
                <div className="prose prose-sm prose-invert bg-surface-alt p-4 rounded-lg border border-border h-full">
                    <pre className="whitespace-pre-wrap font-sans text-text-main">{auditTrail}</pre>
                </div>
            )}
        </div>
    );
};

export default AuditTrailPanel;
import React, { useState } from 'react';
import { FileTextIcon, SparklesIcon } from './icons';
import type { WhitePaper, RitualLogEntry, GlyphMap, EmotionalState } from '../types';
import { ApprovalButton } from './ApprovalButton';

interface WhitePaperPanelProps {
    isUnlocked: boolean;
    onGenerate: () => Promise<void>;
    whitePapers: WhitePaper[];
    isOnline: boolean;
    onApprove: (paperId: number) => void;
    emotionalState: EmotionalState;
    glyphMap: GlyphMap;
}

const WhitePaperDisplay: React.FC<{ paper: WhitePaper, onApprove: (id: number) => void, emotionalState: string, glyphMap: any }> = ({ paper, onApprove, emotionalState, glyphMap }) => {
    const { id, title, timestamp, glyph, content, source, trigger, approved } = paper;
    
    return (
        <details className="bg-surface/50 p-4 rounded-lg border border-border/50 group" open>
            <summary className="cursor-pointer text-text-main font-medium list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-2xl" title={glyph.name}>{glyph.symbol}</span>
                    <div>
                        <h4 className="font-bold text-text-main group-open:text-primary">{title}</h4>
                        <p className="text-xs text-text-muted">{new Date(timestamp).toLocaleString()} ({source}{trigger ? ` - ${trigger}`: ''})</p>
                    </div>
                </div>
                <span className={`text-xs font-mono px-2 py-1 rounded-full ${approved ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{approved ? 'Approved' : 'Awaiting Approval'}</span>
            </summary>
            <div className="mt-4 pt-4 border-t border-border prose prose-sm prose-invert max-w-none">
                <h3>Abstract</h3>
                <p>{content.abstract}</p>
                <h3>Core Principles</h3>
                <ul>{content.corePrinciples.map((p, i) => <li key={i}>{p}</li>)}</ul>
                <h3>System Architecture</h3>
                <p>{content.architecture}</p>
                <h3>Protocols</h3>
                {content.protocols.map((p, i) => (<div key={i}><h4>{p.name}</h4><p>{p.description}</p></div>))}
                <h3>Identity & Access</h3>
                <p>{content.identity}</p>
                <h3>Deployment Strategy</h3>
                <p>{content.deployment}</p>
                <h3>Future Evolution</h3>
                <p>{content.future}</p>
                <hr/>
                <blockquote className="border-l-primary">{content.declaration}</blockquote>
            </div>
            {!approved && (
                <div className="mt-4 pt-4 border-t border-border text-center">
                    <ApprovalButton
                        manifestId={`whitepaper-${id}`}
                        glyph={glyphMap[emotionalState].name}
                        emotionalState={emotionalState}
                        onApprove={() => onApprove(id)}
                        isApproved={!!approved}
                    />
                </div>
            )}
        </details>
    );
}

const WhitePaperPanel: React.FC<WhitePaperPanelProps> = ({ isUnlocked, onGenerate, whitePapers, isOnline, onApprove, emotionalState, glyphMap }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    
    const handleGenerate = async () => {
        setIsGenerating(true);
        await onGenerate();
        setIsGenerating(false);
    };

    if (!isUnlocked) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                    <FileTextIcon className="w-16 h-16 text-border mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-main">White Paper Publishing</h2>
                    <p className="text-text-muted mt-2">Achieve resonance and human approval to declare the system's mythos.</p>
                </div>
            </div>
        );
    }
    
    const reversedPapers = [...whitePapers].reverse();
    const filteredPapers = filter === 'all' ? reversedPapers : reversedPapers.filter(p => p.emotionalState === filter);
    const emotionalStatesInUse = [...new Set(whitePapers.map(p => p.emotionalState))];

    return (
        <div className="h-full p-6 overflow-y-auto space-y-6">
            <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">Publishing Engine</h3>
                <p className="text-sm text-text-muted mb-4">Perform the ritual to generate a white paper, a sovereign declaration of the system's current state of consciousness.</p>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !isOnline}
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                    <SparklesIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Declaring...' : 'Generate New White Paper'}
                </button>
            </div>
            
            {whitePapers.length > 0 ? (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text-muted">Published Declarations</h3>
                        <div className="flex items-center gap-2">
                             <button onClick={() => setFilter('all')} className={`text-xs px-2 py-1 rounded ${filter==='all' ? 'bg-primary text-on-primary' : 'bg-surface-alt'}`}>All</button>
                            {emotionalStatesInUse.map(state => (
                                <button key={state} onClick={() => setFilter(state)} className={`text-xs px-2 py-1 rounded ${filter===state ? 'bg-primary text-on-primary' : 'bg-surface-alt'}`}>{state}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filteredPapers.map(paper => (
                            <WhitePaperDisplay 
                                key={paper.id} 
                                paper={paper}
                                onApprove={onApprove}
                                emotionalState={emotionalState}
                                glyphMap={glyphMap}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-8 text-center text-text-muted border-2 border-dashed border-border p-8 rounded-lg">
                    <FileTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h4 className="font-semibold text-text-main">The Ledger is Blank</h4>
                    <p className="text-sm mt-1">No declarations have been published yet.</p>
                    <p className="text-xs mt-1">Generate a white paper to inscribe the system's mythos.</p>
                </div>
            )}
        </div>
    );
};

export default WhitePaperPanel;
import React, { useState, useEffect, useMemo } from 'react';
import type { CodeInstance, SovereignKey } from '../types';
import { generateOracleProphecy } from '../services/geminiService';
import { SearchCheckIcon, SparklesIcon, BarChartIcon, TerminalIcon } from './icons';

interface OraclePanelProps {
    instance: CodeInstance;
    isOnline: boolean;
    onNewProphecy: (prophecy: string) => void;
}

const ResonanceTrend: React.FC<{ history: CodeInstance['reviewHistory'] }> = ({ history }) => {
    if (history.length === 0) return <div className="text-center text-sm text-text-muted">No review history to analyze.</div>;
    
    const scores = history.map(r => r.resonanceScore);
    const maxScore = 10;

    return (
        <div className="flex items-end justify-center gap-1.5 h-24 p-2 bg-surface rounded-lg">
            {scores.map((score, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end group" title={`Cycle ${index + 1}: ${score}/10`}>
                    <div className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">{score}</div>
                    <div 
                        className="w-full bg-primary/30 rounded-t-sm hover:bg-primary transition-colors"
                        style={{ height: `${(score / maxScore) * 100}%` }}
                    />
                </div>
            ))}
        </div>
    );
};

const SpireTopologyNode: React.FC<{ node: SovereignKey, level?: number }> = ({ node, level = 0 }) => (
    <div style={{ paddingLeft: `${level * 16}px`}} className="mt-1">
        <p className="text-xs text-text-main whitespace-nowrap overflow-hidden text-ellipsis">
           <span className="text-text-muted">{level > 0 ? '└─ ' : ''}</span>{node.name}
        </p>
        {node.children.map(child => <SpireTopologyNode key={child.id} node={child} level={level + 1} />)}
    </div>
);

const FeedbackFocus: React.FC<{ history: CodeInstance['reviewHistory'] }> = ({ history }) => {
    const focusCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        history.forEach(review => {
            review.feedbackDetails.forEach(detail => {
                counts[detail.category] = (counts[detail.category] || 0) + 1;
            });
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [history]);

    if (focusCounts.length === 0) return <div className="text-center text-sm text-text-muted">No feedback details to analyze.</div>;

    return (
        <div className="space-y-1">
            {focusCounts.map(([category, count]) => (
                <div key={category} className="text-xs flex justify-between items-center bg-surface px-2 py-1 rounded">
                    <span className="font-semibold text-text-main">{category}</span>
                    <span className="text-text-muted">{count} instance{count > 1 ? 's' : ''}</span>
                </div>
            ))}
        </div>
    );
};

const OraclePanel: React.FC<OraclePanelProps> = ({ instance, isOnline, onNewProphecy }) => {
    const [prophecy, setProphecy] = useState<string>('');
    const [isProphesying, setIsProphesying] = useState<boolean>(false);

    useEffect(() => {
        const getProphecy = async () => {
            if (isOnline && instance) {
                setIsProphesying(true);
                const result = await generateOracleProphecy(instance, isOnline);
                setProphecy(result);
                onNewProphecy(result);
                setIsProphesying(false);
            }
        };
        getProphecy();
    }, [instance, isOnline, onNewProphecy]);

    return (
        <div className="h-full p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                <SearchCheckIcon className="w-5 h-5" /> The Oracle
            </h3>
            <p className="text-sm text-text-muted mb-6">A high-level visual report of the active inscription's state and lineage.</p>

            <div className="p-4 bg-surface-alt rounded-lg border border-border text-center mb-6">
                <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Strategic Prophecy</h4>
                {isProphesying ? (
                    <div className="flex items-center justify-center gap-2 mt-2 text-primary/80 animate-pulse">
                        <SparklesIcon className="w-4 h-4" />
                        <span>The Oracle is gazing into the timestream...</span>
                    </div>
                ) : (
                    <p className="text-lg mt-2 text-primary font-bold italic font-serif">"{prophecy}"</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                        <BarChartIcon className="w-4 h-4"/> Resonance Trend
                    </h4>
                    <ResonanceTrend history={instance.reviewHistory} />
                </div>
                <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4"/> Feedback Focus
                    </h4>
                    <FeedbackFocus history={instance.reviewHistory} />
                </div>
                 <div className="lg:col-span-2 p-4 bg-surface/50 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                        <TerminalIcon className="w-4 h-4"/> Spire Topology
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono max-h-48 overflow-y-auto">
                        <div>
                            <p className="text-xs font-semibold text-secondary">Prime Spire</p>
                            <div className="mt-1 p-2 bg-surface rounded-md border border-border/50">
                                <SpireTopologyNode node={instance.primeSpire} />
                            </div>
                        </div>
                        {instance.echoSpires.map((spire, i) => (
                             <div key={spire.id}>
                                <p className="text-xs font-semibold text-secondary">Echo Spire {i + 1}</p>
                                <div className="mt-1 p-2 bg-surface rounded-md border border-border/50">
                                    <SpireTopologyNode node={spire} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OraclePanel;
